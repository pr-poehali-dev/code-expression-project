import { useParams, Link } from "react-router-dom";
import { Helmet } from "@/lib/helmet";
import BizNavbar from "@/components/BizNavbar";
import BizFooter from "@/components/BizFooter";
import Icon from "@/components/ui/icon";

const TEAL = "#2DD4BF";
const DARK = "#0F172A";
const SERIF = "'Cormorant Garamond', serif";

const TOOL_NAMES: Record<string, string> = {
  "post-generator":     "Генератор постов",
  "reels-video":        "Сценарии и видео для Reels",
  "image-generation":   "Генерация изображений",
  "fitting-room":       "Примерочная",
  "landing-builder":    "Конструктор лендингов",
  "ad-campaigns":       "Создание рекламных кампаний",
  "seo-optimization":   "SEO-оптимизация сайта",
  "audience-analysis":  "Подбор ЦА и её анализ",
  "staff-analysis":     "Анализ персонала",
  "business-audit":     "Цифровой бизнес-разбор",
  "growth-diagnostics": "Диагностика роста салона",
  "scripts":            "Скрипты общения",
  "objection-handling": "Работа с возражениями",
  "repeat-booking":     "Повторная запись",
  "client-diagnostics": "Системная диагностика клиента",
  "cheat-sheets":       "Профессиональные шпаргалки",
  "recovery-programs":  "Программы восстановления",
  "development-tests":  "Тесты и диагностики развития",
};

export default function ToolLanding() {
  const { slug } = useParams<{ slug: string }>();
  const toolName = (slug && TOOL_NAMES[slug]) || "Инструмент платформы";

  return (
    <div style={{ fontFamily: "Inter, sans-serif", background: "#fff", minHeight: "100vh" }}>
      <Helmet>
        <title>{toolName} — скоро подробнее | Промт Диалог</title>
        <meta name="description" content={`Подробная страница об инструменте «${toolName}» скоро появится. А пока попробуйте его бесплатно в личном кабинете.`} />
        <meta name="robots" content="noindex" />
      </Helmet>
      <BizNavbar />

      <section style={{
        background: `radial-gradient(120% 100% at 80% 0%, #112B3C 0%, ${DARK} 55%, #060B16 100%)`,
        paddingTop: 76, minHeight: "70vh", display: "flex", alignItems: "center",
      }}>
        <div style={{ maxWidth: 720, margin: "0 auto", padding: "80px 32px", textAlign: "center" }}>
          <div style={{ width: 64, height: 64, borderRadius: 2, border: `1px solid ${TEAL}`, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 32px" }}>
            <Icon name="Sparkles" size={28} style={{ color: TEAL }} />
          </div>
          <div style={{ fontSize: 12, fontWeight: 600, color: TEAL, textTransform: "uppercase", letterSpacing: "2.5px", marginBottom: 16 }}>
            Страница в разработке
          </div>
          <h1 style={{ fontFamily: SERIF, fontSize: "clamp(32px,4.5vw,52px)", fontWeight: 500, color: "#fff", margin: "0 0 20px", letterSpacing: "-0.5px", lineHeight: 1.15 }}>
            {toolName}
          </h1>
          <p style={{ fontSize: 17, color: "rgba(255,255,255,0.6)", lineHeight: 1.7, margin: "0 0 40px", fontWeight: 300 }}>
            Подробная страница об этом инструменте скоро появится — с примерами результатов и разбором того, как он работает. А пока можно попробовать его прямо в личном кабинете бесплатно.
          </p>
          <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
            <Link to="/cabinet" style={{
              display: "inline-flex", alignItems: "center", gap: 10,
              padding: "16px 36px", borderRadius: 2, fontSize: 15, fontWeight: 600,
              background: "linear-gradient(135deg,#2DD4BF,#14B8A6)", color: "#0F172A",
              textDecoration: "none", transition: "all 0.3s",
            }}
              onMouseEnter={e => { const el = e.currentTarget as HTMLAnchorElement; el.style.transform = "translateY(-2px)"; el.style.boxShadow = "0 16px 40px rgba(45,212,191,0.3)"; }}
              onMouseLeave={e => { const el = e.currentTarget as HTMLAnchorElement; el.style.transform = "translateY(0)"; el.style.boxShadow = "none"; }}
            >
              Попробовать бесплатно
            </Link>
            <Link to="/vozmozhnosti" style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              padding: "16px 30px", borderRadius: 2, fontSize: 15, fontWeight: 600,
              border: "1px solid rgba(255,255,255,0.2)", color: "#fff",
              textDecoration: "none", transition: "all 0.2s",
            }}
              onMouseEnter={e => (e.currentTarget as HTMLAnchorElement).style.borderColor = "rgba(255,255,255,0.5)"}
              onMouseLeave={e => (e.currentTarget as HTMLAnchorElement).style.borderColor = "rgba(255,255,255,0.2)"}
            >
              <Icon name="ArrowLeft" size={15} /> Ко всем возможностям
            </Link>
          </div>
        </div>
      </section>

      <BizFooter />
    </div>
  );
}
