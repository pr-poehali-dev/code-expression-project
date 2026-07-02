import React from "react";
import Icon from "@/components/ui/icon";
import func2url from "../../../backend/func2url.json";

export const API_URL  = (func2url as Record<string, string>)["championship-api"]  || "";
export const VOTE_URL = (func2url as Record<string, string>)["championship-vote"] || "";
export const SESSION  = () => localStorage.getItem("lk_session") || "";

export async function apiGet(action: string, params: Record<string, string> = {}) {
  const qs = new URLSearchParams({ action, ...params }).toString();
  const res = await fetch(`${API_URL}?${qs}`, { headers: { "X-Session-Id": SESSION() } });
  return JSON.parse(await res.text());
}
export async function apiPost(action: string, body: object) {
  const res = await fetch(`${API_URL}?action=${action}`, {
    method: "POST",
    headers: { "Content-Type": "application/json", "X-Session-Id": SESSION() },
    body: JSON.stringify(body),
  });
  return JSON.parse(await res.text());
}

export const ACCENT = "hsl(185,85%,32%)";

// ── Интерфейсы ────────────────────────────────────────────────────────────────
export interface Tournament {
  id: number; name: string; slug: string; emoji: string; status: string;
  description: string; task_text: string; prize_energy: number;
  prize_2nd: number; prize_3rd: number; min_participants: number;
  registration_starts: string; registration_ends: string;
  task_opens_at: string; work_deadline: string;
  voting_starts: string; voting_ends: string;
  applications_count: number; works_count: number;
  prizes: { place: number; title: string; value: string; partner_name: string }[];
}
export interface MyTournament {
  id: number; name: string; slug: string; emoji: string; status: string;
  application_id: number; application_status: string;
  work_id: number | null; work_status: string | null;
  real_votes: number; final_place: number | null; total_score: number;
  task_opens_at: string; work_deadline: string; voting_ends: string;
}
export interface SalonRating {
  total_points: number; participations: number; wins: number; top3_count: number; level: string;
}

export const STATUS_LABELS: Record<string, string> = {
  draft: "Скоро", announced: "Анонс", registration: "Регистрация открыта",
  active: "Приём работ", voting: "Голосование", finished_pending: "Итоги",
  finished: "Завершён", cancelled: "Отменён",
};
export const STATUS_COLORS: Record<string, string> = {
  announced: "#3b82f6", registration: "#10b981", active: "#6366f1",
  voting: "#f59e0b", finished_pending: "#f97316", finished: "#64748b", cancelled: "#ef4444",
};
export const LEVEL_LABELS: Record<string, string> = {
  newcomer: "Новичок", participant: "Участник", professional: "Профессионал",
  expert: "Эксперт", premium: "Премиум", legend: "Легенда",
};
export const LEVEL_COLORS: Record<string, string> = {
  newcomer: "#94a3b8", participant: "#3b82f6", professional: "#8b5cf6",
  expert: "#f59e0b", premium: "#ec4899", legend: "#f97316",
};
export const WORK_STATUS: Record<string, { label: string; color: string }> = {
  draft:      { label: "Черновик",     color: "#94a3b8" },
  submitted:  { label: "На проверке",  color: "#f59e0b" },
  approved:   { label: "Одобрена ✓",   color: "#10b981" },
  rejected:   { label: "Отклонена",    color: "#ef4444" },
};

// ── Мелкие вспомогалки ────────────────────────────────────────────────────────
export function Fact({ icon, text, accent, warn }: { icon: string; text: string; accent?: boolean; warn?: boolean }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 12, color: warn ? "#f59e0b" : accent ? ACCENT : "#64748b", fontWeight: warn || accent ? 600 : 400 }}>
      <span>{icon}</span> {text}
    </div>
  );
}

export function Block({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ background: "#fff", borderRadius: 14, border: "1.5px solid #e2e8f0", padding: "16px 18px" }}>
      <div style={{ fontSize: 12, fontWeight: 700, color: "#94a3b8", letterSpacing: 1, marginBottom: 12 }}>{title.toUpperCase()}</div>
      {children}
    </div>
  );
}

export function F({ label, value, onChange, placeholder = "", textarea = false }:
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

export function ActionBtn({ children, onClick, loading, icon, color = ACCENT }:
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

export function RatingBadge({ label, value, color, icon }: { label: string; value: string; color?: string; icon?: string }) {
  return (
    <div style={{ background: "#fff", border: "1.5px solid #e2e8f0", borderRadius: 12, padding: "10px 16px", textAlign: "center", minWidth: 80 }}>
      <div style={{ fontSize: 16, fontWeight: 900, color: color || "#0f172a" }}>{icon ? `${icon} ` : ""}{value}</div>
      <div style={{ fontSize: 11, color: "#94a3b8", marginTop: 2 }}>{label}</div>
    </div>
  );
}

export function ProgressSteps({ my }: { my: MyTournament }) {
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
