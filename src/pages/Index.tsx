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
        <title>Промт Диалог — ИИ-навигатор дохода «ПоДелам» для специалистов и команд</title>
        <meta name="description" content="«ПоДелам» — ИИ-навигатор дохода: анализирует ваш чек, базу клиентов и загрузку, показывает конкретный план роста на день, неделю и месяц. Для салонов красоты, психологов и частной практики. Получить план роста дохода — бесплатно." />
        <meta name="keywords" content="навигатор дохода, план роста бизнеса, ИИ для салона красоты, ИИ для психолога, увеличение дохода специалиста, маркетинг для частной практики" />
        <link rel="canonical" href="https://promtdialog.ru/" />
        <meta property="og:title" content="Промт Диалог — ИИ-навигатор дохода «ПоДелам»" />
        <meta property="og:description" content="Понятный план, как увеличить записи и доход — на основе ваших реальных данных. Попробуйте бесплатно." />
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
        }
      `}</style>
    </div>
  );
}