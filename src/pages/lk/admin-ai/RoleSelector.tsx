import Icon from "@/components/ui/icon";
import { RoleId, ROLES } from "./shared";

export default function RoleSelector({ active, onChange }: { active: RoleId; onChange: (id: RoleId) => void }) {
  const role = ROLES.find(r => r.id === active)!;
  return (
    <div style={{ marginBottom: 14 }}>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 7 }}>
        {ROLES.map(r => {
          const isActive = r.id === active;
          return (
            <button
              key={r.id}
              onClick={() => onChange(r.id)}
              title={r.hint}
              style={{
                display: "flex", alignItems: "center", gap: 6,
                padding: "7px 13px", borderRadius: 10,
                border: `1.5px solid ${isActive ? r.color : "#E8ECF0"}`,
                background: isActive ? r.bg : "#fff",
                color: isActive ? r.color : "#64748B",
                fontSize: 12, fontWeight: isActive ? 700 : 500,
                cursor: "pointer", fontFamily: "Montserrat, sans-serif",
                transition: "all 0.18s",
              }}
            >
              <Icon name={r.icon} size={13} style={{ color: isActive ? r.color : "#94A3B8" }} />
              {r.label}
            </button>
          );
        })}
      </div>
      <div style={{ marginTop: 8, fontSize: 11, color: "#94A3B8", display: "flex", alignItems: "center", gap: 5 }}>
        <div style={{ width: 7, height: 7, borderRadius: "50%", background: role.color, flexShrink: 0 }} />
        {role.label} — {role.hint}
      </div>
    </div>
  );
}
