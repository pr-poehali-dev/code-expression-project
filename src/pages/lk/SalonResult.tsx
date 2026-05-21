import Icon from "@/components/ui/icon";
import { SalonCalcResult } from "./salon.logic";
import { SalonHistoryItem } from "./LkTestsTypes";
import { G, GD } from "./SalonResultShared";
import { ProgressBlock } from "./SalonResultProgress";
import { SalonResultCharts } from "./SalonResultCharts";

interface Props {
  result: SalonCalcResult;
  onRetake: () => void;
  onBack: () => void;
  backLabel?: string;
  date?: string;
  previousResult?: SalonHistoryItem;
}

export default function SalonResult({ result, onRetake, onBack, backLabel, date, previousResult }: Props) {
  const { ips, level } = result;

  return (
    <div style={{ fontFamily: "Montserrat, sans-serif", maxWidth: 640, margin: "0 auto" }}>
      <button onClick={onBack} style={{
        display: "inline-flex", alignItems: "center", gap: 8, background: "none", border: "none",
        color: "#888", fontSize: 13, cursor: "pointer", padding: "0 0 20px", fontFamily: "Montserrat, sans-serif",
      }}>
        <Icon name="ArrowLeft" size={15} /> {backLabel || "К инструментам"}
      </button>

      {/* ГЛАВНЫЙ ИНДЕКС */}
      <div style={{
        background: `linear-gradient(135deg, ${G}, ${GD})`,
        borderRadius: 20, padding: "32px 28px", marginBottom: 16, color: "#fff",
        boxShadow: `0 12px 40px ${G}44`, textAlign: "center",
      }}>
        {date && <div style={{ fontSize: 12, opacity: 0.6, marginBottom: 8 }}>{date}</div>}
        <div style={{ fontSize: 11, opacity: 0.7, textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 10 }}>
          Индекс прибыльности салона
        </div>
        <div style={{ display: "flex", alignItems: "baseline", justifyContent: "center", gap: 14, marginBottom: 8 }}>
          <div style={{ fontSize: "clamp(60px,10vw,84px)", fontWeight: 900, lineHeight: 1 }}>
            {ips}
          </div>
          {previousResult && (
            <div style={{ fontSize: 20, fontWeight: 700, opacity: 0.8 }}>
              {ips > previousResult.ips
                ? <span style={{ color: "#86efac" }}>▲ +{ips - previousResult.ips}</span>
                : ips < previousResult.ips
                ? <span style={{ color: "#fca5a5" }}>▼ {ips - previousResult.ips}</span>
                : <span style={{ opacity: 0.5 }}>= 0</span>
              }
            </div>
          )}
        </div>
        <div style={{ fontSize: 18, fontWeight: 700, opacity: 0.9, marginBottom: 16 }}>
          {level.label}
        </div>
        <div style={{ display: "flex", gap: 4 }}>
          {[30, 50, 70, 85, 100].map((threshold, i) => {
            const prev = [0, 30, 50, 70, 85][i];
            const active = ips > prev && ips <= threshold;
            return (
              <div key={threshold} style={{
                flex: 1, height: 6, borderRadius: 3,
                background: active ? "#fff" : "rgba(255,255,255,0.3)",
              }} />
            );
          })}
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 4 }}>
          <span style={{ fontSize: 10, opacity: 0.5 }}>Потери</span>
          <span style={{ fontSize: 10, opacity: 0.5 }}>Высокоприбыльный</span>
        </div>
      </div>

      {/* ПРОГРЕСС (только при повторном прохождении) */}
      {previousResult && (
        <ProgressBlock current={result} prev={previousResult} />
      )}

      {/* ОСНОВНОЙ КОНТЕНТ */}
      <SalonResultCharts result={result} previousResult={previousResult} />

      {/* Кнопки */}
      <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 40 }}>
        <button onClick={onRetake} style={{
          width: "100%", padding: "14px", borderRadius: 14, border: "none",
          background: `linear-gradient(135deg, ${G}, ${GD})`,
          color: "#fff", fontSize: 15, fontWeight: 700, cursor: "pointer",
          fontFamily: "Montserrat, sans-serif", boxShadow: `0 6px 20px ${G}44`,
        }}>
          Пройти снова
        </button>
        <button onClick={onBack} style={{
          width: "100%", padding: "14px", borderRadius: 14,
          border: `1.5px solid ${G}`, background: "transparent", color: G,
          fontSize: 15, fontWeight: 700, cursor: "pointer", fontFamily: "Montserrat, sans-serif",
        }}>
          К инструментам
        </button>
      </div>
    </div>
  );
}
