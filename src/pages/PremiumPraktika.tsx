import { Helmet } from "@/lib/helmet";
import DokFooter from "@/components/DokFooter";
import DokNavbar from "@/components/DokNavbar";
import { DARK, TEXT } from "./premium/PremiumShared";
import PremiumHero from "./premium/PremiumHero";
import PremiumSections from "./premium/PremiumSections";
import PremiumApplication from "./premium/PremiumApplication";

export default function PremiumPraktika() {
  return (
    <div style={{ background: DARK, color: TEXT, fontFamily: "Montserrat, sans-serif", minHeight: "100vh" }}>
      <Helmet>
        <title>«Премиальная практика» — тариф №2 | Dok Диалог</title>
        <meta name="description" content="Программа для специалистов, которые хотят выйти на высокий чек, работать с платёжеспособной аудиторией и получить ИИ-инструменты нового уровня. 290 000 ₽." />
        <meta property="og:title" content="«Премиальная практика» — тариф №2 | Dok Диалог" />
      </Helmet>

      <style>{`
        /* ── Hero ── */
        .pm-hero { display: grid; grid-template-columns: 1fr 380px; gap: 64px; align-items: start; }
        .pm-hero-pad { padding-top: 130px; padding-bottom: 96px; }

        /* ── Секции ── */
        .pm-section-pad { padding: 88px 0; }
        .pm-two-col { display: grid; grid-template-columns: 1fr 1fr; gap: 56px; align-items: start; }
        .pm-tools-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; }
        .pm-results-grid { display: grid; grid-template-columns: repeat(5, 1fr); gap: 14px; }
        .pm-transitions { grid-template-columns: repeat(4, 1fr); }

        /* ── Tablet 900px ── */
        @media (max-width: 960px) {
          .pm-hero { grid-template-columns: 1fr; gap: 40px; }
          .pm-tools-grid { grid-template-columns: repeat(2, 1fr); }
          .pm-results-grid { grid-template-columns: repeat(3, 1fr); }
          .pm-section-pad { padding: 64px 0; }
          .pm-hero-pad { padding-top: 100px; padding-bottom: 64px; }
          .pm-two-col { gap: 40px; }
        }

        /* ── Mobile 600px ── */
        @media (max-width: 640px) {
          .pm-hero { gap: 32px; }
          .pm-hero-pad { padding-top: 88px; padding-bottom: 48px; }
          .pm-section-pad { padding: 48px 0; }
          .pm-two-col { grid-template-columns: 1fr; gap: 32px; }
          .pm-tools-grid { grid-template-columns: 1fr; }
          .pm-results-grid { grid-template-columns: repeat(2, 1fr); }
          .pm-transitions { grid-template-columns: repeat(2, 1fr) !important; }
        }

        /* ── Small 400px ── */
        @media (max-width: 400px) {
          .pm-results-grid { grid-template-columns: 1fr; }
        }
      `}</style>

      <DokNavbar />
      <PremiumHero />
      <PremiumSections />
      <PremiumApplication />
      <DokFooter />
    </div>
  );
}