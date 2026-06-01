import { Helmet } from "@/lib/helmet";
import BizNavbar from "@/components/BizNavbar";
import BizFooter from "@/components/BizFooter";
import { DARK, TEXT } from "./free/FreeTarifShared";
import FreeTarifHero from "./free/FreeTarifHero";
import FreeTarifSections from "./free/FreeTarifSections";
import FreeTarifCta from "./free/FreeTarifCta";

export default function FreeTarif() {
  return (
    <div style={{ background: DARK, color: TEXT, fontFamily: "Montserrat, sans-serif", minHeight: "100vh" }}>
      <Helmet>
        <title>Бесплатный доступ · Dok Диалог — Старт | Dok Диалог</title>
        <meta
          name="description"
          content="Бесплатный вводный блок платформы Dok Диалог. 5 видео, разборы практики, демонстрация ИИ-инструментов. Для специалистов по телу и состояниям."
        />
        <meta property="og:title" content="Бесплатный доступ · Dok Диалог — Старт" />
        <meta property="og:description" content="Смена взгляда на профессию. Поймёте, почему практика не растёт — и как это изменить." />
      </Helmet>

      <style>{`
        /* ── Hero ── */
        .ft-hero-grid { display: grid; grid-template-columns: 1fr 340px; gap: 60px; align-items: start; }
        .ft-hero-pad  { padding-top: 130px; padding-bottom: 96px; }

        /* ── Секции ── */
        .ft-section      { padding: 88px 0; }
        .ft-two-col      { display: grid; grid-template-columns: 1fr 1fr; gap: 56px; align-items: start; }
        .ft-tarifs-grid  { display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px; }

        /* ── Tablet 960px ── */
        @media (max-width: 960px) {
          .ft-hero-grid   { grid-template-columns: 1fr; gap: 40px; }
          .ft-hero-pad    { padding-top: 100px; padding-bottom: 64px; }
          .ft-section     { padding: 64px 0; }
          .ft-two-col     { gap: 40px; }
          .ft-tarifs-grid { grid-template-columns: repeat(2, 1fr); }
        }

        /* ── Mobile 640px ── */
        @media (max-width: 640px) {
          .ft-hero-pad    { padding-top: 88px; padding-bottom: 48px; }
          .ft-section     { padding: 48px 0; }
          .ft-two-col     { grid-template-columns: 1fr; gap: 32px; }
          .ft-tarifs-grid { grid-template-columns: 1fr; }
        }
      `}</style>

      <BizNavbar />
      <FreeTarifHero />
      <FreeTarifSections />
      <FreeTarifCta />
      <BizFooter />
    </div>
  );
}