import React from "react";
import { ACCENT } from "./LkAdminShared";
import func2url from "../../../backend/func2url.json";

export const ADMIN_URL = (func2url as Record<string, string>)["championship-admin"] || "";
export const SESSION = () => localStorage.getItem("lk_session") || "";

export async function adminGet(action: string, params: Record<string, string> = {}) {
  const qs = new URLSearchParams({ action, ...params }).toString();
  const res = await fetch(`${ADMIN_URL}?${qs}`, { headers: { "X-Session-Id": SESSION() } });
  return JSON.parse(await res.text());
}

export async function adminPost(action: string, body: object) {
  const res = await fetch(`${ADMIN_URL}?action=${action}`, {
    method: "POST",
    headers: { "Content-Type": "application/json", "X-Session-Id": SESSION() },
    body: JSON.stringify(body),
  });
  return JSON.parse(await res.text());
}

// ── Вспомогательные UI ────────────────────────────────────────────────────────

export function Btn({ children, onClick, color = ACCENT, small = false, disabled = false }:
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

export function Field({ label, value, onChange, type = "text", placeholder = "", textarea = false }:
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

export function Card({ children, style = {} }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <div style={{ background: "#fff", borderRadius: 14, border: "1px solid #e8ecf0", padding: 18, marginBottom: 16, ...style }}>
      {children}
    </div>
  );
}

export const STATUS_LABELS: Record<string, string> = {
  draft: "Черновик", announced: "Анонс", registration: "Регистрация",
  active: "Приём работ", voting: "Голосование",
  finished_pending: "Итоги", finished: "Завершён", cancelled: "Отменён",
};

export const STATUS_COLORS: Record<string, string> = {
  draft: "#94a3b8", announced: "#3b82f6", registration: "#10b981",
  active: "#6366f1", voting: "#f59e0b", finished_pending: "#f97316",
  finished: "#64748b", cancelled: "#ef4444",
};

// ── Интерфейсы ────────────────────────────────────────────────────────────────

export interface Tournament {
  id: number; name: string; slug: string; emoji: string; status: string;
  prize_energy: number; prize_2nd: number; prize_3rd: number;
  min_participants: number; applications_count: number; works_count: number;
  description: string; rules: string; task_text: string;
  cover_image_url: string;
  registration_starts: string; registration_ends: string;
  task_opens_at: string; work_deadline: string;
  voting_starts: string; voting_ends: string; next_date: string;
  postponed: boolean; postpone_reason: string; season_name: string;
}

export interface Work {
  id: number; title: string; status: string; salon_name: string; city: string;
  votes_count: number; moderation_note: string; photos: { url: string }[];
  description: string; story: string; services_done: string; master_name: string;
  tools_used: string; video_url: string;
}

export interface Application {
  id: number; salon_name: string; city: string; logo_url: string;
  status: string; created_at: string; notify_email: string;
}

// ── Работа с московским временем (UTC+3, без перехода на летнее/зимнее) ────────

const MSK_OFFSET_MIN = 3 * 60;

/** "YYYY-MM-DDTHH:mm" (введено как МСК) → ISO-строка в UTC для отправки на backend */
export function mskLocalToUtcIso(local: string): string {
  if (!local) return "";
  const [datePart, timePart] = local.split("T");
  const [y, m, d] = datePart.split("-").map(Number);
  const [hh, mm] = (timePart || "00:00").split(":").map(Number);
  const utcMs = Date.UTC(y, m - 1, d, hh, mm) - MSK_OFFSET_MIN * 60 * 1000;
  return new Date(utcMs).toISOString();
}

/** ISO-строка из backend (UTC) → "YYYY-MM-DDTHH:mm" в МСК для поля datetime-local */
export function utcIsoToMskLocal(iso: string): string {
  if (!iso) return "";
  const utcMs = new Date(iso).getTime() + MSK_OFFSET_MIN * 60 * 1000;
  const d = new Date(utcMs);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getUTCFullYear()}-${pad(d.getUTCMonth() + 1)}-${pad(d.getUTCDate())}T${pad(d.getUTCHours())}:${pad(d.getUTCMinutes())}`;
}

export const EMPTY_TOURNAMENT = {
  name: "", slug: "", emoji: "🏆", status: "draft", description: "", rules: "", task_text: "",
  prize_energy: 0, prize_2nd: 0, prize_3rd: 0, min_participants: 5,
  cover_image_url: "",
  registration_starts: "", registration_ends: "", task_opens_at: "",
  work_deadline: "", voting_starts: "", voting_ends: "", next_date: "",
  season_id: "",
};

// Глобальная ссылка — позволяет TournamentsSection переключать таб Модерации
// Используем объект чтобы обойти ограничение ES-модулей на переприсвоение экспортов
export const activeWorksRef = {
  setTournament: (_id: number) => {},
};