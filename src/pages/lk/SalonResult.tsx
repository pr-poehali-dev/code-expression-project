import Icon from "@/components/ui/icon";
import {
  SALON_ACCENT, SALON_ACCENT_LIGHT, SALON_ACCENT_DARK,
} from "./salon.types";
import { SalonCalcResult, SalonWeakZone, formatMoneySalon } from "./salon.logic";
import { SalonHistoryItem } from "./LkTestsTypes";
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Cell,
} from "recharts";

const G  = SALON_ACCENT;
const GL = SALON_ACCENT_LIGHT;
const GD = SALON_ACCENT_DARK;

interface Props {
  result: SalonCalcResult;
  onRetake: () => void;
  onBack: () => void;
  backLabel?: string;
  date?: string;
  previousResult?: SalonHistoryItem;
}

// ─── Компонент прогресс-бара с дельтой ──────────────────────────────────────

function IndexBar({ label, value, prev }: { label: string; value: number; prev?: number }) {
  const color = value >= 70 ? "#22c55e" : value >= 45 ? "#eab308" : "#ef4444";
  const delta = prev !== undefined ? value - prev : null;
  return (
    <div style={{ marginBottom: 14 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5, alignItems: "center" }}>
        <span style={{ fontSize: 13, color: "#444", fontWeight: 500 }}>{label}</span>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          {delta !== null && (
            <span style={{
              fontSize: 11, fontWeight: 700, padding: "2px 7px", borderRadius: 20,
              background: delta > 0 ? "#22c55e18" : delta < 0 ? "#ef444418" : "#f0f0ec",
              color: delta > 0 ? "#22c55e" : delta < 0 ? "#ef4444" : "#aaa",
            }}>
              {delta > 0 ? `+${delta}` : delta < 0 ? `${delta}` : "—"}
            </span>
          )}
          <span style={{ fontSize: 13, fontWeight: 700, color }}>{value}%</span>
        </div>
      </div>
      <div style={{ height: 6, background: "#f0f0ec", borderRadius: 3, position: "relative" }}>
        {/* Предыдущее значение — серая полоса под текущей */}
        {prev !== undefined && (
          <div style={{
            position: "absolute", left: 0, top: 0,
            width: `${prev}%`, height: "100%",
            background: "#d1d5db", borderRadius: 3,
          }} />
        )}
        <div style={{
          position: "absolute", left: 0, top: 0,
          width: `${value}%`, height: "100%",
          background: color, borderRadius: 3, transition: "width 0.8s ease",
        }} />
      </div>
      {prev !== undefined && (
        <div style={{ fontSize: 11, color: "#bbb", marginTop: 3 }}>
          Было: {prev}%
        </div>
      )}
    </div>
  );
}

