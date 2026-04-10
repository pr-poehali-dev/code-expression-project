import { Helmet } from "react-helmet-async";
import DokFooter from "@/components/DokFooter";
import DokNavbar from "@/components/DokNavbar";
import PartnerHero from "@/components/partnery/PartnerHero";
import PartnerSections from "@/components/partnery/PartnerSections";
import PartnerFormaSection from "@/components/partnery/PartnerFormaSection";

export default function Partnery() {
  return (
    <div style={{ background: "#f8f8f6", color: "#1a1a1a", fontFamily: "Montserrat, sans-serif", minHeight: "100vh" }}>
      <Helmet>
        <title>Партнёрам — Сотрудничество с Dok Диалог | МассоПро</title>
        <meta name="description" content="Станьте партнёром образовательной платформы для мастеров массажа. Совместные программы, реферальная система, корпоративное обучение персонала салонов." />
      </Helmet>
      <DokNavbar />
      <PartnerHero />
      <PartnerSections />
      <PartnerFormaSection />
      <DokFooter />
    </div>
  );
}