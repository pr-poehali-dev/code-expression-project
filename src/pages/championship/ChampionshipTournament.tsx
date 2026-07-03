import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Icon from "@/components/ui/icon";
import { champGet, champPost, voteGet, votePost, STATUS_LABELS, STATUS_COLORS } from "./championshipApi";
import { useLkAuth } from "@/contexts/LkAuthContext";

const getSessionId = () => localStorage.getItem("lk_session") || "";

interface Tournament {
  id: number; name: string; slug: string; emoji: string; description: string;
  rules: string; task_text: string; status: string; prize_energy: number;
  prize_2nd: number; prize_3rd: number; min_participants: number;
  registration_starts: string; registration_ends: string;
  task_opens_at: string; work_deadline: string;
  voting_starts: string; voting_ends: string;
  applications_count: number; works_count: number;
  postponed: boolean; postpone_reason: string;
  prizes: Prize[]; season_name: string;
  my_application_status: string | null;
}
interface Prize { id: number; place: number; title: string; description: string; photo_url: string; value: string; partner_name: string; partner_logo: string; }
interface Work {
  id: number; title: string; description: string; photos: { url: string; caption?: string }[];
  story: string; services_done: string; master_name: string; tools_used: string; video_url: string;
  votes_count: number; final_place: number | null; created_at: string;
  salon_name: string | null; salon_logo: string | null; salon_city: string | null; salon_url: string | null;
}

