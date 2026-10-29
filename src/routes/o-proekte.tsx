import { createFileRoute } from "@tanstack/react-router";
import OProekte from "@/pages/OProekte";

export const Route = createFileRoute("/o-proekte")({
  component: OProekte,
  head: () => ({
    meta: [
      { title: "О проекте — команда и философия Промт Диалог" },
      { "name": "description", "content": "Промт Диалог — платформа, созданная практиками индустрии красоты. Ею пользуются салоны, мастера, психологи и другие специалисты." },
      { "name": "keywords", "content": "о проекте Промт Диалог, команда платформы, история создания, философия развития салона" },
      { "property": "og:title", "content": "О проекте Промт Диалог — платформа роста для салонов и специалистов" },
      { "property": "og:description", "content": "Создана практиками: опыт, алгоритмы и ИИ для роста салонов, мастеров и специалистов." },
      { "property": "og:url", "content": "https://promtdialog.ru/o-proekte" },
      { "property": "og:type", "content": "website" },
      { "name": "twitter:card", "content": "summary_large_image" },
    ],
    scripts: [
      { type: "application/ld+json", children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Organization",
          "name": "Промт Диалог",
          "url": "https://promtdialog.ru",
          "description": "Платформа роста для салонов красоты, мастеров и других специалистов. Объединяет опыт, алгоритмы и искусственный интеллект.",
          "foundingDate": "2023",
          "knowsAbout": ["Управление салоном красоты", "Маркетинг для салона", "Обучение персонала", "Искусственный интеллект в бьюти-индустрии"]
        }) },
    ],
  }),
});
