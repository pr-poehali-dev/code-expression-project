import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Icon from "@/components/ui/icon";
import { champGet, LEVEL_LABELS, LEVEL_COLORS } from "./championshipApi";

interface Salon {
  id: number; name: string; logo_url: string | null; city: string; address: string;
  website_url: string | null; description: string | null; avg_check: number | null;
  social_instagram: string | null; social_vk: string | null; social_telegram: string | null;
}
interface Service {
  name: string; price_min: number | null; price_max: number | null; duration_min: number | null;
}
interface Rating {
  total_points: number; participations: number; wins: number; top3_count: number; level: string;
}
interface Achievement {
  id: number; code: string; achievement_name: string; icon: string; achievement_desc: string; awarded_at: string;
}
interface Work {
  id: number; title: string; description: string; photos: { url: string }[];
  votes_count: number; final_place: number | null;
  tournament_name: string; tournament_slug: string;
}
interface HistoryItem {
  id: number; name: string; slug: string; status: string; category: string; emoji: string;
  application_status: string; final_place: number | null; votes_count: number | null; total_score: number | null;
}

const STATUS_LABELS: Record<string, string> = {
  announced: "Анонс", registration: "Регистрация", active: "Идёт приём работ",
  voting: "Голосование", finished_pending: "Подводятся итоги", finished: "Завершён", cancelled: "Отменён",
};

