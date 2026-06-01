import { useState, useEffect } from "react";
import Icon from "@/components/ui/icon";

const ACCENT = "hsl(145,60%,35%)";
const ACCENT_DARK = "hsl(145,60%,25%)";
const LK_URL = "https://functions.poehali.dev/1c0ad024-179b-4644-9621-377174bbeba3";
function sid() { return localStorage.getItem("lk_session") || ""; }

interface HistoryItem {
  id: number;
  role: string;
  situation: string;
  script_text: string;
  created_at: string;
}

const ROLES: { value: string; label: string; icon: string; desc: string }[] = [
  { value: "admin",     label: "Администратор", icon: "PhoneCall",   desc: "Звонки, запись, встреча клиентов" },
  { value: "master",    label: "Мастер",        icon: "Scissors",    desc: "Общение во время процедуры" },
  { value: "manager",   label: "Управляющий",   icon: "UserCheck",   desc: "Сложные ситуации, VIP-клиенты" },
];

export default function LkClientScripts() {
  const [role, setRole]         = useState("");
  const [situation, setSituation] = useState("");
  const [script, setScript]     = useState("");
  const [loading, setLoading]   = useState(false);
  const [copied, setCopied]     = useState(false);
  const [error, setError]       = useState("");
  const [history, setHistory]   = useState<HistoryItem[]>([]);

  useEffect(() => {
    fetch(`${LK_URL}?action=script_history`, { headers: { "X-Session-Id": sid() } })
      .then(r => r.json()).then(d => Array.isArray(d) && setHistory(d)).catch(() => {});
  }, []);

  async function handleGenerate() {
    if (!role) { setError("Выберите роль"); return; }
    if (!situation.trim()) { setError("Опишите ситуацию"); return; }
    setLoading(true); setError(""); setScript("");
    try {
      const r = await fetch(`${LK_URL}?action=script_generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "X-Session-Id": sid() },
        body: JSON.stringify({ role, situation }),
      });
      const d = await r.json();
      if (!r.ok) { setError(d.error || "Ошибка генерации"); return; }
      setScript(d.script);
      setHistory(p => [{ id: d.id, role, situation, script_text: d.script, created_at: new Date().toISOString() }, ...p].slice(0, 20));
    } catch { setError("Ошибка соединения"); }
    finally { setLoading(false); }
  }

  function handleCopy() {
    navigator.clipboard.writeText(script);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function handleReset() { setScript(""); setError(""); }

  const inp: React.CSSProperties = { width: "100%", padding: "12px 14px", borderRadius: 10, border: "1.5px solid #E2E8F0", fontSize: 13, fontFamily: "Montserrat,sans-serif", background: "#fff", boxSizing: "border-box", color: "#0F172A", outline: "none", resize: "vertical" };

  const selectedRole = ROLES.find(r => r.value === role);

  return (
    <div style={{ maxWidth: 680 }}>
      <style>{`@keyframes fadeIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:none}} @keyframes spin{to{transform:rotate(360deg)}}`}</style>

      {/* Заголовок */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
          <div style={{ width: 40, height: 40, borderRadius: 12, background: `linear-gradient(135deg,${ACCENT},${ACCENT_DARK})`, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Icon name="MessageSquare" size={20} style={{ color: "#fff" }} />
          </div>
          <h2 style={{ fontSize: "clamp(18px,2.5vw,24px)", fontWeight: 700, color: "#0F172A", margin: 0 }}>Скрипты общения с клиентом</h2>
        </div>
        <p style={{ fontSize: 13, color: "#777", margin: 0, lineHeight: 1.6 }}>
          Выберите роль сотрудника, опишите ситуацию — ИИ напишет готовый сценарий диалога.
        </p>
      </div>

      {script ? (
        /* ── Результат ── */
        <div style={{ animation: "fadeIn 0.4s ease" }}>
          {/* Контекст */}
          <div style={{ background: "#f7f7f4", borderRadius: 14, padding: "14px 18px", marginBottom: 16, display: "flex", gap: 14, alignItems: "flex-start" }}>
            <div style={{ width: 34, height: 34, borderRadius: 9, background: `hsla(145,60%,35%,0.1)`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <Icon name={selectedRole?.icon || "User"} size={16} style={{ color: ACCENT }} />
            </div>
            <div>
              <div style={{ fontSize: 12, fontWeight: 700, color: "#888" }}>{selectedRole?.label}</div>
              <div style={{ fontSize: 13, color: "#555", lineHeight: 1.6, marginTop: 2 }}>{situation}</div>
            </div>
          </div>

          {/* Скрипт */}
          <div style={{ background: "#fff", borderRadius: 14, border: `1.5px solid hsla(145,60%,35%,0.2)`, padding: "20px 22px", marginBottom: 14 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: ACCENT, textTransform: "uppercase", letterSpacing: 1.2 }}>Сценарий диалога</div>
              <button onClick={handleCopy} style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 14px", borderRadius: 8, border: "none", background: copied ? "hsl(145,60%,96%)" : "#f5f5f2", color: copied ? ACCENT : "#666", fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "Montserrat,sans-serif" }}>
                <Icon name={copied ? "Check" : "Copy"} size={13} />
                {copied ? "Скопировано!" : "Копировать"}
              </button>
            </div>
            <div style={{ fontSize: 13, color: "#222", lineHeight: 1.9, whiteSpace: "pre-wrap" }}>{script}</div>
          </div>

          <div style={{ display: "flex", gap: 10 }}>
            <button onClick={handleGenerate} disabled={loading} style={{ display: "flex", alignItems: "center", gap: 7, padding: "11px 20px", borderRadius: 10, border: "none", background: `linear-gradient(135deg,${ACCENT},${ACCENT_DARK})`, color: "#fff", fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "Montserrat,sans-serif" }}>
              <Icon name="RefreshCw" size={14} />
              Другой вариант
            </button>
            <button onClick={handleReset} style={{ display: "flex", alignItems: "center", gap: 7, padding: "11px 20px", borderRadius: 10, border: "none", background: "#f5f5f2", color: "#666", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "Montserrat,sans-serif" }}>
              <Icon name="Plus" size={14} />
              Новая ситуация
            </button>
          </div>
        </div>
      ) : (
        /* ── Форма ── */
        <div>
          {/* Роль */}
          <div style={{ marginBottom: 20 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: "#555", marginBottom: 10 }}>Роль сотрудника</div>
            <div style={{ display: "flex", gap: 10 }}>
              {ROLES.map(r => (
                <button key={r.value} onClick={() => setRole(r.value)}
                  style={{ flex: 1, padding: "14px 10px", borderRadius: 13, border: `1.5px solid ${role === r.value ? ACCENT : "#E8ECF0"}`, background: role === r.value ? `hsla(145,60%,35%,0.07)` : "#fff", cursor: "pointer", fontFamily: "Montserrat,sans-serif", textAlign: "center" }}>
                  <div style={{ display: "flex", justifyContent: "center", marginBottom: 7 }}>
                    <Icon name={r.icon} size={20} style={{ color: role === r.value ? ACCENT : "#ccc" }} />
                  </div>
                  <div style={{ fontSize: 12, fontWeight: 700, color: role === r.value ? ACCENT : "#444" }}>{r.label}</div>
                  <div style={{ fontSize: 10, color: "#bbb", marginTop: 3, lineHeight: 1.4 }}>{r.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Ситуация */}
          <div style={{ marginBottom: 22 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: "#555", marginBottom: 8 }}>Опишите ситуацию</div>
            <textarea
              style={{ ...inp, minHeight: 90 }}
              value={situation}
              onChange={e => setSituation(e.target.value)}
              placeholder={
                role === "admin"   ? "Например: клиент звонит и хочет записаться, но сомневается в цене..." :
                role === "master"  ? "Например: клиент во время стрижки спрашивает про уход за волосами дома..." :
                role === "manager" ? "Например: клиент недоволен качеством и хочет возврат денег..." :
                "Опишите ситуацию общения с клиентом..."
              }
            />
          </div>

          {error && (
            <div style={{ background: "#fff0f0", border: "1px solid #fcc", borderRadius: 10, padding: "10px 14px", marginBottom: 14, fontSize: 13, color: "#c33", display: "flex", alignItems: "center", gap: 8 }}>
              <Icon name="AlertCircle" size={14} />{error}
            </div>
          )}

          <button onClick={handleGenerate} disabled={loading}
            style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, background: loading ? "#ccc" : `linear-gradient(135deg,${ACCENT},${ACCENT_DARK})`, color: "#fff", border: "none", borderRadius: 12, padding: "14px", fontSize: 14, fontWeight: 700, cursor: loading ? "not-allowed" : "pointer", fontFamily: "Montserrat,sans-serif", boxShadow: loading ? "none" : `0 4px 18px hsla(145,60%,35%,0.3)` }}>
            {loading
              ? <><Icon name="Loader" size={16} style={{ animation: "spin 1s linear infinite" }} />Пишу скрипт...</>
              : <><Icon name="Sparkles" size={16} />Написать скрипт</>
            }
          </button>
        </div>
      )}

      {/* История */}
      {history.length > 1 && (
        <div style={{ marginTop: 30, background: "#fff", borderRadius: 16, border: "1px solid #E8ECF0", padding: "18px 20px", boxShadow: "0 1px 3px rgba(15,23,42,0.05)" }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: "#bbb", textTransform: "uppercase", letterSpacing: 1.2, marginBottom: 14 }}>История скриптов</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {history.slice(0, 8).map(h => {
              const r = ROLES.find(r => r.value === h.role) || ROLES[0];
              return (
                <div key={h.id}
                  onClick={() => { setRole(h.role); setSituation(h.situation); setScript(h.script_text); }}
                  style={{ display: "flex", alignItems: "flex-start", gap: 12, padding: "10px 4px", borderBottom: "1px solid #F1F5F9", cursor: "pointer", borderRadius: 8 }}
                  onMouseEnter={e => (e.currentTarget.style.background = "#F1F5F9")}
                  onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
                >
                  <div style={{ width: 28, height: 28, borderRadius: 7, background: `hsla(145,60%,35%,0.09)`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 1 }}>
                    <Icon name={r.icon} size={13} style={{ color: ACCENT }} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 11, fontWeight: 700, color: ACCENT, marginBottom: 2 }}>{r.label}</div>
                    <div style={{ fontSize: 12, color: "#555", lineHeight: 1.5, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{h.situation}</div>
                    <div style={{ fontSize: 11, color: "#bbb", marginTop: 2 }}>{new Date(h.created_at).toLocaleDateString("ru-RU")}</div>
                  </div>
                  <Icon name="ChevronRight" size={14} style={{ color: "#ddd", flexShrink: 0 }} />
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}