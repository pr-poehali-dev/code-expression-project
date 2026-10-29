import { createFileRoute } from "@tanstack/react-router";
import Akademiya from "@/pages/Akademiya";

export const Route = createFileRoute("/akademiya")({
  component: Akademiya,
  head: () => ({
    meta: [
      { title: "Прокачка навыков — тренинги с ИИ-агентом | Промт Диалог" },
      { "name": "description", "content": "Онлайн и офлайн тренинги для специалистов и команд салона. Прокачай навыки, которые влияют на доход и сервис. Бесплатные и платные программы без ловушек." },
      { "name": "keywords", "content": "тренинги для салона красоты, обучение мастеров, прокачка навыков, ИИ-агент обучение" },
      { "property": "og:title", "content": "Прокачка навыков — тренинги с ИИ-агентом | Промт Диалог" },
      { "property": "og:description", "content": "Развивайся вместе с ИИ-агентом. Удобно. Персонально. Эффективно." },
      { "property": "og:url", "content": "https://promtdialog.ru/akademiya" },
      { "property": "og:type", "content": "website" },
      { "name": "twitter:card", "content": "summary_large_image" },
    ],
    scripts: [
      { type: "application/ld+json", children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "EducationalOrganization",
          "name": "Прокачка навыков — Промт Диалог",
          "url": "https://promtdialog.ru/akademiya",
          "description": "Онлайн и офлайн тренинги для специалистов и команд салона красоты.",
          "parentOrganization": { "@type": "Organization", "name": "Промт Диалог", "url": "https://promtdialog.ru" }
        }) },
    ],
  }),
});
