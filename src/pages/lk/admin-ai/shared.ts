export const AI_URL = "https://functions.poehali.dev/db81ea19-4426-448e-b956-d895d8dc266c";
export const ADMIN_TOKEN = "Sss07011974ssS";
export const STORAGE_KEY = "admin_ai_pro_history";

export interface Message {
  role: "user" | "assistant";
  content: string;
  roleId?: string;
}

export type RoleId = "marketer" | "blogger" | "financier" | "philosopher" | "programmer" | "businessman" | "psychologist" | "screenwriter" | "politician" | "lawyer";
export type ModelId = "gpt-4.1" | "terra";

export interface ModelOption {
  id: ModelId;
  label: string;
  hint: string;
}

export const MODELS: ModelOption[] = [
  { id: "gpt-4.1", label: "GPT-4.1", hint: "Стабильная модель по умолчанию" },
  { id: "terra",   label: "Terra",   hint: "Альтернативная модель Polza AI" },
];

export interface Role {
  id: RoleId;
  label: string;
  icon: string;
  color: string;
  bg: string;
  hint: string;
}

export const ROLES: Role[] = [
  { id: "marketer",      label: "Маркетолог",   icon: "Target",       color: "hsl(220,80%,50%)", bg: "hsl(220,80%,95%)", hint: "Стратегии, воронки, реклама, УТП" },
  { id: "blogger",       label: "Блогер",        icon: "Sparkles",     color: "hsl(335,80%,50%)", bg: "hsl(335,80%,96%)", hint: "Контент, посты, сценарии, охваты" },
  { id: "financier",     label: "Финансист",     icon: "TrendingUp",   color: "hsl(145,60%,38%)", bg: "hsl(145,60%,94%)", hint: "P&L, инвестиции, юнит-экономика" },
  { id: "philosopher",   label: "Философ",       icon: "Brain",        color: "hsl(270,60%,52%)", bg: "hsl(270,60%,95%)", hint: "Смыслы, этика, стратегическое мышление" },
  { id: "programmer",    label: "Программист",   icon: "Code2",        color: "hsl(185,85%,32%)", bg: "hsl(185,85%,93%)", hint: "Код, архитектура, алгоритмы, AI" },
  { id: "businessman",   label: "Бизнесмен",     icon: "Briefcase",    color: "hsl(25,90%,45%)",  bg: "hsl(25,90%,94%)",  hint: "Рост, переговоры, команда, стратегия" },
  { id: "psychologist",  label: "Психолог",      icon: "HeartHandshake", color: "hsl(350,65%,48%)", bg: "hsl(350,65%,95%)", hint: "Поведение, мотивация, эмоции, отношения" },
  { id: "screenwriter",  label: "Сценарист",     icon: "Film",         color: "hsl(45,90%,40%)",  bg: "hsl(45,90%,94%)",  hint: "Сценарии, истории, драматургия, видео" },
  { id: "politician",    label: "Политик",       icon: "Landmark",     color: "hsl(200,70%,38%)", bg: "hsl(200,70%,94%)", hint: "Стратегия, влияние, переговоры, риторика" },
  { id: "lawyer",        label: "Юрист",         icon: "Scale",        color: "hsl(240,50%,45%)", bg: "hsl(240,50%,95%)", hint: "Право, договоры, риски, защита интересов" },
];

export function stripMarkdown(text: string): string {
  return text
    .replace(/^#{1,6}\s+/gm, "")
    .replace(/\*\*(.+?)\*\*/g, "$1")
    .replace(/\*(.+?)\*/g, "$1")
    .replace(/_{1,2}(.+?)_{1,2}/g, "$1")
    .replace(/`{3}[\s\S]*?`{3}/g, (m) => m.replace(/```\w*\n?/g, "").trim())
    .replace(/`(.+?)`/g, "$1")
    .replace(/^\s*[-*+]\s+/gm, "• ")
    .replace(/^\s*\d+\.\s+/gm, (m) => m)
    .replace(/^\s*>\s+/gm, "")
    .replace(/\[(.+?)\]\(.+?\)/g, "$1")
    .replace(/---+/g, "—")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

export function copyToClipboard(text: string, setCopied: (v: boolean) => void) {
  navigator.clipboard.writeText(stripMarkdown(text)).then(() => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  });
}

// Находит первую markdown-таблицу в ответе (| ячейка | ячейка |) и превращает её в строки для CSV.
// Возвращает null, если в тексте таблицы нет — тогда кнопка «Скачать таблицу» не показывается.
export function extractMarkdownTable(text: string): string[][] | null {
  const lines = text.split("\n").map(l => l.trim()).filter(l => l.startsWith("|") && l.endsWith("|"));
  if (lines.length < 2) return null;
  const rows = lines
    .filter(l => !/^\|[\s:|-]+\|$/.test(l)) // выкидываем строку-разделитель |---|---|
    .map(l => l.slice(1, -1).split("|").map(c => c.trim()));
  return rows.length >= 2 ? rows : null;
}

export function downloadCsv(rows: string[][]) {
  const esc = (cell: string) => `"${cell.replace(/"/g, '""')}"`;
  const csv = "\uFEFF" + rows.map(r => r.map(esc).join(";")).join("\r\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `таблица-${Date.now()}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}
