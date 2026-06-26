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
  { icon: "TrendingUp",  title: "Прогноз роста выручки",         desc: "Математическая модель покажет конкретные цифры: на сколько вырастет выручка при улучшении каждого показателя." },
  { icon: "Target",      title: "Точки роста без новых клиентов", desc: "Как увеличить доход на 20–40% за счёт текущей базы и загрузки мастеров." },
  { icon: "BarChart3",   title: "Карта потенциала салона",        desc: "Видите, какие направления недораскрыты и где сосредоточен основной резерв роста." },
  { icon: "Lightbulb",   title: "Конкретный план действий",       desc: "Пошаговые рекомендации под ваш салон с расчётом экономического эффекта каждого шага." },
  { icon: "Activity",    title: "Сценарный прогноз",              desc: "Три варианта развития на 3–6 месяцев: консервативный, оптимальный и максимальный." },
  { icon: "Brain",       title: "ИИ-интерпретация",               desc: "ИИ объяснит паттерны и даст контекст — поверх математических расчётов, не вместо них." },
];

const FEELINGS = [
  { emoji: "😌", title: "Ясность",      desc: "Полная картина бизнеса — без догадок и ощущения «что-то идёт не так»." },
  { emoji: "💡", title: "Понимание",    desc: "Знаете точно, что делать первым — и какой эффект это даст в рублях." },
  { emoji: "🔥", title: "Энергия",      desc: "Азарт действовать, когда путь к росту становится конкретным и измеримым." },
  { emoji: "🏆", title: "Уверенность",  desc: "Решения принимаются на основе данных, а не интуиции." },
];

const STEPS = [
  { num: "01", title: "Регистрация",        desc: "Аккаунт за 1 минуту. Без карты — сразу 100 энергий в подарок.",                                     icon: "UserPlus"   },
  { num: "02", title: "Добавьте салон",     desc: "Название, количество мастеров, средний чек. Займёт 3 минуты.",                                        icon: "Building2"  },
  { num: "03", title: "Запустите аудит",    desc: "Откройте «Диагностику роста PRO» и ответьте на 8–12 вопросов о бизнесе.",                            icon: "PlayCircle" },
  { num: "04", title: "Получите результат", desc: "Графики, прогнозы, точки роста и план действий — готово через несколько минут.",                     icon: "BarChart2"  },
];

const MATH_POINTS = [
  { icon: "Calculator", text: "Индекс загрузки мастеров по часовым ставкам и проходимости" },
  { icon: "TrendingUp", text: "LTV клиента с учётом частоты визитов и среднего чека" },
  { icon: "PieChart",   text: "Структура выручки: где сосредоточено 80% дохода" },
  { icon: "Activity",   text: "Прогноз оттока клиентов по сегментам (Чурн-рейт)" },
  { icon: "Percent",    text: "ROI каждого улучшения: сколько рублей принесёт каждый шаг" },
  { icon: "GitBranch",  text: "Сценарный анализ: три варианта развития на 3–6 месяцев" },
];

