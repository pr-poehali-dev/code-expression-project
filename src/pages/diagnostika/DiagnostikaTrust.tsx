import { Link } from "react-router-dom";
import Icon from "@/components/ui/icon";

const TEAL = "#2DD4BF";
const TEAL2 = "#14B8A6";
const DARK = "#0F172A";
const SERIF = "'Cormorant Garamond', serif";

const FEELINGS = [
  { icon: "ScanEye",     num: "01", title: "Ясность",      desc: "Полная картина бизнеса — без догадок и ощущения «что-то идёт не так»." },
  { icon: "Layers",      num: "02", title: "Понимание",    desc: "Знаете точно, что делать первым — и какой эффект это даст в рублях." },
  { icon: "Flame",       num: "03", title: "Энергия",      desc: "Азарт действовать, когда путь к росту становится конкретным и измеримым." },
  { icon: "ShieldCheck", num: "04", title: "Уверенность",  desc: "Решения принимаются на основе данных, а не интуиции." },
];

const SCORE_ITEMS = [
  { label: "Клиенты",   val: 81, color: "#2DD4BF" },
  { label: "Загрузка",  val: 64, color: "#f59e0b" },
  { label: "Продажи",   val: 72, color: "#2DD4BF" },
  { label: "Маркетинг", val: 58, color: "#ef4444" },
  { label: "Финансы",   val: 75, color: "#2DD4BF" },
];

export default function DiagnostikaTrust() {
  return (
    <>
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
    </>
  );
}
