import { createFileRoute } from "@tanstack/react-router";
import Reviews from "@/pages/Reviews";

export const Route = createFileRoute("/reviews")({
  component: Reviews,
  head: () => ({
    meta: [
      { title: "Истории специалистов — Промт Диалог" },
      { "name": "description", "content": "Истории специалистов и команд, которые изменили подход к практике: мышление, стоимость, работа с клиентом, внедрение в салоне." },
      { "property": "og:title", "content": "Истории специалистов — Промт Диалог" },
    ],
  }),
});
