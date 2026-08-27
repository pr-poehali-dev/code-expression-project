export const ACCENT = "hsl(185,85%,32%)";
export const ACCENT_DARK = "hsl(185,85%,24%)";
export const TEAL_BRIGHT = "#2DD4BF";
export const BG = "#F4F6F8";

export type Tab =
  | "home" | "tools" | "academy" | "ai" | "shop"
  | "employees" | "purchases" | "profile" | "salon"
  | "admin" | "support" | "more" | "clientmsg" | "marketing"
  | "championship" | "blog" | "packages";

// Чемпионат временно отключён (не проводится) — вкладка убрана из меню, чтобы cron-функция
// не расходовала вычислительное время впустую. Чтобы вернуть, добавить "championship" обратно
// в нужные роли ниже и в MOBILE_PRIMARY.
export const ROLE_TABS: Record<string, Tab[]> = {
  owner:          ["home", "packages", "tools", "academy", "ai", "clientmsg", "marketing", "shop", "employees", "purchases", "salon", "blog", "profile", "support"],
  admin:          ["home", "packages", "tools", "academy", "ai", "clientmsg", "marketing", "blog", "profile", "support"],
  master:         ["home", "packages", "tools", "academy", "ai", "blog", "profile", "support"],
  body_specialist:["home", "packages", "tools", "academy", "ai", "blog", "profile", "support"],
  solo_master:    ["home", "packages", "tools", "academy", "clientmsg", "marketing", "shop", "purchases", "blog", "profile", "support"],
};

export function getAllowedTabs(role: string, isAdmin: boolean): Tab[] {
  const effectiveRole = isAdmin ? "owner" : role;
  const tabs = ROLE_TABS[effectiveRole] || ROLE_TABS["body_specialist"];
  if (isAdmin) return [...new Set([...tabs, "admin" as Tab])];
  return tabs;
}

export const MOBILE_PRIMARY: Record<string, Tab[]> = {
  owner:          ["home", "marketing", "academy", "employees"],
  admin:          ["home", "marketing", "academy", "profile"],
  master:         ["home", "tools", "ai", "profile"],
  body_specialist:["home", "tools", "ai", "profile"],
  solo_master:    ["home", "marketing", "academy", "profile"],
};

export const NAV_ITEMS: { id: Tab; icon: string; label: string; badge?: string; highlight?: boolean; external?: string }[] = [
  { id: "home",      icon: "Compass",        label: "ПоДелам",            highlight: true },
  { id: "packages",  icon: "Rocket",         label: "Пакеты развития"     },
  { id: "marketing", icon: "BarChart3",      label: "Маркетинг"           },
  { id: "ai",        icon: "Sparkles",       label: "Развитие салона"     },
  { id: "clientmsg", icon: "MessageSquare",  label: "Сообщения клиентам"  },
  { id: "employees", icon: "Users",          label: "Сотрудники"          },
  { id: "academy",   icon: "GraduationCap",  label: "Академия"            },
  { id: "tools",     icon: "Wrench",         label: "Развитие персонала"  },
  { id: "salon",         icon: "Building2",      label: "Моя компания"        },
  { id: "championship",  icon: "Trophy",         label: "Чемпионат"           },
  { id: "blog",      icon: "Newspaper",      label: "Блог",                external: "/blog" },
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

export const SPECIALIZATION_LABELS: Record<string, string> = {
  psychologist: "Психолог",
  body_psychologist: "Телесный психолог",
};

// Психолог/телесный психолог технически имеют role="solo_master" (та же логика вкладок и прав),
// но с заполненным specialization — показываем более точный лейбл там, где виден "Мастер".
export function getRoleLabel(role: string, specialization?: string | null): string {
  if (specialization && SPECIALIZATION_LABELS[specialization]) return SPECIALIZATION_LABELS[specialization];
  return ROLE_LABELS[role] || "Специалист";
}