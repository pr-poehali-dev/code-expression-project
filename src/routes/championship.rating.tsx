import { createFileRoute } from "@tanstack/react-router";
import ChampionshipRating, { loadChampionshipRating } from "@/pages/championship/ChampionshipRating";

export const Route = createFileRoute("/championship/rating")({
  loader: () => loadChampionshipRating(),
  component: RatingRoute,
});

function RatingRoute() {
  const data = Route.useLoaderData();
  return <ChampionshipRating initial={data} />;
}
