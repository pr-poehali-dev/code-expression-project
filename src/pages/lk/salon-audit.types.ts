export const ACCENT = "hsl(185,85%,32%)";
export const ACCENT_DARK = "hsl(185,85%,24%)";
export const LK_URL = "https://functions.poehali.dev/1c0ad024-179b-4644-9621-377174bbeba3";
export const AUDIT_URL = "https://functions.poehali.dev/6847fc61-df71-410b-af64-e213c52e7316";

export function sid() { return localStorage.getItem("lk_session") || ""; }
export async function lkPost(action: string, body: object) {
  const r = await fetch(`${LK_URL}?action=${action}`, { method: "POST", headers: { "Content-Type": "application/json", "X-Session-Id": sid() }, body: JSON.stringify(body) });
  return r.json();
}

export interface Answers { [key: string]: string | boolean | number; }

export interface AuditSection { score: number; strengths: string[]; weaknesses: string[]; risks: string[]; }
export interface AuditResult {
  consultant_summary: string;
  score_total: number;
  scores: { clients: number; marketing: number; sales: number; staff: number; management: number; };
  sections: { clients: AuditSection; marketing: AuditSection; sales: AuditSection; staff: AuditSection; management: AuditSection; };
  main_problems: string[];
  growth_points: string[];
  revenue_potential: string;
  plan: { week_1: string[]; month_1: string[]; month_3: string[]; };
  recommended_products: { problem: string; course: string; description: string; }[];
}

export interface HistoryItem { id: number; score_total: number; created_at: string; }

export const BLOCKS = [
  {
    id: "general", title: "Общая информация", icon: "Building2",
    fields: [
      { key: "salon_name",    label: "Название салона",        type: "text",   placeholder: "Студия «Аура»" },
      { key: "city",          label: "Город",                  type: "text",   placeholder: "Москва" },
      { key: "age_years",     label: "Сколько лет работаете",  type: "number", placeholder: "3" },
      { key: "staff_count",   label: "Количество сотрудников", type: "number", placeholder: "5" },
      { key: "rooms_count",   label: "Количество кабинетов",   type: "number", placeholder: "3" },
      { key: "main_services", label: "Основные услуги",        type: "text",   placeholder: "Маникюр, массаж, косметология" },
    ]
  },
  {
    id: "finance", title: "Финансы", icon: "TrendingUp",
    fields: [
      { key: "monthly_revenue",   label: "Выручка в месяц (₽)", type: "number", placeholder: "500000" },
      { key: "monthly_profit",    label: "Чистая прибыль (₽)",  type: "number", placeholder: "120000" },
      { key: "avg_check",         label: "Средний чек (₽)",      type: "number", placeholder: "3500" },
      { key: "clients_per_month", label: "Клиентов в месяц",     type: "number", placeholder: "120" },
    ]
  },
  {
    id: "clients", title: "Клиенты", icon: "Users",
    fields: [
      { key: "new_clients_pct",       label: "Новых клиентов (%)",       type: "number",  placeholder: "30" },
      { key: "returning_clients_pct", label: "Постоянных клиентов (%)",  type: "number",  placeholder: "70" },
      { key: "has_loyalty",           label: "Есть программа лояльности", type: "boolean", placeholder: "" },
      { key: "has_rebooking",         label: "Есть повторная запись",     type: "boolean", placeholder: "" },
      { key: "has_client_base",       label: "Ведётся база клиентов",     type: "boolean", placeholder: "" },
    ]
  },
  {
    id: "marketing", title: "Маркетинг", icon: "Megaphone",
    fields: [
      { key: "ad_channels",  label: "Рекламные каналы",           type: "text",    placeholder: "Instagram, сарафан, Яндекс" },
      { key: "has_social",   label: "Есть соцсети",               type: "boolean", placeholder: "" },
      { key: "has_content",  label: "Контент ведётся регулярно",  type: "boolean", placeholder: "" },
      { key: "has_promo",    label: "Проводятся акции",           type: "boolean", placeholder: "" },
      { key: "has_partners", label: "Есть партнёрские программы", type: "boolean", placeholder: "" },
    ]
  },
  {
    id: "staff", title: "Персонал", icon: "GraduationCap",
    fields: [
      { key: "has_standards",       label: "Есть стандарты общения",    type: "boolean", placeholder: "" },
      { key: "has_training",        label: "Есть обучение сотрудников", type: "boolean", placeholder: "" },
      { key: "has_motivation",      label: "Есть система мотивации",    type: "boolean", placeholder: "" },
      { key: "has_quality_control", label: "Есть контроль качества",    type: "boolean", placeholder: "" },
    ]
  },
  {
    id: "sales", title: "Продажи", icon: "ShoppingBag",
    fields: [
      { key: "has_upsell",     label: "Делают допродажи",             type: "boolean", placeholder: "" },
      { key: "has_packages",   label: "Продают комплексные программы", type: "boolean", placeholder: "" },
      { key: "sells_homecare", label: "Продают домашний уход",        type: "boolean", placeholder: "" },
      { key: "has_scripts",    label: "Есть скрипты продаж",          type: "boolean", placeholder: "" },
    ]
  },
];
