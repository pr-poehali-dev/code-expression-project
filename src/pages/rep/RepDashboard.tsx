import { useState } from "react";
import Icon from "@/components/ui/icon";
import { useLkAuth } from "@/contexts/LkAuthContext";
import { ACCENT } from "./rep.constants";
import RepTariffsTab from "./RepTariffsTab";
import RepMailTab from "./RepMailTab";
import RepAITab from "./RepAITab";

type Tab = "ai" | "tariffs" | "mail";

const TABS = [
  { id: "tariffs" as Tab, icon: "LayoutGrid", label: "Тарифы" },
  { id: "mail" as Tab, icon: "Mail", label: "Отправить письмо" },
  { id: "ai" as Tab, icon: "Bot", label: "ИИ-ассистент" },
];

export default function RepDashboard() {
  const { user, logout } = useLkAuth();
  const [tab, setTab] = useState<Tab>("tariffs");

  const senderName = user?.full_name || user?.username || "Представитель";

  return (
    <div style={{ minHeight: "100vh", background: "#f8f8f6", fontFamily: "Montserrat, sans-serif" }}>

      {/* Шапка */}
      <div style={{ background: "#fff", borderBottom: "1px solid #e8e8e4", padding: "12px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 34, height: 34, borderRadius: 10, background: `${ACCENT}15`, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Icon name="Briefcase" size={17} style={{ color: ACCENT }} />
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: 14, color: "#1a1a1a" }}>Кабинет представителя</div>
            <div style={{ fontSize: 11, color: "#aaa" }}>Про Диалог · {senderName}</div>
          </div>
        </div>
        <button onClick={logout} style={{ display: "flex", alignItems: "center", gap: 6, padding: "7px 14px", borderRadius: 8, border: "1.5px solid #e8e8e4", background: "#fff", color: "#888", fontSize: 13, cursor: "pointer", fontFamily: "Montserrat, sans-serif" }}>
          <Icon name="LogOut" size={13} />
          Выйти
        </button>
      </div>

      {/* Табы */}
      <div style={{ background: "#fff", borderBottom: "1px solid #e8e8e4", padding: "0 24px", display: "flex", gap: 4 }}>
        {TABS.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} style={{
            display: "flex", alignItems: "center", gap: 7,
            padding: "13px 18px", border: "none", background: "transparent",
            borderBottom: tab === t.id ? `2px solid ${ACCENT}` : "2px solid transparent",
            color: tab === t.id ? ACCENT : "#888",
            fontSize: 13, fontWeight: 600, cursor: "pointer",
            fontFamily: "Montserrat, sans-serif", marginBottom: -1,
            transition: "all 0.15s",
          }}>
            <Icon name={t.icon} size={15} />
            {t.label}
          </button>
        ))}
      </div>

      {/* Контент */}
      <div style={{ maxWidth: 820, margin: "0 auto", padding: "24px 16px" }}>
        {tab === "tariffs" && <RepTariffsTab />}
        {tab === "mail" && <RepMailTab senderName={senderName} />}
        {tab === "ai" && <RepAITab />}
      </div>

      <style>{`
        @keyframes dot-pulse {
          0%, 100% { opacity: 0.3; transform: scale(0.8); }
          50% { opacity: 1; transform: scale(1.1); }
        }
        @media (max-width: 600px) {
          .rep-mail-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}