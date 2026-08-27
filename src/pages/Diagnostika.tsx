import { Link } from "react-router-dom";
import { Helmet } from "@/lib/helmet";
import BizNavbar from "@/components/BizNavbar";
import BizFooter from "@/components/BizFooter";
import Icon from "@/components/ui/icon";

const TEAL = "#2DD4BF";
const TEAL2 = "#14B8A6";
const DARK = "#0F172A";
const SERIF = "'Cormorant Garamond', serif";

const WHAT_YOU_GET = [
  { icon: "TrendingUp",  title: "Прогноз роста дохода",           desc: "Математическая модель покажет конкретные цифры: на сколько вырастет доход при улучшении каждого показателя." },
  { icon: "Target",      title: "Точки роста без новых клиентов", desc: "Как увеличить доход на 20–40% за счёт текущей базы клиентов и загрузки расписания." },
  { icon: "BarChart3",   title: "Карта потенциала бизнеса",       desc: "Видите, какие направления недораскрыты и где сосредоточен основной резерв роста." },
  { icon: "Lightbulb",   title: "Конкретный план действий",       desc: "Пошаговые рекомендации под ваш бизнес или практику с расчётом экономического эффекта каждого шага." },
  { icon: "Activity",    title: "Сценарный прогноз",              desc: "Три варианта развития на 3–6 месяцев: консервативный, оптимальный и максимальный." },
  { icon: "Brain",       title: "ИИ-интерпретация",               desc: "ИИ объяснит паттерны и даст контекст — поверх математических расчётов, не вместо них." },
];

const FEELINGS = [
  { icon: "ScanEye",     num: "01", title: "Ясность",      desc: "Полная картина бизнеса — без догадок и ощущения «что-то идёт не так»." },
  { icon: "Layers",      num: "02", title: "Понимание",    desc: "Знаете точно, что делать первым — и какой эффект это даст в рублях." },
  { icon: "Flame",       num: "03", title: "Энергия",      desc: "Азарт действовать, когда путь к росту становится конкретным и измеримым." },
  { icon: "ShieldCheck", num: "04", title: "Уверенность",  desc: "Решения принимаются на основе данных, а не интуиции." },
];

const STEPS = [
  { num: "01", title: "Регистрация",     desc: "Аккаунт за 1 минуту. Без карты.",                                                          icon: "UserPlus"   },
  { num: "02", title: "Поставьте цель",  desc: "Название дела, показатели и цель по доходу — займёт 3 минуты.",                             icon: "Target"     },
  { num: "03", title: "Пройдите диагностику", desc: "8–12 вопросов о вашей практике или бизнесе — ИИ построит карту точек роста.",          icon: "PlayCircle" },
  { num: "04", title: "Получайте план каждый день", desc: "Не разовый отчёт — ИИ ежедневно подсказывает следующий шаг к цели.",             icon: "RefreshCw"  },
];

const MATH_POINTS = [
  { icon: "Calculator", text: "Индекс загрузки расписания по времени и стоимости часа" },
  { icon: "TrendingUp", text: "LTV клиента с учётом частоты обращений и стоимости услуги" },
  { icon: "PieChart",   text: "Структура дохода: где сосредоточено 80% выручки" },
  { icon: "Activity",   text: "Прогноз оттока клиентов по сегментам (Чурн-рейт)" },
  { icon: "Percent",    text: "ROI каждого улучшения: сколько рублей принесёт каждый шаг" },
  { icon: "GitBranch",  text: "Сценарный анализ: три варианта развития на 3–6 месяцев" },
];

const SCORE_ITEMS = [
  { label: "Клиенты",   val: 81, color: "#2DD4BF" },
  { label: "Загрузка",  val: 64, color: "#f59e0b" },
  { label: "Продажи",   val: 72, color: "#2DD4BF" },
  { label: "Маркетинг", val: 58, color: "#ef4444" },
  { label: "Финансы",   val: 75, color: "#2DD4BF" },
];

const CYCLE_STEPS = [
  { icon: "Target",      title: "Цель",         desc: "Указываете, куда хотите прийти — конкретную цифру и срок." },
  { icon: "ScanEye",     title: "Диагностика",  desc: "ИИ анализирует показатели бизнеса или практики и находит разрывы." },
  { icon: "ListChecks",  title: "План",         desc: "Формируется точный маршрут действий к вашей цели." },
  { icon: "Zap",         title: "Действие",     desc: "Выполняете шаги сами или доверяете AI-инструментам." },
  { icon: "BarChart2",   title: "Результат",    desc: "Фиксируете, что реально изменилось в цифрах." },
  { icon: "RefreshCw",   title: "Корректировка",desc: "ИИ пересчитывает план с учётом нового результата." },
];

