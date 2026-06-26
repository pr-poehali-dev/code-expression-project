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
  { icon: "BarChart3",    title: "Финансовая карта салона",        desc: "Увидите точные цифры: где деньги уходят вхолостую, а где скрыт неиспользованный доход." },
  { icon: "TrendingUp",   title: "Прогноз роста выручки",          desc: "Математическая модель покажет, сколько дополнительно принесёт каждый процент улучшения загрузки." },
  { icon: "AlertTriangle",title: "Слабые места с приоритетами",    desc: "Список конкретных проблем, отсортированных по влиянию на прибыль — от критичных к второстепенным." },
  { icon: "Target",       title: "Точки роста без новых клиентов", desc: "Узнаете, как увеличить доход на 20–40% за счёт текущей базы и оптимизации загрузки мастеров." },
  { icon: "Lightbulb",    title: "Конкретный план действий",       desc: "Не советы «в общем», а пошаговые рекомендации под ваш салон с расчётом экономического эффекта." },
  { icon: "Brain",        title: "ИИ-интерпретация результатов",   desc: "Искусственный интеллект объяснит паттерны и даст дополнительный контекст к математическим выводам." },
];

const FEELINGS = [
  { emoji: "😌", title: "Ясность", desc: "Наконец-то видите полную картину бизнеса — без догадок и ощущения «что-то идёт не так»." },
  { emoji: "💡", title: "Понимание", desc: "Знаете точно, что именно тянет вниз — и что нужно сделать в первую очередь." },
  { emoji: "🔥", title: "Энергия", desc: "Появляется азарт и желание действовать, потому что путь к росту становится конкретным." },
  { emoji: "🏆", title: "Уверенность", desc: "Принимаете решения опираясь на данные, а не на интуицию или советы «знающих людей»." },
];

const STEPS = [
  {
    num: "01",
    title: "Регистрация",
    desc: "Создайте аккаунт за 1 минуту. Никаких карт — сразу получаете 100 энергий в подарок.",
    icon: "UserPlus",
  },
  {
    num: "02",
    title: "Добавьте салон",
    desc: "Введите базовые данные: название, количество мастеров, средний чек. Займёт 3 минуты.",
    icon: "Building2",
  },
  {
    num: "03",
    title: "Запустите диагностику",
    desc: "Откройте инструмент «Диагностика роста PRO» и ответьте на 8–12 вопросов о вашем бизнесе.",
    icon: "PlayCircle",
  },
  {
    num: "04",
    title: "Получите результат",
    desc: "Графики, прогнозы, слабые места и план действий — готов через несколько минут.",
    icon: "BarChart2",
  },
];

const MATH_POINTS = [
  { icon: "Calculator",   text: "Расчёт индекса загрузки мастеров по часовым ставкам и проходимости" },
  { icon: "TrendingUp",   text: "Формула LTV клиента с учётом частоты визитов и среднего чека" },
  { icon: "PieChart",     text: "Анализ структуры выручки: где концентрируется 80% дохода" },
  { icon: "Activity",     text: "Модель Чурн-рейта: прогноз оттока клиентов по сегментам" },
  { icon: "Percent",      text: "ROI каждого улучшения: сколько рублей принесёт каждый шаг" },
  { icon: "GitBranch",    text: "Сценарный анализ: три варианта развития события на 3–6 месяцев" },
];

