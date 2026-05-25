import { BLUE, BLUE_LIGHT, BLUE_BORDER, DARK2, DARK3, DARK4, TEXT_SUB, FadeIn, BlueLine } from "./PremiumShared";

function EarlyAccessBlock() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <div style={{ width: 6, height: 6, borderRadius: "50%", background: BLUE, animation: "pulse 2s infinite" }} />
        <span style={{ fontSize: 11, fontWeight: 700, color: BLUE, letterSpacing: "0.14em", textTransform: "uppercase" as const }}>
          Специальное предложение
        </span>
      </div>
      <div style={{ fontFamily: "Cormorant, serif", fontSize: "clamp(20px,3vw,26px)", fontWeight: 700, color: "#fff", lineHeight: 1.2 }}>
        Платформа готовится к запуску —<br />
        <span style={{ color: BLUE }}>забронируйте скидку 70%</span>
      </div>
      {[
        "Оставьте заявку до открытия — получите тариф со скидкой 70% от стоимости.",
        "Это единственная скидка за всё время существования платформы. После запуска цена станет полной навсегда.",
      ].map((text, i) => (
        <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={BLUE} strokeWidth="2.5" style={{ flexShrink: 0, marginTop: 2 }}><path d="M20 6 9 17l-5-5"/></svg>
          <span style={{ fontSize: 13, color: TEXT_SUB, lineHeight: 1.7 }}>{text}</span>
        </div>
      ))}
      <a href="/coming-soon" style={{
        display: "block", textAlign: "center", textDecoration: "none",
        background: BLUE, color: "#fff", padding: "15px 24px", borderRadius: 12,
        fontSize: 14, fontWeight: 700, fontFamily: "Montserrat, sans-serif",
        letterSpacing: "0.04em", transition: "all 0.25s",
        boxShadow: `0 4px 20px ${BLUE}40`,
      }}
        onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.opacity = "0.85"; (e.currentTarget as HTMLAnchorElement).style.transform = "translateY(-2px)"; }}
        onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.opacity = "1"; (e.currentTarget as HTMLAnchorElement).style.transform = "translateY(0)"; }}
      >
        Получить доступ со скидкой 70%
      </a>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <div style={{ width: 20, height: 20, borderRadius: "50%", background: BLUE_LIGHT, border: `1px solid ${BLUE_BORDER}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke={BLUE} strokeWidth="3"><path d="M20 6 9 17l-5-5"/></svg>
        </div>
        <span style={{ fontSize: 12, color: TEXT_SUB, lineHeight: 1.5 }}>
          Предложение действует только до открытия платформы
        </span>
      </div>
    </div>
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
              <EarlyAccessBlock />
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}