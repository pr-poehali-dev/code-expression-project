import { ViewTest, HistoryItem, ChatEntry } from "./types";

const URL_BASE = "https://functions.poehali.dev/41dd82e5-6503-400c-84aa-7999072fd763";

function sid() {
  return localStorage.getItem("lk_session") || "";
}

async function call(method: string, action: string, body?: object, extra = "") {
  const res = await fetch(`${URL_BASE}?action=${action}${extra}`, {
    method,
    headers: { "Content-Type": "application/json", "X-Session-Id": sid() },
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await res.json().catch(() => ({}));
  if (res.status === 402) {
    const msg = data.error || "Недостаточно энергии";
    import("@/components/EnergyGate").then(m => m.showEnergyGate({ message: msg }));
    throw new Error(msg);
  }
  if (!res.ok) throw new Error(data.error || "Ошибка сервера");
  return data;
}

export const clientViewApi = {
  analyze: (payload: {
    subject: string; goal: string; material: string; city: string; audience: string; parent_id?: number | null;
  }): Promise<ViewTest> => call("POST", "analyze", payload),
  ask: (test_id: number, client_index: number, question: string): Promise<ChatEntry> =>
    call("POST", "ask", { test_id, client_index, question }),
  list: (): Promise<{ items: HistoryItem[] }> => call("GET", "list"),
  get: (id: number): Promise<ViewTest> => call("GET", "get", undefined, `&id=${id}`),
  saveNote: (test_id: number, note: string) => call("POST", "note", { test_id, note }),
};
