import {
  TEAL, TEAL_GLASS, TEAL_BORD, DARK2, DARK3, DARK4,
  TEXT, TEXT_SUB, FadeIn, TealLine,
  PAIN_ITEMS, INSIGHTS, VIDEO_BLOCKS, PLATFORM_TOOLS, AFTER_FREE,
} from "./FreeTarifShared";

// ── Общий тег-пилюля ────────────────────────────────────────────────────────
function Pill({ label }: { label: string }) {
  return (
    <span style={{
      fontSize: 11, color: TEAL, background: TEAL_GLASS,
      border: `1px solid ${TEAL_BORD}`, borderRadius: 20,
      padding: "3px 11px", fontWeight: 600,
    }}>{label}</span>
  );
}

// ── Чекмарк-строка ───────────────────────────────────────────────────────────
function CheckRow({ text }: { text: string }) {
  return (
    <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={TEAL} strokeWidth="2.5" style={{ flexShrink: 0, marginTop: 2 }}>
        <path d="M20 6 9 17l-5-5"/>
      </svg>
      <span style={{ fontSize: 14, color: TEXT_SUB, lineHeight: 1.6 }}>{text}</span>
    </div>
  );
}

export default function FreeTarifSections() {
  return (
    <>
      {/* ══ БЛОК 2: ГЛАВНАЯ ПРОБЛЕМА ══════════════════════════════════════════ */}
      <section className="ft-section" style={{ background: DARK2 }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 24px" }}>
          <FadeIn>
            <div style={{ maxWidth: 640, marginBottom: 48 }}>
              <TealLine />
              <h2 style={{
                fontFamily: "Cormorant, serif",
                fontSize: "clamp(26px, 4vw, 46px)",
                fontWeight: 700, color: "#fff", lineHeight: 1.12, margin: 0,
              }}>
                Почему многие специалисты годами{" "}
                <span style={{ color: TEAL }}>не могут выйти на новый уровень?</span>
              </h2>
            </div>
          </FadeIn>

          {/* Плитка болей */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(196px, 1fr))", gap: 2, marginBottom: 36 }}>
            {PAIN_ITEMS.map((pain, i) => (
              <FadeIn key={i} delay={i * 35}>
                <div style={{
                  padding: "20px 16px", background: DARK3,
                  borderLeft: `2px solid rgba(0,198,188,0.18)`,
                }}>
                  <div style={{ width: 14, height: 1, background: `${TEAL}35`, marginBottom: 10 }} />
                  <p style={{ margin: 0, fontSize: 13, color: TEXT_SUB, lineHeight: 1.65, fontWeight: 500 }}>{pain}</p>
                </div>
              </FadeIn>
            ))}
          </div>

          {/* Вывод */}
          <FadeIn delay={160}>
            <div style={{
              padding: "24px 28px", maxWidth: 600,
              background: `linear-gradient(135deg, ${DARK4}, ${DARK3})`,
              borderRadius: 16, borderLeft: `2px solid ${TEAL}35`,
            }}>
              <p style={{ margin: 0, fontSize: 15, color: TEXT_SUB, lineHeight: 1.85, fontStyle: "italic" }}>
                Проблема чаще не в знаниях. А в мышлении, внутреннем состоянии и отсутствии профессиональной опоры.
              </p>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ══ БЛОК 3: ЧТО ВЫ ПОЙМЁТЕ ══════════════════════════════════════════ */}
      <section className="ft-section" style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
        <div style={{ maxWidth: 1000, margin: "0 auto", padding: "0 24px" }}>
          <div className="ft-two-col">
            <FadeIn>
              <div>
                <TealLine />
                <h2 style={{
                  fontFamily: "Cormorant, serif",
                  fontSize: "clamp(26px, 3.8vw, 46px)",
                  fontWeight: 700, color: "#fff", lineHeight: 1.12, marginBottom: 16,
                }}>
                  Это не просто знакомство.{" "}
                  <span style={{ color: TEAL }}>Это смена взгляда на профессию.</span>
                </h2>
                <p style={{ fontSize: 14, color: TEXT_SUB, lineHeight: 1.8, margin: 0 }}>
                  Бесплатный блок создан так, чтобы вызвать внутренний сдвиг — ещё до начала платной программы.
                </p>
              </div>
            </FadeIn>

            <FadeIn delay={100}>
              <div>
                <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.13em", color: TEXT_SUB, textTransform: "uppercase" as const, marginBottom: 16 }}>
                  После просмотра вы поймёте
                </div>
                <div style={{ display: "flex", flexDirection: "column" as const, gap: 11 }}>
                  {INSIGHTS.map((text, i) => (
                    <CheckRow key={i} text={text} />
                  ))}
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ══ БЛОК 4: СОДЕРЖАНИЕ ════════════════════════════════════════════════ */}
      <section id="content" className="ft-section" style={{ background: DARK2 }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 24px" }}>
          <FadeIn>
            <div style={{ marginBottom: 48 }}>
              <TealLine />
              <h2 style={{
                fontFamily: "Cormorant, serif",
                fontSize: "clamp(24px, 3.5vw, 42px)",
                fontWeight: 700, color: "#fff", margin: 0,
              }}>
                Что внутри бесплатного тарифа
              </h2>
            </div>
          </FadeIn>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 14 }}>
            {VIDEO_BLOCKS.map((block, i) => (
              <FadeIn key={i} delay={i * 55}>
                <div
                  style={{
                    background: DARK3, borderRadius: 18, padding: "24px 20px",
                    border: "1px solid rgba(255,255,255,0.04)",
                    display: "flex", flexDirection: "column" as const, height: "100%",
                    boxSizing: "border-box" as const, transition: "border-color 0.3s, box-shadow 0.3s",
                  }}
                  onMouseEnter={e => {
                    const el = e.currentTarget as HTMLDivElement;
                    el.style.borderColor = TEAL_BORD;
                    el.style.boxShadow = "0 8px 32px rgba(0,0,0,0.3)";
                  }}
                  onMouseLeave={e => {
                    const el = e.currentTarget as HTMLDivElement;
                    el.style.borderColor = "rgba(255,255,255,0.04)";
                    el.style.boxShadow = "none";
                  }}
                >
                  <div style={{ fontFamily: "Cormorant, serif", fontSize: 26, fontWeight: 700, color: `${TEAL}30`, marginBottom: 12 }}>
                    {block.n}
                  </div>
                  <div style={{ fontSize: 15, fontWeight: 700, color: "#fff", marginBottom: 10, lineHeight: 1.3 }}>
                    {block.title}
                  </div>
                  <p style={{ margin: 0, fontSize: 13, color: TEXT_SUB, lineHeight: 1.7, flex: 1 }}>
                    {block.desc}
                  </p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ══ БЛОК 5: ДЕМОНСТРАЦИЯ ПЛАТФОРМЫ ══════════════════════════════════ */}
      <section className="ft-section" style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
        <div style={{ maxWidth: 1000, margin: "0 auto", padding: "0 24px" }}>
          <div className="ft-two-col">
            <FadeIn>
              <div>
                <TealLine />
                <h2 style={{
                  fontFamily: "Cormorant, serif",
                  fontSize: "clamp(24px, 3.8vw, 44px)",
                  fontWeight: 700, color: "#fff", lineHeight: 1.12, marginBottom: 16,
                }}>
                  Вы увидите, как выглядит современная интеллектуальная система{" "}
                  <span style={{ color: TEAL }}>для специалистов.</span>
                </h2>
                <p style={{ fontSize: 14, color: TEXT_SUB, lineHeight: 1.8, margin: "0 0 22px" }}>
                  Это не «очередной курс». Это технологии, аналитика, система, профессиональная среда нового уровня.
                </p>
                <div style={{ display: "flex", flexWrap: "wrap" as const, gap: 7 }}>
                  {["Технологии", "Аналитика", "Система", "ИИ-инструменты"].map((t, i) => (
                    <Pill key={i} label={t} />
                  ))}
                </div>
              </div>
            </FadeIn>

            <FadeIn delay={110}>
              <div style={{ display: "flex", flexDirection: "column" as const, gap: 10 }}>
                {PLATFORM_TOOLS.map((tool, i) => (
                  <div key={i} style={{
                    padding: "16px 18px", background: DARK3, borderRadius: 12,
                    border: "1px solid rgba(255,255,255,0.04)",
                    display: "flex", gap: 14, alignItems: "flex-start",
                    transition: "border-color 0.25s",
                  }}
                    onMouseEnter={e => (e.currentTarget as HTMLDivElement).style.borderColor = TEAL_BORD}
                    onMouseLeave={e => (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(255,255,255,0.04)"}
                  >
                    <div style={{
                      width: 32, height: 32, borderRadius: 10, flexShrink: 0,
                      background: TEAL_GLASS, border: `1px solid ${TEAL_BORD}`,
                      display: "flex", alignItems: "center", justifyContent: "center",
                    }}>
                      <div style={{ width: 8, height: 8, borderRadius: "50%", background: TEAL }} />
                    </div>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 700, color: TEXT, marginBottom: 3 }}>{tool.label}</div>
                      <div style={{ fontSize: 12, color: TEXT_SUB }}>{tool.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ══ БЛОК 6: ЧТО МЕНЯЕТСЯ ПОСЛЕ ══════════════════════════════════════ */}
      <section className="ft-section" style={{ background: DARK2 }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 24px" }}>
          <FadeIn>
            <div style={{ textAlign: "center" as const, maxWidth: 640, margin: "0 auto 48px" }}>
              <TealLine />
              <h2 style={{
                fontFamily: "Cormorant, serif",
                fontSize: "clamp(24px, 3.8vw, 44px)",
                fontWeight: 700, color: "#fff", lineHeight: 1.12, margin: 0,
              }}>
                После бесплатного блока специалист начинает иначе воспринимать{" "}
                <span style={{ color: TEAL }}>себя и свою практику.</span>
              </h2>
            </div>
          </FadeIn>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))", gap: 12 }}>
            {AFTER_FREE.map((card, i) => (
              <FadeIn key={i} delay={i * 60}>
                <div style={{
                  background: DARK3, borderRadius: 16, padding: "22px 18px",
                  border: "1px solid rgba(255,255,255,0.04)",
                  height: "100%", boxSizing: "border-box" as const,
                }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: TEAL, letterSpacing: "0.1em", textTransform: "uppercase" as const, marginBottom: 14 }}>
                    {card.area}
                  </div>
                  <div style={{ display: "flex", flexDirection: "column" as const, gap: 8 }}>
                    {card.items.map((item, j) => (
                      <div key={j} style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
                        <div style={{ width: 4, height: 4, borderRadius: "50%", background: `${TEAL}55`, flexShrink: 0, marginTop: 6 }} />
                        <span style={{ fontSize: 13, color: TEXT_SUB, lineHeight: 1.55 }}>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
