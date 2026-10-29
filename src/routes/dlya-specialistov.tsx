import { createFileRoute } from "@tanstack/react-router";
import DlyaSpecialistov from "@/pages/DlyaSpecialistov";

export const Route = createFileRoute("/dlya-specialistov")({
  component: DlyaSpecialistov,
  head: () => ({
    meta: [
      { title: "Как найти клиентов специалисту: развитие своего дела | Промт Диалог" },
      { "name": "description", "content": "Бесплатная диагностика для специалистов, работающих с людьми: репетиторов, тренеров, фотографов, консультантов. AI-навигатор «ПоДелам» определит шаги развития." },
      { "name": "keywords", "content": "как найти клиентов специалисту, продвижение частного специалиста, привлечение клиентов репетитору, продвижение тренера, продвижение фотографа, маркетинг для самозанятых, как развивать свое дело, продвижение услуг, частная практика, ИИ для специалиста, бесплатная диагностика" },
      { "name": "robots", "content": "index, follow" },
      { "property": "og:title", "content": "Как найти клиентов специалисту — Промт Диалог" },
      { "property": "og:description", "content": "Бесплатная диагностика и шаги для тех, кто работает с людьми." },
      { "property": "og:url", "content": "https://promtdialog.ru/dlya-specialistov" },
      { "property": "og:type", "content": "website" },
      { "name": "twitter:card", "content": "summary_large_image" },
      { "name": "twitter:title", "content": "Как найти клиентов специалисту — Промт Диалог" },
      { "name": "twitter:description", "content": "Бесплатная диагностика и шаги для специалистов." },
    ],
    scripts: [
      { type: "application/ld+json", children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebPage",
          "name": "Как найти клиентов специалисту: развитие своего дела",
          "url": "https://promtdialog.ru/dlya-specialistov",
          "description": "Бесплатная диагностика для специалистов, работающих с людьми: услуги, аудитория, регион, ресурсы и следующие шаги.",
          "isPartOf": { "@type": "WebSite", "name": "Промт Диалог", "url": "https://promtdialog.ru" }
        }) },
    ],
  }),
});
