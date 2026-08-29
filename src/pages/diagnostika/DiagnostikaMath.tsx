import { Link } from "react-router-dom";
import Icon from "@/components/ui/icon";

const TEAL = "#2DD4BF";
const TEAL2 = "#14B8A6";
const DARK = "#0F172A";
const SERIF = "'Cormorant Garamond', serif";

const MATH_POINTS = [
  { icon: "Calculator", text: "Индекс загрузки расписания по времени и стоимости часа" },
  { icon: "TrendingUp", text: "LTV клиента с учётом частоты обращений и стоимости услуги" },
  { icon: "PieChart",   text: "Структура дохода: где сосредоточено 80% выручки" },
  { icon: "Activity",   text: "Прогноз оттока клиентов по сегментам (Чурн-рейт)" },
  { icon: "Percent",    text: "ROI каждого улучшения: сколько рублей принесёт каждый шаг" },
  { icon: "GitBranch",  text: "Сценарный анализ: три варианта развития на 3–6 месяцев" },
];

const WHAT_YOU_GET = [
  { icon: "TrendingUp",  title: "Прогноз роста дохода",           desc: "Математическая модель покажет конкретные цифры: на сколько вырастет доход при улучшении каждого показателя." },
  { icon: "Target",      title: "Точки роста без новых клиентов", desc: "Как увеличить доход на 20–40% за счёт текущей базы клиентов и загрузки расписания." },
  { icon: "BarChart3",   title: "Карта потенциала бизнеса",       desc: "Видите, какие направления недораскрыты и где сосредоточен основной резерв роста." },
  { icon: "Lightbulb",   title: "Конкретный план действий",       desc: "Пошаговые рекомендации под ваш бизнес или практику с расчётом экономического эффекта каждого шага." },
  { icon: "Activity",    title: "Сценарный прогноз",              desc: "Три варианта развития на 3–6 месяцев: консервативный, оптимальный и максимальный." },
  { icon: "Brain",       title: "ИИ-интерпретация",               desc: "ИИ объяснит паттерны и даст контекст — поверх математических расчётов, не вместо них." },
];

export default function DiagnostikaMath() {
  return (
    <>
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
    </>
  );
}
