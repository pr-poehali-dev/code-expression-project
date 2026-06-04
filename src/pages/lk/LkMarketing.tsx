import { useState } from "react";
import Icon from "@/components/ui/icon";
import LkMarketingAudience from "./LkMarketingAudience";
import LkMarketingOffers from "./LkMarketingOffers";
import LkMarketingSemantics from "./LkMarketingSemantics";
import LkMarketingDirect from "./LkMarketingDirect";
import LkPostGen from "./LkPostGen";
import LkAiImageGen from "./LkAiImageGen";
import LkReelScript from "./LkReelScript";

const ACCENT = "hsl(185,85%,32%)";

interface Tool {
  id: string;
  icon: string;
  iconColor: string;
  iconBg: string;
  title: string;
  description: string;
  badge: "new" | "soon" | "cost";
  ready: boolean;
}

const BADGE_STYLES: Record<string, { bg: string; color: string; label: string }> = {
  new:  { bg: "hsl(145,60%,92%)", color: "hsl(145,60%,30%)", label: "Новое" },
  soon: { bg: "hsl(40,90%,93%)",  color: "hsl(40,70%,35%)",  label: "Скоро" },
  cost: { bg: "hsl(40,90%,93%)",  color: "hsl(40,70%,35%)",  label: "1 ⚡" },
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
    title: "Прогноз бюджета рекламы",
    description: "Интеграция с Яндекс.Директ API — цена клика, прогноз показов и рекомендуемый бюджет по ключевым словам.",
    badge: "soon",
    ready: false,
  },
];

const TOOLS_CONTENT: Tool[] = [
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

export default function LkMarketing() {
  const [active, setActive] = useState<string | null>(null);
  const [audienceData, setAudienceData] = useState<AudienceData | null>(null);
  const [semanticData, setSemanticData] = useState<SemanticGroups | null>(null);
  const ALL_TOOLS = [...TOOLS_DIRECT, ...TOOLS_CONTENT];
  const activeTool = ALL_TOOLS.find(t => t.id === active);

  if (active === "audience") {
    return (
      <LkMarketingAudience
        onBack={() => setActive(null)}
        onGoToOffers={(portraits, salonName) => {
          setAudienceData({ portraits, salonName });
          setActive("offers");
        }}
      />
    );
  }

  if (active === "offers") {
    return (
      <LkMarketingOffers
        onBack={() => setActive(null)}
        initialPortraits={audienceData?.portraits}
        initialSalonName={audienceData?.salonName}
        onGoToSemantics={() => setActive("semantics")}
      />
    );
  }

  if (active === "semantics") {
    return (
      <LkMarketingSemantics
        onBack={() => setActive(null)}
        onGoToDirect={(groups) => {
          setSemanticData({ groups });
          setActive("direct");
        }}
      />
    );
  }

  if (active === "direct") {
    return (
      <LkMarketingDirect
        onBack={() => setActive(null)}
        initialGroups={semanticData?.groups}
      />
    );
  }

  if (active === "post-gen") {
    return (
      <div>
        <button onClick={() => setActive(null)} style={{ display: "flex", alignItems: "center", gap: 6, background: "none", border: "none", color: "#64748B", fontSize: 13, fontWeight: 600, cursor: "pointer", padding: 0, marginBottom: 24, fontFamily: "Montserrat,sans-serif" }}>
          <Icon name="ArrowLeft" size={15} /> Назад к маркетингу
        </button>
        <LkPostGen />
      </div>
    );
  }

  if (active === "image-gen") {
    return (
      <div>
        <button onClick={() => setActive(null)} style={{ display: "flex", alignItems: "center", gap: 6, background: "none", border: "none", color: "#64748B", fontSize: 13, fontWeight: 600, cursor: "pointer", padding: 0, marginBottom: 24, fontFamily: "Montserrat,sans-serif" }}>
          <Icon name="ArrowLeft" size={15} /> Назад к маркетингу
        </button>
        <LkAiImageGen />
      </div>
    );
  }

  if (active === "reel-script") {
    return (
      <div>
        <button onClick={() => setActive(null)} style={{ display: "flex", alignItems: "center", gap: 6, background: "none", border: "none", color: "#64748B", fontSize: 13, fontWeight: 600, cursor: "pointer", padding: 0, marginBottom: 24, fontFamily: "Montserrat,sans-serif" }}>
          <Icon name="ArrowLeft" size={15} /> Назад к маркетингу
        </button>
        <LkReelScript />
      </div>
    );
  }

  if (activeTool) {
    return <ComingSoonPlaceholder tool={activeTool} onBack={() => setActive(null)} />;
  }

  return (
    <div>
      <div style={{ marginBottom: 28 }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: ACCENT, letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 6 }}>
          Маркетинг · В разработке
        </div>
        <h2 style={{ fontSize: "clamp(20px,2.5vw,28px)", fontWeight: 700, color: "#0F172A", margin: "0 0 8px", letterSpacing: "-0.3px" }}>
          Маркетинг салона
        </h2>
        <p style={{ fontSize: 14, color: "#64748B", margin: 0, lineHeight: 1.6, maxWidth: 560 }}>
          Создавайте контент, который приводит клиентов: посты, визуалы и рилсы для соцсетей — и готовые рекламные кампании в Яндекс.Директ от портрета аудитории до объявлений.
        </p>
      </div>

      {/* Контент и SMM */}
      <div style={{ marginBottom: 10, display: "flex", alignItems: "center", gap: 8 }}>
        <Icon name="Sparkles" size={15} style={{ color: ACCENT }} />
        <span style={{ fontSize: 12, fontWeight: 700, color: ACCENT, textTransform: "uppercase", letterSpacing: 1 }}>Контент и SMM</span>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(260px,1fr))", gap: 16, marginBottom: 32 }}>
        {TOOLS_CONTENT.map(tool => (
          <ToolCard key={tool.id} tool={tool} onOpen={setActive} />
        ))}
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
        {TOOLS_DIRECT.map(tool => (
          <ToolCard key={tool.id} tool={tool} onOpen={setActive} />
        ))}
      </div>

      <div style={{ marginTop: 32, background: "linear-gradient(135deg,hsl(185,85%,32%),hsl(185,85%,22%))", borderRadius: 16, padding: "20px 24px", display: "flex", alignItems: "center", gap: 16 }}>
        <div style={{ width: 44, height: 44, borderRadius: 12, background: "rgba(255,255,255,0.15)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          <Icon name="Rocket" size={22} style={{ color: "#fff" }} />
        </div>
        <div>
          <div style={{ fontSize: 14, fontWeight: 700, color: "#fff", marginBottom: 4 }}>Раздел активно разрабатывается</div>
          <div style={{ fontSize: 13, color: "rgba(255,255,255,0.75)", lineHeight: 1.5 }}>Инструменты подключаются поочерёдно. Первыми появятся бесплатные ИИ-инструменты на базе профиля вашего салона.</div>
        </div>
      </div>
    </div>
  );
}