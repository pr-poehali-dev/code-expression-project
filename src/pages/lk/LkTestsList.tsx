import Icon from "@/components/ui/icon";
import { ACCENT, TOOL_COLORS, Test, BarriersHistoryItem, FinanceHistoryItem } from "./LkTestsTypes";
import { formatMoney } from "./finance.logic";

interface Props {
  tests: Test[];
  barriersHistory: BarriersHistoryItem[];
  financeHistory: FinanceHistoryItem[];
  onOpenMindset: () => void;
  onOpenBarriers: () => void;
  onOpenFinance: () => void;
  onOpenTest: (slug: string) => void;
}

export default function LkTestsList({ tests, barriersHistory, financeHistory, onOpenMindset, onOpenBarriers, onOpenFinance, onOpenTest }: Props) {
  return (
    <div>
      <h1 style={{ fontFamily: "Cormorant, serif", fontSize: "clamp(24px,3vw,32px)", fontWeight: 700, color: "#1a1a1a", margin: "0 0 8px" }}>
        Инструменты роста
      </h1>
      <p style={{ fontSize: 14, color: "#888", margin: "0 0 28px" }}>
        Пройди тест — получи персональный разбор и конкретные советы
      </p>
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        {tests.filter(test => test.slug !== "barriers" && test.slug !== "finance").map(test => {
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
                  else if (test.slug === "finance") onOpenFinance();
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

        {/* Карточка «Внутренние барьеры» */}
        <ToolCard
          icon="ShieldAlert" color="hsl(20,85%,50%)" bg="hsl(20,85%,96%)"
          title="Внутренние барьеры специалиста"
          description="Выяви психологические блоки, которые мешают профессиональному росту"
          completed={barriersHistory.length > 0}
          completedLabel={barriersHistory.length > 0 ? `Пройден · IIB ${barriersHistory[0].iib}` : undefined}
          onStart={onOpenBarriers}
        />

        {/* Карточка «Финансовая грамотность PRO» */}
        <ToolCard
          icon="TrendingUp" color="hsl(145,60%,40%)" bg="hsl(145,60%,95%)"
          title="Финансовая грамотность специалиста PRO"
          description="Пойми, сколько ты реально хочешь зарабатывать — и как к этому прийти"
          completed={financeHistory.length > 0}
          completedLabel={financeHistory.length > 0 ? `Пройден · IFR ${financeHistory[0].ifr} · ${formatMoney(financeHistory[0].fr)} разрыв` : undefined}
          onStart={onOpenFinance}
        />

        {tests.length === 0 && barriersHistory.length === 0 && financeHistory.length === 0 && (
          <div style={{ textAlign: "center", padding: 48, color: "#aaa" }}>
            Тесты ещё не добавлены
          </div>
        )}
      </div>
    </div>
  );
}

function ToolCard({ icon, color, bg, title, description, completed, completedLabel, onStart }: {
  icon: string; color: string; bg: string;
  title: string; description: string;
  completed: boolean; completedLabel?: string;
  onStart: () => void;
}) {
  return (
    <div style={{
      background: "#fff", borderRadius: 16, padding: "22px 24px",
      display: "flex", alignItems: "center", gap: 18,
      boxShadow: "0 2px 12px rgba(0,0,0,0.04)", border: "1.5px solid #f0f0ec",
    }}>
      <div style={{ width: 48, height: 48, borderRadius: 14, flexShrink: 0, background: bg, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Icon name={icon} size={22} style={{ color }} />
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 16, fontWeight: 700, color: "#1a1a1a", marginBottom: 4 }}>{title}</div>
        <div style={{ fontSize: 13, color: "#888", lineHeight: 1.5 }}>{description}</div>
        {completedLabel && (
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 8 }}>
            <Icon name="CheckCircle" size={14} style={{ color }} />
            <span style={{ fontSize: 12, color, fontWeight: 600 }}>{completedLabel}</span>
          </div>
        )}
      </div>
      <button
        onClick={onStart}
        style={{
          padding: "10px 20px", borderRadius: 10,
          border: `1.5px solid ${color}`,
          background: completed ? "transparent" : color,
          color: completed ? color : "#fff",
          fontSize: 13, fontWeight: 700, cursor: "pointer",
          fontFamily: "Montserrat, sans-serif", flexShrink: 0,
        }}
      >
        {completed ? "Пройти снова" : "Начать"}
      </button>
    </div>
  );
}
