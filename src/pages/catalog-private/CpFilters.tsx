import Icon from "@/components/ui/icon";
import { ACCENT, ACCENT_SHADOW, LevelFilter, DirectionFilter, TabType } from "./CpShared";

export function TabSwitcher({
  tab, setTab,
}: {
  tab: TabType;
  setTab: (t: TabType) => void;
}) {
  return (
    <div style={{ display: "flex", gap: 4, marginBottom: 36, background: "#fff", borderRadius: 14, padding: 5, border: "1px solid #e8e8e4", width: "fit-content" }}>
      {([
        { value: "online", label: "Онлайн курсы", icon: "Monitor" },
        { value: "offline", label: "Офлайн курсы", icon: "MapPin" },
        { value: "point", label: "Точечные продукты", icon: "Zap" },
      ] as { value: TabType; label: string; icon: string }[]).map((t) => (
        <button
          key={t.value}
          onClick={() => setTab(t.value)}
          style={{
            display: "flex", alignItems: "center", gap: 8,
            padding: "10px 24px", borderRadius: 10, border: "none",
            background: tab === t.value ? ACCENT : "transparent",
            color: tab === t.value ? "#fff" : "#666",
            fontSize: 14, fontWeight: 600,
            cursor: "pointer", fontFamily: "Montserrat, sans-serif",
            transition: "all 0.2s",
            boxShadow: tab === t.value ? `0 4px 14px ${ACCENT_SHADOW}` : "none",
          }}
        >
          <Icon name={t.icon} size={16} />
          {t.label}
        </button>
      ))}
    </div>
  );
}

export function FilterGroup({
  label, options, active, onChange,
}: {
  label: string;
  options: { value: string; label: string }[];
  active: string;
  onChange: (v: string) => void;
}) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
      <span style={{ fontSize: 13, color: "#999", fontWeight: 500 }}>{label}</span>
      {options.map((o) => (
        <button
          key={o.value}
          onClick={() => onChange(o.value)}
          style={{
            padding: "6px 14px", borderRadius: 8,
            border: `1.5px solid ${active === o.value ? ACCENT : "#e0e0dc"}`,
            background: active === o.value ? `${ACCENT}18` : "#fff",
            color: active === o.value ? ACCENT : "#555",
            fontSize: 13, fontWeight: active === o.value ? 600 : 400,
            cursor: "pointer", transition: "all 0.18s",
            fontFamily: "Montserrat, sans-serif",
          }}
          onMouseEnter={e => { if (active !== o.value) (e.currentTarget as HTMLButtonElement).style.borderColor = ACCENT; }}
          onMouseLeave={e => { if (active !== o.value) (e.currentTarget as HTMLButtonElement).style.borderColor = "#e0e0dc"; }}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

export function CatalogFilters({
  levelFilter, setLevelFilter,
  directionFilter, setDirectionFilter,
}: {
  levelFilter: LevelFilter;
  setLevelFilter: (v: LevelFilter) => void;
  directionFilter: DirectionFilter;
  setDirectionFilter: (v: DirectionFilter) => void;
}) {
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginBottom: 44 }}>
      <FilterGroup
        label="Уровень:"
        options={[
          { value: "all", label: "Все" },
          { value: "beginner", label: "Новичок" },
          { value: "practitioner", label: "Практикующий" },
        ]}
        active={levelFilter}
        onChange={(v) => setLevelFilter(v as LevelFilter)}
      />
      <div style={{ width: 1, background: "#e8e8e4", alignSelf: "stretch" }} />
      <FilterGroup
        label="Направление:"
        options={[
          { value: "all", label: "Все" },
          { value: "technique", label: "Техника" },
          { value: "income", label: "Доход / клиенты" },
        ]}
        active={directionFilter}
        onChange={(v) => setDirectionFilter(v as DirectionFilter)}
      />
    </div>
  );
}