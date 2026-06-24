import { useState } from "react";
import Icon from "@/components/ui/icon";
import LkSalonAudit from "./LkSalonAudit";
import LkStaffAudit from "./LkStaffAudit";
import LkReviewReply from "./LkReviewReply";
import LkClientScripts from "./LkClientScripts";
import LkLandingBuilder from "./LkLandingBuilder";
import SalonBot from "./SalonBot";
import { useEnergy } from "@/contexts/EnergyContext";
import { showEnergyGate } from "@/components/EnergyGate";
import { useLkAuth } from "@/contexts/LkAuthContext";


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
    <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #E8ECF0", padding: "20px 20px 18px", display: "flex", flexDirection: "column", boxShadow: "0 1px 3px rgba(15,23,42,0.05)" }}
      onMouseEnter={e => (e.currentTarget.style.boxShadow = "0 4px 20px rgba(0,0,0,0.07)")}
      onMouseLeave={e => (e.currentTarget.style.boxShadow = "0 1px 3px rgba(15,23,42,0.05)")}
    >
      <div style={{ display: "flex", alignItems: "flex-start", gap: 14, flex: 1, marginBottom: 16 }}>
        <div style={{ width: 44, height: 44, borderRadius: 12, background: bg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          <Icon name={icon} size={22} style={{ color }} />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: "#0F172A" }}>{title}</div>
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
    <div style={{ background: "#fff", borderRadius: 16, border: "1px dashed #E2E8F0", padding: "20px 20px 18px", display: "flex", flexDirection: "column", gap: 12, opacity: 0.75 }}>
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

function PaywallToolCard({ icon, color, bg, title, description, badge }: {
  icon: string; color: string; bg: string;
  title: string; description: string; badge?: string;
}) {
  return (
    <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #E8ECF0", padding: "20px 20px 18px", display: "flex", flexDirection: "column", boxShadow: "0 1px 3px rgba(15,23,42,0.05)", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", top: 12, right: 14, background: "hsl(40,90%,96%)", color: "hsl(30,95%,40%)", fontSize: 10, fontWeight: 700, padding: "3px 8px", borderRadius: 20, border: "1px solid hsl(40,90%,80%)", display: "flex", alignItems: "center", gap: 4 }}>
        <Icon name="Lock" size={9} /> Пополни баланс
      </div>
      <div style={{ display: "flex", alignItems: "flex-start", gap: 14, flex: 1, marginBottom: 16 }}>
        <div style={{ width: 44, height: 44, borderRadius: 12, background: bg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, opacity: 0.45 }}>
          <Icon name={icon} size={22} style={{ color }} />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: "#0F172A" }}>{title}</div>
            {badge && (
              <span style={{ fontSize: 9, fontWeight: 700, background: "hsl(40,90%,50%)", color: "#fff", borderRadius: 4, padding: "2px 6px", letterSpacing: 0.5, textTransform: "uppercase" as const, flexShrink: 0 }}>
                {badge}
              </span>
            )}
          </div>
          <div style={{ fontSize: 12, color: "#888", lineHeight: 1.6 }}>{description}</div>
        </div>
      </div>
      <button
        onClick={() => showEnergyGate({ message: "Пополните баланс, чтобы открыть инструменты «Развитие салона»" })}
        style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 7, background: "hsl(40,90%,96%)", color: "hsl(30,95%,40%)", border: "1.5px solid hsl(40,90%,80%)", borderRadius: 10, padding: "11px 20px", fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "Montserrat,sans-serif", width: "100%", marginTop: "auto" }}
      >
        <Icon name="Zap" size={14} />
        Пополнить баланс
      </button>
    </div>
  );
}

type Tool = "image-gen" | "salon-audit" | "post-gen" | "reel-script" | "staff-audit" | "review-reply" | "client-scripts" | "salon-diag" | "landing-builder" | null;

