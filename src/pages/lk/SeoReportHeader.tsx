import Icon from "@/components/ui/icon";
import { AnalysisResult, ACCENT, ACCENT_BG, ACCENT_BORDER, cardStyle, labelStyle } from "./SeoTypes";
import { ScoreRing, CopyBtn } from "./SeoShared";

export type Tab = "overview" | "meta" | "content" | "keywords" | "tech" | "code";

export const TABS: { id: Tab; label: string; icon: string }[] = [
  { id: "overview", label: "Обзор",   icon: "LayoutDashboard" },
  { id: "meta",     label: "Мета",    icon: "Code2" },
  { id: "content",  label: "Контент", icon: "FileText" },
  { id: "keywords", label: "Ключи",   icon: "Search" },
  { id: "tech",     label: "Техника", icon: "Settings2" },
  { id: "code",     label: "Код",     icon: "Clipboard" },
];

interface Props {
  result: AnalysisResult;
  tab: Tab;
  setTab: (t: Tab) => void;
  onBack: () => void;
  exportText: string;
}

export default function SeoReportHeader({ result, tab, setTab, onBack, exportText }: Props) {
  const { report, page_data, url } = result;

  return (
    <>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <button onClick={onBack} style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "none", border: "none", color: "#64748B", fontSize: 13, fontWeight: 600, cursor: "pointer", padding: 0, fontFamily: "Montserrat,sans-serif" }}>
          <Icon name="ArrowLeft" size={15} /> Назад
        </button>
        <CopyBtn text={exportText} />
      </div>

      {/* Шапка */}
      <div style={{ ...cardStyle, padding: "24px" }}>
        <div style={{ display: "flex", gap: 20, alignItems: "flex-start", flexWrap: "wrap" }}>
          <ScoreRing score={report.score} />
          <div style={{ flex: 1, minWidth: 200 }}>
            <div style={{ ...labelStyle, marginBottom: 6 }}>SEO-анализ страницы</div>
            <div style={{ fontSize: 14, fontWeight: 700, color: "#0F172A", marginBottom: 8, wordBreak: "break-all" }}>{url}</div>
            <div style={{ fontSize: 13, color: "#475569", lineHeight: 1.7 }}>{report.summary}</div>
          </div>
        </div>
        {report.quick_wins?.length > 0 && (
          <div style={{ marginTop: 20, padding: "14px 16px", background: ACCENT_BG, border: `1px solid ${ACCENT_BORDER}`, borderRadius: 12 }}>
            <div style={{ ...labelStyle, color: ACCENT, marginBottom: 10 }}>⚡ Быстрые улучшения — без разработчика</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {report.quick_wins.map((w, i) => (
                <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                  <div style={{ width: 20, height: 20, borderRadius: "50%", background: ACCENT, color: "#fff", fontSize: 10, fontWeight: 800, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 1 }}>{i + 1}</div>
                  <span style={{ fontSize: 13, color: "#0c4a6e", lineHeight: 1.6 }}>{w}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* SPA-предупреждение */}
      {page_data?.is_spa_shell && (
        <div style={{ display: "flex", gap: 12, padding: "14px 18px", background: "#fff7ed", border: "1.5px solid #fed7aa", borderRadius: 12, alignItems: "flex-start" }}>
          <Icon name="AlertTriangle" size={18} style={{ color: "#ea580c", flexShrink: 0, marginTop: 1 }} />
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, color: "#9a3412", marginBottom: 4 }}>Сайт на JavaScript — контент скрыт от поисковиков</div>
            <div style={{ fontSize: 12, color: "#c2410c", lineHeight: 1.6 }}>
              Страница рендерится через JS (React, Vue, Tilda SPA). Поисковые роботы видят пустой HTML без текста и заголовков страницы. Анализ мета-тегов выполнен, но контент страницы недоступен. Решение: включить SSR, пре-рендеринг или использовать статические HTML-страницы.
            </div>
          </div>
        </div>
      )}

      {/* Табы */}
      <div style={{ display: "flex", gap: 3, background: "#F1F5F9", borderRadius: 12, padding: 4 }}>
        {TABS.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 5, padding: "9px 6px", borderRadius: 8, border: "none", cursor: "pointer", fontFamily: "Montserrat,sans-serif", fontSize: 11, fontWeight: 700, background: tab === t.id ? "#fff" : "transparent", color: tab === t.id ? "#0F172A" : "#64748B", boxShadow: tab === t.id ? "0 1px 4px rgba(0,0,0,0.08)" : "none", transition: "all 0.15s" }}>
            <Icon name={t.icon} size={12} />{t.label}
          </button>
        ))}
      </div>
    </>
  );
}
