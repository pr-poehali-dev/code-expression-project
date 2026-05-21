import { useState } from "react";
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer,
} from "recharts";
import Icon from "@/components/ui/icon";
import { QUESTIONS, BLOCK_COMMENTS } from "./mindset.types";
import { calcIndexes, calcIGP, getScaleLabel, getType } from "./mindset.logic";
import { BotShell, MiniIndexBar, ACCENT, ACCENT_LIGHT } from "./MindsetShared";

type Phase = "intro" | "quiz" | "block-end" | "result";

interface Props {
  onBack: () => void;
}

export default function MindsetBot({ onBack }: Props) {
  const [phase, setPhase] = useState<Phase>("intro");
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [selected, setSelected] = useState<number | null>(null);
  const [animating, setAnimating] = useState(false);
  const [blockEndData, setBlockEndData] = useState<{ block: number; blockTitle: string } | null>(null);

  const q = QUESTIONS[current];
  const total = QUESTIONS.length;
  const progress = Math.round((current / total) * 100);

  const handleSelect = (optIdx: number) => {
    if (animating) return;
    setSelected(optIdx);
  };

  const handleNext = () => {
    if (selected === null || animating) return;
    setAnimating(true);

    const newAnswers = { ...answers, [q.id]: selected };
    setAnswers(newAnswers);

    const nextIdx = current + 1;

    setTimeout(() => {
      setSelected(null);
      setAnimating(false);

      const isLastInBlock = nextIdx >= total || QUESTIONS[nextIdx].block !== q.block;

      if (nextIdx >= total) {
        setPhase("result");
      } else if (isLastInBlock) {
        setBlockEndData({ block: q.block, blockTitle: q.blockTitle });
        setCurrent(nextIdx);
        setPhase("block-end");
      } else {
        setCurrent(nextIdx);
      }
    }, 300);
  };

  // ─── INTRO ──────────────────────────────────────────────────────────────────
  if (phase === "intro") {
    return (
      <BotShell onBack={onBack} progress={0} step={0} total={total}>
        <div style={{ textAlign: "center", maxWidth: 520, margin: "0 auto", padding: "20px 0" }}>
          <div style={{
            width: 80, height: 80, borderRadius: 24,
            background: `linear-gradient(135deg, ${ACCENT}, hsl(185,85%,22%))`,
            display: "flex", alignItems: "center", justifyContent: "center",
            margin: "0 auto 24px",
            boxShadow: `0 12px 36px hsla(185,85%,32%,0.3)`,
          }}>
            <Icon name="Brain" size={36} style={{ color: "#fff" }} />
          </div>
          <h1 style={{ fontFamily: "Cormorant, serif", fontSize: "clamp(26px,3vw,36px)", fontWeight: 700, color: "#1a1a1a", margin: "0 0 12px" }}>
            Мышление с премиум-клиентами
          </h1>
          <p style={{ fontSize: 15, color: "#666", lineHeight: 1.75, marginBottom: 32 }}>
            12 вопросов · 7 блоков · ~5 минут<br />
            Вы получите индексы, тип мышления и конкретные рекомендации
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, marginBottom: 36 }}>
            {[
              { icon: "TrendingUp", label: "7 индексов" },
              { icon: "Target", label: "Радар-график" },
              { icon: "Lightbulb", label: "Рекомендации" },
            ].map(item => (
              <div key={item.label} style={{
                background: "#fff", borderRadius: 14, padding: "16px 10px", textAlign: "center",
                boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
              }}>
                <Icon name={item.icon} size={22} style={{ color: ACCENT, marginBottom: 8, display: "block", margin: "0 auto 8px" }} />
                <div style={{ fontSize: 12, fontWeight: 600, color: "#555" }}>{item.label}</div>
              </div>
            ))}
          </div>
          <button
            onClick={() => setPhase("quiz")}
            style={{
              padding: "14px 48px", borderRadius: 14, border: "none",
              background: `linear-gradient(135deg, ${ACCENT}, hsl(185,85%,22%))`,
              color: "#fff", fontSize: 16, fontWeight: 700,
              fontFamily: "Montserrat, sans-serif", cursor: "pointer",
              boxShadow: `0 8px 28px hsla(185,85%,32%,0.3)`,
              letterSpacing: 0.5,
            }}
          >
            Начать диагностику
          </button>
        </div>
      </BotShell>
    );
  }

  // ─── BLOCK END ──────────────────────────────────────────────────────────────
  if (phase === "block-end" && blockEndData) {
    const partialIdx = calcIndexes(answers);
    const completedBlock = blockEndData.block;

    return (
      <BotShell onBack={onBack} progress={progress} step={current} total={total}>
        <div style={{ maxWidth: 520, margin: "0 auto", padding: "10px 0" }}>
          <div style={{
            background: "#fff", borderRadius: 20, padding: "28px 28px",
            boxShadow: "0 4px 20px rgba(0,0,0,0.06)", marginBottom: 20,
          }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: ACCENT, textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 8 }}>
              Блок {completedBlock} завершён
            </div>
            <h2 style={{ fontFamily: "Cormorant, serif", fontSize: 22, fontWeight: 700, color: "#1a1a1a", margin: "0 0 14px" }}>
              {blockEndData.blockTitle}
            </h2>
            <p style={{ fontSize: 14, color: "#555", lineHeight: 1.75, margin: "0 0 20px" }}>
              {BLOCK_COMMENTS[completedBlock]}
            </p>
            <MiniIndexBar label="Уверенность" value={partialIdx.IU} color="hsl(280,60%,55%)" />
            <MiniIndexBar label="Границы" value={partialIdx.IPG} color={ACCENT} />
            <MiniIndexBar label="Самоценность" value={partialIdx.ICS} color="hsl(145,60%,40%)" />
          </div>
          <button
            onClick={() => setPhase("quiz")}
            style={{
              width: "100%", padding: "13px", borderRadius: 14, border: "none",
              background: `linear-gradient(135deg, ${ACCENT}, hsl(185,85%,22%))`,
              color: "#fff", fontSize: 15, fontWeight: 700,
              fontFamily: "Montserrat, sans-serif", cursor: "pointer",
            }}
          >
            Продолжить →
          </button>
        </div>
      </BotShell>
    );
  }

  // ─── RESULT ─────────────────────────────────────────────────────────────────
  if (phase === "result") {
    const idx = calcIndexes(answers);
    const igp = calcIGP(idx);
    const scale = getScaleLabel(igp);
    const type = getType(idx);

    const radarData = [
      { subject: "Уверенность", value: idx.IU, fullMark: 100 },
      { subject: "Границы", value: idx.IPG, fullMark: 100 },
      { subject: "Самоценность", value: idx.ICS, fullMark: 100 },
      { subject: "Коммуникация", value: idx.IZK, fullMark: 100 },
      { subject: "Премиальность", value: idx.IPM, fullMark: 100 },
      { subject: "Независимость", value: 100 - idx.IDO, fullMark: 100 },
    ];

    const allIndexes: { key: keyof typeof idx; label: string; color: string; invert?: boolean }[] = [
      { key: "IU",  label: "Уверенность",              color: "hsl(280,60%,55%)" },
      { key: "IPM", label: "Премиальное мышление",      color: ACCENT },
      { key: "IPG", label: "Профессиональные границы",  color: "hsl(145,60%,40%)" },
      { key: "ICS", label: "Ценность себя",             color: "hsl(35,85%,52%)" },
      { key: "IZK", label: "Зрелость коммуникации",     color: "hsl(210,70%,50%)" },
      { key: "IDO", label: "Зависимость от одобрения",  color: "#f97316", invert: true },
      { key: "ISD", label: "Страх денег",               color: "#ef4444", invert: true },
    ];

    return (
      <BotShell onBack={onBack} progress={100} step={total} total={total} hideBack>
        <div style={{ maxWidth: 640, margin: "0 auto" }}>
          {/* Главный результат */}
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

          {/* Радар-график */}
          <div style={{ background: "#fff", borderRadius: 20, padding: "24px 28px", marginBottom: 16, boxShadow: "0 2px 12px rgba(0,0,0,0.05)" }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: "#1a1a1a", marginBottom: 16 }}>Профиль мышления</div>
            <ResponsiveContainer width="100%" height={260}>
              <RadarChart data={radarData} margin={{ top: 10, right: 30, bottom: 10, left: 30 }}>
                <PolarGrid stroke="#f0f0ec" />
                <PolarAngleAxis dataKey="subject" tick={{ fontSize: 11, fill: "#888", fontFamily: "Montserrat, sans-serif" }} />
                <Radar
                  name="Профиль"
                  dataKey="value"
                  stroke={ACCENT}
                  fill={ACCENT}
                  fillOpacity={0.25}
                  strokeWidth={2}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>

          {/* Детальные индексы */}
          <div style={{ background: "#fff", borderRadius: 20, padding: "24px 28px", marginBottom: 16, boxShadow: "0 2px 12px rgba(0,0,0,0.05)" }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: "#1a1a1a", marginBottom: 18 }}>Детальные индексы</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {allIndexes.map(item => {
                const val = item.invert ? 100 - idx[item.key] : idx[item.key];
                const rawVal = idx[item.key];
                return (
                  <div key={item.key}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                      <span style={{ fontSize: 13, color: "#444", fontWeight: 600 }}>{item.label}</span>
                      <span style={{ fontSize: 13, fontWeight: 700, color: item.color }}>
                        {rawVal}%
                        {item.invert && <span style={{ fontSize: 11, color: "#aaa", marginLeft: 4 }}>(инв. {val}%)</span>}
                      </span>
                    </div>
                    <div style={{ height: 6, background: "#f0f0ec", borderRadius: 3, overflow: "hidden" }}>
                      <div style={{
                        width: `${rawVal}%`, height: "100%",
                        background: item.color, borderRadius: 3,
                        transition: "width 1s ease",
                      }} />
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
            <button
              onClick={() => { setPhase("intro"); setCurrent(0); setAnswers({}); setSelected(null); }}
              style={{
                flex: 1, padding: "13px", borderRadius: 14,
                border: `1.5px solid ${ACCENT}`, background: "transparent",
                color: ACCENT, fontSize: 14, fontWeight: 700,
                fontFamily: "Montserrat, sans-serif", cursor: "pointer",
              }}
            >
              Пройти снова
            </button>
            <button
              onClick={onBack}
              style={{
                flex: 1, padding: "13px", borderRadius: 14, border: "none",
                background: `linear-gradient(135deg, ${ACCENT}, hsl(185,85%,22%))`,
                color: "#fff", fontSize: 14, fontWeight: 700,
                fontFamily: "Montserrat, sans-serif", cursor: "pointer",
              }}
            >
              К инструментам
            </button>
          </div>
        </div>
      </BotShell>
    );
  }

  // ─── QUIZ ───────────────────────────────────────────────────────────────────
  return (
    <BotShell onBack={onBack} progress={progress} step={current + 1} total={total}>
      <div style={{ maxWidth: 520, margin: "0 auto" }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: ACCENT, textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 6 }}>
          Блок {q.block} · {q.blockTitle}
        </div>

        <h2 style={{
          fontFamily: "Cormorant, serif", fontSize: "clamp(20px,2.5vw,28px)",
          fontWeight: 700, color: "#1a1a1a", margin: "0 0 28px", lineHeight: 1.3,
        }}>
          {q.text}
        </h2>

        <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 28 }}>
          {q.options.map((opt, i) => {
            const isSelected = selected === i;
            return (
              <button
                key={i}
                onClick={() => handleSelect(i)}
                style={{
                  padding: "16px 20px", borderRadius: 14, textAlign: "left",
                  border: isSelected ? `2px solid ${ACCENT}` : "1.5px solid #e8e8e0",
                  background: isSelected ? ACCENT_LIGHT : "#fff",
                  color: isSelected ? ACCENT : "#333",
                  fontSize: 15, fontWeight: isSelected ? 700 : 400,
                  cursor: "pointer", fontFamily: "Montserrat, sans-serif",
                  transition: "all 0.15s",
                  boxShadow: isSelected ? `0 4px 16px hsla(185,85%,32%,0.15)` : "0 2px 8px rgba(0,0,0,0.04)",
                  display: "flex", alignItems: "center", gap: 14,
                }}
              >
                <span style={{
                  width: 28, height: 28, borderRadius: 8, flexShrink: 0,
                  background: isSelected ? ACCENT : "#f4f4f0",
                  color: isSelected ? "#fff" : "#999",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 12, fontWeight: 700, transition: "all 0.15s",
                }}>
                  {String.fromCharCode(65 + i)}
                </span>
                {opt.text}
              </button>
            );
          })}
        </div>

        <button
          onClick={handleNext}
          disabled={selected === null}
          style={{
            width: "100%", padding: "14px", borderRadius: 14, border: "none",
            background: selected !== null
              ? `linear-gradient(135deg, ${ACCENT}, hsl(185,85%,22%))`
              : "#e8e8e0",
            color: selected !== null ? "#fff" : "#bbb",
            fontSize: 15, fontWeight: 700,
            fontFamily: "Montserrat, sans-serif",
            cursor: selected !== null ? "pointer" : "not-allowed",
            transition: "all 0.2s",
            boxShadow: selected !== null ? `0 8px 24px hsla(185,85%,32%,0.25)` : "none",
          }}
        >
          {current + 1 === total ? "Получить результат" : "Следующий вопрос →"}
        </button>
      </div>
    </BotShell>
  );
}