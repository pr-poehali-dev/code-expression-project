import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { captureRefFromUrl } from "@/lib/referralLink";

export default function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  // Ловим реферальный код (?ref=CODE) на любой странице сайта — не только на /cabinet,
  // так как ссылку могут расшарить на лендинг или конкретный инструмент.
  useEffect(() => { captureRefFromUrl(); }, []);
  return null;
}