import Icon from "@/components/ui/icon";
import { useEnergy } from "@/contexts/EnergyContext";
import { useLkAuth } from "@/contexts/LkAuthContext";
import { ACCENT, CHAIN_PREREQ, TOOLS_CONTENT, TOOLS_DIRECT } from "./LkMarketingTypes";
import { ToolCard, hasCachedResult } from "./LkMarketingShared";

interface Props {
  salonId: string | number;
  onOpenTool: (id: string) => void;
}

export default function LkMarketingDashboard({ salonId, onOpenTool }: Props) {
  const { hasPaid, loading: energyLoading } = useEnergy();
  const { user } = useLkAuth();

  return (
    <div>
      <div style={{ marginBottom: 28 }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: ACCENT, letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 6 }}>
          Маркетинг
        </div>
        <h2 style={{ fontSize: "clamp(20px,2.5vw,28px)", fontWeight: 700, color: "#0F172A", margin: "0 0 8px", letterSpacing: "-0.3px" }}>
          Маркетинг салона
        </h2>
        <p style={{ fontSize: 14, color: "#64748B", margin: "0 0 14px", lineHeight: 1.6, maxWidth: 600 }}>
          Полный цикл маркетинга салона в одном месте: от создания контента для соцсетей до настройки рекламы в Яндекс.Директ. ИИ знает ваш салон, вашу аудиторию и помогает привлекать новых клиентов — без агентств, без лишних затрат и без маркетолога в штате.
        </p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {[
            { icon: "Instagram", text: "Контент для соцсетей" },
            { icon: "Target", text: "Реклама в Директ" },
            { icon: "Users", text: "Портрет аудитории" },
            { icon: "TrendingUp", text: "Рост клиентской базы" },
          ].map(tag => (
            <div key={tag.text} style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 12, fontWeight: 600, color: "#475569", background: "#F1F5F9", borderRadius: 20, padding: "5px 12px" }}>
              <Icon name={tag.icon} size={12} style={{ color: ACCENT }} />
              {tag.text}
            </div>
          ))}
        </div>
      </div>

      {/* Баннер для незаплативших */}
      {!energyLoading && !hasPaid && (
        <div style={{ marginBottom: 20, padding: "12px 16px", background: "hsl(40,90%,96%)", border: "1px solid hsl(40,90%,80%)", borderRadius: 12, display: "flex", alignItems: "center", gap: 10 }}>
          <Icon name="Info" size={15} style={{ color: "hsl(30,95%,45%)", flexShrink: 0 }} />
          <div style={{ fontSize: 13, color: "hsl(30,70%,35%)", lineHeight: 1.5 }}>
            Инструменты маркетинга доступны после первого пополнения баланса. Бонусные 100 энергий можно использовать в разделе <strong>«Развитие персонала»</strong>.
          </div>
        </div>
      )}

      {/* Контент и SMM */}
      <div style={{ marginBottom: 10, display: "flex", alignItems: "center", gap: 8 }}>
        <Icon name="Sparkles" size={15} style={{ color: ACCENT }} />
        <span style={{ fontSize: 12, fontWeight: 700, color: ACCENT, textTransform: "uppercase", letterSpacing: 1 }}>Контент и SMM</span>
      </div>
      <div style={{ marginBottom: 16, padding: "14px 18px", background: "hsl(210,80%,97%)", borderRadius: 12, border: "1px solid hsl(210,80%,88%)" }}>
        <div style={{ fontSize: 13, color: "#0F172A", fontWeight: 600, marginBottom: 4 }}>Контент без SMM-специалиста в штате</div>
        <div style={{ fontSize: 13, color: "#64748B", lineHeight: 1.6 }}>
          ИИ знает ваш салон, услуги и аудиторию — и за минуты создаёт готовые посты, визуалы и сценарии для рилсов. Не нужно тратить часы на придумывание тем и текстов: просто выбирайте и публикуйте.
        </div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(260px,1fr))", gap: 16, marginBottom: 32 }}>
        {TOOLS_CONTENT.map(tool => (
          <ToolCard key={tool.id} tool={tool} onOpen={onOpenTool} />
        ))}
      </div>

      {/* Конструктор лендингов */}
      <div style={{ marginBottom: 16, padding: "18px 20px", background: "#F8FAFC", borderRadius: 14, border: "1.5px solid #E2E8F0", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, flexWrap: "wrap", opacity: 0.75 }}>
        <div style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
          <div style={{ width: 40, height: 40, borderRadius: 10, background: "#E2E8F0", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <Icon name="LayoutTemplate" size={20} style={{ color: "#94A3B8" }} />
          </div>
          <div>
            <div style={{ fontSize: 14, fontWeight: 700, color: "#64748B", marginBottom: 4, display: "flex", alignItems: "center", gap: 8 }}>
              Конструктор лендингов
              <span style={{ fontSize: 10, fontWeight: 700, background: "#E2E8F0", color: "#94A3B8", padding: "2px 8px", borderRadius: 20, letterSpacing: 0.5 }}>СКОРО</span>
            </div>
            <div style={{ fontSize: 13, color: "#94A3B8", lineHeight: 1.5, maxWidth: 420 }}>
              Создайте продающую страницу для услуги или акции за несколько минут — без дизайнера и верстальщика.
            </div>
          </div>
        </div>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "10px 20px", borderRadius: 8, background: "#E2E8F0", color: "#94A3B8", fontSize: 13, fontWeight: 600, flexShrink: 0, whiteSpace: "nowrap" }}>
          <Icon name="Clock" size={14} />
          В разработке
        </div>
      </div>
      {user?.is_admin && (
        <div style={{ marginBottom: 16 }}>
          <button
            onClick={() => {
              sessionStorage.setItem("lk_ai_tool_pending", "landing-guide");
              sessionStorage.setItem("lk_tab", "ai");
              window.location.reload();
            }}
            style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "8px 16px", borderRadius: 8, background: "rgba(45,212,191,0.1)", color: "#2DD4BF", fontSize: 12, fontWeight: 600, border: "1px solid rgba(45,212,191,0.3)", cursor: "pointer", fontFamily: "Montserrat, sans-serif" }}
          >
            <Icon name="LayoutTemplate" size={13} />
            Открыть конструктор (админ)
          </button>
        </div>
      )}

      {/* Яндекс.Директ */}
      <div style={{ marginBottom: 10, display: "flex", alignItems: "center", gap: 8 }}>
        <Icon name="Target" size={15} style={{ color: ACCENT }} />
        <span style={{ fontSize: 12, fontWeight: 700, color: ACCENT, textTransform: "uppercase", letterSpacing: 1 }}>Яндекс.Директ</span>
      </div>
      <div style={{ marginBottom: 16, padding: "14px 18px", background: "hsl(185,85%,97%)", borderRadius: 12, border: "1px solid hsl(185,85%,88%)" }}>
        <div style={{ fontSize: 13, color: "#0F172A", fontWeight: 600, marginBottom: 4 }}>Экономьте на рекламе без потери результата</div>
        <div style={{ fontSize: 13, color: "#64748B", lineHeight: 1.6 }}>
          Раньше за это платили агентству: портрет аудитории, подбор ключей, написание объявлений. Теперь ИИ делает всё это за минуты — на основе реальных данных вашего салона. Объявления точно попадают в свою аудиторию, бюджет не расходуется впустую.
        </div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(260px,1fr))", gap: 16 }}>
        {TOOLS_DIRECT.map((tool, idx) => {
          const prereq = CHAIN_PREREQ[tool.id];
          const isDone = hasCachedResult(`mkt_${tool.id}_v2_${salonId}`);
          const isLocked = prereq && !hasCachedResult(prereq.key + salonId);
          const stepNum = idx + 1;
          return (
            <div key={tool.id} style={{ position: "relative" }}>
              {stepNum <= 4 && (
                <div style={{ position: "absolute", top: -8, left: 16, zIndex: 2, display: "flex", alignItems: "center", gap: 5, background: isDone ? "hsl(145,60%,38%)" : isLocked ? "#94A3B8" : ACCENT, color: "#fff", fontSize: 10, fontWeight: 700, borderRadius: 20, padding: "2px 10px", letterSpacing: 0.5 }}>
                  {isDone ? <Icon name="Check" size={9} /> : <span>Шаг {stepNum}</span>}
                  {isDone && "Выполнено"}
                  {isLocked && !isDone && `Шаг ${stepNum} · нужен шаг ${stepNum - 1}`}
                </div>
              )}
              <ToolCard tool={tool} onOpen={onOpenTool} />
            </div>
          );
        })}
      </div>
    </div>
  );
}
