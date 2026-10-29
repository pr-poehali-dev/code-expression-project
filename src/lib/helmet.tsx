import type { ReactNode } from "react";

// Мета-теги страниц теперь задаются в head() маршрутов (src/routes/*) и
// отдаются сервером. Компонент оставлен пустым, чтобы старая разметка страниц
// не дублировала теги в браузере.
export function HelmetProvider({ children }: { children: ReactNode }) {
  return <>{children}</>;
}

export function Helmet(_props: { children?: ReactNode }) {
  return null;
}
