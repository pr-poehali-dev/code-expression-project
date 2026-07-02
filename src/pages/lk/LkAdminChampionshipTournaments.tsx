import { useState, useEffect } from "react";
import { ACCENT } from "./LkAdminShared";
import {
  adminGet, adminPost,
  Btn, Field, Card,
  STATUS_LABELS, STATUS_COLORS,
  Tournament, EMPTY_TOURNAMENT, activeWorksRef,
} from "./LkAdminChampionshipShared";

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
                <Btn small onClick={() => activeWorksRef.setTournament(t.id)}>Работы</Btn>
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