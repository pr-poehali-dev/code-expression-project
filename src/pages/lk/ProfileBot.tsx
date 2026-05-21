import { useState } from "react";
import Icon from "@/components/ui/icon";
import {
  PROFILE_ACCENT, PROFILE_ACCENT_LIGHT, PROFILE_ACCENT_DARK,
  PROFILE_QUESTIONS, PROFILE_BLOCK_COMMENTS,
  ProfileAnswers,
} from "./profile.types";
import { calcProfile } from "./profile.logic";
import { lkApi } from "@/lib/lkApi";
import ProfileResult from "./ProfileResult";

const G  = PROFILE_ACCENT;
const GL = PROFILE_ACCENT_LIGHT;
const GD = PROFILE_ACCENT_DARK;

const TOTAL = PROFILE_QUESTIONS.length; // 14

interface Props {
  onBack: () => void;
}

export default function ProfileBot({ onBack }: Props) {
  const [questionIdx, setQuestionIdx] = useState(0); // 0 = intro
  const [answers, setAnswers] = useState<ProfileAnswers>({});
  const [showResult, setShowResult] = useState(false);
  const [saving, setSaving] = useState(false);
  const [blockInsight, setBlockInsight] = useState<string | null>(null);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);

  const isIntro     = questionIdx === 0;
  const isDone      = questionIdx > TOTAL;
  const currentQ    = PROFILE_QUESTIONS[questionIdx - 1];
  const progress    = Math.round((questionIdx / TOTAL) * 100);

  // Проверяем, последний ли вопрос в блоке
  function getBlockComment(): string | null {
    if (!currentQ) return null;
    const nextQ = PROFILE_QUESTIONS[questionIdx];
    if (!nextQ || nextQ.block !== currentQ.block) {
      return PROFILE_BLOCK_COMMENTS[currentQ.block] || null;
    }
    return null;
  }

  function handleSelectOption(optIdx: number) {
    setSelectedOption(optIdx);
  }

  function handleNext() {
    if (selectedOption === null || !currentQ) return;
    const newAnswers = { ...answers, [currentQ.id]: selectedOption };
    setAnswers(newAnswers);
    setSelectedOption(null);

    const comment = getBlockComment();
    if (comment) {
      setBlockInsight(comment);
    } else {
      setQuestionIdx(qi => qi + 1);
    }
  }

  function handleInsightDone() {
    setBlockInsight(null);
    setQuestionIdx(qi => qi + 1);
  }

  async function handleFinish() {
    if (selectedOption === null || !currentQ) return;
    const newAnswers = { ...answers, [currentQ.id]: selectedOption };
    setAnswers(newAnswers);
    setSelectedOption(null);
    setSaving(true);

    const result = calcProfile(PROFILE_QUESTIONS, newAnswers);
    try {
      await lkApi.profileSave({
        ifl: result.ifl,
        ifu: result.ifu,
        type_title: result.type.title,
        indexes: result.norm,
        answers: newAnswers,
      });
    } catch (_) { /* silent */ }
    setSaving(false);
    setShowResult(true);
  }

  function handleRetake() {
    setShowResult(false);
    setQuestionIdx(0);
    setAnswers({});
    setSelectedOption(null);
    setBlockInsight(null);
  }

  // ── RESULT ──────────────────────────────────────────────────────────────────

  if (showResult) {
    const result = calcProfile(PROFILE_QUESTIONS, answers);
    return (
      <ProfileResult
        result={result}
        answers={answers}
        onRetake={handleRetake}
        onBack={onBack}
      />
    );
  }

  // ── INSIGHT МЕЖДУ БЛОКАМИ ────────────────────────────────────────────────────

  if (blockInsight) {
    return (
      <div style={{ fontFamily: "Montserrat, sans-serif", maxWidth: 540, margin: "0 auto" }}>
        <div style={{ background: `linear-gradient(135deg, ${G}, ${GD})`, borderRadius: 20, padding: "32px 28px", color: "#fff", boxShadow: `0 12px 40px ${G}44` }}>
          <div style={{ fontSize: 11, opacity: 0.7, textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 16 }}>
            Инсайт
          </div>
          <div style={{ fontSize: 28, fontWeight: 900, lineHeight: 1, marginBottom: 16 }}>💡</div>
          <p style={{ fontSize: 16, lineHeight: 1.8, margin: 0, fontWeight: 500 }}>
            {blockInsight}
          </p>
        </div>
        <div style={{ marginTop: 20 }}>
          <button
            onClick={handleInsightDone}
            style={{
              width: "100%", padding: "14px", borderRadius: 14, border: "none",
              background: `linear-gradient(135deg, ${G}, ${GD})`,
              color: "#fff", fontSize: 15, fontWeight: 700, cursor: "pointer",
              fontFamily: "Montserrat, sans-serif", boxShadow: `0 6px 20px ${G}44`,
            }}
          >
            Продолжить →
          </button>
        </div>
      </div>
    );
  }

  // ── INTRO ───────────────────────────────────────────────────────────────────

  if (isIntro) {
    return (
      <div style={{ fontFamily: "Montserrat, sans-serif", maxWidth: 540, margin: "0 auto" }}>
        <button onClick={onBack} style={{
          display: "inline-flex", alignItems: "center", gap: 8, background: "none", border: "none",
          color: "#888", fontSize: 13, cursor: "pointer", padding: "0 0 16px", fontFamily: "Montserrat, sans-serif",
        }}>
          <Icon name="ArrowLeft" size={15} /> К инструментам
        </button>

        <div style={{
          background: `linear-gradient(135deg, ${G}, ${GD})`,
          borderRadius: 20, padding: "32px 28px", marginBottom: 20, color: "#fff",
          boxShadow: `0 12px 40px ${G}44`,
        }}>
          <div style={{ fontSize: 11, opacity: 0.7, textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 10 }}>
            Психометрическая диагностика
          </div>
          <h1 style={{ fontFamily: "Cormorant, serif", fontSize: "clamp(24px,4vw,34px)", fontWeight: 700, margin: "0 0 12px", lineHeight: 1.2 }}>
            Финансовый профиль PRO
          </h1>
          <p style={{ fontSize: 14, opacity: 0.85, lineHeight: 1.8, margin: 0 }}>
            Определи свой уровень финансового мышления, привычек и зрелости
          </p>
        </div>

        <div style={{ background: "#fff", borderRadius: 20, padding: "24px", marginBottom: 16, boxShadow: "0 2px 12px rgba(0,0,0,0.05)" }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: "#1a1a1a", marginBottom: 14 }}>Что вы узнаете:</div>
          {[
            ["Brain",        "На каком финансовом уровне ты находишься"],
            ["TrendingDown", "Почему денег не становится больше"],
            ["Repeat",       "Какие финансовые паттерны управляют тобой"],
            ["PiggyBank",    "Умеешь ли ты сохранять и копить деньги"],
            ["AlertCircle",  "Есть ли тревога за деньги"],
            ["Target",       "Способен ли выйти на новый уровень дохода"],
          ].map(([icon, text]) => (
            <div key={text as string} style={{ display: "flex", gap: 12, alignItems: "flex-start", marginBottom: 10 }}>
              <div style={{
                width: 28, height: 28, borderRadius: 8, flexShrink: 0,
                background: `${G}18`, display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <Icon name={icon as string} size={14} style={{ color: G }} />
              </div>
              <span style={{ fontSize: 14, color: "#444", lineHeight: 1.5, marginTop: 4 }}>{text as string}</span>
            </div>
          ))}
        </div>

        <div style={{ background: "#fff", borderRadius: 16, padding: "16px 20px", marginBottom: 24, border: "1.5px solid #f0f0ec" }}>
          <div style={{ display: "flex", gap: 24, flexWrap: "wrap" }}>
            {[["14", "вопросов"], ["~5", "минут"], ["9", "индексов"]].map(([n, l]) => (
              <div key={l} style={{ textAlign: "center" }}>
                <div style={{ fontSize: 28, fontWeight: 900, color: G, lineHeight: 1 }}>{n}</div>
                <div style={{ fontSize: 11, color: "#aaa", marginTop: 2 }}>{l}</div>
              </div>
            ))}
          </div>
        </div>

        <button
          onClick={() => setQuestionIdx(1)}
          style={{
            width: "100%", padding: "14px", borderRadius: 14, border: "none",
            background: `linear-gradient(135deg, ${G}, ${GD})`,
            color: "#fff", fontSize: 15, fontWeight: 700, cursor: "pointer",
            fontFamily: "Montserrat, sans-serif", boxShadow: `0 6px 20px ${G}44`,
          }}
        >
          Начать диагностику →
        </button>
      </div>
    );
  }

  // ── ВОПРОС ──────────────────────────────────────────────────────────────────

  if (!currentQ) return null;

  const isLastQ    = questionIdx === TOTAL;
  const prevAnswer = answers[currentQ.id];
  const active     = selectedOption !== null ? selectedOption : (prevAnswer !== undefined ? prevAnswer : null);

  return (
    <div style={{ fontFamily: "Montserrat, sans-serif", maxWidth: 540, margin: "0 auto" }}>
      {/* Шапка с прогрессом */}
      <div style={{ marginBottom: 24 }}>
        <button onClick={() => {
          if (questionIdx === 1) onBack();
          else setQuestionIdx(qi => qi - 1);
        }} style={{
          display: "inline-flex", alignItems: "center", gap: 8, background: "none", border: "none",
          color: "#888", fontSize: 13, cursor: "pointer", padding: "0 0 14px", fontFamily: "Montserrat, sans-serif",
        }}>
          <Icon name="ArrowLeft" size={15} /> {questionIdx === 1 ? "К инструментам" : "Назад"}
        </button>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
          <span style={{ fontSize: 12, color: "#aaa" }}>
            {currentQ.blockTitle} · {questionIdx} из {TOTAL}
          </span>
          <span style={{ fontSize: 12, fontWeight: 700, color: G }}>{progress}%</span>
        </div>
        <div style={{ height: 4, background: "#e8e8e0", borderRadius: 2 }}>
          <div style={{
            width: `${progress}%`, height: "100%",
            background: `linear-gradient(90deg, ${G}, ${GD})`,
            borderRadius: 2, transition: "width 0.4s ease",
          }} />
        </div>
      </div>

      {/* Вопрос */}
      <div style={{ background: "#fff", borderRadius: 20, padding: "28px 24px", marginBottom: 16, boxShadow: "0 2px 12px rgba(0,0,0,0.05)" }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: G, textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 12 }}>
          {currentQ.blockTitle}
        </div>
        <h2 style={{ fontFamily: "Cormorant, serif", fontSize: "clamp(20px,3vw,26px)", fontWeight: 700, color: "#1a1a1a", margin: "0 0 24px", lineHeight: 1.3 }}>
          {currentQ.text}
        </h2>

        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {currentQ.options.map((opt, i) => {
            const isSelected = active === i;
            return (
              <button
                key={i}
                onClick={() => handleSelectOption(i)}
                style={{
                  padding: "16px 20px", borderRadius: 14, textAlign: "left",
                  border: isSelected ? `2px solid ${G}` : "1.5px solid #e8e8e4",
                  background: isSelected ? GL : "#fafafa",
                  cursor: "pointer", fontFamily: "Montserrat, sans-serif",
                  transition: "all 0.15s",
                  display: "flex", alignItems: "center", gap: 14,
                }}
                onMouseEnter={e => { if (!isSelected) (e.currentTarget as HTMLElement).style.borderColor = `${G}88`; }}
                onMouseLeave={e => { if (!isSelected) (e.currentTarget as HTMLElement).style.borderColor = "#e8e8e4"; }}
              >
                <div style={{
                  width: 28, height: 28, borderRadius: 8, flexShrink: 0,
                  border: isSelected ? `none` : "1.5px solid #e0e0e0",
                  background: isSelected ? G : "transparent",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  transition: "all 0.15s",
                }}>
                  {isSelected && <Icon name="Check" size={14} style={{ color: "#fff" }} />}
                  {!isSelected && <span style={{ fontSize: 12, color: "#bbb", fontWeight: 700 }}>
                    {["A", "B", "C", "D"][i]}
                  </span>}
                </div>
                <span style={{ fontSize: 14, color: isSelected ? GD : "#333", fontWeight: isSelected ? 600 : 400, lineHeight: 1.5 }}>
                  {opt.text}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Кнопка */}
      <button
        onClick={isLastQ ? handleFinish : handleNext}
        disabled={active === null || saving}
        style={{
          width: "100%", padding: "14px", borderRadius: 14, border: "none",
          background: active === null || saving ? "#e8e8e0" : `linear-gradient(135deg, ${G}, ${GD})`,
          color: active === null || saving ? "#bbb" : "#fff",
          fontSize: 15, fontWeight: 700,
          cursor: active === null || saving ? "not-allowed" : "pointer",
          fontFamily: "Montserrat, sans-serif", transition: "all 0.2s",
          boxShadow: active === null || saving ? "none" : `0 6px 20px ${G}44`,
        }}
      >
        {saving ? "Считаем профиль..." : isLastQ ? "Получить профиль →" : "Следующий вопрос →"}
      </button>
    </div>
  );
}
