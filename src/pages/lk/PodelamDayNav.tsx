import Icon from "@/components/ui/icon";
import { ACCENT, ACCENT_DARK, BatchDay } from "./podelamShared";

function formatDay(iso: string) {
  const d = new Date(iso + "T00:00:00");
  return d.toLocaleDateString("ru", { day: "numeric", month: "short" });
}

// ── Переключатель дней плана (14 дней пачки) — клик по дню переключает план БЕЗ обращения
// к ИИ, просто читает уже сохранённый день (см. action=podelam_get?date=...) ──────────────
export function PodelamDayNav({ days, activeDate, onSelect }: { days: BatchDay[]; activeDate: string; onSelect: (date: string) => void }) {
  if (days.length <= 1) return null;

  return (
    <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #E8ECF0", padding: "14px 16px", marginBottom: 20, boxShadow: "0 1px 3px rgba(15,23,42,0.04)" }}>
      <div style={{ fontSize: 11, fontWeight: 700, color: "#94A3B8", letterSpacing: 1, textTransform: "uppercase", marginBottom: 10 }}>
        План на 2 недели
      </div>
      <div style={{ display: "flex", gap: 8, overflowX: "auto", paddingBottom: 4 }} className="podelam-day-nav-scroll">
        {days.map(d => {
          const active = d.plan_date === activeDate;
          const allDone = d.total_tasks > 0 && d.done_tasks === d.total_tasks;
          return (
            <button
              key={d.plan_date}
              onClick={() => onSelect(d.plan_date)}
              style={{
                flexShrink: 0, minWidth: 68, padding: "8px 10px", borderRadius: 10, cursor: "pointer",
                border: `1.5px solid ${active ? ACCENT : "#E2E8F0"}`,
                background: active ? `linear-gradient(135deg,${ACCENT},${ACCENT_DARK})` : "#fff",
                display: "flex", flexDirection: "column", alignItems: "center", gap: 3,
                fontFamily: "Montserrat,sans-serif",
              }}
            >
              <span style={{ fontSize: 10, fontWeight: 700, color: active ? "rgba(255,255,255,0.75)" : "#94A3B8", textTransform: "uppercase" }}>
                {d.is_today ? "Сегодня" : formatDay(d.plan_date)}
              </span>
              {allDone ? (
                <Icon name="CheckCircle2" size={15} style={{ color: active ? "#fff" : "hsl(145,60%,45%)" }} />
              ) : (
                <span style={{ fontSize: 12, fontWeight: 700, color: active ? "#fff" : "#0F172A" }}>
                  {d.done_tasks}/{d.total_tasks}
                </span>
              )}
            </button>
          );
        })}
      </div>
      <style>{`
        .podelam-day-nav-scroll::-webkit-scrollbar { height: 4px; }
        .podelam-day-nav-scroll::-webkit-scrollbar-thumb { background: #E2E8F0; border-radius: 2px; }
      `}</style>
    </div>
  );
}
