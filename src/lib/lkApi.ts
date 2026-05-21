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
  if (!res.ok) throw new Error(data.error || "Ошибка сервера");
  return data;
}

export const lkApi = {
  login: (username: string, password: string) =>
    request("POST", "login", { username, password }),

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

  // Админка
  adminUsers: () => request("GET", "admin_users"),

  adminCreateUser: (data: object) =>
    request("POST", "admin_create_user", data),

  adminUpdateUser: (data: object) =>
    request("POST", "admin_update_user", data),

  adminSetPassword: (user_id: number, password: string) =>
    request("POST", "admin_set_password", { user_id, password }),

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
};