export default function Diagnostika() {
  return (
    <>
      <Helmet>
        <title>AI-навигатор роста дохода — бесплатная диагностика и ежедневный план | Промт Диалог</title>
        <meta name="description" content="Узнайте, что мешает расти вашему бизнесу или частной практике — и получите персональный план действий. Бесплатный AI-анализ показателей и целей, ежедневные рекомендации и отслеживание прогресса. Для салонов красоты, психологов и других специалистов. Не разовый тест, а навигатор, который ведёт к цели." />
        <meta name="keywords" content="диагностика салона красоты, диагностика частной практики психолога, AI навигатор роста дохода, бесплатный аудит бизнеса, план роста выручки, индекс здоровья бизнеса, аналитика для психолога, рост дохода специалиста, промт диалог диагностика" />
      </Helmet>

      <BizNavbar />

      {/* ── HERO ─────────────────────────────────────────────────────────────── */}
      <section style={{
        background: `radial-gradient(120% 100% at 80% 0%, #112B3C 0%, ${DARK} 55%, #060B16 100%)`,
        minHeight: "100vh", display: "flex", alignItems: "center",
        paddingTop: 76, position: "relative", overflow: "hidden",
      }}>
        <div style={{ position: "absolute", top: "20%", right: "8%", width: 520, height: 520, borderRadius: "50%", background: `radial-gradient(circle,rgba(45,212,191,0.10) 0%,transparent 65%)`, pointerEvents: "none" }} />

        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "100px 32px", width: "100%" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 64, alignItems: "center" }} className="hero-diag-grid">

            <div>
              <div style={{ display: "inline-flex", alignItems: "center", gap: 10, border: "1px solid rgba(45,212,191,0.3)", borderRadius: 100, padding: "7px 18px", marginBottom: 36 }}>
                <div style={{ width: 6, height: 6, borderRadius: "50%", background: TEAL }} />
                <span style={{ fontSize: 12, color: TEAL, fontWeight: 500, letterSpacing: "1.5px", textTransform: "uppercase" as const }}>AI-навигатор роста · бесплатно</span>
              </div>

              <h1 style={{ fontFamily: SERIF, fontSize: "clamp(40px,5vw,64px)", fontWeight: 500, color: "#fff", lineHeight: 1.1, margin: "0 0 28px", letterSpacing: "-0.5px" }}>
                Узнайте, что мешает<br />
                расти — и получите<br />
                <span style={{ color: TEAL }}>персональный план</span> действий
              </h1>

              <p style={{ fontSize: "clamp(15px,1.6vw,18px)", color: "rgba(255,255,255,0.62)", lineHeight: 1.75, margin: "0 0 12px", fontWeight: 300, maxWidth: 520 }}>
                Бесплатно подключите <strong style={{ color: "#fff", fontWeight: 600 }}>AI-анализ бизнеса или практики</strong>. Он изучит показатели, вашу цель и текущую ситуацию, определит точки роста — и <strong style={{ color: "#fff", fontWeight: 600 }}>каждый день будет подсказывать, что делать дальше</strong>.
              </p>
              <p style={{ fontSize: 14, color: "rgba(255,255,255,0.38)", lineHeight: 1.7, margin: "0 0 40px", fontWeight: 300 }}>
                Расчёты строятся на математических формулах, ИИ — интерпретирует и ведёт вас к цели.
              </p>

              <div style={{ display: "flex", gap: 14, flexWrap: "wrap" as const, marginBottom: 48 }}>
                <Link to="/cabinet?tab=register" style={{
                  display: "inline-flex", alignItems: "center", gap: 10,
                  padding: "16px 32px", borderRadius: 2,
                  background: `linear-gradient(135deg,${TEAL},${TEAL2})`,
                  color: DARK, fontSize: 16, fontWeight: 700,
                  textDecoration: "none", boxShadow: "0 8px 32px rgba(45,212,191,0.35)",
                }}>
                  <Icon name="Zap" size={18} />
                  Начать бесплатную диагностику
                </Link>
                <a href="#how" style={{
                  display: "inline-flex", alignItems: "center", gap: 8,
                  padding: "16px 24px", borderRadius: 2,
                  border: "1px solid rgba(255,255,255,0.18)",
                  color: "rgba(255,255,255,0.7)", fontSize: 15, textDecoration: "none",
                }}>
                  Как это работает <Icon name="ArrowDown" size={15} />
                </a>
              </div>

              <div style={{ display: "flex", gap: 40, paddingTop: 36, borderTop: "1px solid rgba(255,255,255,0.07)", flexWrap: "wrap" as const }}>
                {[["Каждый день","новый план от ИИ"],["Цель","в центре системы"],["0 ₽","полностью бесплатно"]].map(([v, l], i) => (
                  <div key={i}>
                    <div style={{ fontFamily: SERIF, fontSize: 26, fontWeight: 600, color: "#fff", lineHeight: 1 }}>{v}</div>
                    <div style={{ fontSize: 12, color: "rgba(255,255,255,0.38)", marginTop: 5 }}>{l}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Mock-дашборд */}
            <div style={{ position: "relative" }}>
              <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(45,212,191,0.2)", borderRadius: 16, overflow: "hidden", boxShadow: "0 40px 100px rgba(0,0,0,0.5)" }}>
                <div style={{ background: "rgba(255,255,255,0.04)", borderBottom: "1px solid rgba(255,255,255,0.07)", padding: "14px 20px", display: "flex", alignItems: "center", gap: 8 }}>
                  <div style={{ display: "flex", gap: 6 }}>
                    {["#ef4444","#f59e0b","#22c55e"].map(c => <div key={c} style={{ width: 10, height: 10, borderRadius: "50%", background: c }} />)}
                  </div>
                  <span style={{ fontSize: 12, color: "rgba(255,255,255,0.35)", marginLeft: 8 }}>AI-навигатор роста · Промт Диалог</span>
                </div>
                <div style={{ padding: 24 }}>
                  <div style={{ marginBottom: 20 }}>
                    <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", textTransform: "uppercase" as const, letterSpacing: "1px", marginBottom: 6 }}>Ваша цель</div>
                    <div style={{ fontSize: 15, color: "#fff", fontWeight: 600, lineHeight: 1.4 }}>
                      Увеличить прибыль с 800 000 ₽ до <span style={{ color: TEAL }}>1 100 000 ₽</span>
                    </div>
                    <div style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", marginTop: 3 }}>Срок: 90 дней</div>
                  </div>

                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 8 }}>
                    <div>
                      <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", textTransform: "uppercase" as const, letterSpacing: "1px", marginBottom: 6 }}>Прогресс к цели</div>
                      <div style={{ fontFamily: SERIF, fontSize: 34, fontWeight: 600, color: TEAL, lineHeight: 1 }}>34%</div>
                    </div>
                    <div style={{ textAlign: "right" as const }}>
                      <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", marginBottom: 4 }}>Индекс бизнеса</div>
                      <div style={{ fontFamily: SERIF, fontSize: 24, color: "#f59e0b", fontWeight: 600 }}>67<span style={{ fontSize: 14, color: "rgba(255,255,255,0.3)" }}>/100</span></div>
                      <div style={{ fontSize: 10.5, color: TEAL }}>📈 +4 за 14 дней</div>
                    </div>
                  </div>
                  <div style={{ height: 8, background: "rgba(255,255,255,0.08)", borderRadius: 10, marginBottom: 22 }}>
                    <div style={{ height: "100%", width: "34%", background: `linear-gradient(90deg,${TEAL},${TEAL2})`, borderRadius: 10 }} />
                  </div>

                  <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", textTransform: "uppercase" as const, letterSpacing: "1px", marginBottom: 12 }}>Сегодня ИИ рекомендует</div>
                  {[
                    { title: "Вернуть 27 клиентов без обращений 60+ дней", effect: "+85 000 ₽" },
                    { title: "Заполнить свободные окна в расписании", effect: "+42 000 ₽" },
                    { title: "Изменить сценарий первого контакта", effect: "+8–12% повторных" },
                  ].map(({ title, effect }, i) => (
                    <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "9px 0", borderBottom: i < 2 ? "1px solid rgba(255,255,255,0.06)" : "none" }}>
                      <div style={{ width: 20, height: 20, borderRadius: "50%", background: "rgba(45,212,191,0.12)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontSize: 11, fontWeight: 700, color: TEAL }}>{i + 1}</div>
                      <div style={{ flex: 1, fontSize: 12.5, color: "rgba(255,255,255,0.75)", lineHeight: 1.4 }}>{title}</div>
                      <div style={{ fontSize: 12, color: TEAL, fontWeight: 700, whiteSpace: "nowrap" as const }}>{effect}</div>
                    </div>
                  ))}
                </div>
              </div>
              <div style={{ position: "absolute", top: -16, right: -16, background: TEAL, borderRadius: 12, padding: "10px 16px", boxShadow: "0 8px 24px rgba(45,212,191,0.4)", display: "flex", alignItems: "center", gap: 8 }}>
                <Icon name="Gift" size={16} style={{ color: DARK }} />
                <span style={{ fontSize: 13, fontWeight: 700, color: DARK }}>Бесплатно</span>
              </div>
            </div>
          </div>
        </div>
        <style>{`@media(max-width:900px){.hero-diag-grid{grid-template-columns:1fr!important;}}`}</style>
      </section>

      {/* ── ЦИКЛ: НЕ ТЕСТ, А НАВИГАТОР ──────────────────────────────────────── */}
      <section style={{ background: "#fff", padding: "100px 32px" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <div style={{ maxWidth: 720, marginBottom: 56 }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: TEAL, textTransform: "uppercase" as const, letterSpacing: "2.5px", marginBottom: 16 }}>Не тест, а навигатор</div>
            <h2 style={{ fontFamily: SERIF, fontSize: "clamp(30px,4vw,46px)", fontWeight: 500, color: DARK, margin: "0 0 16px", lineHeight: 1.15 }}>
              ИИ работает над вашей целью каждый день
            </h2>
            <p style={{ fontSize: 15.5, color: "#64748B", lineHeight: 1.75, margin: 0, fontWeight: 300 }}>
              Диагностика — это точка входа, а не разовый отчёт. Дальше запускается замкнутый цикл: бизнес или практика движется к цели, а ИИ каждый день сверяет результат и подсказывает следующий шаг.
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(6,1fr)", gap: 1, background: "#E2E8F0", border: "1px solid #E2E8F0", borderRadius: 4, overflow: "hidden" }} className="cycle-grid">
            {CYCLE_STEPS.map(({ icon, title, desc }, i) => (
              <div key={i} style={{ background: "#F8FAFC", padding: "26px 18px", position: "relative" }}>
                <div style={{ width: 34, height: 34, borderRadius: 9, background: "rgba(45,212,191,0.1)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 14 }}>
                  <Icon name={icon} size={16} style={{ color: TEAL }} />
                </div>
                <div style={{ fontSize: 13.5, fontWeight: 700, color: DARK, marginBottom: 6 }}>{title}</div>
                <div style={{ fontSize: 11.5, color: "#64748B", lineHeight: 1.5 }}>{desc}</div>
                {i < CYCLE_STEPS.length - 1 && (
                  <div style={{ position: "absolute", top: 38, right: -9, width: 18, height: 18, borderRadius: "50%", background: "#fff", border: "1px solid #E2E8F0", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1 }} className="cycle-arrow">
                    <Icon name="ArrowRight" size={10} style={{ color: "#94A3B8" }} />
                  </div>
                )}
              </div>
            ))}
          </div>
          <div style={{ marginTop: 20, display: "flex", alignItems: "center", gap: 10, fontSize: 13, color: "#94A3B8" }}>
            <Icon name="RotateCw" size={14} style={{ color: TEAL }} />
            Цикл повторяется — чем дольше вы им пользуетесь, тем точнее становятся рекомендации.
          </div>
        </div>
        <style>{`
          @media(max-width:1000px){.cycle-grid{grid-template-columns:repeat(3,1fr)!important;}.cycle-arrow{display:none;}}
          @media(max-width:560px){.cycle-grid{grid-template-columns:1fr 1fr!important;}}
        `}</style>
      </section>

      {/* ── МАТЕМАТИКА ──────────────────────────────────────────────────────── */}
      <section style={{ background: "#fff", padding: "100px 32px" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80, alignItems: "center" }} className="math-grid">
            <div>
              <div style={{ fontSize: 12, fontWeight: 600, color: TEAL, textTransform: "uppercase" as const, letterSpacing: "2.5px", marginBottom: 20 }}>Как работает</div>
              <h2 style={{ fontFamily: SERIF, fontSize: "clamp(34px,4vw,52px)", fontWeight: 500, color: DARK, margin: "0 0 20px", lineHeight: 1.1 }}>
                Математика и экономика —<br />не ИИ-гадания
              </h2>
              <p style={{ fontSize: 16, color: "#475569", lineHeight: 1.75, margin: "0 0 28px", fontWeight: 300 }}>
                Вы вводите реальные показатели. Алгоритм применяет проверенные экономические формулы и возвращает точные числа: потенциал роста и что именно его раскроет. <strong style={{ color: DARK }}>ИИ интерпретирует результат</strong> — но не считает его.
              </p>
              <Link to="/cabinet?tab=register" style={{
                display: "inline-flex", alignItems: "center", gap: 8,
                padding: "14px 28px", borderRadius: 2,
                background: `linear-gradient(135deg,${TEAL},${TEAL2})`,
                color: DARK, fontSize: 15, fontWeight: 700,
                textDecoration: "none", boxShadow: "0 6px 20px rgba(45,212,191,0.3)",
              }}>
                Начать диагностику <Icon name="ArrowRight" size={16} />
              </Link>
            </div>
            <div style={{ display: "flex", flexDirection: "column" as const, gap: 1, background: "#E2E8F0", border: "1px solid #E2E8F0", borderRadius: 4, overflow: "hidden" }}>
              {MATH_POINTS.map(({ icon, text }, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 14, padding: "18px 22px", background: "#fff" }}>
                  <div style={{ width: 34, height: 34, borderRadius: 8, background: "rgba(45,212,191,0.1)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <Icon name={icon} size={15} style={{ color: TEAL }} />
                  </div>
                  <span style={{ fontSize: 14, color: "#475569", lineHeight: 1.5 }}>{text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        <style>{`@media(max-width:900px){.math-grid{grid-template-columns:1fr!important;}}`}</style>
      </section>

      {/* ── ЧТО ПОЛУЧИТЕ ──────────────────────────────────────────────────── */}
      <section style={{ background: "#F8FAFC", padding: "100px 32px" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <div style={{ marginBottom: 56 }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: TEAL, textTransform: "uppercase" as const, letterSpacing: "2.5px", marginBottom: 16 }}>Результат диагностики</div>
            <h2 style={{ fontFamily: SERIF, fontSize: "clamp(34px,4.5vw,52px)", fontWeight: 500, color: DARK, margin: 0, lineHeight: 1.1 }}>
              Что вы получите через 10 минут
            </h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 1, background: "#E2E8F0", border: "1px solid #E2E8F0", borderRadius: 4, overflow: "hidden" }} className="get-grid">
            {WHAT_YOU_GET.map(({ icon, title, desc }, i) => (
              <div key={i} style={{ background: "#fff", padding: "32px 26px", transition: "background 0.25s, color 0.25s", cursor: "default" }}
                onMouseEnter={e => { const d = e.currentTarget; d.style.background = DARK; d.querySelectorAll<HTMLElement>(".ct,.cd").forEach(el => { el.style.color = el.classList.contains("ct") ? "#fff" : "rgba(255,255,255,0.45)"; }); }}
                onMouseLeave={e => { const d = e.currentTarget; d.style.background = "#fff"; d.querySelectorAll<HTMLElement>(".ct,.cd").forEach(el => { el.style.color = el.classList.contains("ct") ? DARK : "#64748B"; }); }}
              >
                <div style={{ width: 40, height: 40, borderRadius: 10, background: "rgba(45,212,191,0.1)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 18 }}>
                  <Icon name={icon} size={18} style={{ color: TEAL }} />
                </div>
                <div className="ct" style={{ fontFamily: SERIF, fontSize: 19, fontWeight: 600, color: DARK, marginBottom: 8, lineHeight: 1.2, transition: "color 0.25s" }}>{title}</div>
                <div className="cd" style={{ fontSize: 13, color: "#64748B", lineHeight: 1.6, transition: "color 0.25s" }}>{desc}</div>
              </div>
            ))}
          </div>
        </div>
        <style>{`@media(max-width:900px){.get-grid{grid-template-columns:1fr 1fr!important;}}@media(max-width:540px){.get-grid{grid-template-columns:1fr!important;}}`}</style>
      </section>

      {/* ── ПОЧЕМУ ИИ РЕКОМЕНДУЕТ ИМЕННО ЭТО ─────────────────────────────────── */}
      <section style={{ background: "#fff", padding: "100px 32px" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80, alignItems: "center" }} className="why-grid">
            <div>
              <div style={{ fontSize: 12, fontWeight: 600, color: TEAL, textTransform: "uppercase" as const, letterSpacing: "2.5px", marginBottom: 20 }}>Доверие к рекомендациям</div>
              <h2 style={{ fontFamily: SERIF, fontSize: "clamp(30px,4vw,46px)", fontWeight: 500, color: DARK, margin: "0 0 20px", lineHeight: 1.15 }}>
                ИИ объясняет,<br />почему рекомендует именно это
              </h2>
              <p style={{ fontSize: 16, color: "#475569", lineHeight: 1.75, margin: "0 0 28px", fontWeight: 300 }}>
                Не абстрактный совет, а видимая связь между вашими данными и предложенным действием. Вы всегда понимаете, откуда взялась рекомендация — и можете ей доверять.
              </p>
              <Link to="/cabinet?tab=register" style={{
                display: "inline-flex", alignItems: "center", gap: 8,
                padding: "14px 28px", borderRadius: 2,
                background: `linear-gradient(135deg,${TEAL},${TEAL2})`,
                color: DARK, fontSize: 15, fontWeight: 700,
                textDecoration: "none", boxShadow: "0 6px 20px rgba(45,212,191,0.3)",
              }}>
                Начать диагностику <Icon name="ArrowRight" size={16} />
              </Link>
            </div>
            <div style={{ background: "#F8FAFC", border: "1px solid #E2E8F0", borderRadius: 12, padding: "28px 26px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
                <div style={{ width: 32, height: 32, borderRadius: 8, background: "rgba(45,212,191,0.12)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Icon name="MessageCircleQuestion" size={16} style={{ color: TEAL }} />
                </div>
                <div style={{ fontSize: 13.5, fontWeight: 700, color: DARK }}>Почему сегодня — работа с возвратом клиентов?</div>
              </div>
              <p style={{ fontSize: 14, color: "#475569", lineHeight: 1.75, margin: 0 }}>
                За последние 14 дней у вас появилось <strong style={{ color: DARK }}>86 новых клиентов</strong>, но только <strong style={{ color: DARK }}>41%</strong> записались повторно. При вашем среднем чеке рост повторной записи всего на 7% может добавить около <strong style={{ color: TEAL }}>56 000 ₽</strong> в месяц.
              </p>
            </div>
          </div>
        </div>
        <style>{`@media(max-width:900px){.why-grid{grid-template-columns:1fr!important;}}`}</style>
      </section>

      {/* ── AI НЕ ТОЛЬКО СОВЕТУЕТ, НО И ДЕЛАЕТ ───────────────────────────────── */}
      <section style={{ background: "#F8FAFC", padding: "100px 32px" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <div style={{ maxWidth: 720, marginBottom: 48 }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: TEAL, textTransform: "uppercase" as const, letterSpacing: "2.5px", marginBottom: 16 }}>Не только совет</div>
            <h2 style={{ fontFamily: SERIF, fontSize: "clamp(30px,4vw,46px)", fontWeight: 500, color: DARK, margin: "0 0 16px", lineHeight: 1.15 }}>
              AI не просто советует — AI выполняет
            </h2>
            <p style={{ fontSize: 15.5, color: "#64748B", lineHeight: 1.75, margin: 0, fontWeight: 300 }}>
              Рядом с каждой рекомендацией — кнопка «Сделать». Инструменты платформы сами переводят совет в готовое действие.
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr auto 1fr", gap: 24, alignItems: "center" }} className="do-grid">
            <div style={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: 12, padding: "22px 24px" }}>
              <div style={{ fontSize: 11, color: TEAL, fontWeight: 700, textTransform: "uppercase" as const, letterSpacing: 1, marginBottom: 10 }}>Рекомендация</div>
              <div style={{ fontSize: 15, color: DARK, fontWeight: 600, lineHeight: 1.5 }}>Нужно вернуть 27 клиентов, которые не обращались 60+ дней</div>
            </div>
            <div style={{ display: "flex", justifyContent: "center" }}>
              <Icon name="ArrowRight" size={22} style={{ color: TEAL }} className="do-arrow" />
            </div>
            <div style={{ background: DARK, borderRadius: 12, padding: "22px 24px" }}>
              <div style={{ fontSize: 11, color: TEAL, fontWeight: 700, textTransform: "uppercase" as const, letterSpacing: 1, marginBottom: 10 }}>Promt Dialog делает сам</div>
              <div style={{ display: "flex", flexDirection: "column" as const, gap: 7 }}>
                {["Сегментирует клиентов", "Готовит предложение и несколько вариантов", "Пишет сообщения и сценарий обращения", "Формирует задачу и отслеживает результат"].map((t, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <Icon name="Check" size={13} style={{ color: TEAL, flexShrink: 0 }} />
                    <span style={{ fontSize: 13, color: "rgba(255,255,255,0.75)" }}>{t}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div style={{ marginTop: 40, fontSize: 13, color: "#94A3B8", maxWidth: 640, lineHeight: 1.7 }}>
            Вам не нужно знать, какой именно AI-агент сейчас работает — генератор сообщений, скрипты продаж или анализ персонала. Вы видите только: <strong style={{ color: DARK }}>проблема → решение → действие → результат</strong>.
          </div>
        </div>
        <style>{`
          @media(max-width:800px){.do-grid{grid-template-columns:1fr!important;}.do-arrow{transform:rotate(90deg);}}
        `}</style>
      </section>

      {/* ── ЧТО ВЫ ПОЧУВСТВУЕТЕ ──────────────────────────────────────────── */}
      <section style={{ background: DARK, padding: "100px 32px", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: 800, height: 400, background: `radial-gradient(ellipse,rgba(45,212,191,0.06) 0%,transparent 65%)`, pointerEvents: "none" }} />
        <div style={{ maxWidth: 1280, margin: "0 auto", position: "relative" }}>
          <div style={{ marginBottom: 56 }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: TEAL, textTransform: "uppercase" as const, letterSpacing: "2.5px", marginBottom: 16 }}>После диагностики</div>
            <h2 style={{ fontFamily: SERIF, fontSize: "clamp(34px,4.5vw,52px)", fontWeight: 500, color: "#fff", margin: 0, lineHeight: 1.1 }}>
              Что вы почувствуете,<br />когда увидите результат
            </h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 1, background: "rgba(255,255,255,0.06)", borderRadius: 4, overflow: "hidden" }} className="feelings-grid">
            {FEELINGS.map(({ icon, num, title, desc }, i) => (
              <div key={i} style={{ padding: "40px 28px", background: "rgba(255,255,255,0.02)", position: "relative", overflow: "hidden" }}>
                {/* Номер-водяной знак */}
                <div style={{ position: "absolute", top: -8, right: 16, fontFamily: SERIF, fontSize: 96, fontWeight: 700, color: "rgba(255,255,255,0.04)", lineHeight: 1, userSelect: "none", pointerEvents: "none" }}>{num}</div>
                {/* Иконка */}
                <div style={{ width: 48, height: 48, borderRadius: 12, border: "1px solid rgba(45,212,191,0.25)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 24, background: "rgba(45,212,191,0.06)" }}>
                  <Icon name={icon} size={20} style={{ color: TEAL }} />
                </div>
                <div style={{ fontFamily: SERIF, fontSize: 22, fontWeight: 600, color: "#fff", marginBottom: 10, letterSpacing: "-0.2px" }}>{title}</div>
                <div style={{ fontSize: 13, color: "rgba(255,255,255,0.42)", lineHeight: 1.7 }}>{desc}</div>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 48 }}>
            <p style={{ fontSize: 17, color: "rgba(255,255,255,0.55)", lineHeight: 1.75, fontStyle: "italic", maxWidth: 560, margin: "0 0 12px", fontFamily: SERIF }}>
              «Я наконец увидела, почему вторник всегда пустой — и что с этим делать. Три недели спустя загрузка выросла на 26%.»
            </p>
            <div style={{ fontSize: 13, color: "rgba(255,255,255,0.3)" }}>— Марина К., владелец салона, Москва</div>
          </div>
        </div>
        <style>{`@media(max-width:900px){.feelings-grid{grid-template-columns:1fr 1fr!important;}}@media(max-width:500px){.feelings-grid{grid-template-columns:1fr!important;}}`}</style>
      </section>

      {/* ── PROMT SCORE ───────────────────────────────────────────────────────── */}
      <section style={{ background: "#F8FAFC", padding: "100px 32px" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80, alignItems: "center" }} className="score-grid">
            <div>
              <div style={{ fontSize: 12, fontWeight: 600, color: TEAL, textTransform: "uppercase" as const, letterSpacing: "2.5px", marginBottom: 20 }}>Индекс здоровья бизнеса</div>
              <h2 style={{ fontFamily: SERIF, fontSize: "clamp(30px,4vw,46px)", fontWeight: 500, color: DARK, margin: "0 0 20px", lineHeight: 1.15 }}>
                Один показатель — вся картина дела
              </h2>
              <p style={{ fontSize: 16, color: "#475569", lineHeight: 1.75, margin: "0 0 20px", fontWeight: 300 }}>
                Не десятки графиков, а единый <strong style={{ color: DARK }}>PROMT SCORE</strong> из пяти составляющих. ИИ прямо говорит, что сейчас ограничивает рост, и как индекс меняется со временем.
              </p>
              <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 16px", background: "#fff", border: "1px solid #E2E8F0", borderRadius: 10, maxWidth: 440 }}>
                <Icon name="Lightbulb" size={16} style={{ color: TEAL, flexShrink: 0 }} />
                <span style={{ fontSize: 13, color: "#334155" }}>Главное ограничение роста сейчас — <strong style={{ color: DARK }}>маркетинг</strong></span>
              </div>
            </div>

            <div style={{ background: DARK, borderRadius: 16, padding: "32px 28px", position: "relative", overflow: "hidden" }}>
              <div style={{ position: "absolute", top: -40, right: -40, width: 220, height: 220, background: "radial-gradient(circle,rgba(45,212,191,0.1) 0%,transparent 65%)", pointerEvents: "none" }} />
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 26, position: "relative" }}>
                <div>
                  <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", textTransform: "uppercase" as const, letterSpacing: "1px", marginBottom: 6 }}>PROMT SCORE</div>
                  <div style={{ fontFamily: SERIF, fontSize: 44, fontWeight: 600, color: TEAL, lineHeight: 1 }}>72</div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 6, background: "rgba(45,212,191,0.12)", border: "1px solid rgba(45,212,191,0.3)", borderRadius: 20, padding: "6px 12px" }}>
                  <Icon name="TrendingUp" size={13} style={{ color: TEAL }} />
                  <span style={{ fontSize: 12, color: TEAL, fontWeight: 700 }}>+7 за месяц</span>
                </div>
              </div>
              {SCORE_ITEMS.map(({ label, val, color }) => (
                <div key={label} style={{ marginBottom: 14, position: "relative" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                    <span style={{ fontSize: 12.5, color: "rgba(255,255,255,0.65)" }}>{label}</span>
                    <span style={{ fontSize: 12.5, color: "rgba(255,255,255,0.5)" }}>{val}</span>
                  </div>
                  <div style={{ height: 6, background: "rgba(255,255,255,0.08)", borderRadius: 10 }}>
                    <div style={{ height: "100%", width: `${val}%`, background: color, borderRadius: 10 }} />
                  </div>
                </div>
              ))}
              <div style={{ marginTop: 18, fontSize: 12, color: "rgba(255,255,255,0.4)", lineHeight: 1.6 }}>
                Чем дольше вы пользуетесь навигатором, тем точнее ИИ понимает именно ваш бизнес или практику — и тем сильнее растёт индекс.
              </div>
            </div>
          </div>
        </div>
        <style>{`@media(max-width:900px){.score-grid{grid-template-columns:1fr!important;}}`}</style>
      </section>

      {/* ── КАК НАЧАТЬ ──────────────────────────────────────────────────────── */}
      <section id="how" style={{ background: "#fff", padding: "100px 32px" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <div style={{ marginBottom: 64 }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: TEAL, textTransform: "uppercase" as const, letterSpacing: "2.5px", marginBottom: 16 }}>Четыре шага</div>
            <h2 style={{ fontFamily: SERIF, fontSize: "clamp(34px,4.5vw,52px)", fontWeight: 500, color: DARK, margin: 0, lineHeight: 1.1 }}>
              От регистрации до результата
            </h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 32 }} className="steps-grid">
            {STEPS.map(({ num, title, desc, icon }, i) => (
              <div key={i}>
                <div style={{ width: 64, height: 64, borderRadius: "50%", background: i === 0 ? `linear-gradient(135deg,${TEAL},${TEAL2})` : "#F1F5F9", border: i === 0 ? "none" : "1px solid #E2E8F0", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 20, boxShadow: i === 0 ? "0 8px 24px rgba(45,212,191,0.3)" : "none" }}>
                  <Icon name={icon} size={24} style={{ color: i === 0 ? DARK : TEAL }} />
                </div>
                <div style={{ fontSize: 11, color: TEAL, fontWeight: 700, letterSpacing: "1.5px", marginBottom: 8 }}>Шаг {num}</div>
                <div style={{ fontFamily: SERIF, fontSize: 20, fontWeight: 600, color: DARK, marginBottom: 8, lineHeight: 1.2 }}>{title}</div>
                <div style={{ fontSize: 13, color: "#64748B", lineHeight: 1.6 }}>{desc}</div>
              </div>
            ))}
          </div>
        </div>
        <style>{`@media(max-width:800px){.steps-grid{grid-template-columns:1fr 1fr!important;}}@media(max-width:480px){.steps-grid{grid-template-columns:1fr!important;}}`}</style>
      </section>

      {/* ── ПЛАН БЕСПЛАТНО ──────────────────────────────────────────────────── */}
      <section style={{ background: "#F8FAFC", padding: "72px 32px" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <div style={{ background: `linear-gradient(135deg,${DARK},#112B3C)`, borderRadius: 6, padding: "48px 40px", display: "flex", alignItems: "center", gap: 40, position: "relative", overflow: "hidden" }} className="gift-block">
            <div style={{ position: "absolute", right: -60, top: -60, width: 280, height: 280, background: `radial-gradient(circle,rgba(45,212,191,0.12) 0%,transparent 65%)`, pointerEvents: "none" }} />
            <div style={{ width: 80, height: 80, borderRadius: 20, background: `linear-gradient(135deg,${TEAL},${TEAL2})`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, boxShadow: "0 12px 32px rgba(45,212,191,0.3)" }}>
              <Icon name="Gift" size={36} style={{ color: DARK }} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 11, color: TEAL, fontWeight: 600, textTransform: "uppercase" as const, letterSpacing: "2px", marginBottom: 8 }}>Без оплаты</div>
              <h3 style={{ fontFamily: SERIF, fontSize: "clamp(22px,2.5vw,32px)", fontWeight: 500, color: "#fff", margin: "0 0 8px", lineHeight: 1.2 }}>Подключить AI-навигатор — бесплатно</h3>
              <p style={{ fontSize: 14, color: "rgba(255,255,255,0.5)", lineHeight: 1.65, margin: 0, maxWidth: 520 }}>
                Пройдите диагностику и получите первый план роста дохода без оплаты — дальше ИИ продолжит вести ваш бизнес или практику к цели каждый день. Инструменты платформы (сообщения клиентам, контент, скрипты) доступны через баланс энергии.
              </p>
            </div>
            <Link to="/cabinet?tab=register" style={{
              display: "inline-flex", alignItems: "center", gap: 10,
              padding: "14px 24px", borderRadius: 2,
              background: `linear-gradient(135deg,${TEAL},${TEAL2})`,
              color: DARK, fontSize: 15, fontWeight: 700,
              textDecoration: "none", flexShrink: 0,
              boxShadow: "0 8px 24px rgba(45,212,191,0.3)",
              whiteSpace: "nowrap" as const,
            }}>
              Получить план бесплатно <Icon name="ArrowRight" size={16} />
            </Link>
          </div>
        </div>
        <style>{`@media(max-width:800px){.gift-block{flex-direction:column!important;padding:32px 24px!important;}}`}</style>
      </section>

      {/* ── ФИНАЛЬНЫЙ CTA ──────────────────────────────────────────────────── */}
      <section style={{ background: DARK, padding: "120px 32px", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: 600, height: 350, background: `radial-gradient(ellipse,rgba(45,212,191,0.08) 0%,transparent 65%)`, pointerEvents: "none" }} />
        <div style={{ maxWidth: 1280, margin: "0 auto", position: "relative" }}>
          <div style={{ maxWidth: 680 }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 8, border: "1px solid rgba(45,212,191,0.25)", borderRadius: 100, padding: "7px 20px", marginBottom: 36 }}>
              <div style={{ width: 6, height: 6, borderRadius: "50%", background: TEAL }} />
              <span style={{ fontSize: 12, color: TEAL, fontWeight: 500, letterSpacing: "1.5px", textTransform: "uppercase" as const }}>Бесплатно · Без карты</span>
            </div>
            <h2 style={{ fontFamily: SERIF, fontSize: "clamp(38px,5vw,64px)", fontWeight: 500, color: "#fff", margin: "0 0 20px", lineHeight: 1.08 }}>
              Поставьте цель —<br />получите навигатор к ней
            </h2>
            <p style={{ fontSize: "clamp(15px,1.5vw,17px)", color: "rgba(255,255,255,0.5)", lineHeight: 1.75, margin: "0 0 40px", fontWeight: 300 }}>
              Зарегистрируйтесь, заполните профиль и цель — через 10 минут получите диагностику и первый план. Дальше ИИ каждый день будет подсказывать следующий шаг к результату.
            </p>
            <div style={{ display: "flex", gap: 14, flexWrap: "wrap" as const, marginBottom: 40 }}>
              <Link to="/cabinet?tab=register" style={{
                display: "inline-flex", alignItems: "center", gap: 10,
                padding: "18px 36px", borderRadius: 2,
                background: `linear-gradient(135deg,${TEAL},${TEAL2})`,
                color: DARK, fontSize: 17, fontWeight: 700,
                textDecoration: "none", boxShadow: "0 12px 40px rgba(45,212,191,0.4)",
              }}>
                <Icon name="Zap" size={20} />
                Начать бесплатную диагностику
              </Link>
            </div>
            <div style={{ display: "flex", gap: 32, flexWrap: "wrap" as const }}>
              {[["Бесплатно","навсегда"],["Каждый день","новый шаг от ИИ"],["10 минут","до первого плана"]].map(([v, l], i) => (
                <div key={i}>
                  <div style={{ fontSize: 14, color: "#fff", fontWeight: 600 }}>{v}</div>
                  <div style={{ fontSize: 12, color: "rgba(255,255,255,0.35)", marginTop: 2 }}>{l}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <BizFooter />
    </>
  );
}