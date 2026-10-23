import Icon from "@/components/ui/icon";
import { useEnergy } from "@/contexts/EnergyContext";
import { CLIENT_VIEW_COST } from "./types";

const GRAY = "#64748B";

export function CostBadge({ dark = true }: { dark?: boolean }) {
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 3, fontSize: 12, fontWeight: 700,
      padding: "2px 8px", borderRadius: 999, background: dark ? "rgba(15,23,42,0.12)" : "rgba(255,255,255,0.2)",
    }}>
      <Icon name="Zap" size={12} />{CLIENT_VIEW_COST}
    </span>
  );
}

export function BalanceHint() {
  const { balance, loading } = useEnergy();
  const low = !loading && balance < CLIENT_VIEW_COST;
  return (
    <span style={{ fontSize: 12, color: low ? "#B91C1C" : GRAY, fontWeight: low ? 600 : 400 }}>
      {loading ? "Баланс: …" : `Баланс: ${balance} ⚡${low ? " — нужно пополнить" : ""}`}
    </span>
  );
}
