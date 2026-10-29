import { createFileRoute } from "@tanstack/react-router";
import DlyaKogo from "@/pages/DlyaKogo";

export const Route = createFileRoute("/dlya-kogo")({
  component: DlyaKogo,
  head: () => ({
    meta: [
      { title: "Для кого платформа — владельцы, администраторы, мастера, психологи | Промт Диалог" },
      { "name": "description", "content": "Промт Диалог помогает владельцам компаний, администраторам, мастерам и психологам в частной практике: инструменты под каждую роль. Маркетинг, управление, скрипты и обучение." },
      { "name": "keywords", "content": "платформа для владельца салона, инструменты для администратора, обучение мастеров, платформа для психолога, частная практика психолога" },
      { "property": "og:title", "content": "Для кого Промт Диалог — инструменты под каждую роль" },
      { "property": "og:description", "content": "Владельцы, администраторы, мастера, психологи — у каждого свои инструменты для роста и развития." },
      { "property": "og:url", "content": "https://promtdialog.ru/dlya-kogo" },
      { "property": "og:type", "content": "website" },
      { "name": "twitter:card", "content": "summary_large_image" },
    ],
  }),
});
