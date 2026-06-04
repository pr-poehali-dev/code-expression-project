import { useState } from "react";
import Icon from "@/components/ui/icon";
import { QUESTIONS, BLOCK_COMMENTS } from "./mindset.types";
import { calcIndexes, calcIGP, getType } from "./mindset.logic";
import { BotShell, MiniIndexBar, ACCENT, ACCENT_LIGHT } from "./MindsetShared";
import { lkApi } from "@/lib/lkApi";
import MindsetResult from "./MindsetResult";

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
        // Сохраняем результат автоматически
        const finalAnswers = { ...answers, [q.id]: selected };
        const idx = calcIndexes(finalAnswers);
        const igp = calcIGP(idx);
        const type = getType(idx);
        lkApi.mindsetSave({ igp, indexes: idx, type_title: type.title, answers: finalAnswers }).catch(() => {});
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
          <p style={{ fontSize: 15, color: "#666", lineHeight: 1.75, marginBottom: 16 }}>
            12 вопросов · 7 блоков · ~5 минут<br />
            Вы получите индексы, тип мышления и конкретные рекомендации
          </p>
          <div style={{ padding: "12px 16px", background: "hsl(185,85%,97%)", borderRadius: 12, border: "1px solid hsl(185,85%,85%)", marginBottom: 32 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: "#0F172A", marginBottom: 4 }}>Как пользоваться и почему это выгодно</div>
            <div style={{ fontSize: 13, color: "#475569", lineHeight: 1.65 }}>
              Пройдите тест из 12 вопросов — ИИ определит ваш тип мышления и выдаст конкретные точки роста в работе с клиентами высокого сегмента.<br />
              Большинство специалистов теряют премиум-клиентов не из-за недостатка навыков, а из-за внутренней неуверенности. Тест помогает увидеть это и начать работу над собой.
            </div>
          </div>
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
    return (
      <MindsetResult
        idx={idx}
        onRetake={() => { setPhase("intro"); setCurrent(0); setAnswers({}); setSelected(null); }}
        onBack={onBack}
      />
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