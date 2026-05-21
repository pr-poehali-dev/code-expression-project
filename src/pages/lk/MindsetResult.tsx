import { RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer } from "recharts";
import Icon from "@/components/ui/icon";
import { IndexKey } from "./mindset.types";
import { calcIGP, getScaleLabel, getType } from "./mindset.logic";
import { ACCENT, ACCENT_LIGHT, MiniIndexBar } from "./MindsetShared";

export type IndexMap = Record<IndexKey, number>;

interface Props {
  idx: IndexMap;
  date?: string;
  onRetake: () => void;
  onBack: () => void;
  backLabel?: string;
}

export default function MindsetResult({ idx, date, onRetake, onBack, backLabel = "К инструментам" }: Props) {
  const igp = calcIGP(idx);
  const scale = getScaleLabel(igp);
  const type = getType(idx);

  const radarData = [
    { subject: "Уверенность",  value: idx.IU,           fullMark: 100 },
    { subject: "Границы",      value: idx.IPG,           fullMark: 100 },
    { subject: "Самоценность", value: idx.ICS,           fullMark: 100 },
    { subject: "Коммуникация", value: idx.IZK,           fullMark: 100 },
    { subject: "Премиальность",value: idx.IPM,           fullMark: 100 },
    { subject: "Независимость",value: 100 - idx.IDO,     fullMark: 100 },
  ];

  const allIndexes: { key: IndexKey; label: string; color: string; invert?: boolean }[] = [
    { key: "IU",  label: "Уверенность",             color: "hsl(280,60%,55%)" },
    { key: "IPM", label: "Премиальное мышление",     color: ACCENT },
    { key: "IPG", label: "Профессиональные границы", color: "hsl(145,60%,40%)" },
    { key: "ICS", label: "Ценность себя",            color: "hsl(35,85%,52%)" },
    { key: "IZK", label: "Зрелость коммуникации",    color: "hsl(210,70%,50%)" },
    { key: "IDO", label: "Зависимость от одобрения", color: "#f97316", invert: true },
    { key: "ISD", label: "Страх денег",              color: "#ef4444", invert: true },
  ];

  return (
    <div style={{ maxWidth: 640, margin: "0 auto", fontFamily: "Montserrat, sans-serif" }}>
      {/* Шапка */}
      <div style={{ marginBottom: 24, display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 8 }}>
        <button onClick={onBack} style={{
          display: "inline-flex", alignItems: "center", gap: 8,
          background: "none", border: "none", color: "#888",
          fontSize: 13, cursor: "pointer", padding: 0,
          fontFamily: "Montserrat, sans-serif",
        }}>
          <Icon name="ArrowLeft" size={15} /> {backLabel}
        </button>
        {date && (
          <span style={{ fontSize: 12, color: "#bbb" }}>{date}</span>
        )}
      </div>

      {/* IGP */}
      <div style={{
        background: `linear-gradient(135deg, ${ACCENT}, hsl(185,85%,20%))`,
        borderRadius: 20, padding: "28px 28px", marginBottom: 20, color: "#fff",
        boxShadow: `0 12px 40px hsla(185,85%,32%,0.35)`,
      }}>
        <div style={{ fontSize: 11, opacity: 0.7, textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 6 }}>
          Индекс готовности к премиум-клиентам
        </div>
        <div style={{ display: "flex", alignItems: "flex-end", gap: 16, marginBottom: 16 }}>
          <div style={{ fontSize: "clamp(52px,6vw,72px)", fontWeight: 900, lineHeight: 1, letterSpacing: -2 }}>
            {igp}
          </div>
          <div style={{ fontSize: 24, opacity: 0.6, marginBottom: 8 }}>/100</div>
        </div>
        <div style={{
          display: "inline-block", background: "rgba(255,255,255,0.2)",
          borderRadius: 20, padding: "4px 14px", fontSize: 13, fontWeight: 700, marginBottom: 16,
        }}>
          {scale.label}
        </div>
        <div style={{ height: 6, background: "rgba(255,255,255,0.2)", borderRadius: 3 }}>
          <div style={{ width: `${igp}%`, height: "100%", background: "#fff", borderRadius: 3, transition: "width 1s ease" }} />
        </div>
      </div>

      {/* Тип */}
      <div style={{ background: "#fff", borderRadius: 20, padding: "24px 28px", marginBottom: 16, boxShadow: "0 2px 12px rgba(0,0,0,0.05)" }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: "#aaa", textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 8 }}>
          Ваш тип
        </div>
        <h2 style={{ fontFamily: "Cormorant, serif", fontSize: 26, fontWeight: 700, color: "#1a1a1a", margin: "0 0 12px" }}>
          {type.title}
        </h2>
        <p style={{ fontSize: 14, color: "#555", lineHeight: 1.8, margin: 0 }}>{type.desc}</p>
      </div>

      {/* Радар */}
      <div style={{ background: "#fff", borderRadius: 20, padding: "24px 28px", marginBottom: 16, boxShadow: "0 2px 12px rgba(0,0,0,0.05)" }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: "#1a1a1a", marginBottom: 16 }}>Профиль мышления</div>
        <ResponsiveContainer width="100%" height={260}>
          <RadarChart data={radarData} margin={{ top: 10, right: 30, bottom: 10, left: 30 }}>
            <PolarGrid stroke="#f0f0ec" />
            <PolarAngleAxis dataKey="subject" tick={{ fontSize: 11, fill: "#888", fontFamily: "Montserrat, sans-serif" }} />
            <Radar name="Профиль" dataKey="value" stroke={ACCENT} fill={ACCENT} fillOpacity={0.25} strokeWidth={2} />
          </RadarChart>
        </ResponsiveContainer>
      </div>

      {/* Индексы */}
      <div style={{ background: "#fff", borderRadius: 20, padding: "24px 28px", marginBottom: 16, boxShadow: "0 2px 12px rgba(0,0,0,0.05)" }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: "#1a1a1a", marginBottom: 18 }}>Детальные индексы</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          {allIndexes.map(item => {
            const val = item.invert ? 100 - idx[item.key] : idx[item.key];
            const rawVal = idx[item.key];
            return (
              <div key={item.key} style={{ marginBottom: 10 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                  <span style={{ fontSize: 13, color: "#444", fontWeight: 600 }}>{item.label}</span>
                  <span style={{ fontSize: 13, fontWeight: 700, color: item.color }}>
                    {rawVal}%
                    {item.invert && <span style={{ fontSize: 11, color: "#aaa", marginLeft: 4 }}>(инв. {val}%)</span>}
                  </span>
                </div>
                <div style={{ height: 6, background: "#f0f0ec", borderRadius: 3, overflow: "hidden" }}>
                  <div style={{ width: `${rawVal}%`, height: "100%", background: item.color, borderRadius: 3, transition: "width 1s ease" }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Слабые зоны */}
      {type.weakZones.length > 0 && (
        <div style={{
          background: "#fff", borderRadius: 20, padding: "24px 28px", marginBottom: 16,
          borderLeft: "4px solid #f97316", boxShadow: "0 2px 12px rgba(0,0,0,0.05)",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
            <Icon name="AlertTriangle" size={18} style={{ color: "#f97316" }} />
            <div style={{ fontSize: 13, fontWeight: 700, color: "#1a1a1a" }}>Что мешает работать с премиум-клиентами</div>
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {type.weakZones.map(z => (
              <span key={z} style={{
                padding: "5px 12px", borderRadius: 20, fontSize: 13,
                background: "hsl(20,85%,96%)", color: "#f97316", fontWeight: 600,
                border: "1px solid hsl(20,85%,88%)",
              }}>{z}</span>
            ))}
          </div>
        </div>
      )}

      {/* Рекомендации */}
      <div style={{ background: "#fff", borderRadius: 20, padding: "24px 28px", marginBottom: 24, boxShadow: "0 2px 12px rgba(0,0,0,0.05)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
          <Icon name="Lightbulb" size={18} style={{ color: ACCENT }} />
          <div style={{ fontSize: 13, fontWeight: 700, color: "#1a1a1a" }}>Рекомендации</div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {type.recs.map((rec, i) => (
            <div key={i} style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
              <div style={{
                width: 24, height: 24, borderRadius: 8, background: ACCENT_LIGHT,
                color: ACCENT, fontSize: 12, fontWeight: 700,
                display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
              }}>{i + 1}</div>
              <p style={{ fontSize: 14, color: "#444", lineHeight: 1.7, margin: 0 }}>{rec}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Кнопки */}
      <div style={{ display: "flex", gap: 12 }}>
        <button onClick={onRetake} style={{
          flex: 1, padding: "13px", borderRadius: 14,
          border: `1.5px solid ${ACCENT}`, background: "transparent",
          color: ACCENT, fontSize: 14, fontWeight: 700,
          fontFamily: "Montserrat, sans-serif", cursor: "pointer",
        }}>
          Пройти снова
        </button>
        <button onClick={onBack} style={{
          flex: 1, padding: "13px", borderRadius: 14, border: "none",
          background: `linear-gradient(135deg, ${ACCENT}, hsl(185,85%,22%))`,
          color: "#fff", fontSize: 14, fontWeight: 700,
          fontFamily: "Montserrat, sans-serif", cursor: "pointer",
        }}>
          {backLabel}
        </button>
      </div>

      {/* Скрытый MiniIndexBar для импорта */}
      <div style={{ display: "none" }}>
        <MiniIndexBar label="" value={0} color="" />
      </div>
    </div>
  );
}