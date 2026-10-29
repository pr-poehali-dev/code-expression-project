import { createFileRoute } from "@tanstack/react-router";
import EkspertTarif from "@/pages/EkspertTarif";

export const Route = createFileRoute("/ekspert")({
  component: EkspertTarif,
  head: () => ({
    meta: [
      { title: "«Dok Диалог — Эксперт» — тариф №3 | VIP | Dok Диалог" },
      { "name": "description", "content": "Закрытая система профессиональной трансформации специалиста. Пожизненный доступ, 10 встреч, все ИИ-инструменты без ограничений. 500 000 ₽." },
      { "property": "og:title", "content": "«Dok Диалог — Эксперт» — тариф №3 VIP | Dok Диалог" },
    ],
  }),
});
