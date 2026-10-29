import { createFileRoute } from "@tanstack/react-router";
import DlyaSalonov from "@/pages/DlyaSalonov";

export const Route = createFileRoute("/dlya-salonov")({
  component: DlyaSalonov,
  head: () => ({
    meta: [
      { title: "Как увеличить загрузку салона красоты и привлечь клиентов | Промт Диалог" },
      { "name": "description", "content": "Бесплатная диагностика для владельцев салонов красоты: AI-навигатор «ПоДелам» определит точки роста, поможет заполнить свободные окна и вернуть постоянных клиентов." },
      { "name": "keywords", "content": "как увеличить загрузку салона красоты, как привлечь клиентов в салон красоты, продвижение салона красоты, маркетинг для салона красоты, заполнить свободные окна у мастеров, повторные визиты клиентов, развитие салона красоты, ИИ для салона красоты, бесплатная диагностика салона, маркетинг для владельца салона" },
      { "name": "robots", "content": "index, follow" },
      { "property": "og:title", "content": "Как увеличить загрузку салона красоты и привлечь клиентов — Промт Диалог" },
      { "property": "og:description", "content": "Бесплатная диагностика и персональные шаги для владельцев салонов красоты: загрузка мастеров, новые клиенты, повторные визиты, работа команды." },
      { "property": "og:url", "content": "https://promtdialog.ru/dlya-salonov" },
      { "property": "og:type", "content": "website" },
      { "name": "twitter:card", "content": "summary_large_image" },
      { "name": "twitter:title", "content": "Как увеличить загрузку салона красоты — Промт Диалог" },
      { "name": "twitter:description", "content": "Бесплатная диагностика салона и персональные шаги для привлечения клиентов и развития команды." },
    ],
    scripts: [
      { type: "application/ld+json", children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebPage",
          "name": "Как увеличить загрузку салона красоты и привлечь клиентов",
          "url": "https://promtdialog.ru/dlya-salonov",
          "description": "Бесплатная диагностика для владельцев салонов красоты: точки роста, загрузка мастеров, привлечение клиентов, повторные визиты и работа команды.",
          "isPartOf": { "@type": "WebSite", "name": "Промт Диалог", "url": "https://promtdialog.ru" }
        }) },
    ],
  }),
});
