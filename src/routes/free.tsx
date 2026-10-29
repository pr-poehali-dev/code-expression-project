import { createFileRoute } from "@tanstack/react-router";
import FreeTarif from "@/pages/FreeTarif";

export const Route = createFileRoute("/free")({
  component: FreeTarif,
  head: () => ({
    meta: [
      { title: "Бесплатный доступ · Dok Диалог — Старт | Dok Диалог" },
      { "name": "description", "content": "Бесплатный вводный блок платформы Dok Диалог. 5 видео, разборы практики, демонстрация ИИ-инструментов. Для специалистов по телу и состояниям." },
      { "property": "og:title", "content": "Бесплатный доступ · Dok Диалог — Старт" },
      { "property": "og:description", "content": "Смена взгляда на профессию. Поймёте, почему практика не растёт — и как это изменить." },
    ],
  }),
});
