import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Icon from "@/components/ui/icon";
import { champGet } from "./championshipApi";
import { STATUS_LABELS, STATUS_COLORS } from "./championshipApi";

interface Season {
  id: number; name: string; is_active: boolean;
  starts_at: string; ends_at: string; total_prize?: number;
}
interface Tournament {
  id: number; name: string; slug: string; category: string; emoji: string;
  description: string; status: string; prize_energy: number;
  registration_starts: string; registration_ends: string;
  voting_ends: string; applications_count: number; works_count: number;
  postponed: boolean; postpone_reason: string;
}
interface Stats {
  participants: number; works: number; votes: number; tournaments: number;
  active_season: Season | null;
}

export default function ChampionshipPage() {
  const navigate = useNavigate();
  const [stats, setStats] = useState<Stats | null>(null);
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"current" | "upcoming" | "archive">("current");

  useEffect(() => {
    Promise.all([
      champGet("stats"),
      champGet("tournaments"),
    ]).then(([s, t]) => {
      setStats(s);
      setTournaments(t.tournaments || []);
    }).finally(() => setLoading(false));
  }, []);

  const current  = tournaments.filter(t => ["registration", "active", "voting", "finished_pending"].includes(t.status));
  const upcoming = tournaments.filter(t => ["announced", "draft"].includes(t.status));
  const archive  = tournaments.filter(t => t.status === "finished");

  const tabList = [
    { id: "current",  label: "Текущие",      icon: "Flame",    count: current.length },
    { id: "upcoming", label: "Предстоящие",  icon: "Calendar", count: upcoming.length },
    { id: "archive",  label: "Архив",        icon: "Archive",  count: archive.length },
  ] as const;

  const shown = activeTab === "current" ? current : activeTab === "upcoming" ? upcoming : archive;

  return (
    <div style={{ minHeight: "100vh", background: "#f8fafc", fontFamily: "Inter, sans-serif" }}>

      {/* Шапка страницы */}
      <div style={{ background: "linear-gradient(135deg, #0f172a 0%, #1e3a5f 60%, #0f172a 100%)", padding: "0 0 0" }}>
        {/* Навбар */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 24px", borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
          <Link to="/" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ color: "#14B8A6", fontWeight: 800, fontSize: 18 }}>Промт Диалог</span>
          </Link>
          <div style={{ display: "flex", gap: 8 }}>
            <Link to="/championship/rating" style={{ padding: "7px 14px", borderRadius: 8, border: "1px solid rgba(255,255,255,0.15)", color: "#fff", textDecoration: "none", fontSize: 13, fontWeight: 600 }}>
              Рейтинг
            </Link>
            <Link to="/championship/hall-of-fame" style={{ padding: "7px 14px", borderRadius: 8, border: "1px solid rgba(255,255,255,0.15)", color: "#fff", textDecoration: "none", fontSize: 13, fontWeight: 600 }}>
              Зал славы
            </Link>
            <Link to="/cabinet" style={{ padding: "7px 14px", borderRadius: 8, background: "#14B8A6", color: "#fff", textDecoration: "none", fontSize: 13, fontWeight: 700 }}>
              Кабинет
            </Link>
          </div>
        </div>

        {/* Hero */}
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "64px 24px 72px", textAlign: "center" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(20,184,166,0.15)", border: "1px solid rgba(20,184,166,0.3)", borderRadius: 20, padding: "6px 16px", marginBottom: 24 }}>
            <span style={{ fontSize: 14 }}>🏆</span>
            <span style={{ fontSize: 13, color: "#14B8A6", fontWeight: 700, letterSpacing: 1 }}>ЧЕМПИОНАТ КРАСОТЫ</span>
          </div>

          {stats?.active_season ? (
            <>
              <h1 style={{ margin: "0 0 12px", fontSize: "clamp(28px,5vw,52px)", fontWeight: 900, color: "#fff", lineHeight: 1.15 }}>
                Идёт сезон<br />
                <span style={{ color: "#14B8A6" }}>{stats.active_season.name}</span>
              </h1>
              <p style={{ margin: "0 0 40px", fontSize: 18, color: "rgba(255,255,255,0.65)", lineHeight: 1.6 }}>
                Докажи, что твой салон лучший. Победи и войди в историю.
              </p>
            </>
          ) : (
            <>
              <h1 style={{ margin: "0 0 12px", fontSize: "clamp(28px,5vw,52px)", fontWeight: 900, color: "#fff", lineHeight: 1.15 }}>
                Площадка<br />
                <span style={{ color: "#14B8A6" }}>профессионального признания</span>
              </h1>
              <p style={{ margin: "0 0 40px", fontSize: 18, color: "rgba(255,255,255,0.65)", lineHeight: 1.6 }}>
                Участвуй в турнирах, побеждай, строй репутацию.<br />
                Каждая победа остаётся в истории навсегда.
              </p>
            </>
          )}

          {/* Счётчики */}
          {stats && (
            <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
              {[
                { v: stats.participants, label: "участников" },
                { v: stats.works,       label: "работ" },
                { v: stats.votes,       label: "голосов" },
                { v: stats.tournaments, label: "турниров" },
              ].map(({ v, label }) => (
                <div key={label} style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 14, padding: "18px 28px", minWidth: 110 }}>
                  <div style={{ fontSize: 28, fontWeight: 900, color: "#fff" }}>{v.toLocaleString("ru")}</div>
                  <div style={{ fontSize: 13, color: "rgba(255,255,255,0.5)", marginTop: 2 }}>{label}</div>
                </div>
              ))}
              {stats.active_season?.total_prize && (
                <div style={{ background: "rgba(20,184,166,0.15)", border: "1px solid rgba(20,184,166,0.3)", borderRadius: 14, padding: "18px 28px", minWidth: 110 }}>
                  <div style={{ fontSize: 28, fontWeight: 900, color: "#14B8A6" }}>{stats.active_season.total_prize.toLocaleString("ru")} ⚡</div>
                  <div style={{ fontSize: 13, color: "rgba(20,184,166,0.7)", marginTop: 2 }}>призовой фонд</div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Контент */}
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "40px 24px 80px" }}>

        {/* Быстрые ссылки */}
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 36 }}>
          {[
            { to: "/championship/rating",      icon: "BarChart3",  label: "Рейтинг салонов" },
            { to: "/championship/hall-of-fame", icon: "Trophy",    label: "Зал славы" },
          ].map(({ to, icon, label }) => (
            <Link key={to} to={to} style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 18px", borderRadius: 10, background: "#fff", border: "1.5px solid #e2e8f0", color: "#0f172a", textDecoration: "none", fontSize: 14, fontWeight: 600, boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
              <Icon name={icon} size={16} style={{ color: "#14B8A6" }} />
              {label}
            </Link>
          ))}
        </div>

        {/* Табы */}
        <div style={{ display: "flex", gap: 4, background: "#f1f5f9", borderRadius: 12, padding: 4, marginBottom: 28, width: "fit-content" }}>
          {tabList.map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              style={{ display: "flex", alignItems: "center", gap: 6, padding: "9px 18px", borderRadius: 9, border: "none", background: activeTab === tab.id ? "#fff" : "transparent", color: activeTab === tab.id ? "#0f172a" : "#64748b", fontSize: 14, fontWeight: 600, cursor: "pointer", boxShadow: activeTab === tab.id ? "0 1px 4px rgba(0,0,0,0.08)" : "none", transition: "all 0.15s" }}>
              <Icon name={tab.icon} size={14} />
              {tab.label}
              {tab.count > 0 && (
                <span style={{ background: activeTab === tab.id ? "#0f172a" : "#cbd5e1", color: "#fff", borderRadius: 10, padding: "1px 7px", fontSize: 11, fontWeight: 700 }}>
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Список турниров */}
        {loading ? (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 16 }}>
            {[1,2,3].map(i => <div key={i} style={{ height: 220, borderRadius: 16, background: "#e2e8f0", animation: "pulse 1.5s ease infinite" }} />)}
          </div>
        ) : shown.length === 0 ? (
          <div style={{ textAlign: "center", padding: "60px 0", color: "#64748b" }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>🏁</div>
            <div style={{ fontSize: 18, fontWeight: 700, color: "#0f172a", marginBottom: 6 }}>
              {activeTab === "current" ? "Нет активных турниров" : activeTab === "upcoming" ? "Нет предстоящих турниров" : "Архив пока пуст"}
            </div>
            <div style={{ fontSize: 14, color: "#94a3b8" }}>Следите за анонсами — скоро появятся новые соревнования</div>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 20 }}>
            {shown.map(t => (
              <TournamentCard key={t.id} t={t} onClick={() => navigate(`/championship/tournament/${t.slug}`)} />
            ))}
          </div>
        )}

        {/* Как это работает */}
        <div style={{ marginTop: 64 }}>
          <h2 style={{ fontSize: 28, fontWeight: 800, color: "#0f172a", marginBottom: 8, textAlign: "center" }}>Как это работает</h2>
          <p style={{ textAlign: "center", color: "#64748b", fontSize: 15, marginBottom: 40 }}>Четыре простых шага от регистрации до победы</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 16 }}>
            {[
              { n: "01", icon: "UserPlus",   title: "Регистрация",   desc: "Зарегистрируйте салон и подайте заявку на турнир" },
              { n: "02", icon: "Image",      title: "Работа",        desc: "Выполните задание и загрузите результат до дедлайна" },
              { n: "03", icon: "Heart",      title: "Голосование",   desc: "Соберите голоса клиентов, друзей и подписчиков" },
              { n: "04", icon: "Trophy",     title: "Победа",        desc: "Получите приз, достижение и место в Зале славы" },
            ].map(s => (
              <div key={s.n} style={{ background: "#fff", borderRadius: 16, padding: "24px 20px", border: "1.5px solid #e2e8f0" }}>
                <div style={{ width: 44, height: 44, borderRadius: 12, background: "#f0fdf4", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 14 }}>
                  <Icon name={s.icon} size={22} style={{ color: "#14B8A6" }} />
                </div>
                <div style={{ fontSize: 11, fontWeight: 700, color: "#14B8A6", marginBottom: 4, letterSpacing: 1 }}>ШАГ {s.n}</div>
                <div style={{ fontSize: 16, fontWeight: 700, color: "#0f172a", marginBottom: 6 }}>{s.title}</div>
                <div style={{ fontSize: 13, color: "#64748b", lineHeight: 1.6 }}>{s.desc}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Уровни */}
        <div style={{ marginTop: 64, background: "#0f172a", borderRadius: 20, padding: "40px 32px", color: "#fff" }}>
          <h2 style={{ fontSize: 24, fontWeight: 800, marginBottom: 8, textAlign: "center" }}>Уровни салона</h2>
          <p style={{ textAlign: "center", color: "rgba(255,255,255,0.5)", fontSize: 14, marginBottom: 32 }}>Каждый турнир приносит очки. Очки повышают статус.</p>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap", justifyContent: "center" }}>
            {[
              { level: "Новичок",      pts: "0+",    color: "#94a3b8" },
              { level: "Участник",     pts: "100+",  color: "#3b82f6" },
              { level: "Профессионал", pts: "500+",  color: "#8b5cf6" },
              { level: "Эксперт",      pts: "1200+", color: "#f59e0b" },
              { level: "Премиум",      pts: "3000+", color: "#ec4899" },
              { level: "Легенда",      pts: "6000+", color: "#f97316" },
            ].map(l => (
              <div key={l.level} style={{ background: "rgba(255,255,255,0.06)", border: `1.5px solid ${l.color}40`, borderRadius: 12, padding: "14px 20px", textAlign: "center", minWidth: 110 }}>
                <div style={{ width: 10, height: 10, borderRadius: "50%", background: l.color, margin: "0 auto 8px" }} />
                <div style={{ fontSize: 14, fontWeight: 700, color: "#fff", marginBottom: 2 }}>{l.level}</div>
                <div style={{ fontSize: 12, color: l.color, fontWeight: 600 }}>{l.pts} очков</div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div style={{ marginTop: 48, textAlign: "center" }}>
          <div style={{ background: "linear-gradient(135deg, #6366f1, #8b5cf6)", borderRadius: 20, padding: "40px 32px", display: "inline-block", width: "100%", maxWidth: 600 }}>
            <h2 style={{ margin: "0 0 10px", fontSize: 24, fontWeight: 800, color: "#fff" }}>Готовы участвовать?</h2>
            <p style={{ margin: "0 0 24px", fontSize: 15, color: "rgba(255,255,255,0.8)" }}>
              Зарегистрируйте салон и получите 100 ⚡ энергии в подарок
            </p>
            <Link to="/cabinet" style={{ display: "inline-block", padding: "14px 36px", background: "#fff", color: "#6366f1", borderRadius: 12, textDecoration: "none", fontSize: 16, fontWeight: 800 }}>
              Войти в кабинет →
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}

function TournamentCard({ t, onClick }: { t: Tournament; onClick: () => void }) {
  const statusColor = STATUS_COLORS[t.status] || "#64748b";
  const statusLabel = STATUS_LABELS[t.status] || t.status;

  return (
    <div onClick={onClick} style={{ background: "#fff", borderRadius: 16, border: "1.5px solid #e2e8f0", padding: "24px", cursor: "pointer", transition: "box-shadow 0.15s, transform 0.15s", position: "relative", overflow: "hidden" }}
      onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.boxShadow = "0 8px 32px rgba(0,0,0,0.1)"; (e.currentTarget as HTMLDivElement).style.transform = "translateY(-2px)"; }}
      onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.boxShadow = "none"; (e.currentTarget as HTMLDivElement).style.transform = "none"; }}>

      {/* Статус */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
        <span style={{ fontSize: 28 }}>{t.emoji}</span>
        <span style={{ background: `${statusColor}18`, color: statusColor, borderRadius: 20, padding: "4px 12px", fontSize: 12, fontWeight: 700 }}>
          {statusLabel}
        </span>
      </div>

      {t.postponed && (
        <div style={{ background: "#fffbeb", border: "1px solid #fde68a", borderRadius: 8, padding: "6px 10px", fontSize: 11, color: "#92400e", marginBottom: 10 }}>
          ⏰ Перенесён — мало участников
        </div>
      )}

      <h3 style={{ margin: "0 0 8px", fontSize: 17, fontWeight: 800, color: "#0f172a", lineHeight: 1.3 }}>{t.name}</h3>
      <p style={{ margin: "0 0 16px", fontSize: 13, color: "#64748b", lineHeight: 1.6, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
        {t.description}
      </p>

      <div style={{ display: "flex", gap: 16, marginBottom: 16, flexWrap: "wrap" }}>
        {t.applications_count > 0 && (
          <div style={{ fontSize: 12, color: "#64748b" }}>
            <span style={{ fontWeight: 700, color: "#0f172a" }}>{t.applications_count}</span> участников
          </div>
        )}
        {t.works_count > 0 && (
          <div style={{ fontSize: 12, color: "#64748b" }}>
            <span style={{ fontWeight: 700, color: "#0f172a" }}>{t.works_count}</span> работ
          </div>
        )}
        {t.prize_energy > 0 && (
          <div style={{ fontSize: 12, color: "#14B8A6", fontWeight: 700 }}>
            {t.prize_energy} ⚡ победителю
          </div>
        )}
      </div>

      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ fontSize: 12, color: "#94a3b8" }}>
          {t.registration_ends && ["announced","registration"].includes(t.status) && (
            <>Регистрация до {new Date(t.registration_ends).toLocaleDateString("ru")}</>
          )}
          {t.voting_ends && t.status === "voting" && (
            <>Голосование до {new Date(t.voting_ends).toLocaleDateString("ru")}</>
          )}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 13, fontWeight: 700, color: "#6366f1" }}>
          Подробнее <Icon name="ArrowRight" size={14} />
        </div>
      </div>
    </div>
  );
}
