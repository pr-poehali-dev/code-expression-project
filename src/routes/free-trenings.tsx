import { createFileRoute } from "@tanstack/react-router";
import FreeTrenings from "@/pages/FreeTrenings";

export const Route = createFileRoute("/free-trenings")({
  component: FreeTrenings,
  head: () => ({
    meta: [
      { title: "Бесплатные онлайн-тренинги для мастеров и администраторов | Промт Диалог" },
      { "name": "description", "content": "Бесплатные онлайн-тренинги для мастеров, администраторов, массажистов и специалистов бьюти и wellness. Психология общения с клиентом, личный бренд, самопрезентация. Доступны сразу после регистрации." },
      { "name": "keywords", "content": "бесплатные тренинги для мастеров, онлайн курсы для администраторов салона, обучение для мастеров красоты, тренинг для массажистов, психология общения с клиентом, личный бренд мастера, академия про диалог" },
      { "property": "og:type", "content": "website" },
      { "property": "og:url", "content": "https://promtdialog.ru/free-trenings" },
      { "property": "og:title", "content": "Бесплатные онлайн-тренинги для мастеров и администраторов" },
      { "property": "og:description", "content": "Получите бесплатный доступ к практическим тренингам по психологии общения, личному бренду и самопрезентации. Для специалистов индустрии красоты и здоровья." },
      { "property": "og:image", "content": "https://cdn.poehali.dev/projects/10f61e56-9821-40f3-b705-3590ddaffd08/bucket/courses/covers/16/training-image (1).png" },
      { "property": "og:locale", "content": "ru_RU" },
      { "property": "og:site_name", "content": "Промт Диалог" },
      { "name": "twitter:card", "content": "summary_large_image" },
      { "name": "twitter:title", "content": "Бесплатные онлайн-тренинги для мастеров и администраторов" },
      { "name": "twitter:description", "content": "Получите бесплатный доступ к практическим тренингам по психологии общения, личному бренду и самопрезентации." },
      { "name": "twitter:image", "content": "https://cdn.poehali.dev/projects/10f61e56-9821-40f3-b705-3590ddaffd08/bucket/courses/covers/16/training-image (1).png" },
      { "name": "robots", "content": "index, follow" },
    ],
  }),
});
