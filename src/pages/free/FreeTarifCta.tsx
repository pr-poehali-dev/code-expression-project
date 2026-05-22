import { useState } from "react";
import {
  TEAL, TEAL_GLASS, TEAL_BORD, TEAL_DARK,
  DARK, DARK2, DARK3, DARK4,
  TEXT, TEXT_SUB, FadeIn, TealLine,
  TARIFS, SEND_URL,
} from "./FreeTarifShared";

// ── Форма записи на бесплатный доступ ────────────────────────────────────────
function FreeForm() {
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
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          contact,
          message: `Заявка на БЕСПЛАТНЫЙ тариф «Dok Диалог — Старт». Контакт: ${contact}`,
        }),
      });
      if (res.ok) setSent(true);
      else setError("Не удалось отправить. Попробуйте ещё раз.");
    } catch { setError("Ошибка сети."); }
    finally { setLoading(false); }
  };

  if (sent) return (
    <div style={{ textAlign: "center", padding: "32px 0" }}>
      <div style={{
        width: 60, height: 60, borderRadius: "50%",
        background: TEAL_GLASS, border: `1px solid ${TEAL_BORD}`,
        display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 18px",
      }}>
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke={TEAL} strokeWidth="2.5">
          <path d="M20 6 9 17l-5-5"/>
        </svg>
      </div>
      <div style={{ fontFamily: "Cormorant, serif", fontSize: 22, fontWeight: 700, color: "#fff", marginBottom: 8 }}>
        Заявка принята
      </div>
      <p style={{ fontSize: 13, color: TEXT_SUB, lineHeight: 1.75 }}>
        Свяжемся в течение рабочего дня и пришлём доступ к бесплатному блоку.
      </p>
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
          <input
            value={f.v} onChange={e => f.s(e.target.value)}
            placeholder={f.p} required style={inputStyle}
            onFocus={e => (e.currentTarget.style.borderColor = `${TEAL}60`)}
            onBlur={e => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.07)")}
          />
        </div>
      ))}

      <label style={{ display: "flex", gap: 10, cursor: "pointer", alignItems: "flex-start" }}>
        <input
          type="checkbox" checked={agreed} onChange={e => setAgreed(e.target.checked)}
          style={{ marginTop: 2, accentColor: TEAL }}
        />
        <span style={{ fontSize: 12, color: TEXT_SUB, lineHeight: 1.6 }}>
          Согласен с{" "}
          <a href="/privacy" style={{ color: TEAL }} target="_blank">политикой конфиденциальности</a>
          {" "}и{" "}
          <a href="/offer" style={{ color: TEAL }} target="_blank">офертой</a>
        </span>
      </label>

      {error && <p style={{ margin: 0, fontSize: 12, color: "#ff6b6b" }}>{error}</p>}

      <button
        type="submit"
        style={{
          background: TEAL, color: DARK, padding: "15px 24px", borderRadius: 12,
          fontSize: 14, fontWeight: 700, border: "none", cursor: "pointer",
          fontFamily: "Montserrat, sans-serif", letterSpacing: "0.04em",
          width: "100%", transition: "all 0.3s",
          boxShadow: `0 4px 20px rgba(0,198,188,0.22)`,
        }}
        onMouseEnter={e => {
          const el = e.currentTarget as HTMLButtonElement;
          el.style.background = TEAL_DARK;
          el.style.transform = "translateY(-2px)";
        }}
        onMouseLeave={e => {
          const el = e.currentTarget as HTMLButtonElement;
          el.style.background = TEAL;
          el.style.transform = "translateY(0)";
        }}
      >
        {loading ? "Отправляем..." : "Получить бесплатный доступ"}
      </button>
    </form>
  );
}

