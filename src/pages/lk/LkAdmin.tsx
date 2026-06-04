import { useState } from "react";
import Icon from "@/components/ui/icon";
import { ACCENT } from "./LkAdminShared";
import { UsersSection } from "./LkAdminUsers";
import { BodySection } from "./LkAdminBody";
import { AISection } from "./LkAdminAI";
import { CandidatesSection } from "./LkAdminCandidates";
import { EnergySection } from "./LkAdminEnergy";
import { CoursesSection } from "./LkAdminCourses";
import { PaymentsSection } from "./LkAdminPayments";

type Section = "users" | "body" | "ai" | "candidates" | "energy" | "courses" | "payments";

export default function LkAdmin() {
  const [section, setSection] = useState<Section>("ai");

  return (
    <div>
      <h1 style={{ fontFamily: "Cormorant, serif", fontSize: "clamp(22px,3vw,30px)", fontWeight: 700, color: "#1a1a1a", margin: "0 0 20px" }}>
        Администрирование
      </h1>

      <div style={{ display: "flex", gap: 8, marginBottom: 24, flexWrap: "wrap" }}>
        {[
          { id: "ai"         as Section, icon: "Bot",          label: "ИИ-ассистент" },
          { id: "courses"    as Section, icon: "GraduationCap", label: "Курсы"    },
          { id: "users"      as Section, icon: "Users",        label: "Пользователи" },
          { id: "candidates" as Section, icon: "UserCheck",    label: "Кандидаты"    },
          { id: "body"       as Section, icon: "User",         label: "Схема тела"   },
          { id: "energy"     as Section, icon: "Zap",          label: "Энергия"      },
          { id: "payments"   as Section, icon: "CreditCard",   label: "Платежи"      },
        ].map(s => (
          <button key={s.id} onClick={() => setSection(s.id)} style={{
            display: "flex", alignItems: "center", gap: 8, padding: "9px 18px",
            borderRadius: 10, border: "none",
            background: section === s.id ? ACCENT : "#fff",
            color: section === s.id ? "#fff" : "#666",
            fontSize: 14, fontWeight: 600, cursor: "pointer",
            fontFamily: "Montserrat, sans-serif",
            boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
          }}>
            <Icon name={s.icon} size={16} />
            {s.label}
          </button>
        ))}
      </div>

      {section === "ai"         && <AISection />}
      {section === "courses"    && <CoursesSection />}
      {section === "users"      && <UsersSection />}
      {section === "candidates" && <CandidatesSection />}
      {section === "body"       && <BodySection />}
      {section === "energy"     && <EnergySection />}
      {section === "payments"   && <PaymentsSection />}

      <style>{`
        .admin-grid-2 {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
        }
        @media (max-width: 600px) {
          .admin-grid-2 {
            grid-template-columns: 1fr;
          }
        }
        .admin-user-row {
          display: flex;
          align-items: center;
          gap: 14px;
        }
        .admin-user-actions {
          display: flex;
          gap: 8px;
          flex-shrink: 0;
        }
        @media (max-width: 600px) {
          .admin-user-row {
            flex-wrap: wrap;
          }
          .admin-user-actions {
            width: 100%;
            justify-content: flex-end;
          }
        }
        .admin-edit-inline {
          display: flex;
          flex-direction: column;
          gap: 8px;
          min-width: 280px;
        }
        @media (max-width: 600px) {
          .admin-edit-inline {
            min-width: 0;
            width: 100%;
          }
        }
        .admin-pw-row {
          display: flex;
          align-items: center;
          gap: 12px;
          flex-wrap: wrap;
        }
        .admin-pw-input {
          flex: 1;
          min-width: 180px;
        }
      `}</style>
    </div>
  );
}