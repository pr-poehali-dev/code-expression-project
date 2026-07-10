import { Link } from "react-router-dom";
import { Tournament } from "./tournamentTypes";
import { LkUser } from "@/contexts/LkAuthContext";

interface TournamentHeaderProps {
  t: Tournament;
  statusColor: string;
  statusLabel: string;
  registrationOpen: boolean;
  canApply: boolean;
  applying: boolean;
  applied: boolean;
  user: LkUser | null;
  onApply: () => void;
}

export default function TournamentHeader({ t, statusColor, statusLabel, registrationOpen, canApply, applying, applied, user, onApply }: TournamentHeaderProps) {
  return (
    <>
      {/* Шапка */}
      <div className="ct-header">
        <div className="ct-header-inner">
          <Link to="/championship" className="ct-back">← Чемпионат</Link>
          <div className="ct-title-row">
            <div className="ct-emoji">{t.emoji}</div>
            <div className="ct-title-info">
              {t.season_name && <div className="ct-season">{t.season_name.toUpperCase()}</div>}
              <h1 className="ct-h1">{t.name}</h1>
              <div className="ct-badges">
                <span style={{ background: `${statusColor}25`, color: statusColor, borderRadius: 20, padding: "4px 12px", fontSize: 12, fontWeight: 700 }}>{statusLabel}</span>
                {t.applications_count > 0 && <span style={{ color: "rgba(255,255,255,0.5)", fontSize: 12 }}>{t.applications_count} участников</span>}
                {t.prize_energy > 0 && <span style={{ color: "#14B8A6", fontSize: 12, fontWeight: 700 }}>{t.prize_energy} ⚡ победителю</span>}
              </div>
            </div>
            {canApply && (
              <button className="ct-apply-btn" onClick={onApply} disabled={applying}>
                {applying ? "Подаём…" : "Участвовать"}
              </button>
            )}
            {applied && <div className="ct-applied-badge">✓ Заявка подана</div>}
            {!user && ["announced", "registration"].includes(t.status) && registrationOpen && (
              <Link to="/cabinet" className="ct-login-btn">Войти →</Link>
            )}
          </div>
        </div>
      </div>

      {t.postponed && (
        <div className="ct-postponed">⏰ {t.postpone_reason}</div>
      )}
    </>
  );
}
