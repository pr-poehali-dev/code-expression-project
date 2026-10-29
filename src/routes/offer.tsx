import { createFileRoute } from "@tanstack/react-router";
import Offer from "@/pages/Offer";

export const Route = createFileRoute("/offer")({
  component: Offer,
});
