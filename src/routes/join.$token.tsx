import { createFileRoute } from "@tanstack/react-router";
import ClientOnlyFallback from "@/components/ClientOnlyFallback";
import LkJoinPage from "@/pages/lk/LkJoinPage";

export const Route = createFileRoute("/join/$token")({
  ssr: false,
  pendingComponent: () => <ClientOnlyFallback label="Приглашение в команду Промт Диалог — загрузка" />,
  component: LkJoinPage,
});