const CSS = `
  @keyframes ct-spin { to { transform: rotate(360deg); } }

  .ct-wrap { min-height: 100vh; background: #f8fafc; font-family: Inter, sans-serif; }

  /* Шапка */
  .ct-header { background: linear-gradient(135deg,#0f172a,#1e3a5f); padding: 20px 16px; }
  .ct-header-inner { max-width: 960px; margin: 0 auto; }
  .ct-back { color: rgba(255,255,255,0.5); text-decoration: none; font-size: 13px; }
  .ct-title-row { display: flex; align-items: flex-start; gap: 14px; margin-top: 14px; flex-wrap: wrap; }
  .ct-emoji { font-size: 40px; flex-shrink: 0; }
  .ct-title-info { flex: 1; min-width: 0; }
  .ct-season { font-size: 11px; color: rgba(255,255,255,0.4); font-weight: 600; letter-spacing: 1px; margin-bottom: 4px; }
  .ct-h1 { margin: 0 0 8px; font-size: clamp(18px,4vw,30px); font-weight: 900; color: #fff; line-height: 1.2; }
  .ct-badges { display: flex; gap: 8px; flex-wrap: wrap; align-items: center; }
  .ct-apply-btn { padding: 12px 22px; border-radius: 12px; border: none; background: #14B8A6; color: #fff; font-size: 14px; font-weight: 800; cursor: pointer; flex-shrink: 0; align-self: flex-start; }
  .ct-apply-btn:disabled { opacity: 0.7; cursor: wait; }
  .ct-applied-badge { padding: 12px 16px; border-radius: 12px; background: rgba(20,184,166,0.15); border: 1.5px solid rgba(20,184,166,0.4); color: #14B8A6; font-size: 13px; font-weight: 700; flex-shrink: 0; align-self: flex-start; }
  .ct-login-btn { padding: 12px 20px; border-radius: 12px; background: #fff; color: #0f172a; font-size: 13px; font-weight: 700; text-decoration: none; flex-shrink: 0; align-self: flex-start; }

  /* Postponed */
  .ct-postponed { background: #fffbeb; border-bottom: 1px solid #fde68a; padding: 10px 16px; text-align: center; font-size: 13px; color: #92400e; }

  /* Контент */
  .ct-content { max-width: 960px; margin: 0 auto; padding: 20px 16px 64px; }

  /* Табы */
  .ct-tabs { display: flex; gap: 4px; background: #f1f5f9; border-radius: 12px; padding: 4px; width: fit-content; max-width: 100%; overflow-x: auto; margin-bottom: 24px; }
  .ct-tab { padding: 9px 16px; border-radius: 9px; border: none; background: transparent; color: #64748b; font-size: 14px; font-weight: 600; cursor: pointer; white-space: nowrap; }
  .ct-tab-active { background: #fff; color: #0f172a; box-shadow: 0 1px 4px rgba(0,0,0,0.08); }

  /* Вкладка «О турнире» — двух-колоночная на десктопе */
  .ct-info-grid { display: grid; grid-template-columns: 1fr 300px; gap: 24px; align-items: start; }
  @media (max-width: 700px) { .ct-info-grid { grid-template-columns: 1fr; } }

  .ct-section { margin-bottom: 22px; }
  .ct-section-title { margin: 0 0 10px; font-size: 15px; font-weight: 700; color: #0f172a; }
  .ct-sidebar-card { background: #fff; border-radius: 14px; border: 1.5px solid #e2e8f0; padding: 18px; margin-bottom: 14px; }
  .ct-sidebar-row { display: flex; justify-content: space-between; margin-bottom: 8px; font-size: 13px; }
  .ct-sidebar-label { color: #64748b; }
  .ct-sidebar-val { font-weight: 700; color: #0f172a; }

  /* Сетка работ */
  .ct-works-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: 16px; }
  @media (max-width: 560px) { .ct-works-grid { grid-template-columns: 1fr; } }

  /* Карточка работы */
  .ct-work-card { background: #fff; border-radius: 14px; border: 1.5px solid #e2e8f0; overflow: hidden; }
  .ct-work-photo { height: 180px; background: #f1f5f9; position: relative; }
  .ct-work-body { padding: 14px; }
  .ct-vote-btn { padding: 8px 14px; border-radius: 8px; border: none; font-size: 13px; font-weight: 700; cursor: pointer; }
  .ct-vote-btn-active { background: #14B8A6; color: #fff; }
  .ct-vote-btn-voted { background: #f0fdf4; color: #059669; cursor: default; }
`;

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
  const canApply = ["announced", "registration"].includes(t.status) && !!user && !applied;
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
      <style>{CSS}</style>

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
              <button className="ct-apply-btn" onClick={handleApply} disabled={applying}>
                {applying ? "Подаём…" : "Участвовать"}
              </button>
            )}
            {applied && <div className="ct-applied-badge">✓ Заявка подана</div>}
            {!user && ["announced", "registration"].includes(t.status) && (
              <Link to="/cabinet" className="ct-login-btn">Войти →</Link>
            )}
          </div>
        </div>
      </div>

      {t.postponed && (
        <div className="ct-postponed">⏰ {t.postpone_reason}</div>
      )}

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
        {tab === "info" && (
          <div className="ct-info-grid">
            <div>
              {t.description && (
                <div className="ct-section">
                  <h3 className="ct-section-title">Описание</h3>
                  <p style={{ margin: 0, fontSize: 15, color: "#374151", lineHeight: 1.7 }}>{t.description}</p>
                </div>
              )}
              {t.task_text && (
                <div className="ct-section">
                  <h3 className="ct-section-title">🎯 Задание</h3>
                  <div style={{ background: "#eef2ff", borderRadius: 10, padding: "16px", border: "1.5px solid #c7d2fe" }}>
                    <p style={{ margin: 0, fontSize: 14, color: "#3730a3", lineHeight: 1.7, whiteSpace: "pre-wrap" }}>{t.task_text}</p>
                  </div>
                </div>
              )}
              {!t.task_text && ["announced", "registration"].includes(t.status) && (
                <div className="ct-section">
                  <h3 className="ct-section-title">🎯 Задание</h3>
                  <div style={{ background: "#f8fafc", borderRadius: 10, padding: "20px", border: "1.5px dashed #cbd5e1", textAlign: "center" }}>
                    <div style={{ fontSize: 28, marginBottom: 8 }}>🔒</div>
                    <div style={{ fontSize: 13, color: "#64748b" }}>Задание откроется в момент старта турнира</div>
                  </div>
                </div>
              )}
              {t.rules && (
                <div className="ct-section">
                  <h3 className="ct-section-title">Правила</h3>
                  <p style={{ margin: 0, fontSize: 14, color: "#374151", lineHeight: 1.8, whiteSpace: "pre-wrap" }}>{t.rules}</p>
                </div>
              )}
            </div>

            {/* Сайдбар */}
            <div>
              <div className="ct-sidebar-card">
                <div style={{ fontSize: 13, fontWeight: 700, color: "#0f172a", marginBottom: 12 }}>📅 Сроки</div>
                {[
                  { label: "Регистрация до", date: t.registration_ends },
                  { label: "Старт турнира",  date: t.task_opens_at },
                  { label: "Дедлайн работ",  date: t.work_deadline },
                  { label: "Голосование до", date: t.voting_ends },
                ].filter(r => r.date).map(r => (
                  <div key={r.label} className="ct-sidebar-row">
                    <span className="ct-sidebar-label">{r.label}</span>
                    <span className="ct-sidebar-val">{new Date(r.date!).toLocaleDateString("ru", { day: "numeric", month: "short" })}</span>
                  </div>
                ))}
                <div className="ct-sidebar-row" style={{ marginTop: 8, paddingTop: 8, borderTop: "1px solid #f1f5f9", marginBottom: 0 }}>
                  <span className="ct-sidebar-label">Мин. участников</span>
                  <span className="ct-sidebar-val">{t.min_participants}</span>
                </div>
              </div>

              {(t.prize_energy > 0 || t.prizes?.length > 0) && (
                <div className="ct-sidebar-card">
                  <div style={{ fontSize: 13, fontWeight: 700, color: "#0f172a", marginBottom: 12 }}>🏅 Призы</div>
                  {t.prize_energy > 0 && (
                    <div className="ct-sidebar-row">
                      <span>🥇 1 место</span>
                      <span style={{ fontWeight: 700, color: "#14B8A6" }}>{t.prize_energy} ⚡</span>
                    </div>
                  )}
                  {t.prize_2nd > 0 && (
                    <div className="ct-sidebar-row">
                      <span>🥈 2 место</span>
                      <span style={{ fontWeight: 700, color: "#14B8A6" }}>{t.prize_2nd} ⚡</span>
                    </div>
                  )}
                  {t.prize_3rd > 0 && (
                    <div className="ct-sidebar-row">
                      <span>🥉 3 место</span>
                      <span style={{ fontWeight: 700, color: "#14B8A6" }}>{t.prize_3rd} ⚡</span>
                    </div>
                  )}
                  {t.prizes?.map(p => (
                    <div key={p.id} style={{ marginTop: 10, paddingTop: 10, borderTop: "1px solid #f1f5f9" }}>
                      <div style={{ fontSize: 11, color: "#94a3b8", marginBottom: 3 }}>
                        {["🥇","🥈","🥉","4️⃣","5️⃣"][p.place - 1] || `${p.place} место`} от {p.partner_name}
                      </div>
                      <div style={{ fontSize: 13, fontWeight: 700, color: "#0f172a" }}>{p.title}</div>
                      {p.value && <div style={{ fontSize: 12, color: "#14B8A6", fontWeight: 600 }}>{p.value}</div>}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Работы */}
        {tab === "works" && (
          <div>
            {!isFinished && isVoting && (
              <ShareBanner url={`https://promtdialog.ru/championship/tournament/${t.slug}`} tournamentName={t.name} />
            )}
            {works.length === 0 ? (
              <div style={{ textAlign: "center", padding: "56px 0" }}>
                <div style={{ fontSize: 36, marginBottom: 10 }}>🖼</div>
                <div style={{ fontSize: 16, fontWeight: 700, color: "#0f172a" }}>Работы пока не загружены</div>
                <div style={{ fontSize: 13, color: "#94a3b8", marginTop: 4 }}>Появятся после модерации</div>
              </div>
            ) : (
              <div className="ct-works-grid">
                {works.map((w, i) => (
                  <WorkCard key={w.id} work={w} isVoting={isVoting} isFinished={isFinished}
                    voted={votedIds.includes(w.id)} loading={voteLoading === w.id}
                    onVote={() => handleVote(w.id)} index={i} />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function ShareBanner({ url, tournamentName }: { url: string; tournamentName: string }) {
  const [copied, setCopied] = useState(false);

  const shareText = `🏆 Голосование за лучшую работу — «${tournamentName}»!\n\nПоддержите своих мастеров красоты — один голос решает многое!\n\n👉 ${url}`;

  const copy = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const canNativeShare = typeof navigator.share === "function";

  const nativeShare = () => {
    navigator.share({ title: `Голосование — ${tournamentName}`, text: shareText, url });
  };

  return (
    <div style={{ background: "linear-gradient(135deg,#1e1b4b,#312e81)", borderRadius: 14, padding: "18px 20px", marginBottom: 24, display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap" }}>
      <div style={{ flex: 1, minWidth: 200 }}>
        <div style={{ fontSize: 14, fontWeight: 800, color: "#fff", marginBottom: 3 }}>🗳 Помогите выбрать победителя!</div>
        <div style={{ fontSize: 12, color: "rgba(255,255,255,0.65)", lineHeight: 1.5 }}>
          Поделитесь страницей — друзья и клиенты тоже могут проголосовать
        </div>
      </div>
      <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
        {canNativeShare && (
          <button onClick={nativeShare} style={{ padding: "9px 16px", borderRadius: 9, border: "none", background: "#14B8A6", color: "#fff", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>
            Поделиться
          </button>
        )}
        <button onClick={() => copy(shareText)} style={{ padding: "9px 16px", borderRadius: 9, border: "1px solid rgba(255,255,255,0.15)", background: copied ? "rgba(255,255,255,0.15)" : "rgba(255,255,255,0.1)", color: copied ? "#86efac" : "#fff", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>
          {copied ? "✓ Скопировано" : "Скопировать ссылку"}
        </button>
      </div>
    </div>
  );
}

function WorkCard({ work: w, isVoting, isFinished, voted, loading, onVote, index }:
  { work: Work; isVoting: boolean; isFinished: boolean; voted: boolean; loading: boolean; onVote: () => void; index: number }) {
  const [open, setOpen] = useState(false);
  const photo = w.photos?.[0]?.url;
  // Во время голосования скрываем название и данные салона — показываем только номер
  const displayTitle = isVoting ? `Работа #${index + 1}` : w.title;
  const hasDetails = !!(w.description || w.story || w.services_done || w.master_name || w.tools_used || w.video_url || (w.photos && w.photos.length > 1));

  return (
    <div className="ct-work-card">
      <div className="ct-work-photo" style={{ background: photo ? `url(${photo}) center/cover` : "#f1f5f9", cursor: hasDetails ? "pointer" : "default" }}
        onClick={() => hasDetails && setOpen(o => !o)}>
        {!photo && (
          <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 36 }}>🖼</div>
        )}
        {w.final_place && w.final_place <= 3 && (
          <div style={{ position: "absolute", top: 10, left: 10, background: "#fff", borderRadius: 20, padding: "3px 10px", fontSize: 12, fontWeight: 700 }}>
            {["🥇","🥈","🥉"][w.final_place - 1]} {w.final_place} место
          </div>
        )}
      </div>
      <div className="ct-work-body">
        {displayTitle && <div style={{ fontSize: 14, fontWeight: 700, color: "#0f172a", marginBottom: 5 }}>{displayTitle}</div>}
        {w.description && (
          <p style={{ margin: "0 0 8px", fontSize: 12, color: "#64748b", lineHeight: 1.6, display: open ? "block" : "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: open ? "visible" : "hidden" }}>
            {w.description}
          </p>
        )}

        {hasDetails && (
          <button onClick={() => setOpen(o => !o)} style={{ background: "none", border: "none", padding: 0, marginBottom: 8, color: "#14B8A6", fontSize: 12, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", gap: 4 }}>
            {open ? "Свернуть" : "Подробнее о работе"} <Icon name={open ? "ChevronUp" : "ChevronDown"} size={13} />
          </button>
        )}

        {open && (
          <div style={{ background: "#f8fafc", borderRadius: 10, padding: "12px 14px", marginBottom: 10, display: "flex", flexDirection: "column", gap: 10 }}>
            {w.photos && w.photos.length > 1 && (
              <div style={{ display: "flex", gap: 6, overflowX: "auto" }}>
                {w.photos.map((p, i) => (
                  <img key={i} src={p.url} alt={p.caption || ""} title={p.caption || ""}
                    style={{ width: 72, height: 72, objectFit: "cover", borderRadius: 8, flexShrink: 0 }} />
                ))}
              </div>
            )}
            {w.master_name && (
              <div style={{ fontSize: 12, color: "#374151" }}><b style={{ color: "#0f172a" }}>Мастер:</b> {w.master_name}</div>
            )}
            {w.services_done && (
              <div style={{ fontSize: 12, color: "#374151" }}><b style={{ color: "#0f172a" }}>Услуги:</b> {w.services_done}</div>
            )}
            {w.tools_used && (
              <div style={{ fontSize: 12, color: "#374151" }}><b style={{ color: "#0f172a" }}>Инструменты и техники:</b> {w.tools_used}</div>
            )}
            {w.story && (
              <div style={{ fontSize: 12, color: "#374151", lineHeight: 1.6, whiteSpace: "pre-wrap" }}><b style={{ color: "#0f172a" }}>История клиента:</b><br />{w.story}</div>
            )}
            {w.video_url && (
              <a href={w.video_url} target="_blank" rel="noreferrer" style={{ fontSize: 12, color: "#14B8A6", fontWeight: 700, textDecoration: "none", display: "flex", alignItems: "center", gap: 4 }}>
                <Icon name="Play" size={13} /> Смотреть видео
              </a>
            )}
          </div>
        )}

        {isFinished && w.salon_name && (
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10, paddingTop: 8, borderTop: "1px solid #f1f5f9" }}>
            {w.salon_logo && <img src={w.salon_logo} alt="" style={{ width: 26, height: 26, borderRadius: 6, objectFit: "cover" }} />}
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: "#0f172a" }}>{w.salon_name}</div>
              {w.salon_city && <div style={{ fontSize: 11, color: "#94a3b8" }}>{w.salon_city}</div>}
            </div>
            {w.salon_url && (
              <a href={w.salon_url} target="_blank" rel="noreferrer"
                style={{ fontSize: 11, color: "#14B8A6", fontWeight: 600, textDecoration: "none", flexShrink: 0 }}>сайт →</a>
            )}
          </div>
        )}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 8 }}>
          <div style={{ fontSize: 12, color: "#64748b" }}>
            ❤️ <b style={{ color: "#0f172a" }}>{w.votes_count.toLocaleString("ru")}</b>
          </div>
          {isVoting && (
            <button onClick={onVote} disabled={voted || loading}
              className={`ct-vote-btn ${voted ? "ct-vote-btn-voted" : "ct-vote-btn-active"}`}
              style={{ opacity: loading ? 0.7 : 1 }}>
              {loading ? "…" : voted ? "✓ Голос отдан" : "Голосовать"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}