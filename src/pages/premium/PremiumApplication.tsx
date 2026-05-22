import { useState } from "react";
import { BLUE, BLUE_LIGHT, BLUE_BORDER, DARK, DARK2, DARK3, DARK4, TEXT_SUB, FadeIn, BlueLine, SEND_URL } from "./PremiumShared";

function ApplicationForm() {
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !contact.trim()) return;
    if (!agreed) { setError("Необходимо дать согласие"); return; }
    setLoading(true); setError("");
    try {
      const res = await fetch(SEND_URL, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, contact, message: `Заявка на тариф «Премиальная практика» 290 000 ₽. Контакт: ${contact}` }),
      });
      if (res.ok) setSent(true); else setError("Не удалось отправить. Попробуйте ещё раз.");
    } catch { setError("Ошибка сети."); } finally { setLoading(false); }
  };

  if (sent) return (
    <div style={{ textAlign: "center", padding: "32px 0" }}>
      <div style={{
        width: 64, height: 64, borderRadius: "50%",
        background: BLUE_LIGHT, border: `1px solid ${BLUE_BORDER}`,
        display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px",
      }}>
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={BLUE} strokeWidth="2"><path d="M20 6 9 17l-5-5"/></svg>
      </div>
      <div style={{ fontFamily: "Cormorant, serif", fontSize: 24, fontWeight: 700, color: "#fff", marginBottom: 10 }}>Заявка принята</div>
      <p style={{ fontSize: 14, color: TEXT_SUB, lineHeight: 1.75 }}>Свяжемся в течение рабочего дня и обсудим доступ к программе.</p>
    </div>
  );

  const inputStyle: React.CSSProperties = {
    width: "100%", padding: "13px 15px", borderRadius: 10,
    border: "1px solid rgba(255,255,255,0.08)", fontSize: 14, outline: "none",
    boxSizing: "border-box", fontFamily: "Montserrat, sans-serif",
    background: "rgba(255,255,255,0.04)", color: "#fff", transition: "border-color 0.2s",
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      {[
        { l: "Имя", v: name, s: setName, p: "Ваше имя" },
        { l: "Телефон или Telegram", v: contact, s: setContact, p: "+7 или @username" },
      ].map(f => (
        <div key={f.l}>
          <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: TEXT_SUB, marginBottom: 6, letterSpacing: "0.06em" }}>{f.l}</label>
          <input value={f.v} onChange={e => f.s(e.target.value)} placeholder={f.p} required style={inputStyle}
            onFocus={e => (e.currentTarget.style.borderColor = `${BLUE}70`)}
            onBlur={e => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)")}
          />
        </div>
      ))}
      <label style={{ display: "flex", gap: 10, cursor: "pointer", alignItems: "flex-start" }}>
        <input type="checkbox" checked={agreed} onChange={e => setAgreed(e.target.checked)} style={{ marginTop: 2, accentColor: BLUE }} />
        <span style={{ fontSize: 12, color: TEXT_SUB, lineHeight: 1.6 }}>
          Согласен с{" "}
          <a href="/privacy" style={{ color: BLUE }} target="_blank">политикой конфиденциальности</a>
          {" "}и{" "}
          <a href="/offer" style={{ color: BLUE }} target="_blank">офертой</a>
        </span>
      </label>
      {error && <p style={{ margin: 0, fontSize: 12, color: "#ff6b6b" }}>{error}</p>}
      <button type="submit" style={{
        background: BLUE, color: DARK, padding: "15px 24px", borderRadius: 12,
        fontSize: 14, fontWeight: 700, border: "none", cursor: "pointer",
        transition: "all 0.25s", fontFamily: "Montserrat, sans-serif",
        letterSpacing: "0.04em", width: "100%",
      }}
        onMouseEnter={e => { const el = e.currentTarget as HTMLButtonElement; el.style.opacity = "0.85"; el.style.transform = "translateY(-2px)"; }}
        onMouseLeave={e => { const el = e.currentTarget as HTMLButtonElement; el.style.opacity = "1"; el.style.transform = "translateY(0)"; }}
      >{loading ? "Отправляем..." : "Получить доступ"}</button>
    </form>
  );
}

