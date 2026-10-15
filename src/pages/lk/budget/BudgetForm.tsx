import Icon from "@/components/ui/icon";
import ToolUsageBadge from "@/components/ToolUsageBadge";
import { ACCENT } from "./shared";

interface Props {
  avgCheck: string;
  setAvgCheck: (v: string) => void;
  targetClients: string;
  setTargetClients: (v: string) => void;
  budget: string;
  setBudget: (v: string) => void;
  loading: boolean;
  error: string | null;
  generate: () => void;
}

export default function BudgetForm({ avgCheck, setAvgCheck, targetClients, setTargetClients, budget, setBudget, loading, error, generate }: Props) {
  const inputStyle = (val: string): React.CSSProperties => ({
    width: "100%", padding: "11px 14px", borderRadius: 10,
    border: `1.5px solid ${val ? ACCENT : "#E8ECF0"}`,
    fontSize: 14, outline: "none", fontFamily: "Montserrat,sans-serif",
    color: "#0F172A", background: "#fff", boxSizing: "border-box" as const,
    transition: "border-color 0.15s",
  });

  return (
    <div style={{ background: "#fff", borderRadius: 16, border: "1.5px solid #E8ECF0", padding: "24px", marginBottom: 24 }}>
      <div style={{ fontSize: 13, fontWeight: 700, color: "#0F172A", marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}>
        <Icon name="Settings2" size={15} style={{ color: ACCENT }} />
        Параметры медиаплана
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(200px,1fr))", gap: 16, marginBottom: 20 }}>
        <div>
          <label style={{ fontSize: 11, fontWeight: 700, color: "#64748B", display: "block", marginBottom: 6, textTransform: "uppercase", letterSpacing: 0.8 }}>
            Средний чек клиента, ₽
          </label>
          <input
            type="number" min="500" max="100000"
            value={avgCheck}
            onChange={e => setAvgCheck(e.target.value)}
            placeholder="Например: 3500"
            style={inputStyle(avgCheck)}
          />
          <div style={{ fontSize: 11, color: "#94A3B8", marginTop: 4 }}>Средняя сумма одного визита</div>
        </div>
        <div>
          <label style={{ fontSize: 11, fontWeight: 700, color: "#64748B", display: "block", marginBottom: 6, textTransform: "uppercase", letterSpacing: 0.8 }}>
            Цель: новых клиентов/мес
          </label>
          <input
            type="number" min="1" max="500"
            value={targetClients}
            onChange={e => setTargetClients(e.target.value)}
            placeholder="Например: 20"
            style={inputStyle(targetClients)}
          />
          <div style={{ fontSize: 11, color: "#94A3B8", marginTop: 4 }}>Сколько хотите привлекать в месяц</div>
        </div>
        <div>
          <label style={{ fontSize: 11, fontWeight: 700, color: "#64748B", display: "block", marginBottom: 6, textTransform: "uppercase", letterSpacing: 0.8 }}>
            Бюджет на рекламу, ₽/мес
          </label>
          <input
            type="number" min="5000" max="5000000"
            value={budget}
            onChange={e => setBudget(e.target.value)}
            placeholder="Например: 30000"
            style={inputStyle(budget)}
          />
          <div style={{ fontSize: 11, color: "#94A3B8", marginTop: 4 }}>Планируемые расходы на контекстную рекламу</div>
        </div>
      </div>

      {error && (
        <div style={{ marginBottom: 14, padding: "10px 14px", background: "#FEF2F2", border: "1px solid #FECACA", borderRadius: 10, fontSize: 13, color: "#DC2626", display: "flex", alignItems: "center", gap: 8 }}>
          <Icon name="AlertCircle" size={14} />
          {error}
        </div>
      )}

      <button
        onClick={generate}
        disabled={loading || !avgCheck || !targetClients || !budget}
        style={{ display: "flex", alignItems: "center", gap: 8, background: loading || !avgCheck || !targetClients || !budget ? "#E8ECF0" : ACCENT, color: loading || !avgCheck || !targetClients || !budget ? "#94A3B8" : "#fff", border: "none", borderRadius: 10, padding: "12px 28px", fontSize: 14, fontWeight: 700, cursor: loading || !avgCheck || !targetClients || !budget ? "default" : "pointer", fontFamily: "Montserrat,sans-serif", transition: "background 0.15s" }}
      >
        {loading
          ? <><Icon name="Loader2" size={16} style={{ animation: "spin 1s linear infinite" }} /> Считаю медиаплан...</>
          : <><Icon name="Calculator" size={16} /> Рассчитать медиаплан</>
        }
      </button>
      <div style={{ marginTop: 10 }}>
        <ToolUsageBadge toolKey="mkt_budget" />
      </div>
    </div>
  );
}
