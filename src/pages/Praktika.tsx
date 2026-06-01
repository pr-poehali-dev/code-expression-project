import { Helmet } from "@/lib/helmet";
import BizFooter from "@/components/BizFooter";
import BizNavbar from "@/components/BizNavbar";
import { DARK, TEXT } from "./praktika/PraktikaShared";
import PraktikaHero from "./praktika/PraktikaHero";
import PraktikaSections from "./praktika/PraktikaSections";
import PraktikaApplication from "./praktika/PraktikaApplication";

export default function Praktika() {
  return (
    <div style={{ background: DARK, color: TEXT, fontFamily: "Montserrat, sans-serif", minHeight: "100vh" }}>
      <Helmet>
        <title>«Практика» — тариф №1 | Dok Диалог</title>
        <meta name="description" content="Система для специалистов по телу и состояниям, которые хотят выйти из хаоса, повысить стоимость услуг и привлекать платёжеспособных клиентов. 90 900 ₽, доступ 12 месяцев." />
        <meta property="og:title" content="«Практика» — тариф №1 | Dok Диалог" />
      </Helmet>

      <style>{`
        .pr-hero { display: grid; grid-template-columns: 1fr 400px; gap: 64px; align-items: center; }
        .pr-changes { display: grid; grid-template-columns: repeat(5, 1fr); gap: 16px; }
        .pr-modules { display: grid; grid-template-columns: repeat(3, 1fr); gap: 2px; }
        .pr-price-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 56px; align-items: start; }
        .pr-section-pad { padding: 96px 0; }
        .pr-hero-pad { padding-top: 140px; padding-bottom: 100px; }
        @media (max-width: 1100px) {
          .pr-changes { grid-template-columns: repeat(3, 1fr); }
        }
        @media (max-width: 900px) {
          .pr-hero { grid-template-columns: 1fr; gap: 40px; }
          .pr-changes { grid-template-columns: repeat(2, 1fr); }
          .pr-modules { grid-template-columns: repeat(2, 1fr); }
          .pr-price-grid { grid-template-columns: 1fr; gap: 36px; }
          .pr-section-pad { padding: 64px 0; }
          .pr-hero-pad { padding-top: 100px; padding-bottom: 64px; }
        }
        @media (max-width: 600px) {
          .pr-hero { gap: 32px; }
          .pr-changes { grid-template-columns: 1fr; }
          .pr-modules { grid-template-columns: 1fr; }
          .pr-section-pad { padding: 48px 0; }
          .pr-hero-pad { padding-top: 90px; padding-bottom: 48px; }
          .pr-price-grid { gap: 28px; }
        }
      `}</style>

      <BizNavbar />
      <PraktikaHero />
      <PraktikaSections />
      <PraktikaApplication />
      <BizFooter />
    </div>
  );
}