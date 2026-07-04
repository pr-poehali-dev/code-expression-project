import { useState, useEffect } from "react";
import { useLkAuth } from "@/contexts/LkAuthContext";
import Icon from "@/components/ui/icon";
import {
  apiGet,
  Tournament, MyTournament, SalonRating,
  LEVEL_LABELS, LEVEL_COLORS,
  RatingBadge,
} from "./LkChampionshipShared";
import { TournamentsView, MyTournamentsView } from "./LkChampionshipTournaments";
import { SubmitWorkView } from "./LkChampionshipSubmit";
import { ShareView } from "./LkChampionshipShare";

export default function LkChampionship() {
  const { user } = useLkAuth();
  const salonId = user?.salon_id;

  const [view, setView] = useState<"tournaments" | "my" | "submit" | "share">("tournaments");
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [myTournaments, setMyTournaments] = useState<MyTournament[]>([]);
  const [rating, setRating] = useState<SalonRating | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedTournament, setSelectedTournament] = useState<Tournament | null>(null);
  const [activeMy, setActiveMy] = useState<MyTournament | null>(null);

  const load = () => {
    setLoading(true);
    const promises: Promise<void>[] = [
      apiGet("tournaments", { statuses: "announced,registration,active,voting,finished_pending" })
        .then(d => setTournaments(d.tournaments || [])),
    ];
    if (salonId) {
      promises.push(
        apiGet("my_tournaments").then(d => {
          setMyTournaments(d.my_tournaments || []);
          setRating(d.rating || null);
        })
      );
    }
    Promise.all(promises).finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  if (!salonId) {
    return (
      <div style={{ padding: "48px 24px", textAlign: "center" }}>
        <div style={{ fontSize: 40, marginBottom: 12 }}>🏆</div>
        <div style={{ fontSize: 18, fontWeight: 700, color: "#0f172a", marginBottom: 8 }}>Чемпионат красоты</div>
        <div style={{ fontSize: 14, color: "#64748b", marginBottom: 20 }}>
          Для участия в чемпионате нужно привязать профиль салона
        </div>
      </div>
    );
  }

  return (
    <div style={{ fontFamily: "Inter, sans-serif" }}>
      {/* Шапка */}
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ margin: "0 0 4px", fontSize: 24, fontWeight: 800, color: "#0f172a", fontFamily: "Cormorant, serif" }}>
          🏆 Чемпионат красоты
        </h1>
        <p style={{ margin: 0, fontSize: 14, color: "#64748b" }}>
          Участвуй в турнирах, загружай работы и собирай голоса
        </p>
      </div>

      {/* Рейтинг салона */}
      {rating && (
        <>
          <div style={{ display: "flex", gap: 10, marginBottom: 8, flexWrap: "wrap" }}>
            <RatingBadge label="Очки" value={rating.total_points.toLocaleString("ru")} />
            <RatingBadge label="Уровень" value={LEVEL_LABELS[rating.level] || rating.level} color={LEVEL_COLORS[rating.level]} />
            <RatingBadge label="Участий" value={String(rating.participations)} />
            <RatingBadge label="Побед" value={String(rating.wins)} icon="🏆" />
            <RatingBadge label="Топ-3" value={String(rating.top3_count)} icon="🥉" />
          </div>
          <p style={{ margin: "0 0 24px", fontSize: 12.5, color: "#94a3b8" }}>
            Статус виден всем в рейтинге салонов и на вашей публичной странице — так клиенты видят вашу узнаваемость
          </p>
        </>
      )}

      {/* Табы */}
      <div style={{ display: "flex", gap: 4, background: "#f1f5f9", borderRadius: 12, padding: 4, marginBottom: 24, width: "fit-content", maxWidth: "100%", overflowX: "auto" }}>
        {[
          { id: "tournaments" as const, label: "Турниры",    icon: "Trophy"    },
          { id: "my"          as const, label: "Мои заявки", icon: "ClipboardList", badge: myTournaments.length },
        ].map(t => (
          <button key={t.id} onClick={() => setView(t.id)} style={{
            display: "flex", alignItems: "center", gap: 6, padding: "9px 16px",
            borderRadius: 9, border: "none",
            background: view === t.id ? "#fff" : "transparent",
            color: view === t.id ? "#0f172a" : "#64748b",
            fontSize: 14, fontWeight: 600, cursor: "pointer", whiteSpace: "nowrap",
            boxShadow: view === t.id ? "0 1px 4px rgba(0,0,0,0.08)" : "none",
          }}>
            <Icon name={t.icon} size={14} />
            {t.label}
            {t.badge ? (
              <span style={{ background: view === t.id ? "#0f172a" : "#cbd5e1", color: "#fff", borderRadius: 10, padding: "1px 7px", fontSize: 11, fontWeight: 700 }}>
                {t.badge}
              </span>
            ) : null}
          </button>
        ))}
      </div>

      {loading ? (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {[1,2].map(i => <div key={i} style={{ height: 100, borderRadius: 14, background: "#e2e8f0" }} />)}
        </div>
      ) : view === "tournaments" ? (
        <TournamentsView
          tournaments={tournaments}
          myTournaments={myTournaments}
          onApplied={load}
          onOpenWork={(t, my) => { setSelectedTournament(t); setActiveMy(my); setView("submit"); }}
          onShare={(t, my) => { setSelectedTournament(t); setActiveMy(my); setView("share"); }}
        />
      ) : view === "my" ? (
        <MyTournamentsView
          myTournaments={myTournaments}
          tournaments={tournaments}
          onOpenWork={(t, my) => { setSelectedTournament(t); setActiveMy(my); setView("submit"); }}
          onShare={(t, my) => { setSelectedTournament(t); setActiveMy(my); setView("share"); }}
        />
      ) : view === "submit" && selectedTournament && activeMy ? (
        <SubmitWorkView
          tournament={selectedTournament}
          my={activeMy}
          onBack={() => { setView("my"); load(); }}
          onSaved={() => { load(); setView(selectedTournament?.status === "voting" ? "share" : "my"); }}
        />
      ) : view === "share" && selectedTournament && activeMy ? (
        <ShareView
          tournament={selectedTournament}
          my={activeMy}
          onBack={() => setView("my")}
        />
      ) : null}
    </div>
  );
}