export default function Diagnostika() {
  return (
    <>
      <Helmet>
        <title>Диагностика роста салона PRO — бесплатный аудит за 10 минут | Про Диалог</title>
        <meta name="description" content="Бесплатная диагностика салона красоты: математические алгоритмы покажут, где вы теряете деньги и как увеличить прибыль без новых клиентов. Зарегистрируйтесь и получите результат за 10 минут." />
      </Helmet>

      <BizNavbar />

      {/* ── HERO ─────────────────────────────────────────────────────────────── */}
      <section style={{
        background: `radial-gradient(130% 110% at 75% 0%, #0d2d1f 0%, ${DARK} 50%, #060B16 100%)`,
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        paddingTop: 76,
        position: "relative",
        overflow: "hidden",
      }}>
        {/* Сетка фона */}
        <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(255,255,255,0.02) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.02) 1px,transparent 1px)", backgroundSize: "52px 52px", pointerEvents: "none" }} />
        {/* Свечение */}
        <div style={{ position: "absolute", top: "20%", right: "8%", width: 560, height: 560, borderRadius: "50%", background: `radial-gradient(circle, rgba(45,212,191,0.10) 0%, transparent 65%)`, pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: "10%", left: "5%", width: 320, height: 320, borderRadius: "50%", background: `radial-gradient(circle, rgba(45,212,191,0.06) 0%, transparent 70%)`, pointerEvents: "none" }} />

        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "100px 32px", width: "100%" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 72, alignItems: "center" }} className="hero-diag-grid">

            {/* Левая колонка */}
            <div>
              {/* Бейдж */}
              <div style={{ display: "inline-flex", alignItems: "center", gap: 10, border: "1px solid rgba(45,212,191,0.3)", borderRadius: 100, padding: "7px 18px", marginBottom: 36 }}>
                <div style={{ width: 6, height: 6, borderRadius: "50%", background: TEAL }} />
                <span style={{ fontSize: 12, color: TEAL, fontWeight: 500, letterSpacing: "1.5px", textTransform: "uppercase" as const }}>
                  Бесплатный аудит · 10 минут
                </span>
              </div>

              <h1 style={{ fontFamily: SERIF, fontSize: "clamp(42px,5.5vw,72px)", fontWeight: 500, color: "#fff", lineHeight: 1.06, margin: "0 0 28px", letterSpacing: "-0.5px" }}>
                Узнайте, где ваш салон<br />
                <span style={{ color: TEAL }}>теряет деньги</span> — и как<br />
                остановить это сегодня
              </h1>

              <p style={{ fontSize: "clamp(15px,1.6vw,18px)", color: "rgba(255,255,255,0.65)", lineHeight: 1.75, margin: "0 0 14px", fontWeight: 300, maxWidth: 520 }}>
                Бесплатная диагностика роста салона на основе <strong style={{ color: "#fff", fontWeight: 600 }}>математических формул и экономических алгоритмов</strong> — не советы «в общем», а точные цифры по вашим данным.
              </p>
              <p style={{ fontSize: "clamp(13px,1.3vw,15px)", color: "rgba(255,255,255,0.4)", lineHeight: 1.7, margin: "0 0 40px", fontWeight: 300, maxWidth: 480 }}>
                ИИ даёт только интерпретацию — все выводы строятся на формулах и реальных показателях вашего бизнеса.
              </p>

              {/* CTA */}
              <div style={{ display: "flex", gap: 14, flexWrap: "wrap" as const, marginBottom: 48 }}>
                <Link to="/cabinet" style={{
                  display: "inline-flex", alignItems: "center", gap: 10,
                  padding: "16px 32px", borderRadius: 2,
                  background: `linear-gradient(135deg,${TEAL},${TEAL2})`,
                  color: DARK, fontSize: 16, fontWeight: 700,
                  textDecoration: "none", letterSpacing: "0.3px",
                  boxShadow: "0 8px 32px rgba(45,212,191,0.35)",
                  transition: "all 0.3s",
                }}>
                  <Icon name="Zap" size={18} />
                  Пройти диагностику бесплатно
                </Link>
                <a href="#how" style={{
                  display: "inline-flex", alignItems: "center", gap: 8,
                  padding: "16px 24px", borderRadius: 2,
                  border: "1px solid rgba(255,255,255,0.18)",
                  color: "rgba(255,255,255,0.7)", fontSize: 15,
                  textDecoration: "none", transition: "all 0.3s",
                }}>
                  Как это работает <Icon name="ArrowDown" size={15} />
                </a>
              </div>

              {/* Статы */}
              <div style={{ display: "flex", gap: 40, paddingTop: 36, borderTop: "1px solid rgba(255,255,255,0.07)", flexWrap: "wrap" as const }}>
                {[["10 мин", "время прохождения"], ["100 ⚡", "энергий в подарок"], ["0 ₽", "полностью бесплатно"]].map(([v, l], i) => (
                  <div key={i}>
                    <div style={{ fontFamily: SERIF, fontSize: 30, fontWeight: 600, color: "#fff", lineHeight: 1 }}>{v}</div>
                    <div style={{ fontSize: 12, color: "rgba(255,255,255,0.38)", marginTop: 5, letterSpacing: "0.5px" }}>{l}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Правая колонка — mock дашборд */}
            <div style={{ position: "relative" }}>
              <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(45,212,191,0.2)", borderRadius: 16, overflow: "hidden", boxShadow: "0 40px 100px rgba(0,0,0,0.5)" }}>
                {/* Шапка mock-окна */}
                <div style={{ background: "rgba(255,255,255,0.04)", borderBottom: "1px solid rgba(255,255,255,0.07)", padding: "14px 20px", display: "flex", alignItems: "center", gap: 8 }}>
                  <div style={{ display: "flex", gap: 6 }}>
                    {["#ef4444","#f59e0b","#22c55e"].map(c => <div key={c} style={{ width: 10, height: 10, borderRadius: "50%", background: c }} />)}
                  </div>
                  <span style={{ fontSize: 12, color: "rgba(255,255,255,0.35)", marginLeft: 8 }}>Диагностика роста · Про Диалог</span>
                </div>

                {/* Контент mock-дашборда */}
                <div style={{ padding: "24px" }}>
                  {/* Score */}
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 }}>
                    <div>
                      <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", textTransform: "uppercase" as const, letterSpacing: "1px", marginBottom: 6 }}>Индекс здоровья салона</div>
                      <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
                        <span style={{ fontFamily: SERIF, fontSize: 48, fontWeight: 600, color: "#f59e0b", lineHeight: 1 }}>62</span>
                        <span style={{ fontSize: 18, color: "rgba(255,255,255,0.3)" }}>/100</span>
                      </div>
                      <div style={{ fontSize: 12, color: "#f59e0b", marginTop: 4 }}>Есть резервы роста</div>
                    </div>
                    <div style={{ textAlign: "right" as const }}>
                      <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", marginBottom: 4 }}>Потенциал роста выручки</div>
                      <div style={{ fontFamily: SERIF, fontSize: 28, color: TEAL, fontWeight: 600 }}>+34%</div>
                      <div style={{ fontSize: 11, color: "rgba(255,255,255,0.35)" }}>за 3 месяца</div>
                    </div>
                  </div>

                  {/* Мини-бары */}
                  {[
                    { label: "Загрузка мастеров", val: 58, color: "#f59e0b", risk: "Критично" },
                    { label: "Возврат клиентов", val: 44, color: "#ef4444", risk: "Слабо" },
                    { label: "Средний чек", val: 71, color: TEAL, risk: "Норма" },
                    { label: "Маркетинговый охват", val: 36, color: "#ef4444", risk: "Слабо" },
                  ].map(({ label, val, color, risk }) => (
                    <div key={label} style={{ marginBottom: 14 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                        <span style={{ fontSize: 12, color: "rgba(255,255,255,0.6)" }}>{label}</span>
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          <span style={{ fontSize: 11, color, fontWeight: 600 }}>{risk}</span>
                          <span style={{ fontSize: 12, color: "rgba(255,255,255,0.5)" }}>{val}%</span>
                        </div>
                      </div>
                      <div style={{ height: 5, background: "rgba(255,255,255,0.08)", borderRadius: 10 }}>
                        <div style={{ height: "100%", width: `${val}%`, background: color, borderRadius: 10, transition: "width 1s" }} />
                      </div>
                    </div>
                  ))}

                  {/* Прогноз */}
                  <div style={{ marginTop: 20, padding: "14px 16px", background: "rgba(45,212,191,0.07)", border: "1px solid rgba(45,212,191,0.18)", borderRadius: 10 }}>
                    <div style={{ fontSize: 11, color: TEAL, fontWeight: 600, textTransform: "uppercase" as const, letterSpacing: "1px", marginBottom: 8 }}>Приоритет №1</div>
                    <div style={{ fontSize: 13, color: "rgba(255,255,255,0.8)", lineHeight: 1.5 }}>
                      Увеличить загрузку мастеров в «мёртвые» часы (вт–ср, 11:00–14:00) даст <strong style={{ color: TEAL }}>+18% к выручке</strong> без доп. затрат
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating badge */}
              <div style={{ position: "absolute", top: -16, right: -16, background: TEAL, borderRadius: 12, padding: "10px 16px", boxShadow: "0 8px 24px rgba(45,212,191,0.4)", display: "flex", alignItems: "center", gap: 8 }}>
                <Icon name="Gift" size={16} style={{ color: DARK }} />
                <span style={{ fontSize: 13, fontWeight: 700, color: DARK }}>100 ⚡ в подарок</span>
              </div>
            </div>
          </div>
        </div>

        <style>{`
          @media (max-width: 900px) {
            .hero-diag-grid { grid-template-columns: 1fr !important; }
          }
        `}</style>
      </section>

      {/* ── МАТЕМАТИКА ──────────────────────────────────────────────────────── */}
      <section style={{ background: "#fff", padding: "100px 32px" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80, alignItems: "center" }} className="math-grid">
            <div>
              <div style={{ fontSize: 12, fontWeight: 600, color: TEAL, textTransform: "uppercase" as const, letterSpacing: "2.5px", marginBottom: 20 }}>Как работает диагностика</div>
              <h2 style={{ fontFamily: SERIF, fontSize: "clamp(34px,4vw,52px)", fontWeight: 500, color: DARK, margin: "0 0 24px", lineHeight: 1.1 }}>
                Математика и экономика —<br />не ИИ-гадания
              </h2>
              <p style={{ fontSize: 17, color: "#475569", lineHeight: 1.75, margin: "0 0 16px", fontWeight: 300 }}>
                Большинство «диагностик» — это опросники с общими советами. Мы сделали иначе.
              </p>
              <p style={{ fontSize: 16, color: "#64748B", lineHeight: 1.75, fontWeight: 300, margin: "0 0 32px" }}>
                Вы вводите реальные показатели своего салона. Алгоритм применяет проверенные экономические формулы и возвращает точные числа: сколько теряете, где потенциал роста и какой эффект даст каждое улучшение. <strong style={{ color: DARK }}>ИИ лишь помогает интерпретировать результат</strong> — все выводы уже посчитаны математически.
              </p>
              <Link to="/cabinet" style={{
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
                <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 16, padding: "20px 24px", background: "#fff" }}>
                  <div style={{ width: 36, height: 36, borderRadius: 8, background: `rgba(45,212,191,0.1)`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 1 }}>
                    <Icon name={icon} size={16} style={{ color: TEAL }} />
                  </div>
                  <span style={{ fontSize: 14, color: "#475569", lineHeight: 1.6 }}>{text}</span>
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
          <div style={{ textAlign: "center" as const, maxWidth: 680, margin: "0 auto 64px" }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: TEAL, textTransform: "uppercase" as const, letterSpacing: "2.5px", marginBottom: 20 }}>Результат диагностики</div>
            <h2 style={{ fontFamily: SERIF, fontSize: "clamp(34px,4.5vw,52px)", fontWeight: 500, color: DARK, margin: "0 0 20px", lineHeight: 1.1 }}>
              Что вы получите через 10 минут
            </h2>
            <p style={{ fontSize: 17, color: "#64748B", lineHeight: 1.7, fontWeight: 300, margin: 0 }}>
              Не абстрактные советы — конкретный отчёт по вашему салону с цифрами, графиками и планом действий.
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 1, background: "#E2E8F0", border: "1px solid #E2E8F0", borderRadius: 4, overflow: "hidden" }} className="get-grid">
            {WHAT_YOU_GET.map(({ icon, title, desc }, i) => (
              <div key={i} style={{ background: "#fff", padding: "36px 28px", transition: "all 0.25s", cursor: "default" }}
                onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.background = DARK; (e.currentTarget as HTMLDivElement).querySelectorAll(".card-title,.card-desc").forEach((el: Element) => { if (el.classList.contains("card-title")) (el as HTMLElement).style.color = "#fff"; else (el as HTMLElement).style.color = "rgba(255,255,255,0.5)"; }); (e.currentTarget as HTMLDivElement).querySelector(".card-icon-wrap")!.setAttribute("style","width:44px;height:44px;borderRadius:10px;background:rgba(45,212,191,0.15);display:flex;alignItems:center;justifyContent:center;marginBottom:20px;flexShrink:0"); }}
                onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.background = "#fff"; (e.currentTarget as HTMLDivElement).querySelectorAll(".card-title,.card-desc").forEach((el: Element) => { if (el.classList.contains("card-title")) (el as HTMLElement).style.color = DARK; else (el as HTMLElement).style.color = "#64748B"; }); (e.currentTarget as HTMLDivElement).querySelector(".card-icon-wrap")!.setAttribute("style","width:44px;height:44px;borderRadius:10px;background:rgba(45,212,191,0.1);display:flex;alignItems:center;justifyContent:center;marginBottom:20px;flexShrink:0"); }}
              >
                <div className="card-icon-wrap" style={{ width: 44, height: 44, borderRadius: 10, background: "rgba(45,212,191,0.1)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 20, flexShrink: 0 }}>
                  <Icon name={icon} size={20} style={{ color: TEAL }} />
                </div>
                <div className="card-title" style={{ fontFamily: SERIF, fontSize: 19, fontWeight: 600, color: DARK, marginBottom: 10, lineHeight: 1.25, transition: "color 0.25s" }}>{title}</div>
                <div className="card-desc" style={{ fontSize: 14, color: "#64748B", lineHeight: 1.65, transition: "color 0.25s" }}>{desc}</div>
              </div>
            ))}
          </div>
        </div>
        <style>{`@media(max-width:900px){.get-grid{grid-template-columns:1fr!important;}}@media(max-width:600px){.get-grid{grid-template-columns:1fr!important;}}`}</style>
      </section>

      {/* ── КАК ВЫ БУДЕТЕ СЕБЯ ЧУВСТВОВАТЬ ───────────────────────────────── */}
      <section style={{ background: DARK, padding: "100px 32px", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: 900, height: 500, background: `radial-gradient(ellipse, rgba(45,212,191,0.06) 0%, transparent 65%)`, pointerEvents: "none" }} />
        <div style={{ maxWidth: 1280, margin: "0 auto", position: "relative" }}>
          <div style={{ textAlign: "center" as const, maxWidth: 640, margin: "0 auto 64px" }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: TEAL, textTransform: "uppercase" as const, letterSpacing: "2.5px", marginBottom: 20 }}>После диагностики</div>
            <h2 style={{ fontFamily: SERIF, fontSize: "clamp(34px,4.5vw,52px)", fontWeight: 500, color: "#fff", margin: "0 0 20px", lineHeight: 1.1 }}>
              Что вы почувствуете,<br />когда увидите результат
            </h2>
            <p style={{ fontSize: 16, color: "rgba(255,255,255,0.5)", lineHeight: 1.7, fontWeight: 300, margin: 0 }}>
              Тысячи управляющих описывают один и тот же опыт — когда размытые ощущения заменяются точными данными.
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 1, background: "rgba(255,255,255,0.07)", borderRadius: 4, overflow: "hidden" }} className="feelings-grid">
            {FEELINGS.map(({ emoji, title, desc }, i) => (
              <div key={i} style={{ padding: "40px 28px", background: "rgba(255,255,255,0.02)", borderRight: i < 3 ? "1px solid rgba(255,255,255,0.06)" : "none", textAlign: "center" as const }}>
                <div style={{ fontSize: 48, marginBottom: 20, lineHeight: 1 }}>{emoji}</div>
                <div style={{ fontFamily: SERIF, fontSize: 24, fontWeight: 600, color: "#fff", marginBottom: 12 }}>{title}</div>
                <div style={{ fontSize: 14, color: "rgba(255,255,255,0.45)", lineHeight: 1.7 }}>{desc}</div>
              </div>
            ))}
          </div>

          <div style={{ textAlign: "center" as const, marginTop: 56 }}>
            <p style={{ fontSize: 18, color: "rgba(255,255,255,0.6)", lineHeight: 1.7, fontStyle: "italic", maxWidth: 600, margin: "0 auto 36px", fontFamily: SERIF }}>
              «Я наконец-то увидела, почему вторник всегда пустой — и что с этим делать. Три недели спустя загрузка выросла на 26%.»
            </p>
            <div style={{ fontSize: 13, color: "rgba(255,255,255,0.3)", letterSpacing: "0.5px" }}>— Марина К., владелец салона, Москва</div>
          </div>
        </div>
        <style>{`@media(max-width:900px){.feelings-grid{grid-template-columns:1fr 1fr!important;}}@media(max-width:500px){.feelings-grid{grid-template-columns:1fr!important;}}`}</style>
      </section>

      {/* ── КАК НАЧАТЬ ──────────────────────────────────────────────────────── */}
      <section id="how" style={{ background: "#fff", padding: "100px 32px" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <div style={{ textAlign: "center" as const, maxWidth: 580, margin: "0 auto 72px" }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: TEAL, textTransform: "uppercase" as const, letterSpacing: "2.5px", marginBottom: 20 }}>Четыре шага</div>
            <h2 style={{ fontFamily: SERIF, fontSize: "clamp(34px,4.5vw,52px)", fontWeight: 500, color: DARK, margin: "0 0 20px", lineHeight: 1.1 }}>
              От регистрации до результата — за 10 минут
            </h2>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 1, position: "relative" }} className="steps-grid">
            {/* Линия-соединитель */}
            <div style={{ position: "absolute", top: 36, left: "12.5%", right: "12.5%", height: 1, background: "linear-gradient(90deg,transparent,rgba(45,212,191,0.4),transparent)", zIndex: 0 }} className="steps-line" />

            {STEPS.map(({ num, title, desc, icon }, i) => (
              <div key={i} style={{ textAlign: "center" as const, padding: "0 16px", position: "relative", zIndex: 1 }}>
                {/* Иконка-круг */}
                <div style={{ width: 72, height: 72, borderRadius: "50%", background: i === 0 ? `linear-gradient(135deg,${TEAL},${TEAL2})` : "#F1F5F9", border: i === 0 ? "none" : "1px solid #E2E8F0", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 24px", boxShadow: i === 0 ? "0 8px 24px rgba(45,212,191,0.3)" : "none" }}>
                  <Icon name={icon} size={28} style={{ color: i === 0 ? DARK : TEAL }} />
                </div>
                <div style={{ fontSize: 11, color: TEAL, fontWeight: 700, letterSpacing: "1.5px", marginBottom: 10 }}>Шаг {num}</div>
                <div style={{ fontFamily: SERIF, fontSize: 20, fontWeight: 600, color: DARK, marginBottom: 10, lineHeight: 1.2 }}>{title}</div>
                <div style={{ fontSize: 13, color: "#64748B", lineHeight: 1.65 }}>{desc}</div>
              </div>
            ))}
          </div>
        </div>
        <style>{`@media(max-width:800px){.steps-grid{grid-template-columns:1fr 1fr!important;}.steps-line{display:none!important;}}@media(max-width:480px){.steps-grid{grid-template-columns:1fr!important;}}`}</style>
      </section>

      {/* ── ПОДАРОК 100 ЭНЕРГИЙ ──────────────────────────────────────────────── */}
      <section style={{ background: "#F8FAFC", padding: "80px 32px" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <div style={{ background: `linear-gradient(135deg,${DARK},#112B3C)`, borderRadius: 6, padding: "56px 48px", display: "flex", alignItems: "center", gap: 56, position: "relative", overflow: "hidden" }} className="gift-block">
            {/* Свечение */}
            <div style={{ position: "absolute", right: -80, top: -80, width: 320, height: 320, background: `radial-gradient(circle,rgba(45,212,191,0.12) 0%,transparent 65%)`, pointerEvents: "none" }} />

            <div style={{ width: 96, height: 96, borderRadius: 24, background: `linear-gradient(135deg,${TEAL},${TEAL2})`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, boxShadow: "0 16px 40px rgba(45,212,191,0.35)" }}>
              <Icon name="Gift" size={44} style={{ color: DARK }} />
            </div>

            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 12, color: TEAL, fontWeight: 600, textTransform: "uppercase" as const, letterSpacing: "2px", marginBottom: 12 }}>Бонус при регистрации</div>
              <h3 style={{ fontFamily: SERIF, fontSize: "clamp(26px,3vw,38px)", fontWeight: 500, color: "#fff", margin: "0 0 12px", lineHeight: 1.2 }}>
                100 энергий — бесплатно
              </h3>
              <p style={{ fontSize: 15, color: "rgba(255,255,255,0.55)", lineHeight: 1.7, margin: 0, maxWidth: 560 }}>
                После диагностики у вас останутся энергии, чтобы попробовать другие инструменты платформы: генератор скриптов для администратора, ответы на отзывы, контент для соцсетей и многое другое. Без оплаты.
              </p>
            </div>

            <div style={{ flexShrink: 0 }}>
              <Link to="/cabinet" style={{
                display: "inline-flex", alignItems: "center", gap: 10,
                padding: "16px 28px", borderRadius: 2,
                background: `linear-gradient(135deg,${TEAL},${TEAL2})`,
                color: DARK, fontSize: 15, fontWeight: 700,
                textDecoration: "none",
                boxShadow: "0 8px 24px rgba(45,212,191,0.3)",
                whiteSpace: "nowrap" as const,
              }}>
                Получить 100 ⚡ <Icon name="ArrowRight" size={16} />
              </Link>
            </div>
          </div>
        </div>
        <style>{`@media(max-width:800px){.gift-block{flex-direction:column!important;text-align:center!important;padding:36px 24px!important;}}`}</style>
      </section>

      {/* ── ДЛЯ КОГО ──────────────────────────────────────────────────────── */}
      <section style={{ background: "#fff", padding: "100px 32px" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <div style={{ textAlign: "center" as const, maxWidth: 600, margin: "0 auto 64px" }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: TEAL, textTransform: "uppercase" as const, letterSpacing: "2.5px", marginBottom: 20 }}>Для кого это</div>
            <h2 style={{ fontFamily: SERIF, fontSize: "clamp(34px,4.5vw,52px)", fontWeight: 500, color: DARK, margin: "0 0 20px", lineHeight: 1.1 }}>
              Диагностика подойдёт, если вы…
            </h2>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 24 }} className="for-who-grid">
            {[
              { icon: "Building2",   title: "Владелец или управляющий",  desc: "Хотите понять реальную картину бизнеса, а не жить на интуиции и «кажется, всё нормально»." },
              { icon: "TrendingDown",title: "Выручка не растёт",         desc: "Клиентов вроде достаточно, мастера работают — но цифры топчутся на месте. Пора найти причину." },
              { icon: "Users",       title: "Мастера загружены неровно", desc: "Одни мастера забиты на месяц вперёд, другие сидят без записи. Пора это исправить системно." },
            ].map(({ icon, title, desc }, i) => (
              <div key={i} style={{ padding: "32px 28px", border: "1px solid #E2E8F0", borderRadius: 4, transition: "all 0.25s" }}
                onMouseEnter={e => { const d = e.currentTarget; d.style.borderColor = TEAL; d.style.boxShadow = "0 8px 32px rgba(45,212,191,0.12)"; }}
                onMouseLeave={e => { const d = e.currentTarget; d.style.borderColor = "#E2E8F0"; d.style.boxShadow = "none"; }}
              >
                <div style={{ width: 48, height: 48, borderRadius: 12, background: "rgba(45,212,191,0.1)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 20 }}>
                  <Icon name={icon} size={22} style={{ color: TEAL }} />
                </div>
                <div style={{ fontFamily: SERIF, fontSize: 20, fontWeight: 600, color: DARK, marginBottom: 10 }}>{title}</div>
                <div style={{ fontSize: 14, color: "#64748B", lineHeight: 1.65 }}>{desc}</div>
              </div>
            ))}
          </div>
        </div>
        <style>{`@media(max-width:800px){.for-who-grid{grid-template-columns:1fr!important;}}`}</style>
      </section>

      {/* ── ФИНАЛЬНЫЙ CTA ──────────────────────────────────────────────────── */}
      <section style={{ background: DARK, padding: "120px 32px", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(255,255,255,0.015) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.015) 1px,transparent 1px)", backgroundSize: "52px 52px", pointerEvents: "none" }} />
        <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: 700, height: 400, background: `radial-gradient(ellipse,rgba(45,212,191,0.08) 0%,transparent 65%)`, pointerEvents: "none" }} />

        <div style={{ maxWidth: 760, margin: "0 auto", textAlign: "center" as const, position: "relative" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, border: "1px solid rgba(45,212,191,0.25)", borderRadius: 100, padding: "7px 20px", marginBottom: 36 }}>
            <div style={{ width: 6, height: 6, borderRadius: "50%", background: TEAL, animation: "pulse 2s infinite" }} />
            <span style={{ fontSize: 12, color: TEAL, fontWeight: 500, letterSpacing: "1.5px", textTransform: "uppercase" as const }}>Бесплатно · Без карты</span>
          </div>

          <h2 style={{ fontFamily: SERIF, fontSize: "clamp(38px,5vw,64px)", fontWeight: 500, color: "#fff", margin: "0 0 24px", lineHeight: 1.08 }}>
            Узнайте потенциал вашего<br />салона прямо сейчас
          </h2>
          <p style={{ fontSize: "clamp(15px,1.6vw,18px)", color: "rgba(255,255,255,0.55)", lineHeight: 1.75, margin: "0 0 48px", fontWeight: 300 }}>
            Зарегистрируйтесь, добавьте салон и через 10 минут получите математически точную картину бизнеса — где теряете, где растёте и что делать первым.
          </p>

          <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" as const }}>
            <Link to="/cabinet" style={{
              display: "inline-flex", alignItems: "center", gap: 10,
              padding: "18px 36px", borderRadius: 2,
              background: `linear-gradient(135deg,${TEAL},${TEAL2})`,
              color: DARK, fontSize: 17, fontWeight: 700,
              textDecoration: "none",
              boxShadow: "0 12px 40px rgba(45,212,191,0.4)",
            }}>
              <Icon name="Zap" size={20} />
              Пройти диагностику бесплатно
            </Link>
          </div>

          <div style={{ marginTop: 32, display: "flex", justifyContent: "center", gap: 32, flexWrap: "wrap" as const }}>
            {[["Бесплатно","навсегда"], ["Без карты","и обязательств"], ["10 минут","до результата"]].map(([v, l], i) => (
              <div key={i} style={{ textAlign: "center" as const }}>
                <div style={{ fontSize: 14, color: "#fff", fontWeight: 600 }}>{v}</div>
                <div style={{ fontSize: 12, color: "rgba(255,255,255,0.35)", marginTop: 2 }}>{l}</div>
              </div>
            ))}
          </div>
        </div>

        <style>{`@keyframes pulse{0%,100%{opacity:1;}50%{opacity:0.4;}}`}</style>
      </section>

      <BizFooter />
    </>
  );
}
