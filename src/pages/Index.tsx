import { Helmet } from "@/lib/helmet";
import BizNavbar from "@/components/BizNavbar";
import BizFooter from "@/components/BizFooter";
import IndexHero from "@/pages/index/IndexHero";
import IndexDemoForm from "@/pages/index/IndexDemoForm";
import IndexDiagBanner from "@/pages/index/IndexDiagBanner";
import IndexPlatform from "@/pages/index/IndexPlatform";
import IndexBottom from "@/pages/index/IndexBottom";

export default function Index() {
  return (
    <div style={{ fontFamily: "Inter, sans-serif", background: "#fff" }}>
      <Helmet>
        <title>Маркетинг под вашу практику — ИИ-навигатор дохода «ПоДелам»</title>
        <meta name="description" content="Для салонов, частных специалистов и практиков — от мастеров и массажистов до психологов. Анализируем вашу ситуацию и подсказываем конкретные маркетинговые шаги для привлечения клиентов и развития бизнеса. Получить план роста дохода — бесплатно." />
        <meta name="keywords" content="навигатор дохода, план роста бизнеса, ИИ для салона красоты, ИИ для психолога, увеличение дохода специалиста, маркетинг для частной практики" />
        <link rel="canonical" href="https://promtdialog.ru/" />
        <meta property="og:title" content="Маркетинг под вашу практику — Промт Диалог" />
        <meta property="og:description" content="Для салонов, частных специалистов и практиков — от мастеров до психологов. Конкретные маркетинговые шаги на основе ваших реальных данных. Попробуйте бесплатно." />
        <meta property="og:url" content="https://promtdialog.ru/" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Organization",
          "name": "Промт Диалог",
          "url": "https://promtdialog.ru",
          "description": "ИИ-навигатор дохода «ПоДелам» для специалистов, частной практики и команд — план роста на основе реальных данных.",
          "offers": { "@type": "Offer", "price": "0", "priceCurrency": "RUB", "description": "Получить план роста дохода — бесплатно" }
        })}</script>
      </Helmet>
      <BizNavbar />
      <IndexHero />
      <IndexDemoForm />
      <IndexDiagBanner />
      <IndexPlatform />
      <IndexBottom />
      <BizFooter />
      <style>{`
        @media (max-width: 768px) {
          .hero-grid { grid-template-columns: 1fr !important; }
          .hero-img { margin-top: 32px; }
          .value-grid { grid-template-columns: 1fr !important; }
          .dir-grid { grid-template-columns: 1fr !important; gap: 24px !important; }
          .tarif-grid { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 520px) {
          .tarif-cards-grid { grid-template-columns: 1fr !important; }
          .hero-subtitle { font-size: 14px !important; line-height: 1.55 !important; }
          .hero-subtitle-break { display: none; }
        }
      `}</style>
    </div>
  );
}