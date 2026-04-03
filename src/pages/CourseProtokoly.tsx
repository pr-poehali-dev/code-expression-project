import DokNavbar from "@/components/DokNavbar";
import DokFooter from "@/components/DokFooter";
import { BG, CtaBar } from "./course-protokoly/CpShared";
import CpHeroSection from "./course-protokoly/CpHeroSection";
import CpProgramSection from "./course-protokoly/CpProgramSection";
import CpPricingSection from "./course-protokoly/CpPricingSection";

export default function CourseProtokoly() {
  return (
    <div style={{ background: BG, minHeight: "100vh", fontFamily: "Montserrat, sans-serif", color: "#1a1a1a" }}>
      <DokNavbar />

      <CpHeroSection />

      <CtaBar />

      <CpProgramSection />

      <CtaBar />

      <CpPricingSection />

      <DokFooter />

      <style>{`
        .cp3-hero-grid { grid-template-columns: 1fr 1fr; }
        .cp3-3col { grid-template-columns: repeat(3, 1fr); }
        .cp3-2col { grid-template-columns: repeat(2, 1fr); }
        .cp3-5col { grid-template-columns: repeat(5, 1fr); }
        .cp3-result-pad { padding: 48px; }
        .cp3-solution-pad { padding: 44px 48px; }
        .cp3-price-pad { padding: 48px 40px; }
        @media (max-width: 900px) {
          .cp3-hero-grid { grid-template-columns: 1fr !important; }
          .cp3-3col { grid-template-columns: repeat(2, 1fr) !important; }
          .cp3-5col { grid-template-columns: repeat(3, 1fr) !important; }
          .cp3-author-grid { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 600px) {
          .cp3-2col { grid-template-columns: 1fr !important; }
          .cp3-3col { grid-template-columns: 1fr !important; }
          .cp3-5col { grid-template-columns: repeat(2, 1fr) !important; }
          .cp3-result-pad { padding: 28px 20px !important; }
          .cp3-solution-pad { padding: 28px 20px !important; }
          .cp3-price-pad { padding: 36px 24px !important; }
          .cp3-author-pad { padding: 28px 24px !important; }
        }
      `}</style>
    </div>
  );
}
