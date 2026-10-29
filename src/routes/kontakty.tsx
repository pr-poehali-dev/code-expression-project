import { createFileRoute } from "@tanstack/react-router";
import Kontakty from "@/pages/Kontakty";

export const Route = createFileRoute("/kontakty")({
  component: Kontakty,
});
