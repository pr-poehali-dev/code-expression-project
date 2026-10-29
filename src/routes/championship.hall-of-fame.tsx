import { createFileRoute } from "@tanstack/react-router";
import ChampionshipHallOfFame, { loadHallOfFame } from "@/pages/championship/ChampionshipHallOfFame";

export const Route = createFileRoute("/championship/hall-of-fame")({
  loader: () => loadHallOfFame(),
  component: HallOfFameRoute,
});

function HallOfFameRoute() {
  const data = Route.useLoaderData();
  return <ChampionshipHallOfFame initial={data} />;
}
