import { useState, useEffect, useRef } from "react";
import { useLkAuth } from "@/contexts/LkAuthContext";
import Icon from "@/components/ui/icon";
import func2url from "../../../backend/func2url.json";

const API_URL  = (func2url as Record<string, string>)["championship-api"]  || "";
const VOTE_URL = (func2url as Record<string, string>)["championship-vote"] || "";
const SESSION  = () => localStorage.getItem("lk_session") || "";

async function apiGet(action: string, params: Record<string, string> = {}) {
  const qs = new URLSearchParams({ action, ...params }).toString();
  const res = await fetch(`${API_URL}?${qs}`, { headers: { "X-Session-Id": SESSION() } });
  return JSON.parse(await res.text());
}
async function apiPost(action: string, body: object) {
  const res = await fetch(`${API_URL}?action=${action}`, {
    method: "POST",
    headers: { "Content-Type": "application/json", "X-Session-Id": SESSION() },
    body: JSON.stringify(body),
  });
  return JSON.parse(await res.text());
}

const ACCENT = "hsl(185,85%,32%)";

// ── Интерфейсы ────────────────────────────────────────────────────────────────
interface Tournament {
  id: number; name: string; slug: string; emoji: string; status: string;
  description: string; task_text: string; prize_energy: number;
  prize_2nd: number; prize_3rd: number; min_participants: number;
  registration_starts: string; registration_ends: string;
  task_opens_at: string; work_deadline: string;
  voting_starts: string; voting_ends: string;
  applications_count: number; works_count: number;
  prizes: { place: number; title: string; value: string; partner_name: string }[];
}
interface MyTournament {
  id: number; name: string; slug: string; emoji: string; status: string;
  application_id: number; application_status: string;
  work_id: number | null; work_status: string | null;
  real_votes: number; final_place: number | null; total_score: number;
  task_opens_at: string; work_deadline: string; voting_ends: string;
}
interface SalonRating {
  total_points: number; participations: number; wins: number; top3_count: number; level: string;
}

const STATUS_LABELS: Record<string, string> = {
  draft: "Скоро", announced: "Анонс", registration: "Регистрация открыта",
  active: "Приём работ", voting: "Голосование", finished_pending: "Итоги",
  finished: "Завершён", cancelled: "Отменён",
};
const STATUS_COLORS: Record<string, string> = {
  announced: "#3b82f6", registration: "#10b981", active: "#6366f1",
  voting: "#f59e0b", finished_pending: "#f97316", finished: "#64748b", cancelled: "#ef4444",
};
const LEVEL_LABELS: Record<string, string> = {
  newcomer: "Новичок", participant: "Участник", professional: "Профессионал",
  expert: "Эксперт", premium: "Премиум", legend: "Легенда",
};
const LEVEL_COLORS: Record<string, string> = {
  newcomer: "#94a3b8", participant: "#3b82f6", professional: "#8b5cf6",
  expert: "#f59e0b", premium: "#ec4899", legend: "#f97316",
};
const WORK_STATUS: Record<string, { label: string; color: string }> = {
  draft:      { label: "Черновик",     color: "#94a3b8" },
  submitted:  { label: "На проверке",  color: "#f59e0b" },
  approved:   { label: "Одобрена ✓",   color: "#10b981" },
  rejected:   { label: "Отклонена",    color: "#ef4444" },
};

// ── Основной компонент ────────────────────────────────────────────────────────
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
        <div style={{ display: "flex", gap: 10, marginBottom: 24, flexWrap: "wrap" }}>
          <RatingBadge label="Очки" value={rating.total_points.toLocaleString("ru")} />
          <RatingBadge label="Уровень" value={LEVEL_LABELS[rating.level] || rating.level} color={LEVEL_COLORS[rating.level]} />
          <RatingBadge label="Участий" value={String(rating.participations)} />
          <RatingBadge label="Побед" value={String(rating.wins)} icon="🏆" />
          <RatingBadge label="Топ-3" value={String(rating.top3_count)} icon="🥉" />
        </div>
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
          onSaved={() => { setView("share"); load(); }}
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

