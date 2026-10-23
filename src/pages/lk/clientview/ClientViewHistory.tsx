import Icon from "@/components/ui/icon";
import { HistoryItem, subjectTitle, goalTitle } from "./types";

const DARK = "#0F172A";
const GRAY = "#64748B";

interface Props {
  items: HistoryItem[];
  activeId?: number;
  onOpen: (id: number) => void;
}

function fmt(d: string) {
  return new Date(d).toLocaleDateString("ru-RU", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" });
}

export default function ClientViewHistory({ items, activeId, onOpen }: Props) {
  if (!items.length) return null;
  return (
    <div style={{ marginTop: 36 }}>
      <h3 style={{ fontSize: 16, fontWeight: 700, color: DARK, margin: "0 0 12px" }}>Мои проверки</h3>
      <div style={{ display: "grid", gap: 8 }}>
        {items.filter(i => i.has_result).map(i => (
          <button key={i.id} onClick={() => onOpen(i.id)} style={{
            textAlign: "left", cursor: "pointer", fontFamily: "inherit", display: "flex", gap: 12, alignItems: "center",
            background: activeId === i.id ? "hsl(185,85%,96%)" : "#fff", border: "1px solid #E8ECF0", borderRadius: 12, padding: "12px 14px",
          }}>
            <Icon name={i.parent_id ? "GitCompare" : "FileText"} size={18} color={GRAY} />
            <div style={{ minWidth: 0, flex: 1 }}>
              <div style={{ fontSize: 14, color: DARK, fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{i.material}</div>
              <div style={{ fontSize: 12, color: GRAY, marginTop: 2 }}>
                {subjectTitle(i.subject)} · {goalTitle(i.goal)} · {fmt(i.created_at)}{i.parent_id ? " · повторная проверка" : ""}
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
