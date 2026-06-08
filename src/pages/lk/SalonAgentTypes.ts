export const AGENT_URL = "https://functions.poehali.dev/40feaf4c-2193-430d-98ae-16712a91feb4";
export const LK_URL = "https://functions.poehali.dev/1c0ad024-179b-4644-9621-377174bbeba3";
export const FREE_LIMIT = 10;
export const ENERGY_PER_MSG = 10;

export type AgentRole = "business" | "service" | "admin" | "marketer";

export interface AgentConfig {
  id: AgentRole;
  label: string;
  icon: string;
  color: string;
  bg: string;
  borderColor: string;
  hint: string;
  welcome: string;
}

export const AGENTS: AgentConfig[] = [
  { id: "business", label: "Бизнес-ассистент",  icon: "Briefcase",      color: "#1e40af", bg: "#eff6ff", borderColor: "#bfdbfe", hint: "Стратегия, финансы, управление командой", welcome: "Здравствуйте! Я ваш бизнес-ассистент.\n\nПомогу с финансовыми расчётами, стратегией развития, управлением командой и операционными вопросами. Что обсудим?" },
  { id: "service",  label: "Эксперт по сервису", icon: "HeartHandshake", color: "#065f46", bg: "#ecfdf5", borderColor: "#a7f3d0", hint: "Техники, работа с клиентами, протоколы",  welcome: "Добро пожаловать! Я эксперт по телесным практикам и сервису.\n\nРазберём любой клиентский случай, подберём технику, помогу с коммуникацией. Расскажите о задаче." },
  { id: "admin",    label: "Администратор",       icon: "PhoneCall",      color: "#92400e", bg: "#fffbeb", borderColor: "#fde68a", hint: "Скрипты, ответы клиентам, отзывы",        welcome: "Привет! Я помощник администратора.\n\nНапишу скрипт для звонка, ответ на отзыв или сообщение клиенту — готовое, чтобы сразу использовать. Что нужно?" },
  { id: "marketer", label: "Маркетолог",          icon: "Megaphone",      color: "#6d28d9", bg: "#f5f3ff", borderColor: "#ddd6fe", hint: "Контент, акции, продвижение, реклама",    welcome: "Привет! Я маркетолог вашего салона.\n\nПомогу с постами, акциями, настройкой рекламы и удержанием клиентов. С чего начнём?" },
];

export const PACKAGES = [
  { code: "start",    name: "Старт",   price: 990,  energy: 150,  msgs: 15  },
  { code: "business", name: "Бизнес",  price: 2990, energy: 550,  msgs: 55, popular: true },
  { code: "growth",   name: "Рост",    price: 4990, energy: 1200, msgs: 120 },
  { code: "premium",  name: "Премиум", price: 9990, energy: 3000, msgs: 300 },
];

export interface Message { role: "user" | "assistant"; content: string; }
export interface AttachedFile { name: string; text: string; batches?: string[]; totalRows?: number; batchSize?: number; }

export const TABLE_KEYWORDS = /таблиц|эксель|excel|xlsx|xls|csv|spreadsheet|строк|столбц|считай|посчит|расчёт|расчет|финанс|выруч|приход|расход|бюджет|зарплат|смен|график|расписани/i;

export function detectFormat(prevUserText: string): "csv" | "txt" {
  return TABLE_KEYWORDS.test(prevUserText) ? "csv" : "txt";
}

export function copyToClipboard(text: string, setCopied: (v: boolean) => void) {
  navigator.clipboard.writeText(text).then(() => { setCopied(true); setTimeout(() => setCopied(false), 2000); });
}

export function downloadFile(content: string, agentLabel: string, format: "csv" | "txt") {
  const date = new Date().toLocaleDateString("ru").replace(/\./g, "-");
  if (format === "csv") {
    const lines = content.split("\n");
    const csvLines: string[] = [];
    for (const line of lines) {
      if (line.includes("|")) {
        const cells = line.split("|").map(c => c.trim()).filter((c, i, arr) => i > 0 && i < arr.length - 1);
        if (cells.length > 1 && !cells.every(c => /^[-:]+$/.test(c))) {
          csvLines.push(cells.map(c => `"${c.replace(/"/g, '""')}"`).join(";"));
        }
      }
    }
    const csvContent = csvLines.length > 0 ? csvLines.join("\n") : content;
    const blob = new Blob(["\uFEFF" + csvContent], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${agentLabel}_${date}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  } else {
    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${agentLabel}_${date}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  }
}
