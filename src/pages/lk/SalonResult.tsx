import Icon from "@/components/ui/icon";
import { SalonCalcResult } from "./salon.logic";
import { SalonHistoryItem } from "./LkTestsTypes";
import { G, GD } from "./SalonResultShared";
import { ProgressBlock } from "./SalonResultProgress";
import { SalonResultCharts } from "./SalonResultCharts";
import { useState, useEffect } from "react";
import func2url from "../../../backend/func2url.json";

// ─── AI-блок ─────────────────────────────────────────────────────────────────

interface AiSection { title: string; content: string }

function AiSalonBlock({ result }: { result: SalonCalcResult }) {
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [sections, setSections] = useState<AiSection[]>([]);

  useEffect(() => {
    setStatus("loading");
    const weakZones = result.weakZones.map(z => z.label);
    fetch(func2url["ai-salon"], {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        norm: result.norm,
        ips: result.ips,
        ipp_loss: result.ippLoss,
        type_title: result.type.title,
        hidden_money: result.hiddenMoney?.totalPotential ?? 0,
        weak_zones: weakZones,
      }),
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
    "ЧТО Я ВИЖУ В ТВОЁМ САЛОНЕ": "Eye",
    "ГЛАВНАЯ ТОЧКА ПОТЕРЬ": "AlertTriangle",
    "3 ДЕЙСТВИЯ НА ЭТОЙ НЕДЕЛЕ": "ListChecks",
    "ПОТЕНЦИАЛ РОСТА": "TrendingUp",
  };

  const accent = "#f472b6";

  return (
    <div style={{
      background: "linear-gradient(135deg, #1a0a14 0%, #2d1022 100%)",
      borderRadius: 20, padding: "24px", marginBottom: 16,
      boxShadow: "0 8px 32px rgba(0,0,0,0.18)",
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
        <div style={{
          width: 36, height: 36, borderRadius: 10,
          background: "rgba(255,255,255,0.1)",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <Icon name="Sparkles" size={18} style={{ color: accent }} />
        </div>
        <div>
          <div style={{ fontSize: 13, fontWeight: 800, color: "#fff", letterSpacing: 0.3 }}>AI-заключение</div>
          <div style={{ fontSize: 11, color: "rgba(255,255,255,0.45)", marginTop: 1 }}>Персональный разбор от консультанта</div>
        </div>
      </div>

      {status === "loading" && (
        <div style={{ display: "flex", alignItems: "center", gap: 10, color: "rgba(255,255,255,0.55)", fontSize: 13, padding: "8px 0" }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" style={{ animation: "spin 1s linear infinite", flexShrink: 0 }}>
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeDasharray="31.4 31.4" />
          </svg>
          Анализирую показатели салона...
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
              style={{ color: accent, flexShrink: 0 }}
            />
            <span style={{ fontSize: 11, fontWeight: 800, color: accent, textTransform: "uppercase", letterSpacing: 1.2 }}>
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

// ─────────────────────────────────────────────────────────────────────────────

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