export default function LkAiTools() {
  const [activeTool, setActiveTool] = useState<Tool>(null);
  const { hasPaid, loading: energyLoading } = useEnergy();
  const { user } = useLkAuth();
  const hasSalon = !!user?.salon_id;

  function BackButton() {
    return (
      <button
        onClick={() => { setActiveTool(null); window.scrollTo({ top: 0, behavior: "instant" }); }}
        style={{ display: "flex", alignItems: "center", gap: 7, background: "none", border: "none", color: "#888", fontSize: 13, cursor: "pointer", fontFamily: "Montserrat,sans-serif", padding: 0, marginBottom: 24 }}
      >
        <Icon name="ArrowLeft" size={15} />
        Назад к ИИ-инструментам
      </button>
    );
  }

  if (!hasPaid && activeTool && activeTool !== "salon-diag") {
    setActiveTool(null);
  }

  if (hasPaid && activeTool === "salon-audit") {
    return <div><BackButton /><LkSalonAudit /></div>;
  }

  if (hasPaid && activeTool === "staff-audit") {
    return <div><BackButton /><LkStaffAudit /></div>;
  }

  if (hasPaid && activeTool === "review-reply") {
    return <div><BackButton /><LkReviewReply /></div>;
  }

  if (hasPaid && activeTool === "client-scripts") {
    return <div><BackButton /><LkClientScripts /></div>;
  }

  if ((hasPaid || hasSalon) && activeTool === "salon-diag") {
    return <SalonBot onBack={() => { setActiveTool(null); window.scrollTo({ top: 0, behavior: "instant" }); }} />;
  }

  if (user?.is_admin && activeTool === "landing-builder") {
    return <div><BackButton /><LkLandingBuilder /></div>;
  }

  return (
    <div>
      {/* Заголовок */}
      <div style={{ marginBottom: 28 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: "linear-gradient(135deg,hsl(40,90%,50%),hsl(30,95%,55%))", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Icon name="Sparkles" size={18} style={{ color: "#fff" }} />
          </div>
          <h1 style={{ fontSize: "clamp(20px,2.5vw,28px)", fontWeight: 700, color: "#0F172A", margin: 0 }}>
            Развитие салона
          </h1>
        </div>
        <p style={{ fontSize: 14, color: "#64748B", margin: "0 0 14px", lineHeight: 1.6, maxWidth: 580 }}>
          Инструменты, которые помогают расти без найма дополнительного персонала. Проведите аудит бизнеса, выявите точки потерь, выстройте работу команды и выйдите на стабильный рост выручки — с опорой на данные, а не на интуицию.
        </p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {[
            { icon: "TrendingUp", text: "Рост выручки" },
            { icon: "Users", text: "Управление командой" },
            { icon: "ShieldCheck", text: "Контроль качества" },
            { icon: "Lightbulb", text: "Готовые решения" },
          ].map(tag => (
            <div key={tag.text} style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 12, fontWeight: 600, color: "#475569", background: "#F1F5F9", borderRadius: 20, padding: "5px 12px" }}>
              <Icon name={tag.icon} size={12} style={{ color: ACCENT }} />
              {tag.text}
            </div>
          ))}
        </div>
      </div>

      {/* Сетка инструментов */}
      {energyLoading && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 14 }}>
          {[1,2,3,4,5].map(i => (
            <div key={i} className="animate-pulse" style={{ background: "#f0f0f0", borderRadius: 16, height: 160 }} />
          ))}
        </div>
      )}
      {!energyLoading && !hasPaid && (
        <div style={{ marginBottom: 16, padding: "12px 16px", background: "hsl(40,90%,96%)", border: "1px solid hsl(40,90%,80%)", borderRadius: 12, display: "flex", alignItems: "center", gap: 10 }}>
          <Icon name="Info" size={15} style={{ color: "hsl(30,95%,45%)", flexShrink: 0 }} />
          <div style={{ fontSize: 13, color: "hsl(30,70%,35%)", lineHeight: 1.5 }}>
            Инструменты «Развитие салона» доступны после первого пополнения баланса. Бонусные 100 энергий можно использовать в разделе <strong>«Развитие персонала»</strong>.
          </div>
        </div>
      )}
      {!energyLoading && <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 14, alignItems: "stretch" }}>


        {hasPaid ? (
          <ToolCard
            icon="Users"
            color="hsl(0,75%,50%)"
            bg="hsl(0,75%,97%)"
            title="Анализ персонала"
            description="Финансовый рентген команды: кто приносит деньги, кто теряет и сколько это стоит в рублях."
            badge="new"
            onStart={() => { setActiveTool("staff-audit"); window.scrollTo({ top: 0, behavior: "instant" }); }}
          />
        ) : (
          <PaywallToolCard icon="Users" color="hsl(0,75%,50%)" bg="hsl(0,75%,97%)" title="Анализ персонала" description="Финансовый рентген команды: кто приносит деньги, кто теряет и сколько это стоит в рублях." badge="new" />
        )}

        {hasPaid ? (
          <ToolCard
            icon="MessageSquare"
            color="hsl(145,60%,40%)"
            bg="hsl(145,60%,96%)"
            title="Скрипты общения с клиентом"
            description="Выбери роль сотрудника, опиши ситуацию — ИИ напишет готовый сценарий диалога с клиентом."
            badge="new"
            onStart={() => { setActiveTool("client-scripts"); window.scrollTo({ top: 0, behavior: "instant" }); }}
          />
        ) : (
          <PaywallToolCard icon="MessageSquare" color="hsl(145,60%,40%)" bg="hsl(145,60%,96%)" title="Скрипты общения с клиентом" description="Выбери роль сотрудника, опиши ситуацию — ИИ напишет готовый сценарий диалога с клиентом." badge="new" />
        )}

        {hasPaid ? (
          <ToolCard
            icon="BarChart2"
            color="hsl(185,85%,32%)"
            bg="hsl(185,85%,95%)"
            title="Цифровой бизнес-разбор"
            description="Заполните анкету — ИИ проанализирует салон и выдаст персональный план роста выручки."
            badge="new"
            onStart={() => { setActiveTool("salon-audit"); window.scrollTo({ top: 0, behavior: "instant" }); }}
          />
        ) : (
          <PaywallToolCard icon="BarChart2" color="hsl(185,85%,32%)" bg="hsl(185,85%,95%)" title="Цифровой бизнес-разбор" description="Заполните анкету — ИИ проанализирует салон и выдаст персональный план роста выручки." badge="new" />
        )}

        {hasPaid ? (
          <ToolCard
            icon="Star"
            color="hsl(185,85%,32%)"
            bg="hsl(185,85%,95%)"
            title="Ответы на отзывы"
            description="ИИ составит вежливый и профессиональный ответ на любой отзыв — положительный или негативный."
            badge="new"
            onStart={() => { setActiveTool("review-reply"); window.scrollTo({ top: 0, behavior: "instant" }); }}
          />
        ) : (
          <PaywallToolCard icon="Star" color="hsl(185,85%,32%)" bg="hsl(185,85%,95%)" title="Ответы на отзывы" description="ИИ составит вежливый и профессиональный ответ на любой отзыв — положительный или негативный." badge="new" />
        )}

        {(hasPaid || hasSalon) ? (
          <ToolCard
            icon="Scissors"
            color="hsl(335,80%,50%)"
            bg="hsl(335,80%,97%)"
            title="Диагностика роста салона PRO"
            description="Поймите, где салон теряет деньги — и как увеличить прибыль без увеличения потока клиентов."
            badge="бесплатно"
            onStart={() => { setActiveTool("salon-diag"); window.scrollTo({ top: 0, behavior: "instant" }); }}
          />
        ) : (
          <PaywallToolCard icon="Scissors" color="hsl(335,80%,50%)" bg="hsl(335,80%,97%)" title="Диагностика роста салона PRO" description="Поймите, где салон теряет деньги — и как увеличить прибыль без увеличения потока клиентов." badge="бесплатно" />
        )}

        {user?.is_admin ? (
          <ToolCard
            icon="Globe"
            color="hsl(185,85%,32%)"
            bg="hsl(185,85%,96%)"
            title="Конструктор лендингов"
            description="Расскажите о бизнесе в чате — ИИ создаст готовый лендинг. Скачайте HTML и разместите на любом хостинге."
            badge="бета"
            onStart={() => { setActiveTool("landing-builder"); window.scrollTo({ top: 0, behavior: "instant" }); }}
          />
        ) : (
          <ComingSoonCard icon="Globe" color="hsl(185,85%,32%)" bg="hsl(185,85%,96%)" title="Конструктор лендингов" description="Расскажите о бизнесе в чате — ИИ создаст готовый лендинг. Скачайте HTML и разместите на любом хостинге." />
        )}
      </div>}

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