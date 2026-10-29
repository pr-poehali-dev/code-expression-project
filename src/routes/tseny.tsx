import { createFileRoute } from "@tanstack/react-router";
import Tseny from "@/pages/Tseny";

export const Route = createFileRoute("/tseny")({
  component: Tseny,
  head: () => ({
    meta: [
      { title: "Стоимость запроса от 3,3 ₽ — бесплатный старт | Промт Диалог" },
      { "name": "description", "content": "Шаги после регистрации бесплатны. Дальше платите только за энергию: запрос от 3,3 ₽, без абонентской платы." },
      { "name": "keywords", "content": "цены Промт Диалог, стоимость запроса, тарифы Промт Диалог, энергия Промт Диалог, платформа для специалистов, стоимость платформы для специалистов" },
      { "property": "og:title", "content": "Промт Диалог — бесплатный старт и запрос от 3,3 ₽" },
      { "property": "og:description", "content": "Без абонентской платы: платите только за энергию. Шаги после регистрации бесплатны." },
      { "property": "og:url", "content": "https://promtdialog.ru/tseny" },
      { "property": "og:type", "content": "website" },
      { "name": "twitter:card", "content": "summary_large_image" },
    ],
    scripts: [
      { type: "application/ld+json", children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "PriceSpecification",
          "name": "Тарифы Промт Диалог",
          "description": "Бесплатный старт, запрос от 3,3 ₽, без подписки.",
          "url": "https://promtdialog.ru/tseny"
        }) },
    ],
  }),
});
