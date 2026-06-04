import { useState } from "react";
import Icon from "@/components/ui/icon";
import { BARRIER_QUESTIONS, BARRIER_BLOCK_COMMENTS } from "./barriers.types";
import { calcBarrierIndexes, calcIIB, getBarrierType } from "./barriers.logic";
import { BotShell, MiniIndexBar, ACCENT, ACCENT_LIGHT } from "./MindsetShared";
import { lkApi } from "@/lib/lkApi";
import BarriersResult from "./BarriersResult";

const WARM = "hsl(20,85%,50%)";
const WARM_LIGHT = "hsl(20,85%,96%)";

type Phase = "intro" | "quiz" | "block-end" | "result";

const total = BARRIER_QUESTIONS.length;

function getBlocks(): number[] {
  const seen = new Set<number>();
  BARRIER_QUESTIONS.forEach(q => seen.add(q.block));
  return Array.from(seen).sort((a, b) => a - b);
}

const blocks = getBlocks();

interface Props {
  onBack: () => void;
  onRetake?: () => void;
  showShare?: boolean;
}

export default function BarriersBot({ onBack, onRetake, showShare = false }: Props) {
  const [phase, setPhase] = useState<Phase>("intro");
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [selected, setSelected] = useState<number | null>(null);
  const [completedBlock, setCompletedBlock] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);

  const q = BARRIER_QUESTIONS[current];
  const progress = Math.round((current / total) * 100);

  function handleSelect(optIdx: number) {
    setSelected(optIdx);
  }

  async function handleNext() {
    if (selected === null) return;
    const newAnswers = { ...answers, [q.id]: selected };
    setAnswers(newAnswers);
    setSelected(null);

    const isLastInBlock = current + 1 >= total || BARRIER_QUESTIONS[current + 1].block !== q.block;

    if (isLastInBlock && current + 1 < total) {
      setCompletedBlock(q.block);
      setPhase("block-end");
      setCurrent(current + 1);
      return;
    }

    if (current + 1 >= total) {
      const idx = calcBarrierIndexes(newAnswers);
      const iib = calcIIB(idx);
      const type = getBarrierType(idx);
      setSaving(true);
      try {
        await lkApi.barriersSave({
          iib,
          indexes: idx,
          type_title: type.title,
          answers: newAnswers,
        });
      } catch (_) { /* silent */ }
      setSaving(false);
      setPhase("result");
      return;
    }

    setCurrent(current + 1);
  }

  // ─── INTRO ───────────────────────────────────────────────────────────────────
  if (phase === "intro") {
    return (
      <BotShell onBack={onBack} progress={0} step={0} total={total}>
        <div style={{ maxWidth: 520, margin: "0 auto" }}>
          <div style={{
            background: `linear-gradient(135deg, ${WARM}, hsl(20,85%,36%))`,
            borderRadius: 20, padding: "32px 28px", marginBottom: 24, color: "#fff",
            boxShadow: "0 12px 40px hsla(20,85%,50%,0.3)",
          }}>
            <div style={{ fontSize: 11, opacity: 0.7, textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 10 }}>
              Психодиагностический инструмент
            </div>
            <h1 style={{ fontFamily: "Cormorant, serif", fontSize: "clamp(26px,4vw,36px)", fontWeight: 700, margin: "0 0 12px", lineHeight: 1.2 }}>
              Внутренние барьеры специалиста
            </h1>
            <p style={{ fontSize: 14, opacity: 0.85, lineHeight: 1.8, margin: "0 0 16px" }}>
              Выяви психологические блоки, которые мешают профессиональному росту
            </p>
            <div style={{ padding: "12px 16px", background: "rgba(255,255,255,0.12)", borderRadius: 12, border: "1px solid rgba(255,255,255,0.2)" }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: "#fff", marginBottom: 4 }}>Как пользоваться и почему это выгодно</div>
              <div style={{ fontSize: 13, color: "rgba(255,255,255,0.8)", lineHeight: 1.65 }}>
                Ответьте на вопросы теста — ИИ выявит конкретные психологические барьеры и даст рекомендации по каждому блоку.<br />
                Психологические блоки — главная причина, почему специалисты застревают на одном уровне дохода годами. Тест помогает увидеть их и начать убирать.
              </div>
            </div>
          </div>

          <div style={{ background: "#fff", borderRadius: 20, padding: "24px 28px", marginBottom: 16, boxShadow: "0 2px 12px rgba(0,0,0,0.05)" }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: "#1a1a1a", marginBottom: 14 }}>Что вы узнаете:</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {[
                ["Search",        "Главный барьер, который тормозит ваш рост"],
                ["Banknote",      "Скрытые страхи вокруг денег и продаж"],
                ["ShieldCheck",   "Уровень внутренней опоры и устойчивости"],
                ["Flame",         "Признаки эмоционального выгорания"],
                ["Target",        "Конкретные рекомендации по каждому блоку"],
              ].map(([icon, text]) => (
                <div key={text as string} style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
                  <div style={{
                    width: 28, height: 28, borderRadius: 8, flexShrink: 0,
                    background: `${WARM}18`, display: "flex", alignItems: "center", justifyContent: "center",
                  }}>
                    <Icon name={icon as string} size={14} style={{ color: WARM }} />
                  </div>
                  <span style={{ fontSize: 14, color: "#444", lineHeight: 1.5, marginTop: 4 }}>{text}</span>
                </div>
              ))}
            </div>
          </div>

          <div style={{ background: "#fff", borderRadius: 16, padding: "16px 20px", marginBottom: 24, boxShadow: "0 2px 8px rgba(0,0,0,0.04)", border: "1.5px solid #f0f0ec" }}>
            <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
              {[
                ["8", "блоков диагностики"],
                ["15", "вопросов"],
                ["8", "индексов"],
              ].map(([num, label]) => (
                <div key={label} style={{ textAlign: "center" }}>
                  <div style={{ fontSize: 28, fontWeight: 900, color: WARM, lineHeight: 1 }}>{num}</div>
                  <div style={{ fontSize: 11, color: "#aaa", marginTop: 2 }}>{label}</div>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={() => setPhase("quiz")}
            style={{
              width: "100%", padding: "15px", borderRadius: 14, border: "none",
              background: `linear-gradient(135deg, ${WARM}, hsl(20,85%,36%))`,
              color: "#fff", fontSize: 16, fontWeight: 700,
              fontFamily: "Montserrat, sans-serif", cursor: "pointer",
              boxShadow: "0 8px 24px hsla(20,85%,50%,0.3)",
            }}
          >
            Начать диагностику →
          </button>
        </div>
      </BotShell>
    );
  }

  // ─── BLOCK END ───────────────────────────────────────────────────────────────
  if (phase === "block-end" && completedBlock !== null) {
    const partialAnswers = answers;
    const partialIdx = calcBarrierIndexes(partialAnswers);
    const blockNum = completedBlock;

    const miniItems: { label: string; value: number; color: string }[] = [
      { label: "Внутренняя опора", value: partialIdx.IVO, color: WARM },
      { label: "Самозванец",       value: partialIdx.ISS, color: "#ef4444" },
      { label: "Страх денег",      value: partialIdx.ISD, color: "#f97316" },
    ];

    return (
      <BotShell onBack={onBack} progress={progress} step={current} total={total}>
        <div style={{ maxWidth: 520, margin: "0 auto" }}>
          <div style={{
            background: `linear-gradient(135deg, ${WARM}, hsl(20,85%,36%))`,
            borderRadius: 20, padding: "24px 28px", marginBottom: 20, color: "#fff",
          }}>
            <div style={{ fontSize: 11, opacity: 0.7, textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 8 }}>
              Блок {blockNum} завершён
            </div>
            <h2 style={{ fontFamily: "Cormorant, serif", fontSize: 24, fontWeight: 700, margin: "0 0 4px" }}>
              {BARRIER_QUESTIONS.find(q => q.block === blockNum)?.blockTitle}
            </h2>
          </div>

          <div style={{
            background: "#fff", borderRadius: 20, padding: "24px 28px", marginBottom: 20,
            boxShadow: "0 2px 12px rgba(0,0,0,0.05)",
          }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: "#aaa", letterSpacing: 1.2, textTransform: "uppercase", marginBottom: 12 }}>
              Промежуточный инсайт
            </div>
            <p style={{ fontSize: 14, color: "#444", lineHeight: 1.8, margin: "0 0 20px" }}>
              {BARRIER_BLOCK_COMMENTS[blockNum]}
            </p>
            {miniItems.map(item => (
              <MiniIndexBar key={item.label} label={item.label} value={item.value} color={item.color} />
            ))}
          </div>

          <button
            onClick={() => setPhase("quiz")}
            style={{
              width: "100%", padding: "13px", borderRadius: 14, border: "none",
              background: `linear-gradient(135deg, ${WARM}, hsl(20,85%,36%))`,
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

  // ─── RESULT ──────────────────────────────────────────────────────────────────
  if (phase === "result") {
    const idx = calcBarrierIndexes(answers);
    return (
      <BarriersResult
        idx={idx}
        onRetake={onRetake ?? (() => { setPhase("intro"); setCurrent(0); setAnswers({}); setSelected(null); })}
        onBack={onBack}
        showShare={showShare}
      />
    );
  }

  // ─── QUIZ ────────────────────────────────────────────────────────────────────
  const isBlockFirst = current === 0 || BARRIER_QUESTIONS[current - 1]?.block !== q.block;

  return (
    <BotShell onBack={onBack} progress={progress} step={current + 1} total={total}>
      <div style={{ maxWidth: 520, margin: "0 auto" }}>
        {isBlockFirst && (
          <div style={{ fontSize: 11, fontWeight: 700, color: WARM, textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 6 }}>
            Блок {q.block} · {q.blockTitle}
          </div>
        )}

        <h2 style={{
          fontFamily: "Cormorant, serif", fontSize: "clamp(20px,3vw,26px)",
          fontWeight: 700, color: "#1a1a1a", margin: "0 0 24px", lineHeight: 1.3,
        }}>
          {q.text}
        </h2>

        <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 28 }}>
          {q.options.map((opt, i) => {
            const isSelected = selected === i;
            return (
              <button
                key={i}
                onClick={() => handleSelect(i)}
                style={{
                  padding: "14px 18px", borderRadius: 14, textAlign: "left",
                  border: isSelected ? `2px solid ${WARM}` : "2px solid #eee",
                  background: isSelected ? WARM_LIGHT : "#fff",
                  cursor: "pointer", transition: "all 0.15s ease",
                  fontFamily: "Montserrat, sans-serif",
                  boxShadow: isSelected ? `0 0 0 3px hsla(20,85%,50%,0.12)` : "0 1px 4px rgba(0,0,0,0.04)",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{
                    width: 28, height: 28, borderRadius: 8, flexShrink: 0,
                    background: isSelected ? WARM : "#f4f4f0",
                    color: isSelected ? "#fff" : "#999",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 12, fontWeight: 700, transition: "all 0.15s ease",
                  }}>
                    {String.fromCharCode(65 + i)}
                  </div>
                  <span style={{ fontSize: 14, color: isSelected ? "#1a1a1a" : "#333", fontWeight: isSelected ? 600 : 400, lineHeight: 1.4 }}>
                    {opt.text}
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        <button
          onClick={handleNext}
          disabled={selected === null || saving}
          style={{
            width: "100%", padding: "14px", borderRadius: 14, border: "none",
            background: selected !== null && !saving
              ? `linear-gradient(135deg, ${WARM}, hsl(20,85%,36%))`
              : "#e8e8e0",
            color: selected !== null && !saving ? "#fff" : "#bbb",
            fontSize: 15, fontWeight: 700, cursor: selected !== null && !saving ? "pointer" : "not-allowed",
            fontFamily: "Montserrat, sans-serif", transition: "all 0.2s ease",
          }}
        >
          {saving ? "Сохраняем результат..." : current + 1 >= total ? "Получить результат" : "Следующий вопрос →"}
        </button>

        <div style={{ display: "flex", justifyContent: "center", gap: 4, marginTop: 20, flexWrap: "wrap" }}>
          {blocks.map(b => {
            const blockQs = BARRIER_QUESTIONS.filter(bq => bq.block === b);
            const answered = blockQs.filter(bq => answers[bq.id] !== undefined).length;
            const done = answered === blockQs.length;
            const active = blockQs.some((bq, i) => {
              const idx = BARRIER_QUESTIONS.indexOf(bq);
              return idx === current;
            });
            return (
              <div key={b} style={{
                width: 8, height: 8, borderRadius: "50%",
                background: done ? WARM : active ? "hsla(20,85%,50%,0.4)" : "#e8e8e0",
                transition: "background 0.3s ease",
              }} />
            );
          })}
        </div>
      </div>
    </BotShell>
  );
}