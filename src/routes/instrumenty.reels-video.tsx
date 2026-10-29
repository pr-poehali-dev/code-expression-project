import { createFileRoute } from "@tanstack/react-router";
import ReelsVideoLanding from "@/pages/ReelsVideoLanding";

export const Route = createFileRoute("/instrumenty/reels-video")({
  component: ReelsVideoLanding,
  head: () => ({
    meta: [
      { title: "Сценарии и видео для Reels — контент салона за минуты | Промт Диалог" },
      { "name": "description", "content": "ИИ пишет покадровый сценарий для рилса под вашу услугу и цель, готовит обложку и может сразу сгенерировать видео. Регулярный качественный контент для привлечения клиентов и репутации салона." },
      { "name": "keywords", "content": "сценарий для рилс, генератор видео для салона красоты, контент для инстаграм салона, ИИ видео для соцсетей, продвижение салона красоты видео" },
    ],
  }),
});
