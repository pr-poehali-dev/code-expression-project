import { createFileRoute } from "@tanstack/react-router";
import ClientViewLanding from "@/pages/client-view-landing/ClientViewLanding";
import { clientViewHead } from "@/pages/client-view-landing/seo";

export const Route = createFileRoute("/instrumenty/client-view")({
  component: ClientViewLanding,
  head: () => clientViewHead(),
});
