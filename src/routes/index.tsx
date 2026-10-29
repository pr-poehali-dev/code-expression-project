import { createFileRoute } from "@tanstack/react-router";
import Index from "@/pages/Index";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "Развивайте свое дело уверенно | Промт Диалог" },
      { "name": "description", "content": "Разберитесь, что мешает развитию бизнеса, найдите возможности для привлечения клиентов и получите конкретные шаги. Бесплатная диагностика." },
      { "name": "keywords", "content": "маркетинг для салона красоты, маркетинг для частного мастера, маркетинг для психолога, как привлечь клиентов, продвижение частной практики, увеличить загрузку салона, повторные записи клиентов, ИИ для бизнеса услуг, бесплатная диагностика бизнеса, план развития практики, Промт Диалог, ПоДелам" },
      { "name": "robots", "content": "index, follow" },
      { "property": "og:title", "content": "Развивайте свое дело уверенно | Промт Диалог" },
      { "property": "og:description", "content": "Разберитесь, что мешает развитию бизнеса, найдите возможности для привлечения клиентов и получите конкретные шаги. Бесплатная диагностика." },
      { "property": "og:url", "content": "https://promtdialog.ru/" },
      { "property": "og:type", "content": "website" },
      { "property": "og:site_name", "content": "Промт Диалог" },
      { "name": "twitter:card", "content": "summary_large_image" },
      { "name": "twitter:title", "content": "Развивайте свое дело уверенно | Промт Диалог" },
      { "name": "twitter:description", "content": "Разберитесь, что мешает развитию бизнеса, найдите возможности для привлечения клиентов и получите конкретные шаги. Бесплатная диагностика." },
    ],
    scripts: [
      { type: "application/ld+json", children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Organization",
          "name": "Промт Диалог",
          "url": "https://promtdialog.ru",
          "description": "AI-навигатор «ПоДелам» для салонов красоты, частных мастеров, массажистов и психологов: анализ ситуации и персональные шаги для привлечения клиентов и развития практики.",
          "offers": { "@type": "Offer", "price": "0", "priceCurrency": "RUB", "description": "Диагностика и персональные шаги — бесплатно" }
        }) },
    ],
  }),
});
