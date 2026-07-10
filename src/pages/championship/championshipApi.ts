import func2url from "../../../backend/func2url.json";

export const CHAMP_API_URL  = (func2url as Record<string, string>)["championship-api"]  || "";
export const CHAMP_VOTE_URL = (func2url as Record<string, string>)["championship-vote"] || "";

export async function champGet(action: string, params: Record<string, string> = {}, sessionId?: string) {
  const qs = new URLSearchParams({ action, ...params }).toString();
  const headers: Record<string, string> = {};
  if (sessionId) headers["X-Session-Id"] = sessionId;
  const res = await fetch(`${CHAMP_API_URL}?${qs}`, { headers });
  const text = await res.text();
  return JSON.parse(text);
}

export async function champPost(action: string, body: object, sessionId?: string) {
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (sessionId) headers["X-Session-Id"] = sessionId;
  const res = await fetch(`${CHAMP_API_URL}?action=${action}`, {
    method: "POST", headers, body: JSON.stringify(body),
  });
  const text = await res.text();
  return JSON.parse(text);
}

export async function votePost(action: string, body: object, sessionId?: string, fp?: string) {
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (sessionId) headers["X-Session-Id"] = sessionId;
  if (fp) headers["X-Voter-Fp"] = fp;
  const res = await fetch(`${CHAMP_VOTE_URL}?action=${action}`, {
    method: "POST", headers, body: JSON.stringify(body),
  });
  const text = await res.text();
  return JSON.parse(text);
}

export async function voteGet(action: string, params: Record<string, string> = {}, sessionId?: string, fp?: string) {
  const qs = new URLSearchParams({ action, ...params }).toString();
  const headers: Record<string, string> = {};
  if (sessionId) headers["X-Session-Id"] = sessionId;
  if (fp) headers["X-Voter-Fp"] = fp;
  const res = await fetch(`${CHAMP_VOTE_URL}?${qs}`, { headers });
  const text = await res.text();
  return JSON.parse(text);
}

export const LEVEL_LABELS: Record<string, string> = {
  newcomer:     "Новичок",
  participant:  "Участник",
  professional: "Профессионал",
  expert:       "Эксперт",
  premium:      "Премиум",
  legend:       "Легенда",
};

export const LEVEL_COLORS: Record<string, string> = {
  newcomer:     "#94a3b8",
  participant:  "#3b82f6",
  professional: "#8b5cf6",
  expert:       "#f59e0b",
  premium:      "#ec4899",
  legend:       "#f97316",
};

export const STATUS_LABELS: Record<string, string> = {
  draft:              "Черновик",
  announced:          "Анонс",
  registration:       "Регистрация",
  registration_closed:"Регистрация закрыта",
  active:             "Идёт приём работ",
  voting:             "Голосование",
  finished_pending:   "Подводятся итоги",
  finished:           "Завершён",
  cancelled:          "Отменён",
};

export const STATUS_COLORS: Record<string, string> = {
  announced:          "#3b82f6",
  registration:       "#10b981",
  registration_closed:"#f59e0b",
  active:             "#6366f1",
  voting:             "#f59e0b",
  finished_pending:   "#f97316",
  finished:           "#64748b",
  cancelled:          "#ef4444",
};