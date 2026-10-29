import { createFileRoute } from "@tanstack/react-router";
import Keysy from "@/pages/Keysy";

export const Route = createFileRoute("/keysy")({
  component: Keysy,
  head: () => ({
    meta: [
      { title: "Кейсы и результаты салонов — истории успеха | Промт Диалог" },
      { "name": "description", "content": "Реальные истории салонов красоты, которые выросли с платформой Промт Диалог. Цифры, результаты, опыт владельцев и мастеров." },
      { "name": "keywords", "content": "кейсы салонов красоты, результаты роста салона, истории успеха, платформа для салона отзывы" },
      { "property": "og:title", "content": "Кейсы — реальные результаты салонов с Промт Диалог" },
      { "property": "og:description", "content": "200+ салонов уже растут с платформой. Читайте истории успеха и реальные цифры." },
      { "property": "og:url", "content": "https://promtdialog.ru/keysy" },
      { "property": "og:type", "content": "website" },
      { "name": "twitter:card", "content": "summary_large_image" },
    ],
  }),
});
