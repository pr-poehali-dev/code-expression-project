export const ACCENT = "hsl(185,85%,32%)";
export const ACCENT_DARK = "hsl(185,85%,24%)";

export const STORAGE_KEY = "demo_used_tools";
export const DEMO_NOTIFY_URL = "https://functions.poehali.dev/8b11165f-5062-4976-aad6-b3b544084195";

export function getUsedTools(): Record<string, string> {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
  } catch {
    return {};
  }
}

export function markToolUsed(id: string, email: string) {
  const used = getUsedTools();
  used[id] = email;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(used));
}

export type ActiveTool = "barriers" | "mindset-spec" | null;

export const TOOLS = [
  {
    id: "barriers",
    icon: "Shield",
    color: "hsl(20,85%,52%)",
    colorBg: "hsl(20,85%,96%)",
    title: "Внутренние барьеры",
    desc: "Выяви психологические блоки, мешающие профессиональному росту",
    free: true,
  },
  {
    id: "mindset-spec",
    icon: "Brain",
    color: "hsl(260,70%,52%)",
    colorBg: "hsl(260,70%,97%)",
    title: "Развитие специалиста",
    desc: "Клиенты, позиционирование, личный бренд, практика — персональный AI-план",
    free: true,
  },
  {
    id: "diag",
    icon: "Stethoscope",
    color: "hsl(210,85%,45%)",
    colorBg: "hsl(210,85%,96%)",
    title: "Системная диагностика клиента",
    desc: "Жалоба → причины, компенсации, красные флаги и техники из шпаргалки",
    free: false,
  },
  {
    id: "mindset",
    icon: "MessageCircle",
    color: "hsl(280,60%,55%)",
    colorBg: "hsl(280,60%,96%)",
    title: "Мышление с премиум-клиентами",
    desc: "Тест + персональные советы по общению с клиентами высокого сегмента",
    free: false,
  },
  {
    id: "finance",
    icon: "TrendingUp",
    color: "hsl(145,60%,40%)",
    colorBg: "hsl(145,60%,95%)",
    title: "Финансовая грамотность",
    desc: "Проверь и прокачай знания в управлении доходом специалиста",
    free: false,
  },
  {
    id: "profile",
    icon: "ScanFace",
    color: "hsl(240,70%,55%)",
    colorBg: "hsl(240,70%,97%)",
    title: "Финансовый профиль PRO",
    desc: "Определи уровень финансового мышления, привычек и зрелости",
    free: false,
  },
  {
    id: "salon",
    icon: "Scissors",
    color: "hsl(335,80%,50%)",
    colorBg: "hsl(335,80%,97%)",
    title: "Диагностика роста салона PRO",
    desc: "Где салон теряет деньги — и как увеличить прибыль без нового потока",
    free: false,
  },
  {
    id: "body",
    icon: "User",
    color: ACCENT,
    colorBg: "hsl(185,85%,96%)",
    title: "Шпаргалка по телу",
    desc: "Кликни на зону тела → диагностика, техники и видео",
    free: false,
  },
];
