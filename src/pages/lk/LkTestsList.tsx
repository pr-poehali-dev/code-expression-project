import { useState } from "react";
import Icon from "@/components/ui/icon";
import { ACCENT, TOOL_COLORS, Test, BarriersHistoryItem, FinanceHistoryItem, ProfileHistoryItem, SalonHistoryItem } from "./LkTestsTypes";
import { formatMoney } from "./finance.logic";
import { formatMoneySalon } from "./salon.logic";

interface Props {
  tests: Test[];
  barriersHistory: BarriersHistoryItem[];
  financeHistory: FinanceHistoryItem[];
  profileHistory: ProfileHistoryItem[];
  salonHistory: SalonHistoryItem[];
  showSalon?: boolean;
  hasUnlimited?: boolean;
  onOpenDiag: () => void;
  onOpenMindsetSpec: () => void;
  onOpenMindset: () => void;
  onOpenBarriers: () => void;
  onOpenFinance: () => void;
  onOpenProfile: () => void;
  onOpenSalon: () => void;
  onOpenTest: (slug: string) => void;
}

export default function LkTestsList({ tests, barriersHistory, financeHistory, profileHistory, salonHistory, showSalon = false, hasUnlimited = false, onOpenDiag, onOpenMindsetSpec, onOpenMindset, onOpenBarriers, onOpenFinance, onOpenProfile, onOpenSalon, onOpenTest }: Props) {
  return (
    <div>
      <h1 style={{ fontFamily: "Cormorant, serif", fontSize: "clamp(24px,3vw,32px)", fontWeight: 700, color: "#1a1a1a", margin: "0 0 8px" }}>
        Инструменты роста
      </h1>
      <p style={{ fontSize: 14, color: "#888", margin: "0 0 28px" }}>
        Пройди тест — получи персональный разбор и конкретные советы
      </p>
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        {/* Системная диагностика — первой */}
        <ToolCard
          icon="Stethoscope" color="hsl(210,85%,45%)" bg="hsl(210,85%,96%)"
          title="Системная диагностика клиента"
          description="Введите жалобу — система покажет причины, компенсации, красные флаги и техники из шпаргалки"
          completed={false}
          onStart={onOpenDiag}
          startLabel="Начать диагностику"
        />

        {/* Развитие специалиста — только безлимит или купить за 25 000 ₽ */}
        {hasUnlimited ? (
          <ToolCard
            icon="Brain" color="hsl(260,70%,52%)" bg="hsl(260,70%,97%)"
            title="Развитие специалиста"
            description="Выберите цель — получите конкретный план, как её достичь: клиенты, позиционирование, практика, состояние"
            completed={false}
            onStart={onOpenMindsetSpec}
            startLabel="Начать"
          />
        ) : (
          <LockedToolCard
            icon="Brain" color="hsl(260,70%,52%)" bg="hsl(260,70%,97%)"
            title="Развитие специалиста"
            description="Клиенты, позиционирование, личный бренд, практика и состояние — персональный AI-план развития"
            price="25 000 ₽"
          />
        )}
        {tests.filter(test => test.slug !== "barriers" && test.slug !== "finance").map(test => {
          const colors = TOOL_COLORS[test.slug] || { color: ACCENT, bg: "hsl(185,85%,96%)" };
          const handleClick = () => {
            if (test.slug === "mindset") onOpenMindset();
            else if (test.slug === "barriers") onOpenBarriers();
            else if (test.slug === "finance") onOpenFinance();
            else onOpenTest(test.slug);
          };
          return (
            <ToolCard
              key={test.id}
              icon={test.icon}
              color={colors.color}
              bg={colors.bg}
              title={test.title}
              description={test.description}
              completed={test.completed}
              completedLabel={test.completed ? `Пройден · ${test.score} баллов` : undefined}
              onStart={handleClick}
            />
          );
        })}

        {/* Внутренние барьеры */}
        <ToolCard
          icon="ShieldAlert" color="hsl(20,85%,50%)" bg="hsl(20,85%,96%)"
          title="Внутренние барьеры специалиста"
          description="Выяви психологические блоки, которые мешают профессиональному росту"
          completed={barriersHistory.length > 0}
          completedLabel={barriersHistory.length > 0 ? `Пройден · IIB ${barriersHistory[0].iib}` : undefined}
          onStart={onOpenBarriers}
        />

        {/* Финансовая грамотность PRO */}
        <ToolCard
          icon="TrendingUp" color="hsl(145,60%,40%)" bg="hsl(145,60%,95%)"
          title="Финансовая грамотность специалиста PRO"
          description="Пойми, сколько ты реально хочешь зарабатывать — и как к этому прийти"
          completed={financeHistory.length > 0}
          completedLabel={financeHistory.length > 0 ? `Пройден · IFR ${financeHistory[0].ifr} · ${formatMoney(financeHistory[0].fr)} разрыв` : undefined}
          onStart={onOpenFinance}
        />

        {/* Финансовый профиль PRO */}
        <ToolCard
          icon="Brain" color="hsl(240,70%,55%)" bg="hsl(240,70%,97%)"
          title="Финансовый профиль PRO"
          description="Определи свой уровень финансового мышления, привычек и зрелости"
          completed={profileHistory.length > 0}
          completedLabel={profileHistory.length > 0 ? `Пройден · IFL ${profileHistory[0].ifl} · ${profileHistory[0].type_title}` : undefined}
          onStart={onOpenProfile}
        />

        {/* Диагностика роста салона PRO — только для сегмента "салон" */}
        {showSalon && (
          <ToolCard
            icon="Scissors" color="hsl(335,80%,50%)" bg="hsl(335,80%,97%)"
            title="Диагностика роста салона PRO"
            description="Поймите, где салон теряет деньги — и как увеличить прибыль без увеличения потока"
            completed={salonHistory.length > 0}
            completedLabel={salonHistory.length > 0 ? `Пройден · IPS ${salonHistory[0].ips} · потенциал +${formatMoneySalon(salonHistory[0].hidden_money)}` : undefined}
            onStart={onOpenSalon}
          />
        )}

        {tests.length === 0 && barriersHistory.length === 0 && financeHistory.length === 0 && profileHistory.length === 0 && salonHistory.length === 0 && (
          <div style={{ textAlign: "center", padding: 48, color: "#aaa" }}>
            Тесты ещё не добавлены
          </div>
        )}
      </div>
    </div>
  );
}

