import { useEffect } from "react";
import { Helmet } from "@/lib/helmet";
import { TITLE, DESCRIPTION, KEYWORDS, URL_FULL, OG_IMAGE, OG_IMAGE_WIDTH, OG_IMAGE_HEIGHT, OG_IMAGE_ALT, FAQ } from "./data";

function useHeadExtras() {
  useEffect(() => {
    let link = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    const prevHref = link?.getAttribute("href") ?? null;
    const created = !link;
    if (!link) {
      link = document.createElement("link");
      link.rel = "canonical";
      document.head.appendChild(link);
    }
    link.setAttribute("href", URL_FULL);

    const graph = {
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
    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.id = "cv-landing-jsonld";
    script.text = JSON.stringify(graph);
    document.head.appendChild(script);

    return () => {
      script.remove();
      if (created) link?.remove();
      else if (prevHref !== null) link?.setAttribute("href", prevHref);
    };
  }, []);
}

export default function ClientViewSeo() {
  useHeadExtras();
  return (
    <Helmet>
      <title>{TITLE}</title>
      <meta name="description" content={DESCRIPTION} />
      <meta name="keywords" content={KEYWORDS} />
      <meta name="robots" content="index, follow" />
      <meta property="og:title" content="Покажи глазами клиента — проверьте предложение до запуска рекламы" />
      <meta property="og:description" content={DESCRIPTION} />
      <meta property="og:url" content={URL_FULL} />
      <meta property="og:type" content="website" />
      <meta property="og:image" content={OG_IMAGE} />
      <meta property="og:image:secure_url" content={OG_IMAGE} />
      <meta property="og:image:type" content="image/jpeg" />
      <meta property="og:image:width" content={OG_IMAGE_WIDTH} />
      <meta property="og:image:height" content={OG_IMAGE_HEIGHT} />
      <meta property="og:image:alt" content={OG_IMAGE_ALT} />
      <meta property="og:site_name" content="Промт Диалог" />
      <meta property="og:locale" content="ru_RU" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content="Покажи глазами клиента — взгляд на ваше предложение со стороны" />
      <meta name="twitter:description" content={DESCRIPTION} />
      <meta name="twitter:image" content={OG_IMAGE} />
      <meta name="twitter:image:alt" content={OG_IMAGE_ALT} />
    </Helmet>
  );
}
