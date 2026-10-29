import { createFileRoute } from "@tanstack/react-router";
import ImagePrimerkaLanding from "@/pages/ImagePrimerkaLanding";

export const Route = createFileRoute("/ii-primerka-obraza")({
  component: ImagePrimerkaLanding,
  head: () => ({
    meta: [
      { title: "ИИ-примерка образа — согласуйте ожидания до услуги | Промт Диалог" },
      { "name": "description", "content": "Не угадывайте, какой результат клиент назвал «красиво». Покажите направление образа до записи или до начала работы и обсудите ожидания на одном языке — ИИ-примерка для бьюти-мастеров и салонов." },
      { "name": "keywords", "content": "ии примерка образа, согласование ожиданий с клиентом, виртуальная примерка для салона красоты, примерка стрижки онлайн, инструменты для мастера бьюти" },
    ],
  }),
});
