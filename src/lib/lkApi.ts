const BASE = "https://functions.poehali.dev/1c0ad024-179b-4644-9621-377174bbeba3";

function getSessionId(): string {
  return localStorage.getItem("lk_session") || "";
}

export function saveSession(id: string) {
  localStorage.setItem("lk_session", id);
}

export function clearSession() {
  localStorage.removeItem("lk_session");
}

export class AuthError extends Error {}

export class EnergyError extends Error {
  noSalon: boolean;
  constructor(message: string, noSalon = false) {
    super(message);
    this.noSalon = noSalon;
  }
}

async function request(method: string, action: string, body?: object, extraParams?: string) {
  const url = `${BASE}?action=${action}${extraParams || ""}`;
  const res = await fetch(url, {
    method,
    headers: {
      "Content-Type": "application/json",
      "X-Session-Id": getSessionId(),
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await res.json();
  if (res.status === 401) throw new AuthError(data.error || "Не авторизован");
  if (res.status === 402) {
    const msg = data.error || "Недостаточно энергии";
    const noSalon = msg.includes("профиль салона");
    const err = new EnergyError(msg, noSalon);
    // Показываем глобальный модал
    import("@/components/EnergyGate").then(m => m.showEnergyGate({ message: msg, noSalon }));
    throw err;
  }
  if (!res.ok) throw new Error(data.error || "Ошибка сервера");
  return data;
}

export const lkApi = {
  login: (username: string, password: string) =>
    request("POST", "login", { username, password }),

  register: (full_name: string, email: string, password: string, user_type: "salon" | "solo_master" = "salon", source?: string) =>
    request("POST", "register", { full_name, email, password, user_type, source }),

  logout: () => request("POST", "logout"),

  me: () => request("GET", "me"),

  tests: () => request("GET", "tests"),

  testDetail: (slug: string) =>
    request("GET", "test_detail", undefined, `&slug=${slug}`),

  submitTest: (test_id: number, answers: Record<string, number>) =>
    request("POST", "submit_test", { test_id, answers }),

  bodyZones: () => request("GET", "body_zones"),

  bodyZone: (slug: string) =>
    request("GET", "body_zone", undefined, `&slug=${slug}`),

  bodyZoneView: (slug: string) =>
    request("GET", "body_zone_view", undefined, `&slug=${slug}`),

  // Админка
  adminUsers: () => request("GET", "admin_users"),

  adminCreateUser: (data: object) =>
    request("POST", "admin_create_user", data),

  adminUpdateUser: (data: object) =>
    request("POST", "admin_update_user", data),

  adminDeleteUser: (user_id: number) =>
    request("POST", "admin_delete_user", { user_id }),

  profileUpdate: (full_name: string, email: string, notification_email?: string) =>
    request("POST", "profile_update", { full_name, email, notification_email }),

  changePassword: (current_password: string, new_password: string) =>
    request("POST", "change_password", { current_password, new_password }),

  adminSetPassword: (user_id: number, password: string) =>
    request("POST", "admin_set_password", { user_id, password }),

  adminUpdateRep: (user_id: number, is_representative: boolean, rep_permissions: string[]) =>
    request("POST", "admin_update_rep", { user_id, is_representative, rep_permissions }),

  adminPayments: () => request("GET", "admin_payments"),

  adminBodyZones: () => request("GET", "admin_body_zones"),

  adminBodyZoneSave: (data: object) =>
    request("POST", "admin_body_zone_save", data),

  adminTechniqueSave: (data: object) =>
    request("POST", "admin_technique_save", data),

  // Mindset
  mindsetSave: (data: { igp: number; indexes: object; type_title: string; answers: object }) =>
    request("POST", "mindset_save", data),

  mindsetHistory: () => request("GET", "mindset_history"),

  // Barriers
  barriersSave: (data: { iib: number; indexes: object; type_title: string; answers: object }) =>
    request("POST", "barriers_save", data),

  barriersHistory: () => request("GET", "barriers_history"),

  // Finance
  financeSave: (data: { ifr: number; indexes: object; summary: object; data: object }) =>
    request("POST", "finance_save", data),

  financeHistory: () => request("GET", "finance_history"),

  // Profile
  profileSave: (data: { ifl: number; ifu: number; type_title: string; indexes: object; answers: object }) =>
    request("POST", "profile_save", data),

  profileHistory: () => request("GET", "profile_history"),

  // Salon
  salonSave: (data: { ips: number; ipp_loss: number; type_title: string; indexes: object; hidden_money: number; answers: object; numeric: object }) =>
    request("POST", "salon_save", data),

  salonHistory: () => request("GET", "salon_history"),

  // Удаление истории
  mindsetDelete: () => request("POST", "mindset_delete"),
  barriersDelete: () => request("POST", "barriers_delete"),
  financeDelete: () => request("POST", "finance_delete"),
  profileDelete: () => request("POST", "profile_delete"),
  salonDelete: () => request("POST", "salon_delete"),

  // Диагностика
  diagSymptoms: () => request("GET", "diag_symptoms"),
  diagSearch: (q: string) => request("GET", "diag_search", undefined, `&q=${encodeURIComponent(q)}`),
  diagSearchBySlug: (slug: string) => request("GET", "diag_search", undefined, `&slug=${encodeURIComponent(slug)}`),
  diagSearchByZone: (zone: string) => request("GET", "diag_search", undefined, `&zone=${encodeURIComponent(zone)}`),

  // Мышление специалиста
  msCategories: () => request("GET", "ms_categories"),
  msAnalyze: (answers: Record<number, number>) => request("POST", "ms_analyze", { answers }),

  // Профиль салона
  salonProfileGet: () => request("GET", "salon_profile"),
  salonProfileSave: (data: object) => request("POST", "salon_profile_save", data),
  salonLogoUpload: (file_base64: string, file_name: string) =>
    request("POST", "salon_logo_upload", { file_base64, file_name }),
};