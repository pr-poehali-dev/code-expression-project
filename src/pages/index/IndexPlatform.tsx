import Icon from "@/components/ui/icon";

const TEAL = "#2DD4BF";
const DARK = "#0F172A";
const GRAY = "#64748B";
const SERIF = "'Cormorant Garamond', serif";

const NAVIGATOR_STACK = [
  { icon: "Database", text: "Ваши реальные данные" },
  { icon: "Calculator", text: "Финансовые расчёты" },
  { icon: "TrendingUp", text: "Проверенные алгоритмы роста" },
  { icon: "Bot", text: "ИИ-анализ ситуации" },
  { icon: "Wrench", text: "Готовые инструменты платформы" },
];

const GROWTH_TABLE = [
  { point: "Вернуть клиентов", action: "Написать тем, кто не был 45+ дней", value: "+15 000–30 000 ₽" },
  { point: "Заполнить окна", action: "Оффер на ближайшие даты", value: "+10 000–20 000 ₽" },
  { point: "Повысить чек", action: "Добавить комплекс или допуслугу", value: "+8 000–15 000 ₽" },
  { point: "Продать пакет", action: "Курс для постоянных клиентов", value: "+12 000–25 000 ₽" },
];

const FACTORS = [
  "Текущая и желаемая выручка", "Средний чек", "Клиенты и записи",
  "Повторные визиты", "Загрузка графика", "Свободные окна",
  "Размер клиентской базы", "Услуги и допуслуги",
];

const STEPS = [
  { num: "01", icon: "ClipboardList", title: "Расскажите о своей ситуации", desc: "Доход, чек, база клиентов, окна и цели — несколько вопросов, 10–15 минут" },
  { num: "02", icon: "Map", title: "Получите карту роста", desc: "Разрыв до цели раскладывается на точки роста с оценкой вклада в рублях" },
  { num: "03", icon: "Target", title: "Получите план по делам", desc: "Не список задач, а главное дело на сегодня — с кнопкой готового действия" },
  { num: "04", icon: "LineChart", title: "Выполняйте и фиксируйте", desc: "Отмечайте результат — каждый день рекомендации становятся точнее" },
];

