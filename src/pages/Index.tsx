import { Helmet } from "@/lib/helmet";
import BizNavbar from "@/components/BizNavbar";
import BizFooter from "@/components/BizFooter";
import IndexHero from "@/pages/index/IndexHero";
import IndexPlatform from "@/pages/index/IndexPlatform";
import IndexBottom from "@/pages/index/IndexBottom";

export default function Index() {
  return (
    <div style={{ fontFamily: "Inter, sans-serif", background: "#fff" }}>
      <Helmet>
        <title>Промт Диалог — Платформа ИИ-инструментов для роста салонов красоты</title>
        <meta name="description" content="Диагностика, развитие команды, обучение и маркетинг — всё для роста салона красоты. Индивидуальные ИИ-агенты под задачи вашего бизнеса. 100 энергий бесплатно при регистрации." />
        <meta name="keywords" content="платформа для салона красоты, ИИ для салона, управление салоном, обучение мастеров, маркетинг для салона" />
        <link rel="canonical" href="https://promtdialog.ru/" />
        <meta property="og:title" content="Промт Диалог — ИИ-платформа роста салона красоты" />
        <meta property="og:description" content="Диагностика, обучение, маркетинг и ИИ-агенты — всё для роста вашего салона. Попробуйте бесплатно." />
        <meta property="og:url" content="https://promtdialog.ru/" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Organization",
          "name": "Промт Диалог",
          "url": "https://promtdialog.ru",
          "description": "Платформа ИИ-инструментов для роста салонов красоты — диагностика, обучение, маркетинг.",
          "offers": { "@type": "Offer", "price": "0", "priceCurrency": "RUB", "description": "100 энергий бесплатно при регистрации" }
        })}</script>
      </Helmet>
      <BizNavbar />
      <IndexHero />
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
      `}</style>
    </div>
  );
}
