import { useState } from "react";
import Icon from "@/components/ui/icon";
import { ACCENT, ACCENT_DARK, StatsData, GoalProgress, fmt } from "./podelamShared";

interface DailyIncomeCardProps {
  savedAmount: number | null | undefined;
  savedNewClients: number | null | undefined;
  savedReturnedClients: number | null | undefined;
  onSave: (amount: number, newClients: number, returnedClients: number) => Promise<void>;
}

// ── Карточка «Доход за сегодня» — сумма + новые/вернувшиеся клиенты ─────────
export function DailyIncomeCard({ savedAmount, savedNewClients, savedReturnedClients, onSave }: DailyIncomeCardProps) {
  const [value, setValue] = useState("");
  const [newClients, setNewClients] = useState("");
  const [returnedClients, setReturnedClients] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const submit = async () => {
    const amount = Number(value || 0);
    const nc = Number(newClients || 0);
    const rc = Number(returnedClients || 0);
    const hasAmount = value.trim() !== "" && !Number.isNaN(amount) && amount > 0;
    const hasClients = (newClients.trim() !== "" && !Number.isNaN(nc) && nc > 0) || (returnedClients.trim() !== "" && !Number.isNaN(rc) && rc > 0);
    if (!hasAmount && !hasClients) return;
    setSaving(true);
    try {
      await onSave(hasAmount ? amount : 0, Number.isNaN(nc) ? 0 : nc, Number.isNaN(rc) ? 0 : rc);
      setValue(""); setNewClients(""); setReturnedClients("");
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } finally {
      setSaving(false);
    }
  };

  const inputStyle: React.CSSProperties = {
    width: "100%", padding: "11px 14px", borderRadius: 10, border: "1.5px solid #E2E8F0",
    fontSize: 14, fontWeight: 600, fontFamily: "Montserrat,sans-serif", color: "#0F172A", outline: "none", boxSizing: "border-box",
  };

  return (
    <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #E8ECF0", padding: "20px 24px", marginBottom: 20, boxShadow: "0 1px 3px rgba(15,23,42,0.04)" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12, flexWrap: "wrap" }}>
        <Icon name="Wallet" size={16} style={{ color: ACCENT }} />
        <span style={{ fontSize: 12, fontWeight: 700, color: ACCENT, textTransform: "uppercase", letterSpacing: 1 }}>Итоги дня</span>
      </div>
      <div style={{ fontSize: 13, color: "#64748B", marginBottom: 14, lineHeight: 1.6 }}>
        Укажите доход и сколько было новых/вернувшихся клиентов — данные прибавляются к уже указанным за сегодня и ИИ учитывает их при составлении завтрашнего плана.
      </div>

      {(savedAmount != null && savedAmount > 0) || savedNewClients || savedReturnedClients ? (
        <div style={{ display: "flex", gap: 16, flexWrap: "wrap", marginBottom: 14, padding: "10px 14px", background: "#F8FAFC", borderRadius: 10 }}>
          {savedAmount != null && savedAmount > 0 && (
            <div style={{ fontSize: 13, color: "#334155" }}>Доход: <b style={{ color: "#0F172A" }}>{fmt(savedAmount)} ₽</b></div>
          )}
          {!!savedNewClients && (
            <div style={{ fontSize: 13, color: "#334155" }}>Новых клиентов: <b style={{ color: "#0F172A" }}>{savedNewClients}</b></div>
          )}
          {!!savedReturnedClients && (
            <div style={{ fontSize: 13, color: "#334155" }}>Вернулось: <b style={{ color: "#0F172A" }}>{savedReturnedClients}</b></div>
          )}
        </div>
      ) : null}

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 10, marginBottom: 10 }} className="podelam-income-grid">
        <div>
          <label style={{ fontSize: 11, fontWeight: 600, color: "#94A3B8", marginBottom: 5, display: "block" }}>Доход, ₽</label>
          <div style={{ position: "relative" }}>
            <input
              type="number" min={0} value={value}
              onChange={e => setValue(e.target.value)}
              onKeyDown={e => { if (e.key === "Enter") submit(); }}
              placeholder="0"
              style={{ ...inputStyle, paddingRight: 32 }}
            />
            <span style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", fontSize: 13, color: "#94A3B8", fontWeight: 600 }}>₽</span>
          </div>
        </div>
        <div>
          <label style={{ fontSize: 11, fontWeight: 600, color: "#94A3B8", marginBottom: 5, display: "block" }}>Новых клиентов</label>
          <input
            type="number" min={0} value={newClients}
            onChange={e => setNewClients(e.target.value)}
            onKeyDown={e => { if (e.key === "Enter") submit(); }}
            placeholder="0"
            style={inputStyle}
          />
        </div>
        <div>
          <label style={{ fontSize: 11, fontWeight: 600, color: "#94A3B8", marginBottom: 5, display: "block" }}>Вернулось клиентов</label>
          <input
            type="number" min={0} value={returnedClients}
            onChange={e => setReturnedClients(e.target.value)}
            onKeyDown={e => { if (e.key === "Enter") submit(); }}
            placeholder="0"
            style={inputStyle}
          />
        </div>
      </div>

      <button
        onClick={submit}
        disabled={saving}
        style={{
          padding: "11px 22px", borderRadius: 10, border: "none",
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

// ── Карточка «Цели салона» — выбранные цели + прогресс по ним за 14 дней ────────
const GOAL_ICON: Record<string, string> = {
  "Увеличить выручку": "TrendingUp",
  "Увеличить средний чек": "Receipt",
  "Привлечь новых клиентов": "UserPlus",
  "Удержать и вернуть клиентов": "Heart",
  "Снизить текучку мастеров": "Users",
  "Масштабировать сеть / открыть филиал": "Building2",
  "Навести порядок в управлении": "ClipboardCheck",
};

interface SalonGoalsCardProps {
  goals: string[];
  progress: GoalProgress[] | null | undefined;
  addressedToday: string[];
  onNav: (t: string) => void;
}

export function SalonGoalsCard({ goals, progress, addressedToday, onNav }: SalonGoalsCardProps) {
  if (!goals.length) return null;
  const progressByGoal = new Map((progress || []).map(p => [p.goal, p]));

  return (
    <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #E8ECF0", padding: "20px 24px", marginBottom: 20, boxShadow: "0 1px 3px rgba(15,23,42,0.04)" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10, marginBottom: 6, flexWrap: "wrap" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <Icon name="Flag" size={16} style={{ color: ACCENT }} />
          <span style={{ fontSize: 12, fontWeight: 700, color: ACCENT, textTransform: "uppercase", letterSpacing: 1 }}>Цели салона</span>
        </div>
        <button
          onClick={() => onNav("salon")}
          style={{ fontSize: 11.5, fontWeight: 600, color: "#94A3B8", background: "none", border: "none", cursor: "pointer", fontFamily: "Montserrat,sans-serif" }}
        >
          Изменить
        </button>
      </div>
      <div style={{ fontSize: 13, color: "#64748B", marginBottom: 16, lineHeight: 1.6 }}>
        План на сегодня строится с учётом этих целей — отмечены те, на которые работают сегодняшние дела.
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {goals.map(goal => {
          const gp = progressByGoal.get(goal);
          const days = gp?.days_addressed ?? 0;
          const period = gp?.period_days ?? 14;
          const pct = Math.min(100, Math.round((days / period) * 100));
          const activeToday = addressedToday.includes(goal);
          return (
            <div
              key={goal}
              style={{
                padding: "12px 14px", borderRadius: 12,
                background: activeToday ? "hsl(185,85%,96%)" : "#F8FAFC",
                border: `1px solid ${activeToday ? "hsl(185,85%,80%)" : "#E8ECF0"}`,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                <div style={{
                  width: 30, height: 30, borderRadius: 8, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center",
                  background: activeToday ? `hsla(185,85%,32%,0.14)` : "#EEF2F6",
                }}>
                  <Icon name={GOAL_ICON[goal] || "Target"} size={15} style={{ color: activeToday ? ACCENT : "#94A3B8" }} />
                </div>
                <div style={{ flex: 1, minWidth: 0, fontSize: 13.5, fontWeight: 700, color: "#0F172A" }}>{goal}</div>
                {activeToday && (
                  <div style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 10.5, fontWeight: 700, color: ACCENT, background: "#fff", border: `1px solid ${ACCENT}`, borderRadius: 20, padding: "3px 9px", flexShrink: 0, whiteSpace: "nowrap" }}>
                    <Icon name="Check" size={10} />
                    В плане сегодня
                  </div>
                )}
              </div>
              <div style={{ height: 6, borderRadius: 3, background: "#E2E8F0", overflow: "hidden", marginBottom: 6 }}>
                <div style={{ height: "100%", width: `${pct}%`, borderRadius: 3, background: `linear-gradient(90deg,${ACCENT},${ACCENT_DARK})` }} />
              </div>
              <div style={{ fontSize: 11, color: "#94A3B8" }}>
                {days > 0
                  ? `Затронута в плане ${days} из последних ${period} дней`
                  : "Пока не встречалась в плане за последние 14 дней"}
              </div>
            </div>
          );
        })}
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
        {!!(s.new_clients_total || s.returned_clients_total) && (
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