export default function PremiumApplication() {
  return (
    <section id="application" className="pm-section-pad" style={{ background: DARK2, paddingBottom: "100px" }}>
      <div style={{ maxWidth: 960, margin: "0 auto", padding: "0 24px" }}>
        <div className="pm-two-col">
          <FadeIn>
            <div>
              <BlueLine />
              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.16em", color: TEXT_SUB, textTransform: "uppercase" as const, marginBottom: 14 }}>
                Тариф №2
              </div>
              <h2 style={{ fontFamily: "Cormorant, serif", fontSize: "clamp(26px, 3.5vw, 40px)", fontWeight: 700, color: "#fff", margin: "0 0 8px" }}>
                «Премиальная практика»
              </h2>
              <div style={{ fontFamily: "Cormorant, serif", fontSize: "clamp(32px, 4.5vw, 48px)", fontWeight: 700, color: BLUE, lineHeight: 1, marginBottom: 8 }}>
                290 000 ₽
              </div>
              <div style={{ fontSize: 13, color: TEXT_SUB, marginBottom: 32 }}>
                Обучение 24 мес · инструменты 3 мес
              </div>

              {/* Что включено */}
              <div style={{ marginBottom: 20 }}>
                <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", color: TEXT_SUB, textTransform: "uppercase" as const, marginBottom: 14 }}>
                  Все материалы тарифа №1
                </div>
                <div style={{ display: "flex", flexDirection: "column" as const, gap: 9, marginBottom: 20 }}>
                  {[
                    "9 модулей программы",
                    "Диагностические техники",
                    "Работа с мышлением и ограничениями",
                    "Привлечение и работа с клиентами",
                  ].map((item, i) => (
                    <div key={i} style={{ display: "flex", gap: 9, alignItems: "flex-start" }}>
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="2.5" style={{ flexShrink: 0, marginTop: 1 }}><path d="M20 6 9 17l-5-5"/></svg>
                      <span style={{ fontSize: 13, color: TEXT_SUB }}>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ borderTop: `1px solid ${BLUE_BORDER}`, paddingTop: 18 }}>
                <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", color: BLUE, textTransform: "uppercase" as const, marginBottom: 14 }}>
                  Дополнительно
                </div>
                <div style={{ display: "flex", flexDirection: "column" as const, gap: 9 }}>
                  {[
                    "5 личных встреч",
                    "Внутренний чат",
                    "Интерактивная карта тела",
                    "ИИ-анализатор клиента",
                    "Конструктор техник",
                    "Диагностический калькулятор",
                    "Симулятор диалогов",
                  ].map((item, i) => (
                    <div key={i} style={{ display: "flex", gap: 9, alignItems: "flex-start" }}>
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={BLUE} strokeWidth="2.5" style={{ flexShrink: 0, marginTop: 1 }}><path d="M20 6 9 17l-5-5"/></svg>
                      <span style={{ fontSize: 13, color: TEXT_SUB }}>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </FadeIn>

          <FadeIn delay={140}>
            <div style={{
              background: DARK3, borderRadius: 20, padding: "32px 28px",
              border: `1px solid ${BLUE_BORDER}`,
              boxShadow: `0 8px 40px rgba(74,158,187,0.08)`,
            }}>
              {/* Glass header */}
              <div style={{
                padding: "14px 18px", borderRadius: 12, marginBottom: 24,
                background: `linear-gradient(135deg, ${DARK4}, ${DARK3})`,
                border: "1px solid rgba(255,255,255,0.05)",
              }}>
                <div style={{ fontSize: 11, color: TEXT_SUB, letterSpacing: "0.08em", marginBottom: 4 }}>Тариф</div>
                <div style={{ fontSize: 14, fontWeight: 700, color: "#fff" }}>Премиальная практика</div>
              </div>
              <ApplicationForm />
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
