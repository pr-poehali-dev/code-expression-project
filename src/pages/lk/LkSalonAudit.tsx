import { useState, useEffect } from "react";
import { useLkAuth } from "@/contexts/LkAuthContext";
import Icon from "@/components/ui/icon";
import { ACCENT, ACCENT_DARK, LK_URL, AUDIT_URL, sid, lkPost, Answers, AuditResult, HistoryItem } from "./salon-audit.types";
import SalonAuditResult from "./SalonAuditResult";
import SalonAuditForm from "./SalonAuditForm";

function AuditLoading() {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: 360, gap: 20 }}>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } } @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.5} }`}</style>
      <div style={{ width: 64, height: 64, borderRadius: 18, background: `linear-gradient(135deg,${ACCENT},${ACCENT_DARK})`, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Icon name="Brain" size={30} style={{ color: "#fff", animation: "pulse 1.5s ease infinite" }} />
      </div>
      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: 18, fontWeight: 700, color: "#1a1a1a", marginBottom: 8 }}>Анализирую ваш салон...</div>
        <div style={{ fontSize: 13, color: "#888", lineHeight: 1.7 }}>
          ИИ изучает данные и формирует персональный бизнес-разбор.<br />Обычно занимает 20–40 секунд.
        </div>
      </div>
      <div style={{ display: "flex", gap: 6 }}>
        {[0, 1, 2].map(i => (
          <div key={i} style={{ width: 8, height: 8, borderRadius: "50%", background: ACCENT, animation: `pulse 1.2s ease ${i * 0.2}s infinite` }} />
        ))}
      </div>
    </div>
  );
}

export default function LkSalonAudit() {
  const { user } = useLkAuth();
  const [step, setStep] = useState<"form" | "loading" | "result">("form");
  const [answers, setAnswers] = useState<Answers>({});
  const [currentBlock, setCurrentBlock] = useState(0);
  const [result, setResult] = useState<AuditResult | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [error, setError] = useState("");
  const [auditId, setAuditId] = useState<number | null>(null);

  useEffect(() => {
    fetch(`${LK_URL}?action=audit_history`, { headers: { "X-Session-Id": sid() } })
      .then(r => r.json()).then(d => Array.isArray(d) && setHistory(d)).catch(() => {});

    if (user?.salon_id) {
      fetch(`${LK_URL}?action=salon_profile`, { headers: { "X-Session-Id": sid() } })
        .then(r => r.json()).then(d => {
          if (d.salon) {
            const s = d.salon;
            setAnswers(prev => ({
              ...prev,
              salon_name:        s.name || "",
              city:              s.city || "",
              monthly_revenue:   s.monthly_revenue || "",
              avg_check:         s.avg_check || "",
              clients_per_month: s.clients_count || "",
              staff_count:       s.masters_count || "",
            }));
          }
        }).catch(() => {});
    }
  }, [user?.salon_id]);

  function setAnswer(key: string, val: string | boolean) {
    setAnswers(p => ({ ...p, [key]: val }));
  }

  async function handleAnalyze() {
    setStep("loading");
    setError("");
    try {
      const saved = await lkPost("audit_save", { answers, result: null });
      const id = saved.id;
      setAuditId(id);

      const res = await fetch(AUDIT_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json", "X-Session-Id": sid() },
        body: JSON.stringify({ answers }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "Ошибка анализа"); setStep("form"); return; }

      const r: AuditResult = data.result;
      setResult(r);

      await lkPost("audit_save", {
        id,
        answers,
        result: r,
        score_clients:    r.scores.clients,
        score_marketing:  r.scores.marketing,
        score_sales:      r.scores.sales,
        score_staff:      r.scores.staff,
        score_management: r.scores.management,
        score_total:      r.score_total,
      });

      setStep("result");
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Ошибка. Попробуйте ещё раз.");
      setStep("form");
    }
  }

  async function handleHistoryClick(id: number) {
    setStep("loading");
    try {
      const r = await fetch(`${LK_URL}?action=audit_get&id=${id}`, { headers: { "X-Session-Id": sid() } });
      const d = await r.json();
      if (d.result) { setResult(d.result); setStep("result"); }
      else { setStep("form"); }
    } catch { setStep("form"); }
  }

  if (step === "result" && result) {
    return <SalonAuditResult result={result} onReset={() => { setStep("form"); setResult(null); setCurrentBlock(0); }} />;
  }

  if (step === "loading") {
    return <AuditLoading />;
  }

  return (
    <SalonAuditForm
      answers={answers}
      currentBlock={currentBlock}
      error={error}
      history={history}
      onAnswer={setAnswer}
      onNext={() => setCurrentBlock(p => p + 1)}
      onBack={() => setCurrentBlock(p => p - 1)}
      onAnalyze={handleAnalyze}
      onHistoryClick={handleHistoryClick}
    />
  );
}
