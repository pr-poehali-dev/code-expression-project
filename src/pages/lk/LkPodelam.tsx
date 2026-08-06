import { useState, useEffect, useCallback } from "react";
import Icon from "@/components/ui/icon";
import { useLkAuth } from "@/contexts/LkAuthContext";
import func2url from "../../../backend/func2url.json";

const ACCENT = "hsl(185,85%,32%)";
const ACCENT_DARK = "hsl(185,85%,24%)";

const PODELAM_URL = (func2url as Record<string, string>)["masters-accrual"] || "";
function sid() { return localStorage.getItem("lk_session") || ""; }

interface GrowthPoint {
  key: string;
  title: string;
  action: string;
  potential: number;
  count: number;
}

interface Task {
  key: string;
  title: string;
  action_text: string;
  button: string;
  nav: string;
  minutes: number;
  potential: number;
}

interface Profile {
  niche: string;
  avg_check: number;
  current_revenue: number;
  target_revenue: number;
  clients_per_month: number;
  base_size: number;
  repeat_rate: number;
  free_slots_per_week: number;
  has_addon_services: boolean;
  lead_source: string;
}

interface PodelamData {
  has_profile: boolean;
  profile?: Profile;
  growth_points?: GrowthPoint[];
  gap_amount?: number;
  plan?: { tasks: Task[]; main_task_key: string | null; gap_amount: number };
  task_log?: Record<string, { done: boolean; actual_amount: number | null }>;
}

function fmt(n: number) {
  return Math.round(n).toLocaleString("ru-RU");
}

