import { GOLD, DARK2, DARK3, TEXT, TEXT_SUB, FadeIn, GoldLine, PAINS, CHANGES, MODULES, FOR_WHOM } from "./PraktikaShared";

export default function PraktikaSections() {
  return (
    <>
      {/* ── БОЛЬ ── */}
      <section style={{ padding: "96px 0", background: DARK2 }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 24px" }}>
          <FadeIn>
            <div style={{ maxWidth: 600, marginBottom: 60 }}>
              <GoldLine />
              <h2 style={{ fontFamily: "Cormorant, serif", fontSize: "clamp(28px, 4vw, 46px)", fontWeight: 700, color: "#fff", lineHeight: 1.15, margin: 0 }}>
                Почему даже сильные специалисты годами стоят на месте?
              </h2>
            </div>
          </FadeIn>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 2 }}>
            {PAINS.map((pain, i) => (
              <FadeIn key={i} delay={i * 50}>
                <div style={{ padding: "28px 24px", background: DARK3, borderLeft: `2px solid ${GOLD}30` }}>
                  <div style={{ width: 20, height: 1, background: `${GOLD}50`, marginBottom: 16 }} />
                  <p style={{ margin: 0, fontSize: 14, color: TEXT_SUB, lineHeight: 1.6, fontWeight: 500 }}>{pain}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── ПЕРЕЛОМ ── */}
      <section style={{ padding: "96px 0", borderBottom: `1px solid rgba(255,255,255,0.06)` }}>
        <div style={{ maxWidth: 860, margin: "0 auto", padding: "0 24px" }}>
          <FadeIn>
            <GoldLine />
            <h2 style={{ fontFamily: "Cormorant, serif", fontSize: "clamp(28px, 4vw, 48px)", fontWeight: 700, color: "#fff", lineHeight: 1.15, marginBottom: 32 }}>
              Проблема не в техниках.<br />
              <span style={{ color: GOLD }}>Проблема в том, как специалист воспринимает себя.</span>
            </h2>
          </FadeIn>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 48 }} className="pr-price-grid">
            <FadeIn delay={100}>
              <div>
                <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.16em", color: TEXT_SUB, textTransform: "uppercase" as const, marginBottom: 20 }}>Сейчас</div>
                <div style={{ display: "flex", flexDirection: "column" as const, gap: 14 }}>
                  {["Недооценивает себя", "Боится денег", "Не умеет выстраивать ценность", "Работает без структуры", "Эмоционально зависит от клиента"].map((t, i) => (
                    <div key={i} style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                      <span style={{ color: "rgba(255,255,255,0.2)", fontWeight: 700, flexShrink: 0 }}>—</span>
                      <span style={{ fontSize: 14, color: TEXT_SUB, lineHeight: 1.5 }}>{t}</span>
                    </div>
                  ))}
                </div>
              </div>
            </FadeIn>
            <FadeIn delay={180}>
              <div>
                <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.16em", color: GOLD, textTransform: "uppercase" as const, marginBottom: 20 }}>После</div>
                <div style={{ display: "flex", flexDirection: "column" as const, gap: 14 }}>
                  {["Чувствует внутреннюю устойчивость", "Спокойно говорит о деньгах", "Перестаёт бояться отказов", "Понимает свою ценность", "Ведёт практику профессионально"].map((t, i) => (
                    <div key={i} style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={GOLD} strokeWidth="2.5" style={{ flexShrink: 0, marginTop: 2 }}><path d="M20 6 9 17l-5-5"/></svg>
                      <span style={{ fontSize: 14, color: TEXT, lineHeight: 1.5 }}>{t}</span>
                    </div>
                  ))}
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ── ЧТО ИЗМЕНИТСЯ ── */}
      <section style={{ padding: "96px 0", background: DARK2 }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px" }}>
          <FadeIn>
            <div style={{ textAlign: "center" as const, marginBottom: 60 }}>
              <GoldLine />
              <h2 style={{ fontFamily: "Cormorant, serif", fontSize: "clamp(28px, 4vw, 46px)", fontWeight: 700, color: "#fff", margin: 0 }}>
                Что изменится после прохождения программы
              </h2>
            </div>
          </FadeIn>
          <div className="pr-changes">
            {CHANGES.map((c, i) => (
              <FadeIn key={i} delay={i * 70}>
                <div style={{ background: DARK3, borderRadius: 16, padding: "28px 24px", border: "1px solid rgba(255,255,255,0.05)", height: "100%", boxSizing: "border-box" as const }}>
                  <div style={{ fontSize: 28, marginBottom: 16 }}>{c.icon}</div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: GOLD, marginBottom: 16, letterSpacing: "0.04em" }}>{c.title}</div>
                  <div style={{ display: "flex", flexDirection: "column" as const, gap: 8 }}>
                    {c.items.map((item, j) => (
                      <div key={j} style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
                        <div style={{ width: 4, height: 4, borderRadius: "50%", background: `${GOLD}60`, flexShrink: 0, marginTop: 6 }} />
                        <span style={{ fontSize: 13, color: TEXT_SUB, lineHeight: 1.6 }}>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── ТЕХНИКИ ── */}
      <section style={{ padding: "96px 0", borderBottom: `1px solid rgba(255,255,255,0.06)` }}>
        <div style={{ maxWidth: 900, margin: "0 auto", padding: "0 24px" }}>
          <FadeIn>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 60, alignItems: "center" }} className="pr-price-grid">
              <div>
                <GoldLine />
                <h2 style={{ fontFamily: "Cormorant, serif", fontSize: "clamp(26px, 3.5vw, 42px)", fontWeight: 700, color: "#fff", lineHeight: 1.2, marginBottom: 24 }}>
                  Люди платят не за хаотичные упражнения.<br />
                  <span style={{ color: GOLD }}>А за результат и профессиональное ведение.</span>
                </h2>
                <p style={{ fontSize: 14, color: TEXT_SUB, lineHeight: 1.8 }}>
                  В программе — диагностические техники, методы стабилизации, работа с напряжением и стрессом, уверенное сопровождение клиента.
                </p>
              </div>
              <div style={{ display: "flex", flexDirection: "column" as const, gap: 12 }}>
                {["Понимает, что делать", "Перестаёт теряться в сессии", "Работает системно", "Чувствует уверенность в практике", "Вызывает доверие клиентов"].map((t, i) => (
                  <div key={i} style={{ display: "flex", gap: 14, alignItems: "center", padding: "14px 18px", background: DARK2, borderRadius: 12, border: "1px solid rgba(255,255,255,0.05)" }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={GOLD} strokeWidth="2.5"><path d="M20 6 9 17l-5-5"/></svg>
                    <span style={{ fontSize: 13, color: TEXT_SUB }}>{t}</span>
                  </div>
                ))}
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ── ПРЕМИАЛЬНЫЙ КЛИЕНТ ── */}
      <section style={{ padding: "96px 0", background: DARK2 }}>
        <div style={{ maxWidth: 860, margin: "0 auto", padding: "0 24px", textAlign: "center" as const }}>
          <FadeIn>
            <GoldLine />
            <h2 style={{ fontFamily: "Cormorant, serif", fontSize: "clamp(28px, 4vw, 50px)", fontWeight: 700, color: "#fff", lineHeight: 1.15, marginBottom: 24 }}>
              Премиальный клиент чувствует специалиста<br />
              <span style={{ color: GOLD }}>за первые минуты.</span>
            </h2>
            <p style={{ fontSize: 15, color: TEXT_SUB, lineHeight: 1.85, maxWidth: 560, margin: "0 auto 48px" }}>
              Платёжеспособные люди покупают уверенность, спокойствие и ощущение профессионализма. После обучения вы перестаёте заискивать, учитесь держать позицию и спокойно говорить о стоимости.
            </p>
          </FadeIn>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 2 }}>
            {["Перестаёт заискивать", "Держит профессиональную позицию", "Спокойно говорит о стоимости", "Воспринимает себя иначе"].map((t, i) => (
              <FadeIn key={i} delay={i * 60}>
                <div style={{ padding: "24px 20px", background: DARK3, borderTop: `2px solid ${GOLD}30` }}>
                  <p style={{ margin: 0, fontSize: 13, color: TEXT_SUB, lineHeight: 1.6 }}>{t}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── ПРОГРАММА ── */}
      <section id="program" style={{ padding: "96px 0", borderBottom: `1px solid rgba(255,255,255,0.06)` }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 24px" }}>
          <FadeIn>
            <div style={{ marginBottom: 56 }}>
              <GoldLine />
              <h2 style={{ fontFamily: "Cormorant, serif", fontSize: "clamp(28px, 4vw, 44px)", fontWeight: 700, color: "#fff", margin: 0 }}>
                Программа курса
              </h2>
            </div>
          </FadeIn>
          <div className="pr-modules">
            {MODULES.map((m, i) => (
              <FadeIn key={i} delay={i * 50}>
                <div style={{ padding: "28px 24px", background: DARK2, borderLeft: `1px solid rgba(255,255,255,0.05)`, borderBottom: `1px solid rgba(255,255,255,0.05)` }}>
                  <div style={{ fontFamily: "Cormorant, serif", fontSize: 28, fontWeight: 700, color: `${GOLD}40`, marginBottom: 12 }}>{m.n}</div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: "#fff", marginBottom: 8 }}>{m.title}</div>
                  <p style={{ margin: 0, fontSize: 12, color: TEXT_SUB, lineHeight: 1.65 }}>{m.text}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── ДЛЯ КОГО ── */}
      <section style={{ padding: "96px 0", background: DARK2 }}>
        <div style={{ maxWidth: 900, margin: "0 auto", padding: "0 24px" }}>
          <FadeIn>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 60, alignItems: "start" }} className="pr-price-grid">
              <div>
                <GoldLine />
                <h2 style={{ fontFamily: "Cormorant, serif", fontSize: "clamp(26px, 3.5vw, 42px)", fontWeight: 700, color: "#fff", margin: "0 0 12px", lineHeight: 1.2 }}>
                  Для кого эта программа
                </h2>
              </div>
              <div style={{ display: "flex", flexDirection: "column" as const, gap: 12 }}>
                {FOR_WHOM.map((item, i) => (
                  <div key={i} style={{ display: "flex", gap: 12, alignItems: "center" }}>
                    <div style={{ width: 6, height: 6, borderRadius: "50%", background: GOLD, flexShrink: 0 }} />
                    <span style={{ fontSize: 14, color: TEXT_SUB }}>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ── ФИНАЛ ЭМОЦИЯ ── */}
      <section style={{ padding: "96px 0 80px", textAlign: "center" as const }}>
        <div style={{ maxWidth: 760, margin: "0 auto", padding: "0 24px" }}>
          <FadeIn>
            <GoldLine />
            <h2 style={{ fontFamily: "Cormorant, serif", fontSize: "clamp(28px, 4.5vw, 52px)", fontWeight: 700, color: "#fff", lineHeight: 1.15, marginBottom: 24 }}>
              Вы можете быть сильным специалистом<br />
              <span style={{ color: GOLD }}>и при этом жить спокойно, уверенно и достойно.</span>
            </h2>
            <p style={{ fontSize: 16, color: TEXT_SUB, lineHeight: 1.85, marginBottom: 48 }}>
              Это не просто курс. Это переход: из хаоса — в систему, из тревоги — в уверенность, из выживания — в профессиональную практику.
            </p>
          </FadeIn>
          <FadeIn delay={100}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 2, maxWidth: 540, margin: "0 auto 60px" }}>
              {[["Из хаоса", "В систему"], ["Из тревоги", "В уверенность"], ["Из выживания", "В практику"]].map(([from, to], i) => (
                <div key={i} style={{ padding: "20px 16px", background: DARK2, textAlign: "center" as const }}>
                  <div style={{ fontSize: 12, color: TEXT_SUB, marginBottom: 8 }}>{from}</div>
                  <div style={{ width: 20, height: 1, background: `${GOLD}50`, margin: "0 auto 8px" }} />
                  <div style={{ fontSize: 13, fontWeight: 600, color: GOLD }}>{to}</div>
                </div>
              ))}
            </div>
          </FadeIn>
        </div>
      </section>
    </>
  );
}
