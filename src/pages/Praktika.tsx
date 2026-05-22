import { Helmet } from "react-helmet-async";
import DokFooter from "@/components/DokFooter";
import DokNavbar from "@/components/DokNavbar";
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
        .pr-hero { display: grid; grid-template-columns: 1fr 420px; gap: 80px; align-items: center; }
        .pr-changes { display: grid; grid-template-columns: repeat(5, 1fr); gap: 16px; }
        .pr-modules { display: grid; grid-template-columns: repeat(3, 1fr); gap: 2px; }
        .pr-price-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 60px; align-items: start; }
        @media (max-width: 1100px) { .pr-changes { grid-template-columns: repeat(3, 1fr); } }
        @media (max-width: 900px) {
          .pr-hero { grid-template-columns: 1fr; gap: 48px; }
          .pr-changes { grid-template-columns: repeat(2, 1fr); }
          .pr-modules { grid-template-columns: repeat(2, 1fr); }
          .pr-price-grid { grid-template-columns: 1fr; gap: 40px; }
        }
        @media (max-width: 560px) {
          .pr-changes { grid-template-columns: 1fr; }
          .pr-modules { grid-template-columns: 1fr; }
        }
      `}</style>

      <DokNavbar />
      <PraktikaHero />
      <PraktikaSections />
      <PraktikaApplication />
      <DokFooter />
    </div>
  );
}