// ── Значок рейтинга ───────────────────────────────────────────────────────────
function RatingBadge({ label, value, color, icon }: { label: string; value: string; color?: string; icon?: string }) {
  return (
    <div style={{ background: "#fff", border: "1.5px solid #e2e8f0", borderRadius: 12, padding: "10px 16px", textAlign: "center", minWidth: 80 }}>
      <div style={{ fontSize: 16, fontWeight: 900, color: color || "#0f172a" }}>{icon ? `${icon} ` : ""}{value}</div>
      <div style={{ fontSize: 11, color: "#94a3b8", marginTop: 2 }}>{label}</div>
    </div>
  );
}

// ── Список турниров ───────────────────────────────────────────────────────────
function TournamentsView({ tournaments, myTournaments, onApplied, onOpenWork, onShare }:
  { tournaments: Tournament[]; myTournaments: MyTournament[]; onApplied: () => void;
    onOpenWork: (t: Tournament, my: MyTournament) => void;
    onShare: (t: Tournament, my: MyTournament) => void }) {

  const [applying, setApplying] = useState<number | null>(null);
  const [msg, setMsg] = useState<Record<number, string>>({});

  const apply = async (t: Tournament) => {
    setApplying(t.id);
    const r = await apiPost("apply", { tournament_id: t.id, notify_email: "" });
    setApplying(null);
    if (r.ok || r.already_applied) {
      setMsg(p => ({ ...p, [t.id]: r.already_applied ? "Заявка уже подана" : "✓ Заявка подана! Ждите подтверждения." }));
      onApplied();
    } else {
      setMsg(p => ({ ...p, [t.id]: r.error || "Ошибка" }));
    }
  };

  const myIds = new Set(myTournaments.map(m => m.id));

  if (tournaments.length === 0) {
    return (
      <div style={{ textAlign: "center", padding: "48px 0" }}>
        <div style={{ fontSize: 40, marginBottom: 10 }}>📅</div>
        <div style={{ fontSize: 16, fontWeight: 700, color: "#0f172a" }}>Нет активных турниров</div>
        <div style={{ fontSize: 13, color: "#94a3b8", marginTop: 4 }}>Следите за анонсами — мы сообщим о новых соревнованиях</div>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      {tournaments.map(t => {
        const isRegistration = t.status === "registration";
        const isActive = t.status === "active";
        const isVoting = t.status === "voting";
        const isMy = myIds.has(t.id);
        const my = myTournaments.find(m => m.id === t.id);
        const statusColor = STATUS_COLORS[t.status] || "#64748b";

        return (
          <div key={t.id} style={{ background: "#fff", borderRadius: 16, border: "1.5px solid #e2e8f0", overflow: "hidden" }}>
            {/* Заголовок */}
            <div style={{ padding: "18px 20px 14px" }}>
              <div style={{ display: "flex", alignItems: "flex-start", gap: 12, marginBottom: 10 }}>
                <span style={{ fontSize: 30, flexShrink: 0 }}>{t.emoji}</span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", marginBottom: 4 }}>
                    <span style={{ fontSize: 15, fontWeight: 800, color: "#0f172a" }}>{t.name}</span>
                    <span style={{ background: `${statusColor}18`, color: statusColor, borderRadius: 20, padding: "2px 10px", fontSize: 11, fontWeight: 700 }}>
                      {STATUS_LABELS[t.status]}
                    </span>
                    {isMy && <span style={{ background: "#f0fdf4", color: "#059669", borderRadius: 20, padding: "2px 10px", fontSize: 11, fontWeight: 700 }}>✓ Участвую</span>}
                  </div>
                  <p style={{ margin: 0, fontSize: 13, color: "#64748b", lineHeight: 1.6 }}>{t.description}</p>
                </div>
              </div>

              {/* Ключевые факты */}
              <div style={{ display: "flex", gap: 16, flexWrap: "wrap", marginBottom: 14 }}>
                {t.prize_energy > 0 && <Fact icon="⚡" text={`${t.prize_energy} энергии победителю`} accent />}
                {t.applications_count > 0 && <Fact icon="👥" text={`${t.applications_count} участников`} />}
                {t.works_count > 0 && <Fact icon="🖼" text={`${t.works_count} работ`} />}
                {t.registration_ends && isRegistration && (
                  <Fact icon="📅" text={`Регистрация до ${new Date(t.registration_ends).toLocaleDateString("ru", { day: "numeric", month: "long" })}`} />
                )}
                {t.work_deadline && isActive && (
                  <Fact icon="⏰" text={`Дедлайн ${new Date(t.work_deadline).toLocaleDateString("ru", { day: "numeric", month: "long" })}`} warn />
                )}
                {t.voting_ends && isVoting && (
                  <Fact icon="🗳" text={`Голосование до ${new Date(t.voting_ends).toLocaleDateString("ru", { day: "numeric", month: "long" })}`} />
                )}
              </div>

              {/* Задание */}
              {t.task_text && (
                <div style={{ background: "#eef2ff", borderRadius: 10, padding: "12px 14px", marginBottom: 14, border: "1px solid #c7d2fe" }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: "#6366f1", marginBottom: 4 }}>🎯 ЗАДАНИЕ ТУРНИРА</div>
                  <div style={{ fontSize: 13, color: "#3730a3", lineHeight: 1.6 }}>{t.task_text}</div>
                </div>
              )}

              {msg[t.id] && (
                <div style={{ fontSize: 13, color: msg[t.id].startsWith("✓") ? "#059669" : "#ef4444", marginBottom: 10 }}>
                  {msg[t.id]}
                </div>
              )}

              {/* Действия */}
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {/* Ещё не участвую, регистрация открыта */}
                {!isMy && isRegistration && (
                  <ActionBtn onClick={() => apply(t)} loading={applying === t.id} icon="UserPlus">
                    Подать заявку
                  </ActionBtn>
                )}
                {/* Участвую, турнир активен — загрузить работу */}
                {isMy && isActive && my && (
                  <ActionBtn onClick={() => onOpenWork(t, my)} icon="Upload" color="#6366f1">
                    {my.work_id ? "Редактировать работу" : "Загрузить работу"}
                  </ActionBtn>
                )}
                {/* Участвую, голосование — поделиться */}
                {isMy && isVoting && my && (
                  <ActionBtn onClick={() => onShare(t, my)} icon="Share2" color="#f59e0b">
                    Собрать голоса
                  </ActionBtn>
                )}
                {/* Статус работы */}
                {isMy && my?.work_status && (
                  <div style={{
                    padding: "9px 14px", borderRadius: 9, background: `${WORK_STATUS[my.work_status]?.color || "#94a3b8"}15`,
                    color: WORK_STATUS[my.work_status]?.color || "#64748b", fontSize: 13, fontWeight: 700,
                  }}>
                    Работа: {WORK_STATUS[my.work_status]?.label || my.work_status}
                  </div>
                )}
                {isMy && my?.real_votes > 0 && (
                  <div style={{ padding: "9px 14px", borderRadius: 9, background: "#fff7ed", color: "#c2410c", fontSize: 13, fontWeight: 700 }}>
                    ❤️ {my.real_votes} голосов
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ── Мои заявки ────────────────────────────────────────────────────────────────
function MyTournamentsView({ myTournaments, tournaments, onOpenWork, onShare }:
  { myTournaments: MyTournament[]; tournaments: Tournament[];
    onOpenWork: (t: Tournament, my: MyTournament) => void;
    onShare: (t: Tournament, my: MyTournament) => void }) {

  if (myTournaments.length === 0) {
    return (
      <div style={{ textAlign: "center", padding: "48px 0" }}>
        <div style={{ fontSize: 40, marginBottom: 10 }}>📋</div>
        <div style={{ fontSize: 16, fontWeight: 700, color: "#0f172a" }}>Нет заявок</div>
        <div style={{ fontSize: 13, color: "#94a3b8", marginTop: 4 }}>Подайте заявку на турнир во вкладке «Турниры»</div>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      {myTournaments.map(my => {
        const t = tournaments.find(t => t.id === my.id);
        const statusColor = STATUS_COLORS[my.status] || "#64748b";
        const isActive = my.status === "active";
        const isVoting = my.status === "voting";

        return (
          <div key={my.id} style={{ background: "#fff", borderRadius: 14, border: "1.5px solid #e2e8f0", padding: "16px 18px" }}>
            <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
              <span style={{ fontSize: 24, flexShrink: 0 }}>{my.emoji}</span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center", marginBottom: 6 }}>
                  <span style={{ fontSize: 14, fontWeight: 700, color: "#0f172a" }}>{my.name}</span>
                  <span style={{ background: `${statusColor}18`, color: statusColor, borderRadius: 20, padding: "2px 9px", fontSize: 11, fontWeight: 700 }}>
                    {STATUS_LABELS[my.status]}
                  </span>
                </div>

                {/* Прогресс-шаги */}
                <ProgressSteps my={my} />

                {/* Дедлайны */}
                <div style={{ display: "flex", gap: 14, flexWrap: "wrap", marginTop: 10 }}>
                  {my.work_deadline && isActive && (
                    <Fact icon="⏰" text={`Дедлайн: ${new Date(my.work_deadline).toLocaleDateString("ru", { day: "numeric", month: "long" })}`} warn />
                  )}
                  {my.voting_ends && isVoting && (
                    <Fact icon="🗳" text={`Голосование до: ${new Date(my.voting_ends).toLocaleDateString("ru", { day: "numeric", month: "long" })}`} />
                  )}
                  {my.real_votes > 0 && (
                    <Fact icon="❤️" text={`${my.real_votes} голосов за вашу работу`} accent />
                  )}
                  {my.final_place && (
                    <Fact icon={["🥇","🥈","🥉"][my.final_place - 1] || "🎖"} text={`${my.final_place} место`} accent />
                  )}
                </div>

                {/* Действия */}
                <div style={{ display: "flex", gap: 8, marginTop: 12, flexWrap: "wrap" }}>
                  {isActive && t && (
                    <ActionBtn onClick={() => onOpenWork(t, my)} icon="Upload" color="#6366f1">
                      {my.work_id ? "Редактировать работу" : "Загрузить работу"}
                    </ActionBtn>
                  )}
                  {isVoting && t && (
                    <ActionBtn onClick={() => onShare(t, my)} icon="Share2" color="#f59e0b">
                      Поделиться для голосования
                    </ActionBtn>
                  )}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ── Шаги прогресса ────────────────────────────────────────────────────────────
function ProgressSteps({ my }: { my: MyTournament }) {
  const steps = [
    { label: "Заявка",  done: !!my.application_id, active: my.application_status === "pending" },
    { label: "Работа",  done: my.work_status === "approved", active: my.status === "active" && !my.work_id },
    { label: "Голоса",  done: my.real_votes > 0, active: my.status === "voting" },
    { label: "Итоги",   done: !!my.final_place, active: my.status === "finished_pending" },
  ];

  return (
    <div style={{ display: "flex", gap: 0, alignItems: "center" }}>
      {steps.map((s, i) => (
        <div key={s.label} style={{ display: "flex", alignItems: "center" }}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 3 }}>
            <div style={{
              width: 22, height: 22, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center",
              background: s.done ? ACCENT : s.active ? "#6366f1" : "#e2e8f0",
              fontSize: 11, fontWeight: 900,
              color: s.done || s.active ? "#fff" : "#94a3b8",
              boxShadow: s.active ? "0 0 0 3px #6366f120" : "none",
            }}>
              {s.done ? "✓" : i + 1}
            </div>
            <div style={{ fontSize: 10, color: s.done ? ACCENT : s.active ? "#6366f1" : "#94a3b8", fontWeight: 600, whiteSpace: "nowrap" }}>
              {s.label}
            </div>
          </div>
          {i < steps.length - 1 && (
            <div style={{ width: 24, height: 2, background: s.done ? ACCENT : "#e2e8f0", margin: "0 2px", marginBottom: 14, flexShrink: 0 }} />
          )}
        </div>
      ))}
    </div>
  );
}

// ── Загрузка работы ───────────────────────────────────────────────────────────
function SubmitWorkView({ tournament: t, my, onBack, onSaved }:
  { tournament: Tournament; my: MyTournament; onBack: () => void; onSaved: () => void }) {

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [story, setStory] = useState("");
  const [servicesDone, setServicesDone] = useState("");
  const [masterName, setMasterName] = useState("");
  const [toolsUsed, setToolsUsed] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [photos, setPhotos] = useState<{ url: string; caption: string }[]>([{ url: "", caption: "" }]);
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState("");

  const addPhoto = () => setPhotos(p => [...p, { url: "", caption: "" }]);
  const removePhoto = (i: number) => setPhotos(p => p.filter((_, j) => j !== i));
  const updatePhoto = (i: number, field: "url" | "caption", val: string) =>
    setPhotos(p => p.map((ph, j) => j === i ? { ...ph, [field]: val } : ph));

  const save = async () => {
    const validPhotos = photos.filter(p => p.url.trim());
    if (!title.trim()) { setErr("Укажите название работы"); return; }
    if (validPhotos.length === 0) { setErr("Добавьте хотя бы одну ссылку на фото"); return; }
    setSaving(true); setErr("");
    const r = await apiPost("submit_work", {
      tournament_id: t.id, title, description, story,
      services_done: servicesDone, master_name: masterName,
      tools_used: toolsUsed, video_url: videoUrl, photos: validPhotos,
    });
    setSaving(false);
    if (r.ok) onSaved();
    else setErr(r.error || "Ошибка при сохранении");
  };

  return (
    <div>
      <button onClick={onBack} style={{ background: "none", border: "none", color: "#64748b", cursor: "pointer", fontSize: 14, marginBottom: 16, padding: 0, display: "flex", alignItems: "center", gap: 4 }}>
        <Icon name="ArrowLeft" size={14} /> Назад
      </button>

      <div style={{ background: "#eef2ff", borderRadius: 12, padding: "14px 16px", marginBottom: 20, border: "1px solid #c7d2fe" }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: "#6366f1", marginBottom: 4 }}>🎯 ЗАДАНИЕ: {t.name}</div>
        <div style={{ fontSize: 13, color: "#3730a3" }}>{t.task_text}</div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        <Block title="Основное">
          <F label="Название работы *" value={title} onChange={setTitle} placeholder="Летнее преображение клиентки" />
          <F label="Краткое описание (виден в галерее)" value={description} onChange={setDescription} placeholder="Что сделали, какой результат..." textarea />
        </Block>

        <Block title="Детали">
          <F label="Имя мастера" value={masterName} onChange={setMasterName} placeholder="Имя Фамилия" />
          <F label="Какие услуги выполнены" value={servicesDone} onChange={setServicesDone} placeholder="Антицеллюлитный массаж, обёртывание..." textarea />
          <F label="Инструменты и техники" value={toolsUsed} onChange={setToolsUsed} placeholder="Миофасциальный релиз, вакуумные банки..." />
          <F label="История клиента / результат (необязательно)" value={story} onChange={setStory} placeholder="Клиентка обратилась с жалобой на... За 3 сеанса удалось..." textarea />
        </Block>

        <Block title="Фотографии">
          <div style={{ fontSize: 12, color: "#64748b", marginBottom: 10, lineHeight: 1.5 }}>
            Загрузите фото на любой хостинг (Google Фото, Яндекс Диск, Dropbox) и вставьте прямую ссылку.<br />
            <b>Важно:</b> ссылка должна заканчиваться на .jpg, .png или быть прямой ссылкой на просмотр.
          </div>
          {photos.map((ph, i) => (
            <div key={i} style={{ display: "flex", gap: 8, alignItems: "flex-start", marginBottom: 8 }}>
              <div style={{ flex: 1 }}>
                <F label={`Ссылка на фото ${i + 1}`} value={ph.url} onChange={v => updatePhoto(i, "url", v)} placeholder="https://..." />
                <F label="Подпись (необязательно)" value={ph.caption} onChange={v => updatePhoto(i, "caption", v)} placeholder="До процедуры / После / Процесс..." />
                {ph.url && ph.url.startsWith("http") && (
                  <img src={ph.url} alt="" onError={e => (e.currentTarget.style.display = "none")}
                    style={{ width: "100%", maxHeight: 160, objectFit: "cover", borderRadius: 8, marginTop: 4 }} />
                )}
              </div>
              {photos.length > 1 && (
                <button onClick={() => removePhoto(i)} style={{ marginTop: 20, padding: "7px 10px", borderRadius: 8, border: "1.5px solid #fecaca", background: "#fff", color: "#ef4444", cursor: "pointer", fontSize: 14, flexShrink: 0 }}>
                  ✕
                </button>
              )}
            </div>
          ))}
          {photos.length < 5 && (
            <button onClick={addPhoto} style={{ padding: "8px 14px", borderRadius: 9, border: "1.5px dashed #cbd5e1", background: "#f8fafc", color: "#64748b", cursor: "pointer", fontSize: 13, fontWeight: 600 }}>
              + Добавить фото
            </button>
          )}
        </Block>

        <Block title="Видео (необязательно)">
          <div style={{ fontSize: 12, color: "#64748b", marginBottom: 8 }}>
            Ссылка на видео (ВКонтакте, RuTube, Google Drive). YouTube пока не поддерживается.
          </div>
          <F label="Ссылка на видео" value={videoUrl} onChange={setVideoUrl} placeholder="https://vk.com/video..." />
        </Block>
      </div>

      {err && <div style={{ color: "#ef4444", fontSize: 13, marginTop: 12 }}>{err}</div>}

      <div style={{ marginTop: 20, display: "flex", gap: 10 }}>
        <button onClick={save} disabled={saving} style={{
          padding: "13px 28px", borderRadius: 10, border: "none",
          background: saving ? "#e2e8f0" : ACCENT, color: saving ? "#94a3b8" : "#fff",
          fontSize: 15, fontWeight: 700, cursor: saving ? "default" : "pointer",
        }}>
          {saving ? "Сохраняю…" : "Отправить работу на проверку"}
        </button>
        <button onClick={onBack} style={{ padding: "13px 20px", borderRadius: 10, border: "1.5px solid #e2e8f0", background: "#fff", color: "#64748b", fontSize: 14, cursor: "pointer" }}>
          Отмена
        </button>
      </div>
    </div>
  );
}

// ── Поделиться для голосования ────────────────────────────────────────────────
function ShareView({ tournament: t, my, onBack }:
  { tournament: Tournament; my: MyTournament; onBack: () => void }) {

  const publicUrl = `${window.location.origin}/championship/tournament/${t.slug}`;
  const [copied, setCopied] = useState(false);
  const copyText = useRef<HTMLTextAreaElement>(null);

  const copy = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const shareText = `🏆 Я участвую в чемпионате красоты "${t.name}"!\n\nПроголосуйте за мою работу — мне важна ваша поддержка!\n\n👉 ${publicUrl}\n\n#чемпионатКрасоты #красота #салон`;

  return (
    <div>
      <button onClick={onBack} style={{ background: "none", border: "none", color: "#64748b", cursor: "pointer", fontSize: 14, marginBottom: 16, padding: 0, display: "flex", alignItems: "center", gap: 4 }}>
        <Icon name="ArrowLeft" size={14} /> Назад
      </button>

      <div style={{ background: "linear-gradient(135deg, #6366f1, #8b5cf6)", borderRadius: 16, padding: "24px", color: "#fff", marginBottom: 24, textAlign: "center" }}>
        <div style={{ fontSize: 36, marginBottom: 8 }}>❤️</div>
        <h2 style={{ margin: "0 0 8px", fontSize: 20, fontWeight: 800 }}>Соберите голоса!</h2>
        <p style={{ margin: 0, fontSize: 14, opacity: 0.85 }}>
          Поделитесь ссылкой с клиентами, друзьями и в соцсетях.<br />
          Каждый голос — это ваш рейтинг в чемпионате.
        </p>
        {my.real_votes > 0 && (
          <div style={{ marginTop: 14, fontSize: 22, fontWeight: 900 }}>❤️ {my.real_votes} голосов уже собрано!</div>
        )}
      </div>

      {/* Ссылка */}
      <div style={{ background: "#fff", border: "1.5px solid #e2e8f0", borderRadius: 12, padding: "16px", marginBottom: 16 }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: "#94a3b8", marginBottom: 8 }}>ССЫЛКА НА СТРАНИЦУ ГОЛОСОВАНИЯ</div>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <div style={{ flex: 1, fontSize: 13, color: "#0f172a", background: "#f8fafc", borderRadius: 8, padding: "10px 12px", wordBreak: "break-all" }}>
            {publicUrl}
          </div>
          <button onClick={() => copy(publicUrl)} style={{
            padding: "10px 14px", borderRadius: 8, border: "none",
            background: copied ? "#f0fdf4" : ACCENT,
            color: copied ? "#059669" : "#fff", fontSize: 13, fontWeight: 700, cursor: "pointer", flexShrink: 0,
          }}>
            {copied ? "✓" : <Icon name="Copy" size={16} />}
          </button>
        </div>
      </div>

      {/* Готовый текст для публикации */}
      <div style={{ background: "#fff", border: "1.5px solid #e2e8f0", borderRadius: 12, padding: "16px", marginBottom: 16 }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: "#94a3b8", marginBottom: 8 }}>ГОТОВЫЙ ТЕКСТ ДЛЯ СОЦСЕТЕЙ</div>
        <textarea
          ref={copyText}
          readOnly
          value={shareText}
          rows={6}
          style={{ width: "100%", border: "none", background: "#f8fafc", borderRadius: 8, padding: "10px 12px", fontSize: 13, color: "#374151", lineHeight: 1.6, resize: "none", outline: "none", boxSizing: "border-box" }}
        />
        <button onClick={() => copy(shareText)} style={{
          marginTop: 8, padding: "9px 16px", borderRadius: 8, border: "none",
          background: ACCENT, color: "#fff", fontSize: 13, fontWeight: 700, cursor: "pointer",
        }}>
          Скопировать текст
        </button>
      </div>

      {/* Советы */}
      <div style={{ background: "#fffbeb", borderRadius: 12, padding: "16px", border: "1px solid #fde68a" }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: "#92400e", marginBottom: 10 }}>💡 КАК ПОЛУЧИТЬ БОЛЬШЕ ГОЛОСОВ</div>
        {[
          "Разошлите ссылку в WhatsApp и Telegram клиентам",
          "Опубликуйте в своих соцсетях (ВКонтакте, Instagram*)",
          "Попросите коллег и друзей проголосовать",
          "Прикрепите ссылку в статусе или bio профиля",
          "Напомните клиентам во время следующего визита",
        ].map((tip, i) => (
          <div key={i} style={{ display: "flex", gap: 8, marginBottom: 6, fontSize: 13, color: "#78350f" }}>
            <span style={{ flexShrink: 0 }}>✓</span>
            <span>{tip}</span>
          </div>
        ))}
        <div style={{ fontSize: 11, color: "#b45309", marginTop: 8 }}>* Организация признана нежелательной в РФ</div>
      </div>
    </div>
  );
}

// ── Мелкие вспомогалки ────────────────────────────────────────────────────────
function Fact({ icon, text, accent, warn }: { icon: string; text: string; accent?: boolean; warn?: boolean }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 12, color: warn ? "#f59e0b" : accent ? ACCENT : "#64748b", fontWeight: warn || accent ? 600 : 400 }}>
      <span>{icon}</span> {text}
    </div>
  );
}

function Block({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ background: "#fff", borderRadius: 14, border: "1.5px solid #e2e8f0", padding: "16px 18px" }}>
      <div style={{ fontSize: 12, fontWeight: 700, color: "#94a3b8", letterSpacing: 1, marginBottom: 12 }}>{title.toUpperCase()}</div>
      {children}
    </div>
  );
}

function F({ label, value, onChange, placeholder = "", textarea = false }:
  { label: string; value: string; onChange: (v: string) => void; placeholder?: string; textarea?: boolean }) {
  const style: React.CSSProperties = {
    width: "100%", padding: "8px 10px", borderRadius: 8, border: "1px solid #e2e8f0",
    fontSize: 13, fontFamily: "Inter, sans-serif", outline: "none",
    resize: textarea ? "vertical" : undefined, minHeight: textarea ? 72 : undefined,
    boxSizing: "border-box",
  };
  return (
    <div style={{ marginBottom: 10 }}>
      <div style={{ fontSize: 11, fontWeight: 600, color: "#94a3b8", marginBottom: 3 }}>{label}</div>
      {textarea
        ? <textarea value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} style={style} rows={3} />
        : <input value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} style={style} />
      }
    </div>
  );
}

function ActionBtn({ children, onClick, loading, icon, color = ACCENT }:
  { children: React.ReactNode; onClick: () => void; loading?: boolean; icon: string; color?: string }) {
  return (
    <button onClick={onClick} disabled={loading} style={{
      display: "flex", alignItems: "center", gap: 6,
      padding: "9px 16px", borderRadius: 9, border: "none",
      background: loading ? "#e2e8f0" : color,
      color: loading ? "#94a3b8" : "#fff",
      fontSize: 13, fontWeight: 700, cursor: loading ? "default" : "pointer",
    }}>
      <Icon name={icon} size={14} />
      {loading ? "…" : children}
    </button>
  );
}