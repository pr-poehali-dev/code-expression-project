import Icon from "@/components/ui/icon";
import { ACCENT, BG, h2style } from "./CoiKarShared";

const SCHEDULE = [
  {
    time: "10:00–10:30",
    label: "Старт дня",
    title: "Приветствие, знакомство, установки",
    desc: "Участники знакомятся и рассказывают о своих целях. Разминка и настройка на день практики.",
    tag: null,
  },
  {
    time: "10:30–12:30",
    label: "Блок 1",
    title: "Как работает тело: основа профессионального мышления",
    desc: "Базовое понимание работы тела — как накапливается напряжение, почему появляется боль и зажимы, что такое восстановительный подход. Это фундамент, без которого техники не работают.",
    tag: "Основа",
    topics: [
      "Как тело накапливает стресс и почему появляется боль",
      "Зоны напряжения и как их находить руками",
      "Логика восстановительного подхода — что, зачем и в какой последовательности",
      "Практика диагностики в паре с первых минут",
    ],
    practice: true,
  },
  {
    time: "12:30–13:00",
    label: "Обмен опытом",
    title: "Разбор ощущений, вопросы, корректировка",
    desc: "Участники делятся наблюдениями, тренер отвечает на вопросы и корректирует технику.",
    tag: null,
  },
  {
    time: "13:00–14:00",
    label: "Обед",
    title: "Перерыв",
    desc: "",
    tag: null,
    isBreak: true,
  },
  {
    time: "14:00–16:30",
    label: "Блок 2",
    title: "Техники восстановления: первые профессиональные инструменты",
    desc: "Практические восстановительные техники для работы с самыми распространёнными запросами. Всё отрабатывается в парах под руководством тренера.",
    tag: "Техники",
    topics: [
      "Техники для шеи и плеч: снятие хронического напряжения",
      "Работа со спиной и поясницей — базовые приёмы",
      "Антистресс-техники: как помочь человеку расслабиться глубоко",
      "Как добиваться результата уже после первых процедур",
      "Разбор типичных ошибок начинающих",
    ],
    practice: true,
  },
  {
    time: "16:30–17:00",
    label: "Кофе-пауза",
    title: "Короткий перерыв",
    desc: "",
    tag: null,
    isBreak: true,
  },
  {
    time: "17:00–18:00",
    label: "Финал дня",
    title: "Первый полноценный сеанс — под наблюдением тренера",
    desc: "Каждый участник проводит мини-сеанс, применяя все освоенные техники. Тренер даёт индивидуальную обратную связь и рекомендации по развитию.",
    tag: null,
    topics: [
      "Сборная практика: диагностика + восстановительные техники",
      "Как строить первый сеанс с клиентом",
      "Индивидуальная обратная связь и план следующих шагов",
    ],
    practice: true,
  },
];

