import { useState } from "react";
import Icon from "@/components/ui/icon";
import { useLkAuth } from "@/contexts/LkAuthContext";
import LkMarketingAudience from "./LkMarketingAudience";
import LkMarketingOffers from "./LkMarketingOffers";
import LkMarketingSemantics from "./LkMarketingSemantics";
import LkMarketingDirect from "./LkMarketingDirect";
import LkPostGen from "./LkPostGen";
import LkAiImageGen from "./LkAiImageGen";
import LkReelScript from "./LkReelScript";
import { useEnergy } from "@/contexts/EnergyContext";
import { showEnergyGate } from "@/components/EnergyGate";
import LkMarketingBudget from "./LkMarketingBudget";
import LkMarketingSeo from "./LkMarketingSeo";

const ACCENT = "hsl(185,85%,32%)";

interface Tool {
  id: string;
  icon: string;
  iconColor: string;
  iconBg: string;
  title: string;
  description: string;
  badge: "new" | "soon" | "cost" | "cost3";
  ready: boolean;
}

const BADGE_STYLES: Record<string, { bg: string; color: string; label: string }> = {
  new:   { bg: "hsl(145,60%,92%)", color: "hsl(145,60%,30%)", label: "Новое" },
  soon:  { bg: "hsl(40,90%,93%)",  color: "hsl(40,70%,35%)",  label: "Скоро" },
  cost:  { bg: "hsl(40,90%,93%)",  color: "hsl(40,70%,35%)",  label: "1 ⚡" },
  cost3: { bg: "hsl(40,90%,93%)",  color: "hsl(40,70%,35%)",  label: "3 ⚡" },
};

const TOOLS_DIRECT: Tool[] = [
  {
    id: "audience",
    icon: "Users",
    iconColor: "hsl(220,80%,50%)",
    iconBg: "hsl(220,80%,95%)",
    title: "Портрет целевой аудитории",
    description: "ИИ анализирует ваши услуги и создаёт детальные портреты ЦА с болями, мотивацией и каналами охвата.",
    badge: "cost",
    ready: true,
  },
  {
    id: "offers",
    icon: "Gift",
    iconColor: "hsl(280,60%,52%)",
    iconBg: "hsl(280,60%,95%)",
    title: "Офферы под ЦА",
    description: "Генерирует убедительные предложения и акции под каждый сегмент вашей аудитории.",
    badge: "cost",
    ready: true,
  },
  {
    id: "semantics",
    icon: "Search",
    iconColor: "hsl(145,60%,38%)",
    iconBg: "hsl(145,60%,93%)",
    title: "Семантическое ядро",
    description: "Список поисковых запросов для Яндекс.Директ под ваши услуги — высокочастотные, средние, низкочастотные.",
    badge: "cost",
    ready: true,
  },
  {
    id: "direct",
    icon: "MousePointerClick",
    iconColor: "hsl(25,90%,50%)",
    iconBg: "hsl(25,90%,94%)",
    title: "Объявления для Яндекс.Директ",
    description: "Готовые тексты по требованиям Яндекса: заголовок 1 (≤35), заголовок 2 (≤30), текст (≤81 симв.).",
    badge: "cost",
    ready: true,
  },
  {
    id: "budget",
    icon: "Calculator",
    iconColor: "hsl(185,85%,32%)",
    iconBg: "hsl(185,85%,93%)",
    title: "Медиаплан для Директа",
    description: "ДРР, сравнение стратегий CPC/CPA/ДРР, прогноз клиентов и распределение бюджета — на основе данных вашего салона.",
    badge: "cost3",
    ready: true,
  },
];

const TOOLS_CONTENT: Tool[] = [
  {
    id: "seo",
    icon: "Search",
    iconColor: "hsl(199,89%,40%)",
    iconBg: "hsl(199,89%,95%)",
    title: "SEO-оптимизатор",
    description: "Анализирует сайт салона: мета-теги, заголовки, текст, структуру. Выдаёт конкретные правки с готовыми вариантами.",
    badge: "new",
    ready: true,
  },
  {
    id: "post-gen",
    icon: "FileText",
    iconColor: "hsl(210,80%,50%)",
    iconBg: "hsl(210,80%,96%)",
    title: "Генератор постов",
    description: "Тема → 5 заголовков на выбор → готовый текст + картинка. Пост за 2 минуты.",
    badge: "new",
    ready: true,
  },
  {
    id: "image-gen",
    icon: "Image",
    iconColor: "hsl(40,90%,45%)",
    iconBg: "hsl(40,90%,96%)",
    title: "Генерация изображений",
    description: "Создавайте визуалы для постов, сторис и баннеров. ИИ учитывает стиль и аудиторию вашего салона.",
    badge: "new",
    ready: true,
  },
  {
    id: "reel-script",
    icon: "Video",
    iconColor: "hsl(335,80%,50%)",
    iconBg: "hsl(335,80%,97%)",
    title: "Сценарий для рилса",
    description: "Идея → покадровый сценарий + обложка. Снимаете сами по готовой инструкции.",
    badge: "new",
    ready: true,
  },
];

