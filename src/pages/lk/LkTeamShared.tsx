export const ACCENT      = "hsl(185,85%,32%)";
export const ACCENT_DARK = "hsl(185,85%,24%)";
export const LK_URL      = "https://functions.poehali.dev/1c0ad024-179b-4644-9621-377174bbeba3";

export function sid() { return localStorage.getItem("lk_session") || ""; }

export const ROLE_OPTIONS = [
  { code: "admin",          label: "Администратор",      icon: "PhoneCall",  desc: "ИИ-инструменты, скрипты, маркетинг" },
  { code: "master",         label: "Мастер",             icon: "Scissors",   desc: "Обучение мастеров, инструменты" },
  { code: "body_specialist",label: "Специалист по телу", icon: "Activity",   desc: "Диагностика, программы восстановления" },
];

export const PERM_LABELS: Record<string, string> = {
  ai_tools:     "ИИ-инструменты",
  diagnostics:  "Диагностика",
  analytics:    "Аналитика бизнеса",
  finance:      "Финансы",
  team:         "Управление командой",
  salon_profile:"Профиль салона",
};

export const ROLE_COLORS: Record<string, { color: string; bg: string }> = {
  owner:          { color: "hsl(40,90%,40%)",  bg: "hsl(40,90%,96%)" },
  admin:          { color: "hsl(185,85%,32%)", bg: "hsl(185,85%,95%)" },
  master:         { color: "hsl(280,60%,50%)", bg: "hsl(280,60%,96%)" },
  body_specialist:{ color: "hsl(145,60%,35%)", bg: "hsl(145,60%,96%)" },
};

export interface Member {
  id: number; user_id: number; role_code: string;
  permissions: Record<string, boolean>;
  monthly_credit_limit: number | null;
  is_active: boolean; joined_at: string;
  full_name: string; email: string; username: string;
  spent_month?: number;
}

export interface Invite {
  id: number; token: string; full_name: string; email: string | null;
  phone: string | null; role_code: string; status: string;
  created_at: string; expires_at: string;
}

export const inp: React.CSSProperties = {
  width: "100%", padding: "10px 13px", borderRadius: 9,
  border: "1.5px solid #E2E8F0", fontSize: 13,
  fontFamily: "Montserrat,sans-serif", background: "#fff",
  boxSizing: "border-box", color: "#0F172A", outline: "none",
};