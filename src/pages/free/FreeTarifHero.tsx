import { TEAL, TEAL_GLASS, TEAL_BORD, TEAL_DARK, DARK, DARK2, DARK3, TEXT, TEXT_SUB, FadeIn } from "./FreeTarifShared";

function CtaButton({ href, large }: { href: string; large?: boolean }) {
  return (
    <a
      href={href}
      style={{
        display: "inline-block",
        background: TEAL,
        color: DARK,
        padding: large ? "16px 34px" : "13px 26px",
        borderRadius: 12,
        fontSize: large ? "clamp(13px,1.5vw,15px)" : "clamp(12px,1.3vw,14px)",
        fontWeight: 700,
        textDecoration: "none",
        letterSpacing: "0.04em",
        fontFamily: "Montserrat, sans-serif",
        transition: "all 0.3s",
        boxShadow: `0 4px 24px rgba(0,198,188,0.22)`,
      }}
      onMouseEnter={e => {
        const el = e.currentTarget as HTMLAnchorElement;
        el.style.background = TEAL_DARK;
        el.style.transform = "translateY(-2px)";
        el.style.boxShadow = `0 8px 32px rgba(0,198,188,0.35)`;
      }}
      onMouseLeave={e => {
        const el = e.currentTarget as HTMLAnchorElement;
        el.style.background = TEAL;
        el.style.transform = "translateY(0)";
        el.style.boxShadow = `0 4px 24px rgba(0,198,188,0.22)`;
      }}
    >
      Получить бесплатный доступ
    </a>
  );
}

export { CtaButton };

