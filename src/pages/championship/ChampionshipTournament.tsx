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
}
interface Prize { id: number; place: number; title: string; description: string; photo_url: string; value: string; partner_name: string; partner_logo: string; }
interface Work {
  id: number; title: string; description: string; photos: {url:string;caption?:string}[];
  votes_count: number; final_place: number | null; created_at: string;
  salon_name: string | null; salon_logo: string | null; salon_city: string | null; salon_url: string | null;
}

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
    champGet("tournament", { slug }).then(d => {
      setTournament(d.tournament);
      if (d.tournament && ["voting","finished"].includes(d.tournament.status)) {
        setTab("works");
        champGet("works", { tournament_id: String(d.tournament.id) }).then(w => setWorks(w.works || []));
      }
    }).finally(() => setLoading(false));
  }, [slug]);

  useEffect(() => {
    if (!tournament || !["voting","finished"].includes(tournament.status)) return;
    voteGet("my_votes", { tournament_id: String(tournament.id) }, getSessionId() || undefined)
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

  if (loading) return <PageLoader />;
  if (!tournament) return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "Inter,sans-serif" }}>
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
  const canApply = ["announced","registration"].includes(t.status) && !!user && !applied;
  const isVoting = t.status === "voting";
  const isFinished = t.status === "finished";

  return (
    <div style={{ minHeight: "100vh", background: "#f8fafc", fontFamily: "Inter,sans-serif" }}>
      {/* Шапка */}
      <div style={{ background: "linear-gradient(135deg,#0f172a,#1e3a5f)", padding: "24px" }}>
        <div style={{ maxWidth: 960, margin: "0 auto" }}>
          <Link to="/championship" style={{ color: "rgba(255,255,255,0.5)", textDecoration: "none", fontSize: 13 }}>← Чемпионат</Link>
          <div style={{ display: "flex", alignItems: "flex-start", gap: 16, marginTop: 16, flexWrap: "wrap" }}>
            <div style={{ fontSize: 48 }}>{t.emoji}</div>
            <div style={{ flex: 1 }}>
              {t.season_name && <div style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", marginBottom: 4, fontWeight: 600, letterSpacing: 1 }}>{t.season_name.toUpperCase()}</div>}
              <h1 style={{ margin: "0 0 8px", fontSize: "clamp(20px,4vw,32px)", fontWeight: 900, color: "#fff" }}>{t.name}</h1>
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
                <span style={{ background: `${statusColor}25`, color: statusColor, borderRadius: 20, padding: "4px 14px", fontSize: 13, fontWeight: 700 }}>{statusLabel}</span>
                {t.applications_count > 0 && <span style={{ color: "rgba(255,255,255,0.5)", fontSize: 13 }}>{t.applications_count} участников</span>}
                {t.prize_energy > 0 && <span style={{ color: "#14B8A6", fontSize: 13, fontWeight: 700 }}>{t.prize_energy} ⚡ победителю</span>}
              </div>
            </div>
            {/* Кнопка участия */}
            {canApply && (
              <button onClick={handleApply} disabled={applying}
                style={{ padding: "14px 28px", borderRadius: 12, border: "none", background: "#14B8A6", color: "#fff", fontSize: 15, fontWeight: 800, cursor: applying ? "wait" : "pointer", opacity: applying ? 0.7 : 1, flexShrink: 0 }}>
                {applying ? "Подаём заявку…" : "Участвовать"}
              </button>
            )}
            {applied && (
              <div style={{ padding: "14px 20px", borderRadius: 12, background: "rgba(20,184,166,0.15)", border: "1.5px solid rgba(20,184,166,0.4)", color: "#14B8A6", fontSize: 14, fontWeight: 700 }}>
                ✓ Заявка подана
              </div>
            )}
            {!user && ["announced","registration"].includes(t.status) && (
              <Link to="/cabinet" style={{ padding: "14px 24px", borderRadius: 12, background: "#fff", color: "#0f172a", fontSize: 14, fontWeight: 700, textDecoration: "none" }}>
                Войти и участвовать
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Перенос */}
      {t.postponed && (
        <div style={{ background: "#fffbeb", borderBottom: "1px solid #fde68a", padding: "12px 24px", textAlign: "center" }}>
          <span style={{ fontSize: 14, color: "#92400e" }}>⏰ {t.postpone_reason}</span>
        </div>
      )}

      {/* Табы */}
      <div style={{ maxWidth: 960, margin: "0 auto", padding: "24px 24px 0" }}>
        <div style={{ display: "flex", gap: 4, background: "#f1f5f9", borderRadius: 12, padding: 4, width: "fit-content", marginBottom: 28 }}>
          {([
            { id: "info",  label: "О турнире" },
            ...(works.length > 0 || isVoting || isFinished ? [{ id: "works", label: `Работы ${works.length > 0 ? `(${works.length})` : ""}` }] : []),
          ] as {id:"info"|"works"; label:string}[]).map(tb => (
            <button key={tb.id} onClick={() => setTab(tb.id)}
              style={{ padding: "9px 18px", borderRadius: 9, border: "none", background: tab === tb.id ? "#fff" : "transparent", color: tab === tb.id ? "#0f172a" : "#64748b", fontSize: 14, fontWeight: 600, cursor: "pointer", boxShadow: tab === tb.id ? "0 1px 4px rgba(0,0,0,0.08)" : "none" }}>
              {tb.label}
            </button>
          ))}
        </div>

        {/* Вкладка: О турнире */}
        {tab === "info" && (
          <div style={{ display: "grid", gridTemplateColumns: "1fr minmax(260px,320px)", gap: 24, alignItems: "start" }}>
            <div>
              {t.description && (
                <Section title="Описание">
                  <p style={{ margin: 0, fontSize: 15, color: "#374151", lineHeight: 1.7 }}>{t.description}</p>
                </Section>
              )}
              {t.task_text && (
                <Section title="🎯 Задание">
                  <div style={{ background: "#eef2ff", borderRadius: 10, padding: "16px 20px", border: "1.5px solid #c7d2fe" }}>
                    <p style={{ margin: 0, fontSize: 15, color: "#3730a3", lineHeight: 1.7, whiteSpace: "pre-wrap" }}>{t.task_text}</p>
                  </div>
                </Section>
              )}
              {!t.task_text && ["announced","registration"].includes(t.status) && (
                <Section title="🎯 Задание">
                  <div style={{ background: "#f8fafc", borderRadius: 10, padding: "16px 20px", border: "1.5px dashed #cbd5e1", textAlign: "center" }}>
                    <div style={{ fontSize: 32, marginBottom: 8 }}>🔒</div>
                    <div style={{ fontSize: 14, color: "#64748b" }}>Задание откроется в момент старта турнира</div>
                  </div>
                </Section>
              )}
              {t.rules && (
                <Section title="Правила">
                  <p style={{ margin: 0, fontSize: 14, color: "#374151", lineHeight: 1.8, whiteSpace: "pre-wrap" }}>{t.rules}</p>
                </Section>
              )}
            </div>

            {/* Боковая панель */}
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {/* Сроки */}
              <div style={{ background: "#fff", borderRadius: 16, border: "1.5px solid #e2e8f0", padding: "20px" }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: "#0f172a", marginBottom: 14 }}>📅 Сроки</div>
                {[
                  { label: "Регистрация до", date: t.registration_ends },
                  { label: "Старт турнира",  date: t.task_opens_at },
                  { label: "Дедлайн работ",  date: t.work_deadline },
                  { label: "Голосование до", date: t.voting_ends },
                ].filter(r => r.date).map(r => (
                  <div key={r.label} style={{ display: "flex", justifyContent: "space-between", marginBottom: 8, fontSize: 13 }}>
                    <span style={{ color: "#64748b" }}>{r.label}</span>
                    <span style={{ fontWeight: 700, color: "#0f172a" }}>{new Date(r.date!).toLocaleDateString("ru", { day: "numeric", month: "short", year: "numeric" })}</span>
                  </div>
                ))}
                <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8, paddingTop: 8, borderTop: "1px solid #f1f5f9", fontSize: 13 }}>
                  <span style={{ color: "#64748b" }}>Мин. участников</span>
                  <span style={{ fontWeight: 700, color: "#0f172a" }}>{t.min_participants}</span>
                </div>
              </div>

              {/* Призы */}
              {(t.prize_energy > 0 || t.prizes?.length > 0) && (
                <div style={{ background: "#fff", borderRadius: 16, border: "1.5px solid #e2e8f0", padding: "20px" }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: "#0f172a", marginBottom: 14 }}>🏅 Призы</div>
                  {t.prize_energy > 0 && (
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8, fontSize: 13 }}>
                      <span>🥇 1 место</span>
                      <span style={{ fontWeight: 700, color: "#14B8A6" }}>{t.prize_energy} ⚡</span>
                    </div>
                  )}
                  {t.prize_2nd > 0 && (
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8, fontSize: 13 }}>
                      <span>🥈 2 место</span>
                      <span style={{ fontWeight: 700, color: "#14B8A6" }}>{t.prize_2nd} ⚡</span>
                    </div>
                  )}
                  {t.prize_3rd > 0 && (
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8, fontSize: 13 }}>
                      <span>🥉 3 место</span>
                      <span style={{ fontWeight: 700, color: "#14B8A6" }}>{t.prize_3rd} ⚡</span>
                    </div>
                  )}
                  {t.prizes?.map(p => (
                    <div key={p.id} style={{ marginTop: 12, paddingTop: 12, borderTop: "1px solid #f1f5f9" }}>
                      <div style={{ fontSize: 12, color: "#94a3b8", marginBottom: 4 }}>
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

        {/* Вкладка: Работы */}
        {tab === "works" && (
          <div>
            {!isFinished && isVoting && (
              <div style={{ background: "#fffbeb", border: "1px solid #fde68a", borderRadius: 12, padding: "14px 20px", marginBottom: 24, fontSize: 14, color: "#92400e" }}>
                💡 Названия салонов скрыты до окончания голосования. Поделитесь ссылкой с клиентами — голосуйте за лучших!
              </div>
            )}
            {works.length === 0 ? (
              <div style={{ textAlign: "center", padding: "60px 0" }}>
                <div style={{ fontSize: 40, marginBottom: 12 }}>🖼</div>
                <div style={{ fontSize: 16, fontWeight: 700, color: "#0f172a" }}>Работы пока не загружены</div>
                <div style={{ fontSize: 14, color: "#94a3b8", marginTop: 4 }}>Появятся после модерации</div>
              </div>
            ) : (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 20 }}>
                {works.map(w => (
                  <WorkCard key={w.id} work={w} isVoting={isVoting} isFinished={isFinished}
                    voted={votedIds.includes(w.id)} loading={voteLoading === w.id}
                    onVote={() => handleVote(w.id)} />
                ))}
              </div>
            )}
          </div>
        )}

        <div style={{ height: 64 }} />
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 24 }}>
      <h3 style={{ margin: "0 0 12px", fontSize: 16, fontWeight: 700, color: "#0f172a" }}>{title}</h3>
      {children}
    </div>
  );
}

