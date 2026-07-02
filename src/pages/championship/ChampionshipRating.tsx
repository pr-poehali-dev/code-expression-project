import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Icon from "@/components/ui/icon";
import { champGet, LEVEL_LABELS, LEVEL_COLORS } from "./championshipApi";

interface RatingEntry {
  salon_id: number; salon_name: string; logo_url: string; city: string; website_url: string;
  total_points: number; participations: number; wins: number; top3_count: number; level: string;
}

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
      <div style={{ background: "linear-gradient(135deg, #0f172a, #1e3a5f)", padding: "24px", borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
        <div style={{ maxWidth: 900, margin: "0 auto", display: "flex", alignItems: "center", gap: 16 }}>
          <Link to="/championship" style={{ color: "rgba(255,255,255,0.5)", textDecoration: "none", fontSize: 13 }}>← Чемпионат</Link>
          <h1 style={{ margin: 0, fontSize: 22, fontWeight: 800, color: "#fff", flex: 1 }}>Рейтинг салонов</h1>
        </div>
      </div>

      <div style={{ maxWidth: 900, margin: "0 auto", padding: "32px 24px" }}>
        {/* Фильтр по городу */}
        <div style={{ display: "flex", gap: 10, marginBottom: 24 }}>
          <input value={city} onChange={e => setCity(e.target.value)} placeholder="Фильтр по городу..."
            style={{ flex: 1, maxWidth: 300, padding: "10px 14px", borderRadius: 10, border: "1.5px solid #e2e8f0", fontSize: 14, outline: "none" }} />
          <button onClick={() => load(city)} style={{ padding: "10px 18px", borderRadius: 10, border: "none", background: "#14B8A6", color: "#fff", fontSize: 14, fontWeight: 700, cursor: "pointer" }}>
            Найти
          </button>
          {city && <button onClick={() => { setCity(""); load(""); }} style={{ padding: "10px 14px", borderRadius: 10, border: "1.5px solid #e2e8f0", background: "#fff", fontSize: 14, cursor: "pointer" }}>✕</button>}
        </div>

        {loading ? (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {[1,2,3,4,5].map(i => <div key={i} style={{ height: 72, borderRadius: 12, background: "#e2e8f0" }} />)}
          </div>
        ) : rating.length === 0 ? (
          <div style={{ textAlign: "center", padding: "60px 0", color: "#64748b" }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>📊</div>
            <div style={{ fontSize: 16, fontWeight: 700, color: "#0f172a" }}>Рейтинг пока пуст</div>
            <div style={{ fontSize: 14, color: "#94a3b8", marginTop: 4 }}>Участвуйте в турнирах чтобы попасть в рейтинг</div>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {rating.map((r, i) => {
              const levelColor = LEVEL_COLORS[r.level] || "#94a3b8";
              const levelLabel = LEVEL_LABELS[r.level] || r.level;
              return (
                <Link key={r.salon_id} to={`/championship/salon/${r.salon_id}`} style={{ textDecoration: "none" }}>
                  <div style={{ background: "#fff", borderRadius: 14, border: i < 3 ? `1.5px solid ${["#f59e0b","#94a3b8","#cd7c2f"][i]}40` : "1.5px solid #e2e8f0", padding: "16px 20px", display: "flex", alignItems: "center", gap: 16, transition: "box-shadow 0.15s" }}
                    onMouseEnter={e => (e.currentTarget.style.boxShadow = "0 4px 16px rgba(0,0,0,0.08)")}
                    onMouseLeave={e => (e.currentTarget.style.boxShadow = "none")}>
                    {/* Место */}
                    <div style={{ width: 36, height: 36, borderRadius: "50%", background: i === 0 ? "#fef3c7" : i === 1 ? "#f1f5f9" : i === 2 ? "#fdf4e7" : "#f8fafc", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontSize: 16, fontWeight: 900, color: i === 0 ? "#d97706" : i === 1 ? "#64748b" : i === 2 ? "#b45309" : "#94a3b8" }}>
                      {i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : i + 1}
                    </div>
                    {/* Лого */}
                    {r.logo_url ? (
                      <img src={r.logo_url} alt={r.salon_name} style={{ width: 40, height: 40, borderRadius: 10, objectFit: "cover", flexShrink: 0 }} />
                    ) : (
                      <div style={{ width: 40, height: 40, borderRadius: 10, background: "#f1f5f9", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                        <Icon name="Store" size={18} style={{ color: "#94a3b8" }} />
                      </div>
                    )}
                    {/* Инфо */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 15, fontWeight: 700, color: "#0f172a", marginBottom: 2 }}>{r.salon_name}</div>
                      <div style={{ fontSize: 12, color: "#94a3b8" }}>{r.city}</div>
                    </div>
                    {/* Уровень */}
                    <div style={{ textAlign: "right", flexShrink: 0 }}>
                      <div style={{ fontSize: 18, fontWeight: 900, color: "#0f172a" }}>{r.total_points.toLocaleString("ru")}</div>
                      <div style={{ fontSize: 11, color: levelColor, fontWeight: 700 }}>{levelLabel}</div>
                    </div>
                    {/* Статы */}
                    <div style={{ display: "flex", gap: 12, flexShrink: 0 }}>
                      <div style={{ textAlign: "center" }}>
                        <div style={{ fontSize: 15, fontWeight: 700, color: "#0f172a" }}>{r.wins}</div>
                        <div style={{ fontSize: 10, color: "#94a3b8" }}>побед</div>
                      </div>
                      <div style={{ textAlign: "center" }}>
                        <div style={{ fontSize: 15, fontWeight: 700, color: "#0f172a" }}>{r.participations}</div>
                        <div style={{ fontSize: 10, color: "#94a3b8" }}>турниров</div>
                      </div>
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