function ToolCard({ tool, onOpen }: { tool: Tool; onOpen: (id: string) => void }) {
  const badge = BADGE_STYLES[tool.badge];
  const disabled = !tool.ready;

  return (
    <div
      onClick={() => !disabled && onOpen(tool.id)}
      style={{
        background: "#fff",
        border: `1.5px solid ${disabled ? "#E8ECF0" : "#E0EEF0"}`,
        borderRadius: 18,
        padding: "24px 22px",
        cursor: disabled ? "default" : "pointer",
        opacity: disabled ? 0.75 : 1,
        transition: "all 0.18s",
        display: "flex",
        flexDirection: "column",
        gap: 14,
        position: "relative",
        overflow: "hidden",
      }}
      onMouseEnter={e => { if (!disabled) { const el = e.currentTarget; el.style.boxShadow = "0 12px 32px rgba(15,23,42,0.1)"; el.style.transform = "translateY(-3px)"; el.style.borderColor = "hsl(185,85%,65%)"; }}}
      onMouseLeave={e => { if (!disabled) { const el = e.currentTarget; el.style.boxShadow = "none"; el.style.transform = "translateY(0)"; el.style.borderColor = "#E0EEF0"; }}}
    >
      <div style={{ position: "absolute", top: 16, right: 16, fontSize: 10, fontWeight: 700, background: badge.bg, color: badge.color, borderRadius: 6, padding: "3px 8px", letterSpacing: 0.5, textTransform: "uppercase" }}>
        {badge.label}
      </div>

      <div style={{ width: 48, height: 48, borderRadius: 14, background: tool.iconBg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
        <Icon name={tool.icon} size={22} style={{ color: tool.iconColor }} />
      </div>

      <div>
        <div style={{ fontSize: 15, fontWeight: 700, color: "#0F172A", marginBottom: 6, paddingRight: 52 }}>{tool.title}</div>
        <div style={{ fontSize: 13, color: "#64748B", lineHeight: 1.6 }}>{tool.description}</div>
      </div>

      <div style={{ marginTop: "auto" }}>
        {tool.ready
          ? <div style={{ display: "inline-flex", alignItems: "center", gap: 5, fontSize: 12, fontWeight: 700, color: ACCENT }}>
              Открыть <Icon name="ArrowRight" size={13} />
            </div>
          : <div style={{ display: "inline-flex", alignItems: "center", gap: 5, fontSize: 12, fontWeight: 600, color: "#94A3B8" }}>
              <Icon name="Clock" size={13} />
              Скоро будет доступно
            </div>
        }
      </div>
    </div>
  );
}

function ComingSoonPlaceholder({ tool, onBack }: { tool: Tool; onBack: () => void }) {
  return (
    <div>
      <button onClick={onBack} style={{ display: "flex", alignItems: "center", gap: 6, background: "none", border: "none", color: "#64748B", fontSize: 13, fontWeight: 600, cursor: "pointer", padding: 0, marginBottom: 28, fontFamily: "Montserrat,sans-serif" }}>
        <Icon name="ArrowLeft" size={15} /> Назад к маркетингу
      </button>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: 320, gap: 16, textAlign: "center" }}>
        <div style={{ width: 72, height: 72, borderRadius: 20, background: tool.iconBg, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Icon name={tool.icon} size={32} style={{ color: tool.iconColor }} />
        </div>
        <div>
          <div style={{ fontSize: 22, fontWeight: 700, color: "#0F172A", marginBottom: 8 }}>{tool.title}</div>
          <div style={{ fontSize: 14, color: "#64748B", maxWidth: 380, lineHeight: 1.6 }}>{tool.description}</div>
        </div>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "hsla(185,85%,32%,0.08)", borderRadius: 50, padding: "8px 18px" }}>
          <Icon name="Clock" size={13} style={{ color: ACCENT }} />
          <span style={{ fontSize: 12, fontWeight: 600, color: ACCENT }}>В разработке — скоро будет доступно</span>
        </div>
      </div>
    </div>
  );
}

interface AudienceData {
  portraits: { archetype: string; age_range: string; occupation: string; income: string; pains: string[]; motivations: string[]; services_interest: string[]; channels: string[]; hook: string }[];
  salonName: string;
}