export default function CoiKarProgramSection() {
  return (
    <>
      <section style={{ padding: "80px 0 0" }}>
        <div style={{ maxWidth: 860, margin: "0 auto", padding: "0 24px" }}>
          <h2 style={h2style}>Программа дня</h2>

          <div style={{
            display: "inline-flex", alignItems: "center", gap: 10,
            background: `${ACCENT}12`, border: `1.5px solid ${ACCENT}40`,
            borderRadius: 12, padding: "10px 18px", marginBottom: 36,
          }}>
            <Icon name="Star" size={17} style={{ color: ACCENT }} />
            <span style={{ fontSize: 14, fontWeight: 600, color: ACCENT }}>
              Подходит с нуля — медицинское образование и опыт в массаже не нужны
            </span>
          </div>

          <div style={{ position: "relative" }}>
            <div style={{
              position: "absolute", left: 90, top: 0, bottom: 0,
              width: 2, background: `linear-gradient(to bottom, ${ACCENT}40, ${ACCENT}10)`,
            }} className="coi-prog-line" />

            {SCHEDULE.map(({ time, label, title, desc, tag, topics, practice, isBreak }, i) => (
              <div key={i} style={{ display: "flex", gap: 0, marginBottom: isBreak ? 16 : 28, opacity: isBreak ? 0.55 : 1 }} className="coi-prog-row">
                <div style={{ flexShrink: 0, width: 100, paddingTop: 4, paddingRight: 24, textAlign: "right" }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: ACCENT, background: `${ACCENT}12`, borderRadius: 8, padding: "4px 8px", display: "inline-block", lineHeight: 1.4 }}>{time}</div>
                </div>

                <div style={{ flexShrink: 0, width: 0, position: "relative" }}>
                  <div style={{
                    position: "absolute", left: -6, top: 6, width: 12, height: 12, borderRadius: "50%",
                    background: isBreak ? "#ccc" : ACCENT, border: "2px solid #fff",
                    boxShadow: isBreak ? "none" : `0 0 0 3px ${ACCENT}25`,
                  }} />
                </div>

                <div style={{ flex: 1, paddingLeft: 28, paddingBottom: isBreak ? 0 : 4 }}>
                  {isBreak ? (
                    <div style={{ fontSize: 14, color: "#aaa", fontStyle: "italic", paddingTop: 4 }}>{title}</div>
                  ) : (
                    <div style={{ background: "#fff", border: "1px solid #e8e8e4", borderRadius: 16, padding: "18px 22px", boxShadow: "0 2px 12px rgba(0,0,0,0.04)" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8, flexWrap: "wrap" }}>
                        <span style={{ fontSize: 11, fontWeight: 700, color: "#999", textTransform: "uppercase", letterSpacing: 0.8 }}>{label}</span>
                        {tag && <span style={{ fontSize: 11, fontWeight: 700, borderRadius: 20, padding: "2px 10px", background: `${ACCENT}15`, color: ACCENT, border: `1px solid ${ACCENT}30` }}>{tag}</span>}
                        {practice && <span style={{ fontSize: 11, fontWeight: 700, borderRadius: 20, padding: "2px 10px", background: "#f0fdf4", color: "#16a34a", border: "1px solid #bbf7d0" }}>Практика</span>}
                      </div>
                      <div style={{ fontWeight: 700, fontSize: 16, color: "#1a1a1a", marginBottom: 8 }}>{title}</div>
                      <div style={{ fontSize: 14, color: "#666", lineHeight: 1.65, marginBottom: topics ? 14 : 0 }}>{desc}</div>
                      {topics && (
                        <ul style={{ margin: 0, padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 6 }}>
                          {topics.map((t, j) => (
                            <li key={j} style={{ display: "flex", alignItems: "flex-start", gap: 8, fontSize: 13.5, color: "#444" }}>
                              <span style={{ color: ACCENT, flexShrink: 0, marginTop: 1 }}><Icon name="CheckCircle2" size={14} /></span>
                              {t}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          <style>{`
            @media (max-width: 600px) {
              .coi-prog-line { left: 64px !important; }
              .coi-prog-row > div:first-child { width: 74px !important; font-size: 10px !important; }
            }
          `}</style>
        </div>
      </section>

      {/* ── ФОРМАТ ── */}
      <section style={{ padding: "80px 0 0" }}>
        <div style={{ maxWidth: 900, margin: "0 auto", padding: "0 24px" }}>
          <h2 style={h2style}>Формат</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }} className="format-grid">
            {[
              { icon: "MapPin", label: "Офлайн", sub: "Москва, Волков пер., 4" },
              { icon: "Clock", label: "1 день", sub: "10:00–18:00" },
              { icon: "Users", label: "До 12 человек", sub: "Маленькая группа" },
              { icon: "Calendar", label: "Каждое воскресенье", sub: "Выберите удобную дату" },
            ].map(({ icon, label, sub }) => (
              <div key={label} style={{ background: "#fff", border: "1px solid #e8e8e4", borderRadius: 16, padding: "20px 18px", textAlign: "center" }}>
                <div style={{ color: ACCENT, marginBottom: 10, display: "flex", justifyContent: "center" }}><Icon name={icon} size={22} /></div>
                <div style={{ fontWeight: 700, fontSize: 15, color: "#1a1a1a", marginBottom: 4 }}>{label}</div>
                <div style={{ fontSize: 12, color: "#888", lineHeight: 1.5 }}>{sub}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── ДЛЯ КОГО ── */}
      <section style={{ padding: "80px 0 0" }}>
        <div style={{ maxWidth: 860, margin: "0 auto", padding: "0 24px" }}>
          <h2 style={h2style}>Для кого этот интенсив</h2>
          <div style={{ background: "#fff", border: "1px solid #e8e8e4", borderRadius: 20, padding: "32px 36px" }}>
            <p style={{ fontSize: 16, color: "#555", lineHeight: 1.75, margin: "0 0 24px" }}>
              Для тех, кто давно хочет освоить профессию, которая помогает людям и даёт возможность хорошо зарабатывать.
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }} className="problems-grid">
              {[
                "Освоить новую востребованную профессию",
                "Начать работать с телом и восстановлением",
                "Помогать людям чувствовать себя лучше",
                "Получить навык, который можно монетизировать",
                "Стать специалистом по восстановительным техникам",
                "Начать с нуля без медицинского образования",
              ].map((t) => (
                <div key={t} style={{ display: "flex", alignItems: "flex-start", gap: 10, fontSize: 14, color: "#444" }}>
                  <span style={{ color: ACCENT, flexShrink: 0, marginTop: 2 }}><Icon name="Check" size={15} /></span>
                  {t}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── ОНЛАЙН В ПОДАРОК ── */}
      <section style={{ padding: "60px 0" }}>
        <div style={{ maxWidth: 860, margin: "0 auto", padding: "0 24px" }}>
          <div className="coi-bonus-online" style={{
            background: BG, border: "1px solid #e8e8e4", borderRadius: 20,
            padding: "28px 32px", display: "flex", alignItems: "center", gap: 28,
          }}>
            <div style={{ flexShrink: 0, width: 60, height: 60, borderRadius: 16, background: `${ACCENT}14`, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Icon name="Gift" size={28} style={{ color: ACCENT }} />
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: 17, color: "#1a1a1a", marginBottom: 8 }}>
                Все онлайн-курсы — в подарок каждому участнику
              </div>
              <div style={{ fontSize: 14, color: "#666", lineHeight: 1.65 }}>
                Спокойно пересматривайте материал, закрепляйте техники и продолжайте обучение в удобном темпе. Все курсы остаются с вами навсегда.
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}