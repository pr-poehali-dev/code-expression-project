import { Helmet } from "react-helmet-async";
import DokNavbar from "@/components/DokNavbar";
import DokFooter from "@/components/DokFooter";
import { BG } from "./course-offline-intensiv/CoiShared";
import CoiHeroSection from "./course-offline-intensiv/CoiHeroSection";
import CoiProgramSection from "./course-offline-intensiv/CoiProgramSection";
import CoiPricingSection from "./course-offline-intensiv/CoiPricingSection";
import CoiReviewsSection from "./course-offline-intensiv/CoiReviewsSection";
import CoiVideoReviews from "./course-offline-intensiv/CoiVideoReviews";
import CoiContactForm from "./course-offline-intensiv/CoiContactForm";
import CoiPhilosophySection from "./course-offline-intensiv/CoiPhilosophySection";
import CoiAuthorSection from "./course-offline-intensiv/CoiAuthorSection";

export default function CourseOfflineIntensiv() {
  return (
    <div style={{ background: BG, minHeight: "100vh", fontFamily: "Montserrat, sans-serif", color: "#1a1a1a" }}>
      <Helmet>
        <title>Однодневный интенсив для массажистов: больше клиентов и выше чек | Dok Диалог</title>
        <meta name="description" content="Офлайн интенсив для практикующих массажистов. За 1 день: диагностика вашей практики, техники повышения среднего чека, система повторных записей и готовый план роста дохода. Группа до 12 человек. От 9 900 руб." />
        <meta name="keywords" content="интенсив для массажистов, офлайн курс массаж, увеличение дохода массажиста, повышение чека массаж, поток клиентов массажист, живое обучение массаж, курс для практикующих массажистов, как увеличить запись на массаж" />
        <meta property="og:title" content="Однодневный интенсив для массажистов: больше клиентов и выше чек" />
        <meta property="og:description" content="За 1 день — диагностика практики, техники роста дохода и готовый план действий. Группа до 12 человек. От 9 900 руб." />
        <meta property="og:type" content="website" />
      </Helmet>
      <DokNavbar />

      <CoiHeroSection />
      <CoiProgramSection />
      <CoiPhilosophySection />
      <CoiReviewsSection />
      <CoiVideoReviews />
      <CoiPricingSection />
      <CoiAuthorSection />
      <CoiContactForm />

      <style>{`
        @media (max-width: 860px) {
          .coi-hero-grid { grid-template-columns: 1fr !important; }
          .pricing-grid { grid-template-columns: 1fr !important; }
          .compare-grid { grid-template-columns: 1fr !important; }
          .results-grid { grid-template-columns: 1fr 1fr !important; }
          .format-grid { grid-template-columns: 1fr 1fr !important; }
          .bonuses-grid { grid-template-columns: 1fr !important; }
          .author-block { flex-direction: column !important; }
          .problems-grid { grid-template-columns: 1fr !important; }
          .course-author-grid { grid-template-columns: 1fr !important; }
          .course-author-pad { padding: 28px 24px !important; }
          .reviews-grid { grid-template-columns: 1fr !important; }
          .coi-pricing-card { padding: 24px 20px !important; }
          .coi-compare-wrap { padding: 20px 20px !important; }
          .coi-inogorod-card { padding: 28px 24px !important; }
          .coi-bonus-online { flex-direction: column !important; }
          .coi-timeline-item { flex-direction: column !important; gap: 8px !important; }
          .coi-timeline-time { width: auto !important; }
          .coi-timeline-body { border-left: none !important; padding-left: 0 !important; border-top: 2px solid rgba(0,166,153,0.2); padding-top: 8px !important; }
        }
        @media (max-width: 500px) {
          .results-grid { grid-template-columns: 1fr !important; }
          .format-grid { grid-template-columns: 1fr 1fr !important; }
          .coi-hero-btns { flex-direction: column !important; }
          .coi-hero-btns a, .coi-hero-btns button { width: 100% !important; text-align: center !important; justify-content: center !important; }
          .coi-address-wrap { flex-direction: column !important; }
          .coi-address-wrap a { width: 100% !important; justify-content: center !important; }
          .coi-hero-img { height: 240px !important; }
          .coi-form-wrap { padding: 28px 18px !important; }
          .coi-sent-wrap { padding: 36px 18px !important; }
          .coi-pricing-card { padding: 20px 16px !important; }
          .coi-compare-wrap { padding: 16px 16px !important; }
          .coi-inogorod-card { padding: 22px 16px !important; }
          .bonuses-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
      <DokFooter />
    </div>
  );
}