import { GOLD, GOLD_LIGHT, DARK2, DARK3, TEXT_SUB, FadeIn, GoldLine } from "./PraktikaShared";

function EarlyAccessBlock() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <div style={{ width: 6, height: 6, borderRadius: "50%", background: GOLD, animation: "pulse 2s infinite" }} />
        <span style={{ fontSize: 11, fontWeight: 700, color: GOLD, letterSpacing: "0.14em", textTransform: "uppercase" as const }}>
          Специальное предложение
        </span>
      </div>
      <div style={{ fontFamily: "Cormorant, serif", fontSize: "clamp(22px,3vw,28px)", fontWeight: 700, color: "#fff", lineHeight: 1.2 }}>
        Платформа готовится к запуску —<br />
        <span style={{ color: GOLD }}>забронируйте скидку 70%</span>
      </div>
      {[
        "Оставьте заявку до открытия — получите тариф со скидкой 70% от стоимости.",
        "Это единственная скидка за всё время существования платформы. После запуска цена станет полной навсегда.",
      ].map((text, i) => (
        <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={GOLD} strokeWidth="2.5" style={{ flexShrink: 0, marginTop: 2 }}><path d="M20 6 9 17l-5-5"/></svg>
          <span style={{ fontSize: 13, color: TEXT_SUB, lineHeight: 1.7 }}>{text}</span>
        </div>
      ))}
      <a href="/coming-soon" style={{
        display: "block", textAlign: "center", textDecoration: "none",
        background: GOLD, color: DARK2, padding: "15px 24px", borderRadius: 12,
        fontSize: 14, fontWeight: 700, fontFamily: "Montserrat, sans-serif",
        letterSpacing: "0.04em", transition: "all 0.25s",
        boxShadow: `0 4px 20px ${GOLD}40`,
      }}
        onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.opacity = "0.88"; (e.currentTarget as HTMLAnchorElement).style.transform = "translateY(-2px)"; }}
        onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.opacity = "1"; (e.currentTarget as HTMLAnchorElement).style.transform = "translateY(0)"; }}
      >
        Получить доступ со скидкой 70%
      </a>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <div style={{ width: 20, height: 20, borderRadius: "50%", background: GOLD_LIGHT, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke={GOLD} strokeWidth="3"><path d="M20 6 9 17l-5-5"/></svg>
        </div>
        <span style={{ fontSize: 12, color: TEXT_SUB, lineHeight: 1.5 }}>
          Предложение действует только до открытия платформы
        </span>
      </div>
    </div>
  );
}

export default function PraktikaApplication() {
  return (
    <section id="application" className="pr-section-pad" style={{ background: DARK2, paddingBottom: "100px" }}>
      <div style={{ maxWidth: 900, margin: "0 auto", padding: "0 24px" }}>
        <div className="pr-price-grid">
          <FadeIn>
            <div>
              <GoldLine />
              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.16em", color: TEXT_SUB, textTransform: "uppercase" as const, marginBottom: 14 }}>
                Тариф
              </div>
              <h2 style={{ fontFamily: "Cormorant, serif", fontSize: "clamp(28px, 4vw, 42px)", fontWeight: 700, color: "#fff", margin: "0 0 8px" }}>
                «Практика»
              </h2>
              <div style={{ fontFamily: "Cormorant, serif", fontSize: "clamp(36px, 5vw, 52px)", fontWeight: 700, color: GOLD, lineHeight: 1, marginBottom: 8 }}>
                90 900 ₽
              </div>
              <div style={{ fontSize: 13, color: TEXT_SUB, marginBottom: 32 }}>Доступ 12 месяцев</div>
              <div style={{ display: "flex", flexDirection: "column" as const, gap: 11 }}>
                {[
                  "Все 9 модулей программы",
                  "Диагностические техники",
                  "Работа с мышлением и ограничениями",
                  "Привлечение и работа с клиентами",
                  "Ценообразование и премиум-аудитория",
                  "Видеоуроки, материалы и схемы",
                ].map((item, i) => (
                  <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={GOLD} strokeWidth="2.5" style={{ flexShrink: 0, marginTop: 2 }}><path d="M20 6 9 17l-5-5"/></svg>
                    <span style={{ fontSize: 13, color: TEXT_SUB }}>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </FadeIn>

          <FadeIn delay={120}>
            <div style={{ background: DARK3, borderRadius: 20, padding: "32px 28px", border: "1px solid rgba(255,255,255,0.06)" }}>
              <EarlyAccessBlock />
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}