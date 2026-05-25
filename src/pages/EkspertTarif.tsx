import { Helmet } from "@/lib/helmet";
import DokFooter from "@/components/DokFooter";
import DokNavbar from "@/components/DokNavbar";
import { DARK, TEXT } from "./ekspert/EkspertShared";
import EkspertHero from "./ekspert/EkspertHero";
import EkspertSections from "./ekspert/EkspertSections";
import EkspertApplication from "./ekspert/EkspertApplication";

export default function EkspertTarif() {
  return (
    <div style={{ background: DARK, color: TEXT, fontFamily: "Montserrat, sans-serif", minHeight: "100vh" }}>
      <Helmet>
        <title>«Dok Диалог — Эксперт» — тариф №3 | VIP | Dok Диалог</title>
        <meta name="description" content="Закрытая система профессиональной трансформации специалиста. Пожизненный доступ, 10 встреч, все ИИ-инструменты без ограничений. 500 000 ₽." />
        <meta property="og:title" content="«Dok Диалог — Эксперт» — тариф №3 VIP | Dok Диалог" />
      </Helmet>

      <style>{`
        /* ── Hero ── */
        .ex-hero { display: grid; grid-template-columns: 1fr 360px; gap: 64px; align-items: start; }
        .ex-hero-pad { padding-top: 130px; padding-bottom: 96px; }

        /* ── Секции ── */
        .ex-section-pad { padding: 88px 0; }
        .ex-two-col { display: grid; grid-template-columns: 1fr 1fr; gap: 56px; align-items: start; }
        .ex-tools-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px; }
        .ex-results-grid { display: grid; grid-template-columns: repeat(5, 1fr); gap: 12px; }
        .ex-transitions { grid-template-columns: repeat(4, 1fr) !important; }

        /* ── Tablet 960px ── */
        @media (max-width: 960px) {
          .ex-hero { grid-template-columns: 1fr; gap: 40px; }
          .ex-tools-grid { grid-template-columns: repeat(2, 1fr); }
          .ex-results-grid { grid-template-columns: repeat(3, 1fr); }
          .ex-section-pad { padding: 64px 0; }
          .ex-hero-pad { padding-top: 100px; padding-bottom: 64px; }
          .ex-two-col { gap: 40px; }
        }

        /* ── Mobile 640px ── */
        @media (max-width: 640px) {
          .ex-hero { gap: 32px; }
          .ex-hero-pad { padding-top: 88px; padding-bottom: 48px; }
          .ex-section-pad { padding: 48px 0; }
          .ex-two-col { grid-template-columns: 1fr; gap: 32px; }
          .ex-tools-grid { grid-template-columns: 1fr; }
          .ex-results-grid { grid-template-columns: repeat(2, 1fr); }
          .ex-transitions { grid-template-columns: repeat(2, 1fr) !important; }
        }

        /* ── Small 400px ── */
        @media (max-width: 400px) {
          .ex-results-grid { grid-template-columns: 1fr; }
        }
      `}</style>

      <DokNavbar />
      <EkspertHero />
      <EkspertSections />
      <EkspertApplication />
      <DokFooter />
    </div>
  );
}