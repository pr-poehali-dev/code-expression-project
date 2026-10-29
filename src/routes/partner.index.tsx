import { createFileRoute } from "@tanstack/react-router";
import ClientOnlyFallback from "@/components/ClientOnlyFallback";
import PartnerPage from "@/pages/partner/PartnerPage";

export const Route = createFileRoute("/partner/")({
  ssr: false,
  pendingComponent: () => <ClientOnlyFallback label="Партнерский кабинет Промт Диалог — загрузка" />,
  component: PartnerPage,
  head: () => ({
    meta: [
      { title: "Партнерский кабинет | Промт Диалог" },
      { "name": "robots", "content": "noindex, nofollow" },
    ],
  }),
});
