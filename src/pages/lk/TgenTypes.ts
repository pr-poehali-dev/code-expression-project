export const GEN_URL = "https://functions.poehali.dev/d572afc5-ec2c-41fa-a73e-7a63c926d5c3";
export const ADMIN_TOKEN = "Sss07011974ssS";
export const LS = "tgen_v1";

export const TEAL = "hsl(185,85%,32%)";
export const DARK = "#1a1a1a";
export const GRAY = "#64748b";
export const SERIF = "Cormorant, serif";

export const CARD_STYLE: React.CSSProperties = {
  background: "#fff",
  borderRadius: 14,
  border: "1.5px solid #e8e8e4",
  padding: "24px 28px",
  marginBottom: 16,
};

export interface Chapter {
  num: number;
  title: string;
  summary: string;
}

export interface GeneratedChapter extends Chapter {
  text: string;
  images: string[];
  structure_used?: string;
}

export interface SavedState {
  tab: "input" | "chapters" | "result";
  scenarioText: string;
  fileName: string;
  chapters: Chapter[];
  generated: GeneratedChapter[];
  selectedNums: number[];
}

export function loadSaved(): SavedState | null {
  try {
    const raw = localStorage.getItem(LS);
    return raw ? (JSON.parse(raw) as SavedState) : null;
  } catch (_) {
    return null;
  }
}

export function save(state: SavedState) {
  try { localStorage.setItem(LS, JSON.stringify(state)); } catch (_) { /* ignore */ }
}

export function clearSaved() {
  try { localStorage.removeItem(LS); } catch (_) { /* ignore */ }
}

export async function apiFetch(action: string, extra: object = {}): Promise<Record<string, unknown>> {
  const res = await fetch(GEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json", "X-Admin-Token": ADMIN_TOKEN },
    body: JSON.stringify({ action, ...extra }),
  });
  return res.json();
}

export function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve((reader.result as string).split(",")[1]);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
