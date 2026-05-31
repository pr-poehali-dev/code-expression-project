import { useState } from "react";
import Icon from "@/components/ui/icon";
import LkAiImageGen from "./LkAiImageGen";
import LkSalonAudit from "./LkSalonAudit";
import LkPostGen from "./LkPostGen";
import LkReelScript from "./LkReelScript";

const ACCENT = "hsl(185,85%,32%)";

interface ToolCardProps {
  icon: string;
  color: string;
  bg: string;
  title: string;
  description: string;
  badge?: string;
  onStart: () => void;
}

function ToolCard({ icon, color, bg, title, description, badge, onStart }: ToolCardProps) {
  return (
    <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #eee", padding: "20px 20px 18px", display: "flex", flexDirection: "column" }}
      onMouseEnter={e => (e.currentTarget.style.boxShadow = "0 4px 20px rgba(0,0,0,0.07)")}
      onMouseLeave={e => (e.currentTarget.style.boxShadow = "none")}
    >
      <div style={{ display: "flex", alignItems: "flex-start", gap: 14, flex: 1, marginBottom: 16 }}>
        <div style={{ width: 44, height: 44, borderRadius: 12, background: bg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          <Icon name={icon} size={22} style={{ color }} />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: "#1a1a1a" }}>{title}</div>
            {badge && (
              <span style={{ fontSize: 9, fontWeight: 700, background: "hsl(40,90%,50%)", color: "#fff", borderRadius: 4, padding: "2px 6px", letterSpacing: 0.5, textTransform: "uppercase", flexShrink: 0 }}>
                {badge}
              </span>
            )}
          </div>
          <div style={{ fontSize: 12, color: "#888", lineHeight: 1.6 }}>{description}</div>
        </div>
      </div>
      <button
        onClick={onStart}
        style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 7, background: `linear-gradient(135deg,hsl(40,90%,50%),hsl(30,95%,50%))`, color: "#fff", border: "none", borderRadius: 10, padding: "11px 20px", fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "Montserrat,sans-serif", width: "100%", marginTop: "auto" }}
      >
        <Icon name="Sparkles" size={14} />
        Открыть инструмент
      </button>
    </div>
  );
}

interface ComingSoonCardProps {
  icon: string;
  color: string;
  bg: string;
  title: string;
  description: string;
}

function ComingSoonCard({ icon, color, bg, title, description }: ComingSoonCardProps) {
  return (
    <div style={{ background: "#fafaf8", borderRadius: 16, border: "1px dashed #e0e0db", padding: "20px 20px 18px", display: "flex", flexDirection: "column", gap: 12, opacity: 0.75 }}>
      <div style={{ display: "flex", alignItems: "flex-start", gap: 14 }}>
        <div style={{ width: 44, height: 44, borderRadius: 12, background: bg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          <Icon name={icon} size={22} style={{ color }} />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: "#555" }}>{title}</div>
            <span style={{ fontSize: 9, fontWeight: 700, background: "#e0e0db", color: "#999", borderRadius: 4, padding: "2px 6px", letterSpacing: 0.5, textTransform: "uppercase" }}>скоро</span>
          </div>
          <div style={{ fontSize: 12, color: "#aaa", lineHeight: 1.6 }}>{description}</div>
        </div>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "#bbb", padding: "10px 0 0" }}>
        <Icon name="Clock" size={13} />
        В разработке
      </div>
    </div>
  );
}

type Tool = "image-gen" | "salon-audit" | "post-gen" | "reel-script" | null;

