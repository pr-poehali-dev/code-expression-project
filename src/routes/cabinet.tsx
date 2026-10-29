import { createFileRoute } from "@tanstack/react-router";
import ClientOnlyFallback from "@/components/ClientOnlyFallback";
import LkPage from "@/pages/lk/LkPage";

export const Route = createFileRoute("/cabinet")({
  ssr: false,
  pendingComponent: () => <ClientOnlyFallback label="Личный кабинет Промт Диалог — загрузка" />,
  component: LkPage,
});
