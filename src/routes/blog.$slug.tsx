import { createFileRoute, notFound } from "@tanstack/react-router";
import BlogPostPage, { BlogPostNotFound, blogPostHead, loadBlogPost } from "@/pages/BlogPostPage";

export const Route = createFileRoute("/blog/$slug")({
  loader: async ({ params }) => {
    const data = await loadBlogPost(params.slug);
    if (!data) throw notFound();
    return data;
  },
  head: ({ loaderData }) => blogPostHead(loaderData),
  component: BlogPostRoute,
  notFoundComponent: BlogPostNotFound,
});

function BlogPostRoute() {
  const data = Route.useLoaderData();
  return <BlogPostPage key={data.post.slug} data={data} />;
}
