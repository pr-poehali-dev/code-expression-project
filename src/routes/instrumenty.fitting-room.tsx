import { createFileRoute } from "@tanstack/react-router";
import PrimerochnayaLanding from "@/pages/PrimerochnayaLanding";

export const Route = createFileRoute("/instrumenty/fitting-room")({
  component: PrimerochnayaLanding,
  head: () => ({
    meta: [
      { title: "Примерочная — ИИ показывает новый образ клиента за секунды | Промт Диалог" },
      { "name": "description", "content": "Мастер фотографирует клиента и по его пожеланиям показывает новую стрижку, макияж, маникюр или стиль ещё на консультации. Экономит время, материалы и убирает разрыв между ожиданием и результатом." },
      { "name": "keywords", "content": "примерочная для салона красоты, виртуальная примерка стрижки, ИИ примерка образа, примерка макияжа онлайн, инструменты для мастера салона" },
    ],
  }),
});
