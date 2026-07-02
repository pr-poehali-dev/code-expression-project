import { useState, useEffect } from "react";
import Icon from "@/components/ui/icon";
import { ACCENT } from "./LkAdminShared";
import func2url from "../../../backend/func2url.json";

const ADMIN_URL = (func2url as Record<string, string>)["championship-admin"] || "";
const SESSION = () => localStorage.getItem("lk_session") || "";

async function adminGet(action: string, params: Record<string, string> = {}) {
  const qs = new URLSearchParams({ action, ...params }).toString();
  const res = await fetch(`${ADMIN_URL}?${qs}`, { headers: { "X-Session-Id": SESSION() } });
  return JSON.parse(await res.text());
}

async function adminPost(action: string, body: object) {
  const res = await fetch(`${ADMIN_URL}?action=${action}`, {
    method: "POST",
    headers: { "Content-Type": "application/json", "X-Session-Id": SESSION() },
    body: JSON.stringify(body),
  });
  return JSON.parse(await res.text());
}

// ── Вспомогательные UI ────────────────────────────────────────────────────────

function Btn({ children, onClick, color = ACCENT, small = false, disabled = false }:
  { children: React.ReactNode; onClick?: () => void; color?: string; small?: boolean; disabled?: boolean }) {
  return (
    <button onClick={onClick} disabled={disabled} style={{
      padding: small ? "5px 12px" : "9px 16px", borderRadius: 9, border: "none",
      background: disabled ? "#e2e8f0" : color, color: disabled ? "#94a3b8" : "#fff",
      fontSize: small ? 12 : 13, fontWeight: 700, cursor: disabled ? "default" : "pointer",
      fontFamily: "Montserrat, sans-serif",
    }}>
      {children}
    </button>
  );
}

function Field({ label, value, onChange, type = "text", placeholder = "", textarea = false }:
  { label: string; value: string; onChange: (v: string) => void; type?: string; placeholder?: string; textarea?: boolean }) {
  const style: React.CSSProperties = {
    width: "100%", padding: "8px 10px", borderRadius: 8, border: "1px solid #e2e8f0",
    fontSize: 13, fontFamily: "Montserrat, sans-serif", outline: "none",
    resize: textarea ? "vertical" : undefined,
    minHeight: textarea ? 80 : undefined,
  };
  return (
    <div style={{ marginBottom: 10 }}>
      <div style={{ fontSize: 11, fontWeight: 700, color: "#94a3b8", marginBottom: 4 }}>{label.toUpperCase()}</div>
      {textarea
        ? <textarea value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} style={style} rows={3} />
        : <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} style={style} />
      }
    </div>
  );
}

function Card({ children, style = {} }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <div style={{ background: "#fff", borderRadius: 14, border: "1px solid #e8ecf0", padding: 18, marginBottom: 16, ...style }}>
      {children}
    </div>
  );
}

const STATUS_LABELS: Record<string, string> = {
  draft: "Черновик", announced: "Анонс", registration: "Регистрация",
  active: "Приём работ", voting: "Голосование",
  finished_pending: "Итоги", finished: "Завершён", cancelled: "Отменён",
};
const STATUS_COLORS: Record<string, string> = {
  draft: "#94a3b8", announced: "#3b82f6", registration: "#10b981",
  active: "#6366f1", voting: "#f59e0b", finished_pending: "#f97316",
  finished: "#64748b", cancelled: "#ef4444",
};

// ── Раздел: Турниры ───────────────────────────────────────────────────────────

interface Tournament {
  id: number; name: string; slug: string; emoji: string; status: string;
  prize_energy: number; prize_2nd: number; prize_3rd: number;
  min_participants: number; applications_count: number; works_count: number;
  description: string; rules: string; task_text: string;
  registration_starts: string; registration_ends: string;
  task_opens_at: string; work_deadline: string;
  voting_starts: string; voting_ends: string; next_date: string;
  postponed: boolean; postpone_reason: string; season_name: string;
}

const EMPTY_TOURNAMENT = {
  name: "", slug: "", emoji: "🏆", status: "draft", description: "", rules: "", task_text: "",
  prize_energy: 0, prize_2nd: 0, prize_3rd: 0, min_participants: 5,
  registration_starts: "", registration_ends: "", task_opens_at: "",
  work_deadline: "", voting_starts: "", voting_ends: "", next_date: "",
  season_id: "",
};

