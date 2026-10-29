import { createFileRoute, notFound } from "@tanstack/react-router";
import ChampionshipSalon, { loadSalonProfile } from "@/pages/championship/ChampionshipSalon";

const EMPTY = { salon: null, rating: null, achievements: [], works: [], history: [], services: [] };

export const Route = createFileRoute("/championship/salon/$id")({
  loader: async ({ params }) => {
    const data = await loadSalonProfile(params.id);
    if (!data.salon) throw notFound();
    return data;
  },
  component: SalonRoute,
  notFoundComponent: () => <ChampionshipSalon data={EMPTY} />,
});

function SalonRoute() {
  const data = Route.useLoaderData();
  return <ChampionshipSalon data={data} />;
}
