import { createFileRoute } from "@tanstack/react-router";
import Praktika from "@/pages/Praktika";

export const Route = createFileRoute("/praktika")({
  component: Praktika,
  head: () => ({
    meta: [
      { title: "«Практика» — тариф №1 | Dok Диалог" },
      { "name": "description", "content": "Система для специалистов по телу и состояниям, которые хотят выйти из хаоса, повысить стоимость услуг и привлекать платёжеспособных клиентов. 90 900 ₽, доступ 12 месяцев." },
      { "property": "og:title", "content": "«Практика» — тариф №1 | Dok Диалог" },
    ],
  }),
});
