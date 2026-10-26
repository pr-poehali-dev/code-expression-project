import func2url from "../../../backend/func2url.json";

const URL_ = (func2url as Record<string, string>)["partner-api"] || "";
const KEY = "partner_session";

const VIEW_KEY = "partner_view_session";

export const partnerSession = {
  get: () => sessionStorage.getItem(VIEW_KEY) || localStorage.getItem(KEY) || "",
  set: (v: string) => localStorage.setItem(KEY, v),
  clear: () => { sessionStorage.removeItem(VIEW_KEY); localStorage.removeItem(KEY); },
  isView: () => !!sessionStorage.getItem(VIEW_KEY),
  setView: (v: string) => sessionStorage.setItem(VIEW_KEY, v),
  clearView: () => sessionStorage.removeItem(VIEW_KEY),
};

export async function partnerRequest<T = any>(
  action: string,
  opts: { method?: "GET" | "POST"; body?: unknown; query?: Record<string, string | number>; session?: string } = {},
): Promise<T> {
  const q = new URLSearchParams({ action, ...Object.fromEntries(Object.entries(opts.query || {}).map(([k, v]) => [k, String(v)])) });
  const res = await fetch(`${URL_}?${q}`, {
    method: opts.method || (opts.body ? "POST" : "GET"),
    headers: { "Content-Type": "application/json", "X-Session-Id": opts.session ?? partnerSession.get() },
    body: opts.body ? JSON.stringify(opts.body) : undefined,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const e = new Error(data.error || "Что-то пошло не так. Попробуйте ещё раз") as Error & { status: number };
    e.status = res.status;
    throw e;
  }
  return data as T;
}
