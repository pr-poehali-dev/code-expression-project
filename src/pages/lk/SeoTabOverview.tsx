import Icon from "@/components/ui/icon";
import { AnalysisResult, cardStyle, labelStyle } from "./SeoTypes";
import { SuggestionBox } from "./SeoShared";

interface Props {
  result: AnalysisResult;
}

export default function SeoTabOverview({ result }: Props) {
  const { report } = result;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      {(report.critical?.length ?? 0) > 0 && (
        <div style={{ ...cardStyle, overflow: "hidden" }}>
          <div style={{ padding: "14px 20px", background: "#fef2f2", borderBottom: "1px solid #fca5a5", display: "flex", alignItems: "center", gap: 8 }}>
            <Icon name="AlertCircle" size={15} style={{ color: "#dc2626" }} />
            <span style={{ fontSize: 13, fontWeight: 700, color: "#dc2626" }}>Критические проблемы · {report.critical.length}</span>
          </div>
          <div style={{ padding: "20px", display: "flex", flexDirection: "column", gap: 20 }}>
            {report.critical.map((c, i) => (
              <div key={i} style={{ paddingBottom: i < report.critical.length - 1 ? 20 : 0, borderBottom: i < report.critical.length - 1 ? "1px solid #F1F5F9" : "none" }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: "#0F172A", marginBottom: 6 }}>{c.issue}</div>
                <div style={{ fontSize: 13, color: "#475569", lineHeight: 1.7, marginBottom: 4 }}>{c.recommendation}</div>
                <SuggestionBox text={c.example} />
              </div>
            ))}
          </div>
        </div>
      )}
      {(report.improvements?.length ?? 0) > 0 && (
        <div style={{ ...cardStyle, overflow: "hidden" }}>
          <div style={{ padding: "14px 20px", background: "#fffbeb", borderBottom: "1px solid #fde68a", display: "flex", alignItems: "center", gap: 8 }}>
            <Icon name="TrendingUp" size={15} style={{ color: "#d97706" }} />
            <span style={{ fontSize: 13, fontWeight: 700, color: "#d97706" }}>Что улучшить · {report.improvements.length}</span>
          </div>
          <div style={{ padding: "20px", display: "flex", flexDirection: "column", gap: 20 }}>
            {report.improvements.map((imp, i) => (
              <div key={i} style={{ paddingBottom: i < report.improvements.length - 1 ? 20 : 0, borderBottom: i < report.improvements.length - 1 ? "1px solid #F1F5F9" : "none" }}>
                <div style={{ ...labelStyle, marginBottom: 8 }}>{imp.area}</div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 4 }}>
                  <div style={{ padding: "10px 12px", background: "#fef2f2", borderRadius: 8 }}>
                    <div style={{ ...labelStyle, color: "#dc2626", marginBottom: 4 }}>Сейчас</div>
                    <div style={{ fontSize: 12, color: "#475569", lineHeight: 1.5 }}>{imp.current}</div>
                  </div>
                  <div style={{ padding: "10px 12px", background: "#f0fdf4", borderRadius: 8 }}>
                    <div style={{ ...labelStyle, color: "#16a34a", marginBottom: 4 }}>Как лучше</div>
                    <div style={{ fontSize: 12, color: "#475569", lineHeight: 1.5 }}>{imp.better}</div>
                  </div>
                </div>
                <SuggestionBox text={imp.example} />
              </div>
            ))}
          </div>
        </div>
      )}
      {!report.critical?.length && !report.improvements?.length && (
        <div style={{ ...cardStyle, padding: "48px", textAlign: "center" }}>
          <Icon name="CheckCircle2" size={40} style={{ color: "#16a34a", marginBottom: 12 }} />
          <div style={{ fontSize: 15, fontWeight: 700, color: "#0F172A" }}>Страница в хорошем состоянии</div>
          <div style={{ fontSize: 13, color: "#64748B", marginTop: 6 }}>Критических проблем не обнаружено</div>
        </div>
      )}
    </div>
  );
}
