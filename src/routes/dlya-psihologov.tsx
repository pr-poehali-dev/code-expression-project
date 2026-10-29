import { createFileRoute } from "@tanstack/react-router";
import DlyaPsihologov from "@/pages/DlyaPsihologov";

export const Route = createFileRoute("/dlya-psihologov")({
  component: DlyaPsihologov,
  head: () => ({
    meta: [
      { title: "Развитие практики психолога: как найти клиентов | Промт Диалог" },
      { "name": "description", "content": "Бесплатная диагностика для психологов: AI-навигатор «ПоДелам» определит шаги развития частной практики и продвижения." },
      { "name": "keywords", "content": "развитие частной практики психолога, как психологу найти клиентов, привлечение клиентов психологу, продвижение психолога, маркетинг для психолога, позиционирование психолога, как рассказать о себе психологу, продвижение без навязчивой рекламы, ИИ для психолога, бесплатная диагностика практики" },
      { "name": "robots", "content": "index, follow" },
      { "property": "og:title", "content": "Развитие практики психолога: как найти клиентов — Промт Диалог" },
      { "property": "og:description", "content": "Бесплатная диагностика и персональные шаги для психологов: позиционирование, продвижение, стабильность практики." },
      { "property": "og:url", "content": "https://promtdialog.ru/dlya-psihologov" },
      { "property": "og:type", "content": "website" },
      { "name": "twitter:card", "content": "summary_large_image" },
      { "name": "twitter:title", "content": "Развитие практики психолога: как найти клиентов — Промт Диалог" },
      { "name": "twitter:description", "content": "Бесплатная диагностика практики и персональные шаги для психологов." },
    ],
    scripts: [
      { type: "application/ld+json", children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebPage",
          "name": "Развитие практики психолога: как найти клиентов",
          "url": "https://promtdialog.ru/dlya-psihologov",
          "description": "Бесплатная диагностика для психологов: позиционирование, продвижение и развитие частной практики с учетом профессиональных ценностей.",
          "isPartOf": { "@type": "WebSite", "name": "Промт Диалог", "url": "https://promtdialog.ru" }
        }) },
    ],
  }),
});
