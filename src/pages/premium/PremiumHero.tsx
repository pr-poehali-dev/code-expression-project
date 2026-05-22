import { BLUE, BLUE_LIGHT, BLUE_BORDER, DARK, DARK2, DARK3, TEXT, TEXT_SUB, FadeIn } from "./PremiumShared";

export default function PremiumHero() {
  return (
    <section className="pm-hero-pad" style={{ borderBottom: `1px solid rgba(255,255,255,0.05)`, position: "relative" as const, overflow: "hidden" }}>
      {/* Фоновый градиент-акцент */}
      <div style={{
        position: "absolute" as const, top: 0, left: 0, right: 0, bottom: 0,
        background: `radial-gradient(ellipse at 70% 30%, rgba(74,158,187,0.06) 0%, transparent 60%)`,
        pointerEvents: "none",
      }} />

      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px", position: "relative" as const }}>
        <div className="pm-hero">
          {/* LEFT */}
          <div>
            <FadeIn delay={0}>
              <div style={{
                display: "inline-flex", alignItems: "center", gap: 8,
                background: BLUE_LIGHT, border: `1px solid ${BLUE_BORDER}`,
                borderRadius: 20, padding: "6px 16px", marginBottom: 28,
              }}>
                <div style={{ width: 6, height: 6, borderRadius: "50%", background: BLUE }} />
                <span style={{ fontSize: 11, fontWeight: 700, color: BLUE, letterSpacing: "0.16em", textTransform: "uppercase" as const }}>
                  Тариф №2 · 290 000 ₽
                </span>
              </div>
            </FadeIn>

            <FadeIn delay={80}>
              <h1 style={{
                fontFamily: "Cormorant, serif",
                fontSize: "clamp(30px, 4.5vw, 58px)",
                fontWeight: 700, lineHeight: 1.1,
                color: "#fff", marginBottom: 24, letterSpacing: "-0.5px",
              }}>
                Недостаточно просто владеть техниками.{" "}
                <span style={{ color: BLUE }}>Важно, кем становится специалист рядом с клиентом.</span>
              </h1>
            </FadeIn>

            <FadeIn delay={160}>
              <p style={{ fontSize: "clamp(13px, 1.6vw, 15px)", lineHeight: 1.85, color: TEXT_SUB, marginBottom: 14, maxWidth: 500 }}>
                Программа для специалистов, которые хотят:
              </p>
              <div style={{ display: "flex", flexDirection: "column" as const, gap: 9, marginBottom: 36 }}>
                {[
                  "выйти на высокий чек",
                  "работать с платёжеспособной аудиторией",
                  "выстроить сильную частную практику",
                  "получить современные ИИ-инструменты",
                  "стать специалистом, которого рекомендуют",
                ].map((item, i) => (
                  <div key={i} style={{ display: "flex", gap: 10, alignItems: "center" }}>
                    <div style={{ width: 5, height: 5, borderRadius: "50%", background: BLUE, flexShrink: 0 }} />
                    <span style={{ fontSize: "clamp(13px, 1.5vw, 14px)", color: TEXT_SUB }}>{item}</span>
                  </div>
                ))}
              </div>
            </FadeIn>

            <FadeIn delay={240}>
              <div style={{ display: "flex", gap: 12, flexWrap: "wrap" as const }}>
                <a href="#application" style={{
                  display: "inline-block", background: BLUE, color: DARK,
                  padding: "14px 28px", borderRadius: 12,
                  fontSize: "clamp(13px, 1.4vw, 14px)", fontWeight: 700,
                  textDecoration: "none", transition: "all 0.25s", letterSpacing: "0.04em",
                }}
                  onMouseEnter={e => { const el = e.currentTarget as HTMLAnchorElement; el.style.opacity = "0.85"; el.style.transform = "translateY(-2px)"; }}
                  onMouseLeave={e => { const el = e.currentTarget as HTMLAnchorElement; el.style.opacity = "1"; el.style.transform = "translateY(0)"; }}
                >Получить доступ</a>
                <a href="#tools" style={{
                  display: "inline-block", background: "transparent", color: TEXT,
                  padding: "14px 22px", borderRadius: 12,
                  fontSize: "clamp(13px, 1.4vw, 14px)", fontWeight: 600,
                  textDecoration: "none", transition: "all 0.25s",
                  border: "1px solid rgba(255,255,255,0.12)",
                }}
                  onMouseEnter={e => { const el = e.currentTarget as HTMLAnchorElement; el.style.borderColor = "rgba(255,255,255,0.3)"; el.style.transform = "translateY(-2px)"; }}
                  onMouseLeave={e => { const el = e.currentTarget as HTMLAnchorElement; el.style.borderColor = "rgba(255,255,255,0.12)"; el.style.transform = "translateY(0)"; }}
                >Смотреть инструменты</a>
              </div>
            </FadeIn>
          </div>

          {/* RIGHT — preview card */}
          <FadeIn delay={220}>
            <div style={{
              background: DARK2, borderRadius: 20,
              border: "1px solid rgba(255,255,255,0.06)", overflow: "hidden",
            }}>
              {/* Header карточки */}
              <div style={{ padding: "22px 22px 18px", borderBottom: "1px solid rgba(255,255,255,0.05)", background: `linear-gradient(135deg, ${DARK3}, ${DARK2})` }}>
                <div style={{ fontSize: 10, color: TEXT_SUB, letterSpacing: "0.12em", textTransform: "uppercase" as const, marginBottom: 12 }}>
                  Премиальная практика
                </div>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" as const }}>
                  {["ИИ-инструменты", "5 встреч", "Карта тела", "Чат"].map((tag, i) => (
                    <span key={i} style={{
                      fontSize: 11, color: BLUE, background: BLUE_LIGHT,
                      border: `1px solid ${BLUE_BORDER}`, borderRadius: 20,
                      padding: "3px 10px", fontWeight: 600,
                    }}>{tag}</span>
                  ))}
                </div>
              </div>

              {/* Включено */}
              <div style={{ padding: "20px 22px", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                <div style={{ fontSize: 11, color: TEXT_SUB, marginBottom: 12, letterSpacing: "0.08em" }}>Входит в тариф</div>
                <div style={{ display: "flex", flexDirection: "column" as const, gap: 9 }}>
                  {[
                    "Всё из тарифа «Практика»",
                    "ИИ-анализатор клиента",
                    "Интерактивная карта тела",
                    "Симулятор диалогов",
                    "5 личных встреч",
                  ].map((item, i) => (
                    <div key={i} style={{ display: "flex", gap: 9, alignItems: "flex-start" }}>
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={BLUE} strokeWidth="2.5" style={{ flexShrink: 0, marginTop: 1 }}><path d="M20 6 9 17l-5-5"/></svg>
                      <span style={{ fontSize: 12, color: TEXT_SUB }}>{item}</span>
                    </div>
                  ))}
                  <div style={{ fontSize: 11, color: `${BLUE}70`, marginTop: 2 }}>+ ещё 3 инструмента...</div>
                </div>
              </div>

              {/* Цена */}
              <div style={{ padding: "20px 22px" }}>
                <div style={{ fontFamily: "Cormorant, serif", fontSize: 32, fontWeight: 700, color: BLUE, marginBottom: 4 }}>290 000 ₽</div>
                <div style={{ fontSize: 12, color: TEXT_SUB, marginBottom: 16 }}>Обучение 24 мес · инструменты 3 мес</div>
                <div style={{ display: "flex", gap: 12, flexWrap: "wrap" as const }}>
                  {["9 модулей", "5 встреч", "ИИ + карта"].map((f, i) => (
                    <div key={i} style={{ fontSize: 11, color: TEXT_SUB, textAlign: "center" as const }}>
                      <div style={{ width: 7, height: 7, borderRadius: "50%", background: `${BLUE}60`, margin: "0 auto 5px" }} />
                      {f}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
