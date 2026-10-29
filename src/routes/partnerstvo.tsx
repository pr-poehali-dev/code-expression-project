import { createFileRoute } from "@tanstack/react-router";
import PartnerLanding from "@/pages/partner-landing/PartnerLanding";
import { TITLE, DESCRIPTION, URL_FULL, OG_IMAGE } from "@/pages/partner-landing/data";

export const Route = createFileRoute("/partnerstvo")({
  component: PartnerLanding,
  head: () => ({
    meta: [
      { title: TITLE },
      { "name": "description", "content": DESCRIPTION },
      { "name": "robots", "content": "noindex, follow" },
      { "property": "og:type", "content": "website" },
      { "property": "og:site_name", "content": "Промт Диалог" },
      { "property": "og:locale", "content": "ru_RU" },
      { "property": "og:title", "content": TITLE },
      { "property": "og:description", "content": DESCRIPTION },
      { "property": "og:url", "content": URL_FULL },
      { "property": "og:image", "content": OG_IMAGE },
      { "property": "og:image:width", "content": "1360" },
      { "property": "og:image:height", "content": "768" },
      { "name": "twitter:card", "content": "summary_large_image" },
      { "name": "twitter:title", "content": TITLE },
      { "name": "twitter:description", "content": DESCRIPTION },
      { "name": "twitter:image", "content": OG_IMAGE },
    ],
  }),
});
