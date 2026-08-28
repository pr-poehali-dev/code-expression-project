import { useState, useEffect } from "react";
import Icon from "@/components/ui/icon";
import ToolUsageBadge from "@/components/ToolUsageBadge";

const ACCENT = "hsl(185,85%,32%)";
const LK_URL = "https://functions.poehali.dev/1c0ad024-179b-4644-9621-377174bbeba3";
function sid() { return localStorage.getItem("lk_session") || ""; }

type Tone = "professional" | "warm" | "brief";
type Sentiment = "positive" | "negative" | "neutral";
type Platform = "2gis" | "yandex" | "google" | "avito" | null;

interface HistoryItem {
  id: number;
  review_text: string;
  reply_text: string;
  sentiment: Sentiment;
  created_at: string;
}

const SENTIMENTS: { value: Sentiment; label: string; icon: string; color: string; bg: string }[] = [
  { value: "positive", label: "Положительный",  icon: "ThumbsUp",   color: "hsl(145,60%,35%)", bg: "hsl(145,60%,96%)" },
  { value: "negative", label: "Негативный",     icon: "ThumbsDown", color: "hsl(0,75%,50%)",   bg: "hsl(0,75%,97%)" },
  { value: "neutral",  label: "Нейтральный",    icon: "Minus",      color: "hsl(40,80%,45%)",  bg: "hsl(40,80%,97%)" },
];

const PLATFORMS: { value: Platform; label: string; emoji: string; maxChars: number | null }[] = [
  { value: "2gis",   label: "2ГИС",    emoji: "🟢", maxChars: 1000 },
  { value: "yandex", label: "Яндекс",  emoji: "🔴", maxChars: 1000 },
  { value: "google", label: "Google",  emoji: "🔵", maxChars: 4096 },
  { value: "avito",  label: "Авито",   emoji: "🟡", maxChars: 2000 },
];

const TONES: { value: Tone; label: string; desc: string }[] = [
  { value: "professional", label: "Профессиональный", desc: "Чётко и по делу" },
  { value: "warm",         label: "Тёплый",           desc: "С заботой и душой" },
  { value: "brief",        label: "Краткий",          desc: "2–3 предложения" },
];

