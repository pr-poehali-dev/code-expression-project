import { createFileRoute } from "@tanstack/react-router";
import PremiumPraktika from "@/pages/PremiumPraktika";

export const Route = createFileRoute("/premium")({
  component: PremiumPraktika,
  head: () => ({
    meta: [
      { title: "«Премиальная практика» — тариф №2 | Dok Диалог" },
      { "name": "description", "content": "Программа для специалистов, которые хотят выйти на высокий чек, работать с платёжеспособной аудиторией и получить ИИ-инструменты нового уровня. 290 000 ₽." },
      { "property": "og:title", "content": "«Премиальная практика» — тариф №2 | Dok Диалог" },
    ],
  }),
});
