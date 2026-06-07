import Icon from "@/components/ui/icon";
import { ACCENT } from "./LkAdminShared";
import { HistoryItem, AnalysisResult } from "./SeoTypes";

interface SeoHistoryProps {
  history: HistoryItem[];
  onOpen: (result: AnalysisResult) => void;
  onRepeat: (url: string) => void;
}

export function SeoHistory({ history, onOpen, onRepeat }: SeoHistoryProps) {
  if (history.length === 0) return null;

  return (
    <div>
      <div style={{ fontSize: 11, fontWeight: 700, color: "#94A3B8", textTransform: "uppercase", letterSpacing: 0.7, marginBottom: 10 }}>История анализов</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {history.map((item, i) => {
          const scoreColor = item.score >= 70 ? "#16a34a" : item.score >= 50 ? "#d97706" : "#dc2626";
          return (
            <div key={i}
              style={{ background: "#fff", borderRadius: 12, border: "1.5px solid #E8ECF0", display: "flex", alignItems: "center", gap: 12, padding: "12px 16px", transition: "all 0.15s", boxShadow: "0 1px 3px rgba(15,23,42,0.04)" }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = "#bae6fd"; e.currentTarget.style.boxShadow = "0 4px 14px rgba(0,0,0,0.06)"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = "#E8ECF0"; e.currentTarget.style.boxShadow = "0 1px 3px rgba(15,23,42,0.04)"; }}
            >
              <div style={{ width: 34, height: 34, borderRadius: 9, background: "#f0f9ff", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <Icon name="Globe" size={15} style={{ color: ACCENT }} />
              </div>
              <div style={{ flex: 1, minWidth: 0, cursor: "pointer" }} onClick={() => onOpen(item.result)}>
                <div style={{ fontSize: 13, fontWeight: 600, color: "#0F172A", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{item.url}</div>
                <div style={{ fontSize: 11, color: "#94A3B8", marginTop: 2 }}>{new Date(item.ts).toLocaleString("ru", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}</div>
              </div>
              <div style={{ fontWeight: 800, fontSize: 18, color: scoreColor, minWidth: 40, textAlign: "right" }}>
                {item.score}<span style={{ fontSize: 9, fontWeight: 400, color: "#94A3B8" }}>/100</span>
              </div>
              <div style={{ fontSize: 14, fontWeight: 900, color: scoreColor, minWidth: 22, textAlign: "center" }}>{item.grade}</div>
              <button
                onClick={() => onOpen(item.result)}
                style={{ display: "flex", alignItems: "center", gap: 4, padding: "5px 9px", background: "#f0f9ff", border: "1px solid #bae6fd", borderRadius: 7, cursor: "pointer", flexShrink: 0, fontFamily: "Montserrat,sans-serif" }}
              >
                <Icon name="Eye" size={11} style={{ color: ACCENT }} />
                <span style={{ fontSize: 11, fontWeight: 600, color: ACCENT }}>Открыть</span>
              </button>
              <button
                onClick={() => onRepeat(item.url)}
                style={{ display: "flex", alignItems: "center", gap: 4, padding: "5px 9px", background: "#F1F5F9", border: "none", borderRadius: 7, cursor: "pointer", flexShrink: 0, fontFamily: "Montserrat,sans-serif" }}
              >
                <Icon name="RefreshCw" size={10} style={{ color: "#64748B" }} />
                <span style={{ fontSize: 11, fontWeight: 600, color: "#64748B" }}>Повторить</span>
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
