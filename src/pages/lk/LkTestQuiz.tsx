import Icon from "@/components/ui/icon";
import { ACCENT, TestDetail, TestResult, backBtn } from "./LkTestsTypes";

interface Props {
  activeTest: TestDetail;
  answers: Record<number, number>;
  result: { score: number; result: TestResult | null } | null;
  submitting: boolean;
  onAnswer: (qId: number, optId: number) => void;
  onSubmit: () => void;
  onBack: () => void;
  onBackFromResult: () => void;
}

export default function LkTestQuiz({ activeTest, answers, result, submitting, onAnswer, onSubmit, onBack, onBackFromResult }: Props) {
  if (result) {
    const pct = Math.round(((result.score) / (activeTest.questions.length * 4)) * 100);
    return (
      <div style={{ maxWidth: 640 }}>
        <button onClick={onBackFromResult} style={backBtn}>
          <Icon name="ArrowLeft" size={16} /> Назад
        </button>
        <div style={{ background: "#fff", borderRadius: 20, padding: "36px 32px", marginTop: 20 }}>
          <div style={{
            width: 72, height: 72, borderRadius: "50%",
            background: `linear-gradient(135deg, ${ACCENT}, hsl(185,85%,22%))`,
            display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 20,
          }}>
            <Icon name="Award" size={32} style={{ color: "#fff" }} />
          </div>
          <div style={{ fontSize: 13, color: "#888", marginBottom: 4 }}>Результат теста</div>
          <h2 style={{ fontFamily: "Cormorant, serif", fontSize: 28, fontWeight: 700, color: "#1a1a1a", margin: "0 0 8px" }}>
            {result.result?.title || "Тест пройден!"}
          </h2>
          <div style={{ display: "flex", alignItems: "center", gap: 12, margin: "16px 0 24px" }}>
            <div style={{ flex: 1, height: 8, background: "#f0f0ec", borderRadius: 4, overflow: "hidden" }}>
              <div style={{ width: `${pct}%`, height: "100%", background: `linear-gradient(90deg, ${ACCENT}, hsl(185,85%,22%))`, borderRadius: 4, transition: "width 1s ease" }} />
            </div>
            <span style={{ fontSize: 14, fontWeight: 700, color: ACCENT, minWidth: 40 }}>{pct}%</span>
          </div>
          {result.result && (
            <>
              <p style={{ fontSize: 15, color: "#444", lineHeight: 1.75, marginBottom: 20 }}>
                {result.result.description}
              </p>
              <div style={{
                background: "hsl(185,85%,96%)", borderRadius: 14, padding: "18px 20px",
                borderLeft: `4px solid ${ACCENT}`,
              }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: ACCENT, textTransform: "uppercase", letterSpacing: 1, marginBottom: 8 }}>
                  Что делать дальше
                </div>
                <p style={{ fontSize: 14, color: "#444", lineHeight: 1.7, margin: 0 }}>
                  {result.result.advice}
                </p>
              </div>
            </>
          )}
          <button
            onClick={onBackFromResult}
            style={{
              marginTop: 28, padding: "12px 28px", borderRadius: 12, border: "none",
              background: `linear-gradient(135deg, ${ACCENT}, hsl(185,85%,22%))`,
              color: "#fff", fontSize: 14, fontWeight: 700, cursor: "pointer",
              fontFamily: "Montserrat, sans-serif",
            }}
          >
            К инструментам
          </button>
        </div>
      </div>
    );
  }

  const progress = Math.round((Object.keys(answers).length / activeTest.questions.length) * 100);

  return (
    <div style={{ maxWidth: 640 }}>
      <button onClick={onBack} style={backBtn}>
        <Icon name="ArrowLeft" size={16} /> Назад
      </button>
      <div style={{ background: "#fff", borderRadius: 20, padding: "32px 28px", marginTop: 20 }}>
        <h2 style={{ fontFamily: "Cormorant, serif", fontSize: 24, fontWeight: 700, color: "#1a1a1a", margin: "0 0 8px" }}>
          {activeTest.test.title}
        </h2>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 28 }}>
          <div style={{ flex: 1, height: 6, background: "#f0f0ec", borderRadius: 3 }}>
            <div style={{ width: `${progress}%`, height: "100%", background: ACCENT, borderRadius: 3, transition: "width 0.3s" }} />
          </div>
          <span style={{ fontSize: 13, color: "#aaa" }}>{Object.keys(answers).length}/{activeTest.questions.length}</span>
        </div>

        {activeTest.questions.map((q, qi) => (
          <div key={q.id} style={{ marginBottom: 28 }}>
            <div style={{ fontSize: 14, fontWeight: 600, color: "#1a1a1a", marginBottom: 12, lineHeight: 1.5 }}>
              {qi + 1}. {q.text}
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {q.options.map(opt => {
                const selected = answers[q.id] === opt.id;
                return (
                  <button
                    key={opt.id}
                    onClick={() => onAnswer(q.id, opt.id)}
                    style={{
                      padding: "11px 16px", borderRadius: 10, textAlign: "left",
                      border: selected ? `2px solid ${ACCENT}` : "1.5px solid #e8e8e4",
                      background: selected ? "hsl(185,85%,96%)" : "#fafafa",
                      color: selected ? ACCENT : "#444",
                      fontSize: 14, fontWeight: selected ? 600 : 400,
                      cursor: "pointer", fontFamily: "Montserrat, sans-serif",
                      transition: "all 0.15s",
                    }}
                  >
                    {opt.text}
                  </button>
                );
              })}
            </div>
          </div>
        ))}

        <button
          onClick={onSubmit}
          disabled={submitting}
          style={{
            width: "100%", padding: "13px", borderRadius: 12, border: "none",
            background: submitting ? "#ccc" : `linear-gradient(135deg, ${ACCENT}, hsl(185,85%,22%))`,
            color: "#fff", fontSize: 15, fontWeight: 700, cursor: submitting ? "not-allowed" : "pointer",
            fontFamily: "Montserrat, sans-serif", marginTop: 8,
          }}
        >
          {submitting ? "Считаем результат..." : "Получить результат"}
        </button>
      </div>
    </div>
  );
}
