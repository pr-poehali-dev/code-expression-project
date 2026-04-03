import DokNavbar from "@/components/DokNavbar";
import DokFooter from "@/components/DokFooter";
import { BG, CtaBar } from "./course-massazhist/CourseShared";
import CourseHeroSection from "./course-massazhist/CourseHeroSection";
import CourseProgramSection from "./course-massazhist/CourseProgramSection";
import CoursePricingSection from "./course-massazhist/CoursePricingSection";

export default function CourseMassazhist() {
  return (
    <div style={{ background: BG, minHeight: "100vh", fontFamily: "Montserrat, sans-serif", color: "#1a1a1a" }}>
      <DokNavbar />

      <CourseHeroSection />

      <CtaBar />

      <CourseProgramSection />

      <CtaBar />

      <CoursePricingSection />

      <DokFooter />

      <style>{`
        .course-hero-grid { grid-template-columns: 1fr 1fr; }
        .course-3col { grid-template-columns: repeat(3, 1fr); }
        .course-2col { grid-template-columns: repeat(2, 1fr); }
        .course-5col { grid-template-columns: repeat(5, 1fr); }
        .course-result-pad { padding: 48px; }
        .course-price-pad { padding: 48px 40px; }
        @media (max-width: 900px) {
          .course-hero-grid { grid-template-columns: 1fr !important; }
          .course-3col { grid-template-columns: repeat(2, 1fr) !important; }
          .course-5col { grid-template-columns: repeat(3, 1fr) !important; }
          .course-author-grid { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 600px) {
          .course-2col { grid-template-columns: 1fr !important; }
          .course-3col { grid-template-columns: 1fr !important; }
          .course-5col { grid-template-columns: repeat(2, 1fr) !important; }
          .course-result-pad { padding: 32px 24px !important; }
          .course-price-pad { padding: 36px 24px !important; }
          .course-author-pad { padding: 28px 24px !important; }
        }
      `}</style>
    </div>
  );
}
