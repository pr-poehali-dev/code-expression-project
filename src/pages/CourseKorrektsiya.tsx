import { Helmet } from "react-helmet-async";
import DokNavbar from "@/components/DokNavbar";
import DokFooter from "@/components/DokFooter";
import { BG, CtaBar } from "./course-korrektsiya/CkfShared";
import CkfHeroSection from "./course-korrektsiya/CkfHeroSection";
import CkfProgramSection from "./course-korrektsiya/CkfProgramSection";
import CkfPricingSection from "./course-korrektsiya/CkfPricingSection";

export default function CourseKorrektsiya() {
  return (
    <div style={{ background: BG, minHeight: "100vh", fontFamily: "Montserrat, sans-serif", color: "#1a1a1a" }}>
      <Helmet>
        <title>Коррекция фигуры: техники против целлюлита и лишних объёмов | Dok Диалог</title>
        <meta name="description" content="Современные техники массажа для быстрых визуальных результатов. Уменьшение объёмов, работа с целлюлитом, увеличение среднего чека. Готовые протоколы." />
        <meta name="keywords" content="массаж коррекция фигуры, антицеллюлитный массаж обучение, уменьшение объёмов массаж, бьюти массаж курс, техники коррекции тела" />
        <meta property="og:title" content="Коррекция фигуры: техники против целлюлита и лишних объёмов" />
        <meta property="og:description" content="Современные техники для быстрых визуальных результатов в коррекции объёмов и работе с целлюлитом." />
        <meta property="og:type" content="website" />
      </Helmet>
      <DokNavbar />

      <CkfHeroSection />

      <CtaBar />

      <CkfProgramSection />

      <CtaBar />

      <CkfPricingSection />

      <DokFooter />

      <style>{`
        .ckf-hero-grid { grid-template-columns: 1fr 1fr; }
        .ckf-3col { grid-template-columns: repeat(3, 1fr); }
        .ckf-2col { grid-template-columns: repeat(2, 1fr); }
        .ckf-5col { grid-template-columns: repeat(5, 1fr); }
        .ckf-result-pad { padding: 48px; }
        .ckf-solution-pad { padding: 44px 48px; }
        .ckf-price-pad { padding: 48px 40px; }
        @media (max-width: 900px) {
          .ckf-hero-grid { grid-template-columns: 1fr !important; }
          .ckf-3col { grid-template-columns: repeat(2, 1fr) !important; }
          .ckf-5col { grid-template-columns: repeat(3, 1fr) !important; }
          .ckf-author-grid { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 600px) {
          .ckf-2col { grid-template-columns: 1fr !important; }
          .ckf-3col { grid-template-columns: 1fr !important; }
          .ckf-5col { grid-template-columns: repeat(2, 1fr) !important; }
          .ckf-result-pad { padding: 28px 20px !important; }
          .ckf-solution-pad { padding: 28px 20px !important; }
          .ckf-price-pad { padding: 36px 24px !important; }
          .ckf-author-pad { padding: 28px 24px !important; }
        }
      `}</style>
    </div>
  );
}