export interface StaffMember {
  id: string;
  name: string;
  role: string;
  experience: string;
  // Поток
  clients_count: string;
  new_clients: string;
  return_pct: string;
  // Деньги
  revenue: string;
  avg_check: string;
  has_upsell: boolean | null;
  // Повторная запись
  rebooking_pct: string;
  has_rebooking_offer: boolean | null;
  // Качество (1–10)
  service_score: string;
  // Продажи
  has_sales_script: boolean | null;
}

export interface StaffResult {
  name: string; role: string;
  score: number; category: string;
  total_loss: number; potential: number;
  loss_return: number; loss_check: number; loss_upsell: number;
  // Исходные метрики (для детальной карточки)
  revenue?: string; avg_check?: string; clients_count?: string;
  new_clients?: string; return_pct?: string; rebooking_pct?: string;
  service_score?: string; experience?: string;
  has_upsell?: boolean | null; has_rebooking_offer?: boolean | null; has_sales_script?: boolean | null;
}

export interface AuditResult {
  staff: StaffResult[];
  summary: { avg_score: number; total_loss: number; total_potential: number; stars_count: number; problem_count: number; };
  ai_text: string;
}

export interface HistoryItem { id: number; summary: { avg_score: number; total_loss: number }; created_at: string; }

export const ACCENT = "hsl(185,85%,32%)";
export const ACCENT_DARK = "hsl(185,85%,24%)";
export const LK_URL = "https://functions.poehali.dev/1c0ad024-179b-4644-9621-377174bbeba3";
export function sid() { return localStorage.getItem("lk_session") || ""; }

export const ROLES = ["Администратор", "Мастер маникюра", "Парикмахер", "Косметолог", "Массажист", "Бровист", "Другое"];

export const inp: React.CSSProperties = { width: "100%", padding: "9px 12px", borderRadius: 9, border: "1.5px solid #E2E8F0", fontSize: 12, fontFamily: "Montserrat,sans-serif", background: "#fff", boxSizing: "border-box", color: "#0F172A", outline: "none" };

export function newMember(): StaffMember {
  return { id: Math.random().toString(36).slice(2), name: "", role: "", experience: "", clients_count: "", new_clients: "", return_pct: "", revenue: "", avg_check: "", has_upsell: null, rebooking_pct: "", has_rebooking_offer: null, service_score: "", has_sales_script: null };
}

const STAFF_DRAFT_KEY = "lk_staff_audit_draft";
export function saveStaffDraft(staff: StaffMember[]) {
  try { localStorage.setItem(STAFF_DRAFT_KEY, JSON.stringify(staff)); } catch (_) { /* ignore */ }
}
export function loadStaffDraft(): StaffMember[] | null {
  try { const d = localStorage.getItem(STAFF_DRAFT_KEY); return d ? JSON.parse(d) : null; } catch (_) { return null; }
}
export function clearStaffDraft() { localStorage.removeItem(STAFF_DRAFT_KEY); }