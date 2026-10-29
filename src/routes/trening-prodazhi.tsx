import { createFileRoute } from "@tanstack/react-router";
import TreningProdazhi from "@/pages/TreningProdazhi";

export const Route = createFileRoute("/trening-prodazhi")({
  component: TreningProdazhi,
  head: () => ({
    meta: [
      { title: "Тренинг по продажам для мастеров и администраторов салона | Промт Диалог" },
      { "name": "description", "content": "Однодневный живой тренинг Сергея Водопьянова — научитесь продавать через заботу, а не давление. Для мастеров и администраторов салонов красоты. Москва, 9 990 ₽." },
      { "name": "keywords", "content": "тренинг по продажам для салона красоты, обучение мастеров продажам, тренинг для администратора салона, продажи в салоне красоты, Сергей Водопьянов тренинг" },
      { "property": "og:title", "content": "Тренинг по продажам для салона красоты — Промт Диалог" },
      { "property": "og:description", "content": "Живой тренинг: продажи через заботу, работа с возражениями, повторные записи. Москва, 9 990 ₽. Бонус — 1500 Энергий на платформу сразу после оплаты." },
      { "property": "og:url", "content": "https://promtdialog.ru/trening-prodazhi" },
      { "property": "og:type", "content": "website" },
      { "name": "twitter:card", "content": "summary_large_image" },
      { "name": "twitter:title", "content": "Тренинг по продажам для мастеров и администраторов салона" },
      { "name": "twitter:description", "content": "Однодневный тренинг в Москве — навыки продаж и коммуникации для специалистов салонов красоты. 9 990 ₽." },
    ],
    scripts: [
      { type: "application/ld+json", children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Course",
          "name": "Тренинг по продажам для мастеров и администраторов салона",
          "description": "Однодневный живой тренинг по навыкам продаж и коммуникации для специалистов салонов красоты. Ведущий — Сергей Водопьянов.",
          "provider": { "@type": "Organization", "name": "Промт Диалог", "url": "https://promtdialog.ru" },
          "url": "https://promtdialog.ru/trening-prodazhi",
          "courseMode": "Presential",
          "inLanguage": "ru",
          "offers": { "@type": "Offer", "price": "9990", "priceCurrency": "RUB", "availability": "https://schema.org/InStock" }
        }) },
    ],
  }),
});