function WorkCard({ work: w, isVoting, isFinished, voted, loading, onVote }:
  { work: Work; isVoting: boolean; isFinished: boolean; voted: boolean; loading: boolean; onVote: () => void }) {
  const photo = w.photos?.[0]?.url;
  return (
    <div style={{ background: "#fff", borderRadius: 16, border: "1.5px solid #e2e8f0", overflow: "hidden" }}>
      <div style={{ height: 200, background: photo ? `url(${photo}) center/cover` : "#f1f5f9", position: "relative" }}>
        {!photo && <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 40 }}>🖼</div>}
        {w.final_place && w.final_place <= 3 && (
          <div style={{ position: "absolute", top: 10, left: 10, background: "#fff", borderRadius: 20, padding: "4px 12px", fontSize: 13, fontWeight: 700 }}>
            {["🥇","🥈","🥉"][w.final_place - 1]} {w.final_place} место
          </div>
        )}
      </div>
      <div style={{ padding: "16px" }}>
        {w.title && <div style={{ fontSize: 15, fontWeight: 700, color: "#0f172a", marginBottom: 6 }}>{w.title}</div>}
        {w.description && <p style={{ margin: "0 0 10px", fontSize: 13, color: "#64748b", lineHeight: 1.6, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{w.description}</p>}

        {/* Салон (только после финала) */}
        {isFinished && w.salon_name && (
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10, paddingTop: 8, borderTop: "1px solid #f1f5f9" }}>
            {w.salon_logo && <img src={w.salon_logo} alt="" style={{ width: 28, height: 28, borderRadius: 6, objectFit: "cover" }} />}
            <div>
              <div style={{ fontSize: 13, fontWeight: 700, color: "#0f172a" }}>{w.salon_name}</div>
              {w.salon_city && <div style={{ fontSize: 11, color: "#94a3b8" }}>{w.salon_city}</div>}
            </div>
            {w.salon_url && (
              <a href={w.salon_url} target="_blank" rel="noreferrer"
                style={{ marginLeft: "auto", fontSize: 12, color: "#14B8A6", fontWeight: 600, textDecoration: "none" }}>сайт →</a>
            )}
          </div>
        )}

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 8 }}>
          <div style={{ fontSize: 13, color: "#64748b" }}>
            ❤️ <span style={{ fontWeight: 700, color: "#0f172a" }}>{w.votes_count.toLocaleString("ru")}</span> голосов
          </div>
          {isVoting && (
            <button onClick={onVote} disabled={voted || loading}
              style={{ padding: "8px 16px", borderRadius: 8, border: "none", background: voted ? "#f0fdf4" : "#14B8A6", color: voted ? "#059669" : "#fff", fontSize: 13, fontWeight: 700, cursor: voted || loading ? "default" : "pointer", opacity: loading ? 0.7 : 1 }}>
              {loading ? "…" : voted ? "✓ Голос отдан" : "Голосовать"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function PageLoader() {
  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#f8fafc" }}>
      <div style={{ width: 36, height: 36, border: "3px solid #e2e8f0", borderTopColor: "#14B8A6", borderRadius: "50%", animation: "spin 0.7s linear infinite" }} />
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );
}