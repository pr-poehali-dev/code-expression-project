import { useState } from "react";

const ACCENT = "hsl(185, 85%, 32%)";
const ACCENT_DARK = "hsl(185, 85%, 26%)";
const ACCENT_SHADOW = "hsla(185, 85%, 32%, 0.3)";
const ACCENT_SHADOW_HOVER = "hsla(185, 85%, 32%, 0.45)";

const SEND_URL = "https://functions.poehali.dev/9d9058e7-5c92-49c1-ad75-68ed3ea30bb1";

export default function PartnerFormaSection() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [format, setFormat] = useState("");
  const [city, setCity] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim() || !format) return;
    if (!agreed) { setError("Необходимо дать согласие на обработку данных"); return; }
    setLoading(true);
    setError("");
    try {
      const res = await fetch(SEND_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          contact: phone,
          message: `Заявка на партнёрство\nФормат: ${format}\nГород: ${city || "не указан"}\nТелефон: ${phone}`,
        }),
      });
      if (res.ok) setSent(true);
      else setError("Не удалось отправить. Попробуйте ещё раз.");
    } catch {
      setError("Ошибка сети. Проверьте подключение.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="partner-form" style={{ paddingBottom: 100 }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px" }}>
        <div style={{
          background: "#fff", borderRadius: 28,
          overflow: "hidden", boxShadow: "0 8px 48px rgba(0,0,0,0.08)",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
        }}>
          {/* Left */}
          <div style={{ padding: "clamp(32px, 5vw, 64px) clamp(24px, 4vw, 56px)", display: "flex", flexDirection: "column", justifyContent: "center" }}>
            <div style={{ display: "inline-block", fontSize: 11, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: ACCENT, marginBottom: 20 }}>
              Заявка на партнёрство
            </div>
            <h2 style={{ fontFamily: "Cormorant, serif", fontSize: "clamp(26px, 3.5vw, 44px)", fontWeight: 700, color: "#1a1a1a", marginBottom: 20, lineHeight: 1.15 }}>
              Начните<br />зарабатывать<br />с МассоПро
            </h2>
            <p style={{ fontSize: "clamp(14px, 1.8vw, 16px)", lineHeight: 1.75, color: "#5a5a5a", marginBottom: 32 }}>
              Оставьте заявку — мы проведём индивидуальную консультацию и подберём оптимальный формат партнёрства именно для вас.
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {[
                { icon: "⚡", text: "Ответим в течение рабочего дня" },
                { icon: "📞", text: "Бесплатная консультация без обязательств" },
                { icon: "💼", text: "Гибкие условия под ваши возможности" },
              ].map((item, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <span style={{ fontSize: 20 }}>{item.icon}</span>
                  <span style={{ fontSize: 14, color: "#3a3a3a", lineHeight: 1.5 }}>{item.text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right — Form */}
          <div style={{ background: "#f8f8f6", padding: "clamp(32px, 5vw, 64px) clamp(24px, 4vw, 56px)", display: "flex", flexDirection: "column", justifyContent: "center" }}>
            {sent ? (
              <div style={{ textAlign: "center", padding: "32px 0" }}>
                <div style={{ fontSize: 56, marginBottom: 20 }}>🎉</div>
                <div style={{ fontFamily: "Cormorant, serif", fontSize: "clamp(22px, 4vw, 30px)", fontWeight: 700, color: "#1a1a1a", marginBottom: 12 }}>Заявка отправлена!</div>
                <p style={{ fontSize: 15, color: "#5a5a5a", lineHeight: 1.65 }}>
                  Наш менеджер свяжется с вами в течение рабочего дня и расскажет об условиях партнёрства.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                <div>
                  <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#3a3a3a", marginBottom: 6 }}>Ваше имя</label>
                  <input
                    value={name} onChange={e => setName(e.target.value)}
                    placeholder="Александр Петров" required
                    style={{ width: "100%", padding: "12px 16px", borderRadius: 10, border: "1.5px solid #e0e0e0", fontSize: 15, outline: "none", boxSizing: "border-box", fontFamily: "Montserrat, sans-serif", background: "#fff" }}
                    onFocus={e => (e.currentTarget.style.borderColor = ACCENT)}
                    onBlur={e => (e.currentTarget.style.borderColor = "#e0e0e0")}
                  />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#3a3a3a", marginBottom: 6 }}>Телефон</label>
                  <input
                    value={phone} onChange={e => setPhone(e.target.value)}
                    placeholder="+7 (___) ___-__-__" required
                    style={{ width: "100%", padding: "12px 16px", borderRadius: 10, border: "1.5px solid #e0e0e0", fontSize: 15, outline: "none", boxSizing: "border-box", fontFamily: "Montserrat, sans-serif", background: "#fff" }}
                    onFocus={e => (e.currentTarget.style.borderColor = ACCENT)}
                    onBlur={e => (e.currentTarget.style.borderColor = "#e0e0e0")}
                  />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#3a3a3a", marginBottom: 6 }}>Формат партнёрства</label>
                  <select
                    value={format} onChange={e => setFormat(e.target.value)} required
                    style={{ width: "100%", padding: "12px 16px", borderRadius: 10, border: "1.5px solid #e0e0e0", fontSize: 15, outline: "none", background: "#fff", boxSizing: "border-box", fontFamily: "Montserrat, sans-serif", color: format ? "#1a1a1a" : "#999" }}
                  >
                    <option value="" disabled>Выберите формат</option>
                    <option value="Реферальный партнёр">Реферальный партнёр</option>
                    <option value="Агент по внедрению">Агент по внедрению</option>
                    <option value="Региональный представитель">Региональный представитель</option>
                    <option value="Не определился">Ещё не определился</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#3a3a3a", marginBottom: 6 }}>Город (необязательно)</label>
                  <input
                    value={city} onChange={e => setCity(e.target.value)}
                    placeholder="Москва"
                    style={{ width: "100%", padding: "12px 16px", borderRadius: 10, border: "1.5px solid #e0e0e0", fontSize: 15, outline: "none", boxSizing: "border-box", fontFamily: "Montserrat, sans-serif", background: "#fff" }}
                    onFocus={e => (e.currentTarget.style.borderColor = ACCENT)}
                    onBlur={e => (e.currentTarget.style.borderColor = "#e0e0e0")}
                  />
                </div>
                <label style={{ display: "flex", alignItems: "flex-start", gap: 10, cursor: "pointer" }}>
                  <input
                    type="checkbox" checked={agreed} onChange={e => setAgreed(e.target.checked)}
                    style={{ marginTop: 2, width: 16, height: 16, accentColor: ACCENT, flexShrink: 0, cursor: "pointer" }}
                  />
                  <span style={{ fontSize: 12, color: "#666", lineHeight: 1.6 }}>
                    Я согласен с <a href="/privacy" style={{ color: ACCENT }} target="_blank">политикой конфиденциальности</a> и <a href="/offer" style={{ color: ACCENT }} target="_blank">офертой</a>
                  </span>
                </label>
                <button
                  type="submit"
                  style={{ marginTop: 4, background: ACCENT, color: "#fff", padding: "14px 28px", borderRadius: 12, fontSize: 15, fontWeight: 600, border: "none", cursor: "pointer", transition: "all 0.25s ease", boxShadow: `0 4px 20px ${ACCENT_SHADOW}`, fontFamily: "Montserrat, sans-serif" }}
                  onMouseEnter={e => { const el = e.currentTarget as HTMLButtonElement; el.style.background = ACCENT_DARK; el.style.boxShadow = `0 8px 32px ${ACCENT_SHADOW_HOVER}`; el.style.transform = "translateY(-2px)"; }}
                  onMouseLeave={e => { const el = e.currentTarget as HTMLButtonElement; el.style.background = ACCENT; el.style.boxShadow = `0 4px 20px ${ACCENT_SHADOW}`; el.style.transform = "translateY(0)"; }}
                >
                  {loading ? "Отправляем..." : "Стать партнёром МассоПро"}
                </button>
                {error && <p style={{ margin: 0, fontSize: 13, color: "#e53e3e", textAlign: "center" }}>{error}</p>}
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
