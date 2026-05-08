import { Helmet } from "react-helmet-async";
import DokNavbar from "@/components/DokNavbar";
import DokFooter from "@/components/DokFooter";
import { BG } from "./course-offline-intensiv/CoiShared";
import CoiSemHeroSection from "./course-offline-intensiv-semya/CoiSemHeroSection";
import CoiSemProgramSection from "./course-offline-intensiv-semya/CoiSemProgramSection";
import CoiSemPhilosophySection from "./course-offline-intensiv-semya/CoiSemPhilosophySection";
import CoiReviewsSection from "./course-offline-intensiv/CoiReviewsSection";
import CoiVideoReviews from "./course-offline-intensiv/CoiVideoReviews";
import CoiSemPricingSection from "./course-offline-intensiv-semya/CoiSemPricingSection";
import CoiContactForm from "./course-offline-intensiv/CoiContactForm";
import CoiAuthorSection from "./course-offline-intensiv/CoiAuthorSection";

export default function CourseOfflineIntensivSemya() {
  return (
    <div style={{ background: BG, minHeight: "100vh", fontFamily: "Montserrat, sans-serif", color: "#1a1a1a" }}>
      <Helmet>
        <title>Интенсив в Москве: помочь близким с болью в спине и шее без медобразования | Dok Диалог</title>
        <meta name="description" content="Офлайн интенсив в Москве для тех, кто хочет помогать семье. 1 день: простые восстановительные техники для шеи, спины, плеч и поясницы без медицинского образования. Навыки, которые остаются на всю жизнь. От 5 000 ₽." />
        <meta name="keywords" content="интенсив восстановительные техники семья Москва, помочь близким с болью в спине, курс без медобразования офлайн, техники расслабления дома, боль в шее помочь близким, восстановительный массаж для семьи" />
        <meta property="og:title" content="Интенсив в Москве: восстановительные техники для семьи без медобразования" />
        <meta property="og:description" content="1 день практики в Москве — простые техники для шеи, спины и поясницы. Помогайте близким без медобразования. От 5 000 ₽, группа до 12 человек." />
        <meta property="og:type" content="website" />
      </Helmet>
      <DokNavbar />

      <CoiSemHeroSection />
      <CoiSemProgramSection />
      <CoiSemPhilosophySection />
      <CoiReviewsSection />
      <CoiVideoReviews />
      <CoiSemPricingSection />
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