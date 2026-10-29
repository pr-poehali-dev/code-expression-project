import { createFileRoute } from "@tanstack/react-router";
import Vozmozhnosti from "@/pages/Vozmozhnosti";

export const Route = createFileRoute("/vozmozhnosti")({
  component: Vozmozhnosti,
  head: () => ({
    meta: [
      { title: "Возможности платформы — маркетинг, обучение и ИИ для бизнеса | Промт Диалог" },
      { "name": "description", "content": "Более 20 инструментов для роста дохода: генератор постов, конструктор лендингов, сценарии Reels, SEO-оптимизация, анализ персонала, скрипты продаж, обучение команды. Для салонов красоты, психологов и частной практики. Попробуйте бесплатно." },
      { "name": "keywords", "content": "инструменты для салона красоты, конструктор лендингов, маркетинг для бизнеса, обучение персонала, ИИ для салона, ИИ для психолога, платформа управления бизнесом" },
      { "property": "og:title", "content": "Возможности платформы Промт Диалог — все для роста дохода" },
      { "property": "og:description", "content": "Более 20 инструментов: маркетинг, управление, продажи, обучение команды. Все в одном кабинете." },
      { "property": "og:url", "content": "https://promtdialog.ru/vozmozhnosti" },
      { "property": "og:type", "content": "website" },
      { "name": "twitter:card", "content": "summary_large_image" },
      { "name": "twitter:title", "content": "Возможности платформы Промт Диалог" },
      { "name": "twitter:description", "content": "Более 20 инструментов для роста дохода: маркетинг, ИИ, конструктор лендингов, обучение команды." },
    ],
    scripts: [
      { type: "application/ld+json", children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "SoftwareApplication",
          "name": "Промт Диалог",
          "url": "https://promtdialog.ru",
          "applicationCategory": "BusinessApplication",
          "description": "Платформа роста дохода для салонов красоты, психологов и частной практики: маркетинг, управление, обучение персонала и ИИ-инструменты в одном кабинете.",
          "offers": { "@type": "Offer", "price": "0", "priceCurrency": "RUB", "description": "Получить план роста дохода — бесплатно" },
          "featureList": ["Покажи глазами клиента", "Генератор постов", "Конструктор лендингов", "Сценарии и видео для Reels", "SEO-оптимизация", "Анализ персонала", "Скрипты продаж", "Обучение команды"],
          "operatingSystem": "Web"
        }) },
    ],
  }),
});
