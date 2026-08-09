export const AGENT_URL = "https://functions.poehali.dev/40feaf4c-2193-430d-98ae-16712a91feb4";
export const LK_URL = "https://functions.poehali.dev/1c0ad024-179b-4644-9621-377174bbeba3";
export const FREE_LIMIT = 10;
export const ENERGY_PER_MSG = 10;

export type ChatMode = "salon" | "free";

export interface ChatModeConfig { id: ChatMode; label: string; icon: string; hint: string; }

export const CHAT_MODES: ChatModeConfig[] = [
  { id: "salon", label: "По салону",         icon: "Building2",    hint: "Ответы с учётом данных вашего салона" },
  { id: "free",  label: "Свободное общение",  icon: "MessageCircle", hint: "Общение на любые темы в рамках экспертизы агента" },
];

export interface AgentConfig {
  label: string;
  icon: string;
  color: string;
  bg: string;
  borderColor: string;
  hint: string;
  welcome: string;
}

// Единый ИИ-агент — совмещает экспертизу бизнес-ассистента, эксперта по сервису,
// администратора и маркетолога. Сам определяет нужную роль по сути вопроса.
export const AGENT: AgentConfig = {
  label: "ИИ-агент салона",
  icon: "Sparkles",
  color: "#1e40af",
  bg: "#eff6ff",
  borderColor: "#bfdbfe",
  hint: "Стратегия, сервис, клиенты, маркетинг — всё в одном чате",
  welcome: "Здравствуйте! Я ваш персональный ИИ-агент.\n\nПомогу со стратегией и финансами, разбором клиентских случаев, скриптами для администратора, контентом и рекламой — спрашивайте о чём угодно, я сам разберусь, какая экспертиза нужна. Что обсудим?",
};

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