function ToolCard({ icon, color, bg, title, description, completed, completedLabel, onStart, startLabel }: {
  icon: string; color: string; bg: string;
  title: string; description: string;
  completed: boolean; completedLabel?: string;
  startLabel?: string;
  onStart: () => void;
}) {
  return (
    <div style={{
      background: "#fff", borderRadius: 16, padding: "18px 20px",
      boxShadow: "0 2px 12px rgba(0,0,0,0.04)", border: "1.5px solid #f0f0ec",
    }}>
      {/* Верхняя строка: иконка + текст + кнопка */}
      <div style={{ display: "flex", alignItems: "flex-start", gap: 14 }}>
        <div style={{ width: 44, height: 44, borderRadius: 12, flexShrink: 0, background: bg, display: "flex", alignItems: "center", justifyContent: "center", marginTop: 2 }}>
          <Icon name={icon} size={20} style={{ color }} />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 15, fontWeight: 700, color: "#1a1a1a", marginBottom: 3, lineHeight: 1.3 }}>{title}</div>
          <div style={{ fontSize: 12, color: "#888", lineHeight: 1.5 }}>{description}</div>
          {completedLabel && (
            <div style={{ display: "flex", alignItems: "center", gap: 5, marginTop: 6, flexWrap: "wrap" }}>
              <Icon name="CheckCircle" size={12} style={{ color, flexShrink: 0 }} />
              <span style={{ fontSize: 11, color, fontWeight: 600, lineHeight: 1.4 }}>{completedLabel}</span>
            </div>
          )}
        </div>
      </div>
      {/* Кнопка всегда снизу — не вылазит за край */}
      <button onClick={onStart} style={{
        display: "block", width: "100%", marginTop: 14,
        padding: "10px", borderRadius: 10, border: `1.5px solid ${color}`,
        background: completed ? "transparent" : color,
        color: completed ? color : "#fff",
        fontSize: 13, fontWeight: 700, cursor: "pointer",
        fontFamily: "Montserrat, sans-serif",
      }}>
        {completed ? "Пройти снова" : (startLabel || "Начать")}
      </button>
    </div>
  );
}

function LockedToolCard({ icon, color, bg, title, description, price }: {
  icon: string; color: string; bg: string;
  title: string; description: string; price: string;
}) {
  const [showInfo, setShowInfo] = useState(false);
  return (
    <div style={{ background: "#fff", borderRadius: 16, padding: "18px 20px", boxShadow: "0 2px 12px rgba(0,0,0,0.04)", border: "1.5px solid #f0f0ec", position: "relative", overflow: "hidden" }}>
      {/* Плашка «только безлимит» */}
      <div style={{ position: "absolute", top: 12, right: 14, background: "hsl(260,70%,97%)", color: "hsl(260,70%,52%)", fontSize: 10, fontWeight: 700, padding: "3px 8px", borderRadius: 20, border: "1px solid hsl(260,70%,85%)" }}>
        Безлимит
      </div>
      <div style={{ display: "flex", alignItems: "flex-start", gap: 14, opacity: 0.65 }}>
        <div style={{ width: 44, height: 44, borderRadius: 12, flexShrink: 0, background: bg, display: "flex", alignItems: "center", justifyContent: "center", marginTop: 2 }}>
          <Icon name={icon} size={20} style={{ color }} />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 15, fontWeight: 700, color: "#1a1a1a", marginBottom: 3, lineHeight: 1.3 }}>{title}</div>
          <div style={{ fontSize: 12, color: "#888", lineHeight: 1.5 }}>{description}</div>
        </div>
      </div>
      {showInfo ? (
        <div style={{ marginTop: 14, background: "hsl(260,70%,97%)", borderRadius: 12, padding: "14px 16px", border: "1px solid hsl(260,70%,85%)" }}>
          <div style={{ fontSize: 13, color: "hsl(260,70%,40%)", fontWeight: 600, marginBottom: 6 }}>
            Доступно в тарифе «Безлимит» или отдельно за {price}
          </div>
          <div style={{ fontSize: 12, color: "#666", lineHeight: 1.55 }}>
            Для получения доступа обратитесь к куратору или администратору.
          </div>
          <button onClick={() => setShowInfo(false)} style={{ marginTop: 10, background: "none", border: "none", color: "#aaa", fontSize: 12, cursor: "pointer", padding: 0, fontFamily: "Montserrat, sans-serif" }}>Скрыть</button>
        </div>
      ) : (
        <button onClick={() => setShowInfo(true)} style={{
          display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
          width: "100%", marginTop: 14, padding: "10px", borderRadius: 10,
          border: `1.5px solid hsl(260,70%,70%)`, background: "hsl(260,70%,97%)",
          color: "hsl(260,70%,52%)", fontSize: 13, fontWeight: 700, cursor: "pointer",
          fontFamily: "Montserrat, sans-serif",
        }}>
          <Icon name="Lock" size={13} />
          Получить доступ · {price}
        </button>
      )}
    </div>
  );
}