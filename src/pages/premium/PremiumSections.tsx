import { BLUE, BLUE_LIGHT, BLUE_BORDER, DARK2, DARK3, DARK4, TEXT, TEXT_SUB, FadeIn, BlueLine, PAINS, RESULTS, TOOLS, MEETINGS_WORK, AFTER_MEETINGS } from "./PremiumShared";
import Icon from "@/components/ui/icon";

export default function PremiumSections() {
  return (
    <>
      {/* ── БЛОК 2: ПОЧЕМУ НЕ РАСТУТ ── */}
      <section className="pm-section-pad" style={{ background: DARK2 }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 24px" }}>
          <FadeIn>
            <div style={{ maxWidth: 640, marginBottom: 48 }}>
              <BlueLine />
              <h2 style={{
                fontFamily: "Cormorant, serif",
                fontSize: "clamp(26px, 4vw, 46px)",
                fontWeight: 700, color: "#fff", lineHeight: 1.15, margin: 0,
              }}>
                Большинство специалистов упираются не в знания.{" "}
                <span style={{ color: BLUE }}>А в собственное внутреннее состояние.</span>
              </h2>
            </div>
          </FadeIn>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 2 }}>
            {PAINS.map((pain, i) => (
              <FadeIn key={i} delay={i * 40}>
                <div style={{
                  padding: "24px 20px", background: DARK3,
                  borderLeft: `2px solid ${BLUE}30`,
                }}>
                  <div style={{ width: 18, height: 1, background: `${BLUE}50`, marginBottom: 14 }} />
                  <p style={{ margin: 0, fontSize: 14, color: TEXT_SUB, lineHeight: 1.6, fontWeight: 500 }}>{pain}</p>
                </div>
              </FadeIn>
            ))}
          </div>

          <FadeIn delay={200}>
            <div style={{
              marginTop: 36, padding: "24px 28px",
              background: `linear-gradient(135deg, ${DARK4}, ${DARK3})`,
              borderRadius: 16, border: `1px solid ${BLUE_BORDER}`,
              maxWidth: 680,
            }}>
              <p style={{ margin: 0, fontSize: 15, color: TEXT_SUB, lineHeight: 1.8, fontStyle: "italic" }}>
                Даже хорошие техники не работают на высокий доход, если специалист внутренне зажат.
              </p>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ── БЛОК 3: ОЧНЫЕ ВСТРЕЧИ ── */}
      <section className="pm-section-pad" style={{ borderBottom: `1px solid rgba(255,255,255,0.05)` }}>
        <div style={{ maxWidth: 1000, margin: "0 auto", padding: "0 24px" }}>
          <FadeIn>
            <div style={{ maxWidth: 640, marginBottom: 52 }}>
              <BlueLine />
              <h2 style={{
                fontFamily: "Cormorant, serif",
                fontSize: "clamp(26px, 4vw, 46px)",
                fontWeight: 700, color: "#fff", lineHeight: 1.15, marginBottom: 16,
              }}>
                Платёжеспособные люди считывают состояние специалиста за минуты.
              </h2>
              <p style={{ fontSize: 15, color: TEXT_SUB, lineHeight: 1.8, margin: 0 }}>
                5 личных встреч — это работа напрямую с вашим внутренним состоянием, страхами и профессиональной позицией.
              </p>
            </div>
          </FadeIn>

          <div className="pm-two-col">
            <FadeIn delay={80}>
              <div>
                <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.14em", color: BLUE, textTransform: "uppercase" as const, marginBottom: 18 }}>
                  На встречах работаем с
                </div>
                <div style={{ display: "flex", flexDirection: "column" as const, gap: 11 }}>
                  {MEETINGS_WORK.map((item, i) => (
                    <div key={i} style={{ display: "flex", gap: 12, alignItems: "center" }}>
                      <div style={{ width: 6, height: 6, borderRadius: "50%", background: BLUE, flexShrink: 0 }} />
                      <span style={{ fontSize: 14, color: TEXT_SUB }}>{item}</span>
                    </div>
                  ))}
                </div>
                <div style={{
                  marginTop: 28, padding: "18px 20px",
                  background: DARK3, borderRadius: 12,
                  border: "1px solid rgba(255,255,255,0.05)",
                }}>
                  <div style={{ fontSize: 11, color: TEXT_SUB, marginBottom: 10, letterSpacing: "0.08em" }}>Используются</div>
                  <div style={{ display: "flex", flexWrap: "wrap" as const, gap: 7 }}>
                    {["Коучинговые упражнения", "Телесные практики", "Разборы", "Коррекция состояния"].map((t, i) => (
                      <span key={i} style={{ fontSize: 12, color: BLUE, background: BLUE_LIGHT, border: `1px solid ${BLUE_BORDER}`, borderRadius: 20, padding: "3px 10px" }}>{t}</span>
                    ))}
                  </div>
                </div>
              </div>
            </FadeIn>

            <FadeIn delay={160}>
              <div>
                <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.14em", color: TEXT_SUB, textTransform: "uppercase" as const, marginBottom: 18 }}>
                  После встреч человек
                </div>
                <div style={{ display: "flex", flexDirection: "column" as const, gap: 11 }}>
                  {AFTER_MEETINGS.map((item, i) => (
                    <div key={i} style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={BLUE} strokeWidth="2.5" style={{ flexShrink: 0, marginTop: 2 }}><path d="M20 6 9 17l-5-5"/></svg>
                      <span style={{ fontSize: 14, color: TEXT, lineHeight: 1.5 }}>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ── БЛОК 4: ЗАЧЕМ ИНСТРУМЕНТЫ ── */}
      <section className="pm-section-pad" style={{ background: DARK2 }}>
        <div style={{ maxWidth: 900, margin: "0 auto", padding: "0 24px" }}>
          <FadeIn>
            <div className="pm-two-col">
              <div>
                <BlueLine />
                <h2 style={{
                  fontFamily: "Cormorant, serif",
                  fontSize: "clamp(24px, 3.5vw, 44px)",
                  fontWeight: 700, color: "#fff", lineHeight: 1.15, marginBottom: 20,
                }}>
                  Вы получаете не просто обучение.{" "}
                  <span style={{ color: BLUE }}>А интеллектуальную систему для работы с клиентами и собой.</span>
                </h2>
              </div>
              <div>
                <div style={{ display: "flex", flexDirection: "column" as const, gap: 14 }}>
                  {[
                    { label: "Без системы", text: "Работают интуитивно, теряются в сложных случаях, быстро выгорают" },
                    { label: "С платформой", text: "Аналитика, диагностика, ИИ, профессиональные алгоритмы, системный подход" },
                  ].map((row, i) => (
                    <div key={i} style={{ padding: "18px 20px", background: DARK3, borderRadius: 12, border: `1px solid ${i === 1 ? BLUE_BORDER : "rgba(255,255,255,0.04)"}` }}>
                      <div style={{ fontSize: 11, fontWeight: 700, color: i === 1 ? BLUE : TEXT_SUB, letterSpacing: "0.1em", marginBottom: 7 }}>{row.label}</div>
                      <p style={{ margin: 0, fontSize: 13, color: TEXT_SUB, lineHeight: 1.65 }}>{row.text}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ── БЛОК 5: ИНСТРУМЕНТЫ ── */}
      <section id="tools" className="pm-section-pad" style={{ borderBottom: `1px solid rgba(255,255,255,0.05)` }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px" }}>
          <FadeIn>
            <div style={{ marginBottom: 52 }}>
              <BlueLine />
              <h2 style={{
                fontFamily: "Cormorant, serif",
                fontSize: "clamp(26px, 4vw, 44px)",
                fontWeight: 700, color: "#fff", margin: 0,
              }}>
                Инструменты платформы
              </h2>
            </div>
          </FadeIn>

          <div className="pm-tools-grid">
            {TOOLS.map((tool, i) => (
              <FadeIn key={i} delay={i * 60}>
                <div style={{
                  background: DARK2, borderRadius: 18, padding: "28px 24px",
                  border: "1px solid rgba(255,255,255,0.05)",
                  display: "flex", flexDirection: "column" as const, height: "100%",
                  boxSizing: "border-box" as const,
                  transition: "border-color 0.25s",
                }}
                  onMouseEnter={e => (e.currentTarget as HTMLDivElement).style.borderColor = BLUE_BORDER}
                  onMouseLeave={e => (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(255,255,255,0.05)"}
                >
                  <div style={{ fontFamily: "Cormorant, serif", fontSize: 28, fontWeight: 700, color: `${BLUE}40`, marginBottom: 14 }}>{tool.n}</div>
                  <div style={{ fontSize: 15, fontWeight: 700, color: "#fff", marginBottom: 5 }}>{tool.title}</div>
                  <div style={{ fontSize: 11, color: BLUE, marginBottom: 14, letterSpacing: "0.06em" }}>{tool.sub}</div>
                  <p style={{ margin: "0 0 18px", fontSize: 13, color: TEXT_SUB, lineHeight: 1.7, flex: 1 }}>{tool.text}</p>
                  <div style={{ padding: "10px 14px", background: BLUE_LIGHT, borderRadius: 10, border: `1px solid ${BLUE_BORDER}` }}>
                    <p style={{ margin: 0, fontSize: 12, color: BLUE, lineHeight: 1.55 }}>{tool.effect}</p>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── БЛОК 6: ФИНАНСЫ ── */}
      <section className="pm-section-pad" style={{ background: DARK2 }}>
        <div style={{ maxWidth: 900, margin: "0 auto", padding: "0 24px" }}>
          <div className="pm-two-col">
            <FadeIn>
              <div>
                <BlueLine />
                <h2 style={{
                  fontFamily: "Cormorant, serif",
                  fontSize: "clamp(26px, 3.8vw, 46px)",
                  fontWeight: 700, color: "#fff", lineHeight: 1.15, marginBottom: 20,
                }}>
                  Высокий доход начинается с{" "}
                  <span style={{ color: BLUE }}>внутренней устойчивости.</span>
                </h2>
                <p style={{ fontSize: 14, color: TEXT_SUB, lineHeight: 1.8, margin: "0 0 20px" }}>
                  Рост происходит не через давление. А через уверенность, глубину, систему и внутреннее состояние.
                </p>
              </div>
            </FadeIn>
            <FadeIn delay={120}>
              <div style={{ display: "flex", flexDirection: "column" as const, gap: 11 }}>
                {[
                  "Спокойнее относится к деньгам",
                  "Повышает стоимость услуг",
                  "Начинает привлекать более осознанных клиентов",
                  "Формирует репутацию",
                  "Получает рекомендации",
                  "Ощущает профессиональную ценность",
                ].map((item, i) => (
                  <div key={i} style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={BLUE} strokeWidth="2.5" style={{ flexShrink: 0, marginTop: 2 }}><path d="M20 6 9 17l-5-5"/></svg>
                    <span style={{ fontSize: 14, color: TEXT, lineHeight: 1.5 }}>{item}</span>
                  </div>
                ))}
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ── БЛОК 7: РЕЗУЛЬТАТ ── */}
      <section className="pm-section-pad" style={{ borderBottom: `1px solid rgba(255,255,255,0.05)` }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px" }}>
          <FadeIn>
            <div style={{ textAlign: "center" as const, marginBottom: 48 }}>
              <BlueLine />
              <h2 style={{
                fontFamily: "Cormorant, serif",
                fontSize: "clamp(26px, 4vw, 44px)",
                fontWeight: 700, color: "#fff", margin: 0,
              }}>
                Результат после программы
              </h2>
            </div>
          </FadeIn>
          <div className="pm-results-grid">
            {RESULTS.map((r, i) => (
              <FadeIn key={i} delay={i * 70}>
                <div style={{
                  background: DARK3, borderRadius: 16, padding: "26px 22px",
                  border: "1px solid rgba(255,255,255,0.05)",
                  height: "100%", boxSizing: "border-box" as const,
                }}>
                  <div style={{ width: 44, height: 44, borderRadius: 12, background: `${BLUE}18`, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 14 }}>
                    <Icon name={r.icon} size={22} style={{ color: BLUE }} />
                  </div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: BLUE, marginBottom: 14, letterSpacing: "0.04em" }}>{r.title}</div>
                  <div style={{ display: "flex", flexDirection: "column" as const, gap: 7 }}>
                    {r.items.map((item, j) => (
                      <div key={j} style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
                        <div style={{ width: 4, height: 4, borderRadius: "50%", background: `${BLUE}60`, flexShrink: 0, marginTop: 6 }} />
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

      {/* ── БЛОК 9: ФИНАЛ ── */}
      <section className="pm-section-pad" style={{ textAlign: "center" as const, background: DARK2 }}>
        <div style={{ maxWidth: 760, margin: "0 auto", padding: "0 24px" }}>
          <FadeIn>
            <BlueLine />
            <h2 style={{
              fontFamily: "Cormorant, serif",
              fontSize: "clamp(26px, 4.5vw, 52px)",
              fontWeight: 700, color: "#fff", lineHeight: 1.12, marginBottom: 20,
            }}>
              Вы перестаёте быть просто специалистом.{" "}
              <span style={{ color: BLUE }}>И становитесь человеком, которому доверяют своё состояние.</span>
            </h2>
            <p style={{ fontSize: "clamp(14px, 1.7vw, 16px)", color: TEXT_SUB, lineHeight: 1.85, marginBottom: 40 }}>
              Это профессиональный рост, финансовый рост, изменение мышления и внутреннего состояния. Переход на новый уровень практики.
            </p>
          </FadeIn>
          <FadeIn delay={100}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 2, maxWidth: 560, margin: "0 auto" }} className="pm-transitions">
              {[
                ["Хаос", "Система"],
                ["Тревога", "Уверенность"],
                ["Обычный", "Премиальный"],
                ["Выживание", "Рост"],
              ].map(([from, to], i) => (
                <div key={i} style={{ padding: "16px 12px", background: DARK3, textAlign: "center" as const }}>
                  <div style={{ fontSize: 11, color: TEXT_SUB, marginBottom: 7 }}>{from}</div>
                  <div style={{ width: 16, height: 1, background: `${BLUE}50`, margin: "0 auto 7px" }} />
                  <div style={{ fontSize: 12, fontWeight: 600, color: BLUE }}>{to}</div>
                </div>
              ))}
            </div>
          </FadeIn>
        </div>
      </section>
    </>
  );
}