import Icon from "@/components/ui/icon";
import { ACCENT, ACCENT_DARK, BLOCKS, LK_URL, Answers, HistoryItem, sid } from "./salon-audit.types";

const inp: React.CSSProperties = {
  width: "100%", padding: "10px 13px", borderRadius: 10, border: "1.5px solid #E2E8F0",
  fontSize: 13, fontFamily: "Montserrat,sans-serif", background: "#fff",
  boxSizing: "border-box", color: "#0F172A", outline: "none",
};

interface Props {
  answers: Answers;
  currentBlock: number;
  error: string;
  history: HistoryItem[];
  onAnswer: (key: string, val: string | boolean) => void;
  onNext: () => void;
  onBack: () => void;
  onAnalyze: () => void;
  onHistoryClick: (id: number) => void;
}

export default function SalonAuditForm({
  answers, currentBlock, error, history,
  onAnswer, onNext, onBack, onAnalyze, onHistoryClick,
}: Props) {
  const block = BLOCKS[currentBlock];
  const isLastBlock = currentBlock === BLOCKS.length - 1;

  return (
    <div style={{ maxWidth: 680 }}>
      {/* Заголовок */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
          <div style={{ width: 40, height: 40, borderRadius: 12, background: `linear-gradient(135deg,${ACCENT},${ACCENT_DARK})`, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Icon name="BarChart2" size={20} style={{ color: "#fff" }} />
          </div>
          <div>
            <h2 style={{ fontSize: "clamp(18px,2.5vw,24px)", fontWeight: 700, color: "#0F172A", margin: 0 }}>Цифровой бизнес-разбор</h2>
          </div>
        </div>
        <p style={{ fontSize: 13, color: "#777", margin: 0, lineHeight: 1.6 }}>
          Заполните анкету — ИИ проведёт полный анализ вашего салона и выдаст конкретный план роста.
        </p>
      </div>

      {/* Прогресс */}
      <div style={{ display: "flex", gap: 4, marginBottom: 24 }}>
        {BLOCKS.map((b, i) => (
          <div
            key={b.id}
            onClick={() => i < currentBlock && onBack()}
            style={{ flex: 1, height: 4, borderRadius: 2, background: i <= currentBlock ? ACCENT : "#e8e8e4", cursor: i < currentBlock ? "pointer" : "default", transition: "background 0.3s" }}
          />
        ))}
      </div>

      {/* Блок анкеты */}
      <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #E8ECF0", padding: "22px 22px 20px", marginBottom: 14, boxShadow: "0 1px 3px rgba(15,23,42,0.05)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
          <div style={{ width: 32, height: 32, borderRadius: 9, background: `hsla(185,85%,32%,0.09)`, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Icon name={block.icon} size={16} style={{ color: ACCENT }} />
          </div>
          <div>
            <div style={{ fontSize: 11, color: "#bbb", marginBottom: 1 }}>Блок {currentBlock + 1} из {BLOCKS.length}</div>
            <div style={{ fontSize: 15, fontWeight: 700, color: "#0F172A" }}>{block.title}</div>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {block.fields.map(field => (
            <div key={field.key}>
              <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#555", marginBottom: 6 }}>{field.label}</label>
              {field.type === "boolean" ? (
                <div style={{ display: "flex", gap: 10 }}>
                  {["Да", "Нет"].map(opt => {
                    const val = opt === "Да";
                    const active = answers[field.key] === val;
                    return (
                      <button key={opt} onClick={() => onAnswer(field.key, val)} style={{ flex: 1, padding: "9px 0", borderRadius: 10, border: `1.5px solid ${active ? ACCENT : "#E2E8F0"}`, background: active ? `hsla(185,85%,32%,0.07)` : "#fff", fontSize: 13, fontWeight: active ? 700 : 400, color: active ? ACCENT : "#666", cursor: "pointer", fontFamily: "Montserrat,sans-serif" }}>
                        {opt}
                      </button>
                    );
                  })}
                </div>
              ) : (
                <input
                  style={inp}
                  type={field.type}
                  placeholder={field.placeholder}
                  value={String(answers[field.key] || "")}
                  onChange={e => onAnswer(field.key, e.target.value)}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {error && (
        <div style={{ background: "#fff0f0", border: "1px solid #fcc", borderRadius: 10, padding: "10px 14px", marginBottom: 14, fontSize: 13, color: "#c33", display: "flex", alignItems: "center", gap: 8 }}>
          <Icon name="AlertCircle" size={14} />
          {error}
        </div>
      )}

      {/* Кнопки */}
      <div style={{ display: "flex", gap: 10 }}>
        {currentBlock > 0 && (
          <button onClick={onBack} style={{ display: "flex", alignItems: "center", gap: 7, background: "#f5f5f2", color: "#666", border: "none", borderRadius: 10, padding: "12px 20px", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "Montserrat,sans-serif" }}>
            <Icon name="ArrowLeft" size={14} />
            Назад
          </button>
        )}
        {isLastBlock ? (
          <button onClick={onAnalyze} style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 8, background: `linear-gradient(135deg,${ACCENT},${ACCENT_DARK})`, color: "#fff", border: "none", borderRadius: 10, padding: "13px 24px", fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "Montserrat,sans-serif", boxShadow: `0 4px 18px hsla(185,85%,32%,0.3)` }}>
            <Icon name="Brain" size={16} />
            Получить анализ
          </button>
        ) : (
          <button onClick={onNext} style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 8, background: `linear-gradient(135deg,${ACCENT},${ACCENT_DARK})`, color: "#fff", border: "none", borderRadius: 10, padding: "13px 24px", fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "Montserrat,sans-serif" }}>
            Далее
            <Icon name="ArrowRight" size={14} />
          </button>
        )}
      </div>

      {/* История */}
      {history.length > 0 && (
        <div style={{ marginTop: 28, background: "#fff", borderRadius: 16, border: "1px solid #E8ECF0", padding: "18px 20px", boxShadow: "0 1px 3px rgba(15,23,42,0.05)" }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: "#aaa", textTransform: "uppercase", letterSpacing: 1.2, marginBottom: 12 }}>Предыдущие аудиты</div>
          {history.map(h => (
            <div
              key={h.id}
              onClick={() => onHistoryClick(h.id)}
              style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 0", borderBottom: "1px solid #F1F5F9", cursor: "pointer" }}
              onMouseEnter={e => (e.currentTarget.style.background = "#F1F5F9")}
              onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
            >
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: "#0F172A" }}>{h.score_total} баллов</div>
                <div style={{ fontSize: 11, color: "#bbb" }}>{new Date(h.created_at).toLocaleDateString("ru-RU")}</div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: h.score_total >= 70 ? "hsl(145,60%,40%)" : h.score_total >= 40 ? "hsl(40,90%,50%)" : "hsl(0,75%,55%)" }}>
                  {h.score_total >= 70 ? "Хорошо" : h.score_total >= 40 ? "Средне" : "Слабо"}
                </div>
                <Icon name="ChevronRight" size={14} style={{ color: "#ccc" }} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}