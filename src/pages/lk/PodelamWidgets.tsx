import { useState } from "react";
import Icon from "@/components/ui/icon";
import { ACCENT, ACCENT_DARK, StatsData, fmt } from "./podelamShared";

// ── Карточка «Доход за сегодня» ──────────────────────────────────────────────
export function DailyIncomeCard({ savedAmount, onSave }: { savedAmount: number | null | undefined; onSave: (amount: number) => Promise<void> }) {
  const [value, setValue] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const submit = async () => {
    const amount = Number(value);
    if (value.trim() === "" || Number.isNaN(amount) || amount <= 0) return;
    setSaving(true);
    try {
      await onSave(amount);
      setValue("");
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #E8ECF0", padding: "20px 24px", marginBottom: 20, boxShadow: "0 1px 3px rgba(15,23,42,0.04)" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8, marginBottom: 12, flexWrap: "wrap" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <Icon name="Wallet" size={16} style={{ color: ACCENT }} />
          <span style={{ fontSize: 12, fontWeight: 700, color: ACCENT, textTransform: "uppercase", letterSpacing: 1 }}>Доход за сегодня</span>
        </div>
        {savedAmount != null && savedAmount > 0 && (
          <div style={{ fontSize: 15, fontWeight: 700, color: "#0F172A" }}>Уже указано: {fmt(savedAmount)} ₽</div>
        )}
      </div>
      <div style={{ fontSize: 13, color: "#64748B", marginBottom: 14, lineHeight: 1.6 }}>
        Добавляйте суммы по мере поступления оплат — они прибавляются к уже указанным за сегодня и учитываются в статистике ниже (факт vs потенциал).
      </div>
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
        <div style={{ position: "relative", flex: "1 1 180px" }}>
          <input
            type="number"
            min={0}
            value={value}
            onChange={e => setValue(e.target.value)}
            onKeyDown={e => { if (e.key === "Enter") submit(); }}
            placeholder="0"
            style={{ width: "100%", padding: "11px 40px 11px 14px", borderRadius: 10, border: "1.5px solid #E2E8F0", fontSize: 15, fontWeight: 600, fontFamily: "Montserrat,sans-serif", color: "#0F172A", outline: "none", boxSizing: "border-box" }}
          />
          <span style={{ position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)", fontSize: 14, color: "#94A3B8", fontWeight: 600 }}>₽</span>
        </div>
        <button
          onClick={submit}
          disabled={saving || value.trim() === ""}
          style={{
            padding: "11px 22px", borderRadius: 10, border: "none",
            background: saved ? "hsl(145,60%,40%)" : `linear-gradient(135deg,${ACCENT},${ACCENT_DARK})`,
            color: "#fff", fontSize: 13, fontWeight: 700, cursor: saving || value.trim() === "" ? "default" : "pointer",
            fontFamily: "Montserrat,sans-serif", opacity: saving ? 0.7 : 1, whiteSpace: "nowrap",
            display: "flex", alignItems: "center", gap: 6,
          }}
        >
          {saved ? <><Icon name="Check" size={15} /> Добавлено</> : saving ? "Сохраняю…" : "Добавить"}
        </button>
      </div>
    </div>
  );
}

// ── Раздел статистики за неделю/месяц ───────────────────────────────────────────
export function StatsSection({ stats }: { stats: StatsData | null }) {
  const [period, setPeriod] = useState<"week" | "month">("week");

  if (!stats) return null;
  const s = stats[period];
  const factPct = s.potential_total > 0 ? Math.min(100, Math.round((s.actual_total / s.potential_total) * 100)) : 0;

  return (
    <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #E8ECF0", padding: "20px 24px", marginBottom: 20, boxShadow: "0 1px 3px rgba(15,23,42,0.04)" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16, flexWrap: "wrap", gap: 10 }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: "#94A3B8", letterSpacing: 1.5, textTransform: "uppercase" }}>Статистика</div>
        <div style={{ display: "flex", gap: 4, background: "#F1F5F9", borderRadius: 10, padding: 3 }}>
          {(["week", "month"] as const).map(p => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              style={{
                fontSize: 12, fontWeight: 600, padding: "6px 14px", borderRadius: 8, border: "none", cursor: "pointer",
                fontFamily: "Montserrat,sans-serif",
                background: period === p ? "#fff" : "transparent",
                color: period === p ? ACCENT : "#64748B",
                boxShadow: period === p ? "0 1px 3px rgba(15,23,42,0.08)" : "none",
              }}
            >
              {p === "week" ? "Неделя" : "Месяц"}
            </button>
          ))}
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(140px,1fr))", gap: 16, marginBottom: 18 }}>
        <div>
          <div style={{ fontSize: 11, color: "#94A3B8", marginBottom: 4, textTransform: "uppercase", letterSpacing: 0.5 }}>Дел выполнено</div>
          <div style={{ fontSize: 22, fontWeight: 700, color: "#0F172A" }}>{s.done_tasks} <span style={{ fontSize: 14, fontWeight: 500, color: "#94A3B8" }}>из {s.total_tasks}</span></div>
        </div>
        <div>
          <div style={{ fontSize: 11, color: "#94A3B8", marginBottom: 4, textTransform: "uppercase", letterSpacing: 0.5 }}>Выполнено</div>
          <div style={{ fontSize: 22, fontWeight: 700, color: ACCENT }}>{s.completion_rate}%</div>
        </div>
        <div>
          <div style={{ fontSize: 11, color: "#94A3B8", marginBottom: 4, textTransform: "uppercase", letterSpacing: 0.5 }}>Потенциал</div>
          <div style={{ fontSize: 22, fontWeight: 700, color: "#0F172A" }}>{fmt(s.potential_total)} ₽</div>
        </div>
        <div>
          <div style={{ fontSize: 11, color: "#94A3B8", marginBottom: 4, textTransform: "uppercase", letterSpacing: 0.5 }}>Получено факт.</div>
          <div style={{ fontSize: 22, fontWeight: 700, color: "hsl(145,60%,35%)" }}>{fmt(s.actual_total)} ₽</div>
        </div>
      </div>

      <div style={{ height: 8, borderRadius: 4, background: "#F1F5F9", overflow: "hidden", marginBottom: 6 }}>
        <div style={{ height: "100%", width: `${factPct}%`, borderRadius: 4, background: "linear-gradient(90deg,hsl(145,60%,45%),hsl(145,60%,38%))" }} />
      </div>
      <div style={{ fontSize: 11, color: "#94A3B8" }}>
        {s.actual_total > 0
          ? `Факт составляет ${factPct}% от потенциала за этот период`
          : "Фактические суммы появятся, когда вы укажете доход за сегодня в блоке выше"}
      </div>
    </div>
  );
}