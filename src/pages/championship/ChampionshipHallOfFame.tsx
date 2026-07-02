import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { champGet } from "./championshipApi";

interface HofEntry {
  id: number; title: string; photos: {url:string}[]; votes_count: number; final_place: number;
  salon_id: number; salon_name: string; logo_url: string; city: string; website_url: string;
  tournament_name: string; tournament_slug: string; category: string; emoji: string; year: number;
}

const PLACE_STYLE = [
  { bg: "#fef3c7", color: "#d97706", icon: "🥇" },
  { bg: "#f1f5f9", color: "#64748b", icon: "🥈" },
  { bg: "#fdf4e7", color: "#b45309", icon: "🥉" },
];

export default function ChampionshipHallOfFame() {
  const [entries, setEntries] = useState<HofEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [year, setYear] = useState("");

  useEffect(() => {
    const params: Record<string,string> = {};
    if (year) params.year = year;
    champGet("hall_of_fame", params).then(d => setEntries(d.hall_of_fame || [])).finally(() => setLoading(false));
  }, [year]);

  const years = [...new Set(entries.map(e => e.year))].sort((a,b) => b - a);

  return (
    <div style={{ minHeight: "100vh", background: "#f8fafc", fontFamily: "Inter, sans-serif" }}>
      <div style={{ background: "linear-gradient(135deg, #0f172a, #1e3a5f)", padding: "24px", borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
        <div style={{ maxWidth: 1000, margin: "0 auto" }}>
          <Link to="/championship" style={{ color: "rgba(255,255,255,0.5)", textDecoration: "none", fontSize: 13 }}>← Чемпионат</Link>
          <h1 style={{ margin: "8px 0 4px", fontSize: 28, fontWeight: 900, color: "#fff" }}>🏛 Зал славы</h1>
          <p style={{ margin: 0, color: "rgba(255,255,255,0.5)", fontSize: 14 }}>Каждая победа остаётся здесь навсегда</p>
        </div>
      </div>

      <div style={{ maxWidth: 1000, margin: "0 auto", padding: "32px 24px" }}>
        {/* Фильтр по году */}
        {years.length > 1 && (
          <div style={{ display: "flex", gap: 8, marginBottom: 28, flexWrap: "wrap" }}>
            <button onClick={() => setYear("")} style={{ padding: "7px 16px", borderRadius: 20, border: `1.5px solid ${!year ? "#14B8A6" : "#e2e8f0"}`, background: !year ? "#f0fdf4" : "#fff", color: !year ? "#0d9488" : "#64748b", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
              Все годы
            </button>
            {years.map(y => (
              <button key={y} onClick={() => setYear(String(y))} style={{ padding: "7px 16px", borderRadius: 20, border: `1.5px solid ${year === String(y) ? "#14B8A6" : "#e2e8f0"}`, background: year === String(y) ? "#f0fdf4" : "#fff", color: year === String(y) ? "#0d9488" : "#64748b", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
                {y}
              </button>
            ))}
          </div>
        )}

        {loading ? (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 16 }}>
            {[1,2,3,4,5,6].map(i => <div key={i} style={{ height: 200, borderRadius: 16, background: "#e2e8f0" }} />)}
          </div>
        ) : entries.length === 0 ? (
          <div style={{ textAlign: "center", padding: "60px 0" }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>🏛</div>
            <div style={{ fontSize: 18, fontWeight: 700, color: "#0f172a" }}>Зал славы пока пуст</div>
            <div style={{ fontSize: 14, color: "#94a3b8", marginTop: 4 }}>Первые победители появятся после завершения турниров</div>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 20 }}>
            {entries.map(e => {
              const ps = PLACE_STYLE[e.final_place - 1] || { bg: "#f8fafc", color: "#94a3b8", icon: `#${e.final_place}` };
              const photo = e.photos?.[0]?.url;
              return (
                <div key={e.id} style={{ background: "#fff", borderRadius: 16, border: "1.5px solid #e2e8f0", overflow: "hidden" }}>
                  {/* Фото */}
                  <div style={{ height: 160, background: photo ? `url(${photo}) center/cover` : "#f1f5f9", position: "relative" }}>
                    {!photo && <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 40 }}>🖼</div>}
                    <div style={{ position: "absolute", top: 12, left: 12, background: ps.bg, color: ps.color, borderRadius: 20, padding: "4px 12px", fontSize: 13, fontWeight: 700 }}>
                      {ps.icon} {e.final_place} место
                    </div>
                    <div style={{ position: "absolute", top: 12, right: 12, background: "rgba(0,0,0,0.5)", color: "#fff", borderRadius: 20, padding: "4px 10px", fontSize: 11, fontWeight: 600 }}>
                      {e.emoji} {e.tournament_name}
                    </div>
                  </div>
                  {/* Инфо */}
                  <div style={{ padding: "16px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                      {e.logo_url ? (
                        <img src={e.logo_url} alt={e.salon_name} style={{ width: 36, height: 36, borderRadius: 8, objectFit: "cover", flexShrink: 0 }} />
                      ) : (
                        <div style={{ width: 36, height: 36, borderRadius: 8, background: "#f1f5f9", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontSize: 16 }}>💅</div>
                      )}
                      <div>
                        <div style={{ fontSize: 14, fontWeight: 700, color: "#0f172a" }}>{e.salon_name}</div>
                        <div style={{ fontSize: 12, color: "#94a3b8" }}>{e.city} · {e.year}</div>
                      </div>
                    </div>
                    {e.votes_count > 0 && (
                      <div style={{ fontSize: 12, color: "#64748b" }}>❤️ {e.votes_count.toLocaleString("ru")} голосов</div>
                    )}
                    {e.website_url && (
                      <a href={e.website_url} target="_blank" rel="noreferrer" onClick={ev => ev.stopPropagation()}
                        style={{ display: "inline-block", marginTop: 10, fontSize: 12, color: "#14B8A6", fontWeight: 600, textDecoration: "none" }}>
                        Сайт салона →
                      </a>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
