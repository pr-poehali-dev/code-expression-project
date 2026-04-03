import DokNavbar from "@/components/DokNavbar";
import DokFooter from "@/components/DokFooter";
import { BG, CtaBar } from "./course-visceralny/CvmShared";
import CvmHeroSection from "./course-visceralny/CvmHeroSection";
import CvmProgramSection from "./course-visceralny/CvmProgramSection";
import CvmPricingSection from "./course-visceralny/CvmPricingSection";

export default function CourseVisceralny() {
  return (
    <div style={{ background: BG, minHeight: "100vh", fontFamily: "Montserrat, sans-serif", color: "#1a1a1a" }}>
      <DokNavbar />

      <CvmHeroSection />

      <CtaBar />

      <CvmProgramSection />

      <CtaBar />

      <CvmPricingSection />

      <DokFooter />

      <style>{`
        .cvm-hero-grid { grid-template-columns: 1fr 1fr; }
        .cvm-3col { grid-template-columns: repeat(3, 1fr); }
        .cvm-2col { grid-template-columns: repeat(2, 1fr); }
        .cvm-5col { grid-template-columns: repeat(5, 1fr); }
        .cvm-result-pad { padding: 48px; }
        .cvm-solution-pad { padding: 44px 48px; }
        .cvm-price-pad { padding: 48px 40px; }
        @media (max-width: 900px) {
          .cvm-hero-grid { grid-template-columns: 1fr !important; }
          .cvm-3col { grid-template-columns: repeat(2, 1fr) !important; }
          .cvm-5col { grid-template-columns: repeat(3, 1fr) !important; }
        }
        @media (max-width: 600px) {
          .cvm-2col { grid-template-columns: 1fr !important; }
          .cvm-3col { grid-template-columns: 1fr !important; }
          .cvm-5col { grid-template-columns: repeat(2, 1fr) !important; }
          .cvm-result-pad { padding: 28px 20px !important; }
          .cvm-solution-pad { padding: 28px 20px !important; }
          .cvm-price-pad { padding: 36px 24px !important; }
        }
      `}</style>
    </div>
  );
}
