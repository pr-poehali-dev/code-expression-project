import Icon from "@/components/ui/icon";
import { SalonCalcResult, formatMoneySalon } from "./salon.logic";
import { SalonHistoryItem } from "./LkTestsTypes";
import { G, GL, GD, IndexBar, WeakZoneCard } from "./SalonResultShared";
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Cell,
} from "recharts";

interface Props {
  result: SalonCalcResult;
  previousResult?: SalonHistoryItem;
}

export function SalonResultCharts({ result, previousResult }: Props) {
  const { norm, ippLoss, type, weakZones, radarData, hiddenMoney } = result;

  const barData = [
    { name: "Текущая\nвыручка",   value: hiddenMoney.currentMonthlyRevenue, color: "#94a3b8" },
    { name: "Потери от\nневозврата", value: hiddenMoney.lossFromNonReturn,   color: "#ef4444" },
    { name: "Потенциал\nдопродаж",   value: hiddenMoney.potentialFromUpsell, color: G },
    { name: "Итого\nпотенциал",   value: hiddenMoney.currentMonthlyRevenue + hiddenMoney.totalPotential, color: "#22c55e" },
  ];

  return (
    <>
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
            { label: "Потери от невозврата", value: hiddenMoney.lossFromNonReturn,   color: "#ef4444", icon: "TrendingDown" },
            { label: "Потенциал допродаж",   value: hiddenMoney.potentialFromUpsell, color: G,         icon: "TrendingUp"  },
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

      {/* ДЕТАЛЬНЫЕ ИНДЕКСЫ */}
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
            { show: norm.IVK <= 40, icon: "UserX",       color: "#ef4444", text: `Низкий возврат — каждые ${100 - norm.IVK}% потенциальных клиентов уходят и не возвращаются` },
            { show: norm.ISC <= 40, icon: "ShoppingBag", color: "#f97316", text: "Упущенные допродажи — мастера не предлагают, клиенты берут минимум" },
            { show: norm.IEA <= 40, icon: "Phone",       color: "#eab308", text: "Слабые администраторы — точка первого контакта не работает как инструмент продажи" },
            { show: norm.ILK <= 40, icon: "Heart",       color: "#8b5cf6", text: "База клиентов не работает — десятки тысяч рублей лежат в телефонной книге без движения" },
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
    </>
  );
}
