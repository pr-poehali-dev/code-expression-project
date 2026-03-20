import { ACCENT, ACCENT_SHADOW, PLANS } from "./constants";
import { FadeIn } from "./TarifyForms";

interface TarifyPlansProps {
  onOpenModal: (planName: string) => void;
}

export default function TarifyPlans({ onOpenModal }: TarifyPlansProps) {
  return (
    <>
      {/* Hero */}
      <section style={{ paddingTop: 144, paddingBottom: 56 }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px" }}>
          <FadeIn>
            <div style={{ display: "inline-block", fontSize: 11, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase" as const, color: ACCENT, marginBottom: 20 }}>
              Тарифы Dok Диалог
            </div>
          </FadeIn>
          <FadeIn delay={100}>
            <h1 style={{ fontFamily: "Cormorant, serif", fontSize: "clamp(36px, 5vw, 64px)", fontWeight: 700, lineHeight: 1.1, color: "#1a1a1a", marginBottom: 20, letterSpacing: "-0.5px" }}>
              Выберите свой<br />
              <span style={{ color: ACCENT }}>план обучения</span>
            </h1>
          </FadeIn>
          <FadeIn delay={200}>
            <p style={{ fontSize: "clamp(15px, 2.5vw, 17px)", lineHeight: 1.75, color: "#5a5a5a", maxWidth: 580, marginBottom: 0 }}>
              Три формата внедрения МассоПро — выберите подходящий для вашего салона. Все тарифы включают обучение мастеров и доступ к онлайн-платформе.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* Process Notice */}
      <section style={{ paddingBottom: 48, paddingTop: 0 }}>
        <div style={{ maxWidth: 800, margin: "0 auto", padding: "0 24px" }}>
          <div style={{
            background: "linear-gradient(135deg, #f8f4ef 0%, #fdf6ee 100%)",
            border: `1.5px solid ${ACCENT}30`,
            borderLeft: `4px solid ${ACCENT}`,
            borderRadius: 16,
            padding: "28px 32px",
            display: "flex",
            gap: 20,
            alignItems: "flex-start",
          }}>
            <div style={{ fontSize: 28, lineHeight: 1, flexShrink: 0, marginTop: 2 }}>📋</div>
            <div>
              <div style={{ fontFamily: "Cormorant, serif", fontSize: 20, fontWeight: 700, color: "#1a1a1a", marginBottom: 10 }}>
                Как проходит работа после оплаты
              </div>
              <p style={{ fontSize: 15, lineHeight: 1.75, color: "#4a4a4a", margin: 0 }}>
                После заключения договора и оплаты тарифа мы начинаем с <strong>бесплатной оценки</strong> ваших специалистов-массажистов. И только после того, как команда полностью укомплектована и готова, — приступаем к обучению персонала.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Plans */}
      <section style={{ paddingBottom: 80 }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px" }}>
          <div className="tarify-plans-grid">
            {PLANS.map((plan, i) => (
              <FadeIn key={i} delay={i * 100}>
                <div className="tarify-plan-card" style={{
                  background: plan.color, borderRadius: 24,
                  boxShadow: plan.name === "Расширенный" ? `0 24px 80px ${ACCENT_SHADOW}` : "0 4px 32px rgba(0,0,0,0.08)",
                  display: "flex", flexDirection: "column", height: "100%",
                  position: "relative" as const,
                  transform: plan.name === "Расширенный" ? "scale(1.02)" : "scale(1)",
                  boxSizing: "border-box",
                }}>
                  {plan.badge && (
                    <div style={{
                      position: "absolute" as const, top: -14, left: "50%", transform: "translateX(-50%)",
                      background: "#fff", color: ACCENT, fontSize: 11, fontWeight: 700,
                      letterSpacing: "0.12em", textTransform: "uppercase" as const,
                      padding: "6px 18px", borderRadius: 100, boxShadow: "0 4px 16px rgba(0,0,0,0.1)",
                      whiteSpace: "nowrap" as const,
                    }}>
                      {plan.badge}
                    </div>
                  )}

                  <div style={{ marginBottom: 8 }}>
                    <div style={{ fontFamily: "Cormorant, serif", fontSize: "clamp(24px, 3vw, 30px)", fontWeight: 700, color: plan.textColor, marginBottom: 4 }}>{plan.name}</div>
                    <div style={{ fontSize: 13, color: plan.textColor, opacity: 0.65, lineHeight: 1.5 }}>{plan.note}</div>
                  </div>

                  <div style={{ margin: "20px 0", borderTop: `1px solid ${plan.textColor === "#fff" ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.08)"}` }} />

                  <div style={{ marginBottom: 24 }}>
                    <span className="tarify-price" style={{ fontFamily: "Cormorant, serif", fontWeight: 700, color: plan.textColor, lineHeight: 1 }}>
                      {plan.price}{plan.period ? " ₽" : ""}
                    </span>
                    <span style={{ fontSize: 13, color: plan.textColor, opacity: 0.6, marginLeft: 4 }}>{plan.period}</span>
                  </div>

                  <ul style={{ listStyle: "none", padding: 0, margin: "0 0 28px", display: "flex", flexDirection: "column", gap: 10, flex: 1 }}>
                    {plan.features.map((f, fi) => (
                      <li key={fi} style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                        <span style={{ color: plan.name === "Расширенный" ? "#fff" : ACCENT, fontWeight: 700, fontSize: 15, lineHeight: 1.4, flexShrink: 0 }}>✓</span>
                        <span style={{ fontSize: 14, color: plan.textColor, opacity: 0.9, lineHeight: 1.55 }}>{f}</span>
                      </li>
                    ))}
                  </ul>

                  <button
                    onClick={() => onOpenModal(plan.name)}
                    style={{
                      background: plan.ctaStyle === "outline" ? "transparent" : plan.name === "Расширенный" ? "#fff" : ACCENT,
                      color: plan.ctaStyle === "outline" ? "#1a1a1a" : plan.name === "Расширенный" ? ACCENT : "#fff",
                      border: plan.ctaStyle === "outline" ? "2px solid #d0d0d0" : "none",
                      padding: "13px 20px", borderRadius: 12, fontSize: 14, fontWeight: 600,
                      cursor: "pointer", fontFamily: "Montserrat, sans-serif", transition: "all 0.2s ease",
                    }}
                    onMouseEnter={e => { const el = e.currentTarget as HTMLButtonElement; el.style.opacity = "0.85"; el.style.transform = "translateY(-1px)"; }}
                    onMouseLeave={e => { const el = e.currentTarget as HTMLButtonElement; el.style.opacity = "1"; el.style.transform = "translateY(0)"; }}
                  >
                    {plan.cta}
                  </button>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
