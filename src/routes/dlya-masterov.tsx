import { createFileRoute } from "@tanstack/react-router";
import DlyaMasterov from "@/pages/DlyaMasterov";

export const Route = createFileRoute("/dlya-masterov")({
  component: DlyaMasterov,
  head: () => ({
    meta: [
      { title: "Как привлечь клиентов мастеру и массажисту | Промт Диалог" },
      { "name": "description", "content": "Бесплатная диагностика для частных мастеров и массажистов: AI-навигатор «ПоДелам» определит шаги для стабильной записи и привлечения клиентов." },
      { "name": "keywords", "content": "как привлечь клиентов массажисту, продвижение массажиста, маркетинг для частного мастера, стабильная запись клиентов, свободные окна в записи, повторные записи клиентов, продвижение мастера красоты, как найти клиентов мастеру, продвижение частной практики, ИИ для мастера, бесплатная диагностика практики" },
      { "name": "robots", "content": "index, follow" },
      { "property": "og:title", "content": "Как привлечь клиентов мастеру и массажисту — Промт Диалог" },
      { "property": "og:description", "content": "Бесплатная диагностика и шаги для мастеров и массажистов: запись, новые клиенты, повторные визиты." },
      { "property": "og:url", "content": "https://promtdialog.ru/dlya-masterov" },
      { "property": "og:type", "content": "website" },
      { "name": "twitter:card", "content": "summary_large_image" },
      { "name": "twitter:title", "content": "Как привлечь клиентов мастеру и массажисту — Промт Диалог" },
      { "name": "twitter:description", "content": "Бесплатная диагностика практики и персональные шаги для развития." },
    ],
    scripts: [
      { type: "application/ld+json", children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebPage",
          "name": "Как привлечь клиентов мастеру и массажисту",
          "url": "https://promtdialog.ru/dlya-masterov",
          "description": "Бесплатная диагностика для частных мастеров и массажистов: стабильная запись, привлечение клиентов, повторные визиты.",
          "isPartOf": { "@type": "WebSite", "name": "Промт Диалог", "url": "https://promtdialog.ru" }
        }) },
    ],
  }),
});
