import Icon from "@/components/ui/icon";
import { SalonCalcResult } from "./salon.logic";
import { SalonHistoryItem } from "./LkTestsTypes";
import { G } from "./SalonResultShared";

interface Props {
  current: SalonCalcResult;
  prev: SalonHistoryItem;
}

export function ProgressBlock({ current, prev }: Props) {
  const ipsDelta = current.ips - prev.ips;
  const ippDelta = current.ippLoss - prev.ipp_loss;
  const prevDate = new Date(prev.completed_at).toLocaleDateString("ru-RU", { day: "numeric", month: "long" });

  const mainColor = ipsDelta > 0 ? "#22c55e" : ipsDelta < 0 ? "#ef4444" : "#aaa";
  const mainIcon  = ipsDelta > 0 ? "TrendingUp" : ipsDelta < 0 ? "TrendingDown" : "Minus";

  const metrics = [
    { label: "Возврат клиентов (IVK)",   now: current.norm.IVK, was: prev.ivk },
    { label: "Средний чек (ISC)",         now: current.norm.ISC, was: prev.isc },
    { label: "Загрузка (IZ)",             now: current.norm.IZ,  was: prev.iz  },
    { label: "Администраторы (IEA)",      now: current.norm.IEA, was: prev.iea },
    { label: "Продажи услуг (IPU)",       now: current.norm.IPU, was: prev.ipu },
    { label: "Лояльность (ILK)",          now: current.norm.ILK, was: prev.ilk },
  ];

  const improved = metrics.filter(m => m.now > m.was).length;
  const declined = metrics.filter(m => m.now < m.was).length;

  return (
    <div style={{ background: "#fff", borderRadius: 20, padding: "24px", marginBottom: 16, boxShadow: "0 2px 12px rgba(0,0,0,0.05)" }}>
      <div style={{ fontSize: 11, fontWeight: 700, color: G, textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 4 }}>
        📈 Прогресс с прошлого раза
      </div>
      <p style={{ fontSize: 12, color: "#aaa", margin: "0 0 20px" }}>
        Сравнение с диагностикой от {prevDate}
      </p>

      {/* Главная дельта IPS */}
      <div style={{
        background: ipsDelta > 0 ? "#22c55e12" : ipsDelta < 0 ? "#ef444412" : "#f9f9f7",
        border: `1.5px solid ${ipsDelta > 0 ? "#22c55e30" : ipsDelta < 0 ? "#ef444430" : "#e8e8e4"}`,
        borderRadius: 16, padding: "20px 24px", marginBottom: 20,
        display: "flex", alignItems: "center", gap: 16,
      }}>
        <div style={{
          width: 52, height: 52, borderRadius: 14, flexShrink: 0,
          background: `${mainColor}18`,
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <Icon name={mainIcon} size={24} style={{ color: mainColor }} />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 12, color: "#888", marginBottom: 4 }}>Индекс прибыльности (IPS)</div>
          <div style={{ display: "flex", alignItems: "baseline", gap: 10 }}>
            <span style={{ fontSize: 32, fontWeight: 900, color: mainColor, lineHeight: 1 }}>
              {ipsDelta > 0 ? `+${ipsDelta}` : ipsDelta}
            </span>
            <span style={{ fontSize: 14, color: "#888" }}>
              {prev.ips} → {current.ips}
            </span>
          </div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontSize: 11, color: "#aaa", marginBottom: 4 }}>Сводка</div>
          <div style={{ fontSize: 12, color: "#22c55e", fontWeight: 700 }}>↑ {improved} улучшились</div>
          {declined > 0 && <div style={{ fontSize: 12, color: "#ef4444", fontWeight: 700 }}>↓ {declined} снизились</div>}
        </div>
      </div>

      {/* Изменение IPP */}
      <div style={{
        padding: "12px 16px", borderRadius: 12, marginBottom: 16,
        background: ippDelta < 0 ? "#22c55e12" : ippDelta > 0 ? "#ef444412" : "#f9f9f7",
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontSize: 13, color: "#444" }}>Индекс потерь прибыли (IPP)</span>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{
              fontSize: 12, fontWeight: 700,
              color: ippDelta < 0 ? "#22c55e" : ippDelta > 0 ? "#ef4444" : "#aaa",
            }}>
              {ippDelta < 0 ? `${ippDelta} (улучшилось)` : ippDelta > 0 ? `+${ippDelta} (хуже)` : "—"}
            </span>
            <span style={{ fontSize: 13, fontWeight: 700, color: "#1a1a1a" }}>
              {prev.ipp_loss}% → {current.ippLoss}%
            </span>
          </div>
        </div>
        <div style={{ fontSize: 11, color: "#aaa", marginTop: 4 }}>Чем ниже — тем лучше</div>
      </div>

      {/* Таблица изменений по индексам */}
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {metrics.map(m => {
          const delta  = m.now - m.was;
          const dColor = delta > 0 ? "#22c55e" : delta < 0 ? "#ef4444" : "#aaa";
          return (
            <div key={m.label} style={{
              display: "flex", alignItems: "center", gap: 10,
              padding: "10px 14px", borderRadius: 10, background: "#f9f9f7",
            }}>
              <div style={{ flex: 1, fontSize: 13, color: "#444" }}>{m.label}</div>
              <div style={{ fontSize: 12, color: "#aaa", minWidth: 60, textAlign: "right" }}>
                {m.was}% → {m.now}%
              </div>
              <div style={{ fontSize: 12, fontWeight: 700, minWidth: 40, textAlign: "right", color: dColor }}>
                {delta > 0 ? `+${delta}` : delta === 0 ? "—" : delta}
              </div>
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: dColor, flexShrink: 0 }} />
            </div>
          );
        })}
      </div>
    </div>
  );
}
