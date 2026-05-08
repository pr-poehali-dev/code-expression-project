import Icon from "@/components/ui/icon";
import { ACCENT, BG, h2style } from "./CoiSemShared";

const SCHEDULE = [
  {
    time: "10:00–10:30",
    label: "Старт дня",
    title: "Приветствие, знакомство, установки",
    desc: "Участники знакомятся и рассказывают о своих запросах. Разминка и настройка на день практики.",
    tag: null,
  },
  {
    time: "10:30–12:30",
    label: "Блок 1",
    title: "Как работает тело: откуда берётся напряжение",
    desc: "Простое и понятное объяснение — почему появляется боль и зажимы, как тело накапливает стресс и почему важно уметь его снимать. Учимся находить проблемные зоны руками.",
    tag: "Основы",
    topics: [
      "Почему болит шея и поясница — простыми словами",
      "Как стресс и усталость живут в теле",
      "Находим зоны напряжения — практика в паре",
      "Что такое зажим и как его почувствовать",
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
    title: "Практические техники: шея, плечи, спина, поясница",
    desc: "Мягкие восстановительные техники, которые можно делать дома. Без сложных движений, всё понятно даже для новичков. Отрабатываем в парах.",
    tag: "Практика",
    topics: [
      "Техники для снятия напряжения в шее и плечах",
      "Работа со спиной: снимаем тяжесть и скованность",
      "Поясница: простые приёмы для облегчения боли",
      "Антистресс-техники: как помочь близкому расслабиться после тяжёлого дня",
      "Самопомощь: что можно делать самостоятельно",
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
    title: "Практика — применяем всё вместе",
    desc: "Объединяем техники в единую сессию. Каждый участник проводит небольшой сеанс и получает обратную связь от тренера.",
    tag: null,
    topics: [
      "Сборная практика: шея + спина + поясница",
      "Как применять техники дома — практические советы",
      "Индивидуальная обратная связь каждому участнику",
    ],
    practice: true,
  },
];

export default function CoiSemProgramSection() {
  return (
    <>
      {/* ── ПРОГРАММА ── */}
      <section style={{ padding: "80px 0 0" }}>
        <div style={{ maxWidth: 860, margin: "0 auto", padding: "0 24px" }}>
          <h2 style={h2style}>Программа дня</h2>

          <div style={{
            display: "inline-flex", alignItems: "center", gap: 10,
            background: `${ACCENT}12`, border: `1.5px solid ${ACCENT}40`,
            borderRadius: 12, padding: "10px 18px", marginBottom: 36,
          }}>
            <Icon name="Users" size={17} style={{ color: ACCENT }} />
            <span style={{ fontSize: 14, fontWeight: 600, color: ACCENT }}>
              Всё понятно даже без медицинского образования — максимум практики, минимум теории
            </span>
          </div>

          <div style={{ position: "relative" }}>
            <div style={{
              position: "absolute", left: 90, top: 0, bottom: 0,
              width: 2, background: `linear-gradient(to bottom, ${ACCENT}40, ${ACCENT}10)`,
            }} className="coi-prog-line" />

            {SCHEDULE.map(({ time, label, title, desc, tag, topics, practice, isBreak }, i) => (
              <div key={i} style={{
                display: "flex", gap: 0, marginBottom: isBreak ? 16 : 28,
                opacity: isBreak ? 0.55 : 1,
              }} className="coi-prog-row">
                <div style={{ flexShrink: 0, width: 100, paddingTop: 4, paddingRight: 24, textAlign: "right" }}>
                  <div style={{
                    fontSize: 11, fontWeight: 700, color: ACCENT,
                    background: `${ACCENT}12`, borderRadius: 8,
                    padding: "4px 8px", display: "inline-block", lineHeight: 1.4,
                  }}>{time}</div>
                </div>

                <div style={{ flexShrink: 0, width: 0, position: "relative" }}>
                  <div style={{
                    position: "absolute", left: -6, top: 6,
                    width: 12, height: 12, borderRadius: "50%",
                    background: isBreak ? "#ccc" : ACCENT,
                    border: "2px solid #fff",
                    boxShadow: isBreak ? "none" : `0 0 0 3px ${ACCENT}25`,
                  }} />
                </div>

                <div style={{ flex: 1, paddingLeft: 28, paddingBottom: isBreak ? 0 : 4 }}>
                  {isBreak ? (
                    <div style={{ fontSize: 14, color: "#aaa", fontStyle: "italic", paddingTop: 4 }}>{title}</div>
                  ) : (
                    <div style={{
                      background: "#fff", border: "1px solid #e8e8e4",
                      borderRadius: 16, padding: "18px 22px",
                      boxShadow: "0 2px 12px rgba(0,0,0,0.04)",
                    }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8, flexWrap: "wrap" }}>
                        <span style={{ fontSize: 11, fontWeight: 700, color: "#999", textTransform: "uppercase", letterSpacing: 0.8 }}>{label}</span>
                        {tag && (
                          <span style={{
                            fontSize: 11, fontWeight: 700, borderRadius: 20, padding: "2px 10px",
                            background: `${ACCENT}15`, color: ACCENT,
                            border: `1px solid ${ACCENT}30`,
                          }}>{tag}</span>
                        )}
                        {practice && (
                          <span style={{
                            fontSize: 11, fontWeight: 700, borderRadius: 20, padding: "2px 10px",
                            background: "#f0fdf4", color: "#16a34a", border: "1px solid #bbf7d0",
                          }}>Практика</span>
                        )}
                      </div>
                      <div style={{ fontWeight: 700, fontSize: 16, color: "#1a1a1a", marginBottom: 8 }}>{title}</div>
                      <div style={{ fontSize: 14, color: "#666", lineHeight: 1.65, marginBottom: topics ? 14 : 0 }}>{desc}</div>
                      {topics && (
                        <ul style={{ margin: 0, padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 6 }}>
                          {topics.map((t, j) => (
                            <li key={j} style={{ display: "flex", alignItems: "flex-start", gap: 8, fontSize: 13.5, color: "#444" }}>
                              <span style={{ color: ACCENT, flexShrink: 0, marginTop: 1 }}>
                                <Icon name="CheckCircle2" size={14} />
                              </span>
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
              { icon: "Users", label: "До 12 человек", sub: "Тёплая маленькая группа" },
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
              Для всех, кто хочет заботиться о здоровье семьи и научиться помогать без таблеток и сложных процедур. Медицинское образование не нужно.
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }} className="problems-grid">
              {[
                "Хочет заботиться о здоровье семьи",
                "Устал жить с постоянным напряжением в теле",
                "Хочет научиться помогать без таблеток",
                "Интересуется восстановлением и работой с телом",
                "Хочет освоить полезный навык для жизни",
                "Хочет лучше чувствовать и понимать своё тело",
              ].map((t) => (
                <div key={t} style={{ display: "flex", alignItems: "flex-start", gap: 10, fontSize: 14, color: "#444" }}>
                  <span style={{ color: ACCENT, flexShrink: 0, marginTop: 2 }}>
                    <Icon name="Check" size={15} />
                  </span>
                  {t}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

    </>
  );
}