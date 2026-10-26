import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { captureRefFromUrl } from "@/lib/referralLink";

export default function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  useEffect(() => {
    let link = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!link) {
      link = document.createElement("link");
      link.rel = "canonical";
      document.head.appendChild(link);
    }
    if (link.dataset.pageSet) return;
    const path = pathname.length > 1 ? pathname.replace(/\/+$/, "") : pathname;
    link.setAttribute("href", `https://promtdialog.ru${path === "/" ? "/" : path}`);
  }, [pathname]);
  // Ловим реферальный код (?ref=CODE) на любой странице сайта — не только на /cabinet,
  // так как ссылку могут расшарить на лендинг или конкретный инструмент.
  useEffect(() => { captureRefFromUrl(); }, []);
  return null;
}