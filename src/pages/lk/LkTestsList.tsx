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
  showBodyTools?: boolean;
  onOpenDiag: () => void;
  onOpenMindsetSpec: () => void;
  onOpenMindset: () => void;
  onOpenBarriers: () => void;
  onOpenFinance: () => void;
  onOpenProfile: () => void;
  onOpenSalon: () => void;
  onOpenBodyMap: () => void;
  onOpenTest: (slug: string) => void;
  onNavigateToAcademy?: () => void;
}

export default function LkTestsList({ tests, barriersHistory, financeHistory, profileHistory, salonHistory, showSalon = false, hasUnlimited = false, showBodyTools = false, onOpenDiag, onOpenMindsetSpec, onOpenMindset, onOpenBarriers, onOpenFinance, onOpenProfile, onOpenSalon, onOpenBodyMap, onOpenTest, onNavigateToAcademy }: Props) {
  const COURSE_NAME = "«Развитие мышления специалиста по телу»";
  return (
    <div>
      <h1 style={{ fontFamily: "Cormorant, serif", fontSize: "clamp(24px,3vw,32px)", fontWeight: 700, color: "#1a1a1a", margin: "0 0 8px" }}>
        Развитие персонала
      </h1>
      <p style={{ fontSize: 14, color: "#64748B", margin: "0 0 16px", lineHeight: 1.6, maxWidth: 560 }}>
        Сильная команда — главный актив салона. Здесь собраны инструменты, которые помогают специалистам расти профессионально, избавляться от ограничивающих убеждений и выходить на новый уровень дохода.
      </p>
      <div style={{
        display: "flex", alignItems: "flex-start", gap: 16,
        background: "linear-gradient(135deg, hsl(260,60%,97%) 0%, hsl(185,85%,97%) 100%)",
        border: "1px solid hsl(260,60%,88%)",
        borderRadius: 16, padding: "16px 20px", marginBottom: 24,
      }}>
        <div style={{ fontSize: 28, lineHeight: 1, flexShrink: 0, marginTop: 2 }}>💎</div>
        <div>
          <div style={{ fontSize: 13, fontWeight: 700, color: "#0F172A", marginBottom: 4 }}>
            Коучинговые и тренерские инструменты
          </div>
          <div style={{ fontSize: 13, color: "#475569", lineHeight: 1.7 }}>
            Каждый инструмент — это методология, которую коучи и бизнес-тренеры применяют на личных сессиях
            стоимостью <span style={{ fontWeight: 700, color: "#0F172A" }}>от 25 000 ₽</span>.
            Здесь вы получаете тот же результат: персональный разбор, работу с ограничениями и
            конкретный план — для внутренней устойчивости и профессионального роста каждого специалиста команды.
          </div>
        </div>
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 28 }}>
        {[
          { icon: "Brain", text: "Рост мышления" },
          { icon: "Star", text: "Профессионализм" },
          { icon: "TrendingUp", text: "Доход специалиста" },
          { icon: "CheckCircle", text: "Персональный разбор" },
        ].map(tag => (
          <div key={tag.text} style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 12, fontWeight: 600, color: "#475569", background: "#F1F5F9", borderRadius: 20, padding: "5px 12px" }}>
            <span style={{ fontSize: 11 }}>✦</span>
            {tag.text}
          </div>
        ))}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 14 }}>
        {/* Системная диагностика */}
        {showBodyTools ? (
          <ToolCard
            icon="Stethoscope" color="hsl(210,85%,45%)" bg="hsl(210,85%,96%)"
            title="Системная диагностика клиента"
            description="Введите жалобу — система покажет причины, компенсации, красные флаги и техники из шпаргалки"
            completed={false}
            onStart={onOpenDiag}
            startLabel="Начать диагностику"
          />
        ) : (
          <CourseLockedToolCard
            icon="Stethoscope" color="hsl(210,85%,45%)" bg="hsl(210,85%,96%)"
            title="Системная диагностика клиента"
            description="Введите жалобу — система покажет причины, компенсации, красные флаги и техники из шпаргалки"
            courseName={COURSE_NAME}
            onGoToCourse={onNavigateToAcademy}
          />
        )}

        {/* Шпаргалка по телу */}
        {showBodyTools ? (
          <ToolCard
            icon="BookOpen" color="hsl(210,85%,45%)" bg="hsl(210,85%,96%)"
            title="Шпаргалка по телу"
            description="Кликните на зону тела — получите диагностику, возможные причины, красные флаги и техники работы"
            completed={false}
            onStart={onOpenBodyMap}
            startLabel="Открыть шпаргалку"
          />
        ) : (
          <CourseLockedToolCard
            icon="BookOpen" color="hsl(210,85%,45%)" bg="hsl(210,85%,96%)"
            title="Шпаргалка по телу"
            description="Кликните на зону тела — получите диагностику, возможные причины, красные флаги и техники работы"
            courseName={COURSE_NAME}
            onGoToCourse={onNavigateToAcademy}
          />
        )}

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



        {tests.length === 0 && barriersHistory.length === 0 && financeHistory.length === 0 && profileHistory.length === 0 && salonHistory.length === 0 && (
          <div style={{ textAlign: "center", padding: 48, color: "#aaa" }}>
            Тесты ещё не добавлены
          </div>
        )}
      </div>
    </div>
  );
}

