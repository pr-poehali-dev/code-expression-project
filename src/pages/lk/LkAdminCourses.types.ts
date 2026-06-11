export const API = "https://functions.poehali.dev/3e9572e2-e118-4584-91dd-809cac9fc3ea";

export function sid() { return localStorage.getItem("lk_session") || ""; }

export function apiFetch(action: string, method = "GET", body?: object) {
  return fetch(`${API}?action=${action}`, {
    method,
    headers: { "Content-Type": "application/json", "X-Session-Id": sid() },
    body: body ? JSON.stringify(body) : undefined,
  }).then(r => r.json());
}

export interface Course {
  id: number; title: string; description: string; cover_url: string;
  trailer_url?: string;
  category: string; is_published: boolean; sort_order: number;
  access_cost: number; lesson_cost: number;
  modules_count?: number; lessons_count?: number;
}

export interface Module { id: number; course_id: number; title: string; sort_order: number; lessons?: Lesson[]; }

export interface Lesson {
  id: number; module_id: number; course_id: number; title: string;
  content: string; video_urls: string[]; links: string[];
  ai_context: string; homework: string; sort_order: number;
  files?: LFile[]; photos?: Photo[]; tools?: string[];
}

export interface LFile { id: number; name: string; url: string; }
export interface Photo { id: number; url: string; sort_order: number; }

export type Screen = "list" | "course" | "lesson";