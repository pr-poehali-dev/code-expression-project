import { useState, useEffect } from "react";
import { useLkAuth } from "@/contexts/LkAuthContext";
import Icon from "@/components/ui/icon";
import {
  StaffMember, AuditResult, HistoryItem,
  ACCENT, LK_URL, sid,
  newMember, saveStaffDraft, loadStaffDraft, clearStaffDraft,
} from "./staffAuditTypes";
import { AuditResultView } from "./StaffAuditResultView";
import { MemberForm } from "./StaffMemberForm";
import ToolUsageBadge from "@/components/ToolUsageBadge";

export default function LkStaffAudit() {
  const { user } = useLkAuth();
  const [staff, setStaff] = useState<StaffMember[]>([]);
  const [staffLoaded, setStaffLoaded] = useState(false);
  const [hasDraft, setHasDraft] = useState(false);
  const [result, setResult] = useState<AuditResult | null>(null);
  const [step, setStep] = useState<"form" | "loading" | "result">("form");
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    // Загружаем историю анализов
    fetch(`${LK_URL}?action=staff_audit_history`, { headers: { "X-Session-Id": sid() } })
      .then(r => r.json()).then(d => Array.isArray(d) && setHistory(d)).catch(() => {});

    // Загружаем сотрудников из базы; если нет — проверяем черновик
    fetch(`${LK_URL}?action=staff_list`, { headers: { "X-Session-Id": sid() } })
      .then(r => r.json()).then(d => {
        if (Array.isArray(d) && d.length > 0) {
          const draft = loadStaffDraft();
          const serverStaff = d.map((s: Record<string, unknown>) => ({
            id:                  String(s.id),
            name:                String(s.name || ""),
            role:                String(s.role || ""),
            experience:          s.experience != null ? String(s.experience) : "",
            clients_count:       s.clients_count != null ? String(s.clients_count) : "",
            new_clients:         s.new_clients != null ? String(s.new_clients) : "",
            return_pct:          s.return_pct != null ? String(s.return_pct) : "",
            revenue:             s.revenue != null ? String(s.revenue) : "",
            avg_check:           s.avg_check != null ? String(s.avg_check) : "",
            has_upsell:          s.has_upsell != null ? Boolean(s.has_upsell) : null,
            rebooking_pct:       s.rebooking_pct != null ? String(s.rebooking_pct) : "",
            has_rebooking_offer: s.has_rebooking_offer != null ? Boolean(s.has_rebooking_offer) : null,
            service_score:       s.service_score != null ? String(s.service_score) : "",
            has_sales_script:    s.has_sales_script != null ? Boolean(s.has_sales_script) : null,
          }));
          if (draft && draft.length > 0 && draft.some(m => m.name)) {
            setStaff(draft);
            setHasDraft(true);
          } else {
            setStaff(serverStaff);
          }
        } else {
          const draft = loadStaffDraft();
          if (draft && draft.length > 0 && draft.some(m => m.name)) {
            setStaff(draft);
            setHasDraft(true);
          } else {
            setStaff([newMember()]);
          }
        }
        setStaffLoaded(true);
      }).catch(() => {
        const draft = loadStaffDraft();
        setStaff(draft && draft.length > 0 ? draft : [newMember()]);
        if (draft) setHasDraft(true);
        setStaffLoaded(true);
      });
  }, []);

  // Автосохранение черновика при каждом изменении
  useEffect(() => {
    if (staffLoaded && step === "form") saveStaffDraft(staff);
  }, [staff, staffLoaded, step]);

  function updateMember(id: string, key: keyof StaffMember, val: string | boolean) {
    setStaff(p => p.map(m => m.id === id ? { ...m, [key]: val } : m));
  }

  async function handleAnalyze() {
    const filled = staff.filter(m => m.name && m.revenue);
    if (filled.length === 0) { setError("Заполните данные хотя бы одного сотрудника (имя и выручка обязательны)"); return; }
    setStep("loading"); setError("");
    try {
      const res = await fetch(`${LK_URL}?action=staff_analyze`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "X-Session-Id": sid() },
        body: JSON.stringify({ staff: filled }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "Ошибка анализа"); setStep("form"); return; }
      clearStaffDraft();
      setHasDraft(false);
      setResult(data.result);
      setStep("result");
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Ошибка. Попробуйте ещё раз.");
      setStep("form");
    }
  }

  if (step === "result" && result) {
    return <AuditResultView result={result} onReset={() => { setStep("form"); setResult(null); }} />;
  }

  if (step === "loading") {
    return (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: 360, gap: 20 }}>
        <style>{`@keyframes pulse{0%,100%{opacity:1}50%{opacity:0.4}} @keyframes spin{to{transform:rotate(360deg)}}`}</style>
        <div style={{ width: 64, height: 64, borderRadius: 18, background: `linear-gradient(135deg,hsl(0,75%,50%),hsl(20,90%,55%))`, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Icon name="Users" size={30} style={{ color: "#fff", animation: "pulse 1.5s ease infinite" }} />
        </div>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 18, fontWeight: 700, color: "#0F172A", marginBottom: 8 }}>Считаю показатели команды...</div>
          <div style={{ fontSize: 13, color: "#888", lineHeight: 1.7 }}>Рассчитываю Employee Score, потери и потенциал роста.<br />Обычно 15–30 секунд.</div>
        </div>
        <div style={{ display: "flex", gap: 6 }}>
          {[0,1,2].map(i => <div key={i} style={{ width: 8, height: 8, borderRadius: "50%", background: "hsl(0,75%,50%)", animation: `pulse 1.2s ease ${i*0.2}s infinite` }} />)}
        </div>
      </div>
    );
  }

  if (!staffLoaded) {
    return <div style={{ display: "flex", justifyContent: "center", padding: 60 }}><Icon name="Loader" size={24} style={{ color: ACCENT, animation: "spin 1s linear infinite" }} /></div>;
  }

  const dbStaff = staff.filter(m => m.id && !m.id.startsWith("_"));
  const hasDbStaff = dbStaff.length > 0;

  return (
    <div style={{ maxWidth: 700 }}>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>

      {/* Заголовок */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
          <div style={{ width: 40, height: 40, borderRadius: 12, background: `linear-gradient(135deg,hsl(0,75%,50%),hsl(20,90%,55%))`, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Icon name="Users" size={20} style={{ color: "#fff" }} />
          </div>
          <h2 style={{ fontSize: "clamp(18px,2.5vw,24px)", fontWeight: 700, color: "#0F172A", margin: 0 }}>Анализ персонала</h2>
        </div>
        <p style={{ fontSize: 13, color: "#64748B", margin: "0 0 12px", lineHeight: 1.6 }}>
          Данные сотрудников загружены из раздела «Сотрудники». Проверьте и запустите анализ.
        </p>
        <div style={{ padding: "12px 16px", background: "hsl(0,75%,97%)", borderRadius: 12, border: "1px solid hsl(0,75%,88%)", marginBottom: 4 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: "#0F172A", marginBottom: 6 }}>Как пользоваться и почему это выгодно</div>
          <div style={{ fontSize: 13, color: "#475569", lineHeight: 1.7 }}>
            Нажмите «Запустить анализ» — ИИ оценит каждого сотрудника по ключевым показателям и выдаст конкретные рекомендации.<br />
            Многие владельцы не знают, кто из команды реально тянет бизнес, а кто тормозит. Анализ помогает увидеть это объективно — и принять верные управленческие решения без конфликтов.
          </div>
        </div>
      </div>

      {/* Баннер восстановленного черновика */}
      {hasDraft && (
        <div style={{ display: "flex", alignItems: "center", gap: 10, background: "hsl(40,90%,96%)", border: "1px solid hsl(40,90%,82%)", borderRadius: 12, padding: "11px 16px", marginBottom: 16 }}>
          <Icon name="RotateCcw" size={15} style={{ color: "hsl(40,90%,40%)", flexShrink: 0 }} />
          <div style={{ fontSize: 13, color: "hsl(40,90%,35%)", fontWeight: 600 }}>Данные восстановлены — продолжайте с того места, где остановились.</div>
          <button onClick={() => { clearStaffDraft(); setHasDraft(false); setStaff([newMember()]); }}
            style={{ marginLeft: "auto", fontSize: 11, color: "hsl(40,90%,50%)", background: "none", border: "none", cursor: "pointer", fontFamily: "Montserrat,sans-serif", flexShrink: 0 }}>
            Очистить
          </button>
        </div>
      )}

      {/* Баннер если нет сотрудников в БД */}
      {!hasDbStaff && (
        <div style={{ background: "hsla(40,90%,50%,0.08)", border: "1px solid hsla(40,90%,50%,0.3)", borderRadius: 12, padding: "14px 16px", marginBottom: 20, display: "flex", alignItems: "center", gap: 12 }}>
          <Icon name="AlertCircle" size={16} style={{ color: "hsl(40,90%,45%)", flexShrink: 0 }} />
          <div style={{ fontSize: 13, color: "#555" }}>
            В базе нет сотрудников. <strong>Добавьте их в разделе «Сотрудники»</strong> — тогда они появятся здесь автоматически, или заполните вручную ниже.
          </div>
        </div>
      )}

      {hasDbStaff && (
        <div style={{ background: "hsla(145,60%,40%,0.06)", border: "1px solid hsla(145,60%,40%,0.2)", borderRadius: 12, padding: "10px 14px", marginBottom: 16, display: "flex", alignItems: "center", gap: 10 }}>
          <Icon name="CheckCircle" size={14} style={{ color: "hsl(145,60%,40%)", flexShrink: 0 }} />
          <div style={{ fontSize: 12, color: "#555" }}>Загружено {dbStaff.length} сотрудников из базы. Данные можно отредактировать прямо здесь.</div>
        </div>
      )}

      {/* Сотрудники */}
      <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 14 }}>
        {staff.map((m, i) => (
          <MemberForm key={m.id} member={m} idx={i}
            onChange={updateMember}
            onRemove={id => setStaff(p => p.filter(m => m.id !== id))}
            canRemove={staff.length > 1}
          />
        ))}
      </div>

      {staff.length < 10 && (
        <button onClick={() => setStaff(p => [...p, newMember()])} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, fontWeight: 600, color: ACCENT, background: `hsla(185,85%,32%,0.07)`, border: "none", borderRadius: 10, padding: "10px 18px", cursor: "pointer", fontFamily: "Montserrat,sans-serif", marginBottom: 20 }}>
          <Icon name="Plus" size={15} />
          Добавить сотрудника
        </button>
      )}

      {error && (
        <div style={{ background: "#fff0f0", border: "1px solid #fcc", borderRadius: 10, padding: "10px 14px", marginBottom: 14, fontSize: 13, color: "#c33", display: "flex", alignItems: "center", gap: 8 }}>
          <Icon name="AlertCircle" size={14} />
          {error}
        </div>
      )}

      <button onClick={handleAnalyze} style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, background: `linear-gradient(135deg,hsl(0,75%,50%),hsl(20,90%,55%))`, color: "#fff", border: "none", borderRadius: 12, padding: "14px 24px", fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "Montserrat,sans-serif", boxShadow: "0 4px 18px hsla(0,75%,50%,0.3)" }}>
        <Icon name="BarChart2" size={16} />
        Провести анализ персонала
      </button>
      <div style={{ display: "flex", justifyContent: "center", marginTop: 10 }}>
        <ToolUsageBadge toolKey="staff_audit" />
      </div>

      {/* История */}
      {history.length > 0 && (
        <div style={{ marginTop: 28, background: "#fff", borderRadius: 16, border: "1px solid #E8ECF0", padding: "18px 20px", boxShadow: "0 1px 3px rgba(15,23,42,0.05)" }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: "#aaa", textTransform: "uppercase", letterSpacing: 1.2, marginBottom: 12 }}>Предыдущие анализы</div>
          {history.map(h => (
            <div key={h.id}
              onClick={async () => {
                setStep("loading");
                try {
                  const r = await fetch(`${LK_URL}?action=staff_audit_get&id=${h.id}`, { headers: { "X-Session-Id": sid() } });
                  const d = await r.json();
                  if (d.result) { setResult(d.result); setStep("result"); }
                  else setStep("form");
                } catch { setStep("form"); }
              }}
              style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 0", borderBottom: "1px solid #F1F5F9", cursor: "pointer" }}
              onMouseEnter={e => (e.currentTarget.style.background = "#F1F5F9")}
              onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
            >
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: "#0F172A" }}>Score {h.summary?.avg_score || "—"}/100</div>
                <div style={{ fontSize: 11, color: "#bbb" }}>{new Date(h.created_at).toLocaleDateString("ru-RU")}</div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                {h.summary?.total_loss > 0 && <span style={{ fontSize: 12, color: "hsl(0,75%,55%)", fontWeight: 600 }}>−{h.summary.total_loss.toLocaleString()} ₽</span>}
                <Icon name="ChevronRight" size={14} style={{ color: "#ccc" }} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}