export default function LkAiTools() {
  const [activeTool, setActiveTool] = useState<Tool>(null);

  function BackButton() {
    return (
      <button
        onClick={() => setActiveTool(null)}
        style={{ display: "flex", alignItems: "center", gap: 7, background: "none", border: "none", color: "#888", fontSize: 13, cursor: "pointer", fontFamily: "Montserrat,sans-serif", padding: 0, marginBottom: 24 }}
      >
        <Icon name="ArrowLeft" size={15} />
        Назад к ИИ-инструментам
      </button>
    );
  }

  if (activeTool === "image-gen") {
    return <div><BackButton /><LkAiImageGen /></div>;
  }

  if (activeTool === "salon-audit") {
    return <div><BackButton /><LkSalonAudit /></div>;
  }

  if (activeTool === "post-gen") {
    return <div><BackButton /><LkPostGen /></div>;
  }

  if (activeTool === "reel-script") {
    return <div><BackButton /><LkReelScript /></div>;
  }

  return (
    <div>
      {/* Заголовок */}
      <div style={{ marginBottom: 28 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: "linear-gradient(135deg,hsl(40,90%,50%),hsl(30,95%,55%))", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Icon name="Sparkles" size={18} style={{ color: "#fff" }} />
          </div>
          <h1 style={{ fontSize: "clamp(20px,2.5vw,28px)", fontWeight: 700, color: "#1a1a1a", margin: 0 }}>
            ИИ-инструменты
          </h1>
        </div>
        <p style={{ fontSize: 14, color: "#888", margin: 0, lineHeight: 1.6 }}>
          Инструменты на основе искусственного интеллекта — работают с учётом профиля вашего салона
        </p>
      </div>

      {/* Сетка инструментов */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 14, alignItems: "stretch" }}>

        {/* Генерация изображений — готово */}
        <ToolCard
          icon="Image"
          color="hsl(40,90%,45%)"
          bg="hsl(40,90%,96%)"
          title="Генерация изображений"
          description="Создавайте визуалы для постов, сторис и баннеров. ИИ учитывает стиль и аудиторию вашего салона."
          badge="new"
          onStart={() => setActiveTool("image-gen")}
        />

        {/* Скоро */}
        <ToolCard
          icon="FileText"
          color="hsl(210,80%,50%)"
          bg="hsl(210,80%,96%)"
          title="Генератор постов"
          description="Тема → 5 заголовков на выбор → готовый текст + картинка. Пост за 2 минуты."
          badge="new"
          onStart={() => setActiveTool("post-gen")}
        />

        <ComingSoonCard
          icon="MessageSquare"
          color="hsl(145,60%,40%)"
          bg="hsl(145,60%,96%)"
          title="Скрипты общения с клиентом"
          description="Персональные сценарии диалогов для администраторов и мастеров — под конкретную ситуацию."
        />

        <ToolCard
          icon="BarChart2"
          color="hsl(185,85%,32%)"
          bg="hsl(185,85%,95%)"
          title="Цифровой бизнес-разбор"
          description="Заполните анкету — ИИ проанализирует салон и выдаст персональный план роста выручки."
          badge="new"
          onStart={() => setActiveTool("salon-audit")}
        />

        <ToolCard
          icon="Video"
          color="hsl(335,80%,50%)"
          bg="hsl(335,80%,97%)"
          title="Сценарий для рилса"
          description="Идея → покадровый сценарий + обложка. Снимаете сами по готовой инструкции."
          badge="new"
          onStart={() => setActiveTool("reel-script")}
        />

        <ComingSoonCard
          icon="Star"
          color="hsl(185,85%,32%)"
          bg="hsl(185,85%,95%)"
          title="Ответы на отзывы"
          description="ИИ составит вежливый и профессиональный ответ на любой отзыв — положительный или негативный."
        />
      </div>

      {/* Подсказка про контекст салона */}
      <div style={{ marginTop: 24, padding: "14px 18px", background: `hsla(185,85%,32%,0.05)`, borderRadius: 12, border: `1px solid hsla(185,85%,32%,0.12)`, display: "flex", gap: 12, alignItems: "flex-start" }}>
        <Icon name="Info" size={15} style={{ color: ACCENT, marginTop: 1, flexShrink: 0 }} />
        <div style={{ fontSize: 12, color: "#666", lineHeight: 1.7 }}>
          Все ИИ-инструменты работают с учётом профиля вашего салона — названия, аудитории, стиля и задач.
          Чем подробнее заполнен <strong>«Мой салон»</strong> — тем точнее результат.
        </div>
      </div>
    </div>
  );
}