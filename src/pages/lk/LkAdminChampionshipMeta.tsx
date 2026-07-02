import { useState, useEffect } from "react";
import {
  adminGet, adminPost,
  Btn, Field, Card,
  Application,
} from "./LkAdminChampionshipShared";
import func2url from "../../../backend/func2url.json";

const CRON_URL = (func2url as Record<string, string>)["championship-cron"] || "";

// ── Раздел: Заявки ────────────────────────────────────────────────────────────

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

// ── Раздел: Настройки ─────────────────────────────────────────────────────────

export function ChampSettingsSection() {
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);
  const [cronRunning, setCronRunning] = useState(false);
  const [cronResult, setCronResult] = useState<string | null>(null);

  useEffect(() => {
    adminGet("settings").then(d => setSettings(d.settings || {})).finally(() => setLoading(false));
  }, []);

  const save = async (key: string, value: string) => {
    setSaving(key);
    await adminPost("settings_update", { key, value });
    setSaving(null);
  };

  const runCron = async () => {
    setCronRunning(true);
    setCronResult(null);
    try {
      const res = await fetch(`${CRON_URL}?action=run`);
      const data = await res.json();
      const r = data.results || {};
      const parts: string[] = [];
      if (r.notify)             parts.push(`📧 Уведомлений: ${r.notify.notified ?? 0}`);
      if (r.open_registration)  parts.push(`📋 Регистраций открыто: ${(r.open_registration.opened_registration || []).length}`);
      if (r.check_min)          parts.push(`⚠️ Перенесено: ${(r.check_min.postponed || []).length}`);
      if (r.open_tasks)         parts.push(`🎯 Заданий открыто: ${(r.open_tasks.opened || []).length}`);
      if (r.start_voting)       parts.push(`🗳 Голосований запущено: ${(r.start_voting.started_voting || []).length}`);
      if (r.close_voting)       parts.push(`🏁 Голосований закрыто: ${(r.close_voting.closed_voting || []).length}`);
      if (r.auto_finalize)      parts.push(`🏆 Финализировано: ${(r.auto_finalize.finalized || []).length}`);
      setCronResult(parts.length > 0 ? parts.join(" · ") : "✓ Всё актуально, изменений нет");
    } catch {
      setCronResult("Ошибка при запуске");
    } finally {
      setCronRunning(false);
    }
  };

  const SETTING_LABELS: Record<string, string> = {
    min_participants_default: "Минимум участников по умолчанию",
    voting_weight_users:     "Вес голосов пользователей (%)",
    voting_weight_experts:   "Вес оценки экспертов (%)",
    voting_weight_activity:  "Вес активности (%)",
    points_participation:    "Очки за участие",
    points_top10:            "Очки за Топ-10",
    points_top3:             "Очки за Топ-3",
    points_winner:           "Очки за победу",
    points_audience_fav:     "Очки «Любимец зрителей»",
  };

  if (loading) return <div style={{ color: "#94a3b8" }}>Загрузка…</div>;

  return (
    <div>
      {/* Запуск крона */}
      <Card style={{ marginBottom: 20, background: "#f8fafc" }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: "#0f172a", marginBottom: 4 }}>🤖 Автоматика турниров</div>
        <div style={{ fontSize: 12, color: "#64748b", marginBottom: 12, lineHeight: 1.5 }}>
          Запускает все автопереходы: анонс→регистрация, регистрация→активный, открытие голосования, закрытие, рассылка писем салонам.
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
          <Btn onClick={runCron} disabled={cronRunning}>
            {cronRunning ? "Запускаю…" : "▶ Запустить сейчас"}
          </Btn>
          {cronResult && (
            <div style={{ fontSize: 13, color: "#059669", fontWeight: 600 }}>{cronResult}</div>
          )}
        </div>
      </Card>

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