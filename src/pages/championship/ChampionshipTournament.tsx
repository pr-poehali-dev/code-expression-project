import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { champGet, champPost, voteGet, votePost, STATUS_LABELS, STATUS_COLORS } from "./championshipApi";
import { useLkAuth } from "@/contexts/LkAuthContext";
import { Tournament, Work, CT_CSS } from "./tournamentTypes";
import TournamentHeader from "./TournamentHeader";
import TournamentInfoTab from "./TournamentInfoTab";
import TournamentWorksTab from "./TournamentWorksTab";

const getSessionId = () => localStorage.getItem("lk_session") || "";

export default function ChampionshipTournament() {
  const { slug } = useParams<{ slug: string }>();
  const { user } = useLkAuth();
  const [tournament, setTournament] = useState<Tournament | null>(null);
  const [works, setWorks] = useState<Work[]>([]);
  const [loading, setLoading] = useState(true);
  const [votedIds, setVotedIds] = useState<number[]>([]);
  const [applying, setApplying] = useState(false);
  const [applied, setApplied] = useState(false);
  const [voteLoading, setVoteLoading] = useState<number | null>(null);
  const [tab, setTab] = useState<"info" | "works">("info");

  useEffect(() => {
    if (!slug) return;
    const sid = getSessionId();
    champGet("tournament", { slug }, sid || undefined).then(d => {
      setTournament(d.tournament);
      if (d.tournament?.my_application_status) setApplied(true);
      if (d.tournament && ["voting", "finished"].includes(d.tournament.status)) {
        setTab("works");
        champGet("works", { tournament_id: String(d.tournament.id) }).then(w => setWorks(w.works || []));
      }
    }).finally(() => setLoading(false));
  }, [slug]);

  useEffect(() => {
    if (!tournament || !["voting", "finished"].includes(tournament.status)) return;
    const fp = navigator.userAgent + screen.width + screen.height;
    voteGet("my_votes", { tournament_id: String(tournament.id) }, getSessionId() || undefined, fp)
      .then(d => setVotedIds(d.voted_work_ids || []));
  }, [tournament]);

  const handleApply = async () => {
    const sid = getSessionId();
    if (!sid || !tournament) return;
    setApplying(true);
    const r = await champPost("apply", { tournament_id: tournament.id }, sid);
    setApplying(false);
    if (r.ok || r.already_applied) setApplied(true);
  };

  const handleVote = async (workId: number) => {
    if (votedIds.includes(workId)) return;
    setVoteLoading(workId);
    const fp = navigator.userAgent + screen.width + screen.height;
    const r = await votePost("vote", { work_id: workId }, getSessionId() || undefined, fp);
    setVoteLoading(null);
    if (r.ok) {
      setVotedIds(prev => [...prev, workId]);
      setWorks(prev => prev.map(w => w.id === workId ? { ...w, votes_count: r.votes_count } : w));
    }
  };

  if (loading) return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#f8fafc" }}>
      <style>{`@keyframes ct-spin{to{transform:rotate(360deg)}}`}</style>
      <div style={{ width: 36, height: 36, border: "3px solid #e2e8f0", borderTopColor: "#14B8A6", borderRadius: "50%", animation: "ct-spin 0.7s linear infinite" }} />
    </div>
  );

  if (!tournament) return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "Inter,sans-serif", padding: 24 }}>
      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: 48 }}>🔍</div>
        <div style={{ fontSize: 18, fontWeight: 700, marginTop: 12 }}>Турнир не найден</div>
        <Link to="/championship" style={{ color: "#14B8A6", marginTop: 12, display: "block" }}>← Назад к чемпионату</Link>
      </div>
    </div>
  );

  const t = tournament;
  const statusColor = STATUS_COLORS[t.status] || "#64748b";
  const statusLabel = STATUS_LABELS[t.status] || t.status;
  const registrationOpen = !t.registration_ends || new Date(t.registration_ends).getTime() > Date.now();
  const canApply = ["announced", "registration"].includes(t.status) && registrationOpen && !!user && !applied;
  const isVoting = t.status === "voting";
  const isFinished = t.status === "finished";

  const tabItems = [
    { id: "info" as const,  label: "О турнире" },
    ...(works.length > 0 || isVoting || isFinished
      ? [{ id: "works" as const, label: `Работы${works.length > 0 ? ` (${works.length})` : ""}` }]
      : []),
  ];

  return (
    <div className="ct-wrap">
      <style>{CT_CSS}</style>

      <TournamentHeader t={t} statusColor={statusColor} statusLabel={statusLabel} registrationOpen={registrationOpen}
        canApply={canApply} applying={applying} applied={applied} user={user} onApply={handleApply} />

      <div className="ct-content">
        {/* Табы */}
        <div className="ct-tabs">
          {tabItems.map(tb => (
            <button key={tb.id} onClick={() => setTab(tb.id)}
              className={`ct-tab${tab === tb.id ? " ct-tab-active" : ""}`}>
              {tb.label}
            </button>
          ))}
        </div>

        {/* О турнире */}
        {tab === "info" && <TournamentInfoTab t={t} />}

        {/* Работы */}
        {tab === "works" && (
          <TournamentWorksTab works={works} isVoting={isVoting} isFinished={isFinished}
            votedIds={votedIds} voteLoading={voteLoading}
            tournamentSlug={t.slug} tournamentName={t.name} onVote={handleVote} />
        )}
      </div>
    </div>
  );
}