export default function LkReviewReply() {
  const [reviewText, setReviewText] = useState("");
  const [sentiment, setSentiment]   = useState<Sentiment>("positive");
  const [tone, setTone]             = useState<Tone>("warm");
  const [platform, setPlatform]     = useState<Platform>(null);
  const [reply, setReply]           = useState("");
  const [loading, setLoading]       = useState(false);
  const [copied, setCopied]         = useState(false);
  const [error, setError]           = useState("");
  const [history, setHistory]       = useState<HistoryItem[]>([]);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  useEffect(() => {
    fetch(`${LK_URL}?action=review_reply_history`, { headers: { "X-Session-Id": sid() } })
      .then(r => r.json()).then(d => Array.isArray(d) && setHistory(d)).catch(() => {});
  }, []);

  async function handleDelete(id: number, e: React.MouseEvent) {
    e.stopPropagation();
    setDeletingId(id);
    try {
      await fetch(`${LK_URL}?action=review_reply_delete`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "X-Session-Id": sid() },
        body: JSON.stringify({ id }),
      });
      setHistory(p => p.filter(h => h.id !== id));
    } finally { setDeletingId(null); }
  }

  async function handleGenerate() {
    if (!reviewText.trim()) { setError("Вставьте текст отзыва"); return; }
    setLoading(true); setError(""); setReply("");
    try {
      const r = await fetch(`${LK_URL}?action=review_reply`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "X-Session-Id": sid() },
        body: JSON.stringify({ review_text: reviewText, sentiment, tone, platform }),
      });
      const d = await r.json();
      if (!r.ok) { setError(d.error || "Ошибка генерации"); return; }
      setReply(d.reply);
      setHistory(p => [{ id: d.id, review_text: reviewText, reply_text: d.reply, sentiment, created_at: new Date().toISOString() }, ...p].slice(0, 20));
    } catch { setError("Ошибка соединения"); }
    finally { setLoading(false); }
  }

  function handleCopy() {
    navigator.clipboard.writeText(reply);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function handleReset() {
    setReply(""); setReviewText(""); setError("");
  }

  const inp: React.CSSProperties = { width: "100%", padding: "12px 14px", borderRadius: 10, border: "1.5px solid #E2E8F0", fontSize: 13, fontFamily: "Montserrat,sans-serif", background: "#fff", boxSizing: "border-box", color: "#0F172A", outline: "none", resize: "vertical" };

  return (
    <div style={{ maxWidth: 680 }}>
      <style>{`@keyframes fadeIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:none}} @keyframes spin{to{transform:rotate(360deg)}}`}</style>

      {/* Заголовок */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
          <div style={{ width: 40, height: 40, borderRadius: 12, background: `linear-gradient(135deg,hsl(185,85%,32%),hsl(185,85%,22%))`, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Icon name="Star" size={20} style={{ color: "#fff" }} />
          </div>
          <h2 style={{ fontSize: "clamp(18px,2.5vw,24px)", fontWeight: 700, color: "#0F172A", margin: 0 }}>Ответы на отзывы</h2>
        </div>
        <p style={{ fontSize: 13, color: "#64748B", margin: "0 0 12px", lineHeight: 1.6 }}>
          Вставьте отзыв — ИИ напишет профессиональный ответ с учётом стиля и специфики вашего салона.
        </p>
        <div style={{ padding: "12px 16px", background: "hsl(185,85%,97%)", borderRadius: 12, border: "1px solid hsl(185,85%,85%)", marginBottom: 4 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: "#0F172A", marginBottom: 6 }}>Как пользоваться и почему это выгодно</div>
          <div style={{ fontSize: 13, color: "#475569", lineHeight: 1.7 }}>
            Вставьте текст отзыва — ИИ напишет вежливый и профессиональный ответ, который подходит именно вашему салону.<br />
            Правильный ответ на негативный отзыв удерживает клиентов и формирует доверие у новых. Игнорировать или отвечать наспех — дорогая ошибка. Этот инструмент сэкономит время и защитит репутацию.
          </div>
        </div>
      </div>

      {reply ? (
        /* ── Результат ── */
        <div style={{ animation: "fadeIn 0.4s ease" }}>
          {/* Оригинал */}
          <div style={{ background: "#f7f7f4", borderRadius: 14, padding: "14px 18px", marginBottom: 16 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: "#bbb", textTransform: "uppercase", letterSpacing: 1.2, marginBottom: 8 }}>Отзыв клиента</div>
            <div style={{ fontSize: 13, color: "#666", lineHeight: 1.7, fontStyle: "italic" }}>«{reviewText}»</div>
          </div>

          {/* Ответ */}
          <div style={{ background: "#fff", borderRadius: 14, border: `1.5px solid hsla(185,85%,32%,0.25)`, padding: "20px 22px", marginBottom: 14 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: ACCENT, textTransform: "uppercase", letterSpacing: 1.2 }}>Ответ от салона</div>
              <div style={{ display: "flex", gap: 8 }}>
                <button onClick={handleCopy} style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 14px", borderRadius: 8, border: "none", background: copied ? "hsl(145,60%,96%)" : "#f5f5f2", color: copied ? "hsl(145,60%,35%)" : "#666", fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "Montserrat,sans-serif" }}>
                  <Icon name={copied ? "Check" : "Copy"} size={13} />
                  {copied ? "Скопировано!" : "Копировать"}
                </button>
              </div>
            </div>
            <div style={{ fontSize: 14, color: "#222", lineHeight: 1.85, whiteSpace: "pre-wrap" }}>{reply}</div>
          </div>

          <div style={{ display: "flex", gap: 10 }}>
            <button onClick={handleGenerate} disabled={loading} style={{ display: "flex", alignItems: "center", gap: 7, padding: "11px 20px", borderRadius: 10, border: "none", background: `linear-gradient(135deg,${ACCENT},hsl(185,85%,22%))`, color: "#fff", fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "Montserrat,sans-serif" }}>
              <Icon name="RefreshCw" size={14} />
              Другой вариант
            </button>
            <button onClick={handleReset} style={{ display: "flex", alignItems: "center", gap: 7, padding: "11px 20px", borderRadius: 10, border: "none", background: "#f5f5f2", color: "#666", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "Montserrat,sans-serif" }}>
              <Icon name="Plus" size={14} />
              Новый отзыв
            </button>
          </div>
        </div>
      ) : (
        /* ── Форма ── */
        <div>
          {/* Тональность отзыва */}
          <div style={{ marginBottom: 20 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: "#555", marginBottom: 10 }}>Тип отзыва</div>
            <div style={{ display: "flex", gap: 8 }}>
              {SENTIMENTS.map(s => (
                <button key={s.value} onClick={() => setSentiment(s.value)} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 6, padding: "12px 8px", borderRadius: 12, border: `1.5px solid ${sentiment === s.value ? s.color : "#E2E8F0"}`, background: sentiment === s.value ? s.bg : "#fff", cursor: "pointer", fontFamily: "Montserrat,sans-serif" }}>
                  <Icon name={s.icon} size={18} style={{ color: sentiment === s.value ? s.color : "#bbb" }} />
                  <span style={{ fontSize: 11, fontWeight: 700, color: sentiment === s.value ? s.color : "#aaa" }}>{s.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Текст отзыва */}
          <div style={{ marginBottom: 18 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: "#555", marginBottom: 8 }}>Текст отзыва</div>
            <textarea
              style={{ ...inp, minHeight: 100 }}
              value={reviewText}
              onChange={e => setReviewText(e.target.value)}
              placeholder="Вставьте сюда текст отзыва клиента..."
            />
          </div>

          {/* Стиль ответа */}
          <div style={{ marginBottom: 18 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: "#555", marginBottom: 10 }}>Стиль ответа</div>
            <div style={{ display: "flex", gap: 8 }}>
              {TONES.map(t => (
                <button key={t.value} onClick={() => setTone(t.value)} style={{ flex: 1, padding: "11px 10px", borderRadius: 11, border: `1.5px solid ${tone === t.value ? ACCENT : "#E2E8F0"}`, background: tone === t.value ? `hsla(185,85%,32%,0.07)` : "#fff", cursor: "pointer", fontFamily: "Montserrat,sans-serif", textAlign: "center" }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: tone === t.value ? ACCENT : "#555" }}>{t.label}</div>
                  <div style={{ fontSize: 10, color: "#aaa", marginTop: 2 }}>{t.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Площадка */}
          <div style={{ marginBottom: 22 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: "#555", marginBottom: 10 }}>
              Площадка
              <span style={{ fontSize: 11, fontWeight: 400, color: "#bbb", marginLeft: 8 }}>необязательно</span>
            </div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {PLATFORMS.map(p => (
                <button key={String(p.value)} onClick={() => setPlatform(platform === p.value ? null : p.value)}
                  style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 14px", borderRadius: 10, border: `1.5px solid ${platform === p.value ? ACCENT : "#E2E8F0"}`, background: platform === p.value ? `hsla(185,85%,32%,0.07)` : "#fff", cursor: "pointer", fontFamily: "Montserrat,sans-serif" }}>
                  <span style={{ fontSize: 14 }}>{p.emoji}</span>
                  <span style={{ fontSize: 12, fontWeight: 700, color: platform === p.value ? ACCENT : "#555" }}>{p.label}</span>
                  {p.maxChars && <span style={{ fontSize: 10, color: "#bbb" }}>до {p.maxChars}</span>}
                </button>
              ))}
            </div>
          </div>

          {error && (
            <div style={{ background: "#fff0f0", border: "1px solid #fcc", borderRadius: 10, padding: "10px 14px", marginBottom: 14, fontSize: 13, color: "#c33", display: "flex", alignItems: "center", gap: 8 }}>
              <Icon name="AlertCircle" size={14} />{error}
            </div>
          )}

          <button onClick={handleGenerate} disabled={loading} style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, background: loading ? "#ccc" : `linear-gradient(135deg,${ACCENT},hsl(185,85%,22%))`, color: "#fff", border: "none", borderRadius: 12, padding: "14px", fontSize: 14, fontWeight: 700, cursor: loading ? "not-allowed" : "pointer", fontFamily: "Montserrat,sans-serif", boxShadow: loading ? "none" : `0 4px 18px hsla(185,85%,32%,0.3)` }}>
            {loading
              ? <><Icon name="Loader" size={16} style={{ animation: "spin 1s linear infinite" }} />Составляю ответ...</>
              : <><Icon name="Sparkles" size={16} />Составить ответ</>
            }
          </button>
          <div style={{ display: "flex", justifyContent: "center", marginTop: 10 }}>
            <ToolUsageBadge toolKey="review_reply" />
          </div>
        </div>
      )}

      {/* История */}
      {history.length > 1 && (
        <div style={{ marginTop: 30, background: "#fff", borderRadius: 16, border: "1px solid #E8ECF0", padding: "18px 20px", boxShadow: "0 1px 3px rgba(15,23,42,0.05)" }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: "#bbb", textTransform: "uppercase", letterSpacing: 1.2, marginBottom: 14 }}>История ответов</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {history.slice(0, 8).map(h => {
              const s = SENTIMENTS.find(s => s.value === h.sentiment) || SENTIMENTS[0];
              return (
                <div key={h.id}
                  style={{ display: "flex", alignItems: "flex-start", gap: 12, padding: "10px 4px", borderBottom: "1px solid #F1F5F9", borderRadius: 8 }}
                  onMouseEnter={e => (e.currentTarget.style.background = "#F1F5F9")}
                  onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
                >
                  <div style={{ width: 28, height: 28, borderRadius: 7, background: s.bg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 1, cursor: "pointer" }}
                    onClick={() => { setReviewText(h.review_text); setReply(h.reply_text); setSentiment(h.sentiment); }}>
                    <Icon name={s.icon} size={13} style={{ color: s.color }} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0, cursor: "pointer" }}
                    onClick={() => { setReviewText(h.review_text); setReply(h.reply_text); setSentiment(h.sentiment); }}>
                    <div style={{ fontSize: 12, color: "#555", lineHeight: 1.5, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {h.review_text}
                    </div>
                    <div style={{ fontSize: 11, color: "#bbb", marginTop: 2 }}>{new Date(h.created_at).toLocaleDateString("ru-RU")}</div>
                  </div>
                  <button
                    onClick={e => handleDelete(h.id, e)}
                    disabled={deletingId === h.id}
                    style={{ width: 28, height: 28, borderRadius: 7, border: "none", background: "transparent", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, opacity: deletingId === h.id ? 0.4 : 1 }}
                    onMouseEnter={e => (e.currentTarget.style.background = "hsl(0,75%,97%)")}
                    onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
                  >
                    <Icon name={deletingId === h.id ? "Loader" : "Trash2"} size={13} style={{ color: "hsl(0,75%,55%)", animation: deletingId === h.id ? "spin 1s linear infinite" : "none" }} />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}