export default function ChampionshipSalon() {
  const { id } = useParams<{ id: string }>();
  const [salon, setSalon] = useState<Salon | null>(null);
  const [rating, setRating] = useState<Rating | null>(null);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [works, setWorks] = useState<Work[]>([]);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    champGet("salon_profile", { salon_id: id }).then(d => {
      setSalon(d.salon || null);
      setRating(d.rating || null);
      setAchievements(d.achievements || []);
      setWorks(d.works || []);
      setHistory(d.history || []);
      setServices(d.services || []);
    }).finally(() => setLoading(false));
  }, [id]);

  if (loading) return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#f8fafc" }}>
      <div style={{ width: 36, height: 36, border: "3px solid #e2e8f0", borderTopColor: "#14B8A6", borderRadius: "50%", animation: "cs-spin 0.7s linear infinite" }} />
      <style>{`@keyframes cs-spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );

  if (!salon) return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "Inter,sans-serif", padding: 24 }}>
      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: 48 }}>🔍</div>
        <div style={{ fontSize: 18, fontWeight: 700, marginTop: 12 }}>Салон не найден</div>
        <Link to="/championship/rating" style={{ color: "#14B8A6", marginTop: 12, display: "block" }}>← Назад к рейтингу</Link>
      </div>
    </div>
  );

  const levelColor = rating ? (LEVEL_COLORS[rating.level] || "#94a3b8") : "#94a3b8";
  const levelLabel = rating ? (LEVEL_LABELS[rating.level] || rating.level) : "";

  return (
    <div style={{ minHeight: "100vh", background: "#f8fafc", fontFamily: "Inter, sans-serif" }}>
      <style>{`
        .cs-wrap { max-width: 900px; margin: 0 auto; padding: 20px 16px 64px; }
        .cs-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 14px; }
        .cs-work-card { background: #fff; border-radius: 14px; border: 1.5px solid #e2e8f0; overflow: hidden; text-decoration: none; }
        .cs-work-photo { height: 150px; background: #f1f5f9; }
        .cs-achievement { display: flex; gap: 10px; align-items: center; background: #fff; border-radius: 12px; border: 1.5px solid #e2e8f0; padding: 12px 14px; }
        .cs-history-row { display: flex; align-items: center; gap: 10px; background: #fff; border-radius: 12px; border: 1.5px solid #e2e8f0; padding: 12px 14px; text-decoration: none; }
      `}</style>

      {/* Шапка */}
      <div style={{ background: "linear-gradient(135deg,#0f172a,#1e3a5f)", padding: "24px 16px" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <Link to="/championship/rating" style={{ color: "rgba(255,255,255,0.5)", textDecoration: "none", fontSize: 13 }}>← Рейтинг</Link>
          <div style={{ display: "flex", alignItems: "center", gap: 16, marginTop: 14, flexWrap: "wrap" }}>
            {salon.logo_url
              ? <img src={salon.logo_url} alt={salon.name} style={{ width: 64, height: 64, borderRadius: 14, objectFit: "cover", flexShrink: 0, border: rating && (rating.level === "legend" || rating.level === "premium") ? `3px solid ${levelColor}` : "none", boxShadow: rating?.level === "legend" ? "0 0 16px #f9731660" : rating?.level === "premium" ? "0 0 16px #ec489960" : "none" }} />
              : <div style={{ width: 64, height: 64, borderRadius: 14, background: "rgba(255,255,255,0.1)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <Icon name="Store" size={28} style={{ color: "rgba(255,255,255,0.5)" }} />
                </div>
            }
            <div style={{ flex: 1, minWidth: 0 }}>
              <h1 style={{ margin: "0 0 4px", fontSize: "clamp(18px,4vw,26px)", fontWeight: 900, color: "#fff", display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                {salon.name}
                {rating?.level === "legend" && <span title="Легенда">🔥</span>}
                {rating?.level === "premium" && <span title="Премиум">💎</span>}
              </h1>
              {salon.city && <div style={{ fontSize: 13, color: "rgba(255,255,255,0.6)" }}>{salon.city}</div>}
            </div>
            {salon.website_url && (
              <a href={salon.website_url} target="_blank" rel="noreferrer"
                style={{ padding: "10px 18px", background: "#fff", color: "#0f172a", borderRadius: 10, textDecoration: "none", fontSize: 13, fontWeight: 700, flexShrink: 0 }}>
                Сайт салона →
              </a>
            )}
          </div>
        </div>
      </div>

      <div className="cs-wrap">
        {/* Рейтинг */}
        {rating && (
          <div style={{ display: "flex", gap: 10, marginBottom: 24, flexWrap: "wrap" }}>
            {[
              { label: "Очки", value: rating.total_points.toLocaleString("ru") },
              { label: "Уровень", value: levelLabel, color: levelColor },
              { label: "Участий", value: String(rating.participations) },
              { label: "Побед", value: String(rating.wins), icon: "🏆" },
              { label: "Топ-3", value: String(rating.top3_count), icon: "🥉" },
            ].map((b, i) => (
              <div key={i} style={{ background: "#fff", borderRadius: 12, border: "1.5px solid #e2e8f0", padding: "10px 16px", minWidth: 84 }}>
                <div style={{ fontSize: 18, fontWeight: 900, color: b.color || "#0f172a" }}>{b.icon ? `${b.icon} ` : ""}{b.value}</div>
                <div style={{ fontSize: 11, color: "#94a3b8", fontWeight: 600 }}>{b.label}</div>
              </div>
            ))}
          </div>
        )}

        {salon.description && (
          <div style={{ background: "#fff", borderRadius: 14, border: "1.5px solid #e2e8f0", padding: "16px 18px", marginBottom: 16, fontSize: 14, color: "#374151", lineHeight: 1.7 }}>
            {salon.description}
          </div>
        )}

        {/* Контакты / адрес / соцсети */}
        {(salon.address || salon.avg_check || salon.social_instagram || salon.social_vk || salon.social_telegram) && (
          <div style={{ background: "#fff", borderRadius: 14, border: "1.5px solid #e2e8f0", padding: "16px 18px", marginBottom: 16, display: "flex", flexDirection: "column", gap: 10 }}>
            {salon.address && (
              <div style={{ display: "flex", gap: 10, alignItems: "flex-start", fontSize: 13, color: "#374151" }}>
                <Icon name="MapPin" size={16} style={{ color: "#14B8A6", flexShrink: 0, marginTop: 1 }} />
                {salon.address}
              </div>
            )}
            {salon.avg_check && (
              <div style={{ display: "flex", gap: 10, alignItems: "center", fontSize: 13, color: "#374151" }}>
                <Icon name="Wallet" size={16} style={{ color: "#14B8A6", flexShrink: 0 }} />
                Средний чек от <b style={{ color: "#0f172a" }}>{Number(salon.avg_check).toLocaleString("ru")} ₽</b>
              </div>
            )}
            {(salon.social_instagram || salon.social_vk || salon.social_telegram) && (
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 2 }}>
                {salon.social_vk && (
                  <a href={salon.social_vk} target="_blank" rel="noreferrer" style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 12, fontWeight: 600, color: "#0f172a", background: "#f1f5f9", borderRadius: 8, padding: "6px 12px", textDecoration: "none" }}>
                    <Icon name="Link" size={13} /> ВКонтакте
                  </a>
                )}
                {salon.social_telegram && (
                  <a href={salon.social_telegram} target="_blank" rel="noreferrer" style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 12, fontWeight: 600, color: "#0f172a", background: "#f1f5f9", borderRadius: 8, padding: "6px 12px", textDecoration: "none" }}>
                    <Icon name="Send" size={13} /> Telegram
                  </a>
                )}
                {salon.social_instagram && (
                  <a href={salon.social_instagram} target="_blank" rel="noreferrer" style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 12, fontWeight: 600, color: "#0f172a", background: "#f1f5f9", borderRadius: 8, padding: "6px 12px", textDecoration: "none" }}>
                    <Icon name="Instagram" size={13} /> Instagram
                  </a>
                )}
              </div>
            )}
          </div>
        )}

        {/* Услуги */}
        {services.length > 0 && (
          <div style={{ marginBottom: 28 }}>
            <h3 style={{ fontSize: 15, fontWeight: 700, color: "#0f172a", margin: "0 0 12px" }}>💅 Услуги и цены</h3>
            <div style={{ background: "#fff", borderRadius: 14, border: "1.5px solid #e2e8f0", overflow: "hidden" }}>
              {services.map((s, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, padding: "12px 16px", borderTop: i > 0 ? "1px solid #f1f5f9" : "none" }}>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: "#0f172a" }}>{s.name}</div>
                    {s.duration_min && <div style={{ fontSize: 11, color: "#94a3b8", marginTop: 2 }}>{s.duration_min} мин</div>}
                  </div>
                  {s.price_min != null && (
                    <div style={{ fontSize: 13, fontWeight: 700, color: "#14B8A6", flexShrink: 0, whiteSpace: "nowrap" }}>
                      от {Number(s.price_min).toLocaleString("ru")} ₽
                      {s.price_max != null && s.price_max !== s.price_min && (
                        <span style={{ color: "#94a3b8", fontWeight: 600 }}> – {Number(s.price_max).toLocaleString("ru")} ₽</span>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Достижения */}
        {achievements.length > 0 && (
          <div style={{ marginBottom: 28 }}>
            <h3 style={{ fontSize: 15, fontWeight: 700, color: "#0f172a", margin: "0 0 12px" }}>🎖 Достижения</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {achievements.map(a => (
                <div key={a.id} className="cs-achievement">
                  <span style={{ fontSize: 24, flexShrink: 0 }}>{a.icon || "🏅"}</span>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: "#0f172a" }}>{a.achievement_name}</div>
                    {a.achievement_desc && <div style={{ fontSize: 12, color: "#64748b" }}>{a.achievement_desc}</div>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Лучшие работы */}
        {works.length > 0 && (
          <div style={{ marginBottom: 28 }}>
            <h3 style={{ fontSize: 15, fontWeight: 700, color: "#0f172a", margin: "0 0 12px" }}>✨ Работы на турнирах</h3>
            <div className="cs-grid">
              {works.map(w => (
                <Link key={w.id} to={`/championship/tournament/${w.tournament_slug}`} className="cs-work-card">
                  <div className="cs-work-photo" style={{ background: w.photos?.[0]?.url ? `url(${w.photos[0].url}) center/cover` : "#f1f5f9", position: "relative" }}>
                    {w.final_place && w.final_place <= 3 && (
                      <div style={{ position: "absolute", top: 8, left: 8, background: "#fff", borderRadius: 20, padding: "3px 9px", fontSize: 11, fontWeight: 700 }}>
                        {["🥇","🥈","🥉"][w.final_place - 1]} {w.final_place} место
                      </div>
                    )}
                  </div>
                  <div style={{ padding: "10px 12px" }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: "#0f172a", marginBottom: 2 }}>{w.title}</div>
                    <div style={{ fontSize: 11, color: "#94a3b8" }}>{w.tournament_name}</div>
                    <div style={{ fontSize: 12, color: "#64748b", marginTop: 6 }}>❤️ {w.votes_count.toLocaleString("ru")}</div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* История турниров */}
        {history.length > 0 && (
          <div>
            <h3 style={{ fontSize: 15, fontWeight: 700, color: "#0f172a", margin: "0 0 12px" }}>📋 История участия</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {history.map(h => (
                <Link key={h.id} to={`/championship/tournament/${h.slug}`} className="cs-history-row">
                  <span style={{ fontSize: 22, flexShrink: 0 }}>{h.emoji}</span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: "#0f172a" }}>{h.name}</div>
                    <div style={{ fontSize: 11, color: "#94a3b8" }}>{STATUS_LABELS[h.status] || h.status}</div>
                  </div>
                  {h.final_place && (
                    <div style={{ fontSize: 12, fontWeight: 700, color: h.final_place <= 3 ? "#d97706" : "#64748b", flexShrink: 0 }}>
                      {["🥇","🥈","🥉"][h.final_place - 1] || `${h.final_place} место`}
                    </div>
                  )}
                </Link>
              ))}
            </div>
          </div>
        )}

        {achievements.length === 0 && works.length === 0 && history.length === 0 && (
          <div style={{ textAlign: "center", padding: "48px 0", color: "#94a3b8" }}>
            <div style={{ fontSize: 36, marginBottom: 10 }}>📊</div>
            Салон пока не участвовал в турнирах
          </div>
        )}
      </div>
    </div>
  );
}