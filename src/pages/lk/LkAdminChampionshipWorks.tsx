import { useState, useEffect } from "react";
import {
  adminGet, adminPost,
  Btn, Card,
  Work,
} from "./LkAdminChampionshipShared";

// ── Карточка работы ───────────────────────────────────────────────────────────

function WorkCard({ w, statusLabel, note, saving, onNote, onModerate }: {
  w: Work; statusLabel: string; note: string; saving: boolean;
  onNote: (v: string) => void;
  onModerate: (action: "approve" | "reject" | "request_changes") => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const photo = w.photos?.[0]?.url;
  const statusColor = w.status === "approved" ? "#059669" : w.status === "rejected" ? "#ef4444" : "#f59e0b";

  return (
    <Card>
      {/* Шапка карточки */}
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
              {statusLabel}
            </span>
          </div>
          <div style={{ fontSize: 13, color: "#64748b", marginBottom: 4 }}>{w.salon_name} · {w.city}</div>
          {w.master_name && <div style={{ fontSize: 12, color: "#64748b" }}>Мастер: {w.master_name}</div>}
          <button onClick={() => setExpanded(p => !p)} style={{ marginTop: 6, padding: "4px 10px", borderRadius: 7, border: "1px solid #e2e8f0", background: "transparent", fontSize: 12, color: "#6366f1", fontWeight: 600, cursor: "pointer" }}>
            {expanded ? "Свернуть ▲" : "Подробнее ▼"}
          </button>
        </div>
      </div>

      {/* Раскрытые детали */}
      {expanded && (
        <div style={{ marginTop: 16, borderTop: "1px solid #f1f5f9", paddingTop: 14, display: "flex", flexDirection: "column", gap: 12 }}>
          {/* Все фото */}
          {w.photos && w.photos.length > 0 && (
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, color: "#94a3b8", marginBottom: 6 }}>ФОТОГРАФИИ ({w.photos.length})</div>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {w.photos.map((p, i) => (
                  <a key={i} href={p.url} target="_blank" rel="noreferrer">
                    <img src={p.url} alt="" style={{ width: 100, height: 100, borderRadius: 8, objectFit: "cover" }} />
                  </a>
                ))}
              </div>
            </div>
          )}
          {w.description && <DetailRow label="Описание" value={w.description} />}
          {w.story && <DetailRow label="История / концепция" value={w.story} />}
          {w.services_done && <DetailRow label="Выполненные услуги" value={w.services_done} />}
          {w.tools_used && <DetailRow label="Использованные средства" value={w.tools_used} />}
          {w.video_url && (
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, color: "#94a3b8", marginBottom: 4 }}>ВИДЕО</div>
              <a href={w.video_url} target="_blank" rel="noreferrer" style={{ fontSize: 13, color: "#6366f1" }}>{w.video_url}</a>
            </div>
          )}
        </div>
      )}

      {/* Модерация */}
      <div style={{ marginTop: 14, borderTop: "1px solid #f1f5f9", paddingTop: 12 }}>
        <textarea
          value={note}
          onChange={e => onNote(e.target.value)}
          placeholder="Комментарий для салона (при отклонении или исправлениях)…"
          style={{ width: "100%", padding: "7px 10px", borderRadius: 8, border: "1px solid #e2e8f0", fontSize: 12, resize: "vertical", minHeight: 50, boxSizing: "border-box" }}
          rows={2}
        />
        <div style={{ display: "flex", gap: 6, marginTop: 8 }}>
          <Btn small onClick={() => onModerate("approve")} color="#059669" disabled={saving}>
            {saving ? "…" : "✓ Одобрить"}
          </Btn>
          <Btn small onClick={() => onModerate("request_changes")} color="#f59e0b" disabled={saving}>
            Исправить
          </Btn>
          <Btn small onClick={() => onModerate("reject")} color="#ef4444" disabled={saving}>
            Отклонить
          </Btn>
        </div>
      </div>
    </Card>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div style={{ fontSize: 11, fontWeight: 700, color: "#94a3b8", marginBottom: 4 }}>{label.toUpperCase()}</div>
      <div style={{ fontSize: 13, color: "#374151", lineHeight: 1.6, whiteSpace: "pre-wrap" }}>{value}</div>
    </div>
  );
}

// ── Раздел: Модерация работ ────────────────────────────────────────────────────

export function ModerationSection() {
  const [tournamentId, setTournamentId] = useState("");
  const [tournaments, setTournaments] = useState<{ id: number; name: string; status: string }[]>([]);
  const [works, setWorks] = useState<Work[]>([]);
  const [loading, setLoading] = useState(false);
  const [note, setNote] = useState<Record<number, string>>({});
  const [saving, setSaving] = useState<number | null>(null);

  useEffect(() => {
    adminGet("tournaments").then(d => {
      const list = (d.tournaments || []).filter((t: { status: string }) =>
        ["registration", "active", "voting", "finished_pending"].includes(t.status)
      );
      setTournaments(list);
      if (list.length > 0) setTournamentId(String(list[0].id));
    });
  }, []);

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
          <div style={{ fontSize: 12, fontWeight: 600, color: "#64748b", marginBottom: 4 }}>Турнир</div>
          <select
            value={tournamentId}
            onChange={e => setTournamentId(e.target.value)}
            style={{ width: "100%", padding: "9px 12px", borderRadius: 9, border: "1.5px solid #e2e8f0", fontSize: 14, background: "#fff", color: "#0f172a" }}
          >
            {tournaments.map(t => (
              <option key={t.id} value={String(t.id)}>{t.name} (#{t.id})</option>
            ))}
          </select>
        </div>
        <Btn onClick={load}>Обновить</Btn>
      </div>

      {loading && <div style={{ color: "#94a3b8" }}>Загрузка…</div>}

      {works.length === 0 && !loading && tournamentId && (
        <div style={{ textAlign: "center", padding: "30px 0", color: "#94a3b8" }}>Работ пока нет</div>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        {works.map(w => (
          <WorkCard key={w.id} w={w} statusLabel={STATUS_WORK[w.status] || w.status}
            note={note[w.id] || ""} saving={saving === w.id}
            onNote={v => setNote(p => ({ ...p, [w.id]: v }))}
            onModerate={action => moderate(w.id, action)} />
        ))}
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