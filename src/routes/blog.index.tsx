import { createFileRoute } from "@tanstack/react-router";
import BlogPage, { loadBlogList } from "@/pages/BlogPage";

export const Route = createFileRoute("/blog/")({
  loaderDeps: ({ search }) => {
    const role = (search as Record<string, unknown>).role;
    return { role: typeof role === "string" ? role : "" };
  },
  loader: ({ deps }) => loadBlogList(deps.role),
  component: BlogRoute,
  head: () => ({
    meta: [
      { title: "Полезная лента — подсказки по сегментам для салонов красоты | Промт Диалог" },
      { name: "description", content: "Каждый день новые рекомендации по оптимизации салона: маркетинг, допродажи, работа с клиентами, управление мастерами — под вашу роль в салоне." },
      { property: "og:title", content: "Полезная лента Промт Диалог — подсказки по сегментам" },
      { property: "og:type", content: "website" },
    ],
  }),
});

function BlogRoute() {
  const data = Route.useLoaderData();
  return <BlogPage key={data.role} initial={data} />;
}
