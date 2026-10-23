import { Helmet } from "@/lib/helmet";
import BizNavbar from "@/components/BizNavbar";
import BizFooter from "@/components/BizFooter";
import IndexDemoForm from "@/pages/index/IndexDemoForm";
import { IndexHeroMain, IndexSegments, IndexHowItWorks, IndexResults, IndexHowToStart, IndexFinal } from "@/pages/index/IndexMain";

export default function Index() {
  return (
    <div style={{ fontFamily: "Inter, sans-serif", background: "#fff" }}>
      <Helmet>
        <title>Промт Диалог — маркетинг, который понимает ваш бизнес</title>
        <meta name="description" content="Промт Диалог — AI-навигатор «ПоДелам»: анализирует ваши услуги, аудиторию, регион и ресурсы и помогает определить конкретные шаги для развития практики или бизнеса. Для салонов, мастеров, массажистов и психологов." />
        <meta name="keywords" content="навигатор дохода, план роста бизнеса, ИИ для салона красоты, ИИ для психолога, увеличение дохода специалиста, маркетинг для частной практики" />
        <link rel="canonical" href="https://promtdialog.ru/" />
        <meta property="og:title" content="Промт Диалог — маркетинг, который понимает ваш бизнес" />
        <meta property="og:description" content="Анализируем вашу ситуацию и помогаем определить конкретные шаги для привлечения и удержания клиентов." />
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
      <IndexHeroMain />
      <IndexSegments />
      <IndexHowItWorks />
      <IndexResults />
      <IndexHowToStart />
      <IndexFinal />
      <IndexDemoForm />
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