export default function IndexPlatform() {
  return (
    <>
      {/* ── 4. ЧТО ТАКОЕ ПОДЕЛАМ ── */}
      <section style={{ padding: "120px 32px", background: "#F8FAFC" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 56, alignItems: "center" }} className="value-grid">
            <div>
              <div style={{ fontSize: 12, fontWeight: 600, color: TEAL, textTransform: "uppercase", letterSpacing: "2.5px", marginBottom: 20 }}>Что такое «ПоДелам»</div>
              <h2 style={{ fontFamily: SERIF, fontSize: "clamp(30px,4vw,44px)", fontWeight: 500, color: DARK, margin: "0 0 20px", letterSpacing: "-0.5px", lineHeight: 1.15 }}>
                Ваш навигатор по доходу
              </h2>
              <p style={{ fontSize: 15, color: GRAY, lineHeight: 1.7, fontWeight: 300, marginBottom: 28 }}>
                Не просто чат с ИИ. «ПоДелам» соединяет ваши данные, расчёты и алгоритмы роста — и предлагает действия с понятной логикой: что делать, зачем и на что это повлияет.
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {NAVIGATOR_STACK.map((s, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <div style={{ width: 34, height: 34, borderRadius: 10, background: "rgba(45,212,191,0.1)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <Icon name={s.icon} size={16} style={{ color: TEAL }} />
                    </div>
                    <span style={{ fontSize: 14.5, color: "#334155", fontWeight: 500 }}>{s.text}</span>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ background: DARK, borderRadius: 20, padding: "32px 28px" }}>
              <div style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", marginBottom: 6 }}>Например</div>
              <p style={{ fontSize: 14.5, color: "rgba(255,255,255,0.75)", lineHeight: 1.6, marginBottom: 20, fontWeight: 300 }}>
                Сейчас доход — 120 000 ₽, цель — 180 000 ₽. Не хватает 60 000 ₽. Система раскладывает разрыв на точки роста:
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
                {GROWTH_TABLE.map((r, i) => (
                  <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, padding: "14px 0", borderTop: i > 0 ? "1px solid rgba(255,255,255,0.08)" : "none" }}>
                    <div>
                      <div style={{ fontSize: 13.5, fontWeight: 700, color: "#fff" }}>{r.point}</div>
                      <div style={{ fontSize: 12, color: "rgba(255,255,255,0.45)", marginTop: 2 }}>{r.action}</div>
                    </div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: TEAL, whiteSpace: "nowrap" }}>{r.value}</div>
                  </div>
                ))}
              </div>
              <div style={{ fontSize: 11, color: "rgba(255,255,255,0.35)", marginTop: 16 }}>Ориентир на основе ваших данных, а не обещание выручки</div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 5. НЕ ТОЛЬКО ИИ ── */}
      <section style={{ padding: "120px 32px", background: "#fff" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ maxWidth: 620, marginBottom: 48 }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: TEAL, textTransform: "uppercase", letterSpacing: "2.5px", marginBottom: 20 }}>Не только ИИ</div>
            <h2 style={{ fontFamily: SERIF, fontSize: "clamp(30px,4vw,46px)", fontWeight: 500, color: DARK, margin: "0 0 16px", letterSpacing: "-0.5px", lineHeight: 1.15 }}>
              В основе — цифры, формулы и алгоритмы
            </h2>
            <p style={{ fontSize: 15, color: GRAY, lineHeight: 1.7, fontWeight: 300 }}>
              ИИ помогает понять контекст, подготовить тексты. Рекомендации строит математическая модель:
            </p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: 12, marginBottom: 40 }}>
            {FACTORS.map((f, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, border: "1px solid #E8ECF0", borderRadius: 10, padding: "12px 16px" }}>
                <Icon name="Dot" size={18} style={{ color: TEAL, flexShrink: 0 }} />
                <span style={{ fontSize: 13.5, color: "#334155" }}>{f}</span>
              </div>
            ))}
          </div>
          <div style={{ background: "#F8FAFC", border: "1px solid #E2E8F0", borderRadius: 16, padding: "28px 32px", display: "flex", gap: 16, alignItems: "flex-start" }}>
            <Icon name="Lightbulb" size={22} style={{ color: TEAL, flexShrink: 0, marginTop: 2 }} />
            <p style={{ margin: 0, fontSize: 14.5, color: "#334155", lineHeight: 1.7 }}>
              Иногда выгоднее вернуть 10 клиентов из базы, чем запускать рекламу. Иногда база уже активна — и дело в низком чеке. «ПоДелам» не обещает волшебный рост: он показывает управляемые действия и считает их вклад в выручку.
            </p>
          </div>
        </div>
      </section>

      {/* ── 6. КАК ЭТО РАБОТАЕТ ── */}
      <section style={{ padding: "120px 32px", background: `radial-gradient(120% 100% at 80% 0%, #112B3C 0%, ${DARK} 55%, #060B16 100%)`, position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: "10%", right: "-5%", width: 500, height: 500, borderRadius: "50%", background: "radial-gradient(circle, rgba(45,212,191,0.08) 0%, transparent 65%)", pointerEvents: "none" }} />
        <div style={{ maxWidth: 1100, margin: "0 auto", position: "relative" }}>
          <div style={{ maxWidth: 560, marginBottom: 56 }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: TEAL, textTransform: "uppercase", letterSpacing: "2.5px", marginBottom: 20 }}>Как это работает</div>
            <h2 style={{ fontFamily: SERIF, fontSize: "clamp(34px,4.5vw,54px)", fontWeight: 500, color: "#fff", margin: 0, letterSpacing: "-0.5px", lineHeight: 1.1 }}>
              От цели по доходу — к действиям
            </h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))", gap: 20 }}>
            {STEPS.map((s, i) => (
              <div key={i} style={{ border: "1px solid rgba(255,255,255,0.1)", borderRadius: 16, padding: "28px 24px", background: "rgba(255,255,255,0.04)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
                  <div style={{ fontFamily: SERIF, fontSize: 28, fontWeight: 600, color: "rgba(255,255,255,0.25)", lineHeight: 1 }}>{s.num}</div>
                  <div style={{ width: 38, height: 38, borderRadius: 10, background: "rgba(45,212,191,0.12)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Icon name={s.icon} size={17} style={{ color: TEAL }} />
                  </div>
                </div>
                <div style={{ fontSize: 15, fontWeight: 700, color: "#fff", marginBottom: 8, lineHeight: 1.3 }}>{s.title}</div>
                <p style={{ margin: 0, fontSize: 13.5, color: "rgba(255,255,255,0.55)", lineHeight: 1.6, fontWeight: 300 }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}