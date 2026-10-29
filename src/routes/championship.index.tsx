import { createFileRoute } from "@tanstack/react-router";
import ChampionshipPage, { loadChampionship } from "@/pages/championship/ChampionshipPage";

export const Route = createFileRoute("/championship/")({
  loader: () => loadChampionship(),
  component: ChampionshipRoute,
});

function ChampionshipRoute() {
  const data = Route.useLoaderData();
  return <ChampionshipPage data={data} />;
}