export function TournamentsSection() {
  const [list, setList] = useState<Tournament[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<number | null>(null); // id или -1 для нового
  const [form, setForm] = useState<typeof EMPTY_TOURNAMENT>({ ...EMPTY_TOURNAMENT });
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");

  const load = () => {
    setLoading(true);
    adminGet("tournaments").then(d => setList(d.tournaments || [])).finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const f = (key: keyof typeof EMPTY_TOURNAMENT) => (v: string) => setForm(p => ({ ...p, [key]: v }));

  const startEdit = (t: Tournament) => {
    setForm({
      name: t.name, slug: t.slug, emoji: t.emoji || "🏆", status: t.status,
      description: t.description || "", rules: t.rules || "", task_text: t.task_text || "",
      prize_energy: t.prize_energy, prize_2nd: t.prize_2nd, prize_3rd: t.prize_3rd,
      min_participants: t.min_participants,
      registration_starts: t.registration_starts?.slice(0, 16) || "",
      registration_ends: t.registration_ends?.slice(0, 16) || "",
      task_opens_at: t.task_opens_at?.slice(0, 16) || "",
      work_deadline: t.work_deadline?.slice(0, 16) || "",
      voting_starts: t.voting_starts?.slice(0, 16) || "",
      voting_ends: t.voting_ends?.slice(0, 16) || "",
      next_date: t.next_date?.slice(0, 16) || "",
      season_id: "",
    });
    setEditing(t.id);
  };

  const save = async () => {
    setSaving(true); setMsg("");
    const body = {
      ...form,
      prize_energy: Number(form.prize_energy),
      prize_2nd: Number(form.prize_2nd),
      prize_3rd: Number(form.prize_3rd),
      min_participants: Number(form.min_participants),
      ...(editing !== -1 ? { id: editing } : {}),
    };
    const r = editing === -1
      ? await adminPost("create_tournament", body)
      : await adminPost("update_tournament", body);
    setSaving(false);
    if (r.ok) { setMsg("✓ Сохранено"); load(); setEditing(null); }
    else setMsg("Ошибка: " + (r.error || "неизвестно"));
  };

  const archive = async (id: number) => {
    if (!confirm("Архивировать турнир?")) return;
    await adminPost("archive_tournament", { id });
    load();
  };

  if (loading) return <div style={{ color: "#94a3b8", padding: 20 }}>Загрузка…</div>;

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <div style={{ fontSize: 15, fontWeight: 700, color: "#0f172a" }}>Турниры ({list.length})</div>
        <Btn onClick={() => { setForm({ ...EMPTY_TOURNAMENT }); setEditing(-1); }}>+ Создать турнир</Btn>
      </div>

      {/* Форма создания/редактирования */}
      {editing !== null && (
        <Card style={{ border: `2px solid ${ACCENT}` }}>
          <div style={{ fontWeight: 700, color: ACCENT, marginBottom: 14, fontSize: 14 }}>
            {editing === -1 ? "Новый турнир" : "Редактировать турнир"}
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 16px" }}>
            <Field label="Название" value={form.name} onChange={f("name")} placeholder="Лучшее преображение" />
            <Field label="Slug (URL)" value={form.slug} onChange={f("slug")} placeholder="luchshee-preobrazhenie" />
            <Field label="Эмодзи" value={form.emoji} onChange={f("emoji")} placeholder="🏆" />
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, color: "#94a3b8", marginBottom: 4 }}>СТАТУС</div>
              <select value={form.status} onChange={e => f("status")(e.target.value)}
                style={{ width: "100%", padding: "8px 10px", borderRadius: 8, border: "1px solid #e2e8f0", fontSize: 13 }}>
                {Object.entries(STATUS_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
              </select>
            </div>
          </div>
          <Field label="Описание" value={form.description} onChange={f("description")} textarea />
          <Field label="Правила" value={form.rules} onChange={f("rules")} textarea />
          <Field label="Задание (скрыто до старта)" value={form.task_text} onChange={f("task_text")} textarea />
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "0 12px" }}>
            <Field label="Приз 1 место (⚡)" value={String(form.prize_energy)} onChange={f("prize_energy")} type="number" />
            <Field label="Приз 2 место (⚡)" value={String(form.prize_2nd)} onChange={f("prize_2nd")} type="number" />
            <Field label="Приз 3 место (⚡)" value={String(form.prize_3rd)} onChange={f("prize_3rd")} type="number" />
          </div>
          <Field label="Минимум участников" value={String(form.min_participants)} onChange={f("min_participants")} type="number" />
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 12px" }}>
            <Field label="Регистрация с" value={form.registration_starts} onChange={f("registration_starts")} type="datetime-local" />
            <Field label="Регистрация до" value={form.registration_ends} onChange={f("registration_ends")} type="datetime-local" />
            <Field label="Старт (открытие задания)" value={form.task_opens_at} onChange={f("task_opens_at")} type="datetime-local" />
            <Field label="Дедлайн работ" value={form.work_deadline} onChange={f("work_deadline")} type="datetime-local" />
            <Field label="Начало голосования" value={form.voting_starts} onChange={f("voting_starts")} type="datetime-local" />
            <Field label="Конец голосования" value={form.voting_ends} onChange={f("voting_ends")} type="datetime-local" />
            <Field label="Дата переноса (если мало участников)" value={form.next_date} onChange={f("next_date")} type="datetime-local" />
          </div>
          {msg && <div style={{ fontSize: 13, color: msg.startsWith("✓") ? "#059669" : "#ef4444", marginBottom: 10 }}>{msg}</div>}
          <div style={{ display: "flex", gap: 8 }}>
            <Btn onClick={save} disabled={saving}>{saving ? "Сохраняю…" : "Сохранить"}</Btn>
            <Btn onClick={() => setEditing(null)} color="#94a3b8">Отмена</Btn>
          </div>
        </Card>
      )}

      {/* Список турниров */}
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {list.map(t => (
          <Card key={t.id} style={{ marginBottom: 0 }}>
            <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
              <div style={{ fontSize: 28, flexShrink: 0 }}>{t.emoji}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", marginBottom: 4 }}>
                  <span style={{ fontSize: 15, fontWeight: 700, color: "#0f172a" }}>{t.name}</span>
                  <span style={{ background: `${STATUS_COLORS[t.status]}18`, color: STATUS_COLORS[t.status], borderRadius: 20, padding: "2px 10px", fontSize: 11, fontWeight: 700 }}>
                    {STATUS_LABELS[t.status]}
                  </span>
                  {t.postponed && <span style={{ background: "#fef3c7", color: "#d97706", borderRadius: 20, padding: "2px 10px", fontSize: 11, fontWeight: 700 }}>Перенесён</span>}
                </div>
                <div style={{ fontSize: 12, color: "#94a3b8" }}>
                  {t.applications_count} заявок · {t.works_count} работ · {t.prize_energy}⚡ победителю
                </div>
              </div>
              <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
                <Btn small onClick={() => setActiveWorksTournament(t.id)}>Работы</Btn>
                <Btn small onClick={() => startEdit(t)}>✏️</Btn>
                <Btn small onClick={() => archive(t.id)} color="#94a3b8">🗑</Btn>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

// ── Раздел: Модерация работ ────────────────────────────────────────────────────

 
let setActiveWorksTournament: (id: number) => void = () => {};

interface Work {
  id: number; title: string; status: string; salon_name: string; city: string;
  votes_count: number; moderation_note: string; photos: {url:string}[];
  description: string; story: string; services_done: string; master_name: string;
}

export function ModerationSection() {
  const [tournamentId, setTournamentId] = useState("");
  const [works, setWorks] = useState<Work[]>([]);
  const [loading, setLoading] = useState(false);
  const [note, setNote] = useState<Record<number, string>>({});
  const [saving, setSaving] = useState<number | null>(null);

  const load = () => {
    if (!tournamentId) return;
    setLoading(true);
    adminGet("works", { tournament_id: tournamentId }).then(d => setWorks(d.works || [])).finally(() => setLoading(false));
  };

  useEffect(() => { if (tournamentId) load(); }, [tournamentId]);

  const moderate = async (workId: number, action: "approve" | "reject" | "request_changes") => {
    setSaving(workId);
    await adminPost("moderate_work", { work_id: workId, action, note: note[workId] || "" });
    setSaving(null);
    load();
  };

  const STATUS_WORK: Record<string, string> = {
    draft: "Черновик", submitted: "На проверке", moderation: "На модерации",
    approved: "Одобрена", rejected: "Отклонена",
  };

  return (
    <div>
      <div style={{ display: "flex", gap: 10, alignItems: "flex-end", marginBottom: 20 }}>
        <div style={{ flex: 1 }}>
          <Field label="ID турнира" value={tournamentId} onChange={setTournamentId} placeholder="Введите ID турнира" />
        </div>
        <Btn onClick={load}>Загрузить работы</Btn>
      </div>

      {loading && <div style={{ color: "#94a3b8" }}>Загрузка…</div>}

      {works.length === 0 && !loading && tournamentId && (
        <div style={{ textAlign: "center", padding: "30px 0", color: "#94a3b8" }}>Работ пока нет</div>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        {works.map(w => {
          const photo = w.photos?.[0]?.url;
          const statusColor = w.status === "approved" ? "#059669" : w.status === "rejected" ? "#ef4444" : "#f59e0b";
          return (
            <Card key={w.id}>
              <div style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
                {photo ? (
                  <img src={photo} alt="" style={{ width: 80, height: 80, borderRadius: 10, objectFit: "cover", flexShrink: 0 }} />
                ) : (
                  <div style={{ width: 80, height: 80, borderRadius: 10, background: "#f1f5f9", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontSize: 24 }}>🖼</div>
                )}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 4, flexWrap: "wrap" }}>
                    <span style={{ fontWeight: 700, color: "#0f172a", fontSize: 14 }}>{w.title || "Без названия"}</span>
                    <span style={{ background: `${statusColor}18`, color: statusColor, borderRadius: 20, padding: "2px 10px", fontSize: 11, fontWeight: 700 }}>
                      {STATUS_WORK[w.status] || w.status}
                    </span>
                  </div>
                  <div style={{ fontSize: 13, color: "#64748b", marginBottom: 4 }}>{w.salon_name} · {w.city}</div>
                  {w.description && <div style={{ fontSize: 12, color: "#94a3b8", marginBottom: 6 }}>{w.description.slice(0, 150)}{w.description.length > 150 ? "…" : ""}</div>}
                  {w.master_name && <div style={{ fontSize: 12, color: "#64748b" }}>Мастер: {w.master_name}</div>}

                  {/* Модерационная заметка */}
                  <div style={{ marginTop: 10 }}>
                    <textarea
                      value={note[w.id] || ""}
                      onChange={e => setNote(p => ({ ...p, [w.id]: e.target.value }))}
                      placeholder="Комментарий для салона (при отклонении или исправлениях)…"
                      style={{ width: "100%", padding: "7px 10px", borderRadius: 8, border: "1px solid #e2e8f0", fontSize: 12, resize: "vertical", minHeight: 50 }}
                      rows={2}
                    />
                  </div>

                  <div style={{ display: "flex", gap: 6, marginTop: 8 }}>
                    <Btn small onClick={() => moderate(w.id, "approve")} color="#059669" disabled={saving === w.id}>
                      {saving === w.id ? "…" : "✓ Одобрить"}
                    </Btn>
                    <Btn small onClick={() => moderate(w.id, "request_changes")} color="#f59e0b" disabled={saving === w.id}>
                      Исправить
                    </Btn>
                    <Btn small onClick={() => moderate(w.id, "reject")} color="#ef4444" disabled={saving === w.id}>
                      Отклонить
                    </Btn>
                  </div>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

// ── Раздел: Подведение итогов ─────────────────────────────────────────────────

export function FinalizeSection() {
  const [tournamentId, setTournamentId] = useState("");
  const [works, setWorks] = useState<Work[]>([]);
  const [loading, setLoading] = useState(false);
  const [placements, setPlacements] = useState<Record<number, string>>({}); // workId -> place
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");

  const load = () => {
    if (!tournamentId) return;
    setLoading(true);
    adminGet("works", { tournament_id: tournamentId })
      .then(d => {
        const approved = (d.works || []).filter((w: Work) => w.status === "approved");
        setWorks(approved.sort((a: Work, b: Work) => b.votes_count - a.votes_count));
      })
      .finally(() => setLoading(false));
  };

  const finalize = async () => {
    setSaving(true); setMsg("");
    const pl = Object.entries(placements)
      .filter(([, place]) => place)
      .map(([workId, place]) => ({ work_id: Number(workId), place: Number(place) }));
    const r = await adminPost("finalize", { tournament_id: Number(tournamentId), placements: pl });
    setSaving(false);
    if (r.ok) setMsg(`✓ Итоги подведены! Наград выдано: ${r.awarded_salons}`);
    else setMsg("Ошибка: " + (r.error || "неизвестно"));
  };

  return (
    <div>
      <div style={{ background: "#fffbeb", border: "1px solid #fde68a", borderRadius: 10, padding: "12px 16px", marginBottom: 20, fontSize: 13, color: "#92400e" }}>
        ⚠️ Подведение итогов начисляет энергию победителям и присваивает достижения. Действие необратимо.
      </div>
      <div style={{ display: "flex", gap: 10, alignItems: "flex-end", marginBottom: 20 }}>
        <div style={{ flex: 1 }}>
          <Field label="ID турнира" value={tournamentId} onChange={setTournamentId} />
        </div>
        <Btn onClick={load}>Загрузить работы</Btn>
      </div>

      {loading && <div style={{ color: "#94a3b8" }}>Загрузка…</div>}

      {works.length > 0 && (
        <div>
          <div style={{ fontSize: 13, color: "#64748b", marginBottom: 12 }}>
            Отсортированы по голосам. Укажите место для каждой работы (оставьте пустым — без места).
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 16 }}>
            {works.map((w, i) => (
              <div key={w.id} style={{ display: "flex", alignItems: "center", gap: 12, background: "#fff", borderRadius: 10, border: "1px solid #e2e8f0", padding: "10px 14px" }}>
                <div style={{ fontSize: 20, fontWeight: 900, color: "#94a3b8", width: 28 }}>#{i + 1}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, fontWeight: 700, color: "#0f172a" }}>{w.title || "Без названия"}</div>
                  <div style={{ fontSize: 12, color: "#64748b" }}>{w.salon_name} · ❤️ {w.votes_count} голосов</div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ fontSize: 12, color: "#94a3b8" }}>Место:</span>
                  <select value={placements[w.id] || ""} onChange={e => setPlacements(p => ({ ...p, [w.id]: e.target.value }))}
                    style={{ padding: "6px 10px", borderRadius: 8, border: "1px solid #e2e8f0", fontSize: 13 }}>
                    <option value="">—</option>
                    {[1,2,3,4,5,6,7,8,9,10].map(n => <option key={n} value={n}>{n}</option>)}
                  </select>
                </div>
              </div>
            ))}
          </div>
          {msg && <div style={{ fontSize: 13, color: msg.startsWith("✓") ? "#059669" : "#ef4444", marginBottom: 12 }}>{msg}</div>}
          <Btn onClick={finalize} disabled={saving}>{saving ? "Подводим итоги…" : "🏆 Подвести итоги"}</Btn>
        </div>
      )}
    </div>
  );
}

// ── Раздел: Настройки ─────────────────────────────────────────────────────────

export function ChampSettingsSection() {
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);

  useEffect(() => {
    adminGet("settings").then(d => setSettings(d.settings || {})).finally(() => setLoading(false));
  }, []);

  const save = async (key: string, value: string) => {
    setSaving(key);
    await adminPost("settings_update", { key, value });
    setSaving(null);
  };

  const SETTING_LABELS: Record<string, string> = {
    min_participants_default: "Минимум участников по умолчанию",
    voting_weight_users:    "Вес голосов пользователей (%)",
    voting_weight_experts:  "Вес оценки экспертов (%)",
    voting_weight_activity: "Вес активности (%)",
    points_participation:   "Очки за участие",
    points_top10:           "Очки за Топ-10",
    points_top3:            "Очки за Топ-3",
    points_winner:          "Очки за победу",
    points_audience_fav:    "Очки «Любимец зрителей»",
  };

  if (loading) return <div style={{ color: "#94a3b8" }}>Загрузка…</div>;

  return (
    <div>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {Object.entries(settings).map(([key, value]) => (
          <Card key={key} style={{ marginBottom: 0 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 12, color: "#94a3b8", marginBottom: 2 }}>{SETTING_LABELS[key] || key}</div>
                <input
                  value={settings[key]}
                  onChange={e => setSettings(p => ({ ...p, [key]: e.target.value }))}
                  style={{ padding: "6px 10px", borderRadius: 8, border: "1px solid #e2e8f0", fontSize: 14, fontWeight: 700, width: 120 }}
                />
              </div>
              <Btn small onClick={() => save(key, settings[key])} disabled={saving === key}>
                {saving === key ? "…" : "Сохранить"}
              </Btn>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

// ── Раздел: Заявки ─────────────────────────────────────────────────────────────

interface Application {
  id: number; salon_name: string; city: string; logo_url: string;
  status: string; created_at: string; notify_email: string;
}

export function ApplicationsSection() {
  const [tournamentId, setTournamentId] = useState("");
  const [apps, setApps] = useState<Application[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState<number | null>(null);

  const load = () => {
    if (!tournamentId) return;
    setLoading(true);
    adminGet("applications", { tournament_id: tournamentId }).then(d => setApps(d.applications || [])).finally(() => setLoading(false));
  };

  const approve = async (id: number) => {
    setSaving(id);
    await adminPost("approve_application", { application_id: id });
    setSaving(null); load();
  };

  const reject = async (id: number) => {
    setSaving(id);
    await adminPost("reject_application", { application_id: id });
    setSaving(null); load();
  };

  const STATUS_COLORS_APP: Record<string, string> = {
    pending: "#f59e0b", approved: "#059669", rejected: "#ef4444", withdrawn: "#94a3b8",
  };
  const STATUS_LABELS_APP: Record<string, string> = {
    pending: "На рассмотрении", approved: "Одобрена", rejected: "Отклонена", withdrawn: "Отозвана",
  };

  return (
    <div>
      <div style={{ display: "flex", gap: 10, alignItems: "flex-end", marginBottom: 20 }}>
        <div style={{ flex: 1 }}><Field label="ID турнира" value={tournamentId} onChange={setTournamentId} /></div>
        <Btn onClick={load}>Загрузить</Btn>
      </div>
      {loading && <div style={{ color: "#94a3b8" }}>Загрузка…</div>}
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {apps.map(a => (
          <Card key={a.id} style={{ marginBottom: 0 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: "#0f172a" }}>{a.salon_name}</div>
                <div style={{ fontSize: 12, color: "#94a3b8" }}>{a.city} · {a.notify_email}</div>
              </div>
              <span style={{ background: `${STATUS_COLORS_APP[a.status]}18`, color: STATUS_COLORS_APP[a.status], borderRadius: 20, padding: "3px 12px", fontSize: 12, fontWeight: 700 }}>
                {STATUS_LABELS_APP[a.status]}
              </span>
              {a.status === "pending" && (
                <div style={{ display: "flex", gap: 6 }}>
                  <Btn small onClick={() => approve(a.id)} color="#059669" disabled={saving === a.id}>✓</Btn>
                  <Btn small onClick={() => reject(a.id)} color="#ef4444" disabled={saving === a.id}>✗</Btn>
                </div>
              )}
            </div>
          </Card>
        ))}
        {apps.length === 0 && !loading && tournamentId && <div style={{ color: "#94a3b8", textAlign: "center", padding: 20 }}>Заявок нет</div>}
      </div>
    </div>
  );
}

// ── Главный компонент ─────────────────────────────────────────────────────────

type ChampSection = "tournaments" | "applications" | "moderation" | "finalize" | "settings";

export function ChampionshipSection() {
  const [section, setSection] = useState<ChampSection>("tournaments");

  // Позволяем TournamentsSection открывать модерацию по ID
  setActiveWorksTournament = () => {};

  const tabs: { id: ChampSection; icon: string; label: string }[] = [
    { id: "tournaments",  icon: "Trophy",    label: "Турниры" },
    { id: "applications", icon: "ClipboardList", label: "Заявки" },
    { id: "moderation",   icon: "Shield",    label: "Модерация" },
    { id: "finalize",     icon: "Award",     label: "Итоги" },
    { id: "settings",     icon: "Settings",  label: "Настройки" },
  ];

  return (
    <div>
      <div style={{ display: "flex", gap: 6, marginBottom: 20, flexWrap: "wrap" }}>
        {tabs.map(t => (
          <button key={t.id} onClick={() => setSection(t.id)} style={{
            display: "flex", alignItems: "center", gap: 6, padding: "7px 14px",
            borderRadius: 9, border: "none",
            background: section === t.id ? ACCENT : "#f1f5f9",
            color: section === t.id ? "#fff" : "#555",
            fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "Montserrat, sans-serif",
          }}>
            <Icon name={t.icon} size={14} />
            {t.label}
          </button>
        ))}
      </div>
      {section === "tournaments"  && <TournamentsSection />}
      {section === "applications" && <ApplicationsSection />}
      {section === "moderation"   && <ModerationSection />}
      {section === "finalize"     && <FinalizeSection />}
      {section === "settings"     && <ChampSettingsSection />}
    </div>
  );
}
