import { Helmet } from "react-helmet-async";
import DokNavbar from "@/components/DokNavbar";
import DokFooter from "@/components/DokFooter";
import CourseQuiz from "./catalog-private/CourseQuiz";
import Icon from "@/components/ui/icon";

const ACCENT = "hsl(185, 85%, 32%)";
const ACCENT_LIGHT = "hsla(185, 85%, 32%, 0.08)";
const BG = "#f8f8f6";

const FEELINGS = [
  { icon: "Compass", title: "Ясность пути", text: "Вы точно знаете, с чего начать — и не тратите время на поиск" },
  { icon: "Zap", title: "Уверенный старт", text: "Первый шаг в профессии сделан осознанно, а не наугад" },
  { icon: "TrendingUp", title: "Ощущение роста", text: "Уже после первого занятия вы чувствуете, что движетесь вперёд" },
  { icon: "Heart", title: "Спокойствие", text: "Нет тревоги «а вдруг не то выбрал» — выбор подкреплён логикой" },
];

export default function QuizLanding() {
  return (
    <div style={{ background: BG, minHeight: "100vh", fontFamily: "Montserrat, sans-serif", color: "#1a1a1a" }}>
      <Helmet>
        <title>Какой курс выбрать? Пройди квиз и получи персональную рекомендацию | Dok Диалог</title>
        <meta name="description" content="Не знаешь, с чего начать? Пройди короткий квиз — 2 минуты — и получи персональный подбор курса под твой уровень, цели и формат обучения. Старт в профессии без лишних сомнений." />
        <meta name="keywords" content="какой курс массажа выбрать, подбор курса онлайн, с чего начать обучение массажу, квиз выбор курса, рекомендация курса массажист, обучение восстановительным техникам" />
        <meta property="og:title" content="Какой курс выбрать? Пройди квиз и получи персональную рекомендацию" />
        <meta property="og:description" content="2 минуты — и ты знаешь, какой курс подойдёт именно тебе. Без сомнений, без лишних поисков." />
        <meta property="og:type" content="website" />
      </Helmet>

      <DokNavbar />

      {/* ── HERO ── */}
      <section style={{ padding: "80px 0 60px", textAlign: "center" }}>
        <div style={{ maxWidth: 760, margin: "0 auto", padding: "0 24px" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: ACCENT_LIGHT, border: `1px solid ${ACCENT}30`, borderRadius: 20, padding: "6px 16px", marginBottom: 28 }}>
            <Icon name="Sparkles" size={14} style={{ color: ACCENT }} />
            <span style={{ fontSize: 12, fontWeight: 700, color: ACCENT, textTransform: "uppercase", letterSpacing: 0.8 }}>Персональный подбор</span>
          </div>
          <h1 style={{ fontFamily: "Cormorant, serif", fontSize: "clamp(34px, 5vw, 58px)", fontWeight: 700, margin: "0 0 20px", color: "#1a1a1a", lineHeight: 1.15 }}>
            Какой курс массажа<br />и восстановительных техник<br />подойдёт вам?
          </h1>
          <p style={{ fontSize: "clamp(15px, 2vw, 18px)", color: "#555", lineHeight: 1.75, margin: "0 0 16px", maxWidth: 580, marginLeft: "auto", marginRight: "auto" }}>
            Не нужно часами изучать описания и гадать. Пройдите короткий квиз — и получите персональную рекомендацию курса, который подойдёт именно вам: под ваш уровень, цели и темп жизни.
          </p>
          <p style={{ fontSize: 14, color: "#aaa", margin: 0 }}>Займёт около 2 минут · Без обязательств · Результат сразу</p>
        </div>
      </section>

      {/* ── ЧТО ВЫ ПОЧУВСТВУЕТЕ ── */}
      <section style={{ padding: "0 0 70px" }}>
        <div style={{ maxWidth: 900, margin: "0 auto", padding: "0 24px" }}>
          <h2 style={{ fontFamily: "Cormorant, serif", fontSize: "clamp(22px, 3vw, 32px)", fontWeight: 700, textAlign: "center", margin: "0 0 36px", color: "#1a1a1a" }}>
            Когда выбор сделан осознанно — всё становится проще
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 16 }} className="quiz-feelings-grid">
            {FEELINGS.map(({ icon, title, text }) => (
              <div key={title} style={{ background: "#fff", border: "1px solid #e8e8e4", borderRadius: 18, padding: "24px", display: "flex", gap: 16, alignItems: "flex-start", boxShadow: "0 2px 12px rgba(0,0,0,0.04)" }}>
                <div style={{ width: 44, height: 44, borderRadius: 12, background: ACCENT_LIGHT, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <Icon name={icon} size={20} style={{ color: ACCENT }} />
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 15, color: "#1a1a1a", marginBottom: 6 }}>{title}</div>
                  <div style={{ fontSize: 13.5, color: "#666", lineHeight: 1.65 }}>{text}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── ЧТО БУДЕТ ПОСЛЕ КВИЗА ── */}
      <section style={{ padding: "0 0 40px" }}>
        <div style={{ maxWidth: 860, margin: "0 auto", padding: "0 24px" }}>
          <div style={{ background: "#fff", border: "1px solid #e8e8e4", borderRadius: 24, padding: "36px 40px", boxShadow: "0 4px 24px rgba(0,0,0,0.05)" }} className="quiz-promise-wrap">
            <div style={{ textAlign: "center", marginBottom: 32 }}>
              <div style={{ width: 48, height: 3, background: ACCENT, borderRadius: 2, margin: "0 auto 20px" }} />
              <p style={{ fontSize: 16, color: "#444", lineHeight: 1.75, margin: 0, maxWidth: 560, marginLeft: "auto", marginRight: "auto" }}>
                Вы уже на правильном пути — вы здесь. Осталось ответить на несколько вопросов, и мы подберём то, что даст результат быстрее всего.
              </p>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }} className="quiz-promise-grid">
              <div style={{ background: ACCENT_LIGHT, borderRadius: 16, padding: "20px", textAlign: "center" }}>
                <div style={{ width: 40, height: 40, borderRadius: 12, background: "#fff", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 12px", boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
                  <Icon name="MonitorSmartphone" size={18} style={{ color: ACCENT }} />
                </div>
                <div style={{ fontWeight: 700, fontSize: 14, color: "#1a1a1a", marginBottom: 6 }}>Результат на странице</div>
                <div style={{ fontSize: 13, color: "#666", lineHeight: 1.6 }}>Сразу после ответов — персональная рекомендация прямо здесь</div>
              </div>
              <div style={{ background: ACCENT_LIGHT, borderRadius: 16, padding: "20px", textAlign: "center" }}>
                <div style={{ width: 40, height: 40, borderRadius: 12, background: "#fff", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 12px", boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
                  <Icon name="Mail" size={18} style={{ color: ACCENT }} />
                </div>
                <div style={{ fontWeight: 700, fontSize: 14, color: "#1a1a1a", marginBottom: 6 }}>Копия на почту</div>
                <div style={{ fontSize: 13, color: "#666", lineHeight: 1.6 }}>Результат продублируется на ваш email — чтобы вернуться в любой момент</div>
              </div>
              <div style={{ background: ACCENT_LIGHT, borderRadius: 16, padding: "20px", textAlign: "center" }}>
                <div style={{ width: 40, height: 40, borderRadius: 12, background: "#fff", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 12px", boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
                  <Icon name="Gift" size={18} style={{ color: ACCENT }} />
                </div>
                <div style={{ fontWeight: 700, fontSize: 14, color: "#1a1a1a", marginBottom: 6 }}>Приятный бонус</div>
                <div style={{ fontSize: 13, color: "#666", lineHeight: 1.6 }}>Для тех, кто пройдёт квиз — небольшой подарок от нас в результатах</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── КВИЗ ── */}
      <section style={{ padding: "40px 0 80px" }}>
        <CourseQuiz />
      </section>

      <style>{`
        @media (max-width: 600px) {
          .quiz-feelings-grid { grid-template-columns: 1fr !important; }
          .quiz-promise-grid { grid-template-columns: 1fr !important; }
          .quiz-promise-wrap { padding: 24px 20px !important; }
        }
      `}</style>

      <DokFooter />
    </div>
  );
}