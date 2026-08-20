import { useState } from "react";
import Icon from "@/components/ui/icon";
import { ACCENT, ACCENT_DARK, StatsData, fmt } from "./podelamShared";

interface DailyIncomeCardProps {
  savedAmount: number | null | undefined;
  savedNewClients: number | null | undefined;
  savedReturnedClients: number | null | undefined;
  isToday: boolean;
  onSave: (amount: number, newClients: number | null, returnedClients: number | null) => Promise<void>;
}

// ── Карточка «Доход за день»: сумма + новые/вернувшиеся клиенты ─────────────
export function DailyIncomeCard({ savedAmount, savedNewClients, savedReturnedClients, isToday, onSave }: DailyIncomeCardProps) {
  const [value, setValue] = useState("");
  const [newClients, setNewClients] = useState("");
  const [returnedClients, setReturnedClients] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const submit = async () => {
    const amount = Number(value || 0);
    const nc = newClients.trim() === "" ? null : Number(newClients);
    const rc = returnedClients.trim() === "" ? null : Number(returnedClients);
    if ((value.trim() === "" || Number.isNaN(amount) || amount <= 0) && nc == null && rc == null) return;
    setSaving(true);
    try {
      await onSave(Number.isNaN(amount) ? 0 : amount, nc != null && !Number.isNaN(nc) ? nc : null, rc != null && !Number.isNaN(rc) ? rc : null);
      setValue(""); setNewClients(""); setReturnedClients("");
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } finally {
      setSaving(false);
    }
  };

  const inputStyle: React.CSSProperties = { width: "100%", padding: "11px 14px", borderRadius: 10, border: "1.5px solid #E2E8F0", fontSize: 14, fontWeight: 600, fontFamily: "Montserrat,sans-serif", color: "#0F172A", outline: "none", boxSizing: "border-box" };

  return (
    <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #E8ECF0", padding: "20px 24px", marginBottom: 20, boxShadow: "0 1px 3px rgba(15,23,42,0.04)" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8, marginBottom: 12, flexWrap: "wrap" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <Icon name="Wallet" size={16} style={{ color: ACCENT }} />
          <span style={{ fontSize: 12, fontWeight: 700, color: ACCENT, textTransform: "uppercase", letterSpacing: 1 }}>{isToday ? "Доход за сегодня" : "Доход за этот день"}</span>
        </div>
        {(savedAmount != null && savedAmount > 0) && (
          <div style={{ fontSize: 15, fontWeight: 700, color: "#0F172A" }}>Уже указано: {fmt(savedAmount)} ₽</div>
        )}
      </div>
      <div style={{ fontSize: 13, color: "#64748B", marginBottom: 14, lineHeight: 1.6 }}>
        Заполните итоги дня: сумму оплат, сколько пришло новых клиентов и сколько вернулось — данные складываются с уже указанными и видны в статистике ниже.
      </div>
      {(savedNewClients != null || savedReturnedClients != null) && (
        <div style={{ display: "flex", gap: 16, marginBottom: 12, fontSize: 12.5, color: "#475569" }}>
          {savedNewClients != null && <span>Новых клиентов: <b>{savedNewClients}</b></span>}
          {savedReturnedClients != null && <span>Вернулось: <b>{savedReturnedClients}</b></span>}
        </div>
      )}
      <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr 1fr", gap: 10 }} className="podelam-income-grid">
        <div style={{ position: "relative" }}>
          <input
            type="number" min={0} value={value}
            onChange={e => setValue(e.target.value)}
            onKeyDown={e => { if (e.key === "Enter") submit(); }}
            placeholder="Сумма, ₽"
            style={{ ...inputStyle, paddingRight: 32 }}
          />
          <span style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", fontSize: 13, color: "#94A3B8", fontWeight: 600 }}>₽</span>
        </div>
        <input
          type="number" min={0} value={newClients}
          onChange={e => setNewClients(e.target.value)}
          onKeyDown={e => { if (e.key === "Enter") submit(); }}
          placeholder="Новых клиентов"
          style={inputStyle}
        />
        <input
          type="number" min={0} value={returnedClients}
          onChange={e => setReturnedClients(e.target.value)}
          onKeyDown={e => { if (e.key === "Enter") submit(); }}
          placeholder="Вернулось"
          style={inputStyle}
        />
      </div>
      <button
        onClick={submit}
        disabled={saving}
        style={{
          marginTop: 10, padding: "11px 22px", borderRadius: 10, border: "none",
          background: saved ? "hsl(145,60%,40%)" : `linear-gradient(135deg,${ACCENT},${ACCENT_DARK})`,
          color: "#fff", fontSize: 13, fontWeight: 700, cursor: saving ? "default" : "pointer",
          fontFamily: "Montserrat,sans-serif", opacity: saving ? 0.7 : 1, whiteSpace: "nowrap",
          display: "flex", alignItems: "center", gap: 6,
        }}
      >
        {saved ? <><Icon name="Check" size={15} /> Сохранено</> : saving ? "Сохраняю…" : "Сохранить"}
      </button>
      <style>{`
        @media (max-width: 480px) {
          .podelam-income-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
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
        {(s.new_clients_total != null || s.returned_clients_total != null) && (
          <>
            <div>
              <div style={{ fontSize: 11, color: "#94A3B8", marginBottom: 4, textTransform: "uppercase", letterSpacing: 0.5 }}>Новых клиентов</div>
              <div style={{ fontSize: 22, fontWeight: 700, color: "#0F172A" }}>{s.new_clients_total ?? 0}</div>
            </div>
            <div>
              <div style={{ fontSize: 11, color: "#94A3B8", marginBottom: 4, textTransform: "uppercase", letterSpacing: 0.5 }}>Вернулось клиентов</div>
              <div style={{ fontSize: 22, fontWeight: 700, color: "#0F172A" }}>{s.returned_clients_total ?? 0}</div>
            </div>
          </>
        )}
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