// ── Форма диагностики (8-12 вопросов) ─────────────────────────────────────────
function DiagnosticForm({ onSaved }: { onSaved: () => void }) {
  const [form, setForm] = useState({
    niche: "", avg_check: "", current_revenue: "", target_revenue: "",
    clients_per_month: "", base_size: "", repeat_rate: "", free_slots_per_week: "",
    has_addon_services: false, lead_source: "",
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const set = (k: string, v: string | boolean) => setForm(p => ({ ...p, [k]: v }));

  const inputStyle: React.CSSProperties = {
    width: "100%", padding: "11px 14px", borderRadius: 10, border: "1.5px solid #E2E8F0",
    fontSize: 14, fontFamily: "Montserrat,sans-serif", background: "#fff", boxSizing: "border-box",
    color: "#0F172A", outline: "none",
  };
  const label: React.CSSProperties = { fontSize: 12, fontWeight: 600, color: "#64748B", marginBottom: 6, display: "block" };

  const submit = async () => {
    if (!form.avg_check || !form.current_revenue || !form.target_revenue) {
      setError("Заполните средний чек, текущий и желаемый доход");
      return;
    }
    setSaving(true);
    setError("");
    try {
      const res = await fetch(`${PODELAM_URL}?action=podelam_save_profile`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "X-Session-Id": sid() },
        body: JSON.stringify({
          niche: form.niche,
          avg_check: Number(form.avg_check),
          current_revenue: Number(form.current_revenue),
          target_revenue: Number(form.target_revenue),
          clients_per_month: Number(form.clients_per_month) || 0,
          base_size: Number(form.base_size) || 0,
          repeat_rate: Number(form.repeat_rate) || 0,
          free_slots_per_week: Number(form.free_slots_per_week) || 0,
          has_addon_services: form.has_addon_services,
          lead_source: form.lead_source,
        }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "Ошибка сохранения"); return; }
      onSaved();
    } catch {
      setError("Не удалось сохранить. Попробуйте ещё раз.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{ maxWidth: 640, margin: "0 auto" }}>
      <div style={{ textAlign: "center", marginBottom: 28 }}>
        <div style={{ width: 56, height: 56, borderRadius: 16, background: `linear-gradient(135deg,${ACCENT},${ACCENT_DARK})`, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
          <Icon name="Compass" size={26} style={{ color: "#fff" }} />
        </div>
        <h1 style={{ fontSize: "clamp(22px,3vw,28px)", fontWeight: 700, color: "#0F172A", margin: "0 0 8px" }}>ПоДелам — навигатор дохода</h1>
        <p style={{ fontSize: 14, color: "#64748B", margin: 0, lineHeight: 1.6 }}>
          Расскажите о своей ситуации — ИИ найдёт, где лежат деньги, и составит план на сегодня из ваших инструментов.
        </p>
      </div>

      <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #E8ECF0", padding: 24, display: "flex", flexDirection: "column", gap: 16 }}>
        <div>
          <label style={label}>Ниша / услуга</label>
          <input style={inputStyle} value={form.niche} onChange={e => set("niche", e.target.value)} placeholder="Например: массаж, маникюр, стрижки" />
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
          <div>
            <label style={label}>Средний чек, ₽ *</label>
            <input style={inputStyle} type="number" value={form.avg_check} onChange={e => set("avg_check", e.target.value)} placeholder="2500" />
          </div>
          <div>
            <label style={label}>Клиентов в месяц</label>
            <input style={inputStyle} type="number" value={form.clients_per_month} onChange={e => set("clients_per_month", e.target.value)} placeholder="44" />
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
          <div>
            <label style={label}>Доход сейчас, ₽ в месяц *</label>
            <input style={inputStyle} type="number" value={form.current_revenue} onChange={e => set("current_revenue", e.target.value)} placeholder="110000" />
          </div>
          <div>
            <label style={label}>Желаемый доход, ₽ в месяц *</label>
            <input style={inputStyle} type="number" value={form.target_revenue} onChange={e => set("target_revenue", e.target.value)} placeholder="180000" />
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
          <div>
            <label style={label}>Размер базы клиентов</label>
            <input style={inputStyle} type="number" value={form.base_size} onChange={e => set("base_size", e.target.value)} placeholder="120" />
          </div>
          <div>
            <label style={label}>% повторных визитов</label>
            <input style={inputStyle} type="number" value={form.repeat_rate} onChange={e => set("repeat_rate", e.target.value)} placeholder="35" />
          </div>
        </div>

        <div>
          <label style={label}>Свободных окон в неделю</label>
          <input style={inputStyle} type="number" value={form.free_slots_per_week} onChange={e => set("free_slots_per_week", e.target.value)} placeholder="7" />
        </div>

        <div>
          <label style={label}>Откуда приходят записи</label>
          <input style={inputStyle} value={form.lead_source} onChange={e => set("lead_source", e.target.value)} placeholder="Instagram, сарафанное радио, реклама..." />
        </div>

        <label style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }}>
          <input type="checkbox" checked={form.has_addon_services} onChange={e => set("has_addon_services", e.target.checked)} style={{ width: 18, height: 18 }} />
          <span style={{ fontSize: 13, color: "#374151" }}>Есть дополнительные услуги / пакеты</span>
        </label>

        {error && <div style={{ fontSize: 13, color: "#DC2626", background: "#FEF2F2", borderRadius: 8, padding: "8px 12px" }}>{error}</div>}

        <button
          onClick={submit}
          disabled={saving}
          style={{
            padding: "13px 0", borderRadius: 12, border: "none",
            background: `linear-gradient(135deg,${ACCENT},${ACCENT_DARK})`,
            color: "#fff", fontSize: 15, fontWeight: 700, cursor: saving ? "default" : "pointer",
            fontFamily: "Montserrat,sans-serif", opacity: saving ? 0.7 : 1,
          }}
        >
          {saving ? "Считаем…" : "Получить план роста дохода"}
        </button>
      </div>
    </div>
  );
}

// ── Модалка «Как это работает» ─────────────────────────────────────────────────
function InfoModal({ onClose }: { onClose: () => void }) {
  const items: { icon: string; title: string; text: string }[] = [
    {
      icon: "Compass",
      title: "Что такое «ПоДелам»",
      text: "Это ИИ-навигатор дохода. Он не заменяет остальные инструменты платформы, а объясняет, какой из них использовать сегодня и в какой последовательности, чтобы доход рос, а не просто «что-то делалось».",
    },
    {
      icon: "Calculator",
      title: "Откуда берутся цифры",
      text: "На основе вашей диагностики (средний чек, доход, база клиентов, свободные окна) ИИ считает разрыв между текущим и желаемым доходом и раскладывает его на понятные точки роста — сколько клиентов вернуть, сколько окон заполнить, кому предложить допуслугу.",
    },
    {
      icon: "RefreshCw",
      title: "Когда обновляются задания",
      text: "Новый план на день формируется автоматически раз в сутки. Если хотите пересчитать план сразу — например, изменился доход или база клиентов — нажмите «Обновить диагностику» и заполните форму заново.",
    },
    {
      icon: "CheckCircle2",
      title: "Как выполнять дела",
      text: "У каждого дела есть кнопка, которая сразу открывает нужный инструмент (сообщения клиентам, офферы, скрипты, Reels) с уже подготовленным контекстом. Сделали — отметьте кружок галочкой, чтобы дело ушло в выполненные и не мешало на завтра.",
    },
    {
      icon: "Info",
      title: "Важно",
      text: "Суммы потенциала — это ориентир, а не гарантия. Реальный результат зависит от спроса, цены, качества услуг и того, выполните ли вы предложенные действия.",
    },
  ];

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(15,23,42,0.55)", zIndex: 2000, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }} onClick={onClose}>
      <div onClick={e => e.stopPropagation()} style={{ background: "#fff", borderRadius: 20, maxWidth: 520, width: "100%", maxHeight: "85vh", overflowY: "auto", boxShadow: "0 20px 60px rgba(0,0,0,0.25)" }}>
        <div style={{ padding: "24px 28px 20px", borderBottom: "1px solid #F1F5F9", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: `linear-gradient(135deg,${ACCENT},${ACCENT_DARK})`, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Icon name="Compass" size={18} style={{ color: "#fff" }} />
            </div>
            <div style={{ fontSize: 17, fontWeight: 700, color: "#0F172A" }}>Как работает «ПоДелам»</div>
          </div>
          <button onClick={onClose} style={{ width: 30, height: 30, borderRadius: "50%", border: "none", background: "#F1F5F9", color: "#64748B", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Icon name="X" size={16} />
          </button>
        </div>
        <div style={{ padding: "20px 28px 28px", display: "flex", flexDirection: "column", gap: 18 }}>
          {items.map((it, i) => (
            <div key={i} style={{ display: "flex", gap: 14 }}>
              <div style={{ width: 34, height: 34, borderRadius: 10, background: "hsl(185,85%,95%)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <Icon name={it.icon} size={16} style={{ color: ACCENT }} />
              </div>
              <div>
                <div style={{ fontSize: 14, fontWeight: 700, color: "#0F172A", marginBottom: 3 }}>{it.title}</div>
                <div style={{ fontSize: 13, color: "#64748B", lineHeight: 1.6 }}>{it.text}</div>
              </div>
            </div>
          ))}
        </div>
        <div style={{ padding: "0 28px 24px" }}>
          <button onClick={onClose} style={{ width: "100%", padding: "12px 0", borderRadius: 12, border: "none", background: `linear-gradient(135deg,${ACCENT},${ACCENT_DARK})`, color: "#fff", fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "Montserrat,sans-serif" }}>
            Понятно
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Главный экран ПоДелам ──────────────────────────────────────────────────────
export function PodelamTab({ onNav }: { onNav: (t: string) => void }) {
  const { user } = useLkAuth();
  const [data, setData] = useState<PodelamData | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [marking, setMarking] = useState<string | null>(null);
  const [showInfo, setShowInfo] = useState(false);

  const load = useCallback(() => {
    setLoading(true);
    fetch(`${PODELAM_URL}?action=podelam_get`, { headers: { "X-Session-Id": sid() } })
      .then(r => r.json())
      .then(d => setData(d))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { load(); }, [load]);

  const markDone = async (taskKey: string) => {
    setMarking(taskKey);
    try {
      await fetch(`${PODELAM_URL}?action=podelam_task_done`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "X-Session-Id": sid() },
        body: JSON.stringify({ task_key: taskKey, done: true }),
      });
      load();
    } finally {
      setMarking(null);
    }
  };

  if (loading) {
    return <div style={{ display: "flex", justifyContent: "center", padding: 60, color: "#94A3B8" }}>Загрузка…</div>;
  }

  if (!data?.has_profile || editing) {
    return <DiagnosticForm onSaved={() => { setEditing(false); load(); }} />;
  }

  const { profile, growth_points = [], gap_amount = 0, plan, task_log = {} } = data;
  const progress = profile ? Math.min(100, Math.round((profile.current_revenue / profile.target_revenue) * 100)) : 0;
  const tasks = plan?.tasks || [];
  const mainTask = tasks[0];

  return (
    <div>
      {/* Заголовок */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 12, marginBottom: 24 }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: ACCENT, letterSpacing: 1.5, textTransform: "uppercase" }}>
              ПоДелам · Промт Диалог
            </div>
            <button
              onClick={() => setShowInfo(true)}
              title="Как это работает?"
              style={{ width: 18, height: 18, borderRadius: "50%", border: `1.5px solid ${ACCENT}`, background: "transparent", color: ACCENT, fontSize: 11, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", padding: 0, lineHeight: 1 }}
            >
              ?
            </button>
          </div>
          <h1 style={{ fontSize: "clamp(22px,3vw,28px)", fontWeight: 700, color: "#0F172A", margin: 0 }}>
            {user?.full_name ? `${user.full_name.split(" ")[0]}, ваш доход сегодня` : "Ваш доход сегодня"}
          </h1>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button onClick={() => setShowInfo(true)} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, fontWeight: 600, color: "#64748B", background: "#F1F5F9", border: "none", borderRadius: 8, padding: "8px 14px", cursor: "pointer", fontFamily: "Montserrat,sans-serif", whiteSpace: "nowrap" }}>
            <Icon name="Info" size={13} />
            Как это работает
          </button>
          <button onClick={() => setEditing(true)} style={{ fontSize: 12, fontWeight: 600, color: ACCENT, background: "hsl(185,85%,95%)", border: "none", borderRadius: 8, padding: "8px 14px", cursor: "pointer", fontFamily: "Montserrat,sans-serif", whiteSpace: "nowrap" }}>
            Обновить диагностику
          </button>
        </div>
      </div>

      {showInfo && <InfoModal onClose={() => setShowInfo(false)} />}

      {/* Экран 1: Цель и прогресс */}
      {profile && (
        <div style={{ background: "linear-gradient(135deg,#0F172A,#112B3C)", borderRadius: 16, padding: "24px 28px", marginBottom: 20 }}>
          <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 20, marginBottom: 16 }}>
            <div>
              <div style={{ fontSize: 11, color: "rgba(255,255,255,0.5)", marginBottom: 4, textTransform: "uppercase", letterSpacing: 1 }}>Цель месяца</div>
              <div style={{ fontSize: 22, fontWeight: 700, color: "#fff" }}>{fmt(profile.target_revenue)} ₽</div>
            </div>
            <div>
              <div style={{ fontSize: 11, color: "rgba(255,255,255,0.5)", marginBottom: 4, textTransform: "uppercase", letterSpacing: 1 }}>Сейчас</div>
              <div style={{ fontSize: 22, fontWeight: 700, color: "#2DD4BF" }}>{fmt(profile.current_revenue)} ₽</div>
            </div>
            <div>
              <div style={{ fontSize: 11, color: "rgba(255,255,255,0.5)", marginBottom: 4, textTransform: "uppercase", letterSpacing: 1 }}>Не хватает</div>
              <div style={{ fontSize: 22, fontWeight: 700, color: "hsl(40,90%,60%)" }}>{fmt(Math.max(0, gap_amount))} ₽</div>
            </div>
          </div>
          <div style={{ height: 8, borderRadius: 4, background: "rgba(255,255,255,0.1)", overflow: "hidden" }}>
            <div style={{ height: "100%", width: `${progress}%`, borderRadius: 4, background: "linear-gradient(90deg,#2DD4BF,#14B8A6)" }} />
          </div>
          <div style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", marginTop: 8 }}>{progress}% от цели</div>
        </div>
      )}

      {/* Экран 2: Главное дело дня */}
      {mainTask && (
        <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #E8ECF0", padding: 24, marginBottom: 20, boxShadow: "0 1px 3px rgba(15,23,42,0.04)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
            <Icon name="Target" size={16} style={{ color: ACCENT }} />
            <span style={{ fontSize: 12, fontWeight: 700, color: ACCENT, textTransform: "uppercase", letterSpacing: 1 }}>Сегодня главное</span>
          </div>
          <div style={{ fontSize: 19, fontWeight: 700, color: "#0F172A", marginBottom: 6 }}>{mainTask.title}</div>
          <div style={{ fontSize: 14, color: "#64748B", marginBottom: 14, lineHeight: 1.6 }}>{mainTask.action_text}</div>
          {mainTask.potential > 0 && (
            <div style={{ fontSize: 13, fontWeight: 600, color: "hsl(145,60%,35%)", marginBottom: 16 }}>
              Потенциал: до {fmt(mainTask.potential)} ₽
            </div>
          )}
          <button
            onClick={() => onNav(mainTask.nav)}
            style={{ padding: "11px 22px", borderRadius: 10, border: "none", background: `linear-gradient(135deg,${ACCENT},${ACCENT_DARK})`, color: "#fff", fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "Montserrat,sans-serif" }}
          >
            {mainTask.button}
          </button>
        </div>
      )}

      {/* Экран 3: План на день */}
      <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #E8ECF0", padding: "20px 24px", marginBottom: 20, boxShadow: "0 1px 3px rgba(15,23,42,0.04)" }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: "#94A3B8", letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 16 }}>План на сегодня</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {tasks.map((t, i) => {
            const done = task_log[t.key]?.done;
            return (
              <div key={t.key + i} style={{ display: "flex", alignItems: "center", gap: 14, padding: "12px 14px", borderRadius: 12, background: done ? "hsl(145,60%,97%)" : "#F8FAFC", border: `1px solid ${done ? "hsl(145,60%,85%)" : "#E8ECF0"}` }}>
                <button
                  onClick={() => !done && markDone(t.key)}
                  disabled={marking === t.key}
                  style={{
                    width: 26, height: 26, borderRadius: "50%", flexShrink: 0, border: `2px solid ${done ? "hsl(145,60%,45%)" : "#CBD5E1"}`,
                    background: done ? "hsl(145,60%,45%)" : "#fff", cursor: done ? "default" : "pointer",
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}
                >
                  {done && <Icon name="Check" size={14} style={{ color: "#fff" }} />}
                </button>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 14, fontWeight: 600, color: done ? "#64748B" : "#0F172A", textDecoration: done ? "line-through" : "none" }}>{t.title}</div>
                  <div style={{ fontSize: 12, color: "#94A3B8" }}>{t.action_text} · ~{t.minutes} мин{t.potential > 0 ? ` · до ${fmt(t.potential)} ₽` : ""}</div>
                </div>
                {!done && (
                  <button
                    onClick={() => onNav(t.nav)}
                    style={{ fontSize: 12, fontWeight: 600, color: ACCENT, background: "hsl(185,85%,95%)", border: "none", borderRadius: 8, padding: "7px 12px", cursor: "pointer", fontFamily: "Montserrat,sans-serif", whiteSpace: "nowrap" }}
                  >
                    {t.button}
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Экран 4: Точки роста / потери */}
      {growth_points.length > 0 && (
        <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #E8ECF0", padding: "20px 24px", boxShadow: "0 1px 3px rgba(15,23,42,0.04)" }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: "#94A3B8", letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 16 }}>Где лежат деньги</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {growth_points.map(p => (
              <div key={p.key} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, paddingBottom: 12, borderBottom: "1px solid #F1F5F9" }}>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: "#0F172A" }}>{p.title}</div>
                  <div style={{ fontSize: 12, color: "#94A3B8" }}>{p.action}</div>
                </div>
                <div style={{ fontSize: 15, fontWeight: 700, color: "hsl(145,60%,35%)", whiteSpace: "nowrap" }}>+{fmt(p.potential)} ₽</div>
              </div>
            ))}
          </div>
          <div style={{ fontSize: 11, color: "#B0B8C1", marginTop: 12, lineHeight: 1.5 }}>
            Расчёт ориентировочный и основан на ваших данных. Реальный результат зависит от спроса, цены, качества услуг и выполнения действий.
          </div>
        </div>
      )}
    </div>
  );
}