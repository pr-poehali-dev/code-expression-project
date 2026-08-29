import { Link } from "react-router-dom";
import Icon from "@/components/ui/icon";

const TEAL = "#2DD4BF";
const TEAL2 = "#14B8A6";
const DARK = "#0F172A";
const SERIF = "'Cormorant Garamond', serif";

const CYCLE_STEPS = [
  { icon: "Target",      title: "Цель",         desc: "Указываете, куда хотите прийти — конкретную цифру и срок." },
  { icon: "ScanEye",     title: "Диагностика",  desc: "ИИ анализирует показатели бизнеса или практики и находит разрывы." },
  { icon: "ListChecks",  title: "План",         desc: "Формируется точный маршрут действий к вашей цели." },
  { icon: "Zap",         title: "Действие",     desc: "Выполняете шаги сами или доверяете AI-инструментам." },
  { icon: "BarChart2",   title: "Результат",    desc: "Фиксируете, что реально изменилось в цифрах." },
  { icon: "RefreshCw",   title: "Корректировка",desc: "ИИ пересчитывает план с учётом нового результата." },
];

export default function DiagnostikaHero() {
  return (
    <>
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
    </>
  );
}
