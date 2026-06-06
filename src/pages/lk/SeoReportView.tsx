import { useState } from "react";
import Icon from "@/components/ui/icon";
import { AnalysisResult, ACCENT, ACCENT_BG, ACCENT_BORDER, cardStyle, labelStyle } from "./SeoTypes";
import { ScoreRing, StatusChip, SuggestionBox } from "./SeoShared";

export default function SeoReportView({ result, onBack }: { result: AnalysisResult; onBack: () => void }) {
  const { report, page_data, url } = result;
  const [tab, setTab] = useState<"overview" | "meta" | "content" | "tech">("overview");

  const tabs = [
    { id: "overview", label: "Обзор",     icon: "LayoutDashboard" },
    { id: "meta",     label: "Мета-теги", icon: "Code2" },
    { id: "content",  label: "Контент",   icon: "FileText" },
    { id: "tech",     label: "Техника",   icon: "Settings2" },
  ] as const;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <button onClick={onBack} style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "none", border: "none", color: "#64748B", fontSize: 13, fontWeight: 600, cursor: "pointer", padding: 0, fontFamily: "Montserrat,sans-serif", width: "fit-content" }}>
        <Icon name="ArrowLeft" size={15} /> Назад
      </button>

      {/* Шапка с оценкой */}
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

      {/* Табы */}
      <div style={{ display: "flex", gap: 4, background: "#F1F5F9", borderRadius: 12, padding: 4 }}>
        {tabs.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 6, padding: "9px 8px", borderRadius: 8, border: "none", cursor: "pointer", fontFamily: "Montserrat,sans-serif", fontSize: 12, fontWeight: 700, background: tab === t.id ? "#fff" : "transparent", color: tab === t.id ? "#0F172A" : "#64748B", boxShadow: tab === t.id ? "0 1px 4px rgba(0,0,0,0.08)" : "none", transition: "all 0.15s" }}>
            <Icon name={t.icon} size={13} />
            {t.label}
          </button>
        ))}
      </div>

      {/* Обзор */}
      {tab === "overview" && (
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
      )}

      {/* Мета-теги */}
      {tab === "meta" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {[
            { label: "Title — заголовок вкладки", status: report.meta?.title_status, current: page_data.title, charLimit: "50–60", issue: report.meta?.title_issue, suggestion: report.meta?.title_suggestion },
            { label: "Meta Description",           status: report.meta?.description_status, current: page_data.description, charLimit: "120–160", issue: report.meta?.description_issue, suggestion: report.meta?.description_suggestion },
            { label: "H1 — главный заголовок",    status: report.meta?.h1_status, current: (page_data.headings?.h1 || [])[0] || "", charLimit: "30–60", issue: report.meta?.h1_issue, suggestion: report.meta?.h1_suggestion },
          ].map((item, i) => (
            <div key={i} style={{ ...cardStyle, padding: "20px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
                <span style={{ fontSize: 14, fontWeight: 700, color: "#0F172A", flex: 1 }}>{item.label}</span>
                {item.status && <StatusChip status={item.status} />}
              </div>
              {item.current ? (
                <div style={{ background: "#F8FAFC", borderRadius: 10, padding: "10px 14px", marginBottom: 10, border: "1px solid #E2E8F0" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                    <span style={labelStyle}>Текущее значение</span>
                    <span style={{ fontSize: 11, color: "#94A3B8" }}>{item.current.length} симв. · рек. {item.charLimit}</span>
                  </div>
                  <div style={{ fontSize: 13, color: "#334155", lineHeight: 1.6 }}>{item.current}</div>
                </div>
              ) : (
                <div style={{ padding: "10px 14px", background: "#fef2f2", border: "1px solid #fca5a5", borderRadius: 10, marginBottom: 10, fontSize: 13, color: "#dc2626", fontWeight: 600 }}>❌ Отсутствует</div>
              )}
              {item.issue && <div style={{ fontSize: 13, color: "#64748B", lineHeight: 1.6 }}>{item.issue}</div>}
              <SuggestionBox text={item.suggestion || ""} />
            </div>
          ))}

          {Object.keys(page_data.headings || {}).length > 0 && (
            <div style={{ ...cardStyle, padding: "20px" }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: "#0F172A", marginBottom: 14 }}>Все заголовки страницы</div>
              {Object.entries(page_data.headings).map(([level, texts]) => (
                <div key={level} style={{ marginBottom: 12 }}>
                  <div style={{ ...labelStyle, marginBottom: 6 }}>{level.toUpperCase()}</div>
                  {(texts as string[]).slice(0, 4).map((t, i) => (
                    <div key={i} style={{ fontSize: 13, color: "#334155", padding: "5px 10px", background: "#F8FAFC", borderRadius: 6, marginBottom: 4 }}>{t}</div>
                  ))}
                </div>
              ))}
              {page_data.keywords && (
                <div>
                  <div style={{ ...labelStyle, marginBottom: 6 }}>Keywords</div>
                  <div style={{ fontSize: 13, color: "#334155", padding: "5px 10px", background: "#F8FAFC", borderRadius: 6 }}>{page_data.keywords}</div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Контент */}
      {tab === "content" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {[
            { icon: "MousePointerClick", label: "Призыв к действию (CTA)", ok: report.content_analysis?.cta_present,        rec: report.content_analysis?.cta_recommendation },
            { icon: "Scissors",           label: "Услуги на странице",       ok: report.content_analysis?.services_mentioned, rec: report.content_analysis?.services_recommendation },
            { icon: "MapPin",             label: "Локальное SEO",            ok: report.content_analysis?.local_seo,          rec: report.content_analysis?.local_seo_recommendation },
          ].map((item, i) => (
            <div key={i} style={{ ...cardStyle, padding: "20px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: item.rec ? 12 : 0 }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: "#F1F5F9", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <Icon name={item.icon} size={16} style={{ color: "#64748B" }} />
                </div>
                <span style={{ fontSize: 14, fontWeight: 700, color: "#0F172A", flex: 1 }}>{item.label}</span>
                {item.ok
                  ? <span style={{ fontSize: 11, fontWeight: 700, color: "#16a34a", background: "#f0fdf4", padding: "4px 10px", borderRadius: 20 }}>✓ Есть</span>
                  : <span style={{ fontSize: 11, fontWeight: 700, color: "#dc2626", background: "#fef2f2", padding: "4px 10px", borderRadius: 20 }}>✗ Нет</span>
                }
              </div>
              {item.rec && <div style={{ fontSize: 13, color: "#475569", lineHeight: 1.7, paddingLeft: 48 }}>{item.rec}</div>}
            </div>
          ))}
        </div>
      )}

      {/* Техника */}
      {tab === "tech" && (
        <div style={{ ...cardStyle, overflow: "hidden" }}>
          <div style={{ padding: "14px 20px", borderBottom: "1px solid #F1F5F9" }}>
            <span style={{ fontSize: 13, fontWeight: 700, color: "#0F172A" }}>Технические параметры страницы</span>
          </div>
          <div style={{ padding: "16px 20px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            {[
              { label: "Внутренних ссылок", value: page_data.internal_links, ok: page_data.internal_links > 2, hint: "рек. 3+" },
              { label: "Внешних ссылок",    value: page_data.external_links, ok: true, hint: "" },
              { label: "Изображений",        value: page_data.images_count, ok: true, hint: "" },
              { label: "Без alt-тега",       value: page_data.images_no_alt, ok: page_data.images_no_alt === 0, hint: "должно быть 0" },
              { label: "Canonical URL",      value: page_data.canonical ? "Настроен" : "Отсутствует", ok: !!page_data.canonical, hint: "" },
            ].map((row, i) => (
              <div key={i} style={{ padding: "12px 14px", background: row.ok ? "#F8FAFC" : "#fef2f2", borderRadius: 10, border: `1px solid ${row.ok ? "#E2E8F0" : "#fca5a5"}` }}>
                <div style={{ fontSize: 11, color: "#94A3B8", marginBottom: 4 }}>{row.label}</div>
                <div style={{ fontSize: 18, fontWeight: 800, color: row.ok ? "#0F172A" : "#dc2626" }}>{row.value}</div>
                {row.hint && <div style={{ fontSize: 10, color: "#94A3B8", marginTop: 2 }}>{row.hint}</div>}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
