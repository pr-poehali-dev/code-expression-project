import { PEARL, PEARL_LIGHT, PEARL_BORDER, DARK, DARK2, DARK3, TEXT, TEXT_SUB, FadeIn } from "./EkspertShared";

export default function EkspertHero() {
  return (
    <section className="ex-hero-pad" style={{ borderBottom: `1px solid rgba(255,255,255,0.04)`, position: "relative" as const, overflow: "hidden" }}>
      {/* Фоновые блики */}
      <div style={{
        position: "absolute" as const, inset: 0, pointerEvents: "none",
        background: `radial-gradient(ellipse at 80% 20%, rgba(212,207,200,0.04) 0%, transparent 55%),
                     radial-gradient(ellipse at 20% 80%, rgba(212,207,200,0.02) 0%, transparent 45%)`,
      }} />

      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px", position: "relative" as const }}>
        <div className="ex-hero">
          {/* LEFT */}
          <div>
            <FadeIn delay={0}>
              <div style={{
                display: "inline-flex", alignItems: "center", gap: 8,
                background: PEARL_LIGHT, border: `1px solid ${PEARL_BORDER}`,
                borderRadius: 20, padding: "6px 16px", marginBottom: 28,
              }}>
                <div style={{ width: 6, height: 6, borderRadius: "50%", background: PEARL }} />
                <span style={{ fontSize: 11, fontWeight: 700, color: PEARL, letterSpacing: "0.16em", textTransform: "uppercase" as const }}>
                  Тариф №3 · VIP · 500 000 ₽
                </span>
              </div>
            </FadeIn>

            <FadeIn delay={80}>
              <h1 style={{
                fontFamily: "Cormorant, serif",
                fontSize: "clamp(30px, 4.5vw, 58px)",
                fontWeight: 700, lineHeight: 1.1,
                color: "#fff", marginBottom: 26, letterSpacing: "-0.5px",
              }}>
                Настоящая дорогая практика начинается там, где специалист становится{" "}
                <span style={{ color: PEARL }}>внутренне устойчивым</span>
              </h1>
            </FadeIn>

            <FadeIn delay={160}>
              <p style={{ fontSize: "clamp(13px, 1.5vw, 15px)", lineHeight: 1.85, color: TEXT_SUB, marginBottom: 14, maxWidth: 500 }}>
                Закрытая система для специалистов, которые хотят:
              </p>
              <div style={{ display: "flex", flexDirection: "column" as const, gap: 9, marginBottom: 36 }}>
                {[
                  "выйти на высокий уровень практики",
                  "уверенно работать с платежеспособной аудиторией",
                  "получить интеллектуальные инструменты нового поколения",
                  "выстроить стабильный высокий доход",
                  "стать специалистом, которого рекомендуют",
                ].map((item, i) => (
                  <div key={i} style={{ display: "flex", gap: 10, alignItems: "center" }}>
                    <div style={{ width: 5, height: 5, borderRadius: "50%", background: PEARL, flexShrink: 0 }} />
                    <span style={{ fontSize: "clamp(13px, 1.4vw, 14px)", color: TEXT_SUB }}>{item}</span>
                  </div>
                ))}
              </div>
            </FadeIn>

            <FadeIn delay={240}>
              <div style={{ display: "flex", gap: 12, flexWrap: "wrap" as const }}>
                <a href="/coming-soon" style={{
                  display: "inline-block", background: PEARL, color: DARK,
                  padding: "14px 28px", borderRadius: 12,
                  fontSize: "clamp(13px, 1.4vw, 14px)", fontWeight: 700,
                  textDecoration: "none", transition: "all 0.3s", letterSpacing: "0.04em",
                }}
                  onMouseEnter={e => { const el = e.currentTarget as HTMLAnchorElement; el.style.opacity = "0.82"; el.style.transform = "translateY(-2px)"; }}
                  onMouseLeave={e => { const el = e.currentTarget as HTMLAnchorElement; el.style.opacity = "1"; el.style.transform = "translateY(0)"; }}
                >Получить доступ</a>
                <a href="#tools" style={{
                  display: "inline-block", background: "transparent", color: TEXT,
                  padding: "14px 22px", borderRadius: 12,
                  fontSize: "clamp(13px, 1.4vw, 14px)", fontWeight: 600,
                  textDecoration: "none", transition: "all 0.3s",
                  border: "1px solid rgba(255,255,255,0.1)",
                }}
                  onMouseEnter={e => { const el = e.currentTarget as HTMLAnchorElement; el.style.borderColor = "rgba(255,255,255,0.28)"; el.style.transform = "translateY(-2px)"; }}
                  onMouseLeave={e => { const el = e.currentTarget as HTMLAnchorElement; el.style.borderColor = "rgba(255,255,255,0.1)"; el.style.transform = "translateY(0)"; }}
                >Смотреть систему</a>
              </div>
            </FadeIn>
          </div>

          {/* RIGHT — статусная карточка */}
          <FadeIn delay={220}>
            <div style={{
              background: `linear-gradient(145deg, ${DARK3}, ${DARK2})`,
              borderRadius: 22, border: "1px solid rgba(255,255,255,0.06)",
              overflow: "hidden",
              boxShadow: `0 24px 80px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.05)`,
            }}>
              {/* VIP header */}
              <div style={{
                padding: "20px 22px 16px",
                borderBottom: "1px solid rgba(255,255,255,0.05)",
                background: `linear-gradient(135deg, rgba(212,207,200,0.05), transparent)`,
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                  <span style={{ fontSize: 10, fontWeight: 700, color: PEARL, letterSpacing: "0.18em", textTransform: "uppercase" as const }}>
                    VIP · Эксперт
                  </span>
                  <span style={{
                    fontSize: 10, color: DARK, background: PEARL,
                    padding: "2px 8px", borderRadius: 20, fontWeight: 700, letterSpacing: "0.08em",
                  }}>БЕЗЛИМИТ</span>
                </div>
                <div style={{ display: "flex", flexWrap: "wrap" as const, gap: 6 }}>
                  {["Пожизненный доступ", "10 встреч", "Все инструменты"].map((tag, i) => (
                    <span key={i} style={{
                      fontSize: 11, color: PEARL, background: PEARL_LIGHT,
                      border: `1px solid ${PEARL_BORDER}`, borderRadius: 20, padding: "3px 10px", fontWeight: 600,
                    }}>{tag}</span>
                  ))}
                </div>
              </div>

              {/* Включено */}
              <div style={{ padding: "18px 22px", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                <div style={{ fontSize: 11, color: TEXT_SUB, marginBottom: 11, letterSpacing: "0.08em" }}>Система включает</div>
                <div style={{ display: "flex", flexDirection: "column" as const, gap: 8 }}>
                  {[
                    "Все из тарифов №1 и №2",
                    "Пожизненный доступ к платформе",
                    "Все обновления и новые модули",
                    "ИИ-инструменты без ограничений",
                    "10 персональных встреч",
                  ].map((item, i) => (
                    <div key={i} style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={PEARL} strokeWidth="2.5" style={{ flexShrink: 0, marginTop: 1 }}><path d="M20 6 9 17l-5-5"/></svg>
                      <span style={{ fontSize: 12, color: TEXT_SUB }}>{item}</span>
                    </div>
                  ))}
                  <div style={{ fontSize: 11, color: `${PEARL}55`, marginTop: 2 }}>+ полное сопровождение роста...</div>
                </div>
              </div>

              {/* Цена */}
              <div style={{ padding: "18px 22px" }}>
                <div style={{ fontFamily: "Cormorant, serif", fontSize: 30, fontWeight: 700, color: PEARL, marginBottom: 4 }}>
                  500 000 ₽
                </div>
                <div style={{ fontSize: 12, color: TEXT_SUB, marginBottom: 14 }}>Доступ без ограничений</div>
                <div style={{ display: "flex", gap: 12, flexWrap: "wrap" as const }}>
                  {["Пожизненно", "10 встреч", "Безлимит"].map((f, i) => (
                    <div key={i} style={{ fontSize: 11, color: TEXT_SUB }}>
                      <div style={{ width: 7, height: 7, borderRadius: "50%", background: `${PEARL}55`, margin: "0 auto 5px" }} />
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