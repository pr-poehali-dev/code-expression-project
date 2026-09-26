import { Link } from "react-router-dom";
import { Helmet } from "@/lib/helmet";
import BizNavbar from "@/components/BizNavbar";
import BizFooter from "@/components/BizFooter";
import Icon from "@/components/ui/icon";
import { TEAL, TEAL2, DARK, CTA_HREF } from "./dlya-psihologov/shared";
import DlyaPsihologovHero from "./dlya-psihologov/DlyaPsihologovHero";
import DlyaPsihologovProblem from "./dlya-psihologov/DlyaPsihologovProblem";
import DlyaPsihologovAnalysis from "./dlya-psihologov/DlyaPsihologovAnalysis";
import DlyaPsihologovFaq from "./dlya-psihologov/DlyaPsihologovFaq";

export default function DlyaPsihologov() {
  return (
    <div style={{ fontFamily: "Inter, sans-serif", background: "#fff" }}>
      <Helmet>
        <title>Промт Диалог для психологов — развитие частной практики и привлечение клиентов</title>
        <meta name="description" content="Бесплатная диагностика практики психолога. Анализ текущей ситуации, персональные шаги развития, работа с клиентами, маркетинг и инструменты для развития практики." />
        <meta name="keywords" content="развитие частной практики психолога, как психологу найти клиентов, привлечение клиентов психологу, продвижение психолога, как развивать практику психолога, маркетинг для психолога, развитие психологического центра" />
        <link rel="canonical" href="https://promtdialog.ru/dlya-psihologov" />
        <meta property="og:title" content="Промт Диалог для психологов — узнайте, что мешает вашей практике расти" />
        <meta property="og:description" content="Пройдите бесплатную диагностику практики и получите персональный план развития." />
        <meta property="og:url" content="https://promtdialog.ru/dlya-psihologov" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
      </Helmet>

      <BizNavbar />

      <DlyaPsihologovHero />
      <DlyaPsihologovProblem />
      <DlyaPsihologovAnalysis />
      <DlyaPsihologovFaq />

      <BizFooter />

      {/* ── ФИКСИРОВАННАЯ CTA-КНОПКА НА МОБИЛЬНЫХ ── */}
      <div className="psy-mobile-sticky-cta" style={{
        display: "none", position: "fixed", left: 0, right: 0, bottom: 0, zIndex: 150,
        padding: "12px 16px calc(12px + env(safe-area-inset-bottom,0px))",
        background: "rgba(8,14,28,0.96)", backdropFilter: "blur(12px)",
        borderTop: "1px solid rgba(45,212,191,0.15)",
      }}>
        <Link to={CTA_HREF} style={{
          display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
          width: "100%", padding: "14px", borderRadius: 10, fontSize: 14, fontWeight: 700,
          background: `linear-gradient(135deg,${TEAL},${TEAL2})`, color: DARK,
          textDecoration: "none", fontFamily: "Inter, sans-serif",
        }}>
          <Icon name="Compass" size={16} />
          Пройти диагностику
        </Link>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .psy-hero-grid { grid-template-columns: 1fr !important; }
          .psy-hero-img { margin-top: 32px; order: -1; }
          .psy-pains-grid { grid-template-columns: 1fr !important; }
          .psy-analysis-grid { grid-template-columns: 1fr 1fr !important; }
          .psy-audience-grid { grid-template-columns: 1fr 1fr !important; }
          .psy-example-grid { grid-template-columns: 1fr !important; }
          .psy-mobile-sticky-cta { display: block !important; }
          body { padding-bottom: 0; }
        }
        @media (max-width: 520px) {
          .psy-analysis-grid { grid-template-columns: 1fr !important; }
          .psy-audience-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
