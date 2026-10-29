import { createFileRoute } from "@tanstack/react-router";
import PartnerRules from "@/pages/partner-rules/PartnerRules";

export const Route = createFileRoute("/partner/rules")({
  component: PartnerRules,
  head: () => ({
    meta: [
      { title: "Правила партнерской программы — Промт Диалог" },
      { "name": "description", "content": "Правила партнерской программы «Промт Диалог»: как работают рекомендации услуг партнеров, модерация, встречные обязательства, данные пользователей и ответственность." },
      { "name": "robots", "content": "index, follow" },
      { "property": "og:title", "content": "Правила партнерской программы — Промт Диалог" },
      { "property": "og:url", "content": "https://promtdialog.ru/partner/rules" },
      { "property": "og:type", "content": "article" },
    ],
  }),
});
