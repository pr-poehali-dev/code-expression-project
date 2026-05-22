import { useState } from "react";
import { PEARL, PEARL_LIGHT, PEARL_BORDER, DARK, DARK2, DARK3, DARK4, TEXT_SUB, FadeIn, PearlLine, SEND_URL } from "./EkspertShared";

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
        body: JSON.stringify({ name, contact, message: `Заявка на тариф «Dok Диалог — Эксперт» 500 000 ₽. Контакт: ${contact}` }),
      });
      if (res.ok) setSent(true); else setError("Не удалось отправить. Попробуйте еще раз.");
    } catch { setError("Ошибка сети."); } finally { setLoading(false); }
  };

  if (sent) return (
    <div style={{ textAlign: "center", padding: "32px 0" }}>
      <div style={{
        width: 64, height: 64, borderRadius: "50%",
        background: PEARL_LIGHT, border: `1px solid ${PEARL_BORDER}`,
        display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px",
      }}>
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={PEARL} strokeWidth="2"><path d="M20 6 9 17l-5-5"/></svg>
      </div>
      <div style={{ fontFamily: "Cormorant, serif", fontSize: 24, fontWeight: 700, color: "#fff", marginBottom: 10 }}>Заявка принята</div>
      <p style={{ fontSize: 14, color: TEXT_SUB, lineHeight: 1.75 }}>Свяжемся в течение рабочего дня и обсудим доступ к программе</p>
    </div>
  );

  const inputStyle: React.CSSProperties = {
    width: "100%", padding: "13px 15px", borderRadius: 10,
    border: "1px solid rgba(255,255,255,0.07)", fontSize: 14, outline: "none",
    boxSizing: "border-box", fontFamily: "Montserrat, sans-serif",
    background: "rgba(255,255,255,0.03)", color: "#fff", transition: "border-color 0.25s",
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
            onFocus={e => (e.currentTarget.style.borderColor = `${PEARL}60`)}
            onBlur={e => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.07)")}
          />
        </div>
      ))}
      <label style={{ display: "flex", gap: 10, cursor: "pointer", alignItems: "flex-start" }}>
        <input type="checkbox" checked={agreed} onChange={e => setAgreed(e.target.checked)} style={{ marginTop: 2, accentColor: PEARL }} />
        <span style={{ fontSize: 12, color: TEXT_SUB, lineHeight: 1.6 }}>
          Согласен с{" "}
          <a href="/privacy" style={{ color: PEARL }} target="_blank">политикой конфиденциальности</a>
          {" "}и{" "}
          <a href="/offer" style={{ color: PEARL }} target="_blank">офертой</a>
        </span>
      </label>
      {error && <p style={{ margin: 0, fontSize: 12, color: "#ff6b6b" }}>{error}</p>}
      <button type="submit" style={{
        background: PEARL, color: DARK, padding: "15px 24px", borderRadius: 12,
        fontSize: 14, fontWeight: 700, border: "none", cursor: "pointer",
        transition: "all 0.3s", fontFamily: "Montserrat, sans-serif",
        letterSpacing: "0.04em", width: "100%",
      }}
        onMouseEnter={e => { const el = e.currentTarget as HTMLButtonElement; el.style.opacity = "0.82"; el.style.transform = "translateY(-2px)"; }}
        onMouseLeave={e => { const el = e.currentTarget as HTMLButtonElement; el.style.opacity = "1"; el.style.transform = "translateY(0)"; }}
      >{loading ? "Отправляем..." : "Получить доступ"}</button>
    </form>
  );
}

