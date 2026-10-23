import { Helmet } from "@/lib/helmet";
import BizNavbar from "@/components/BizNavbar";
import BizFooter from "@/components/BizFooter";
import IndexDemoForm from "@/pages/index/IndexDemoForm";
import { IndexHeroMain, IndexSegments, IndexHowItWorks, IndexResults, IndexHowToStart, IndexFinal } from "@/pages/index/IndexMain";

export default function Index() {
  return (
    <div style={{ fontFamily: "Inter, sans-serif", background: "#fff" }}>
      <Helmet>
        <title>Промт Диалог — маркетинг для салонов, мастеров и психологов | AI-навигатор «ПоДелам»</title>
        <meta name="description" content="Бесплатная диагностика практики или бизнеса: AI-навигатор «ПоДелам» анализирует услуги, аудиторию, регион и ресурсы и помогает определить шаги для привлечения клиентов и роста загрузки. Для салонов, мастеров, массажистов, психологов." />
        <meta name="keywords" content="маркетинг для салона красоты, маркетинг для частного мастера, маркетинг для психолога, как привлечь клиентов, продвижение частной практики, увеличить загрузку салона, повторные записи клиентов, ИИ для бизнеса услуг, бесплатная диагностика бизнеса, план развития практики, Промт Диалог, ПоДелам" />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://promtdialog.ru/" />
        <meta property="og:title" content="Промт Диалог — маркетинг, который понимает ваш бизнес" />
        <meta property="og:description" content="Анализируем вашу ситуацию и помогаем определить шаги для привлечения и удержания клиентов. Диагностика бесплатно." />
        <meta property="og:url" content="https://promtdialog.ru/" />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Промт Диалог" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Промт Диалог — маркетинг, который понимает ваш бизнес" />
        <meta name="twitter:description" content="AI-навигатор «ПоДелам»: бесплатная диагностика и персональные шаги для салонов, мастеров и психологов." />
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Organization",
          "name": "Промт Диалог",
          "url": "https://promtdialog.ru",
          "description": "AI-навигатор «ПоДелам» для салонов красоты, частных мастеров, массажистов и психологов: анализ ситуации и персональные шаги для привлечения клиентов и развития практики.",
          "offers": { "@type": "Offer", "price": "0", "priceCurrency": "RUB", "description": "Диагностика и персональные шаги — бесплатно" }
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