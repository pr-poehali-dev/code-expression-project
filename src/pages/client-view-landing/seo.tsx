import { TITLE, DESCRIPTION, KEYWORDS, URL_FULL, OG_IMAGE, OG_IMAGE_WIDTH, OG_IMAGE_HEIGHT, OG_IMAGE_ALT, FAQ } from "./data";

const GRAPH = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "SoftwareApplication",
      name: "Покажи глазами клиента",
      url: URL_FULL,
      applicationCategory: "BusinessApplication",
      operatingSystem: "Web",
      inLanguage: "ru",
      description: DESCRIPTION,
      image: OG_IMAGE,
      publisher: { "@type": "Organization", name: "Промт Диалог", url: "https://promtdialog.ru" },
    },
    {
      "@type": "FAQPage",
      mainEntity: FAQ.map(f => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Главная", item: "https://promtdialog.ru/" },
        { "@type": "ListItem", position: 2, name: "Возможности", item: "https://promtdialog.ru/vozmozhnosti" },
        { "@type": "ListItem", position: 3, name: "Покажи глазами клиента", item: URL_FULL },
      ],
    },
  ],
};

// Мета-теги страницы — отдаются через head() маршрута /instrumenty/client-view.
export function clientViewHead() {
  return {
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { name: "keywords", content: KEYWORDS },
      { name: "robots", content: "index, follow" },
      { property: "og:title", content: "Покажи глазами клиента — проверьте предложение до запуска рекламы" },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:url", content: URL_FULL },
      { property: "og:type", content: "website" },
      { property: "og:image", content: OG_IMAGE },
      { property: "og:image:secure_url", content: OG_IMAGE },
      { property: "og:image:type", content: "image/jpeg" },
      { property: "og:image:width", content: OG_IMAGE_WIDTH },
      { property: "og:image:height", content: OG_IMAGE_HEIGHT },
      { property: "og:image:alt", content: OG_IMAGE_ALT },
      { property: "og:site_name", content: "Промт Диалог" },
      { property: "og:locale", content: "ru_RU" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Покажи глазами клиента — проверка предложения" },
      { name: "twitter:description", content: DESCRIPTION },
      { name: "twitter:image", content: OG_IMAGE },
      { name: "twitter:image:alt", content: OG_IMAGE_ALT },
    ],
    scripts: [{ type: "application/ld+json", children: JSON.stringify(GRAPH) }],
  };
}

export default function ClientViewSeo() {
  return null;
}