// ── Основной экспорт ─────────────────────────────────────────────────────────
export default function FreeTarifCta() {
  return (
    <>
      {/* ══ БЛОК 7: ПЕРЕХОД К ПЛАТНЫМ ══════════════════════════════════════ */}
      <section className="ft-section" style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 24px" }}>
          <FadeIn>
            <div style={{ textAlign: "center" as const, maxWidth: 560, margin: "0 auto 52px" }}>
              <TealLine />
              <h2 style={{
                fontFamily: "Cormorant, serif",
                fontSize: "clamp(28px, 4.5vw, 50px)",
                fontWeight: 700, color: "#fff", lineHeight: 1.1, margin: 0,
              }}>
                Это только начало.
              </h2>
              <p style={{ fontSize: 15, color: TEXT_SUB, lineHeight: 1.8, margin: "16px 0 0" }}>
                Внутри платных программ — глубокая работа с мышлением, профессиональная система, личное сопровождение и все интеллектуальные инструменты платформы.
              </p>
            </div>
          </FadeIn>

          <div className="ft-tarifs-grid">
            {TARIFS.map((t, i) => (
              <FadeIn key={i} delay={i * 70}>
                <a
                  href={t.href}
                  style={{
                    display: "block", textDecoration: "none",
                    background: DARK3, borderRadius: 18, padding: "26px 22px",
                    border: "1px solid rgba(255,255,255,0.05)",
                    transition: "border-color 0.3s, transform 0.3s, box-shadow 0.3s",
                  }}
                  onMouseEnter={e => {
                    const el = e.currentTarget as HTMLAnchorElement;
                    el.style.borderColor = TEAL_BORD;
                    el.style.transform = "translateY(-4px)";
                    el.style.boxShadow = `0 12px 48px rgba(0,0,0,0.35)`;
                  }}
                  onMouseLeave={e => {
                    const el = e.currentTarget as HTMLAnchorElement;
                    el.style.borderColor = "rgba(255,255,255,0.05)";
                    el.style.transform = "translateY(0)";
                    el.style.boxShadow = "none";
                  }}
                >
                  <div style={{ fontSize: 10, fontWeight: 700, color: TEXT_SUB, letterSpacing: "0.14em", textTransform: "uppercase" as const, marginBottom: 10 }}>
                    {t.note}
                  </div>
                  <div style={{ fontSize: 16, fontWeight: 700, color: "#fff", marginBottom: 8, lineHeight: 1.3 }}>{t.title}</div>
                  <div style={{ fontFamily: "Cormorant, serif", fontSize: 28, fontWeight: 700, color: TEAL, marginBottom: 14 }}>{t.price}</div>
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <span style={{ fontSize: 12, color: TEXT_SUB }}>Подробнее</span>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={TEAL} strokeWidth="2">
                      <path d="M5 12h14M12 5l7 7-7 7"/>
                    </svg>
                  </div>
                </a>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ══ БЛОК 8: ФИНАЛ + ФОРМА ══════════════════════════════════════════ */}
      <section id="application" className="ft-section" style={{ background: DARK2, paddingBottom: "100px" }}>
        <div style={{ maxWidth: 960, margin: "0 auto", padding: "0 24px" }}>
          <div className="ft-two-col">

            {/* Левая — финальный смысл */}
            <FadeIn>
              <div>
                <TealLine />
                <h2 style={{
                  fontFamily: "Cormorant, serif",
                  fontSize: "clamp(26px, 4vw, 46px)",
                  fontWeight: 700, color: "#fff", lineHeight: 1.1, marginBottom: 20,
                }}>
                  Сильная практика начинается{" "}
                  <span style={{ color: TEAL }}>с внутреннего состояния специалиста.</span>
                </h2>
                <p style={{ fontSize: 14, color: TEXT_SUB, lineHeight: 1.85, marginBottom: 30 }}>
                  Когда меняется мышление, уверенность и внутренняя опора — меняются клиенты, доход, качество практики и уровень жизни.
                </p>

                {/* Трансформационные пары */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2 }}>
                  {[
                    ["Хаос", "Система"],
                    ["Тревога", "Устойчивость"],
                    ["Выживание", "Рост"],
                    ["Стагнация", "Движение"],
                  ].map(([from, to], i) => (
                    <div key={i} style={{ padding: "14px 12px", background: DARK3, textAlign: "center" as const }}>
                      <div style={{ fontSize: 11, color: TEXT_SUB, marginBottom: 5 }}>{from}</div>
                      <div style={{ width: 14, height: 1, background: `${TEAL}35`, margin: "0 auto 5px" }} />
                      <div style={{ fontSize: 12, fontWeight: 700, color: TEAL }}>{to}</div>
                    </div>
                  ))}
                </div>
              </div>
            </FadeIn>

            {/* Правая — форма */}
            <FadeIn delay={130}>
              <div style={{
                background: DARK3, borderRadius: 20, padding: "32px 28px",
                border: `1px solid ${TEAL_BORD}`,
                boxShadow: `0 16px 60px rgba(0,0,0,0.4), 0 0 0 1px rgba(0,198,188,0.04), inset 0 1px 0 rgba(255,255,255,0.04)`,
              }}>
                {/* Заголовок формы */}
                <div style={{
                  padding: "14px 18px", borderRadius: 12, marginBottom: 24,
                  background: `linear-gradient(135deg, ${DARK4}, ${DARK3})`,
                  border: `1px solid rgba(255,255,255,0.05)`,
                  display: "flex", justifyContent: "space-between", alignItems: "center",
                }}>
                  <div>
                    <div style={{ fontSize: 11, color: TEXT_SUB, marginBottom: 3 }}>Тариф</div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: "#fff" }}>Dok Диалог — Старт</div>
                  </div>
                  <span style={{
                    fontSize: 10, color: DARK, background: TEAL,
                    padding: "2px 9px", borderRadius: 20, fontWeight: 700,
                  }}>0 ₽</span>
                </div>

                <FreeForm />
              </div>
            </FadeIn>
          </div>
        </div>
      </section>
    </>
  );
}
