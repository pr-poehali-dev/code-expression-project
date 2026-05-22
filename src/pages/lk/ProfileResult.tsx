import Icon from "@/components/ui/icon";
import {
  PROFILE_ACCENT, PROFILE_ACCENT_LIGHT, PROFILE_ACCENT_DARK,
  ProfileAnswers,
} from "./profile.types";
import { ProfileCalcResult, WeakZone } from "./profile.logic";
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer,
} from "recharts";
import { useState, useEffect } from "react";
import func2url from "../../../backend/func2url.json";

const G  = PROFILE_ACCENT;
const GL = PROFILE_ACCENT_LIGHT;
const GD = PROFILE_ACCENT_DARK;

export interface ProfileResultProps {
  result: ProfileCalcResult;
  answers: ProfileAnswers;
  onRetake: () => void;
  onBack: () => void;
  backLabel?: string;
  date?: string;
}

// ─── AI-блок ─────────────────────────────────────────────────────────────────

interface AiSection { title: string; content: string }

function AiProfileBlock({ result }: { result: ProfileCalcResult }) {
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [sections, setSections] = useState<AiSection[]>([]);

  useEffect(() => {
    setStatus("loading");
    const weakZones = result.weakZones.map(z => z.label);
    fetch(func2url["ai-profile"], {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        norm: result.norm,
        ifl: result.ifl,
        ifu: result.ifu,
        type_title: result.type.title,
        type_subtitle: result.type.subtitle,
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
    "ЧТО Я ВИЖУ": "Eye",
    "ГЛАВНЫЙ ФИНАНСОВЫЙ БЛОК": "Lock",
    "3 ШАГА НА ЭТОЙ НЕДЕЛЕ": "ListChecks",
    "ТВОЙ СЛЕДУЮЩИЙ УРОВЕНЬ": "TrendingUp",
  };

  const accent = "#4ade80";

  return (
    <div style={{
      background: "linear-gradient(135deg, #0a1f12 0%, #0f2d1a 100%)",
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

// ─── Вспомогательные компоненты ───────────────────────────────────────────────

function IndexBar({ label, value, isNegative }: { label: string; value: number; isNegative?: boolean }) {
  const color = isNegative
    ? (value <= 30 ? "#22c55e" : value <= 60 ? "#eab308" : "#ef4444")
    : (value >= 70 ? "#22c55e" : value >= 40 ? "#eab308" : "#ef4444");
  return (
    <div style={{ marginBottom: 14 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
        <span style={{ fontSize: 13, color: "#444", fontWeight: 500 }}>{label}</span>
        <span style={{ fontSize: 13, fontWeight: 700, color }}>{value}%</span>
      </div>
      <div style={{ height: 6, background: "#f0f0ec", borderRadius: 3 }}>
        <div style={{ width: `${value}%`, height: "100%", background: color, borderRadius: 3, transition: "width 0.8s ease" }} />
      </div>
    </div>
  );
}

function WeakZoneCard({ zone }: { zone: WeakZone }) {
  const isNeg = ["IDT", "IDM", "IIT"].includes(zone.index);
  const color  = isNeg ? "#ef4444" : "#3b82f6";
  return (
    <div style={{
      background: "#fff", borderRadius: 14, padding: "16px 18px",
      borderLeft: `3px solid ${color}`,
      boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
        <div>
          <div style={{ fontSize: 13, fontWeight: 700, color: "#1a1a1a", marginBottom: 2 }}>{zone.label}</div>
          <div style={{ fontSize: 12, color: "#aaa" }}>{zone.description}</div>
        </div>
        <div style={{ fontSize: 18, fontWeight: 900, color, marginLeft: 12 }}>{zone.value}%</div>
      </div>
      <div style={{ fontSize: 12, color: "#555", background: "#f9f9f7", borderRadius: 8, padding: "8px 12px", lineHeight: 1.6 }}>
        💡 {zone.tip}
      </div>
    </div>
  );
}

export default function ProfileResult({ result, onRetake, onBack, backLabel, date }: ProfileResultProps) {
  const { norm, ifu, ifl, level, type, weakZones, radarData } = result;

  return (
    <div style={{ fontFamily: "Montserrat, sans-serif", maxWidth: 620, margin: "0 auto" }}>
      {/* Кнопка назад */}
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
          Индекс финансового уровня
        </div>
        <div style={{ fontSize: "clamp(64px,10vw,88px)", fontWeight: 900, lineHeight: 1, marginBottom: 8 }}>
          {ifl}
        </div>
        <div style={{ fontSize: 18, fontWeight: 700, opacity: 0.9, marginBottom: 4 }}>
          {level.label}
        </div>
        {/* Шкала */}
        <div style={{ display: "flex", justifyContent: "center", gap: 4, marginTop: 16 }}>
          {[
            { max: 30, label: "Выживание", color: "#ef4444" },
            { max: 50, label: "Нестабил.", color: "#f97316" },
            { max: 70, label: "Базовая",  color: "#eab308" },
            { max: 85, label: "Устойч.",  color: "#22c55e" },
            { max: 100, label: "Системн.", color: "#14b8a6" },
          ].map((zone, i) => {
            const active = ifl <= zone.max && (i === 0 || ifl > [0, 30, 50, 70, 85][i]);
            return (
              <div key={zone.label} style={{
                flex: 1, height: 6, borderRadius: 3,
                background: active ? "#fff" : "rgba(255,255,255,0.3)",
                transition: "background 0.3s",
              }} />
            );
          })}
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 4 }}>
          <span style={{ fontSize: 10, opacity: 0.5 }}>0</span>
          <span style={{ fontSize: 10, opacity: 0.5 }}>100</span>
        </div>
      </div>

      {/* ТИП ПРОФИЛЯ */}
      <div style={{
        background: "#fff", borderRadius: 20, padding: "24px", marginBottom: 16,
        boxShadow: "0 2px 12px rgba(0,0,0,0.05)",
        borderLeft: `4px solid ${type.color}`,
      }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: G, textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 8 }}>
          Ваш финансовый тип
        </div>
        <div style={{ display: "flex", alignItems: "flex-start", gap: 14, marginBottom: 14 }}>
          <div style={{ width: 48, height: 48, borderRadius: 14, background: `${type.color}18`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <div style={{ fontSize: 22, fontWeight: 900, color: type.color, lineHeight: 1 }}>
              {["😰", "🛍️", "🧱", "🚀", "🧠"][Math.min(type.id - 1, 4)]}
            </div>
          </div>
          <div>
            <div style={{ fontSize: 18, fontWeight: 800, color: "#1a1a1a", marginBottom: 4 }}>{type.title}</div>
            <div style={{ fontSize: 13, color: type.color, fontWeight: 600 }}>{type.subtitle}</div>
          </div>
        </div>
        <p style={{ fontSize: 14, color: "#555", lineHeight: 1.7, margin: "0 0 14px" }}>
          {type.description}
        </p>
        <div style={{ background: GL, borderRadius: 12, padding: "12px 16px", borderLeft: `3px solid ${G}` }}>
          <div style={{ fontSize: 12, color: GD, fontWeight: 700, marginBottom: 4 }}>Ваш следующий уровень</div>
          <div style={{ fontSize: 13, color: "#444" }}>{type.nextStep}</div>
        </div>
      </div>

      {/* RADAR CHART */}
      <div style={{ background: "#fff", borderRadius: 20, padding: "24px", marginBottom: 16, boxShadow: "0 2px 12px rgba(0,0,0,0.05)" }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: G, textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 4 }}>
          Карта финансового профиля
        </div>
        <p style={{ fontSize: 12, color: "#aaa", margin: "0 0 16px" }}>
          Визуализация 7 ключевых измерений финансового мышления
        </p>
        <ResponsiveContainer width="100%" height={280}>
          <RadarChart data={radarData}>
            <PolarGrid stroke="#f0f0ec" />
            <PolarAngleAxis
              dataKey="subject"
              tick={{ fontSize: 11, fill: "#888", fontFamily: "Montserrat, sans-serif" }}
            />
            <Radar
              name="Профиль"
              dataKey="value"
              stroke={G}
              fill={G}
              fillOpacity={0.2}
              strokeWidth={2}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>

      {/* ВСЕ ИНДЕКСЫ */}
      <div style={{ background: "#fff", borderRadius: 20, padding: "24px", marginBottom: 16, boxShadow: "0 2px 12px rgba(0,0,0,0.05)" }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: G, textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 16 }}>
          Детальные индексы
        </div>
        <IndexBar label="Финансовая зрелость (IFZ)"     value={norm.IFZ} />
        <IndexBar label="Денежная тревожность (IDT)"     value={norm.IDT} isNegative />
        <IndexBar label="Накопления (IN)"                value={norm.IN} />
        <IndexBar label="Финансовая дисциплина (IFD)"    value={norm.IFD} />
        <IndexBar label="Дефицитное мышление (IDM)"      value={norm.IDM} isNegative />
        <IndexBar label="Денежная реализация (IDR)"      value={norm.IDR} />
        <IndexBar label="Импульсивные траты (IIT)"       value={norm.IIT} isNegative />
        <IndexBar label="Денежная самооценка (IDS)"      value={norm.IDS} />
        <div style={{ borderTop: "1px solid #f0f0ec", paddingTop: 14, marginTop: 4 }}>
          <IndexBar label="Финансовая устойчивость (IFU)" value={ifu} />
        </div>
      </div>

      {/* СЛАБЫЕ ЗОНЫ */}
      {weakZones.length > 0 && (
        <div style={{ background: "#fff", borderRadius: 20, padding: "24px", marginBottom: 16, boxShadow: "0 2px 12px rgba(0,0,0,0.05)" }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: G, textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 4 }}>
            Зоны роста
          </div>
          <p style={{ fontSize: 12, color: "#aaa", margin: "0 0 16px" }}>
            Эти области больше всего влияют на ваш финансовый уровень
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {weakZones.map(zone => <WeakZoneCard key={zone.index} zone={zone} />)}
          </div>
        </div>
      )}

      {/* ЧТО МЕШАЕТ ПЕРЕЙТИ ДАЛЬШЕ */}
      <div style={{ background: "#fff", borderRadius: 20, padding: "24px", marginBottom: 16, boxShadow: "0 2px 12px rgba(0,0,0,0.05)" }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: G, textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 14 }}>
          Что мешает перейти дальше
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {[
            { show: norm.IDT >= 50,  icon: "AlertCircle", color: "#ef4444",  text: "Страх и тревога вокруг денег блокируют финансовые решения" },
            { show: norm.IIT >= 50,  icon: "ShoppingCart", color: "#f97316", text: "Хаос в тратах не позволяет выстроить накопительную систему" },
            { show: norm.IDM >= 50,  icon: "Lock",         color: "#eab308", text: "Ограничивающие убеждения о деньгах создают невидимый потолок" },
            { show: norm.IFD <= 40,  icon: "LayoutList",   color: "#8b5cf6", text: "Отсутствие системы и планирования делает рост непредсказуемым" },
            { show: norm.IDS <= 40,  icon: "UserX",        color: "#3b82f6", text: "Низкая самооценка не позволяет брать высокую стоимость за работу" },
          ].filter(b => b.show).slice(0, 3).map((b, i) => (
            <div key={i} style={{
              display: "flex", gap: 12, alignItems: "flex-start",
              background: "#f9f9f7", borderRadius: 12, padding: "14px 16px",
            }}>
              <div style={{
                width: 32, height: 32, borderRadius: 10, background: `${b.color}18`,
                display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
              }}>
                <Icon name={b.icon} size={16} style={{ color: b.color }} />
              </div>
              <span style={{ fontSize: 13, color: "#444", lineHeight: 1.6, marginTop: 5 }}>{b.text}</span>
            </div>
          ))}
          {[norm.IDT, norm.IIT, norm.IDM].every(v => v < 50) && norm.IFD > 40 && norm.IDS > 40 && (
            <div style={{ background: GL, borderRadius: 12, padding: "14px 16px" }}>
              <div style={{ fontSize: 13, color: GD, fontWeight: 700 }}>
                ✓ Явных блоков не обнаружено — фокус на масштабировании
              </div>
            </div>
          )}
        </div>
      </div>

      {/* AI-заключение */}
      <AiProfileBlock result={result} />

      {/* Кнопки */}
      <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 40 }}>
        <button
          onClick={onRetake}
          style={{
            width: "100%", padding: "14px", borderRadius: 14, border: "none",
            background: `linear-gradient(135deg, ${G}, ${GD})`,
            color: "#fff", fontSize: 15, fontWeight: 700, cursor: "pointer",
            fontFamily: "Montserrat, sans-serif", boxShadow: `0 6px 20px ${G}44`,
          }}
        >
          Пройти снова
        </button>
        <button
          onClick={onBack}
          style={{
            width: "100%", padding: "14px", borderRadius: 14,
            border: `1.5px solid ${G}`,
            background: "transparent", color: G,
            fontSize: 15, fontWeight: 700, cursor: "pointer",
            fontFamily: "Montserrat, sans-serif",
          }}
        >
          К инструментам
        </button>
      </div>
    </div>
  );
}