function WeakZoneCard({ zone }: { zone: SalonWeakZone }) {
  const impactColor = zone.impact === "high" ? "#ef4444" : zone.impact === "medium" ? "#f97316" : "#eab308";
  return (
    <div style={{ background: "#fff", borderRadius: 14, padding: "16px 18px", borderLeft: `3px solid ${impactColor}`, boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
        <div>
          <div style={{ fontSize: 13, fontWeight: 700, color: "#1a1a1a", marginBottom: 2 }}>{zone.label}</div>
          <div style={{ fontSize: 11, color: impactColor, fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.5 }}>
            {zone.impact === "high" ? "Критично" : zone.impact === "medium" ? "Важно" : "Требует внимания"}
          </div>
        </div>
        <div style={{ fontSize: 18, fontWeight: 900, color: impactColor, marginLeft: 12 }}>{zone.value}%</div>
      </div>
      <div style={{ fontSize: 12, color: "#555", background: "#f9f9f7", borderRadius: 8, padding: "8px 12px", lineHeight: 1.6 }}>
        💡 {zone.tip}
      </div>
    </div>
  );
}

// ─── Компонент сравнения с предыдущим результатом ────────────────────────────

function ProgressBlock({ current, prev }: { current: SalonCalcResult; prev: SalonHistoryItem }) {
  const ipsDelta   = current.ips - prev.ips;
  const ippDelta   = current.ippLoss - prev.ipp_loss; // чем ниже IPP — тем лучше
  const prevDate   = new Date(prev.completed_at).toLocaleDateString("ru-RU", { day: "numeric", month: "long" });

  const mainColor  = ipsDelta > 0 ? "#22c55e" : ipsDelta < 0 ? "#ef4444" : "#aaa";
  const mainIcon   = ipsDelta > 0 ? "TrendingUp" : ipsDelta < 0 ? "TrendingDown" : "Minus";

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

      {/* Изменение IPP (инвертированный — хорошо когда ниже) */}
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
          const delta = m.now - m.was;
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
              <div style={{
                fontSize: 12, fontWeight: 700, minWidth: 40, textAlign: "right",
                color: dColor,
              }}>
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

export default function SalonResult({ result, onRetake, onBack, backLabel, date, previousResult }: Props) {
  const { norm, ippLoss, ips, level, type, weakZones, radarData, hiddenMoney } = result;

  const barData = [
    { name: "Текущая\nвыручка", value: hiddenMoney.currentMonthlyRevenue, color: "#94a3b8" },
    { name: "Потери от\nневозврата", value: hiddenMoney.lossFromNonReturn, color: "#ef4444" },
    { name: "Потенциал\nдопродаж", value: hiddenMoney.potentialFromUpsell, color: G },
    { name: "Итого\nпотенциал", value: hiddenMoney.currentMonthlyRevenue + hiddenMoney.totalPotential, color: "#22c55e" },
  ];

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

      {/* БЛОК ПРОГРЕССА (только при повторном прохождении) */}
      {previousResult && (
        <ProgressBlock current={result} prev={previousResult} />
      )}

      {/* ТИП САЛОНА */}
      <div style={{
        background: "#fff", borderRadius: 20, padding: "24px", marginBottom: 16,
        boxShadow: "0 2px 12px rgba(0,0,0,0.05)", borderLeft: `4px solid ${type.color}`,
      }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: G, textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 8 }}>
          Тип вашего салона
        </div>
        <div style={{ display: "flex", alignItems: "flex-start", gap: 14, marginBottom: 14 }}>
          <div style={{
            width: 48, height: 48, borderRadius: 14, background: `${type.color}18`,
            display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
            fontSize: 24,
          }}>
            {type.emoji}
          </div>
          <div>
            <div style={{ fontSize: 18, fontWeight: 800, color: "#1a1a1a", marginBottom: 4 }}>{type.title}</div>
            <div style={{ fontSize: 13, color: type.color, fontWeight: 600 }}>{type.subtitle}</div>
          </div>
        </div>
        <p style={{ fontSize: 14, color: "#555", lineHeight: 1.7, margin: "0 0 14px" }}>{type.description}</p>
        <div style={{ background: GL, borderRadius: 12, padding: "12px 16px", borderLeft: `3px solid ${G}` }}>
          <div style={{ fontSize: 12, color: GD, fontWeight: 700, marginBottom: 4 }}>Следующий шаг</div>
          <div style={{ fontSize: 13, color: "#444" }}>{type.nextStep}</div>
        </div>
      </div>

      {/* СКРЫТЫЕ ДЕНЬГИ */}
      <div style={{ background: "#fff", borderRadius: 20, padding: "24px", marginBottom: 16, boxShadow: "0 2px 12px rgba(0,0,0,0.05)" }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: G, textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 4 }}>
          💰 Скрытые деньги салона
        </div>
        <p style={{ fontSize: 12, color: "#aaa", margin: "0 0 20px" }}>
          Сколько можно добавить к выручке без нового трафика
        </p>
        <div style={{
          background: "linear-gradient(135deg, #22c55e15, #22c55e08)",
          border: "1.5px solid #22c55e30", borderRadius: 16, padding: "20px 24px",
          textAlign: "center", marginBottom: 20,
        }}>
          <div style={{ fontSize: 12, color: "#888", marginBottom: 4 }}>Потенциал роста прибыли в месяц</div>
          <div style={{ fontSize: "clamp(32px,5vw,48px)", fontWeight: 900, color: "#22c55e", lineHeight: 1 }}>
            +{formatMoneySalon(hiddenMoney.totalPotential)}
          </div>
          <div style={{ fontSize: 13, color: "#888", marginTop: 6 }}>при работе с возвратом и допродажами</div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 20 }}>
          {[
            { label: "Потери от невозврата", value: hiddenMoney.lossFromNonReturn, color: "#ef4444", icon: "TrendingDown" },
            { label: "Потенциал допродаж",   value: hiddenMoney.potentialFromUpsell, color: G, icon: "TrendingUp" },
          ].map(item => (
            <div key={item.label} style={{ background: "#f9f9f7", borderRadius: 12, padding: "16px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                <Icon name={item.icon} size={14} style={{ color: item.color }} />
                <span style={{ fontSize: 11, color: "#aaa" }}>{item.label}</span>
              </div>
              <div style={{ fontSize: 20, fontWeight: 900, color: item.color }}>
                {formatMoneySalon(item.value)}
              </div>
            </div>
          ))}
        </div>
        <div style={{ background: "#f9f9f7", borderRadius: 14, padding: "16px 18px" }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: "#1a1a1a", marginBottom: 12 }}>Если улучшить:</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13 }}>
              <span style={{ color: "#666" }}>Возврат клиентов</span>
              <span style={{ fontWeight: 700, color: "#1a1a1a" }}>
                {hiddenMoney.currentReturnRate}% → {hiddenMoney.targetReturnRate}%
              </span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13 }}>
              <span style={{ color: "#666" }}>Допродажи</span>
              <span style={{ fontWeight: 700, color: "#1a1a1a" }}>
                {hiddenMoney.currentUpsellRate}% → {hiddenMoney.targetUpsellRate}%
              </span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, paddingTop: 8, borderTop: "1px solid #e8e8e4" }}>
              <span style={{ color: "#666" }}>Потенциал выручки</span>
              <span style={{ fontWeight: 800, color: "#22c55e" }}>
                {formatMoneySalon(hiddenMoney.currentMonthlyRevenue + hiddenMoney.totalPotential)}/мес
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* BAR CHART */}
      <div style={{ background: "#fff", borderRadius: 20, padding: "24px", marginBottom: 16, boxShadow: "0 2px 12px rgba(0,0,0,0.05)" }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: G, textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 4 }}>
          График потенциала роста
        </div>
        <p style={{ fontSize: 12, color: "#aaa", margin: "0 0 16px" }}>Текущее состояние vs потенциал</p>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={barData} margin={{ top: 5, right: 10, left: 0, bottom: 30 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0ec" />
            <XAxis dataKey="name" tick={{ fontSize: 10, fill: "#aaa", fontFamily: "Montserrat, sans-serif" }} interval={0} />
            <YAxis tick={{ fontSize: 10, fill: "#aaa" }} tickFormatter={v => `${Math.round(v / 1000)}к`} />
            <Tooltip formatter={(value: number) => [`${formatMoneySalon(value)}`, ""]} contentStyle={{ fontFamily: "Montserrat, sans-serif", fontSize: 12 }} />
            <Bar dataKey="value" radius={[6, 6, 0, 0]}>
              {barData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* RADAR CHART */}
      <div style={{ background: "#fff", borderRadius: 20, padding: "24px", marginBottom: 16, boxShadow: "0 2px 12px rgba(0,0,0,0.05)" }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: G, textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 4 }}>
          Карта прибыльности салона
        </div>
        <p style={{ fontSize: 12, color: "#aaa", margin: "0 0 16px" }}>6 ключевых показателей бизнеса</p>
        <ResponsiveContainer width="100%" height={270}>
          <RadarChart data={radarData}>
            <PolarGrid stroke="#f0f0ec" />
            <PolarAngleAxis dataKey="subject" tick={{ fontSize: 11, fill: "#888", fontFamily: "Montserrat, sans-serif" }} />
            <Radar name="Сейчас" dataKey="value" stroke={G} fill={G} fillOpacity={0.2} strokeWidth={2} />
          </RadarChart>
        </ResponsiveContainer>
      </div>

      {/* ДЕТАЛЬНЫЕ ИНДЕКСЫ (с дельтами если есть предыдущий) */}
      <div style={{ background: "#fff", borderRadius: 20, padding: "24px", marginBottom: 16, boxShadow: "0 2px 12px rgba(0,0,0,0.05)" }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: G, textTransform: "uppercase", letterSpacing: 1.5, marginBottom: previousResult ? 4 : 16 }}>
          Детальные индексы
        </div>
        {previousResult && (
          <p style={{ fontSize: 12, color: "#aaa", margin: "0 0 16px" }}>
            Серая полоса — предыдущий результат
          </p>
        )}
        <IndexBar label="Возврат клиентов (IVK)"              value={norm.IVK} prev={previousResult?.ivk} />
        <IndexBar label="Средний чек / допродажи (ISC)"       value={norm.ISC} prev={previousResult?.isc} />
        <IndexBar label="Загрузка и поток (IZ)"               value={norm.IZ}  prev={previousResult?.iz} />
        <IndexBar label="Эффективность администраторов (IEA)" value={norm.IEA} prev={previousResult?.iea} />
        <IndexBar label="Продажи услуг (IPU)"                 value={norm.IPU} prev={previousResult?.ipu} />
        <IndexBar label="Лояльность клиентов (ILK)"           value={norm.ILK} prev={previousResult?.ilk} />
        <IndexBar label="Финансовый контроль (IPS)"           value={norm.IPS} prev={previousResult?.ips_idx} />
        <div style={{ borderTop: "1px solid #f0f0ec", paddingTop: 14, marginTop: 4 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: 13, color: "#444", fontWeight: 600 }}>Индекс потери прибыли (IPP)</span>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              {previousResult && (() => {
                const d = ippLoss - previousResult.ipp_loss;
                return (
                  <span style={{ fontSize: 11, fontWeight: 700, color: d < 0 ? "#22c55e" : d > 0 ? "#ef4444" : "#aaa" }}>
                    {d < 0 ? d : d > 0 ? `+${d}` : "—"}
                  </span>
                );
              })()}
              <span style={{ fontSize: 13, fontWeight: 700, color: ippLoss >= 60 ? "#ef4444" : ippLoss >= 40 ? "#f97316" : "#22c55e" }}>{ippLoss}%</span>
            </div>
          </div>
          <div style={{ fontSize: 12, color: "#aaa", marginTop: 4 }}>Чем ниже — тем лучше{previousResult ? ` · Было: ${previousResult.ipp_loss}%` : ""}</div>
        </div>
      </div>

      {/* ЗОНЫ РОСТА */}
      {weakZones.length > 0 && (
        <div style={{ background: "#fff", borderRadius: 20, padding: "24px", marginBottom: 16, boxShadow: "0 2px 12px rgba(0,0,0,0.05)" }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: G, textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 4 }}>
            Слабые места — точки роста
          </div>
          <p style={{ fontSize: 12, color: "#aaa", margin: "0 0 16px" }}>
            Исправив эти зоны, вы разблокируете скрытую прибыль
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {weakZones.map(zone => <WeakZoneCard key={zone.index} zone={zone} />)}
          </div>
        </div>
      )}

      {/* ЧТО МЕШАЕТ РОСТУ */}
      <div style={{ background: "#fff", borderRadius: 20, padding: "24px", marginBottom: 16, boxShadow: "0 2px 12px rgba(0,0,0,0.05)" }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: G, textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 14 }}>
          Главные провалы
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {[
            { show: norm.IVK <= 40,  icon: "UserX",       color: "#ef4444",  text: `Низкий возврат — каждые ${100 - norm.IVK}% потенциальных клиентов уходят и не возвращаются` },
            { show: norm.ISC <= 40,  icon: "ShoppingBag", color: "#f97316",  text: "Упущенные допродажи — мастера не предлагают, клиенты берут минимум" },
            { show: norm.IEA <= 40,  icon: "Phone",       color: "#eab308",  text: "Слабые администраторы — точка первого контакта не работает как инструмент продажи" },
            { show: norm.ILK <= 40,  icon: "Heart",       color: "#8b5cf6",  text: "База клиентов не работает — десятки тысяч рублей лежат в телефонной книге без движения" },
          ].filter(b => b.show).slice(0, 3).map((b, i) => (
            <div key={i} style={{ display: "flex", gap: 12, alignItems: "flex-start", background: "#f9f9f7", borderRadius: 12, padding: "14px 16px" }}>
              <div style={{ width: 32, height: 32, borderRadius: 10, background: `${b.color}18`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <Icon name={b.icon} size={16} style={{ color: b.color }} />
              </div>
              <span style={{ fontSize: 13, color: "#444", lineHeight: 1.6, marginTop: 5 }}>{b.text}</span>
            </div>
          ))}
          {norm.IVK > 40 && norm.ISC > 40 && norm.IEA > 40 && norm.ILK > 40 && (
            <div style={{ background: GL, borderRadius: 12, padding: "14px 16px" }}>
              <div style={{ fontSize: 13, color: GD, fontWeight: 700 }}>
                ✓ Явных провалов не обнаружено — фокус на масштабировании системы
              </div>
            </div>
          )}
        </div>
      </div>

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
