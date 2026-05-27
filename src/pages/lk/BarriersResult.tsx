import { RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer } from "recharts";
import Icon from "@/components/ui/icon";
import { BarrierIndexMap, calcIIB, calcIPZ, getBarrierScaleLabel, getBarrierType } from "./barriers.logic";
import { ACCENT_LIGHT } from "./MindsetShared";
import { useState, useEffect } from "react";
import func2url from "../../../backend/func2url.json";

const WARM = "hsl(20,85%,50%)";
const WARM_LIGHT = "hsl(20,85%,96%)";

interface Props {
  idx: BarrierIndexMap;
  date?: string;
  onRetake: () => void;
  onBack: () => void;
  backLabel?: string;
}

// ─── AI-блок ─────────────────────────────────────────────────────────────────

interface AiSection { title: string; content: string }

function AiBarriersBlock({ idx, iib, typeTitle }: { idx: BarrierIndexMap; iib: number; typeTitle: string }) {
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [sections, setSections] = useState<AiSection[]>([]);

  useEffect(() => {
    setStatus("loading");
    fetch(func2url["ai-barriers"], {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ idx, iib, type_title: typeTitle }),
    })
      .then(r => r.json())
      .then(data => {
        if (data.sections) {
          const parsed: AiSection[] = Object.entries(data.sections).map(([title, content]) => ({
            title,
            content: content as string,
          }));
          setSections(parsed);
          setStatus("done");
        } else {
          setStatus("error");
        }
      })
      .catch(() => setStatus("error"));
  }, []);

  const sectionIcons: Record<string, string> = {
    "ЧТО Я ВИЖУ": "Eye",
    "КОРЕНЬ ПРОБЛЕМЫ": "Target",
    "3 ПРАКТИЧЕСКИХ ШАГА": "ListChecks",
    "К ЧЕМУ ЭТО ПРИВЕДЁТ": "TrendingUp",
  };

  return (
    <div style={{
      background: "linear-gradient(135deg, #1c0f0a 0%, #2d1a10 100%)",
      borderRadius: 20, padding: "24px 24px", marginBottom: 24,
      boxShadow: "0 8px 32px rgba(0,0,0,0.18)",
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
        <div style={{
          width: 36, height: 36, borderRadius: 10,
          background: "rgba(255,255,255,0.1)",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <Icon name="Sparkles" size={18} style={{ color: "#fb923c" }} />
        </div>
        <div>
          <div style={{ fontSize: 13, fontWeight: 800, color: "#fff", letterSpacing: 0.3 }}>AI-заключение</div>
          <div style={{ fontSize: 11, color: "rgba(255,255,255,0.45)", marginTop: 1 }}>Персональный разбор от ментора</div>
        </div>
      </div>

      {status === "loading" && (
        <div style={{ display: "flex", alignItems: "center", gap: 10, color: "rgba(255,255,255,0.55)", fontSize: 13, padding: "8px 0" }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" style={{ animation: "spin 1s linear infinite", flexShrink: 0 }}>
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeDasharray="31.4 31.4" />
          </svg>
          Анализирую твой профиль...
          <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
        </div>
      )}

      {status === "error" && (
        <div style={{ color: "#fca5a5", fontSize: 13, lineHeight: 1.6 }}>
          Не удалось загрузить анализ. Проверь подключение или попробуй позже.
        </div>
      )}

      {status === "done" && sections.map((sec, i) => (
        <div key={i} style={{ marginBottom: i < sections.length - 1 ? 20 : 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
            <Icon
              name={sectionIcons[sec.title] || "ChevronRight"}
              size={14}
              style={{ color: "#fb923c", flexShrink: 0 }}
            />
            <span style={{ fontSize: 11, fontWeight: 800, color: "#fb923c", textTransform: "uppercase", letterSpacing: 1.2 }}>
              {sec.title}
            </span>
          </div>
          <div style={{ fontSize: 14, color: "rgba(255,255,255,0.82)", lineHeight: 1.75, paddingLeft: 22 }}>
            {sec.content.split("\n").map((line, j) => {
              const isStep = /^\d+\./.test(line.trim()) || line.trim().startsWith("•") || line.trim().startsWith("-");
              return line.trim() ? (
                <p key={j} style={{ margin: isStep ? "4px 0" : "0 0 4px", fontWeight: isStep ? 600 : 400 }}>
                  {line.trim().replace(/^[-•]\s*/, "")}
                </p>
              ) : null;
            })}
          </div>
          {i < sections.length - 1 && (
            <div style={{ height: 1, background: "rgba(255,255,255,0.07)", marginTop: 16 }} />
          )}
        </div>
      ))}
    </div>
  );
}

// ─── Вспомогательный компонент ────────────────────────────────────────────────

function IndexBar({ label, value, color, invert }: { label: string; value: number; color: string; invert?: boolean }) {
  const display = invert ? 100 - value : value;
  return (
    <div style={{ marginBottom: 12 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
        <span style={{ fontSize: 13, color: "#444", fontWeight: 600 }}>{label}</span>
        <span style={{ fontSize: 13, fontWeight: 700, color }}>
          {value}%
          {invert && <span style={{ fontSize: 11, color: "#aaa", marginLeft: 4 }}>(инв. {display}%)</span>}
        </span>
      </div>
      <div style={{ height: 6, background: "#f0f0ec", borderRadius: 3, overflow: "hidden" }}>
        <div style={{ width: `${value}%`, height: "100%", background: color, borderRadius: 3, transition: "width 1s ease" }} />
      </div>
    </div>
  );
}

export default function BarriersResult({ idx, date, onRetake, onBack, backLabel = "К инструментам" }: Props) {
  const iib = calcIIB(idx);
  const ipz = calcIPZ(idx);
  const scale = getBarrierScaleLabel(iib);
  const type = getBarrierType(idx);

  const radarData = [
    { subject: "Опора",        value: idx.IVO,           fullMark: 100 },
    { subject: "Устойчивость", value: 100 - idx.ISS,     fullMark: 100 },
    { subject: "Деньги",       value: 100 - idx.ISD,     fullMark: 100 },
    { subject: "Зависимость",  value: 100 - idx.IDO,     fullMark: 100 },
    { subject: "Выгорание",    value: 100 - idx.IEI,     fullMark: 100 },
    { subject: "Проявленность",value: 100 - idx.ISP,     fullMark: 100 },
    { subject: "Зрелость",     value: ipz,               fullMark: 100 },
  ];

  const allIndexes: { label: string; value: number; color: string; invert?: boolean }[] = [
    { label: "Внутренняя опора",         value: idx.IVO,    color: "#14b8a6" },
    { label: "Профессиональная зрелость",value: ipz,        color: WARM },
    { label: "Синдром самозванца",       value: idx.ISS,    color: "#ef4444", invert: true },
    { label: "Страх денег",              value: idx.ISD,    color: "#f97316", invert: true },
    { label: "Страх проявленности",      value: idx.ISP,    color: "#a855f7", invert: true },
    { label: "Зависимость от оценки",    value: idx.IDO,    color: "#eab308", invert: true },
    { label: "Избегание роста",          value: idx.IIR,    color: "#f43f5e", invert: true },
    { label: "Эмоциональное истощение",  value: idx.IEI,    color: "#6366f1", invert: true },
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
        {date && <span style={{ fontSize: 12, color: "#bbb" }}>{date}</span>}
      </div>

      {/* Главный индекс IIB */}
      <div style={{
        background: `linear-gradient(135deg, ${WARM}, hsl(20,85%,36%))`,
        borderRadius: 20, padding: "28px 28px", marginBottom: 20, color: "#fff",
        boxShadow: "0 12px 40px hsla(20,85%,50%,0.3)",
      }}>
        <div style={{ fontSize: 11, opacity: 0.7, textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 6 }}>
          Индекс внутренних барьеров (IIB)
        </div>
        <div style={{ display: "flex", alignItems: "flex-end", gap: 16, marginBottom: 16 }}>
          <div style={{ fontSize: "clamp(52px,6vw,72px)", fontWeight: 900, lineHeight: 1, letterSpacing: -2 }}>
            {iib}
          </div>
          <div style={{ fontSize: 24, opacity: 0.6, marginBottom: 8 }}>/100</div>
        </div>
        <div style={{
          display: "inline-block", background: "rgba(255,255,255,0.2)",
          borderRadius: 20, padding: "4px 14px", fontSize: 13, fontWeight: 700, marginBottom: 16,
        }}>
          {scale.label}
        </div>
        <div style={{ fontSize: 12, opacity: 0.75, marginBottom: 12 }}>
          0 — нет барьеров · 100 — полный внутренний саботаж
        </div>
        <div style={{ height: 6, background: "rgba(255,255,255,0.2)", borderRadius: 3 }}>
          <div style={{ width: `${iib}%`, height: "100%", background: "#fff", borderRadius: 3, transition: "width 1s ease" }} />
        </div>
      </div>

      {/* Главный барьер */}
      <div style={{
        background: "#fff", borderRadius: 20, padding: "24px 28px", marginBottom: 16,
        borderLeft: `4px solid ${WARM}`, boxShadow: "0 2px 12px rgba(0,0,0,0.05)",
      }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: "#aaa", textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 8 }}>
          Главный барьер
        </div>
        <div style={{ fontSize: 18, fontWeight: 700, color: WARM, marginBottom: 6 }}>
          {type.primaryBarrier}
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
        <div style={{ fontSize: 13, fontWeight: 700, color: "#1a1a1a", marginBottom: 4 }}>Профиль барьеров</div>
        <div style={{ fontSize: 12, color: "#aaa", marginBottom: 12 }}>Чем ближе к 100 — тем меньше барьер</div>
        <ResponsiveContainer width="100%" height={260}>
          <RadarChart data={radarData} margin={{ top: 10, right: 30, bottom: 10, left: 30 }}>
            <PolarGrid stroke="#f0f0ec" />
            <PolarAngleAxis dataKey="subject" tick={{ fontSize: 11, fill: "#888", fontFamily: "Montserrat, sans-serif" }} />
            <Radar name="Профиль" dataKey="value" stroke={WARM} fill={WARM} fillOpacity={0.2} strokeWidth={2} />
          </RadarChart>
        </ResponsiveContainer>
      </div>

      {/* Детальные индексы */}
      <div style={{ background: "#fff", borderRadius: 20, padding: "24px 28px", marginBottom: 16, boxShadow: "0 2px 12px rgba(0,0,0,0.05)" }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: "#1a1a1a", marginBottom: 18 }}>Детальные индексы</div>
        {allIndexes.map(item => (
          <IndexBar key={item.label} label={item.label} value={item.value} color={item.color} invert={item.invert} />
        ))}
      </div>

      {/* Что мешает */}
      {type.whatBlocks.length > 0 && (
        <div style={{
          background: "#fff", borderRadius: 20, padding: "24px 28px", marginBottom: 16,
          borderLeft: "4px solid #f97316", boxShadow: "0 2px 12px rgba(0,0,0,0.05)",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
            <Icon name="AlertTriangle" size={18} style={{ color: "#f97316" }} />
            <div style={{ fontSize: 13, fontWeight: 700, color: "#1a1a1a" }}>Что мешает профессиональному росту</div>
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {type.whatBlocks.map(z => (
              <span key={z} style={{
                padding: "5px 12px", borderRadius: 20, fontSize: 13,
                background: WARM_LIGHT, color: WARM, fontWeight: 600,
                border: `1px solid hsl(20,85%,85%)`,
              }}>{z}</span>
            ))}
          </div>
        </div>
      )}

      {/* Рекомендации */}
      <div style={{ background: "#fff", borderRadius: 20, padding: "24px 28px", marginBottom: 24, boxShadow: "0 2px 12px rgba(0,0,0,0.05)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
          <Icon name="Lightbulb" size={18} style={{ color: WARM }} />
          <div style={{ fontSize: 13, fontWeight: 700, color: "#1a1a1a" }}>Рекомендации</div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {type.recs.map((rec, i) => (
            <div key={i} style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
              <div style={{
                width: 24, height: 24, borderRadius: 8, background: WARM_LIGHT,
                color: WARM, fontSize: 12, fontWeight: 700,
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
          border: `1.5px solid ${WARM}`, background: "transparent",
          color: WARM, fontSize: 14, fontWeight: 700,
          fontFamily: "Montserrat, sans-serif", cursor: "pointer",
        }}>
          Пройти снова
        </button>
        <button onClick={onBack} style={{
          flex: 1, padding: "13px", borderRadius: 14, border: "none",
          background: `linear-gradient(135deg, ${WARM}, hsl(20,85%,36%))`,
          color: "#fff", fontSize: 14, fontWeight: 700,
          fontFamily: "Montserrat, sans-serif", cursor: "pointer",
        }}>
          {backLabel}
        </button>
      </div>

      <div style={{ display: "none" }}>
        <div style={{ background: ACCENT_LIGHT }} />
      </div>
    </div>
  );
}