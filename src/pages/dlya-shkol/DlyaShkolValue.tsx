import Icon from "@/components/ui/icon";
import {
  TEAL, DARK, GRAY, SERIF,
  CHAMPIONSHIPS, STATS,
  SectionLabel,
} from "./DlyaShkolShared";

export default function DlyaShkolValue() {
  return (
    <>
      {/* ── 6. ГЛАВНЫЙ ПРОДАЮЩИЙ БЛОК ── */}
      <section style={{ padding: "96px 32px", background: `linear-gradient(135deg, ${DARK} 0%, #0F2A30 100%)`, position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: "-20%", right: "-10%", width: 600, height: 600, borderRadius: "50%", background: "radial-gradient(circle, rgba(45,212,191,0.08) 0%, transparent 65%)", pointerEvents: "none" }} />
        <div style={{ maxWidth: 900, margin: "0 auto", position: "relative" }}>
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <div style={{ fontSize: 12, color: TEAL, fontWeight: 500, letterSpacing: "1.5px", textTransform: "uppercase", marginBottom: 20 }}>Главное преимущество</div>
            <h2 style={{ fontFamily: SERIF, fontSize: "clamp(26px,3.5vw,42px)", fontWeight: 500, color: "#fff", margin: "0 0 20px", lineHeight: 1.2 }}>
              Ваш курс может быть рекомендован именно тогда, когда он нужен выпускнику
            </h2>
            <p style={{ fontSize: 16, color: "rgba(255,255,255,0.55)", maxWidth: 620, margin: "0 auto", lineHeight: 1.7 }}>
              Промт Диалог отслеживает цели и задачи пользователя. Когда для следующего этапа развития ему требуется новый навык, система может предложить подходящий курс партнерской школы.
            </p>
          </div>

          <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, padding: "36px 40px", backdropFilter: "blur(10px)" }}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 24 }}>
              <div>
                <div style={{ fontSize: 11, color: TEAL, textTransform: "uppercase", letterSpacing: "1px", marginBottom: 8 }}>Цель</div>
                <div style={{ fontSize: 15, color: "#fff", fontWeight: 500 }}>«Хочу увеличить доход»</div>
              </div>
              <div>
                <div style={{ fontSize: 11, color: TEAL, textTransform: "uppercase", letterSpacing: "1px", marginBottom: 8 }}>Текущая проблема</div>
                <div style={{ fontSize: 15, color: "#fff", fontWeight: 500 }}>Недостаточно новых клиентов</div>
              </div>
              <div>
                <div style={{ fontSize: 11, color: TEAL, textTransform: "uppercase", letterSpacing: "1px", marginBottom: 8 }}>Следующий навык</div>
                <div style={{ fontSize: 15, color: "#fff", fontWeight: 500 }}>Продвижение и позиционирование</div>
              </div>
            </div>
            <div style={{ borderTop: "1px solid rgba(255,255,255,0.1)", marginTop: 28, paddingTop: 28, display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 20 }}>
              <div>
                <div style={{ fontSize: 11, color: TEAL, textTransform: "uppercase", letterSpacing: "1px", marginBottom: 8 }}>Рекомендация</div>
                <div style={{ fontSize: 18, color: "#fff", fontWeight: 700, fontFamily: SERIF }}>Курс вашей школы «Продвижение мастера»</div>
              </div>
              <div style={{
                display: "inline-flex", alignItems: "center", gap: 8,
                background: `linear-gradient(135deg, ${TEAL}, #14B8A6)`,
                color: "#0F172A", padding: "13px 28px", borderRadius: 2,
                fontSize: 14, fontWeight: 600, whiteSpace: "nowrap",
              }}>
                Перейти к курсу
                <Icon name="ArrowRight" size={15} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 7. ЭТО НЕ ПРОСТО РЕКЛАМА ── */}
      <section style={{ padding: "88px 32px", background: "#fff" }}>
        <div style={{ maxWidth: 900, margin: "0 auto", textAlign: "center" }}>
          <SectionLabel>Целевой спрос, а не размещение</SectionLabel>
          <h2 style={{ fontFamily: SERIF, fontSize: "clamp(26px,3.5vw,42px)", fontWeight: 500, color: DARK, margin: "0 0 40px", lineHeight: 1.1 }}>
            Не просто размещение. Целевой спрос
          </h2>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 40, textAlign: "left" }} className="compare-grid">
            <div style={{ background: "#FEF2F2", border: "1px solid #FECDD3", borderRadius: 6, padding: "28px 26px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
                <Icon name="X" size={18} style={{ color: "#DC2626" }} />
                <div style={{ fontWeight: 700, fontSize: 15, color: "#991B1B" }}>Обычная реклама</div>
              </div>
              <div style={{ fontSize: 14, color: "#7F1D1D", lineHeight: 1.7 }}>Курс показывают всем подряд, независимо от того, нужен ли он человеку прямо сейчас</div>
            </div>
            <div style={{ background: "rgba(45,212,191,0.06)", border: "1px solid rgba(45,212,191,0.3)", borderRadius: 6, padding: "28px 26px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
                <Icon name="Check" size={18} style={{ color: TEAL }} />
                <div style={{ fontWeight: 700, fontSize: 15, color: DARK }}>Промт Диалог</div>
              </div>
              <div style={{ fontSize: 14, color: "#334155", lineHeight: 1.7 }}>Курс показывают именно тогда, когда у пользователя возникла соответствующая потребность и цель</div>
            </div>
          </div>

          <div style={{ fontFamily: SERIF, fontSize: "clamp(19px,2.2vw,26px)", fontWeight: 500, color: DARK, lineHeight: 1.5, maxWidth: 680, margin: "0 auto" }}>
            Мы не хотим просто показывать ваши курсы. Мы хотим приводить к ним пользователя тогда, когда у него возникает соответствующая потребность.
          </div>
        </div>
      </section>

      {/* ── 8. ВИТРИНА ШКОЛЫ ── */}
      <section style={{ padding: "88px 32px", background: "#F8FAFC" }}>
        <div style={{ maxWidth: 1000, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <SectionLabel>Каталог обучения</SectionLabel>
            <h2 style={{ fontFamily: SERIF, fontSize: "clamp(28px,3.5vw,44px)", fontWeight: 500, color: DARK, margin: 0, lineHeight: 1.1 }}>
              Ваша школа — внутри экосистемы Промт Диалог
            </h2>
          </div>

          <div style={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: 8, padding: "32px", boxShadow: "0 2px 16px rgba(0,0,0,0.04)" }}>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 28 }}>
              {["Для мастеров", "Для массажистов", "Для администраторов", "Для владельцев"].map((cat, i) => (
                <div key={cat} style={{
                  padding: "8px 18px", borderRadius: 100, fontSize: 13, fontWeight: 600,
                  background: i === 0 ? DARK : "#F1F5F9", color: i === 0 ? "#fff" : GRAY,
                }}>
                  {cat}
                </div>
              ))}
            </div>

            <div style={{ background: "#F8FAFC", border: "1px solid #E2E8F0", borderRadius: 6, padding: "24px 26px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16 }}>
              <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
                <div style={{ width: 48, height: 48, borderRadius: 6, background: "rgba(45,212,191,0.12)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <Icon name="GraduationCap" size={22} style={{ color: TEAL }} />
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 16, color: DARK, marginBottom: 4 }}>Продвижение мастера</div>
                  <div style={{ fontSize: 13, color: GRAY, maxWidth: 400 }}>Практический курс для специалистов, которые хотят системно привлекать клиентов</div>
                </div>
              </div>
              <div style={{
                display: "inline-flex", alignItems: "center", gap: 6,
                border: `1px solid ${TEAL}`, color: TEAL,
                padding: "9px 20px", borderRadius: 2, fontSize: 13, fontWeight: 600, whiteSpace: "nowrap",
              }}>
                Подробнее
                <Icon name="ArrowRight" size={13} />
              </div>
            </div>
            <p style={{ fontSize: 12, color: GRAY, marginTop: 16, marginBottom: 0, fontWeight: 300, textAlign: "center" }}>
              Кнопка ведет на сайт вашей школы, а не на стороннюю страницу
            </p>
          </div>
        </div>
      </section>

      {/* ── 9. СТАТИСТИКА ── */}
      <section style={{ padding: "88px 32px", background: "#fff" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <SectionLabel>Прозрачная аналитика</SectionLabel>
            <h2 style={{ fontFamily: SERIF, fontSize: "clamp(28px,3.5vw,44px)", fontWeight: 500, color: DARK, margin: 0, lineHeight: 1.1 }}>
              Вы видите, что происходит с вашими выпускниками
            </h2>
          </div>

          <div style={{ background: DARK, borderRadius: 8, padding: "36px 32px" }}>
            <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, marginBottom: 28 }}>
              {["14 дней", "30 дней", "90 дней"].map((p, i) => (
                <div key={p} style={{
                  padding: "6px 16px", borderRadius: 100, fontSize: 12, fontWeight: 600,
                  background: i === 1 ? TEAL : "rgba(255,255,255,0.06)", color: i === 1 ? DARK : "rgba(255,255,255,0.5)",
                }}>
                  {p}
                </div>
              ))}
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: 20 }}>
              {STATS.map(s => (
                <div key={s.label}>
                  <div style={{ fontFamily: SERIF, fontSize: 40, fontWeight: 600, color: TEAL, lineHeight: 1 }}>{s.value}</div>
                  <div style={{ fontSize: 13, color: "rgba(255,255,255,0.5)", marginTop: 8 }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── 10. РЕЙТИНГ ШКОЛ ── */}
      <section style={{ padding: "88px 32px", background: "#F8FAFC" }}>
        <div style={{ maxWidth: 800, margin: "0 auto", textAlign: "center" }}>
          <div style={{ width: 56, height: 56, borderRadius: 14, background: "rgba(45,212,191,0.1)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 24px" }}>
            <Icon name="Award" size={26} style={{ color: TEAL }} />
          </div>
          <h2 style={{ fontFamily: SERIF, fontSize: "clamp(28px,3.5vw,44px)", fontWeight: 500, color: DARK, margin: "0 0 20px", lineHeight: 1.1 }}>
            Станьте частью рейтинга образовательных партнеров
          </h2>
          <div style={{ display: "flex", gap: 10, justifyContent: "center", marginBottom: 28, flexWrap: "wrap" }}>
            {["14 дней", "30 дней", "90 дней"].map(p => (
              <div key={p} style={{ padding: "8px 20px", borderRadius: 100, fontSize: 13, fontWeight: 600, background: "#fff", border: "1px solid #E2E8F0", color: GRAY }}>{p}</div>
            ))}
          </div>
          <p style={{ fontSize: 14, color: GRAY, lineHeight: 1.8, marginBottom: 28 }}>
            Показатели учитывают активность выпускников, количество пользователей, использование инструментов, участие в чемпионатах и вовлеченность.
          </p>
          <p style={{ fontFamily: SERIF, fontSize: 19, color: DARK, fontWeight: 500, lineHeight: 1.5 }}>
            Ваши выпускники становятся частью репутации школы внутри профессионального сообщества.
          </p>
        </div>
      </section>

      {/* ── 11. ЧЕМПИОНАТЫ ── */}
      <section style={{ padding: "88px 32px", background: "#fff" }}>
        <div style={{ maxWidth: 1000, margin: "0 auto", textAlign: "center" }}>
          <SectionLabel>Соревновательный элемент</SectionLabel>
          <h2 style={{ fontFamily: SERIF, fontSize: "clamp(28px,3.5vw,44px)", fontWeight: 500, color: DARK, margin: "0 0 40px", lineHeight: 1.1 }}>
            Выпускники могут представлять вашу школу в чемпионатах
          </h2>

          <div style={{ display: "grid", gridTemplateColumns: `repeat(${CHAMPIONSHIPS.length}, 1fr)`, gap: 14, marginBottom: 40 }} className="championships-grid">
            {CHAMPIONSHIPS.map(c => (
              <div key={c.title} style={{ background: "#F8FAFC", border: "1px solid #E2E8F0", borderRadius: 6, padding: "22px 16px", display: "flex", flexDirection: "column", alignItems: "center", gap: 12, textAlign: "center" }}>
                <div style={{ width: 40, height: 40, borderRadius: 4, background: "rgba(45,212,191,0.1)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <Icon name={c.icon} size={19} style={{ color: TEAL }} />
                </div>
                <span style={{ fontSize: 13.5, fontWeight: 600, color: DARK, lineHeight: 1.4 }}>{c.title}</span>
              </div>
            ))}
          </div>

          <p style={{ fontSize: 15, color: GRAY, lineHeight: 1.8, maxWidth: 560, margin: "0 auto 32px" }}>
            Победы и достижения выпускников создают дополнительную узнаваемость школы.
          </p>

          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 0, flexWrap: "wrap" }}>
            {["Школа", "Выпускник", "Участие", "Результат", "Рейтинг школы"].map((s, i, arr) => (
              <div key={s} style={{ display: "flex", alignItems: "center" }}>
                <div style={{ background: "rgba(45,212,191,0.08)", border: "1px solid rgba(45,212,191,0.25)", borderRadius: 100, padding: "9px 18px", fontSize: 13, fontWeight: 600, color: DARK, whiteSpace: "nowrap" }}>
                  {s}
                </div>
                {i < arr.length - 1 && <Icon name="ArrowRight" size={15} style={{ color: "#CBD5E1", margin: "0 8px" }} />}
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}