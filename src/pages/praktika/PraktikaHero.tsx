import { GOLD, GOLD_LIGHT, DARK, DARK2, TEXT, TEXT_SUB, FadeIn } from "./PraktikaShared";

export default function PraktikaHero() {
  return (
    <section className="pr-hero-pad" style={{ borderBottom: `1px solid rgba(255,255,255,0.06)` }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px" }}>
        <div className="pr-hero">
          {/* LEFT */}
          <div>
            <FadeIn delay={0}>
              <div style={{
                display: "inline-flex", alignItems: "center", gap: 8,
                background: GOLD_LIGHT, border: `1px solid ${GOLD}30`,
                borderRadius: 20, padding: "6px 16px", marginBottom: 24,
              }}>
                <div style={{ width: 6, height: 6, borderRadius: "50%", background: GOLD }} />
                <span style={{ fontSize: 11, fontWeight: 700, color: GOLD, letterSpacing: "0.16em", textTransform: "uppercase" as const }}>
                  Тариф №1 · 90 900 ₽
                </span>
              </div>
            </FadeIn>

            <FadeIn delay={80}>
              <h1 style={{
                fontFamily: "Cormorant, serif",
                fontSize: "clamp(32px, 5vw, 62px)",
                fontWeight: 700, lineHeight: 1.1,
                color: "#fff", marginBottom: 24, letterSpacing: "-0.5px",
              }}>
                Сильная практика начинается не с техник.{" "}
                <span style={{ color: GOLD }}>А с мышления специалиста.</span>
              </h1>
            </FadeIn>

            <FadeIn delay={160}>
              <p style={{ fontSize: "clamp(14px, 1.8vw, 16px)", lineHeight: 1.85, color: TEXT_SUB, marginBottom: 14, maxWidth: 520 }}>
                Система для специалистов по телу и состояниям, которые хотят:
              </p>
              <div style={{ display: "flex", flexDirection: "column" as const, gap: 8, marginBottom: 36 }}>
                {[
                  "уверенно работать с людьми",
                  "выйти из хаоса в систему",
                  "повысить стоимость услуг",
                  "привлекать платёжеспособных клиентов",
                  "стать специалистом, которого рекомендуют",
                ].map((item, i) => (
                  <div key={i} style={{ display: "flex", gap: 10, alignItems: "center" }}>
                    <div style={{ width: 5, height: 5, borderRadius: "50%", background: GOLD, flexShrink: 0 }} />
                    <span style={{ fontSize: "clamp(13px, 1.6vw, 14px)", color: TEXT_SUB }}>{item}</span>
                  </div>
                ))}
              </div>
            </FadeIn>

            <FadeIn delay={240}>
              <div style={{ display: "flex", gap: 12, flexWrap: "wrap" as const }}>
                <a href="#application" style={{
                  display: "inline-block", background: GOLD, color: DARK,
                  padding: "14px 28px", borderRadius: 12,
                  fontSize: "clamp(13px, 1.5vw, 14px)", fontWeight: 700,
                  textDecoration: "none", transition: "all 0.25s", letterSpacing: "0.04em",
                }}
                  onMouseEnter={e => { const el = e.currentTarget as HTMLAnchorElement; el.style.opacity = "0.88"; el.style.transform = "translateY(-2px)"; }}
                  onMouseLeave={e => { const el = e.currentTarget as HTMLAnchorElement; el.style.opacity = "1"; el.style.transform = "translateY(0)"; }}
                >Получить доступ</a>
                <a href="#program" style={{
                  display: "inline-block", background: "transparent", color: TEXT,
                  padding: "14px 24px", borderRadius: 12,
                  fontSize: "clamp(13px, 1.5vw, 14px)", fontWeight: 600,
                  textDecoration: "none", transition: "all 0.25s",
                  border: "1px solid rgba(255,255,255,0.15)",
                }}
                  onMouseEnter={e => { const el = e.currentTarget as HTMLAnchorElement; el.style.borderColor = "rgba(255,255,255,0.35)"; el.style.transform = "translateY(-2px)"; }}
                  onMouseLeave={e => { const el = e.currentTarget as HTMLAnchorElement; el.style.borderColor = "rgba(255,255,255,0.15)"; el.style.transform = "translateY(0)"; }}
                >Посмотреть программу</a>
              </div>
            </FadeIn>
          </div>

          {/* RIGHT — preview card */}
          <FadeIn delay={200}>
            <div style={{ background: DARK2, borderRadius: 20, border: "1px solid rgba(255,255,255,0.06)", overflow: "hidden" }}>
              <div style={{ padding: "24px 22px", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                <div style={{ fontSize: 10, color: TEXT_SUB, letterSpacing: "0.12em", textTransform: "uppercase" as const, marginBottom: 14 }}>
                  Программа «Практика»
                </div>
                <div style={{ display: "flex", flexDirection: "column" as const, gap: 10 }}>
                  {["Мышление специалиста", "Работа с ограничениями", "Привлечение клиентов", "Ценообразование", "Работа с премиум-аудиторией"].map((m, i) => (
                    <div key={i} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <div style={{
                        width: 26, height: 26, borderRadius: 7,
                        background: GOLD_LIGHT, border: `1px solid ${GOLD}25`,
                        display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                      }}>
                        <div style={{ width: 6, height: 6, borderRadius: "50%", background: GOLD }} />
                      </div>
                      <span style={{ fontSize: 13, color: TEXT_SUB }}>{m}</span>
                    </div>
                  ))}
                  <div style={{ fontSize: 12, color: `${GOLD}60`, marginTop: 2 }}>+ ещё 4 модуля...</div>
                </div>
              </div>
              <div style={{ padding: "20px 22px" }}>
                <div style={{ fontFamily: "Cormorant, serif", fontSize: 34, fontWeight: 700, color: GOLD, marginBottom: 4 }}>90 900 ₽</div>
                <div style={{ fontSize: 12, color: TEXT_SUB, marginBottom: 18 }}>Доступ 12 месяцев</div>
                <div style={{ display: "flex", gap: 14, flexWrap: "wrap" as const }}>
                  {["9 модулей", "12 мес. доступа", "Техники и схемы"].map((f, i) => (
                    <div key={i} style={{ fontSize: 11, color: TEXT_SUB, textAlign: "center" as const }}>
                      <div style={{ width: 8, height: 8, borderRadius: "50%", background: `${GOLD}60`, margin: "0 auto 5px" }} />
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
