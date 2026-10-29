import { createFileRoute, notFound } from "@tanstack/react-router";
import ToolLanding, { isKnownTool, toolLandingHead } from "@/pages/ToolLanding";

export const Route = createFileRoute("/instrumenty/$slug")({
  loader: ({ params }) => {
    if (!isKnownTool(params.slug)) throw notFound();
    return null;
  },
  component: ToolLanding,
  head: ({ params }) => toolLandingHead(params.slug),
});
