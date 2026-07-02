import { useState } from "react";
import Icon from "@/components/ui/icon";
import { ACCENT } from "./LkAdminShared";
import { activeWorksRef } from "./LkAdminChampionshipShared";
import { TournamentsSection } from "./LkAdminChampionshipTournaments";
import { ModerationSection, FinalizeSection } from "./LkAdminChampionshipWorks";
import { ApplicationsSection, ChampSettingsSection } from "./LkAdminChampionshipMeta";

type ChampSection = "tournaments" | "applications" | "moderation" | "finalize" | "settings";

export function ChampionshipSection() {
  const [section, setSection] = useState<ChampSection>("tournaments");

  // Сбрасываем обработчик при монтировании (не используется в текущей реализации)
  activeWorksRef.setTournament = () => {};

  const tabs: { id: ChampSection; icon: string; label: string }[] = [
    { id: "tournaments",  icon: "Trophy",       label: "Турниры"    },
    { id: "applications", icon: "ClipboardList", label: "Заявки"     },
    { id: "moderation",   icon: "Shield",        label: "Модерация"  },
    { id: "finalize",     icon: "Award",         label: "Итоги"      },
    { id: "settings",     icon: "Settings",      label: "Настройки"  },
  ];

  return (
    <div>
      <div style={{ display: "flex", gap: 6, marginBottom: 20, flexWrap: "wrap" }}>
        {tabs.map(t => (
          <button key={t.id} onClick={() => setSection(t.id)} style={{
            display: "flex", alignItems: "center", gap: 6, padding: "7px 14px",
            borderRadius: 9, border: "none",
            background: section === t.id ? ACCENT : "#f1f5f9",
            color: section === t.id ? "#fff" : "#555",
            fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "Montserrat, sans-serif",
          }}>
            <Icon name={t.icon} size={14} />
            {t.label}
          </button>
        ))}
      </div>
      {section === "tournaments"  && <TournamentsSection />}
      {section === "applications" && <ApplicationsSection />}
      {section === "moderation"   && <ModerationSection />}
      {section === "finalize"     && <FinalizeSection />}
      {section === "settings"     && <ChampSettingsSection />}
    </div>
  );
}