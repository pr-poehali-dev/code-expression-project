export const ACCENT = "hsl(185,85%,32%)";
export const ACCENT_DARK = "hsl(185,85%,24%)";
export const TEAL_BRIGHT = "#2DD4BF";
export const BG = "#F4F6F8";

export type Tab =
  | "home" | "tools" | "academy" | "ai" | "shop"
  | "employees" | "purchases" | "profile" | "salon"
  | "admin" | "support" | "more" | "clientmsg" | "marketing"
  | "championship";

export const ROLE_TABS: Record<string, Tab[]> = {
  owner:          ["home", "tools", "academy", "ai", "clientmsg", "marketing", "shop", "employees", "purchases", "salon", "championship", "profile", "support"],
  admin:          ["home", "tools", "academy", "ai", "clientmsg", "marketing", "championship", "profile", "support"],
  master:         ["home", "tools", "academy", "ai", "profile", "support"],
  body_specialist:["home", "tools", "academy", "ai", "profile", "support"],
  solo_master:    ["home", "tools", "academy", "clientmsg", "marketing", "shop", "purchases", "championship", "profile", "support"],
};

export function getAllowedTabs(role: string, isAdmin: boolean): Tab[] {
  const effectiveRole = isAdmin ? "owner" : role;
  const tabs = ROLE_TABS[effectiveRole] || ROLE_TABS["body_specialist"];
  if (isAdmin) return [...new Set([...tabs, "admin" as Tab])];
  return tabs;
}

export const MOBILE_PRIMARY: Record<string, Tab[]> = {
  owner:          ["home", "marketing", "championship", "employees"],
  admin:          ["home", "marketing", "championship", "profile"],
  master:         ["home", "tools", "ai", "profile"],
  body_specialist:["home", "tools", "ai", "profile"],
  solo_master:    ["home", "marketing", "championship", "profile"],
};

export const NAV_ITEMS: { id: Tab; icon: string; label: string; badge?: string; highlight?: boolean }[] = [
  { id: "home",      icon: "Compass",        label: "ПоДелам",            highlight: true },
  { id: "marketing", icon: "BarChart3",      label: "Маркетинг"           },
  { id: "ai",        icon: "Sparkles",       label: "Развитие салона"     },
  { id: "clientmsg", icon: "MessageSquare",  label: "Сообщения клиентам"  },
  { id: "employees", icon: "Users",          label: "Сотрудники"          },
  { id: "academy",   icon: "GraduationCap",  label: "Академия"            },
  { id: "tools",     icon: "Wrench",         label: "Развитие персонала"  },
  { id: "salon",         icon: "Building2",      label: "Мой салон"           },
  { id: "championship",  icon: "Trophy",         label: "Чемпионат"           },
  { id: "purchases",     icon: "Receipt",        label: "Покупки"             },
  { id: "shop",      icon: "Zap",            label: "Энергия"             },
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
  solo_master: "Мастер",
};