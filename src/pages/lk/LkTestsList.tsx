import Icon from "@/components/ui/icon";
import { ACCENT, TOOL_COLORS, Test, BarriersHistoryItem } from "./LkTestsTypes";

interface Props {
  tests: Test[];
  barriersHistory: BarriersHistoryItem[];
  onOpenMindset: () => void;
  onOpenBarriers: () => void;
  onOpenTest: (slug: string) => void;
}

export default function LkTestsList({ tests, barriersHistory, onOpenMindset, onOpenBarriers, onOpenTest }: Props) {
  return (
    <div>
      <h1 style={{ fontFamily: "Cormorant, serif", fontSize: "clamp(24px,3vw,32px)", fontWeight: 700, color: "#1a1a1a", margin: "0 0 8px" }}>
        Инструменты роста
      </h1>
      <p style={{ fontSize: 14, color: "#888", margin: "0 0 28px" }}>
        Пройди тест — получи персональный разбор и конкретные советы
      </p>
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        {tests.filter(test => test.slug !== "barriers").map(test => {
          const colors = TOOL_COLORS[test.slug] || { color: ACCENT, bg: "hsl(185,85%,96%)" };
          return (
            <div key={test.id} style={{
              background: "#fff", borderRadius: 16, padding: "22px 24px",
              display: "flex", alignItems: "center", gap: 18,
              boxShadow: "0 2px 12px rgba(0,0,0,0.04)", border: "1.5px solid #f0f0ec",
            }}>
              <div style={{
                width: 48, height: 48, borderRadius: 14, flexShrink: 0,
                background: colors.bg, display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <Icon name={test.icon} size={22} style={{ color: colors.color }} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 16, fontWeight: 700, color: "#1a1a1a", marginBottom: 4 }}>{test.title}</div>
                <div style={{ fontSize: 13, color: "#888", lineHeight: 1.5 }}>{test.description}</div>
                {test.completed && (
                  <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 8 }}>
                    <Icon name="CheckCircle" size={14} style={{ color: ACCENT }} />
                    <span style={{ fontSize: 12, color: ACCENT, fontWeight: 600 }}>Пройден · {test.score} баллов</span>
                  </div>
                )}
              </div>
              <button
                onClick={() => {
                  if (test.slug === "mindset") onOpenMindset();
                  else if (test.slug === "barriers") onOpenBarriers();
                  else onOpenTest(test.slug);
                }}
                style={{
                  padding: "10px 20px", borderRadius: 10, border: `1.5px solid ${ACCENT}`,
                  background: test.completed ? "transparent" : ACCENT,
                  color: test.completed ? ACCENT : "#fff",
                  fontSize: 13, fontWeight: 700, cursor: "pointer",
                  fontFamily: "Montserrat, sans-serif", flexShrink: 0,
                }}
              >
                {test.completed ? "Пройти снова" : "Начать"}
              </button>
            </div>
          );
        })}

        {/* Карточка «Внутренние барьеры» — всегда показывается */}
        <div style={{
          background: "#fff", borderRadius: 16, padding: "22px 24px",
          display: "flex", alignItems: "center", gap: 18,
          boxShadow: "0 2px 12px rgba(0,0,0,0.04)", border: "1.5px solid #f0f0ec",
        }}>
          <div style={{
            width: 48, height: 48, borderRadius: 14, flexShrink: 0,
            background: "hsl(20,85%,96%)", display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <Icon name="ShieldAlert" size={22} style={{ color: "hsl(20,85%,50%)" }} />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 16, fontWeight: 700, color: "#1a1a1a", marginBottom: 4 }}>
              Внутренние барьеры специалиста
            </div>
            <div style={{ fontSize: 13, color: "#888", lineHeight: 1.5 }}>
              Выяви психологические блоки, которые мешают профессиональному росту
            </div>
            {barriersHistory.length > 0 && (
              <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 8 }}>
                <Icon name="CheckCircle" size={14} style={{ color: "hsl(20,85%,50%)" }} />
                <span style={{ fontSize: 12, color: "hsl(20,85%,50%)", fontWeight: 600 }}>
                  Пройден · IIB {barriersHistory[0].iib}
                </span>
              </div>
            )}
          </div>
          <button
            onClick={onOpenBarriers}
            style={{
              padding: "10px 20px", borderRadius: 10,
              border: `1.5px solid hsl(20,85%,50%)`,
              background: barriersHistory.length > 0 ? "transparent" : "hsl(20,85%,50%)",
              color: barriersHistory.length > 0 ? "hsl(20,85%,50%)" : "#fff",
              fontSize: 13, fontWeight: 700, cursor: "pointer",
              fontFamily: "Montserrat, sans-serif", flexShrink: 0,
            }}
          >
            {barriersHistory.length > 0 ? "Пройти снова" : "Начать"}
          </button>
        </div>

        {tests.length === 0 && barriersHistory.length === 0 && (
          <div style={{ textAlign: "center", padding: 48, color: "#aaa" }}>
            Тесты ещё не добавлены
          </div>
        )}
      </div>
    </div>
  );
}
