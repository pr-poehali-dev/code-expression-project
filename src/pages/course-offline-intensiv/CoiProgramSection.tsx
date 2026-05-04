import Icon from "@/components/ui/icon";
import { ACCENT, BG, h2style } from "./CoiShared";

const GOLD = "#d4a017";
const GOLD_BG = "#fdf8ec";

const SCHEDULE = [
  {
    time: "10:00–10:30",
    label: "Старт дня",
    title: "Приветствие, знакомство, установки",
    desc: "Участники знакомятся друг с другом, обозначают личные цели на день. Разминка — настройка тела и внимания перед практикой.",
    tag: null,
  },
  {
    time: "10:30–12:30",
    label: "Блок 1",
    title: "Антистресс-массаж: нервная система и тело",
    desc: "Разбираем, как автономная нервная система (ВНС) управляет мышечным тонусом, болью и отёками. Учимся переключать клиента из симпатики в парасимпатику через массаж. Работа с вегетативными ганглиями — мощный инструмент быстрого результата.",
    tag: "Антистресс",
    topics: [
      "Симпатика и парасимпатика: почему это важно на столе",
      "Гипертонус, нейрогенное воспаление и как с ними работать",
      "Техники активации парасимпатики через прикосновение",
      "Работа с вегетативными ганглиями — практика в паре",
    ],
    practice: true,
  },
  {
    time: "12:30–13:00",
    label: "Обмен опытом",
    title: "Разбор ощущений, вопросы, корректировка",
    desc: "Участники делятся наблюдениями после первого блока практики. Тренер корректирует технику индивидуально.",
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
    title: "Восстановительный массаж PRO: позвоночник и суставы",
    desc: "Глубокое погружение в мануальные техники работы с позвоночником и суставами. Постизометрическая релаксация мышц (ПИР). Разбираем, как правильно диагностировать и работать с болевыми синдромами.",
    tag: "PRO",
    topics: [
      "Биодинамика позвоночника — анатомия в действии",
      "Техники МТ шейного, грудного и поясничного отделов",
      "Постизометрическая релаксация (ПИР): когда и как",
      "Работа с суставами верхних и нижних конечностей",
      "Диагностика по болевому синдрому — практика в паре",
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
    title: "Интеграция техник — финальная практика и разбор",
    desc: "Объединяем техники антистресса и восстановительного массажа в единую сессию. Каждый участник проводит мини-сеанс и получает обратную связь от тренера.",
    tag: null,
    topics: [
      "Сборная сессия: антистресс + мануальные техники",
      "Разбор ошибок и лайфхаки от тренера",
      "Индивидуальная обратная связь каждому участнику",
    ],
    practice: true,
  },
];

export default function CoiProgramSection() {
  return (
    <>
      {/* ── ПРОГРАММА ИНТЕНСИВА ── */}
      <section style={{ padding: "80px 0 0" }}>
        <div style={{ maxWidth: 860, margin: "0 auto", padding: "0 24px" }}>
          <h2 style={h2style}>Программа дня</h2>

          {/* Практика-плашка */}
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 10,
            background: `${ACCENT}12`, border: `1.5px solid ${ACCENT}40`,
            borderRadius: 12, padding: "10px 18px", marginBottom: 36,
          }}>
            <Icon name="Users" size={17} style={{ color: ACCENT }} />
            <span style={{ fontSize: 14, fontWeight: 600, color: ACCENT }}>
              Все техники участники отрабатывают друг на друге в паре — живая практика весь день
            </span>
          </div>

          <div style={{ position: "relative" }}>
            {/* Вертикальная линия */}
            <div style={{
              position: "absolute", left: 90, top: 0, bottom: 0,
              width: 2, background: `linear-gradient(to bottom, ${ACCENT}40, ${ACCENT}10)`,
            }} className="coi-prog-line" />

            {SCHEDULE.map(({ time, label, title, desc, tag, topics, practice, isBreak }, i) => (
              <div key={i} style={{
                display: "flex", gap: 0, marginBottom: isBreak ? 16 : 28,
                opacity: isBreak ? 0.55 : 1,
              }} className="coi-prog-row">
                {/* Время */}
                <div style={{ flexShrink: 0, width: 100, paddingTop: 4, paddingRight: 24, textAlign: "right" }}>
                  <div style={{
                    fontSize: 11, fontWeight: 700, color: ACCENT,
                    background: `${ACCENT}12`, borderRadius: 8,
                    padding: "4px 8px", display: "inline-block", lineHeight: 1.4,
                  }}>{time}</div>
                </div>

                {/* Точка на линии */}
                <div style={{ flexShrink: 0, width: 0, position: "relative" }}>
                  <div style={{
                    position: "absolute", left: -6, top: 6,
                    width: 12, height: 12, borderRadius: "50%",
                    background: isBreak ? "#ccc" : ACCENT,
                    border: "2px solid #fff",
                    boxShadow: isBreak ? "none" : `0 0 0 3px ${ACCENT}25`,
                  }} />
                </div>

                {/* Контент */}
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
                            background: tag === "Антистресс" ? `${ACCENT}15` : `${GOLD}18`,
                            color: tag === "Антистресс" ? ACCENT : GOLD,
                            border: `1px solid ${tag === "Антистресс" ? ACCENT : GOLD}30`,
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
              { icon: "MapPin", label: "Офлайн", sub: "Живое участие" },
              { icon: "Clock", label: "1 день", sub: "10:00–18:00" },
              { icon: "Users", label: "До 12 человек", sub: "Малая группа" },
              { icon: "Repeat2", label: "80% практики", sub: "Отработка в парах" },
            ].map(({ icon, label, sub }) => (
              <div key={label} style={{ background: "#fff", border: "1px solid #e8e8e4", borderRadius: 16, padding: "22px 18px", textAlign: "center" }}>
                <div style={{ color: ACCENT, marginBottom: 10 }}><Icon name={icon} size={26} /></div>
                <div style={{ fontWeight: 700, fontSize: 15, color: "#1a1a1a", marginBottom: 4 }}>{label}</div>
                <div style={{ fontSize: 13, color: "#999" }}>{sub}</div>
              </div>
            ))}
          </div>
          <style>{`@media (max-width: 700px) { .format-grid { grid-template-columns: repeat(2, 1fr) !important; } }`}</style>
        </div>
      </section>

      {/* ── ОНЛАЙН-ДОСТУП КО ВСЕМ КУРСАМ ── */}
      <section style={{ padding: "80px 0 0" }}>
        <div style={{ maxWidth: 900, margin: "0 auto", padding: "0 24px" }}>
          <div style={{
            background: `linear-gradient(135deg, ${GOLD_BG} 0%, #fffdf5 100%)`,
            border: `2px solid ${GOLD}40`,
            borderRadius: 24,
            padding: "48px 44px",
            position: "relative",
            overflow: "hidden",
          }}>
            <div style={{ position: "absolute", top: -50, right: -50, width: 220, height: 220, borderRadius: "50%", background: `${GOLD}0a`, pointerEvents: "none" }} />
            <div style={{ position: "absolute", bottom: -60, left: -30, width: 180, height: 180, borderRadius: "50%", background: `${GOLD}08`, pointerEvents: "none" }} />

            <div style={{ position: "relative" }}>
              <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: `${GOLD}20`, border: `1px solid ${GOLD}50`, borderRadius: 30, padding: "6px 16px", marginBottom: 20 }}>
                <Icon name="Gift" size={14} style={{ color: GOLD }} />
                <span style={{ fontSize: 12, fontWeight: 700, color: GOLD, textTransform: "uppercase", letterSpacing: 1 }}>Бонус каждому участнику</span>
              </div>

              <h2 style={{ ...h2style, marginBottom: 14 }}>
                Бесплатный доступ<br />ко всем онлайн-курсам
              </h2>
              <p style={{ fontSize: 16, color: "#555", lineHeight: 1.7, margin: "0 0 36px", maxWidth: 580 }}>
                После интенсива каждый участник получает полный онлайн-доступ к 6 курсам школы — чтобы повторять техники в своём темпе, углублять знания и продолжать рост.
              </p>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }} className="coi-courses-grid">
                {[
                  { icon: "Brain", name: "Антистресс-массаж", desc: "Работа с ВНС и нервной системой" },
                  { icon: "Activity", name: "Восстановительный PRO", desc: "Мануальные техники и позвоночник" },
                  { icon: "Leaf", name: "Висцеральный массаж", desc: "Работа с внутренними органами" },
                  { icon: "Sparkles", name: "Коррекция фигуры", desc: "Антицеллюлит и моделирование" },
                  { icon: "Users", name: "Поток клиентов", desc: "Маркетинг и продвижение" },
                  { icon: "BookOpen", name: "Готовые протоколы", desc: "Скрипты и планы сеансов" },
                ].map(({ icon, name, desc }) => (
                  <div key={name} style={{
                    background: "#fff",
                    border: `1px solid ${GOLD}25`,
                    borderRadius: 14,
                    padding: "16px 18px",
                    display: "flex", alignItems: "flex-start", gap: 12,
                  }}>
                    <div style={{
                      width: 36, height: 36, borderRadius: 10,
                      background: `${GOLD}18`,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      flexShrink: 0,
                    }}>
                      <Icon name={icon} size={17} style={{ color: GOLD }} />
                    </div>
                    <div>
                      <div style={{ fontSize: 13.5, fontWeight: 700, color: "#1a1a1a", marginBottom: 3 }}>{name}</div>
                      <div style={{ fontSize: 12, color: "#888", lineHeight: 1.4 }}>{desc}</div>
                    </div>
                  </div>
                ))}
              </div>
              <style>{`@media (max-width: 680px) { .coi-courses-grid { grid-template-columns: 1fr 1fr !important; } } @media (max-width: 420px) { .coi-courses-grid { grid-template-columns: 1fr !important; } }`}</style>

              <div style={{
                marginTop: 28,
                display: "flex", alignItems: "center", gap: 12,
                background: "#fff", border: `1px solid ${GOLD}30`,
                borderRadius: 12, padding: "14px 20px",
                maxWidth: 480,
              }}>
                <Icon name="CheckCircle2" size={20} style={{ color: "#16a34a", flexShrink: 0 }} />
                <span style={{ fontSize: 14, fontWeight: 600, color: "#333" }}>
                  Доступ открывается сразу после интенсива — бессрочно
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── БОНУСЫ ── */}
      <section style={{ padding: "80px 0 0" }}>
        <div style={{ maxWidth: 900, margin: "0 auto", padding: "0 24px" }}>
          <h2 style={h2style}>Дополнительные бонусы</h2>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }} className="bonuses-grid">
            {[
              { icon: "FileText", title: "Чек-лист диагностики", text: "Готовый инструмент для регулярного анализа своей практики" },
              { icon: "BookOpen", title: "Скрипты общения", text: "Готовые фразы для работы с возражениями и повышения чека" },
              { icon: "MessageCircle", title: "Чат участников", text: "Закрытый чат для поддержки и обмена опытом после интенсива" },
              { icon: "TrendingUp", title: "План роста дохода", text: "Персональный план действий для увеличения выручки в ближайшие 30 дней" },
            ].map(({ icon, title, text }) => (
              <div key={title} style={{ background: "#fff", border: "1px solid #e8e8e4", borderRadius: 16, padding: "22px 20px", display: "flex", gap: 16 }}>
                <div style={{ color: ACCENT, flexShrink: 0 }}><Icon name={icon} size={24} /></div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 6, color: "#1a1a1a" }}>{title}</div>
                  <div style={{ fontSize: 13.5, color: "#666", lineHeight: 1.6 }}>{text}</div>
                </div>
              </div>
            ))}
          </div>
          <style>{`@media (max-width: 560px) { .bonuses-grid { grid-template-columns: 1fr !important; } }`}</style>
        </div>
      </section>

      {/* ── ДЛЯ ИНОГОРОДНИХ ── */}
      <section style={{ padding: "80px 0 0" }}>
        <div style={{ maxWidth: 800, margin: "0 auto", padding: "0 24px" }}>
          <div className="coi-inogorod-card" style={{ background: "#fff", border: "1px solid #e8e8e4", borderRadius: 20, padding: "36px 40px" }}>
            <h2 style={{ ...h2style, marginBottom: 20 }}>Приедете из другого города?</h2>
            <p style={{ fontSize: 15, color: "#555", lineHeight: 1.7, margin: "0 0 20px" }}>
              Мы поможем с организацией поездки: расскажем о ближайших гостиницах, поможем скоординировать время приезда и ответим на вопросы.
            </p>
            <div style={{
              display: "inline-flex", alignItems: "center", gap: 10,
              background: "linear-gradient(135deg, hsl(185,85%,97%) 0%, #fff 100%)",
              border: `1.5px solid ${ACCENT}`,
              borderRadius: 12, padding: "12px 20px", marginBottom: 20,
            }}>
              <span style={{ fontSize: 22 }}>🏨</span>
              <div>
                <div style={{ fontSize: 14, fontWeight: 700, color: "#1a1a1a" }}>Скидка 10% на отели по нашей рекомендации</div>
                <div style={{ fontSize: 12, color: "#666", marginTop: 2 }}>Напишите нам после записи — подберём вариант рядом с площадкой</div>
              </div>
            </div>
            <div style={{ display: "flex", gap: 24, flexWrap: "wrap" }}>
              {[
                { icon: "Hotel", text: "Варианты жилья рядом" },
                { icon: "MapPin", text: "Удобное расположение" },
                { icon: "Phone", text: "Помощь в организации" },
              ].map(({ icon, text }) => (
                <div key={text} style={{ display: "flex", gap: 8, alignItems: "center", fontSize: 14, color: "#444" }}>
                  <span style={{ color: ACCENT }}><Icon name={icon} size={16} /></span>
                  {text}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
