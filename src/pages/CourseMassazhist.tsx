import { Helmet } from "react-helmet-async";
import DokNavbar from "@/components/DokNavbar";
import DokFooter from "@/components/DokFooter";
import { BG, CtaBar } from "./course-massazhist/CourseShared";
import CourseHeroSection from "./course-massazhist/CourseHeroSection";
import CourseProgramSection from "./course-massazhist/CourseProgramSection";
import CoursePricingSection from "./course-massazhist/CoursePricingSection";

export default function CourseMassazhist() {
  return (
    <div style={{ background: BG, minHeight: "100vh", fontFamily: "Montserrat, sans-serif", color: "#1a1a1a" }}>
      <Helmet>
        <title>Профессия массажист с нуля: первый доход за 30 дней | Dok Диалог</title>
        <meta name="description" content="Освойте профессию массажиста без медицинского образования. Практика с первого дня, реальный заработок через 30 дней. Онлайн-курс от МассоПро." />
        <meta name="keywords" content="курс массажист с нуля, обучение массажу с нуля, профессия массажист, заработок на массаже, массаж без медобразования" />
        <meta property="og:title" content="Профессия массажист с нуля: первый доход за 30 дней" />
        <meta property="og:description" content="Освойте профессию массажиста без медицинского образования. Практика с первого дня, первый доход через 30 дней." />
        <meta property="og:type" content="website" />
      </Helmet>
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