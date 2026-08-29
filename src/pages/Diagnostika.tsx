import { Helmet } from "@/lib/helmet";
import BizNavbar from "@/components/BizNavbar";
import BizFooter from "@/components/BizFooter";
import DiagnostikaHero from "@/pages/diagnostika/DiagnostikaHero";
import DiagnostikaMath from "@/pages/diagnostika/DiagnostikaMath";
import DiagnostikaTrust from "@/pages/diagnostika/DiagnostikaTrust";
import DiagnostikaCta from "@/pages/diagnostika/DiagnostikaCta";

export default function Diagnostika() {
  return (
    <>
      <Helmet>
        <title>AI-навигатор роста дохода — бесплатная диагностика и ежедневный план | Промт Диалог</title>
        <meta name="description" content="Узнайте, что мешает расти вашему бизнесу или частной практике — и получите персональный план действий. Бесплатный AI-анализ показателей и целей, ежедневные рекомендации и отслеживание прогресса. Для салонов красоты, психологов и других специалистов. Не разовый тест, а навигатор, который ведёт к цели." />
        <meta name="keywords" content="диагностика салона красоты, диагностика частной практики психолога, AI навигатор роста дохода, бесплатный аудит бизнеса, план роста выручки, индекс здоровья бизнеса, аналитика для психолога, рост дохода специалиста, промт диалог диагностика" />
      </Helmet>

      <BizNavbar />

      <DiagnostikaHero />
      <DiagnostikaMath />
      <DiagnostikaTrust />
      <DiagnostikaCta />

      <BizFooter />
    </>
  );
}
