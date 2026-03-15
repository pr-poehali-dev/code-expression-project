import { useState } from "react";

const ACCENT = "hsl(185, 85%, 32%)";
const ACCENT_DARK = "hsl(185, 85%, 26%)";
const ACCENT_SHADOW = "hsla(185, 85%, 32%, 0.3)";
const ACCENT_SHADOW_HOVER = "hsla(185, 85%, 32%, 0.45)";

const SEND_URL = "https://functions.poehali.dev/9d9058e7-5c92-49c1-ad75-68ed3ea30bb1";

export default function PartnerFormaSection() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [about, setAbout] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) return;
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
          message: `Заявка на партнёрство\nТелефон: ${phone}${about ? `\nО себе: ${about}` : ""}`,
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
    <>
      {/* Форма заявки */}
      <section id="partner-form" style={{ paddingBottom: 60 }}>
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
              <h2 style={{ fontFamily: "Cormorant, serif", fontSize: "clamp(26px, 3.5vw, 44px)", fontWeight: 700, color: "#1a1a1a", marginBottom: 16, lineHeight: 1.15 }}>
                Расскажите о себе, и мы подключим вас к программе в течение рабочего дня.
              </h2>
            </div>

            {/* Right — Form */}
            <div style={{ background: "#f8f8f6", padding: "clamp(32px, 5vw, 64px) clamp(24px, 4vw, 56px)", display: "flex", flexDirection: "column", justifyContent: "center" }}>
              {sent ? (
                <div style={{ textAlign: "center", padding: "32px 0" }}>
                  <div style={{ fontSize: 56, marginBottom: 20 }}>🎉</div>
                  <div style={{ fontFamily: "Cormorant, serif", fontSize: "clamp(22px, 4vw, 30px)", fontWeight: 700, color: "#1a1a1a", marginBottom: 12 }}>Заявка отправлена!</div>
                  <p style={{ fontSize: 15, color: "#5a5a5a", lineHeight: 1.65 }}>
                    Наш менеджер свяжется с вами в течение рабочего дня и подключит к партнёрской программе.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                  <div>
                    <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#3a3a3a", marginBottom: 6 }}>Ваше имя</label>
                    <input
                      value={name} onChange={e => setName(e.target.value)}
                      placeholder="Иван Петров" required
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
                    <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#3a3a3a", marginBottom: 6 }}>Расскажите о себе (необязательно)</label>
                    <textarea
                      value={about} onChange={e => setAbout(e.target.value)}
                      placeholder="Чем занимаетесь, как планируете привлекать салоны..."
                      rows={3}
                      style={{ width: "100%", padding: "12px 16px", borderRadius: 10, border: "1.5px solid #e0e0e0", fontSize: 15, outline: "none", boxSizing: "border-box", fontFamily: "Montserrat, sans-serif", background: "#fff", resize: "vertical" }}
                      onFocus={e => (e.currentTarget.style.borderColor = ACCENT)}
                      onBlur={e => (e.currentTarget.style.borderColor = "#e0e0e0")}
                    />
                  </div>
                  <button
                    type="submit"
                    style={{ marginTop: 4, background: ACCENT, color: "#fff", padding: "14px 28px", borderRadius: 12, fontSize: 15, fontWeight: 600, border: "none", cursor: "pointer", transition: "all 0.25s ease", boxShadow: `0 4px 20px ${ACCENT_SHADOW}`, fontFamily: "Montserrat, sans-serif" }}
                    onMouseEnter={e => { const el = e.currentTarget as HTMLButtonElement; el.style.background = ACCENT_DARK; el.style.boxShadow = `0 8px 32px ${ACCENT_SHADOW_HOVER}`; el.style.transform = "translateY(-2px)"; }}
                    onMouseLeave={e => { const el = e.currentTarget as HTMLButtonElement; el.style.background = ACCENT; el.style.boxShadow = `0 4px 20px ${ACCENT_SHADOW}`; el.style.transform = "translateY(0)"; }}
                  >
                    {loading ? "Отправляем..." : "Стать партнёром"}
                  </button>
                  <label style={{ display: "flex", alignItems: "flex-start", gap: 10, cursor: "pointer" }}>
                    <input
                      type="checkbox" checked={agreed} onChange={e => setAgreed(e.target.checked)}
                      style={{ marginTop: 2, width: 16, height: 16, accentColor: ACCENT, flexShrink: 0, cursor: "pointer" }}
                    />
                    <span style={{ fontSize: 12, color: "#666", lineHeight: 1.6 }}>
                      Я согласен с <a href="/privacy" style={{ color: ACCENT }} target="_blank">политикой конфиденциальности</a> и <a href="/offer" style={{ color: ACCENT }} target="_blank">офертой</a>
                    </span>
                  </label>
                  {error && <p style={{ margin: 0, fontSize: 13, color: "#e53e3e", textAlign: "center" }}>{error}</p>}
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Блок кабинета */}
      <section id="cabinet" style={{ paddingBottom: 100 }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px" }}>
          <div style={{ background: "#1a1a1a", borderRadius: 24, padding: "clamp(32px, 4vw, 48px) clamp(24px, 4vw, 48px)", display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: 24 }}>
            <div>
              <div style={{ fontFamily: "Cormorant, serif", fontSize: "clamp(20px, 3vw, 28px)", fontWeight: 700, color: "#fff", marginBottom: 8 }}>
                Уже являетесь партнёром?
              </div>
              <p style={{ fontSize: 14, color: "rgba(255,255,255,0.55)", margin: 0, lineHeight: 1.6 }}>
                Войдите в личный кабинет, чтобы отслеживать активации промокода, начисленные комиссии и историю выплат.
              </p>
            </div>
            <a
              href="#"
              style={{ display: "inline-flex", alignItems: "center", gap: 6, color: ACCENT, fontSize: 15, fontWeight: 700, textDecoration: "none", padding: "14px 28px", borderRadius: 12, border: `2px solid ${ACCENT}`, whiteSpace: "nowrap", transition: "all 0.2s" }}
              onMouseEnter={e => { const el = e.currentTarget as HTMLAnchorElement; el.style.background = ACCENT; el.style.color = "#fff"; }}
              onMouseLeave={e => { const el = e.currentTarget as HTMLAnchorElement; el.style.background = "transparent"; el.style.color = ACCENT; }}
            >
              Войти в кабинет →
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
