import { createFileRoute } from "@tanstack/react-router";
import ComingSoon from "@/pages/ComingSoon";

export const Route = createFileRoute("/coming-soon")({
  component: ComingSoon,
  head: () => ({
    meta: [
      { title: "Скоро открытие — Промт Диалог" },
      { "name": "description", "content": "Курсы платформы «Промт Диалог» скоро появятся в постоянной продаже. Оставьте заявку сейчас и получите скидку 70% — после запуска такой цены не будет." },
    ],
  }),
});
