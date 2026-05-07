import { Helmet } from "react-helmet-async";
import DokNavbar from "@/components/DokNavbar";
import DokFooter from "@/components/DokFooter";
import { BG } from "./course-potok/CptShared";
import CptHeroSection from "./course-potok/CptHeroSection";
import CptProgramSection from "./course-potok/CptProgramSection";
import CptPricingSection from "./course-potok/CptPricingSection";
import CptVideoReviews from "./course-potok/CptVideoReviews";

export default function CoursePotok() {
  return (
    <div style={{ background: BG, minHeight: "100vh", fontFamily: "Montserrat, sans-serif", color: "#1a1a1a" }}>
      <Helmet>
        <title>Массажист с потоком клиентов: от 0 до стабильной записи | Dok Диалог</title>
        <meta name="description" content="Система привлечения и удержания клиентов для массажиста. 5 модулей: каналы привлечения, система записи, скрипты общения, лояльность. Первые результаты за 2–4 недели." />
        <meta name="keywords" content="привлечение клиентов массажист, продвижение массажиста, маркетинг для массажиста, как найти клиентов массаж, запись клиентов массаж" />
        <meta property="og:title" content="Массажист с потоком клиентов: от 0 до стабильной записи" />
        <meta property="og:description" content="Система привлечения и удержания клиентов. 5 модулей: каналы, запись, скрипты, лояльность. Первые результаты за 2–4 недели." />
        <meta property="og:type" content="website" />
      </Helmet>
      <DokNavbar />

      <CptHeroSection />
      <CptProgramSection />
      <CptVideoReviews />
      <CptPricingSection />

      <DokFooter />

      <style>{`
        .cpt-hero-grid { grid-template-columns: 1fr 1fr; }
        .cpt-3col { grid-template-columns: repeat(3, 1fr); }
        .cpt-2col { grid-template-columns: repeat(2, 1fr); }
        .cpt-4col { grid-template-columns: repeat(4, 1fr); }
        .cpt-5col { grid-template-columns: repeat(5, 1fr); }
        .cpt-result-pad { padding: 48px; }
        .cpt-solution-pad { padding: 44px 48px; }
        .cpt-price-pad { padding: 48px 40px; }
        .cpt-ctabar { max-width: 1100px; margin: 0 auto; padding: 28px 24px; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 16px; }
        @media (max-width: 900px) {
          .cpt-hero-grid { grid-template-columns: 1fr !important; }
          .cpt-3col { grid-template-columns: repeat(2, 1fr) !important; }
          .cpt-4col { grid-template-columns: repeat(2, 1fr) !important; }
          .cpt-5col { grid-template-columns: repeat(3, 1fr) !important; }
        }
        @media (max-width: 600px) {
          .cpt-2col { grid-template-columns: 1fr !important; }
          .cpt-3col { grid-template-columns: 1fr !important; }
          .cpt-4col { grid-template-columns: 1fr !important; }
          .cpt-5col { grid-template-columns: repeat(2, 1fr) !important; }
          .cpt-result-pad { padding: 28px 20px !important; }
          .cpt-solution-pad { padding: 28px 20px !important; }
          .cpt-price-pad { padding: 36px 24px !important; }
          .cpt-ctabar { flex-direction: column; align-items: flex-start; }
          .cpt-ctabar a { width: 100%; text-align: center; box-sizing: border-box; }
          .cpt-hero-btn { width: 100%; text-align: center; box-sizing: border-box; }
        }
      `}</style>
    </div>
  );
}