import {
  TEAL, TEAL_GLASS, TEAL_BORD, TEAL_DARK,
  DARK, DARK2, DARK3, DARK4,
  TEXT, TEXT_SUB, FadeIn, TealLine,
  TARIFS,
} from "./FreeTarifShared";

// ── Кнопка перехода на coming-soon ────────────────────────────────────────────
function FreeForm() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <p style={{ margin: 0, fontSize: 14, color: TEXT_SUB, lineHeight: 1.7 }}>
        Платформа готовится к запуску. Оставьте заявку сейчас — и когда откроемся, вы получите бесплатный доступ <strong style={{ color: "#fff" }}>плюс скидку 70%</strong> на любой платный тариф.
      </p>
      <a href="/coming-soon" style={{
        display: "block", textAlign: "center", textDecoration: "none",
        background: TEAL, color: DARK, padding: "15px 24px", borderRadius: 12,
        fontSize: 14, fontWeight: 700, fontFamily: "Montserrat, sans-serif",
        letterSpacing: "0.04em", transition: "all 0.3s",
        boxShadow: "0 4px 20px rgba(0,198,188,0.22)",
      }}
        onMouseEnter={e => { const el = e.currentTarget as HTMLAnchorElement; el.style.background = TEAL_DARK; el.style.transform = "translateY(-2px)"; }}
        onMouseLeave={e => { const el = e.currentTarget as HTMLAnchorElement; el.style.background = TEAL; el.style.transform = "translateY(0)"; }}
      >
        Получить бесплатный доступ
      </a>
    </div>
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
                Это только начало
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
                  <span style={{ color: TEAL }}>с внутреннего состояния специалиста</span>
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