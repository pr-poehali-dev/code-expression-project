import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Icon from "@/components/ui/icon";
import { champGet, LEVEL_LABELS, LEVEL_COLORS } from "./championshipApi";

interface RatingEntry {
  salon_id: number; salon_name: string; logo_url: string; city: string; website_url: string;
  total_points: number; participations: number; wins: number; top3_count: number; level: string;
}

const PLACE_BORDER = ["#f59e0b", "#94a3b8", "#cd7c2f"];

export default function ChampionshipRating() {
  const [rating, setRating] = useState<RatingEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [city, setCity] = useState("");

  const load = (c = "") => {
    setLoading(true);
    const params: Record<string, string> = { limit: "50" };
    if (c) params.city = c;
    champGet("rating", params).then(d => setRating(d.rating || [])).finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  return (
    <div style={{ minHeight: "100vh", background: "#f8fafc", fontFamily: "Inter, sans-serif" }}>
      <style>{`
        .cr-header { background: linear-gradient(135deg,#0f172a,#1e3a5f); padding: 18px 16px; }
        .cr-header-inner { max-width: 900px; margin: 0 auto; display: flex; align-items: center; gap: 12; flex-wrap: wrap; gap: 12px; }
        .cr-content { max-width: 900px; margin: 0 auto; padding: 24px 16px 64px; }
        .cr-filter { display: flex; gap: 8px; margin-bottom: 20px; }
        .cr-filter input { flex: 1; max-width: 280px; padding: 9px 12px; border-radius: 10px; border: 1.5px solid #e2e8f0; font-size: 14px; outline: none; }
        .cr-filter-btn { padding: 9px 16px; border-radius: 10px; border: none; background: #14B8A6; color: #fff; font-size: 14px; font-weight: 700; cursor: pointer; }
        .cr-filter-clear { padding: 9px 12px; border-radius: 10px; border: 1.5px solid #e2e8f0; background: #fff; font-size: 13px; cursor: pointer; }
        .cr-row { background: #fff; border-radius: 14px; border: 1.5px solid #e2e8f0; padding: 14px 16px; display: flex; align-items: center; gap: 12px; text-decoration: none; transition: box-shadow 0.15s; }
        @media (hover: hover) { .cr-row:hover { box-shadow: 0 4px 16px rgba(0,0,0,0.08); } }
        .cr-place { width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; flex-shrink: 0; font-size: 14px; font-weight: 900; }
        .cr-logo { width: 38px; height: 38px; border-radius: 9px; object-fit: cover; flex-shrink: 0; }
        .cr-logo-placeholder { width: 38px; height: 38px; border-radius: 9px; background: #f1f5f9; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
        .cr-info { flex: 1; min-width: 0; }
        .cr-name { font-size: 14px; font-weight: 700; color: #0f172a; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .cr-city { font-size: 12px; color: #94a3b8; }
        .cr-pts { text-align: right; flex-shrink: 0; }
        .cr-pts-num { font-size: 17px; font-weight: 900; color: #0f172a; }
        .cr-stats { display: flex; gap: 10px; flex-shrink: 0; }
        .cr-stat { text-align: center; }
        .cr-stat-num { font-size: 14px; font-weight: 700; color: #0f172a; }
        .cr-stat-label { font-size: 10px; color: #94a3b8; }
        /* Скрываем статы на очень маленьких экранах */
        @media (max-width: 420px) { .cr-stats { display: none; } .cr-pts-num { font-size: 15px; } }
        @keyframes cr-pulse { 0%,100%{opacity:1} 50%{opacity:.5} }
        .cr-skeleton { border-radius: 12px; background: #e2e8f0; animation: cr-pulse 1.5s ease infinite; }
      `}</style>

      <div className="cr-header">
        <div className="cr-header-inner">
          <Link to="/championship" style={{ color: "rgba(255,255,255,0.5)", textDecoration: "none", fontSize: 13, whiteSpace: "nowrap" }}>← Чемпионат</Link>
          <h1 style={{ margin: 0, fontSize: "clamp(17px,3vw,22px)", fontWeight: 800, color: "#fff" }}>Рейтинг салонов</h1>
        </div>
      </div>

      <div className="cr-content">
        <div className="cr-filter">
          <input
            value={city}
            onChange={e => setCity(e.target.value)}
            onKeyDown={e => e.key === "Enter" && load(city)}
            placeholder="Фильтр по городу…"
          />
          <button className="cr-filter-btn" onClick={() => load(city)}>Найти</button>
          {city && (
            <button className="cr-filter-clear" onClick={() => { setCity(""); load(""); }}>✕</button>
          )}
        </div>

        {loading ? (
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {[1,2,3,4,5].map(i => <div key={i} className="cr-skeleton" style={{ height: 66 }} />)}
          </div>
        ) : rating.length === 0 ? (
          <div style={{ textAlign: "center", padding: "56px 0" }}>
            <div style={{ fontSize: 36, marginBottom: 10 }}>📊</div>
            <div style={{ fontSize: 16, fontWeight: 700, color: "#0f172a" }}>Рейтинг пока пуст</div>
            <div style={{ fontSize: 13, color: "#94a3b8", marginTop: 4 }}>Участвуйте в турнирах чтобы попасть в рейтинг</div>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {rating.map((r, i) => {
              const levelColor = LEVEL_COLORS[r.level] || "#94a3b8";
              const levelLabel = LEVEL_LABELS[r.level] || r.level;
              const isLegend = r.level === "legend";
              const isPremium = r.level === "premium";
              const borderColor = isLegend ? "#f97316" : isPremium ? "#ec4899" : i < 3 ? `${PLACE_BORDER[i]}40` : "#e2e8f0";
              const placeBg = i === 0 ? "#fef3c7" : i === 1 ? "#f1f5f9" : i === 2 ? "#fdf4e7" : "#f8fafc";
              const placeColor = i === 0 ? "#d97706" : i === 1 ? "#64748b" : i === 2 ? "#b45309" : "#94a3b8";
              return (
                <Link key={r.salon_id} to={`/championship/salon/${r.salon_id}`}
                  className="cr-row" style={{
                    borderColor,
                    borderWidth: (isLegend || isPremium) ? 2 : 1.5,
                    background: isLegend ? "linear-gradient(135deg,#fff7ed,#fff)" : isPremium ? "linear-gradient(135deg,#fdf2f8,#fff)" : "#fff",
                    boxShadow: isLegend ? "0 0 0 1px #f9731630, 0 4px 16px rgba(249,115,22,0.12)" : isPremium ? "0 0 0 1px #ec489930, 0 4px 16px rgba(236,72,153,0.1)" : undefined,
                  }}>
                  <div className="cr-place" style={{ background: placeBg, color: placeColor }}>
                    {i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : i + 1}
                  </div>
                  {r.logo_url
                    ? <img src={r.logo_url} alt={r.salon_name} className="cr-logo" style={(isLegend || isPremium) ? { border: `2px solid ${levelColor}` } : undefined} />
                    : <div className="cr-logo-placeholder"><Icon name="Store" size={16} style={{ color: "#94a3b8" }} /></div>
                  }
                  <div className="cr-info">
                    <div className="cr-name" style={{ display: "flex", alignItems: "center", gap: 5 }}>
                      {r.salon_name}
                      {isLegend && <span title="Легенда">🔥</span>}
                      {isPremium && <span title="Премиум">💎</span>}
                    </div>
                    <div className="cr-city">{r.city}</div>
                  </div>
                  <div className="cr-pts">
                    <div className="cr-pts-num">{r.total_points.toLocaleString("ru")}</div>
                    <div style={{ fontSize: 10, color: levelColor, fontWeight: 700 }}>{levelLabel}</div>
                  </div>
                  <div className="cr-stats">
                    <div className="cr-stat">
                      <div className="cr-stat-num">{r.wins}</div>
                      <div className="cr-stat-label">побед</div>
                    </div>
                    <div className="cr-stat">
                      <div className="cr-stat-num">{r.participations}</div>
                      <div className="cr-stat-label">турниров</div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}