export default function Diagnostika() {
  return (
    <>
      <Helmet>
        <title>Диагностика роста салона PRO — раскройте потенциал за 10 минут | Про Диалог</title>
        <meta name="description" content="Бесплатная диагностика салона красоты: математические алгоритмы покажут потенциал роста выручки и загрузки мастеров. Результат за 10 минут." />
      </Helmet>

      <BizNavbar />

      {/* ── HERO ─────────────────────────────────────────────────────────────── */}
      <section style={{
        background: `radial-gradient(120% 100% at 80% 0%, #112B3C 0%, ${DARK} 55%, #060B16 100%)`,
        minHeight: "100vh", display: "flex", alignItems: "center",
        paddingTop: 76, position: "relative", overflow: "hidden",
      }}>
        <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(255,255,255,0.025) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.025) 1px,transparent 1px)", backgroundSize: "52px 52px", pointerEvents: "none" }} />
        <div style={{ position: "absolute", top: "20%", right: "8%", width: 520, height: 520, borderRadius: "50%", background: `radial-gradient(circle,rgba(45,212,191,0.10) 0%,transparent 65%)`, pointerEvents: "none" }} />

        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "100px 32px", width: "100%" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 64, alignItems: "center" }} className="hero-diag-grid">

            <div>
              <div style={{ display: "inline-flex", alignItems: "center", gap: 10, border: "1px solid rgba(45,212,191,0.3)", borderRadius: 100, padding: "7px 18px", marginBottom: 36 }}>
                <div style={{ width: 6, height: 6, borderRadius: "50%", background: TEAL }} />
                <span style={{ fontSize: 12, color: TEAL, fontWeight: 500, letterSpacing: "1.5px", textTransform: "uppercase" as const }}>Бесплатный аудит · 10 минут</span>
              </div>

              <h1 style={{ fontFamily: SERIF, fontSize: "clamp(44px,5.5vw,72px)", fontWeight: 500, color: "#fff", lineHeight: 1.06, margin: "0 0 28px", letterSpacing: "-0.5px" }}>
                Раскройте полный<br />
                <span style={{ color: TEAL }}>потенциал</span> вашего<br />
                салона за 10 минут
              </h1>

              <p style={{ fontSize: "clamp(15px,1.6vw,18px)", color: "rgba(255,255,255,0.62)", lineHeight: 1.75, margin: "0 0 12px", fontWeight: 300, maxWidth: 500 }}>
                Бесплатная диагностика на основе <strong style={{ color: "#fff", fontWeight: 600 }}>математических формул и экономических алгоритмов</strong> — результат по вашим данным, а не общие советы.
              </p>
              <p style={{ fontSize: 14, color: "rgba(255,255,255,0.38)", lineHeight: 1.7, margin: "0 0 40px", fontWeight: 300 }}>
                ИИ даёт только интерпретацию — все выводы считаются по формулам.
              </p>

              <div style={{ display: "flex", gap: 14, flexWrap: "wrap" as const, marginBottom: 48 }}>
                <Link to="/cabinet" style={{
                  display: "inline-flex", alignItems: "center", gap: 10,
                  padding: "16px 32px", borderRadius: 2,
                  background: `linear-gradient(135deg,${TEAL},${TEAL2})`,
                  color: DARK, fontSize: 16, fontWeight: 700,
                  textDecoration: "none", boxShadow: "0 8px 32px rgba(45,212,191,0.35)",
                }}>
                  <Icon name="Zap" size={18} />
                  Пройти диагностику бесплатно
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
                {[["10 мин","время прохождения"],["100 ⚡","энергий в подарок"],["0 ₽","полностью бесплатно"]].map(([v, l], i) => (
                  <div key={i}>
                    <div style={{ fontFamily: SERIF, fontSize: 30, fontWeight: 600, color: "#fff", lineHeight: 1 }}>{v}</div>
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
                  <span style={{ fontSize: 12, color: "rgba(255,255,255,0.35)", marginLeft: 8 }}>Диагностика роста · Про Диалог</span>
                </div>
                <div style={{ padding: 24 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 }}>
                    <div>
                      <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", textTransform: "uppercase" as const, letterSpacing: "1px", marginBottom: 6 }}>Потенциал роста</div>
                      <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
                        <span style={{ fontFamily: SERIF, fontSize: 48, fontWeight: 600, color: TEAL, lineHeight: 1 }}>+34%</span>
                        <span style={{ fontSize: 14, color: "rgba(255,255,255,0.3)" }}>к выручке</span>
                      </div>
                      <div style={{ fontSize: 12, color: TEAL, marginTop: 4 }}>за 3 месяца</div>
                    </div>
                    <div style={{ textAlign: "right" as const }}>
                      <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", marginBottom: 4 }}>Индекс здоровья</div>
                      <div style={{ fontFamily: SERIF, fontSize: 28, color: "#f59e0b", fontWeight: 600 }}>62<span style={{ fontSize: 16, color: "rgba(255,255,255,0.3)" }}>/100</span></div>
                      <div style={{ fontSize: 11, color: "#f59e0b" }}>Есть резервы</div>
                    </div>
                  </div>
                  {[
                    { label: "Загрузка мастеров", val: 58, color: "#f59e0b", tag: "Резерв" },
                    { label: "Возврат клиентов",  val: 44, color: "#ef4444", tag: "Низко"  },
                    { label: "Средний чек",        val: 71, color: TEAL,      tag: "Норма"  },
                    { label: "Маркетинговый охват",val: 36, color: "#ef4444", tag: "Низко"  },
                  ].map(({ label, val, color, tag }) => (
                    <div key={label} style={{ marginBottom: 14 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                        <span style={{ fontSize: 12, color: "rgba(255,255,255,0.6)" }}>{label}</span>
                        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                          <span style={{ fontSize: 11, color, fontWeight: 600 }}>{tag}</span>
                          <span style={{ fontSize: 12, color: "rgba(255,255,255,0.5)" }}>{val}%</span>
                        </div>
                      </div>
                      <div style={{ height: 5, background: "rgba(255,255,255,0.08)", borderRadius: 10 }}>
                        <div style={{ height: "100%", width: `${val}%`, background: color, borderRadius: 10 }} />
                      </div>
                    </div>
                  ))}
                  <div style={{ marginTop: 20, padding: "14px 16px", background: "rgba(45,212,191,0.07)", border: "1px solid rgba(45,212,191,0.18)", borderRadius: 10 }}>
                    <div style={{ fontSize: 11, color: TEAL, fontWeight: 600, textTransform: "uppercase" as const, letterSpacing: "1px", marginBottom: 6 }}>Приоритет №1</div>
                    <div style={{ fontSize: 13, color: "rgba(255,255,255,0.8)", lineHeight: 1.5 }}>
                      Загрузить «мёртвые» часы вт–ср 11:00–14:00 → <strong style={{ color: TEAL }}>+18% к выручке</strong> без доп. затрат
                    </div>
                  </div>
                </div>
              </div>
              <div style={{ position: "absolute", top: -16, right: -16, background: TEAL, borderRadius: 12, padding: "10px 16px", boxShadow: "0 8px 24px rgba(45,212,191,0.4)", display: "flex", alignItems: "center", gap: 8 }}>
                <Icon name="Gift" size={16} style={{ color: DARK }} />
                <span style={{ fontSize: 13, fontWeight: 700, color: DARK }}>100 ⚡ в подарок</span>
              </div>
            </div>
          </div>
        </div>
        <style>{`@media(max-width:900px){.hero-diag-grid{grid-template-columns:1fr!important;}}`}</style>
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
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 1, background: "rgba(255,255,255,0.07)", borderRadius: 4, overflow: "hidden" }} className="feelings-grid">
            {FEELINGS.map(({ emoji, title, desc }, i) => (
              <div key={i} style={{ padding: "36px 24px", background: "rgba(255,255,255,0.02)" }}>
                <div style={{ fontSize: 40, marginBottom: 16, lineHeight: 1 }}>{emoji}</div>
                <div style={{ fontFamily: SERIF, fontSize: 22, fontWeight: 600, color: "#fff", marginBottom: 10 }}>{title}</div>
                <div style={{ fontSize: 13, color: "rgba(255,255,255,0.45)", lineHeight: 1.65 }}>{desc}</div>
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

      {/* ── 100 ЭНЕРГИЙ ──────────────────────────────────────────────────── */}
      <section style={{ background: "#F8FAFC", padding: "72px 32px" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <div style={{ background: `linear-gradient(135deg,${DARK},#112B3C)`, borderRadius: 6, padding: "48px 40px", display: "flex", alignItems: "center", gap: 40, position: "relative", overflow: "hidden" }} className="gift-block">
            <div style={{ position: "absolute", right: -60, top: -60, width: 280, height: 280, background: `radial-gradient(circle,rgba(45,212,191,0.12) 0%,transparent 65%)`, pointerEvents: "none" }} />
            <div style={{ width: 80, height: 80, borderRadius: 20, background: `linear-gradient(135deg,${TEAL},${TEAL2})`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, boxShadow: "0 12px 32px rgba(45,212,191,0.3)" }}>
              <Icon name="Gift" size={36} style={{ color: DARK }} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 11, color: TEAL, fontWeight: 600, textTransform: "uppercase" as const, letterSpacing: "2px", marginBottom: 8 }}>Бонус при регистрации</div>
              <h3 style={{ fontFamily: SERIF, fontSize: "clamp(22px,2.5vw,32px)", fontWeight: 500, color: "#fff", margin: "0 0 8px", lineHeight: 1.2 }}>100 энергий — бесплатно</h3>
              <p style={{ fontSize: 14, color: "rgba(255,255,255,0.5)", lineHeight: 1.65, margin: 0, maxWidth: 520 }}>
                После диагностики останутся энергии на другие инструменты: скрипты для администратора, ответы на отзывы, контент для соцсетей и многое другое.
              </p>
            </div>
            <Link to="/cabinet" style={{
              display: "inline-flex", alignItems: "center", gap: 10,
              padding: "14px 24px", borderRadius: 2,
              background: `linear-gradient(135deg,${TEAL},${TEAL2})`,
              color: DARK, fontSize: 15, fontWeight: 700,
              textDecoration: "none", flexShrink: 0,
              boxShadow: "0 8px 24px rgba(45,212,191,0.3)",
              whiteSpace: "nowrap" as const,
            }}>
              Получить 100 ⚡ <Icon name="ArrowRight" size={16} />
            </Link>
          </div>
        </div>
        <style>{`@media(max-width:800px){.gift-block{flex-direction:column!important;padding:32px 24px!important;}}`}</style>
      </section>

      {/* ── ФИНАЛЬНЫЙ CTA ──────────────────────────────────────────────────── */}
      <section style={{ background: DARK, padding: "120px 32px", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(255,255,255,0.015) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.015) 1px,transparent 1px)", backgroundSize: "52px 52px", pointerEvents: "none" }} />
        <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: 600, height: 350, background: `radial-gradient(ellipse,rgba(45,212,191,0.08) 0%,transparent 65%)`, pointerEvents: "none" }} />
        <div style={{ maxWidth: 1280, margin: "0 auto", position: "relative" }}>
          <div style={{ maxWidth: 680 }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 8, border: "1px solid rgba(45,212,191,0.25)", borderRadius: 100, padding: "7px 20px", marginBottom: 36 }}>
              <div style={{ width: 6, height: 6, borderRadius: "50%", background: TEAL }} />
              <span style={{ fontSize: 12, color: TEAL, fontWeight: 500, letterSpacing: "1.5px", textTransform: "uppercase" as const }}>Бесплатно · Без карты</span>
            </div>
            <h2 style={{ fontFamily: SERIF, fontSize: "clamp(38px,5vw,64px)", fontWeight: 500, color: "#fff", margin: "0 0 20px", lineHeight: 1.08 }}>
              Узнайте потенциал<br />вашего салона сейчас
            </h2>
            <p style={{ fontSize: "clamp(15px,1.5vw,17px)", color: "rgba(255,255,255,0.5)", lineHeight: 1.75, margin: "0 0 40px", fontWeight: 300 }}>
              Зарегистрируйтесь, добавьте салон — и через 10 минут получите математически точную картину: где потенциал роста и что делать первым.
            </p>
            <div style={{ display: "flex", gap: 14, flexWrap: "wrap" as const, marginBottom: 40 }}>
              <Link to="/cabinet" style={{
                display: "inline-flex", alignItems: "center", gap: 10,
                padding: "18px 36px", borderRadius: 2,
                background: `linear-gradient(135deg,${TEAL},${TEAL2})`,
                color: DARK, fontSize: 17, fontWeight: 700,
                textDecoration: "none", boxShadow: "0 12px 40px rgba(45,212,191,0.4)",
              }}>
                <Icon name="Zap" size={20} />
                Пройти диагностику бесплатно
              </Link>
            </div>
            <div style={{ display: "flex", gap: 32, flexWrap: "wrap" as const }}>
              {[["Бесплатно","навсегда"],["Без карты","и обязательств"],["10 минут","до результата"]].map(([v, l], i) => (
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
