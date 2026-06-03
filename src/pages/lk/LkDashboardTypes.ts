export const ACCENT = "hsl(185,85%,32%)";
export const ACCENT_DARK = "hsl(185,85%,24%)";
export const TEAL_BRIGHT = "#2DD4BF";
export const BG = "#F4F6F8";

export type Tab =
  | "home" | "tools" | "academy" | "ai" | "shop"
  | "employees" | "purchases" | "profile" | "salon"
  | "admin" | "support" | "more" | "clientmsg" | "marketing";

export const ROLE_TABS: Record<string, Tab[]> = {
  owner:          ["home", "tools", "academy", "ai", "clientmsg", "marketing", "shop", "employees", "purchases", "salon", "profile", "support"],
  admin:          ["home", "tools", "academy", "ai", "clientmsg", "marketing", "profile", "support"],
  master:         ["home", "tools", "academy", "ai", "profile", "support"],
  body_specialist:["home", "tools", "academy", "ai", "profile", "support"],
};

export function getAllowedTabs(role: string, isAdmin: boolean): Tab[] {
  const effectiveRole = isAdmin ? "owner" : role;
  const tabs = ROLE_TABS[effectiveRole] || ROLE_TABS["body_specialist"];
  if (isAdmin) return [...new Set([...tabs, "admin" as Tab])];
  return tabs;
}

export const MOBILE_PRIMARY: Record<string, Tab[]> = {
  owner:          ["home", "ai", "employees", "salon"],
  admin:          ["home", "tools", "ai", "profile"],
  master:         ["home", "tools", "ai", "profile"],
  body_specialist:["home", "tools", "ai", "profile"],
};

export const NAV_ITEMS: { id: Tab; icon: string; label: string; badge?: string }[] = [
  { id: "home",      icon: "Home",           label: "Главная"             },
  { id: "tools",     icon: "Wrench",         label: "Инструменты"         },
  { id: "academy",   icon: "GraduationCap",  label: "Академия"            },
  { id: "ai",        icon: "Sparkles",       label: "ИИ-инструменты",     badge: "new" },
  { id: "clientmsg", icon: "MessageSquare",  label: "Сообщения клиентам", badge: "new" },
  { id: "marketing", icon: "BarChart3",      label: "Маркетинг",          badge: "new" },
  { id: "shop",      icon: "Zap",            label: "Энергия"             },
  { id: "employees", icon: "Users",          label: "Сотрудники"          },
  { id: "purchases", icon: "Receipt",        label: "Покупки"             },
  { id: "salon",     icon: "Building2",      label: "Мой салон"           },
  { id: "profile",   icon: "UserCircle",     label: "Профиль"             },
  { id: "support",   icon: "Headphones",     label: "Тех. поддержка"      },
  { id: "admin",     icon: "Settings",       label: "Админка"             },
];

export const SALON_REQUIRED: Tab[] = ["tools", "ai", "shop", "employees", "purchases", "marketing"];

export const ROLE_LABELS: Record<string, string> = {
  owner: "Владелец",
  admin: "Администратор",
  master: "Мастер красоты",
  body_specialist: "Специалист по телу",
};