import { GOLD, GOLD_LIGHT, DARK, DARK2, TEXT, TEXT_SUB, FadeIn } from "./PraktikaShared";

export default function PraktikaHero() {
  return (
    <section style={{ paddingTop: 140, paddingBottom: 100, borderBottom: `1px solid rgba(255,255,255,0.06)` }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px" }}>
        <div className="pr-hero">
          <div>
            <FadeIn delay={0}>
              <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: GOLD_LIGHT, border: `1px solid ${GOLD}30`, borderRadius: 20, padding: "6px 16px", marginBottom: 28 }}>
                <div style={{ width: 6, height: 6, borderRadius: "50%", background: GOLD }} />
                <span style={{ fontSize: 11, fontWeight: 700, color: GOLD, letterSpacing: "0.16em", textTransform: "uppercase" as const }}>Тариф №1 · 90 900 ₽</span>
              </div>
            </FadeIn>
            <FadeIn delay={80}>
              <h1 style={{ fontFamily: "Cormorant, serif", fontSize: "clamp(36px, 5vw, 62px)", fontWeight: 700, lineHeight: 1.08, color: "#fff", marginBottom: 28, letterSpacing: "-0.5px" }}>
                Сильная практика начинается не с техник.<br />
                <span style={{ color: GOLD }}>А с мышления специалиста.</span>
              </h1>
            </FadeIn>
            <FadeIn delay={160}>
              <p style={{ fontSize: 16, lineHeight: 1.85, color: TEXT_SUB, marginBottom: 16, maxWidth: 520 }}>
                Система для специалистов по телу и состояниям, которые хотят:
              </p>
              <div style={{ display: "flex", flexDirection: "column" as const, gap: 8, marginBottom: 40 }}>
                {[
                  "уверенно работать с людьми",
                  "выйти из хаоса в систему",
                  "повысить стоимость услуг",
                  "привлекать платёжеспособных клиентов",
                  "стать специалистом, которого рекомендуют",
                ].map((item, i) => (
                  <div key={i} style={{ display: "flex", gap: 10, alignItems: "center" }}>
                    <div style={{ width: 5, height: 5, borderRadius: "50%", background: GOLD, flexShrink: 0 }} />
                    <span style={{ fontSize: 14, color: TEXT_SUB }}>{item}</span>
                  </div>
                ))}
              </div>
            </FadeIn>
            <FadeIn delay={240}>
              <div style={{ display: "flex", gap: 14, flexWrap: "wrap" as const }}>
                <a href="#application"
                  style={{ display: "inline-block", background: GOLD, color: DARK, padding: "15px 32px", borderRadius: 12, fontSize: 14, fontWeight: 700, textDecoration: "none", transition: "all 0.25s", letterSpacing: "0.04em" }}
                  onMouseEnter={e => { const el = e.currentTarget as HTMLAnchorElement; el.style.opacity = "0.88"; el.style.transform = "translateY(-2px)"; }}
                  onMouseLeave={e => { const el = e.currentTarget as HTMLAnchorElement; el.style.opacity = "1"; el.style.transform = "translateY(0)"; }}
                >Получить доступ</a>
                <a href="#program"
                  style={{ display: "inline-block", background: "transparent", color: TEXT, padding: "15px 28px", borderRadius: 12, fontSize: 14, fontWeight: 600, textDecoration: "none", transition: "all 0.25s", border: "1px solid rgba(255,255,255,0.15)" }}
                  onMouseEnter={e => { const el = e.currentTarget as HTMLAnchorElement; el.style.borderColor = "rgba(255,255,255,0.35)"; el.style.transform = "translateY(-2px)"; }}
                  onMouseLeave={e => { const el = e.currentTarget as HTMLAnchorElement; el.style.borderColor = "rgba(255,255,255,0.15)"; el.style.transform = "translateY(0)"; }}
                >Посмотреть программу</a>
              </div>
            </FadeIn>
          </div>

          {/* Правая панель — визуал */}
          <FadeIn delay={200}>
            <div style={{ background: DARK2, borderRadius: 24, border: "1px solid rgba(255,255,255,0.06)", overflow: "hidden" }}>
              <div style={{ padding: "28px 24px", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                <div style={{ fontSize: 11, color: TEXT_SUB, letterSpacing: "0.1em", marginBottom: 14 }}>ПРОГРАММА «ПРАКТИКА»</div>
                <div style={{ display: "flex", flexDirection: "column" as const, gap: 12 }}>
                  {["Мышление специалиста", "Работа с ограничениями", "Привлечение клиентов", "Ценообразование", "Работа с премиум-аудиторией"].map((m, i) => (
                    <div key={i} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      <div style={{ width: 28, height: 28, borderRadius: 8, background: GOLD_LIGHT, border: `1px solid ${GOLD}25`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                        <div style={{ width: 6, height: 6, borderRadius: "50%", background: GOLD }} />
                      </div>
                      <span style={{ fontSize: 13, color: TEXT_SUB }}>{m}</span>
                    </div>
                  ))}
                  <div style={{ fontSize: 12, color: `${GOLD}60`, marginTop: 4 }}>+ ещё 4 модуля...</div>
                </div>
              </div>
              <div style={{ padding: "24px" }}>
                <div style={{ fontFamily: "Cormorant, serif", fontSize: 36, fontWeight: 700, color: GOLD, marginBottom: 4 }}>90 900 ₽</div>
                <div style={{ fontSize: 12, color: TEXT_SUB, marginBottom: 20 }}>Доступ 12 месяцев</div>
                <div style={{ display: "flex", gap: 16 }}>
                  {["9 модулей", "12 месяцев доступа", "Техники и схемы"].map((f, i) => (
                    <div key={i} style={{ fontSize: 11, color: TEXT_SUB, textAlign: "center" as const }}>
                      <div style={{ width: 8, height: 8, borderRadius: "50%", background: `${GOLD}60`, margin: "0 auto 6px" }} />
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
