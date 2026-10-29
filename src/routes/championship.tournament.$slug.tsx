import { createFileRoute } from "@tanstack/react-router";
import ChampionshipTournament from "@/pages/championship/ChampionshipTournament";

export const Route = createFileRoute("/championship/tournament/$slug")({
  component: ChampionshipTournament,
});