export default function EkspertApplication() {
  return (
    <section id="application" className="ex-section-pad" style={{ background: DARK2, paddingBottom: "100px" }}>
      <div style={{ maxWidth: 960, margin: "0 auto", padding: "0 24px" }}>
        <div className="ex-two-col">
          {/* Левая — состав тарифа */}
          <FadeIn>
            <div>
              <PearlLine />
              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.16em", color: TEXT_SUB, textTransform: "uppercase" as const, marginBottom: 14 }}>
                VIP · Тариф №3
              </div>
              <h2 style={{ fontFamily: "Cormorant, serif", fontSize: "clamp(26px, 3.5vw, 40px)", fontWeight: 700, color: "#fff", margin: "0 0 8px" }}>
                «Dok Диалог — Эксперт»
              </h2>
              <div style={{ fontFamily: "Cormorant, serif", fontSize: "clamp(32px, 4.5vw, 48px)", fontWeight: 700, color: PEARL, lineHeight: 1, marginBottom: 8 }}>
                500 000 ₽
              </div>
              <div style={{ fontSize: 13, color: TEXT_SUB, marginBottom: 32 }}>Доступ без ограничений · пожизненно</div>

              {/* Базовая часть */}
              <div style={{ marginBottom: 20 }}>
                <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", color: TEXT_SUB, textTransform: "uppercase" as const, marginBottom: 12 }}>
                  Все из тарифов №1 и №2
                </div>
                <div style={{ display: "flex", flexDirection: "column" as const, gap: 8, marginBottom: 18 }}>
                  {[
                    "9 модулей обучения",
                    "Вся программа тарифа «Практика»",
                    "ИИ-инструменты тарифа №2",
                    "5 встреч из тарифа №2",
                  ].map((item, i) => (
                    <div key={i} style={{ display: "flex", gap: 9, alignItems: "flex-start" }}>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="2.5" style={{ flexShrink: 0, marginTop: 1 }}><path d="M20 6 9 17l-5-5"/></svg>
                      <span style={{ fontSize: 13, color: TEXT_SUB }}>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Эксклюзивная часть */}
              <div style={{ borderTop: `1px solid ${PEARL_BORDER}`, paddingTop: 18 }}>
                <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", color: PEARL, textTransform: "uppercase" as const, marginBottom: 12 }}>
                  Дополнительно
                </div>
                <div style={{ display: "flex", flexDirection: "column" as const, gap: 9 }}>
                  {[
                    "10 персональных встреч (вместо 5)",
                    "Безлимитный доступ ко всем инструментам",
                    "Пожизненный доступ к платформе",
                    "Все обновления и новые модули",
                    "Полное сопровождение профессионального роста",
                  ].map((item, i) => (
                    <div key={i} style={{ display: "flex", gap: 9, alignItems: "flex-start" }}>
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={PEARL} strokeWidth="2.5" style={{ flexShrink: 0, marginTop: 1 }}><path d="M20 6 9 17l-5-5"/></svg>
                      <span style={{ fontSize: 13, color: TEXT_SUB }}>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </FadeIn>

          {/* Правая — форма */}
          <FadeIn delay={140}>
            <div style={{
              background: DARK3, borderRadius: 20, padding: "32px 28px",
              border: `1px solid ${PEARL_BORDER}`,
              boxShadow: `0 16px 60px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.04)`,
            }}>
              {/* Статусный заголовок */}
              <div style={{
                padding: "14px 18px", borderRadius: 12, marginBottom: 24,
                background: `linear-gradient(135deg, ${DARK4}, ${DARK3})`,
                border: `1px solid ${PEARL_BORDER}`,
                display: "flex", justifyContent: "space-between", alignItems: "center",
              }}>
                <div>
                  <div style={{ fontSize: 11, color: TEXT_SUB, letterSpacing: "0.08em", marginBottom: 3 }}>Тариф</div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: "#fff" }}>Dok Диалог — Эксперт</div>
                </div>
                <span style={{
                  fontSize: 10, color: DARK, background: PEARL,
                  padding: "2px 8px", borderRadius: 20, fontWeight: 700, letterSpacing: "0.06em",
                }}>VIP</span>
              </div>
              <ApplicationForm />
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}