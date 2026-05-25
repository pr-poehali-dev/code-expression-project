import { PEARL, PEARL_LIGHT, PEARL_BORDER, DARK2, DARK3, DARK4, TEXT, TEXT_SUB, FadeIn, PearlLine, PAINS, MEETINGS_TOPICS, AFTER_MEETINGS, TOOLS, RESULTS } from "./EkspertShared";
import Icon from "@/components/ui/icon";

export default function EkspertSections() {
  return (
    <>
      {/* ── БЛОК 2: ГЛАВНАЯ ПРОБЛЕМА ── */}
      <section className="ex-section-pad" style={{ background: DARK2 }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 24px" }}>
          <FadeIn>
            <div style={{ maxWidth: 660, marginBottom: 48 }}>
              <PearlLine />
              <h2 style={{
                fontFamily: "Cormorant, serif",
                fontSize: "clamp(26px, 4vw, 46px)",
                fontWeight: 700, color: "#fff", lineHeight: 1.15, margin: 0,
              }}>
                Даже сильные специалисты часто живут в напряжении, хаосе{" "}
                <span style={{ color: PEARL }}>и внутреннем страхе.</span>
              </h2>
            </div>
          </FadeIn>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 2 }}>
            {PAINS.map((pain, i) => (
              <FadeIn key={i} delay={i * 40}>
                <div style={{ padding: "22px 18px", background: DARK3, borderLeft: `2px solid ${PEARL}20` }}>
                  <div style={{ width: 16, height: 1, background: `${PEARL}40`, marginBottom: 12 }} />
                  <p style={{ margin: 0, fontSize: 13, color: TEXT_SUB, lineHeight: 1.65, fontWeight: 500 }}>{pain}</p>
                </div>
              </FadeIn>
            ))}
          </div>

          <FadeIn delay={200}>
            <div style={{
              marginTop: 36, padding: "24px 28px",
              background: `linear-gradient(135deg, ${DARK4}, ${DARK3})`,
              borderRadius: 16, border: `1px solid ${PEARL_BORDER}`,
              maxWidth: 640,
            }}>
              <p style={{ margin: 0, fontSize: 15, color: TEXT_SUB, lineHeight: 1.8, fontStyle: "italic" }}>
                Проблема не только в знаниях. А в состоянии, мышлении, внутренней опоре и умении выдерживать высокий уровень ответственности.
              </p>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ── БЛОК 3: ЛИЧНОЕ СОПРОВОЖДЕНИЕ ── */}
      <section className="ex-section-pad" style={{ borderBottom: `1px solid rgba(255,255,255,0.04)` }}>
        <div style={{ maxWidth: 1000, margin: "0 auto", padding: "0 24px" }}>
          <FadeIn>
            <div style={{ maxWidth: 620, marginBottom: 52 }}>
              <PearlLine />
              <h2 style={{
                fontFamily: "Cormorant, serif",
                fontSize: "clamp(26px, 4vw, 46px)",
                fontWeight: 700, color: "#fff", lineHeight: 1.15, marginBottom: 16,
              }}>
                Платежеспособная аудитория чувствует специалиста глубже, чем его техники
              </h2>
              <p style={{ fontSize: 15, color: TEXT_SUB, lineHeight: 1.8, margin: 0 }}>
                10 персональных встреч — это работа напрямую с вашим внутренним состоянием, мышлением и профессиональной позицией.
              </p>
            </div>
          </FadeIn>

          <div className="ex-two-col">
            <FadeIn delay={80}>
              <div>
                <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.14em", color: PEARL, textTransform: "uppercase" as const, marginBottom: 18 }}>
                  10 встреч — работаем с
                </div>
                <div style={{ display: "flex", flexDirection: "column" as const, gap: 11 }}>
                  {MEETINGS_TOPICS.map((item, i) => (
                    <div key={i} style={{ display: "flex", gap: 12, alignItems: "center" }}>
                      <div style={{ width: 6, height: 6, borderRadius: "50%", background: PEARL, flexShrink: 0 }} />
                      <span style={{ fontSize: 14, color: TEXT_SUB }}>{item}</span>
                    </div>
                  ))}
                </div>
                <div style={{
                  marginTop: 24, padding: "18px 20px",
                  background: DARK3, borderRadius: 12, border: "1px solid rgba(255,255,255,0.04)",
                }}>
                  <div style={{ fontSize: 11, color: TEXT_SUB, marginBottom: 10, letterSpacing: "0.08em" }}>Инструменты работы</div>
                  <div style={{ display: "flex", flexWrap: "wrap" as const, gap: 7 }}>
                    {["Коучинговые инструменты", "Поведенческие модели", "Телесные практики", "Глубокие разборы"].map((t, i) => (
                      <span key={i} style={{ fontSize: 12, color: PEARL, background: PEARL_LIGHT, border: `1px solid ${PEARL_BORDER}`, borderRadius: 20, padding: "3px 10px" }}>{t}</span>
                    ))}
                  </div>
                </div>
              </div>
            </FadeIn>

            <FadeIn delay={160}>
              <div>
                <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.14em", color: TEXT_SUB, textTransform: "uppercase" as const, marginBottom: 18 }}>
                  Результат
                </div>
                <div style={{ display: "flex", flexDirection: "column" as const, gap: 11 }}>
                  {AFTER_MEETINGS.map((item, i) => (
                    <div key={i} style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={PEARL} strokeWidth="2.5" style={{ flexShrink: 0, marginTop: 2 }}><path d="M20 6 9 17l-5-5"/></svg>
                      <span style={{ fontSize: 14, color: TEXT, lineHeight: 1.5 }}>{item}</span>
                    </div>
                  ))}
                </div>

                {/* Цитата */}
                <div style={{
                  marginTop: 28, padding: "20px 22px",
                  background: `linear-gradient(135deg, ${DARK4}, ${DARK3})`,
                  borderRadius: 14, borderLeft: `2px solid ${PEARL}40`,
                }}>
                  <p style={{ margin: 0, fontSize: 14, color: TEXT_SUB, lineHeight: 1.75, fontStyle: "italic" }}>
                    «Вы больше не просто специалист. Вы формируете уровень, которому доверяют состояние, здоровье и жизнь»
                  </p>
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ── БЛОК 4: ЗАЧЕМ ПЛАТФОРМА ── */}
      <section className="ex-section-pad" style={{ background: DARK2 }}>
        <div style={{ maxWidth: 900, margin: "0 auto", padding: "0 24px" }}>
          <FadeIn>
            <div className="ex-two-col">
              <div>
                <PearlLine />
                <h2 style={{
                  fontFamily: "Cormorant, serif",
                  fontSize: "clamp(24px, 3.5vw, 44px)",
                  fontWeight: 700, color: "#fff", lineHeight: 1.15, marginBottom: 20,
                }}>
                  Вы получаете систему, которая усиливает вас как специалиста{" "}
                  <span style={{ color: PEARL }}>каждый день</span>
                </h2>
              </div>
              <div>
                <div style={{ display: "flex", flexDirection: "column" as const, gap: 14 }}>
                  {[
                    { label: "Без системы", text: "Интуиция, хаос, выгорание, страх сложных случаев, зависимость от настроения" },
                    { label: "С платформой «Эксперт»", text: "Аналитика, ИИ, диагностика, интеллектуальная поддержка, система принятия решений — без ограничений", accent: true },
                  ].map((row, i) => (
                    <div key={i} style={{
                      padding: "18px 20px", background: DARK3, borderRadius: 12,
                      border: `1px solid ${row.accent ? PEARL_BORDER : "rgba(255,255,255,0.04)"}`,
                    }}>
                      <div style={{ fontSize: 11, fontWeight: 700, color: row.accent ? PEARL : TEXT_SUB, letterSpacing: "0.1em", marginBottom: 7 }}>{row.label}</div>
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
      <section id="tools" className="ex-section-pad" style={{ borderBottom: `1px solid rgba(255,255,255,0.04)` }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px" }}>
          <FadeIn>
            <div style={{ marginBottom: 52 }}>
              <PearlLine />
              <h2 style={{
                fontFamily: "Cormorant, serif",
                fontSize: "clamp(26px, 4vw, 44px)",
                fontWeight: 700, color: "#fff", margin: 0,
              }}>
                Инструменты без ограничений
              </h2>
            </div>
          </FadeIn>

          <div className="ex-tools-grid">
            {TOOLS.map((tool, i) => (
              <FadeIn key={i} delay={i * 55}>
                <div style={{
                  background: DARK2, borderRadius: 18, padding: "26px 22px",
                  border: "1px solid rgba(255,255,255,0.04)",
                  display: "flex", flexDirection: "column" as const,
                  height: "100%", boxSizing: "border-box" as const,
                  transition: "border-color 0.3s, box-shadow 0.3s",
                }}
                  onMouseEnter={e => {
                    const el = e.currentTarget as HTMLDivElement;
                    el.style.borderColor = PEARL_BORDER;
                    el.style.boxShadow = `0 8px 40px rgba(0,0,0,0.3)`;
                  }}
                  onMouseLeave={e => {
                    const el = e.currentTarget as HTMLDivElement;
                    el.style.borderColor = "rgba(255,255,255,0.04)";
                    el.style.boxShadow = "none";
                  }}
                >
                  <div style={{ fontFamily: "Cormorant, serif", fontSize: 26, fontWeight: 700, color: `${PEARL}35`, marginBottom: 12 }}>{tool.n}</div>
                  <div style={{ fontSize: 15, fontWeight: 700, color: "#fff", marginBottom: 5 }}>{tool.title}</div>
                  <div style={{ fontSize: 11, color: PEARL, marginBottom: 14, letterSpacing: "0.06em" }}>{tool.sub}</div>
                  <p style={{ margin: "0 0 16px", fontSize: 13, color: TEXT_SUB, lineHeight: 1.7, flex: 1 }}>{tool.text}</p>
                  <div style={{ padding: "10px 14px", background: PEARL_LIGHT, borderRadius: 10, border: `1px solid ${PEARL_BORDER}` }}>
                    <p style={{ margin: 0, fontSize: 12, color: PEARL, lineHeight: 1.55 }}>{tool.effect}</p>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── БЛОК 6: ИЗМЕНЕНИЕ УРОВНЯ ── */}
      <section className="ex-section-pad" style={{ background: DARK2 }}>
        <div style={{ maxWidth: 900, margin: "0 auto", padding: "0 24px" }}>
          <div className="ex-two-col">
            <FadeIn>
              <div>
                <PearlLine />
                <h2 style={{
                  fontFamily: "Cormorant, serif",
                  fontSize: "clamp(26px, 3.8vw, 46px)",
                  fontWeight: 700, color: "#fff", lineHeight: 1.15, marginBottom: 20,
                }}>
                  Когда меняется состояние специалиста —{" "}
                  <span style={{ color: PEARL }}>меняется его практика, доход и окружение</span>
                </h2>
                <p style={{ fontSize: 14, color: TEXT_SUB, lineHeight: 1.8, margin: "0 0 20px" }}>
                  Рост происходит не через давление. А через внутреннюю силу, профессиональную глубину и состояние.
                </p>
              </div>
            </FadeIn>
            <FadeIn delay={120}>
              <div style={{ display: "flex", flexDirection: "column" as const, gap: 11 }}>
                {[
                  "Повышает стоимость услуг",
                  "Начинает привлекать более осознанных клиентов",
                  "Получает рекомендации",
                  "Чувствует спокойствие и устойчивость",
                  "Работает без внутренней паники",
                  "Выстраивает устойчивую практику",
                ].map((item, i) => (
                  <div key={i} style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={PEARL} strokeWidth="2.5" style={{ flexShrink: 0, marginTop: 2 }}><path d="M20 6 9 17l-5-5"/></svg>
                    <span style={{ fontSize: 14, color: TEXT, lineHeight: 1.5 }}>{item}</span>
                  </div>
                ))}
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ── БЛОК 7: РЕЗУЛЬТАТЫ ── */}
      <section className="ex-section-pad" style={{ borderBottom: `1px solid rgba(255,255,255,0.04)` }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px" }}>
          <FadeIn>
            <div style={{ textAlign: "center" as const, marginBottom: 48 }}>
              <PearlLine />
              <h2 style={{
                fontFamily: "Cormorant, serif",
                fontSize: "clamp(26px, 4vw, 44px)",
                fontWeight: 700, color: "#fff", margin: 0,
              }}>
                Результат после программы
              </h2>
            </div>
          </FadeIn>
          <div className="ex-results-grid">
            {RESULTS.map((r, i) => (
              <FadeIn key={i} delay={i * 70}>
                <div style={{
                  background: DARK3, borderRadius: 16, padding: "24px 20px",
                  border: "1px solid rgba(255,255,255,0.04)",
                  height: "100%", boxSizing: "border-box" as const,
                }}>
                  <div style={{ width: 44, height: 44, borderRadius: 12, background: `${PEARL}18`, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 14 }}>
                    <Icon name={r.icon} size={22} style={{ color: PEARL }} />
                  </div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: PEARL, marginBottom: 14, letterSpacing: "0.04em" }}>{r.title}</div>
                  <div style={{ display: "flex", flexDirection: "column" as const, gap: 7 }}>
                    {r.items.map((item, j) => (
                      <div key={j} style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
                        <div style={{ width: 4, height: 4, borderRadius: "50%", background: `${PEARL}55`, flexShrink: 0, marginTop: 6 }} />
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
      <section className="ex-section-pad" style={{ textAlign: "center" as const }}>
        <div style={{ maxWidth: 760, margin: "0 auto", padding: "0 24px" }}>
          <FadeIn>
            <PearlLine />
            <h2 style={{
              fontFamily: "Cormorant, serif",
              fontSize: "clamp(26px, 4.5vw, 52px)",
              fontWeight: 700, color: "#fff", lineHeight: 1.12, marginBottom: 20,
            }}>
              Вы перестаете быть специалистом, который пытается выжить —{" "}
              <span style={{ color: PEARL }}>и становитесь человеком, которому доверяют глубоко и надолго</span>
            </h2>
            <p style={{ fontSize: "clamp(14px, 1.7vw, 16px)", color: TEXT_SUB, lineHeight: 1.85, marginBottom: 48 }}>
              Новый уровень мышления, практики, клиентов и жизни. Это не курс — это система, которая меняет специалиста изнутри.
            </p>
          </FadeIn>
          <FadeIn delay={100}>
            <div className="ex-transitions" style={{ display: "grid", gap: 2, maxWidth: 560, margin: "0 auto" }}>
              {[
                ["Хаос", "Система"],
                ["Страх", "Устойчивость"],
                ["Выживание", "Рост"],
                ["Обычный", "Эксперт"],
              ].map(([from, to], i) => (
                <div key={i} style={{ padding: "16px 12px", background: DARK2, textAlign: "center" as const }}>
                  <div style={{ fontSize: 11, color: TEXT_SUB, marginBottom: 7 }}>{from}</div>
                  <div style={{ width: 16, height: 1, background: `${PEARL}40`, margin: "0 auto 7px" }} />
                  <div style={{ fontSize: 12, fontWeight: 600, color: PEARL }}>{to}</div>
                </div>
              ))}
            </div>
          </FadeIn>
        </div>
      </section>
    </>
  );
}