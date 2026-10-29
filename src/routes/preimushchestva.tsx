import { createFileRoute } from "@tanstack/react-router";
import Preimushchestva from "@/pages/Preimushchestva";

export const Route = createFileRoute("/preimushchestva")({
  component: Preimushchestva,
  head: () => ({
    meta: [
      { title: "Почему Промт Диалог — преимущества платформы для салона красоты" },
      { "name": "description", "content": "5 ключевых преимуществ платформы Промт Диалог: ИИ-агенты под вашу ситуацию, измеримый ROI, вовлечённость команды и быстрый старт." },
      { "name": "keywords", "content": "преимущества платформы, почему Промт Диалог, ИИ для салона, рост выручки салона" },
      { "property": "og:title", "content": "Почему Промт Диалог — 5 преимуществ платформы" },
      { "property": "og:url", "content": "https://promtdialog.ru/preimushchestva" },
      { "property": "og:type", "content": "website" },
    ],
  }),
});