interface SemanticGroups {
  groups: { group: string; service_tag: string; keywords: { query: string; frequency: string; frequency_label: string; intent: string }[] }[];
}

function hasCachedResult(key: string): boolean {
  try { return !!localStorage.getItem(key); } catch { return false; }
}

const CHAIN_PREREQ: Record<string, { key: string; toolId: string; toolTitle: string }> = {
  offers:    { key: "mkt_audience_v2_",  toolId: "audience",  toolTitle: "Портрет целевой аудитории" },
  semantics: { key: "mkt_offers_v2_",   toolId: "offers",    toolTitle: "Офферы под ЦА" },
  direct:    { key: "mkt_semantics_v2_", toolId: "semantics", toolTitle: "Семантическое ядро" },
};

function StepBlocker({ missing, onGoTo, onBack }: { missing: { toolId: string; toolTitle: string }; onGoTo: () => void; onBack: () => void }) {
  return (
    <div>
      <button onClick={onBack} style={{ display: "flex", alignItems: "center", gap: 6, background: "none", border: "none", color: "#64748B", fontSize: 13, fontWeight: 600, cursor: "pointer", padding: 0, marginBottom: 28, fontFamily: "Montserrat,sans-serif" }}>
        <Icon name="ArrowLeft" size={15} /> Назад к маркетингу
      </button>
      <div style={{ background: "#fff", borderRadius: 20, border: "1.5px solid hsl(40,90%,80%)", padding: "36px 32px", maxWidth: 500, display: "flex", flexDirection: "column", alignItems: "center", gap: 20, textAlign: "center" }}>
        <div style={{ width: 64, height: 64, borderRadius: 18, background: "hsl(40,90%,94%)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Icon name="AlertCircle" size={28} style={{ color: "hsl(40,80%,45%)" }} />
        </div>
        <div>
          <div style={{ fontSize: 18, fontWeight: 700, color: "#0F172A", marginBottom: 10 }}>Сначала выполните предыдущий шаг</div>
          <div style={{ fontSize: 14, color: "#64748B", lineHeight: 1.7 }}>
            Этот инструмент использует результаты из <strong>«{missing.toolTitle}»</strong>. Сначала запустите его — это займёт меньше минуты.
          </div>
        </div>
        <button
          onClick={onGoTo}
          style={{ padding: "12px 28px", borderRadius: 12, border: "none", background: ACCENT, color: "#fff", fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "Montserrat,sans-serif" }}
        >
          Перейти к «{missing.toolTitle}»
        </button>
      </div>
    </div>
  );
}

export default function LkMarketing({ initialTool }: { initialTool?: string } = {}) {
  const [active, setActive] = useState<string | null>(initialTool || null);
  const [audienceData, setAudienceData] = useState<AudienceData | null>(null);
  const [semanticData, setSemanticData] = useState<SemanticGroups | null>(null);
  const { hasPaid, loading: energyLoading } = useEnergy();
  const { user } = useLkAuth();
  const salonId = user?.salon_id ?? "";
  const websiteUrl = (user as unknown as Record<string, unknown>)?.website_url as string | undefined;
  const ALL_TOOLS = [...TOOLS_DIRECT, ...TOOLS_CONTENT];
  const activeTool = ALL_TOOLS.find(t => t.id === active);

  const openTool = (id: string) => {
    if (!hasPaid) {
      showEnergyGate({ message: "Пополните баланс, чтобы открыть инструменты маркетинга" });
      return;
    }
    setActive(id);
    window.scrollTo({ top: 0, behavior: "instant" });
  };

  const closeTool = () => {
    setActive(null);
    window.scrollTo({ top: 0, behavior: "instant" });
  };

  // Проверка цепочки — показываем заглушку если предыдущий шаг не выполнен
  if (hasPaid && active && CHAIN_PREREQ[active]) {
    const prereq = CHAIN_PREREQ[active];
    if (!hasCachedResult(prereq.key + salonId)) {
      return (
        <StepBlocker
          missing={prereq}
          onGoTo={() => { setActive(prereq.toolId); window.scrollTo({ top: 0, behavior: "instant" }); }}
          onBack={closeTool}
        />
      );
    }
  }

  if (hasPaid && active === "audience") {
    return (
      <LkMarketingAudience
        onBack={closeTool}
        onGoToOffers={(portraits, salonName) => {
          setAudienceData({ portraits, salonName });
          setActive("offers");
          window.scrollTo({ top: 0, behavior: "instant" });
        }}
      />
    );
  }

  if (hasPaid && active === "offers") {
    return (
      <LkMarketingOffers
        onBack={closeTool}
        initialPortraits={audienceData?.portraits}
        initialSalonName={audienceData?.salonName}
        onGoToSemantics={() => { setActive("semantics"); window.scrollTo({ top: 0, behavior: "instant" }); }}
      />
    );
  }

  if (hasPaid && active === "semantics") {
    return (
      <LkMarketingSemantics
        onBack={closeTool}
        onGoToDirect={(groups) => {
          setSemanticData({ groups });
          setActive("direct");
          window.scrollTo({ top: 0, behavior: "instant" });
        }}
      />
    );
  }

  if (hasPaid && active === "direct") {
    return (
      <LkMarketingDirect
        onBack={closeTool}
        initialGroups={semanticData?.groups}
      />
    );
  }

  if (hasPaid && active === "post-gen") {
    return (
      <div>
        <button onClick={closeTool} style={{ display: "flex", alignItems: "center", gap: 6, background: "none", border: "none", color: "#64748B", fontSize: 13, fontWeight: 600, cursor: "pointer", padding: 0, marginBottom: 24, fontFamily: "Montserrat,sans-serif" }}>
          <Icon name="ArrowLeft" size={15} /> Назад к маркетингу
        </button>
        <LkPostGen />
      </div>
    );
  }

  if (hasPaid && active === "image-gen") {
    return (
      <div>
        <button onClick={closeTool} style={{ display: "flex", alignItems: "center", gap: 6, background: "none", border: "none", color: "#64748B", fontSize: 13, fontWeight: 600, cursor: "pointer", padding: 0, marginBottom: 24, fontFamily: "Montserrat,sans-serif" }}>
          <Icon name="ArrowLeft" size={15} /> Назад к маркетингу
        </button>
        <LkAiImageGen />
      </div>
    );
  }

  if (hasPaid && active === "reel-script") {
    return (
      <div>
        <button onClick={closeTool} style={{ display: "flex", alignItems: "center", gap: 6, background: "none", border: "none", color: "#64748B", fontSize: 13, fontWeight: 600, cursor: "pointer", padding: 0, marginBottom: 24, fontFamily: "Montserrat,sans-serif" }}>
          <Icon name="ArrowLeft" size={15} /> Назад к маркетингу
        </button>
        <LkReelScript />
      </div>
    );
  }

  if (hasPaid && active === "budget") {
    return <LkMarketingBudget onBack={closeTool} />;
  }

  if (hasPaid && active === "seo") {
    return <LkMarketingSeo onBack={closeTool} initialUrl={websiteUrl} />;
  }

  if (hasPaid && activeTool) {
    return <ComingSoonPlaceholder tool={activeTool} onBack={closeTool} />;
  }

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
          <ToolCard key={tool.id} tool={tool} onOpen={openTool} />
        ))}
      </div>

      {/* Конструктор лендингов */}
      <div style={{ marginBottom: 16, padding: "18px 20px", background: "linear-gradient(135deg, rgba(45,212,191,0.08), rgba(20,184,166,0.04))", borderRadius: 14, border: "1.5px solid rgba(45,212,191,0.25)", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, flexWrap: "wrap" }}>
        <div style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
          <div style={{ width: 40, height: 40, borderRadius: 10, background: "rgba(45,212,191,0.12)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <Icon name="LayoutTemplate" size={20} style={{ color: "#2DD4BF" }} />
          </div>
          <div>
            <div style={{ fontSize: 14, fontWeight: 700, color: "#0F172A", marginBottom: 4, display: "flex", alignItems: "center", gap: 8 }}>
              Конструктор лендингов
              <span style={{ fontSize: 10, fontWeight: 700, background: "#2DD4BF", color: "#0F172A", padding: "2px 8px", borderRadius: 20, letterSpacing: 0.5 }}>НОВОЕ</span>
            </div>
            <div style={{ fontSize: 13, color: "#64748B", lineHeight: 1.5, maxWidth: 420 }}>
              Создайте продающую страницу для услуги или акции за несколько минут — без дизайнера и верстальщика.
            </div>
          </div>
        </div>
        <button
          onClick={() => {
            sessionStorage.setItem("lk_ai_tool_pending", "landing-guide");
            sessionStorage.setItem("lk_tab", "ai");
            window.location.reload();
          }}
          style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "10px 20px", borderRadius: 8, background: "#2DD4BF", color: "#0F172A", fontSize: 13, fontWeight: 600, border: "none", cursor: "pointer", flexShrink: 0, whiteSpace: "nowrap", fontFamily: "Montserrat, sans-serif" }}
        >
          <Icon name="LayoutTemplate" size={14} />
          База знаний и создание
        </button>
      </div>

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
              <ToolCard tool={tool} onOpen={openTool} />
            </div>
          );
        })}
      </div>


    </div>
  );
}