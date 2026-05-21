import { useState } from "react";
import Icon from "@/components/ui/icon";
import {
  SALON_ACCENT, SALON_ACCENT_LIGHT, SALON_ACCENT_DARK,
  SALON_QUESTIONS, SALON_BLOCK_COMMENTS, SALON_NUMERIC_QUESTIONS,
  SalonAnswers, SalonNumericAnswers,
} from "./salon.types";
import { calcSalon } from "./salon.logic";
import { lkApi } from "@/lib/lkApi";
import SalonResult from "./SalonResult";

const G  = SALON_ACCENT;
const GL = SALON_ACCENT_LIGHT;
const GD = SALON_ACCENT_DARK;

const TOTAL = SALON_QUESTIONS.length; // 14

interface Props { onBack: () => void; }

export default function SalonBot({ onBack }: Props) {
  const [questionIdx, setQuestionIdx] = useState(0); // 0 = intro
  const [answers, setAnswers] = useState<SalonAnswers>({});
  const [numericAnswers, setNumericAnswers] = useState<SalonNumericAnswers>({});
  const [showNumeric, setShowNumeric] = useState(false);  // числовой экран
  const [showResult, setShowResult] = useState(false);
  const [saving, setSaving] = useState(false);
  const [blockInsight, setBlockInsight] = useState<string | null>(null);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);

  const isIntro  = questionIdx === 0;
  const currentQ = SALON_QUESTIONS[questionIdx - 1];
  const progress = Math.round((questionIdx / TOTAL) * 100);

  function getBlockComment(): string | null {
    if (!currentQ) return null;
    const nextQ = SALON_QUESTIONS[questionIdx];
    if (!nextQ || nextQ.block !== currentQ.block) {
      return SALON_BLOCK_COMMENTS[currentQ.block] || null;
    }
    return null;
  }

  function handleSelectOption(optIdx: number) { setSelectedOption(optIdx); }

  function handleNext() {
    if (selectedOption === null || !currentQ) return;
    const newAnswers = { ...answers, [currentQ.id]: selectedOption };
    setAnswers(newAnswers);
    setSelectedOption(null);

    if (questionIdx === TOTAL) {
      // Последний вопрос — показываем числовой экран
      setShowNumeric(true);
      return;
    }

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

  async function handleFinishNumeric() {
    setSaving(true);
    const result = calcSalon(SALON_QUESTIONS, answers, numericAnswers);
    try {
      await lkApi.salonSave({
        ips: result.ips,
        ipp_loss: result.ippLoss,
        type_title: result.type.title,
        indexes: result.norm,
        hidden_money: result.hiddenMoney.totalPotential,
        answers,
        numeric: numericAnswers,
      });
    } catch (_) { /* silent */ }
    setSaving(false);
    setShowResult(true);
  }

  function handleRetake() {
    setShowResult(false);
    setShowNumeric(false);
    setQuestionIdx(0);
    setAnswers({});
    setNumericAnswers({});
    setSelectedOption(null);
    setBlockInsight(null);
  }

  // ── RESULT ──────────────────────────────────────────────────────────────────
  if (showResult) {
    const result = calcSalon(SALON_QUESTIONS, answers, numericAnswers);
    return <SalonResult result={result} onRetake={handleRetake} onBack={onBack} />;
  }

  // ── ЧИСЛОВОЙ ЭКРАН ───────────────────────────────────────────────────────────
  if (showNumeric) {
    const avgCheck = numericAnswers.avgCheck ?? 0;
    return (
      <div style={{ fontFamily: "Montserrat, sans-serif", maxWidth: 540, margin: "0 auto" }}>
        <button onClick={() => setShowNumeric(false)} style={{
          display: "inline-flex", alignItems: "center", gap: 8, background: "none", border: "none",
          color: "#888", fontSize: 13, cursor: "pointer", padding: "0 0 14px", fontFamily: "Montserrat, sans-serif",
        }}>
          <Icon name="ArrowLeft" size={15} /> Назад
        </button>

        <div style={{ background: "#fff", borderRadius: 20, padding: "28px 24px", marginBottom: 16, boxShadow: "0 2px 12px rgba(0,0,0,0.05)" }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: G, textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 8 }}>
            Финансовый калькулятор
          </div>
          <h2 style={{ fontFamily: "Cormorant, serif", fontSize: "clamp(20px,3vw,26px)", fontWeight: 700, color: "#1a1a1a", margin: "0 0 8px", lineHeight: 1.3 }}>
            Последний шаг — ваши цифры
          </h2>
          <p style={{ fontSize: 13, color: "#888", margin: "0 0 24px", lineHeight: 1.7 }}>
            Чтобы рассчитать скрытые деньги салона, нам нужна одна цифра
          </p>

          {SALON_NUMERIC_QUESTIONS.map(nq => (
            <div key={nq.key} style={{ marginBottom: 20 }}>
              <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#444", marginBottom: 6 }}>
                {nq.label}
              </label>
              <div style={{ fontSize: 12, color: "#aaa", marginBottom: 8 }}>{nq.hint}</div>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <input
                  type="number"
                  value={numericAnswers[nq.key] ?? ""}
                  onChange={e => setNumericAnswers(prev => ({ ...prev, [nq.key]: parseFloat(e.target.value) || 0 }))}
                  placeholder={nq.placeholder}
                  style={{
                    flex: 1, padding: "12px 14px", borderRadius: 10, border: "1.5px solid #e8e8e4",
                    fontSize: 16, fontFamily: "Montserrat, sans-serif", background: "#fafafa", outline: "none",
                  }}
                  onFocus={e => { e.target.style.borderColor = G; e.target.style.background = GL; }}
                  onBlur={e => { e.target.style.borderColor = "#e8e8e4"; e.target.style.background = "#fafafa"; }}
                />
                <span style={{ fontSize: 14, color: "#888", minWidth: 24 }}>{nq.suffix}</span>
              </div>
            </div>
          ))}

          {avgCheck > 0 && (
            <div style={{ padding: "14px 16px", background: GL, borderRadius: 12, borderLeft: `3px solid ${G}` }}>
              <div style={{ fontSize: 13, color: GD, fontWeight: 700 }}>
                При {avgCheck.toLocaleString("ru-RU")} ₽ среднем чеке система рассчитает скрытый потенциал роста прибыли
              </div>
            </div>
          )}
        </div>

        <button
          onClick={handleFinishNumeric}
          disabled={saving}
          style={{
            width: "100%", padding: "14px", borderRadius: 14, border: "none",
            background: saving ? "#e8e8e0" : `linear-gradient(135deg, ${G}, ${GD})`,
            color: saving ? "#bbb" : "#fff", fontSize: 15, fontWeight: 700,
            cursor: saving ? "not-allowed" : "pointer",
            fontFamily: "Montserrat, sans-serif", boxShadow: saving ? "none" : `0 6px 20px ${G}44`,
          }}
        >
          {saving ? "Считаем диагностику..." : "Получить диагностику →"}
        </button>

        <button
          onClick={handleFinishNumeric}
          disabled={saving}
          style={{
            width: "100%", padding: "11px", marginTop: 10, borderRadius: 14,
            border: `1.5px solid ${G}`, background: "transparent",
            color: G, fontSize: 13, fontWeight: 600,
            cursor: saving ? "not-allowed" : "pointer", fontFamily: "Montserrat, sans-serif",
          }}
        >
          Пропустить и получить базовый расчёт
        </button>
      </div>
    );
  }

  // ── ИНСАЙТ МЕЖДУ БЛОКАМИ ────────────────────────────────────────────────────
  if (blockInsight) {
    return (
      <div style={{ fontFamily: "Montserrat, sans-serif", maxWidth: 540, margin: "0 auto" }}>
        <div style={{ background: `linear-gradient(135deg, ${G}, ${GD})`, borderRadius: 20, padding: "32px 28px", color: "#fff", boxShadow: `0 12px 40px ${G}44` }}>
          <div style={{ fontSize: 11, opacity: 0.7, textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 16 }}>
            Аналитика блока
          </div>
          <div style={{ fontSize: 28, fontWeight: 900, lineHeight: 1, marginBottom: 16 }}>📊</div>
          <p style={{ fontSize: 15, lineHeight: 1.8, margin: 0, fontWeight: 500 }}>{blockInsight}</p>
        </div>
        <div style={{ marginTop: 20 }}>
          <button onClick={handleInsightDone} style={{
            width: "100%", padding: "14px", borderRadius: 14, border: "none",
            background: `linear-gradient(135deg, ${G}, ${GD})`,
            color: "#fff", fontSize: 15, fontWeight: 700, cursor: "pointer",
            fontFamily: "Montserrat, sans-serif", boxShadow: `0 6px 20px ${G}44`,
          }}>
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
            Бизнес-диагностика
          </div>
          <h1 style={{ fontFamily: "Cormorant, serif", fontSize: "clamp(22px,4vw,32px)", fontWeight: 700, margin: "0 0 12px", lineHeight: 1.2 }}>
            Диагностика роста салона PRO
          </h1>
          <p style={{ fontSize: 14, opacity: 0.85, lineHeight: 1.8, margin: 0 }}>
            Поймите, где салон теряет деньги — и как увеличить прибыль без увеличения потока
          </p>
        </div>

        <div style={{ background: "#fff", borderRadius: 20, padding: "24px", marginBottom: 16, boxShadow: "0 2px 12px rgba(0,0,0,0.05)" }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: "#1a1a1a", marginBottom: 14 }}>Что вы получите:</div>
          {[
            ["TrendingDown",  "Где главный финансовый провал"],
            ["Users",         "Почему клиенты не возвращаются"],
            ["DollarSign",    "Расчёт скрытых денег салона"],
            ["BarChart2",     "Индекс прибыльности по 8 параметрам"],
            ["AlertTriangle", "Главное слабое место команды"],
            ["Rocket",        "Потенциал роста без нового трафика"],
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
            {[["14", "вопросов"], ["~7", "минут"], ["8", "индексов"]].map(([n, l]) => (
              <div key={l} style={{ textAlign: "center" }}>
                <div style={{ fontSize: 28, fontWeight: 900, color: G, lineHeight: 1 }}>{n}</div>
                <div style={{ fontSize: 11, color: "#aaa", marginTop: 2 }}>{l}</div>
              </div>
            ))}
          </div>
        </div>

        <button onClick={() => setQuestionIdx(1)} style={{
          width: "100%", padding: "14px", borderRadius: 14, border: "none",
          background: `linear-gradient(135deg, ${G}, ${GD})`,
          color: "#fff", fontSize: 15, fontWeight: 700, cursor: "pointer",
          fontFamily: "Montserrat, sans-serif", boxShadow: `0 6px 20px ${G}44`,
        }}>
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
      {/* Прогресс */}
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
          <span style={{ fontSize: 12, color: "#aaa" }}>{currentQ.blockTitle} · {questionIdx} из {TOTAL}</span>
          <span style={{ fontSize: 12, fontWeight: 700, color: G }}>{progress}%</span>
        </div>
        <div style={{ height: 4, background: "#e8e8e0", borderRadius: 2 }}>
          <div style={{ width: `${progress}%`, height: "100%", background: `linear-gradient(90deg, ${G}, ${GD})`, borderRadius: 2, transition: "width 0.4s ease" }} />
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
              <button key={i} onClick={() => handleSelectOption(i)} style={{
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
                  border: isSelected ? "none" : "1.5px solid #e0e0e0",
                  background: isSelected ? G : "transparent",
                  display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.15s",
                }}>
                  {isSelected
                    ? <Icon name="Check" size={14} style={{ color: "#fff" }} />
                    : <span style={{ fontSize: 12, color: "#bbb", fontWeight: 700 }}>{["A","B","C","D"][i]}</span>
                  }
                </div>
                <span style={{ fontSize: 14, color: isSelected ? GD : "#333", fontWeight: isSelected ? 600 : 400, lineHeight: 1.5 }}>
                  {opt.text}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <button
        onClick={handleNext}
        disabled={active === null}
        style={{
          width: "100%", padding: "14px", borderRadius: 14, border: "none",
          background: active === null ? "#e8e8e0" : `linear-gradient(135deg, ${G}, ${GD})`,
          color: active === null ? "#bbb" : "#fff", fontSize: 15, fontWeight: 700,
          cursor: active === null ? "not-allowed" : "pointer",
          fontFamily: "Montserrat, sans-serif", transition: "all 0.2s",
          boxShadow: active === null ? "none" : `0 6px 20px ${G}44`,
        }}
      >
        {isLastQ ? "Далее — финансовый расчёт →" : "Следующий вопрос →"}
      </button>
    </div>
  );
}
