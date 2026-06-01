import { PEARL, PEARL_LIGHT, PEARL_BORDER, DARK2, DARK3, DARK4, TEXT_SUB, FadeIn, PearlLine } from "./EkspertShared";

function EarlyAccessBlock() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <div style={{ width: 6, height: 6, borderRadius: "50%", background: PEARL, animation: "pulse 2s infinite" }} />
        <span style={{ fontSize: 11, fontWeight: 700, color: PEARL, letterSpacing: "0.14em", textTransform: "uppercase" as const }}>
          Специальное предложение
        </span>
      </div>
      <div style={{ fontFamily: "Cormorant, serif", fontSize: "clamp(20px,3vw,26px)", fontWeight: 700, color: "#fff", lineHeight: 1.2 }}>
        Платформа готовится к запуску —<br />
        <span style={{ color: PEARL }}>забронируйте скидку 70%</span>
      </div>
      {[
        "Оставьте заявку до открытия — получите тариф со скидкой 70% от стоимости.",
        "Это единственная скидка за всё время существования платформы. После запуска цена станет полной навсегда.",
      ].map((text, i) => (
        <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={PEARL} strokeWidth="2.5" style={{ flexShrink: 0, marginTop: 2 }}><path d="M20 6 9 17l-5-5"/></svg>
          <span style={{ fontSize: 13, color: TEXT_SUB, lineHeight: 1.7 }}>{text}</span>
        </div>
      ))}
      <a href="/coming-soon" style={{
        display: "block", textAlign: "center", textDecoration: "none",
        background: PEARL, color: DARK2, padding: "15px 24px", borderRadius: 12,
        fontSize: 14, fontWeight: 700, fontFamily: "Montserrat, sans-serif",
        letterSpacing: "0.04em", transition: "all 0.25s",
        boxShadow: `0 4px 20px ${PEARL}30`,
      }}
        onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.opacity = "0.85"; (e.currentTarget as HTMLAnchorElement).style.transform = "translateY(-2px)"; }}
        onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.opacity = "1"; (e.currentTarget as HTMLAnchorElement).style.transform = "translateY(0)"; }}
      >
        Получить доступ со скидкой 70%
      </a>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <div style={{ width: 20, height: 20, borderRadius: "50%", background: PEARL_LIGHT, border: `1px solid ${PEARL_BORDER}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke={PEARL} strokeWidth="3"><path d="M20 6 9 17l-5-5"/></svg>
        </div>
        <span style={{ fontSize: 12, color: TEXT_SUB, lineHeight: 1.5 }}>
          Предложение действует только до открытия платформы
        </span>
      </div>
    </div>
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
                  fontSize: 10, color: DARK2, background: PEARL,
                  padding: "2px 8px", borderRadius: 20, fontWeight: 700, letterSpacing: "0.06em",
                }}>VIP</span>
              </div>
              <EarlyAccessBlock />
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}