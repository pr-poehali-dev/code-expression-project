import { Helmet } from "react-helmet-async";
import DokNavbar from "@/components/DokNavbar";
import DokFooter from "@/components/DokFooter";
import { BG, CtaBar } from "./course-antistress/CasShared";
import CasHeroSection from "./course-antistress/CasHeroSection";
import CasProgramSection from "./course-antistress/CasProgramSection";
import CasPricingSection from "./course-antistress/CasPricingSection";

export default function CourseAntistress() {
  return (
    <div style={{ background: BG, minHeight: "100vh", fontFamily: "Montserrat, sans-serif", color: "#1a1a1a" }}>
      <Helmet>
        <title>Антистресс-техники массажа: усиление эффекта в 2 раза | Dok Диалог</title>
        <meta name="description" content="Техники работы с нервной системой для максимального эффекта массажа. Быстрый результат с первого сеанса, повышение лояльности клиентов. Подходит любому уровню." />
        <meta name="keywords" content="антистресс массаж курс, техники расслабления массаж, массаж нервная система, расслабляющий массаж техники, обучение антистресс массаж" />
        <meta property="og:title" content="Антистресс-техники массажа: усиление эффекта в 2 раза" />
        <meta property="og:description" content="Техники работы с нервной системой для максимального эффекта. Быстрый результат, лояльность клиентов." />
        <meta property="og:type" content="website" />
      </Helmet>
      <DokNavbar />

      <CasHeroSection />

      <CtaBar />

      <CasProgramSection />

      <CtaBar />

      <CasPricingSection />

      <DokFooter />

      <style>{`
        .cas-hero-grid { grid-template-columns: 1fr 1fr; }
        .cas-3col { grid-template-columns: repeat(3, 1fr); }
        .cas-2col { grid-template-columns: repeat(2, 1fr); }
        .cas-5col { grid-template-columns: repeat(5, 1fr); }
        .cas-result-pad { padding: 48px; }
        .cas-solution-pad { padding: 44px 48px; }
        .cas-price-pad { padding: 48px 40px; }
        @media (max-width: 900px) {
          .cas-hero-grid { grid-template-columns: 1fr !important; }
          .cas-3col { grid-template-columns: repeat(2, 1fr) !important; }
          .cas-5col { grid-template-columns: repeat(3, 1fr) !important; }
          .cas-author-grid { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 600px) {
          .cas-2col { grid-template-columns: 1fr !important; }
          .cas-3col { grid-template-columns: 1fr !important; }
          .cas-5col { grid-template-columns: repeat(2, 1fr) !important; }
          .cas-result-pad { padding: 28px 20px !important; }
          .cas-solution-pad { padding: 28px 20px !important; }
          .cas-price-pad { padding: 36px 24px !important; }
          .cas-author-pad { padding: 28px 24px !important; }
        }
      `}</style>
    </div>
  );
}