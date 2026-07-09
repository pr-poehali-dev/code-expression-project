import { useState, useEffect, useRef } from "react";
import { ACCENT } from "./LkAdminShared";
import {
  adminGet, adminPost, ADMIN_URL, SESSION,
  Btn, Field, Card,
  STATUS_LABELS, STATUS_COLORS,
  Tournament, EMPTY_TOURNAMENT, activeWorksRef,
  mskLocalToUtcIso, utcIsoToMskLocal,
} from "./LkAdminChampionshipShared";

const EMOJI_OPTIONS = [
  // Награды
  "🏆","🥇","🥈","🥉","🏅","🎖️","👑","🎗️",
  // Блеск
  "💎","✨","⭐","🌟","💫","🔮","💠","🪩",
  // Красота & уход
  "💅","💄","👄","🪞","💋","🌸","🌺","🌹",
  // Стиль
  "✂️","🪄","🎨","🪮","💇","🧖","💆","🛁",
];

function EmojiPicker({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div style={{ marginBottom: 10, position: "relative" }} ref={ref}>
      <div style={{ fontSize: 11, fontWeight: 700, color: "#94a3b8", marginBottom: 4 }}>{label.toUpperCase()}</div>
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        style={{
          width: "100%", padding: "7px 10px", borderRadius: 8,
          border: `1.5px solid ${open ? ACCENT : "#e2e8f0"}`,
          background: "#fff", cursor: "pointer", display: "flex", alignItems: "center", gap: 8,
          fontSize: 13, fontFamily: "Montserrat, sans-serif",
          transition: "border-color 0.15s",
        }}
      >
        <span style={{ fontSize: 22, lineHeight: 1 }}>{value || "🏆"}</span>
        <span style={{ color: "#64748b", flex: 1, textAlign: "left" }}>Выбрать эмодзи</span>
        <span style={{ color: "#94a3b8", fontSize: 11 }}>{open ? "▲" : "▼"}</span>
      </button>

      {open && (
        <div style={{
          position: "absolute", top: "calc(100% + 6px)", left: 0, zIndex: 100,
          background: "#fff", borderRadius: 12,
          border: "1.5px solid #e2e8f0",
          boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
          padding: 12, width: 260,
        }}>
          {[
            { label: "Награды",    items: ["🏆","🥇","🥈","🥉","🏅","🎖️","👑","🎗️"] },
            { label: "Блеск",      items: ["💎","✨","⭐","🌟","💫","🔮","💠","🪩"] },
            { label: "Красота",    items: ["💅","💄","👄","🪞","💋","🌸","🌺","🌹"] },
            { label: "Мастерство", items: ["✂️","🪄","🎨","🪮","💇","🧖","💆","🛁"] },
          ].map(group => (
            <div key={group.label} style={{ marginBottom: 10 }}>
              <div style={{ fontSize: 9, fontWeight: 700, color: "#cbd5e1", letterSpacing: 1.5, marginBottom: 5 }}>
                {group.label.toUpperCase()}
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(8, 1fr)", gap: 2 }}>
                {group.items.map(e => (
                  <button
                    key={e}
                    type="button"
                    onClick={() => { onChange(e); setOpen(false); }}
                    style={{
                      width: 28, height: 28, borderRadius: 6, border: "none",
                      background: value === e ? `${ACCENT}18` : "transparent",
                      cursor: "pointer", fontSize: 17, lineHeight: 1,
                      outline: value === e ? `1.5px solid ${ACCENT}` : "none",
                      transition: "background 0.1s",
                      display: "flex", alignItems: "center", justifyContent: "center",
                    }}
                    onMouseEnter={el => (el.currentTarget.style.background = "#f1f5f9")}
                    onMouseLeave={el => (el.currentTarget.style.background = value === e ? `${ACCENT}18` : "transparent")}
                  >
                    {e}
                  </button>
                ))}
              </div>
            </div>
          ))}
          <div style={{ marginTop: 4, borderTop: "1px solid #f1f5f9", paddingTop: 10 }}>
            <div style={{ fontSize: 9, fontWeight: 700, color: "#cbd5e1", letterSpacing: 1.5, marginBottom: 6 }}>
              ИЛИ ВВЕДИТЕ СВОЙ
            </div>
            <input
              value={value}
              onChange={e => onChange(e.target.value)}
              maxLength={4}
              placeholder="🏆"
              style={{
                width: "100%", padding: "6px 10px", borderRadius: 8,
                border: "1px solid #e2e8f0", fontSize: 20, textAlign: "center",
                fontFamily: "sans-serif", outline: "none",
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}

function CoverUpload({ value, onChange }: { value: string; onChange: (url: string) => void }) {
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    setUploading(true);
    const reader = new FileReader();
    reader.onload = async () => {
      const b64 = (reader.result as string).split(",")[1];
      const res = await fetch(`${ADMIN_URL}?action=upload_cover`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "X-Session-Id": SESSION() },
        body: JSON.stringify({ image_base64: b64, content_type: file.type }),
      });
      const data = await res.json();
      if (data.url) onChange(data.url);
      setUploading(false);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div style={{ marginBottom: 12 }}>
      <div style={{ fontSize: 11, fontWeight: 700, color: "#94a3b8", marginBottom: 6 }}>ОБЛОЖКА ТУРНИРА</div>
      <div
        onClick={() => inputRef.current?.click()}
        style={{
          width: "100%", height: value ? "auto" : 120, borderRadius: 10,
          border: `2px dashed ${value ? ACCENT : "#e2e8f0"}`,
          cursor: "pointer", overflow: "hidden", position: "relative",
          background: value ? "transparent" : "#f8fafc",
          display: "flex", alignItems: "center", justifyContent: "center",
          transition: "border-color 0.2s",
        }}
      >
        {value ? (
          <img src={value} alt="cover" style={{ width: "100%", maxHeight: 200, objectFit: "cover", display: "block" }} />
        ) : (
          <div style={{ textAlign: "center", color: "#94a3b8", padding: 16 }}>
            <div style={{ fontSize: 28, marginBottom: 6 }}>🖼</div>
            <div style={{ fontSize: 12 }}>Нажмите, чтобы загрузить фото</div>
            <div style={{ fontSize: 11, color: "#cbd5e1", marginTop: 2 }}>JPG, PNG · до 5 МБ</div>
          </div>
        )}
        {uploading && (
          <div style={{ position: "absolute", inset: 0, background: "rgba(255,255,255,0.8)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, color: ACCENT, fontWeight: 700 }}>
            Загружаю…
          </div>
        )}
      </div>
      {value && (
        <button onClick={() => onChange("")} type="button" style={{ marginTop: 6, fontSize: 11, color: "#ef4444", background: "none", border: "none", cursor: "pointer", fontFamily: "Montserrat,sans-serif" }}>
          ✕ Удалить фото
        </button>
      )}
      <input ref={inputRef} type="file" accept="image/*" style={{ display: "none" }}
        onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f); }} />
    </div>
  );
}

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
      cover_image_url: t.cover_image_url || "",
      registration_starts: utcIsoToMskLocal(t.registration_starts),
      registration_ends: utcIsoToMskLocal(t.registration_ends),
      task_opens_at: utcIsoToMskLocal(t.task_opens_at),
      work_deadline: utcIsoToMskLocal(t.work_deadline),
      voting_starts: utcIsoToMskLocal(t.voting_starts),
      voting_ends: utcIsoToMskLocal(t.voting_ends),
      next_date: utcIsoToMskLocal(t.next_date),
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
      registration_starts: mskLocalToUtcIso(form.registration_starts),
      registration_ends: mskLocalToUtcIso(form.registration_ends),
      task_opens_at: mskLocalToUtcIso(form.task_opens_at),
      work_deadline: mskLocalToUtcIso(form.work_deadline),
      voting_starts: mskLocalToUtcIso(form.voting_starts),
      voting_ends: mskLocalToUtcIso(form.voting_ends),
      next_date: mskLocalToUtcIso(form.next_date),
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
            <EmojiPicker label="Эмодзи" value={form.emoji} onChange={f("emoji")} />
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, color: "#94a3b8", marginBottom: 4 }}>СТАТУС</div>
              <select value={form.status} onChange={e => f("status")(e.target.value)}
                style={{ width: "100%", padding: "8px 10px", borderRadius: 8, border: "1px solid #e2e8f0", fontSize: 13 }}>
                {Object.entries(STATUS_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
              </select>
            </div>
          </div>
          <CoverUpload value={form.cover_image_url} onChange={v => setForm(p => ({ ...p, cover_image_url: v }))} />
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