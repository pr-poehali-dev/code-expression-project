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
      <section style={{ padding: "72px 0 60px" }} className="quiz-hero-section">
        <div style={{ maxWidth: 1060, margin: "0 auto", padding: "0 24px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 420px", gap: 48, alignItems: "center" }} className="quiz-hero-grid">
            {/* Текст */}
            <div>
              <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: ACCENT_LIGHT, border: `1px solid ${ACCENT}30`, borderRadius: 20, padding: "6px 16px", marginBottom: 24 }}>
                <Icon name="Sparkles" size={14} style={{ color: ACCENT }} />
                <span style={{ fontSize: 12, fontWeight: 700, color: ACCENT, textTransform: "uppercase", letterSpacing: 0.8 }}>Подбор обучения</span>
              </div>
              <h1 style={{ fontFamily: "Cormorant, serif", fontSize: "clamp(32px, 4vw, 54px)", fontWeight: 700, margin: "0 0 20px", color: "#1a1a1a", lineHeight: 1.15 }}>
                Какое обучение массажу и восстановительным техникам подойдёт именно вам?
              </h1>
              <p style={{ fontSize: "clamp(15px, 1.6vw, 17px)", color: "#555", lineHeight: 1.8, margin: "0 0 24px" }}>
                Ответьте на несколько вопросов — алгоритм подберёт подходящую программу обучения под ваш уровень, цели и удобный формат. Никакого перебора курсов вручную.
              </p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
                {[
                  { icon: "Clock", text: "Около 2 минут" },
                  { icon: "ShieldCheck", text: "Без обязательств" },
                  { icon: "MonitorSmartphone", text: "Результат сразу" },
                ].map(({ icon, text }) => (
                  <div key={text} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, color: "#666", background: "#fff", border: "1px solid #e8e8e4", borderRadius: 20, padding: "6px 14px" }}>
                    <Icon name={icon} size={13} style={{ color: ACCENT }} />
                    {text}
                  </div>
                ))}
              </div>
            </div>

            {/* Фото с превью */}
            <div style={{ position: "relative" }}>
              <div style={{ borderRadius: 24, overflow: "hidden", boxShadow: "0 20px 60px rgba(0,0,0,0.15)" }}>
                <img
                  src="https://cdn.poehali.dev/projects/10f61e56-9821-40f3-b705-3590ddaffd08/files/475f0192-c14e-47c5-b22b-ecdaaaa0217d.jpg"
                  alt="Обучение массажу"
                  style={{ width: "100%", height: 440, objectFit: "cover", display: "block" }}
                  className="quiz-hero-img"
                />
              </div>
              {/* Превью-плашка сверху */}
              <div style={{
                position: "absolute", top: 20, left: -24,
                background: "#fff", borderRadius: 16, padding: "14px 18px",
                boxShadow: "0 8px 30px rgba(0,0,0,0.12)",
                display: "flex", alignItems: "center", gap: 12, minWidth: 200,
              }}>
                <div style={{ width: 40, height: 40, borderRadius: 12, background: ACCENT_LIGHT, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <Icon name="GraduationCap" size={18} style={{ color: ACCENT }} />
                </div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: "#1a1a1a" }}>7+ программ обучения</div>
                  <div style={{ fontSize: 11.5, color: "#999" }}>онлайн и офлайн в Москве</div>
                </div>
              </div>
              {/* Превью-плашка снизу */}
              <div style={{
                position: "absolute", bottom: 24, right: -20,
                background: "#fff", borderRadius: 16, padding: "14px 18px",
                boxShadow: "0 8px 30px rgba(0,0,0,0.12)",
                display: "flex", alignItems: "center", gap: 12, minWidth: 190,
              }}>
                <div style={{ width: 40, height: 40, borderRadius: 12, background: "#fff7ed", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <Icon name="Star" size={18} style={{ color: "#f59e0b" }} />
                </div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: "#1a1a1a" }}>Рейтинг 5.0</div>
                  <div style={{ fontSize: 11.5, color: "#999" }}>Dok Диалог</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── ЧТО ВЫ ПОЧУВСТВУЕТЕ ── */}
      <section style={{ padding: "0 0 70px" }} className="quiz-feelings-section">
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
      <section style={{ padding: "40px 0 80px" }} className="quiz-section">
        <CourseQuiz />
      </section>

      <style>{`
        @media (max-width: 860px) {
          .quiz-hero-grid { grid-template-columns: 1fr !important; }
          .quiz-hero-grid > div:last-child { display: none !important; }
        }
        @media (max-width: 768px) {
          .quiz-promise-grid { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 600px) {
          .quiz-feelings-grid { grid-template-columns: 1fr !important; }
          .quiz-promise-wrap { padding: 20px 16px !important; }
          .quiz-hero-section { padding: 40px 0 32px !important; }
          .quiz-feelings-section { padding: 0 0 40px !important; }
          .quiz-section { padding: 24px 0 56px !important; }
        }
      `}</style>

      <DokFooter />
    </div>
  );
}