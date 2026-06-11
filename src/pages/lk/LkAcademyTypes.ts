export const API = "https://functions.poehali.dev/3e9572e2-e118-4584-91dd-809cac9fc3ea";
export const ACCENT = "hsl(185,85%,32%)";
export const SERIF = "Cormorant, serif";

export function sid() { return localStorage.getItem("lk_session") || ""; }
export function apiFetch(action: string, method = "GET", body?: object) {
  return fetch(`${API}?action=${action}`, {
    method,
    headers: { "Content-Type": "application/json", "X-Session-Id": sid() },
    body: body ? JSON.stringify(body) : undefined,
  }).then(r => r.json());
}

export const HTML_MARKER = "<!--html-->";

export function isHtmlContent(text: string): boolean {
  return text.trimStart().startsWith(HTML_MARKER);
}

export function renderContent(text: string): string {
  if (isHtmlContent(text)) {
    return text.trimStart().slice(HTML_MARKER.length);
  }
  return renderMarkdown(text);
}

export function renderMarkdown(text: string): string {
  return text
    .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
    .replace(/^### (.+)$/gm, '<h3 style="font-size:16px;font-weight:700;margin:16px 0 6px;color:#1a1a1a">$1</h3>')
    .replace(/^## (.+)$/gm,  '<h2 style="font-size:18px;font-weight:700;margin:20px 0 8px;color:#1a1a1a">$1</h2>')
    .replace(/^# (.+)$/gm,   '<h1 style="font-size:22px;font-weight:700;margin:24px 0 10px;color:#1a1a1a">$1</h1>')
    .replace(/^---$/gm, '<hr style="border:none;border-top:1.5px solid #e8e8e4;margin:20px 0">')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g,     '<em>$1</em>')
    .replace(/~~(.+?)~~/g,     '<s>$1</s>')
    .replace(/^&gt; (.+)$/gm, '<blockquote style="border-left:3px solid hsl(185,85%,60%);margin:10px 0;padding:4px 14px;color:#555;font-style:italic">$1</blockquote>')
    .replace(/^\d+\. (.+)$/gm, '<li style="margin:3px 0">$1</li>')
    .replace(/^[-*] (.+)$/gm, '<li style="margin:3px 0">$1</li>')
    .replace(/(<li[^>]*>.*<\/li>\n?)+/g, m => `<ul style="margin:8px 0;padding-left:20px">${m}</ul>`)
    .replace(/\n\n/g, '</p><p style="margin:10px 0">')
    .replace(/\n/g, '<br>')
    .replace(/^(.+)$/, '<p style="margin:0">$1</p>');
}

export interface Course {
  id: number; title: string; description: string; cover_url: string;
  trailer_url?: string;
  access_cost: number; lesson_cost: number; has_access: boolean;
  modules: Module[];
}
export interface Module { id: number; title: string; sort_order: number; lessons: LessonMeta[]; }
export interface LessonMeta { id: number; title: string; is_opened: boolean; }
export interface LessonFull {
  id: number; title: string; content: string;
  video_urls: string[]; links: string[]; ai_context: string; homework: string;
  files: { id: number; name: string; url: string }[];
  photos: { id: number; url: string }[];
  tools: string[];
}
export interface ChatMessage { role: "user" | "assistant"; content: string; }