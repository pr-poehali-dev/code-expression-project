// Точка входа сайдбара личного кабинета — реэкспортирует компоненты,
// декомпозированные на отдельные файлы:
// - LkPwaInstall.tsx    — установка PWA (хуки, модалка, кнопки)
// - LkSidebarShared.tsx — общие хуки/виджеты (напоминание «ПоДелам», баланс энергии)
// - LkSidebarDesktop.tsx — боковой сайдбар (десктоп)
// - LkSidebarMobile.tsx  — мобильный хедер и нижняя панель навигации
export { PodelamReminderBanner, EnergyBadge } from "./LkSidebarShared";
export { LkSidebar } from "./LkSidebarDesktop";
export { LkMobileHeader, LkBottomBar } from "./LkSidebarMobile";
