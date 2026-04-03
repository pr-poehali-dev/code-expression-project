import DokNavbar from "@/components/DokNavbar";
import DokFooter from "@/components/DokFooter";
import { BG, CtaBar } from "./course-vosstanovitelny/CvShared";
import CvHeroSection from "./course-vosstanovitelny/CvHeroSection";
import CvProgramSection from "./course-vosstanovitelny/CvProgramSection";
import CvPricingSection from "./course-vosstanovitelny/CvPricingSection";

export default function CourseVosstanovitelny() {
  return (
    <div style={{ background: BG, minHeight: "100vh", fontFamily: "Montserrat, sans-serif", color: "#1a1a1a" }}>
      <DokNavbar />

      <CvHeroSection />

      <CtaBar />

      <CvProgramSection />

      <CtaBar />

      <CvPricingSection />

      <DokFooter />

      <style>{`
        .cv-hero-grid { grid-template-columns: 1fr 1fr; }
        .cv-3col { grid-template-columns: repeat(3, 1fr); }
        .cv-2col { grid-template-columns: repeat(2, 1fr); }
        .cv-6col { grid-template-columns: repeat(6, 1fr); }
        .cv-result-pad { padding: 48px; }
        .cv-solution-pad { padding: 44px 48px; }
        .cv-price-pad { padding: 48px 40px; }
        @media (max-width: 900px) {
          .cv-hero-grid { grid-template-columns: 1fr !important; }
          .cv-3col { grid-template-columns: repeat(2, 1fr) !important; }
          .cv-6col { grid-template-columns: repeat(3, 1fr) !important; }
          .cv-author-grid { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 600px) {
          .cv-2col { grid-template-columns: 1fr !important; }
          .cv-3col { grid-template-columns: 1fr !important; }
          .cv-6col { grid-template-columns: repeat(2, 1fr) !important; }
          .cv-result-pad { padding: 28px 20px !important; }
          .cv-solution-pad { padding: 28px 20px !important; }
          .cv-price-pad { padding: 36px 24px !important; }
          .cv-author-pad { padding: 28px 24px !important; }
        }
      `}</style>
    </div>
  );
}