export default function FreeTarifHero() {
  return (
    <section
      className="ft-hero-pad"
      style={{
        position: "relative" as const,
        overflow: "hidden",
        borderBottom: "1px solid rgba(255,255,255,0.04)",
      }}
    >
      {/* Фоновый блик */}
      <div style={{
        position: "absolute" as const, inset: 0, pointerEvents: "none",
        background: `
          radial-gradient(ellipse at 70% 0%, rgba(0,198,188,0.06) 0%, transparent 55%),
          radial-gradient(ellipse at 10% 90%, rgba(0,198,188,0.03) 0%, transparent 45%)
        `,
      }} />

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 24px", position: "relative" as const }}>
        <div className="ft-hero-grid">

          {/* ── ЛЕВАЯ ЧАСТЬ ── */}
          <div>
            <FadeIn delay={0}>
              {/* Бейдж */}
              <div style={{
                display: "inline-flex", alignItems: "center", gap: 8,
                background: TEAL_GLASS, border: `1px solid ${TEAL_BORD}`,
                borderRadius: 20, padding: "6px 16px", marginBottom: 28,
              }}>
                <div style={{ width: 6, height: 6, borderRadius: "50%", background: TEAL }} />
                <span style={{ fontSize: 11, fontWeight: 700, color: TEAL, letterSpacing: "0.15em", textTransform: "uppercase" as const }}>
                  Бесплатный доступ · Платформа Dok Диалог
                </span>
              </div>
            </FadeIn>

            <FadeIn delay={80}>
              <h1 style={{
                fontFamily: "Cormorant, serif",
                fontSize: "clamp(28px, 4.8vw, 60px)",
                fontWeight: 700,
                lineHeight: 1.1,
                color: "#fff",
                margin: "0 0 24px",
                letterSpacing: "-0.5px",
              }}>
                Большинство специалистов знают техники —{" "}
                <span style={{ color: TEAL }}>но не понимают, почему их практика не растет</span>
              </h1>
            </FadeIn>

            <FadeIn delay={150}>
              <p style={{ fontSize: "clamp(13px,1.5vw,15px)", color: TEXT_SUB, lineHeight: 1.85, margin: "0 0 14px", maxWidth: 520 }}>
                Бесплатный вводный блок платформы «Dok Диалог» для специалистов по телу и состояниям, которые хотят:
              </p>
              <div style={{ display: "flex", flexDirection: "column" as const, gap: 9, marginBottom: 36 }}>
                {[
                  "выйти из хаоса и обрести устойчивость",
                  "понять свои внутренние ограничения",
                  "научиться работать с платежеспособной аудиторией",
                  "выстроить сильную и системную практику",
                ].map((item, i) => (
                  <div key={i} style={{ display: "flex", gap: 10, alignItems: "center" }}>
                    <div style={{ width: 5, height: 5, borderRadius: "50%", background: TEAL, flexShrink: 0 }} />
                    <span style={{ fontSize: "clamp(13px,1.4vw,14px)", color: TEXT_SUB }}>{item}</span>
                  </div>
                ))}
              </div>
            </FadeIn>

            <FadeIn delay={230}>
              <div style={{ display: "flex", gap: 12, flexWrap: "wrap" as const, alignItems: "center" }}>
                <CtaButton href="#application" large />
                <a href="#content" style={{
                  fontSize: "clamp(12px,1.3vw,13px)", color: TEXT_SUB,
                  textDecoration: "none", borderBottom: "1px solid rgba(210,225,235,0.18)",
                  paddingBottom: 1, transition: "color 0.2s",
                }}
                  onMouseEnter={e => (e.currentTarget as HTMLAnchorElement).style.color = TEXT}
                  onMouseLeave={e => (e.currentTarget as HTMLAnchorElement).style.color = TEXT_SUB}
                >Что внутри?</a>
              </div>
            </FadeIn>
          </div>

          {/* ── ПРАВАЯ ЧАСТЬ: карточка-превью ── */}
          <FadeIn delay={210}>
            <div style={{
              background: `linear-gradient(145deg, ${DARK3}, ${DARK2})`,
              borderRadius: 22,
              border: "1px solid rgba(255,255,255,0.06)",
              overflow: "hidden",
              boxShadow: "0 24px 80px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.05)",
            }}>
              {/* Header карточки */}
              <div style={{
                padding: "20px 22px 16px",
                borderBottom: "1px solid rgba(255,255,255,0.05)",
                background: "linear-gradient(135deg, rgba(0,198,188,0.05), transparent)",
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                  <span style={{ fontSize: 10, fontWeight: 700, color: TEAL, letterSpacing: "0.16em", textTransform: "uppercase" as const }}>
                    Старт · Бесплатно
                  </span>
                  <span style={{
                    fontSize: 10, color: DARK, background: TEAL,
                    padding: "2px 8px", borderRadius: 20, fontWeight: 700, letterSpacing: "0.06em",
                  }}>0 ₽</span>
                </div>
                <div style={{ display: "flex", flexWrap: "wrap" as const, gap: 6 }}>
                  {["5 видео-блоков", "Разборы практики", "Демо платформы"].map((tag, i) => (
                    <span key={i} style={{
                      fontSize: 11, color: TEAL, background: TEAL_GLASS,
                      border: `1px solid ${TEAL_BORD}`, borderRadius: 20, padding: "3px 10px", fontWeight: 600,
                    }}>{tag}</span>
                  ))}
                </div>
              </div>

              {/* Список того что внутри */}
              <div style={{ padding: "18px 22px", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                <div style={{ fontSize: 11, color: TEXT_SUB, marginBottom: 11, letterSpacing: "0.07em" }}>Вы поймете</div>
                <div style={{ display: "flex", flexDirection: "column" as const, gap: 9 }}>
                  {[
                    "Почему техники не решают проблему роста",
                    "Как мышление влияет на доход",
                    "Почему клиент считывает состояние",
                    "Что такое система в практике",
                    "Как выглядит платформа изнутри",
                  ].map((item, i) => (
                    <div key={i} style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={TEAL} strokeWidth="2.5" style={{ flexShrink: 0, marginTop: 1 }}>
                        <path d="M20 6 9 17l-5-5"/>
                      </svg>
                      <span style={{ fontSize: 12, color: TEXT_SUB }}>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Подвал карточки */}
              <div style={{ padding: "18px 22px" }}>
                <div style={{ fontFamily: "Cormorant, serif", fontSize: 28, fontWeight: 700, color: TEAL, marginBottom: 4 }}>
                  Бесплатно
                </div>
                <div style={{ fontSize: 12, color: TEXT_SUB, marginBottom: 14 }}>Мгновенный доступ · без карты</div>
                <div style={{ display: "flex", gap: 14, flexWrap: "wrap" as const }}>
                  {["5 видео", "Разборы", "Демо ИИ"].map((f, i) => (
                    <div key={i} style={{ fontSize: 11, color: TEXT_SUB, textAlign: "center" as const }}>
                      <div style={{ width: 7, height: 7, borderRadius: "50%", background: `${TEAL}55`, margin: "0 auto 5px" }} />
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