function InfoBanner({ color, border, title, text }: { color: string; border: string; title: string; text: string }) {
  return (
    <div style={{ padding: "12px 16px", background: color, borderRadius: 12, border: `1px solid ${border}` }}>
      <div style={{ fontSize: 13, fontWeight: 600, color: "#0F172A", marginBottom: 4 }}>{title}</div>
      <div style={{ fontSize: 13, color: "#475569", lineHeight: 1.65 }}>{text}</div>
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
      display: "flex", flexDirection: "column",
    }}>
      <div style={{ display: "flex", alignItems: "flex-start", gap: 14, flex: 1 }}>
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

function CourseLockedToolCard({ icon, color, bg, title, description, courseName, onGoToCourse }: {
  icon: string; color: string; bg: string;
  title: string; description: string; courseName: string;
  onGoToCourse?: () => void;
}) {
  const [showInfo, setShowInfo] = useState(false);
  return (
    <div style={{ background: "#fff", borderRadius: 16, padding: "18px 20px", boxShadow: "0 2px 12px rgba(0,0,0,0.04)", border: "1.5px solid #f0f0ec", position: "relative", overflow: "hidden", display: "flex", flexDirection: "column" }}>
      <div style={{ position: "absolute", top: 12, right: 14, background: "hsl(210,85%,96%)", color: "hsl(210,85%,40%)", fontSize: 10, fontWeight: 700, padding: "3px 8px", borderRadius: 20, border: "1px solid hsl(210,85%,82%)", display: "flex", alignItems: "center", gap: 4 }}>
        <Icon name="Lock" size={9} /> Требуется курс
      </div>
      <div style={{ display: "flex", alignItems: "flex-start", gap: 14, flex: 1 }}>
        <div style={{ width: 44, height: 44, borderRadius: 12, flexShrink: 0, background: bg, display: "flex", alignItems: "center", justifyContent: "center", marginTop: 2, opacity: 0.5 }}>
          <Icon name={icon} size={20} style={{ color }} />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 15, fontWeight: 700, color: "#1a1a1a", marginBottom: 3, lineHeight: 1.3 }}>{title}</div>
          <div style={{ fontSize: 12, color: "#888", lineHeight: 1.5 }}>{description}</div>
        </div>
      </div>
      {showInfo ? (
        <div style={{ marginTop: 14, background: "hsl(210,85%,96%)", borderRadius: 12, padding: "14px 16px", border: "1px solid hsl(210,85%,82%)" }}>
          <div style={{ fontSize: 13, color: "hsl(210,85%,35%)", fontWeight: 700, marginBottom: 6, display: "flex", alignItems: "center", gap: 6 }}>
            <Icon name="GraduationCap" size={14} />
            Доступно после прохождения курса
          </div>
          <div style={{ fontSize: 12, color: "#555", lineHeight: 1.6, marginBottom: 12 }}>
            Этот инструмент входит в курс {courseName}. Получите доступ к курсу — и инструмент разблокируется автоматически.
          </div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {onGoToCourse && (
              <button onClick={onGoToCourse} style={{
                display: "flex", alignItems: "center", gap: 6,
                padding: "8px 16px", borderRadius: 9, border: "none",
                background: "hsl(210,85%,45%)", color: "#fff",
                fontSize: 12, fontWeight: 700, cursor: "pointer",
                fontFamily: "Montserrat, sans-serif",
              }}>
                <Icon name="GraduationCap" size={12} />
                Перейти к курсу
              </button>
            )}
            <button onClick={() => setShowInfo(false)} style={{ background: "none", border: "none", color: "#aaa", fontSize: 12, cursor: "pointer", padding: "8px 4px", fontFamily: "Montserrat, sans-serif" }}>
              Скрыть
            </button>
          </div>
        </div>
      ) : (
        <button onClick={() => setShowInfo(true)} style={{
          display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
          width: "100%", marginTop: 14, padding: "10px", borderRadius: 10,
          border: "1.5px solid hsl(210,85%,75%)", background: "hsl(210,85%,96%)",
          color: "hsl(210,85%,40%)", fontSize: 13, fontWeight: 700, cursor: "pointer",
          fontFamily: "Montserrat, sans-serif",
        }}>
          <Icon name="Lock" size={13} />
          Как разблокировать?
        </button>
      )}
    </div>
  );
}

function LockedToolCard({ icon, color, bg, title, description, price }: {
  icon: string; color: string; bg: string;
  title: string; description: string; price: string;
}) {
  const [showInfo, setShowInfo] = useState(false);
  return (
    <div style={{ background: "#fff", borderRadius: 16, padding: "18px 20px", boxShadow: "0 2px 12px rgba(0,0,0,0.04)", border: "1.5px solid #f0f0ec", position: "relative", overflow: "hidden", display: "flex", flexDirection: "column" }}>
      {/* Плашка «только безлимит» */}
      <div style={{ position: "absolute", top: 12, right: 14, background: "hsl(260,70%,97%)", color: "hsl(260,70%,52%)", fontSize: 10, fontWeight: 700, padding: "3px 8px", borderRadius: 20, border: "1px solid hsl(260,70%,85%)" }}>
        Безлимит
      </div>
      <div style={{ display: "flex", alignItems: "flex-start", gap: 14, opacity: 0.65, flex: 1 }}>
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