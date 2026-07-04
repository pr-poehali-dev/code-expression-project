import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Icon from "@/components/ui/icon";
import BrandLogo from "@/components/BrandLogo";
import BizFooter from "@/components/BizFooter";
import { champGet, STATUS_LABELS, STATUS_COLORS } from "./championshipApi";

interface Season {
  id: number; name: string; is_active: boolean;
  starts_at: string; ends_at: string; total_prize?: number;
}
interface Tournament {
  id: number; name: string; slug: string; category: string; emoji: string;
  description: string; status: string; prize_energy: number; prize_2nd: number; prize_3rd: number;
  registration_starts: string; registration_ends: string;
  task_opens_at: string; work_deadline: string;
  voting_starts: string; voting_ends: string;
  applications_count: number; works_count: number;
  cover_image_url: string;
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
    Promise.all([champGet("stats"), champGet("tournaments")]).then(([s, t]) => {
      setStats(s);
      setTournaments(t.tournaments || []);
    }).finally(() => setLoading(false));
  }, []);

  const current  = tournaments.filter(t => ["registration", "active", "voting", "finished_pending"].includes(t.status));
  const upcoming = tournaments.filter(t => ["announced", "draft"].includes(t.status));
  const archive  = tournaments.filter(t => t.status === "finished");

  const tabList = [
    { id: "current",  label: "Текущие",     icon: "Flame",    count: current.length },
    { id: "upcoming", label: "Предстоящие", icon: "Calendar", count: upcoming.length },
    { id: "archive",  label: "Архив",       icon: "Archive",  count: archive.length },
  ] as const;

  const shown = activeTab === "current" ? current : activeTab === "upcoming" ? upcoming : archive;

  return (
    <div className="champ-page">
      <style>{`
        .champ-page { min-height: 100vh; background: #f8fafc; font-family: Inter, sans-serif; }

        /* ── Навбар ── */
        .champ-nav { position: relative; z-index: 1; display: flex; align-items: center; justify-content: space-between; padding: 14px 20px; border-bottom: 1px solid rgba(255,255,255,0.08); }
        .champ-nav-logo { color: #14B8A6; font-weight: 800; font-size: 17px; text-decoration: none; }
        .champ-nav-links { display: flex; gap: 6px; }
        .champ-nav-link { padding: 7px 12px; border-radius: 8px; border: 1px solid rgba(255,255,255,0.15); color: #fff; text-decoration: none; font-size: 13px; font-weight: 600; white-space: nowrap; }
        .champ-nav-link-accent { background: #14B8A6; border-color: #14B8A6; }
        @media (max-width: 480px) {
          .champ-nav-link-hide { display: none; }
          .champ-nav-link { padding: 6px 10px; font-size: 12px; }
        }

        /* ── Hero ── */
        .champ-hero {
          position: relative;
          background: #0f172a;
          overflow: hidden;
        }
        .champ-hero-bg {
          position: absolute; inset: 0;
          background-image: url('https://cdn.poehali.dev/projects/10f61e56-9821-40f3-b705-3590ddaffd08/bucket/9eb80255-4dbc-405c-9f1d-f485fd4e3a65.png');
          background-size: cover;
          background-position: center 20%;
          opacity: 0.28;
          filter: saturate(0.7);
        }
        .champ-hero-overlay {
          position: absolute; inset: 0;
          background: linear-gradient(
            to bottom,
            rgba(15,23,42,0.45) 0%,
            rgba(15,23,42,0.25) 40%,
            rgba(15,23,42,0.75) 100%
          );
        }
        .champ-hero-inner { position: relative; z-index: 1; max-width: 1100px; margin: 0 auto; padding: 56px 20px 64px; text-align: center; }
        .champ-hero-badge { display: inline-flex; align-items: center; gap: 8px; background: rgba(20,184,166,0.15); border: 1px solid rgba(20,184,166,0.3); border-radius: 20px; padding: 6px 16px; margin-bottom: 20px; }
        .champ-hero-h1 { margin: 0 0 12px; font-size: clamp(26px,5vw,52px); font-weight: 900; color: #fff; line-height: 1.15; }
        .champ-hero-sub { margin: 0 0 36px; font-size: clamp(14px,2vw,18px); color: rgba(255,255,255,0.65); line-height: 1.6; }
        .champ-stats { display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; justify-content: center; max-width: 540px; margin: 0 auto; }
        .champ-stat { background: rgba(255,255,255,0.07); border: 1px solid rgba(255,255,255,0.12); border-radius: 14px; padding: 14px 10px; text-align: center; }
        .champ-stat-accent { background: rgba(20,184,166,0.15); border-color: rgba(20,184,166,0.3); }
        .champ-stat-num { font-size: clamp(18px,3vw,28px); font-weight: 900; color: #fff; }
        .champ-stat-num-accent { color: #14B8A6; }
        .champ-stat-label { font-size: 11px; color: rgba(255,255,255,0.5); margin-top: 2px; }
        .champ-stat-label-accent { color: rgba(20,184,166,0.7); }
        @media (max-width: 480px) {
          .champ-stats { grid-template-columns: repeat(2, 1fr); max-width: 320px; gap: 8px; }
          .champ-stat { padding: 12px 8px; border-radius: 12px; }
        }

        /* ── Контент ── */
        .champ-content { max-width: 1100px; margin: 0 auto; padding: 32px 16px 80px; }

        /* ── Быстрые ссылки ── */
        .champ-quicklinks { display: flex; gap: 10px; flex-wrap: wrap; margin-bottom: 28px; }
        .champ-quicklink { display: flex; align-items: center; gap: 8px; padding: 10px 16px; border-radius: 10px; background: #fff; border: 1.5px solid #e2e8f0; color: #0f172a; text-decoration: none; font-size: 14px; font-weight: 600; box-shadow: 0 1px 4px rgba(0,0,0,0.04); white-space: nowrap; }
        @media (max-width: 480px) { .champ-quicklink { font-size: 13px; padding: 8px 12px; } }

        /* ── Табы ── */
        .champ-tabs { display: flex; gap: 4px; background: #f1f5f9; border-radius: 12px; padding: 4px; margin-bottom: 24px; width: fit-content; max-width: 100%; overflow-x: auto; }
        .champ-tab { display: flex; align-items: center; gap: 6px; padding: 9px 16px; border-radius: 9px; border: none; background: transparent; color: #64748b; font-size: 14px; font-weight: 600; cursor: pointer; transition: all 0.15s; white-space: nowrap; flex-shrink: 0; }
        .champ-tab-active { background: #fff; color: #0f172a; box-shadow: 0 1px 4px rgba(0,0,0,0.08); }
        .champ-tab-badge { border-radius: 10px; padding: 1px 7px; font-size: 11px; font-weight: 700; color: #fff; background: #cbd5e1; }
        .champ-tab-badge-active { background: #0f172a; }
        @media (max-width: 480px) {
          .champ-tab { padding: 8px 12px; font-size: 13px; gap: 4px; }
          .champ-tab-icon { display: none; }
        }

        /* ── Сетка турниров ── */
        .champ-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 16px; }
        @media (max-width: 640px) { .champ-grid { grid-template-columns: 1fr; } }

        /* ── Карточка турнира ── */
        .champ-card { background: #fff; border-radius: 16px; border: 1.5px solid #e2e8f0; padding: 20px; cursor: pointer; transition: box-shadow 0.15s, transform 0.15s; }
        .champ-card:active { transform: scale(0.99); }
        @media (hover: hover) {
          .champ-card:hover { box-shadow: 0 8px 32px rgba(0,0,0,0.1); transform: translateY(-2px); }
        }

        /* ── «Как работает» ── */
        .champ-steps { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; }
        @media (max-width: 900px) { .champ-steps { grid-template-columns: repeat(2, 1fr); } }
        @media (max-width: 480px) { .champ-steps { grid-template-columns: 1fr; gap: 12px; } }

        /* ── Уровни ── */
        .champ-levels { margin-top: 56px; background: #0f172a; border-radius: 20px; padding: 36px 20px; }
        .champ-levels-grid { display: flex; gap: 8px; flex-wrap: wrap; justify-content: center; }
        .champ-level { background: rgba(255,255,255,0.06); border-radius: 12px; padding: 14px 16px; text-align: center; min-width: 90px; }

        /* ── CTA ── */
        .champ-cta { margin-top: 40px; }
        .champ-cta-inner { background: linear-gradient(135deg, #6366f1, #8b5cf6); border-radius: 20px; padding: 36px 24px; text-align: center; }

        /* ── Скелетон ── */
        @keyframes champ-pulse { 0%,100%{opacity:1} 50%{opacity:.5} }
        .champ-skeleton { border-radius: 16px; background: #e2e8f0; animation: champ-pulse 1.5s ease infinite; }
      `}</style>

      {/* Шапка */}
      <div className="champ-hero">
        <div className="champ-hero-bg" />
        <div className="champ-hero-overlay" />
        <nav className="champ-nav">
          <Link to="/"><BrandLogo variant="light" size="sm" /></Link>
          <div className="champ-nav-links">
            <Link to="/championship/rating" className="champ-nav-link champ-nav-link-hide">Рейтинг</Link>
            <Link to="/championship/hall-of-fame" className="champ-nav-link champ-nav-link-hide">Зал славы</Link>
            <Link to="/cabinet" className="champ-nav-link champ-nav-link-accent">Кабинет</Link>
          </div>
        </nav>

        <div className="champ-hero-inner">
          <div className="champ-hero-badge">
            <span style={{ fontSize: 14 }}>🏆</span>
            <span style={{ fontSize: 13, color: "#14B8A6", fontWeight: 700, letterSpacing: 1 }}>ЧЕМПИОНАТ КРАСОТЫ</span>
          </div>

          {stats?.active_season ? (
            <>
              <h1 className="champ-hero-h1">
                Идёт сезон<br />
                <span style={{ color: "#14B8A6" }}>{stats.active_season.name}</span>
              </h1>
              <p className="champ-hero-sub">Докажи, что твой салон лучший. Победи и войди в историю.</p>
            </>
          ) : (
            <>
              <h1 className="champ-hero-h1">
                Победа строит<br />
                <span style={{ color: "#14B8A6" }}>репутацию</span>
              </h1>
              <p className="champ-hero-sub">
                Участвуй в турнирах — каждая победа повышает статус салона,<br />
                привлекает новых клиентов и остаётся в истории навсегда.
              </p>
            </>
          )}

          {/* Репутационные преимущества */}
          {!stats?.active_season && (
            <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap", marginBottom: 36 }}>
              {[
                { icon: "⭐", title: "Репутация и доверие", desc: "Статус эксперта индустрии" },
                { icon: "👥", title: "Новые клиенты", desc: "Победители привлекают больше" },
                { icon: "💎", title: "Бренд и известность", desc: "Узнаваемость на всю страну" },
                { icon: "🏛", title: "История навсегда", desc: "Зал славы чемпионата" },
              ].map(item => (
                <div key={item.title} style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12, padding: "14px 16px", textAlign: "center", minWidth: 140, maxWidth: 160 }}>
                  <div style={{ fontSize: 22, marginBottom: 6 }}>{item.icon}</div>
                  <div style={{ fontSize: 12, fontWeight: 700, color: "#fff", marginBottom: 3 }}>{item.title}</div>
                  <div style={{ fontSize: 11, color: "rgba(255,255,255,0.5)" }}>{item.desc}</div>
                </div>
              ))}
            </div>
          )}

          {stats && (
            <div className="champ-stats">
              {[
                { v: stats.participants, label: "участников" },
                { v: stats.works,        label: "работ" },
                { v: stats.votes,        label: "голосов" },
                { v: stats.tournaments,  label: "турниров" },
              ].map(({ v, label }) => (
                <div key={label} className="champ-stat">
                  <div className="champ-stat-num">{v.toLocaleString("ru")}</div>
                  <div className="champ-stat-label">{label}</div>
                </div>
              ))}
              {stats.active_season?.total_prize ? (
                <div className="champ-stat champ-stat-accent">
                  <div className="champ-stat-num champ-stat-num-accent">{stats.active_season.total_prize.toLocaleString("ru")} ⚡</div>
                  <div className="champ-stat-label champ-stat-label-accent">призовой фонд</div>
                </div>
              ) : null}
            </div>
          )}
        </div>
      </div>

      {/* Контент */}
      <div className="champ-content">

        {/* Быстрые ссылки */}
        <div className="champ-quicklinks">
          {[
            { to: "/championship/rating",       icon: "BarChart3", label: "Рейтинг салонов" },
            { to: "/championship/hall-of-fame",  icon: "Trophy",    label: "Зал славы" },
          ].map(({ to, icon, label }) => (
            <Link key={to} to={to} className="champ-quicklink">
              <Icon name={icon} size={16} style={{ color: "#14B8A6", flexShrink: 0 }} />
              {label}
            </Link>
          ))}
        </div>

        {/* Табы */}
        <div className="champ-tabs">
          {tabList.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`champ-tab${activeTab === tab.id ? " champ-tab-active" : ""}`}
            >
              <span className="champ-tab-icon"><Icon name={tab.icon} size={14} /></span>
              {tab.label}
              {tab.count > 0 && (
                <span className={`champ-tab-badge${activeTab === tab.id ? " champ-tab-badge-active" : ""}`}>
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Турниры */}
        {loading ? (
          <div className="champ-grid">
            {[1, 2, 3].map(i => <div key={i} className="champ-skeleton" style={{ height: 220 }} />)}
          </div>
        ) : shown.length === 0 ? (
          <div>
            {activeTab === "current" && (
              <div
                onClick={() => navigate("/cabinet?tab=championship")}
                style={{
                  position: "relative",
                  borderRadius: 20,
                  overflow: "hidden",
                  cursor: "pointer",
                  marginBottom: 32,
                  boxShadow: "0 8px 32px rgba(0,0,0,0.18)",
                  transition: "transform 0.15s",
                }}
                onMouseEnter={e => (e.currentTarget.style.transform = "translateY(-2px)")}
                onMouseLeave={e => (e.currentTarget.style.transform = "translateY(0)")}
              >
                <img
                  src="https://cdn.poehali.dev/projects/10f61e56-9821-40f3-b705-3590ddaffd08/bucket/31acfb17-63d3-41f9-aff7-bd83f16618f2.png"
                  alt="Скоро стартует турнир салонов красоты"
                  style={{ width: "100%", display: "block" }}
                />
              </div>
            )}
            <div style={{ textAlign: "center", padding: "24px 0 32px", color: "#64748b" }}>
              <div style={{ fontSize: 44, marginBottom: 12 }}>🏁</div>
              <div style={{ fontSize: 18, fontWeight: 700, color: "#0f172a", marginBottom: 6 }}>
                {activeTab === "current" ? "Нет активных турниров" : activeTab === "upcoming" ? "Нет предстоящих турниров" : "Архив пока пуст"}
              </div>
              <div style={{ fontSize: 14, color: "#94a3b8" }}>Следите за анонсами — скоро появятся новые соревнования</div>
            </div>
          </div>
        ) : (
          <div className="champ-grid">
            {shown.map(t => (
              <TournamentCard key={t.id} t={t} onClick={() => navigate(`/championship/tournament/${t.slug}`)} />
            ))}
          </div>
        )}

        {/* Как работает */}
        <div style={{ marginTop: 56 }}>
          <h2 style={{ fontSize: "clamp(20px,4vw,28px)", fontWeight: 800, color: "#0f172a", marginBottom: 8, textAlign: "center" }}>Как это работает</h2>
          <p style={{ textAlign: "center", color: "#64748b", fontSize: 15, marginBottom: 32 }}>Четыре простых шага от регистрации до победы</p>
          <div className="champ-steps">
            {[
              { n: "01", icon: "UserPlus", title: "Регистрация",  desc: "Зарегистрируйте салон и подайте заявку на турнир" },
              { n: "02", icon: "Image",    title: "Работа",       desc: "Выполните задание и загрузите результат до дедлайна" },
              { n: "03", icon: "Heart",    title: "Голосование",  desc: "Соберите голоса клиентов, друзей и подписчиков" },
              { n: "04", icon: "Trophy",   title: "Победа",       desc: "Получите приз, достижение и место в Зале славы" },
            ].map(s => (
              <div key={s.n} style={{ background: "#fff", borderRadius: 20, padding: "28px 22px", border: "1.5px solid #e2e8f0", display: "flex", flexDirection: "column" }}>
                <div style={{ width: 48, height: 48, borderRadius: 14, background: "#f0fdf4", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 18, flexShrink: 0 }}>
                  <Icon name={s.icon} size={22} style={{ color: "#14B8A6" }} />
                </div>
                <div style={{ fontSize: 10, fontWeight: 700, color: "#14B8A6", marginBottom: 6, letterSpacing: 1.5 }}>ШАГ {s.n}</div>
                <div style={{ fontSize: 16, fontWeight: 800, color: "#0f172a", marginBottom: 8, lineHeight: 1.2 }}>{s.title}</div>
                <div style={{ fontSize: 13, color: "#64748b", lineHeight: 1.7, flex: 1 }}>{s.desc}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Уровни */}
        <div className="champ-levels">
          <h2 style={{ fontSize: "clamp(18px,3vw,24px)", fontWeight: 800, marginBottom: 8, textAlign: "center", color: "#fff" }}>Уровни салона</h2>
          <p style={{ textAlign: "center", color: "rgba(255,255,255,0.5)", fontSize: 13, marginBottom: 28 }}>Каждый турнир приносит очки. Очки повышают статус.</p>
          <div className="champ-levels-grid">
            {[
              { level: "Новичок",      pts: "0+",    color: "#94a3b8" },
              { level: "Участник",     pts: "100+",  color: "#3b82f6" },
              { level: "Профессионал", pts: "500+",  color: "#8b5cf6" },
              { level: "Эксперт",      pts: "1200+", color: "#f59e0b" },
              { level: "Премиум",      pts: "3000+", color: "#ec4899" },
              { level: "Легенда",      pts: "6000+", color: "#f97316" },
            ].map(l => (
              <div key={l.level} className="champ-level" style={{ border: `1.5px solid ${l.color}40` }}>
                <div style={{ width: 10, height: 10, borderRadius: "50%", background: l.color, margin: "0 auto 8px" }} />
                <div style={{ fontSize: 13, fontWeight: 700, color: "#fff", marginBottom: 2 }}>{l.level}</div>
                <div style={{ fontSize: 11, color: l.color, fontWeight: 600 }}>{l.pts} очков</div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="champ-cta">
          <div className="champ-cta-inner">
            <h2 style={{ margin: "0 0 10px", fontSize: "clamp(18px,3vw,24px)", fontWeight: 800, color: "#fff" }}>Готовы участвовать?</h2>
            <p style={{ margin: "0 0 22px", fontSize: 15, color: "rgba(255,255,255,0.8)" }}>
              Зарегистрируйте салон и получите 100 ⚡ энергии в подарок
            </p>
            <Link to="/cabinet" style={{ display: "inline-block", padding: "13px 32px", background: "#fff", color: "#6366f1", borderRadius: 12, textDecoration: "none", fontSize: 15, fontWeight: 800 }}>
              Войти в кабинет →
            </Link>
          </div>
        </div>

      </div>
      <BizFooter />
    </div>
  );
}

function TournamentCard({ t, onClick }: { t: Tournament; onClick: () => void }) {
  const statusColor = STATUS_COLORS[t.status] || "#64748b";
  const statusLabel = STATUS_LABELS[t.status] || t.status;

  const fmt = (d: string) => d ? new Date(d).toLocaleDateString("ru", { day: "numeric", month: "short" }) : "";

  const dateInfo = (() => {
    if (["announced", "registration"].includes(t.status) && t.registration_ends)
      return { label: "Регистрация до", value: fmt(t.registration_ends), icon: "CalendarClock" };
    if (t.status === "active" && t.work_deadline)
      return { label: "Дедлайн работ", value: fmt(t.work_deadline), icon: "Clock" };
    if (t.status === "voting" && t.voting_ends)
      return { label: "Голосование до", value: fmt(t.voting_ends), icon: "Vote" };
    if (t.registration_starts)
      return { label: "Старт регистрации", value: fmt(t.registration_starts), icon: "CalendarClock" };
    return null;
  })();

  return (
    <div onClick={onClick} className="champ-card" style={{ padding: 0, overflow: "hidden", display: "flex", flexDirection: "column" }}>

      {/* Фото обложки */}
      <div style={{ position: "relative", height: 180, background: t.cover_image_url ? "transparent" : "linear-gradient(135deg,#0f172a,#1e293b)", flexShrink: 0 }}>
        {t.cover_image_url ? (
          <img src={t.cover_image_url} alt={t.name} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
        ) : (
          <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 52 }}>
            {t.emoji}
          </div>
        )}
        {/* Оверлей с градиентом */}
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.55) 0%, transparent 60%)" }} />
        {/* Статус бейдж */}
        <span style={{ position: "absolute", top: 12, right: 12, background: `${statusColor}dd`, color: "#fff", borderRadius: 20, padding: "4px 12px", fontSize: 11, fontWeight: 700, backdropFilter: "blur(4px)" }}>
          {statusLabel}
        </span>
        {/* Эмодзи поверх фото */}
        {t.cover_image_url && (
          <span style={{ position: "absolute", bottom: 10, left: 14, fontSize: 22 }}>{t.emoji}</span>
        )}
        {t.postponed && (
          <span style={{ position: "absolute", top: 12, left: 12, background: "#fbbf24dd", color: "#78350f", borderRadius: 20, padding: "4px 10px", fontSize: 11, fontWeight: 700 }}>
            ⏰ Перенесён
          </span>
        )}
      </div>

      {/* Контент */}
      <div style={{ padding: "16px 18px 18px", display: "flex", flexDirection: "column", flex: 1 }}>
        <h3 style={{ margin: "0 0 6px", fontSize: 16, fontWeight: 800, color: "#0f172a", lineHeight: 1.3 }}>{t.name}</h3>
        <p style={{ margin: "0 0 14px", fontSize: 13, color: "#64748b", lineHeight: 1.6, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden", flex: 1 }}>
          {t.description}
        </p>

        {/* Призы */}
        {(t.prize_energy > 0 || t.prize_2nd > 0 || t.prize_3rd > 0) && (
          <div style={{ display: "flex", gap: 6, marginBottom: 12, flexWrap: "wrap" }}>
            {t.prize_energy > 0 && (
              <span style={{ background: "linear-gradient(135deg,#fbbf24,#f59e0b)", color: "#fff", borderRadius: 8, padding: "4px 10px", fontSize: 12, fontWeight: 700 }}>
                🥇 {t.prize_energy}⚡
              </span>
            )}
            {t.prize_2nd > 0 && (
              <span style={{ background: "#f1f5f9", color: "#475569", borderRadius: 8, padding: "4px 10px", fontSize: 12, fontWeight: 700 }}>
                🥈 {t.prize_2nd}⚡
              </span>
            )}
            {t.prize_3rd > 0 && (
              <span style={{ background: "#f1f5f9", color: "#475569", borderRadius: 8, padding: "4px 10px", fontSize: 12, fontWeight: 700 }}>
                🥉 {t.prize_3rd}⚡
              </span>
            )}
          </div>
        )}

        {/* Дата и участники */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
            {dateInfo && (
              <div style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 12, color: "#64748b" }}>
                <Icon name={dateInfo.icon} size={13} style={{ color: "#14B8A6" }} />
                <span>{dateInfo.label}: <b style={{ color: "#0f172a" }}>{dateInfo.value}</b></span>
              </div>
            )}
            {t.applications_count > 0 && (
              <div style={{ fontSize: 12, color: "#94a3b8" }}>
                <b style={{ color: "#0f172a" }}>{t.applications_count}</b> участников
              </div>
            )}
          </div>
          {t.status === "voting" ? (
            <div style={{ display: "flex", alignItems: "center", gap: 6, background: "#f59e0b", color: "#fff", borderRadius: 10, padding: "8px 14px", fontSize: 13, fontWeight: 700, flexShrink: 0, cursor: "pointer" }}>
              <Icon name="Vote" size={14} /> Идёт голосование
            </div>
          ) : t.status === "finished" ? (
            <div style={{ display: "flex", alignItems: "center", gap: 6, background: "#f1f5f9", color: "#64748b", borderRadius: 10, padding: "8px 14px", fontSize: 13, fontWeight: 700, flexShrink: 0, cursor: "pointer" }}>
              Итоги <Icon name="ArrowRight" size={14} />
            </div>
          ) : (
            <div style={{ display: "flex", alignItems: "center", gap: 6, background: "#14B8A6", color: "#fff", borderRadius: 10, padding: "8px 14px", fontSize: 13, fontWeight: 700, flexShrink: 0, cursor: "pointer" }}>
              Подать заявку <Icon name="ArrowRight" size={14} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}