import Icon from "@/components/ui/icon";
import {
  TEAL, DARK, GRAY, SERIF, PRESENTATION_URL,
  CHAIN, QUESTIONS, GRADUATE_GETS, NAVIGATOR_STEPS,
  SectionLabel,
} from "./DlyaShkolShared";

export default function DlyaShkolHero() {
  return (
    <>
      {/* ── 1. HERO ── */}
      <section style={{
        background: `radial-gradient(120% 100% at 70% 0%, #1a2e3c 0%, ${DARK} 55%, #060B16 100%)`,
        minHeight: "66vh", display: "flex", alignItems: "center",
        paddingTop: 76, position: "relative", overflow: "hidden",
      }}>
        <div style={{ position: "absolute", top: "0%", right: "-5%", width: 600, height: 600, borderRadius: "50%", background: "radial-gradient(circle, rgba(45,212,191,0.08) 0%, transparent 65%)", pointerEvents: "none" }} />

        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "80px 32px", width: "100%", display: "grid", gridTemplateColumns: "1.1fr 0.9fr", gap: 56, alignItems: "center" }} className="hero-grid">
          <div>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 10, border: "1px solid rgba(45,212,191,0.3)", borderRadius: 100, padding: "7px 18px", marginBottom: 32 }}>
              <div style={{ width: 6, height: 6, borderRadius: "50%", background: TEAL }} />
              <span style={{ fontSize: 12, color: TEAL, fontWeight: 500, letterSpacing: "1.5px", textTransform: "uppercase" }}>Партнерство для школ</span>
            </div>

            <h1 style={{ fontFamily: SERIF, fontSize: "clamp(38px,5vw,64px)", fontWeight: 500, color: "#fff", lineHeight: 1.06, margin: "0 0 24px", letterSpacing: "-0.5px" }}>
              Партнерство для школ
            </h1>

            <p style={{ fontSize: "clamp(15px,1.5vw,18px)", color: "rgba(255,255,255,0.6)", lineHeight: 1.7, margin: "0 0 20px" }}>
              Помогите своим выпускникам развиваться после обучения — и получайте дополнительный канал целевой аудитории для своих курсов.
            </p>
            <p style={{ fontSize: 15, color: "rgba(255,255,255,0.42)", lineHeight: 1.7, margin: "0 0 40px", fontWeight: 300 }}>
              Промт Диалог — ИИ-навигатор развития мастеров, специалистов и салонов. Выпускник получает персональный маршрут развития, ежедневные шаги, ИИ-инструменты и рекомендации обучения, когда ему действительно нужен следующий профессиональный навык.
            </p>

            <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
              <a href={PRESENTATION_URL} target="_blank" rel="noopener noreferrer" style={{
                display: "inline-flex", alignItems: "center", gap: 8,
                background: `linear-gradient(135deg, ${TEAL}, #14B8A6)`,
                color: "#0F172A", padding: "14px 32px", borderRadius: 2,
                fontSize: 15, fontWeight: 600, textDecoration: "none",
                boxShadow: "0 8px 24px rgba(45,212,191,0.25)",
              }}>
                Скачать презентацию
                <Icon name="Download" size={16} />
              </a>
              <a href="#partner-form" style={{
                display: "inline-flex", alignItems: "center", gap: 8,
                border: "1px solid rgba(255,255,255,0.2)", color: "rgba(255,255,255,0.8)",
                padding: "14px 32px", borderRadius: 2, fontSize: 15,
                fontWeight: 500, textDecoration: "none", background: "transparent",
              }}>
                Стать партнером
              </a>
            </div>
          </div>

          <div style={{ display: "flex", justifyContent: "center" }} className="hero-img">
            <div style={{ position: "relative", width: "100%" }}>
              <div style={{ position: "absolute", inset: -1, borderRadius: 6, background: "linear-gradient(135deg, rgba(45,212,191,0.4), transparent 50%, rgba(45,212,191,0.15))", pointerEvents: "none", zIndex: 2 }} />
              <img
                src="https://cdn.poehali.dev/projects/10f61e56-9821-40f3-b705-3590ddaffd08/bucket/85d5b2f9-64af-45fd-9ef7-f5375d6353e1.png"
                alt="Партнерство школ и Промт Диалог — обучение и развитие мастеров"
                fetchpriority="high"
                decoding="async"
                style={{ width: "100%", height: "auto", borderRadius: 4, display: "block", boxShadow: "0 32px 80px rgba(0,0,0,0.5)", position: "relative", zIndex: 1 }}
              />
              <div className="hero-badge" style={{
                position: "absolute", bottom: 16, right: 16, zIndex: 3,
                background: "rgba(8,14,28,0.75)", backdropFilter: "blur(16px)",
                border: "1px solid rgba(45,212,191,0.25)", borderRadius: 4,
                padding: "10px 14px", display: "flex", alignItems: "center", gap: 10,
              }}>
                <div style={{ width: 30, height: 30, borderRadius: 4, background: "rgba(45,212,191,0.15)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <Icon name="GraduationCap" size={15} style={{ color: TEAL }} />
                </div>
                <div>
                  <div style={{ fontSize: 12, fontWeight: 600, color: "#fff" }}>Школа + Промт Диалог</div>
                  <div style={{ fontSize: 11, color: "rgba(255,255,255,0.5)", fontWeight: 300 }}>развитие выпускников после обучения</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 2. ВИЗУАЛЬНАЯ СХЕМА ── */}
      <section style={{ padding: "72px 32px", background: "#fff" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 0 }} className="chain-flow">
            {CHAIN.map((c, i) => (
              <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", width: "100%" }}>
                <div style={{
                  display: "flex", alignItems: "center", gap: 16,
                  background: "#F8FAFC", border: "1px solid #E2E8F0", borderRadius: 6,
                  padding: "18px 28px", maxWidth: 480, width: "100%",
                }}>
                  <div style={{ width: 44, height: 44, borderRadius: 4, background: "rgba(45,212,191,0.1)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <Icon name={c.icon} size={20} style={{ color: TEAL }} />
                  </div>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: DARK, letterSpacing: "0.5px" }}>{c.title}</div>
                    <div style={{ fontSize: 13, color: GRAY }}>{c.desc}</div>
                  </div>
                </div>
                {i < CHAIN.length - 1 && (
                  <div style={{ padding: "8px 0" }}>
                    <Icon name="ChevronDown" size={20} style={{ color: "#CBD5E1" }} />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 3. ЧТО ПРОИСХОДИТ ПОСЛЕ ОБУЧЕНИЯ ── */}
      <section style={{ padding: "88px 32px", background: "#F8FAFC" }}>
        <div style={{ maxWidth: 1000, margin: "0 auto", textAlign: "center" }}>
          <h2 style={{ fontFamily: SERIF, fontSize: "clamp(28px,3.5vw,44px)", fontWeight: 500, color: DARK, margin: "0 0 40px", lineHeight: 1.1 }}>
            Диплом — это только начало
          </h2>

          <p style={{ fontSize: 16, color: GRAY, marginBottom: 32 }}>После окончания обучения у выпускника появляются новые вопросы:</p>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 14, marginBottom: 56, textAlign: "left" }}>
            {QUESTIONS.map(q => (
              <div key={q} style={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: 4, padding: "16px 20px", display: "flex", gap: 10, alignItems: "flex-start" }}>
                <Icon name="HelpCircle" size={16} style={{ color: TEAL, flexShrink: 0, marginTop: 2 }} />
                <span style={{ fontSize: 14, color: "#334155" }}>{q}</span>
              </div>
            ))}
          </div>

          <div style={{ fontFamily: SERIF, fontSize: "clamp(22px,2.8vw,34px)", fontWeight: 500, color: DARK, lineHeight: 1.4 }}>
            Школа дает профессию.<br />
            <span style={{ color: TEAL }}>Промт Диалог помогает выпускнику реализовать ее.</span>
          </div>
        </div>
      </section>

      {/* ── 4. ЧТО ПОЛУЧАЕТ ВЫПУСКНИК ── */}
      <section style={{ padding: "88px 32px", background: "#fff" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 56 }}>
            <SectionLabel>Ценность для выпускника</SectionLabel>
            <h2 style={{ fontFamily: SERIF, fontSize: "clamp(28px,3.5vw,46px)", fontWeight: 500, color: DARK, margin: 0, lineHeight: 1.1 }}>Что получает выпускник</h2>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 20 }}>
            {GRADUATE_GETS.map(g => (
              <div key={g.title} style={{ background: "#F8FAFC", borderRadius: 6, border: "1px solid #E2E8F0", padding: "28px 26px" }}>
                <div style={{ width: 44, height: 44, borderRadius: 4, background: "rgba(45,212,191,0.1)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 18 }}>
                  <Icon name={g.icon} size={20} style={{ color: TEAL }} />
                </div>
                <div style={{ fontWeight: 600, fontSize: 16, color: DARK, marginBottom: 8 }}>{g.title}</div>
                <div style={{ fontSize: 14, color: GRAY, lineHeight: 1.6 }}>{g.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 5. КАК РАБОТАЕТ ИИ-НАВИГАТОР ── */}
      <section style={{ padding: "88px 32px", background: "#F8FAFC" }}>
        <div style={{ maxWidth: 1000, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <SectionLabel>Не набор нейросетей, а система</SectionLabel>
            <h2 style={{ fontFamily: SERIF, fontSize: "clamp(28px,3.5vw,44px)", fontWeight: 500, color: DARK, margin: "0 0 16px", lineHeight: 1.1 }}>
              Пользователю не нужно искать нужный инструмент
            </h2>
            <p style={{ fontSize: 16, color: GRAY, maxWidth: 620, margin: "0 auto", lineHeight: 1.7 }}>
              Например: «Хочу увеличить количество клиентов». ИИ анализирует профиль, цель, текущую ситуацию, предыдущие действия и точки роста.
            </p>
          </div>

          <div style={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: 6, padding: "40px 36px" }}>
            <div style={{ fontSize: 12, color: TEAL, fontWeight: 500, letterSpacing: "1.5px", textTransform: "uppercase", marginBottom: 24, textAlign: "center" }}>После этого формирует маршрут</div>
            <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "center", gap: 0 }}>
              {NAVIGATOR_STEPS.map((s, i) => (
                <div key={s} style={{ display: "flex", alignItems: "center" }}>
                  <div style={{ background: "rgba(45,212,191,0.08)", border: "1px solid rgba(45,212,191,0.25)", borderRadius: 100, padding: "10px 20px", fontSize: 13, fontWeight: 600, color: DARK, whiteSpace: "nowrap" }}>
                    {s}
                  </div>
                  {i < NAVIGATOR_STEPS.length - 1 && <Icon name="ArrowRight" size={16} style={{ color: "#CBD5E1", margin: "0 10px" }} />}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
