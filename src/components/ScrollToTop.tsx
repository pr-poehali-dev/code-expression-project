import { useEffect } from "react";
import { useLocation } from "@/lib/router-compat";
import { captureRefFromUrl } from "@/lib/referralLink";

export default function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  // canonical теперь отдаётся сервером через head() корневого маршрута.
  // Ловим реферальный код (?ref=CODE) на любой странице сайта — не только на /cabinet,
  // так как ссылку могут расшарить на лендинг или конкретный инструмент.
  useEffect(() => { captureRefFromUrl(); }, []);
  return null;
}