import { useState, useEffect } from "react";
import { useEnergy } from "@/contexts/EnergyContext";
import Icon from "@/components/ui/icon";
import { ACCENT, ACCENT_DARK } from "./LkDashboardTypes";
import { isPodelamSeenToday, PODELAM_SEEN_EVENT } from "./podelamNotice";
import { getBlogSeenDate, BLOG_SEEN_EVENT } from "./blogNotice";
import func2url from "../../../backend/func2url.json";

const CONTENT_URL = (func2url as Record<string, string>)["masters-accrual"] || "";

// ── Хук: не открыт ли сегодня план «ПоДелам» ───────────────────────────────────
export function usePodelamUnseen() {
  const [unseen, setUnseen] = useState(() => !isPodelamSeenToday());

  useEffect(() => {
    const recheck = () => setUnseen(!isPodelamSeenToday());
    window.addEventListener(PODELAM_SEEN_EVENT, recheck);
    window.addEventListener("storage", recheck);
    document.addEventListener("visibilitychange", recheck);
    return () => {
      window.removeEventListener(PODELAM_SEEN_EVENT, recheck);
      window.removeEventListener("storage", recheck);
      document.removeEventListener("visibilitychange", recheck);
    };
  }, []);

  return unseen;
}

// ── Хук: есть ли новый пост в блоге, который пользователь ещё не видел ────────
export function useBlogUnseen(): [boolean, string] {
  const [latestDate, setLatestDate] = useState("");
  const [seenDate, setSeenDate] = useState(() => getBlogSeenDate());

  useEffect(() => {
    if (!CONTENT_URL) return;
    fetch(`${CONTENT_URL}?action=content_list&limit=1`)
      .then(r => r.json())
      .then(d => {
        const first = d?.posts?.[0];
        if (first?.post_date) setLatestDate(first.post_date);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    const recheck = () => setSeenDate(getBlogSeenDate());
    window.addEventListener(BLOG_SEEN_EVENT, recheck);
    window.addEventListener("storage", recheck);
    return () => {
      window.removeEventListener(BLOG_SEEN_EVENT, recheck);
      window.removeEventListener("storage", recheck);
    };
  }, []);

  return [!!latestDate && latestDate !== seenDate, latestDate];
}

// ── Хук: кол-во входящих запросов на тренинги (для владельца) ─────────────────
export function useRequestsCount(role: string) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (role !== "owner") return;
    const LK_URL = "https://functions.poehali.dev/1c0ad024-179b-4644-9621-377174bbeba3";
    const sid = () => localStorage.getItem("lk_session") || "";

    const load = () => {
      fetch(`${LK_URL}?action=course_requests_list`, { headers: { "X-Session-Id": sid() } })
        .then(r => r.json())
        .then(d => { if (Array.isArray(d?.requests)) setCount(d.requests.length); })
        .catch(() => {});
    };

    load();
    const interval = setInterval(load, 5 * 60_000);
    return () => clearInterval(interval);
  }, [role]);

  return count;
}

// ── Баннер-напоминание при входе: новый план «ПоДелам» ещё не открыт ──────────
export function PodelamReminderBanner({ onNav }: { onNav: (t: string) => void }) {
  const podelamUnseen = usePodelamUnseen();
  const [dismissed, setDismissed] = useState(false);

  if (!podelamUnseen || dismissed) return null;

  const close = () => setDismissed(true);
  const go = () => { close(); onNav("home"); };

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(15,23,42,0.5)", zIndex: 1500, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }} onClick={close}>
      <div onClick={e => e.stopPropagation()} style={{ background: "#fff", borderRadius: 20, maxWidth: 400, width: "100%", padding: 28, textAlign: "center", boxShadow: "0 20px 60px rgba(0,0,0,0.25)" }}>
        <div style={{ width: 56, height: 56, borderRadius: 16, background: `linear-gradient(135deg,${ACCENT},${ACCENT_DARK})`, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
          <Icon name="Compass" size={26} style={{ color: "#fff" }} />
        </div>
        <div style={{ fontSize: 18, fontWeight: 700, color: "#0F172A", marginBottom: 8 }}>Новый план на сегодня готов</div>
        <div style={{ fontSize: 13, color: "#64748B", lineHeight: 1.6, marginBottom: 22 }}>
          В разделе «ПоДелам» вас ждут свежие дела на день — ИИ пересчитал их с учётом вчерашних результатов.
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <button onClick={close} style={{ flex: 1, padding: "11px 0", borderRadius: 12, border: "1.5px solid #E2E8F0", background: "#fff", color: "#64748B", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "Montserrat,sans-serif" }}>
            Позже
          </button>
          <button onClick={go} style={{ flex: 1.4, padding: "11px 0", borderRadius: 12, border: "none", background: `linear-gradient(135deg,${ACCENT},${ACCENT_DARK})`, color: "#fff", fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "Montserrat,sans-serif" }}>
            Смотреть план
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Виджет баланса энергии ─────────────────────────────────────────────────────
export function EnergyBadge({ onNav, sidebar }: { onNav: (t: string) => void; sidebar?: boolean }) {
  const { balance } = useEnergy();
  const low   = balance < 50;
  const empty = balance === 0;
  const color = empty ? "hsl(0,85%,68%)"  : low ? "hsl(40,95%,60%)"  : "#2DD4BF";
  const bg    = empty ? "hsl(0,75%,97%)"  : low ? "hsl(40,90%,96%)"  : "hsl(185,85%,96%)";

  if (sidebar) return (
    <button onClick={() => onNav("shop")} style={{ width: "100%", display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", borderRadius: 10, border: `1px solid ${empty ? "rgba(248,113,113,0.3)" : low ? "rgba(251,191,36,0.3)" : "rgba(45,212,191,0.25)"}`, background: empty ? "rgba(248,113,113,0.08)" : low ? "rgba(251,191,36,0.08)" : "rgba(45,212,191,0.1)", cursor: "pointer", fontFamily: "Montserrat,sans-serif" }}>
      <span style={{ fontSize: 18 }}>⚡</span>
      <div style={{ flex: 1, textAlign: "left" }}>
        <div style={{ fontSize: 12, fontWeight: 700, color }}>{balance.toLocaleString()} энергий</div>
        <div style={{ fontSize: 10, color: "rgba(255,255,255,0.4)" }}>{empty ? "Пополните баланс" : low ? "Заканчивается" : "Баланс салона"}</div>
      </div>
    </button>
  );

  return (
    <button onClick={() => onNav("shop")} style={{ display: "flex", alignItems: "center", gap: 5, padding: "5px 10px", borderRadius: 8, border: `1.5px solid ${empty ? "rgba(248,113,113,0.35)" : low ? "rgba(251,191,36,0.35)" : "rgba(45,212,191,0.3)"}`, background: empty ? "rgba(248,113,113,0.1)" : low ? "rgba(251,191,36,0.1)" : "rgba(45,212,191,0.12)", cursor: "pointer", fontFamily: "Montserrat,sans-serif" }}>
      <span style={{ fontSize: 14 }}>⚡</span>
      <span style={{ fontSize: 12, fontWeight: 700, color }}>{balance}</span>
    </button>
  );
}