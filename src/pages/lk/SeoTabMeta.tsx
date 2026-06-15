import Icon from "@/components/ui/icon";
import { AnalysisResult, ACCENT, cardStyle, labelStyle } from "./SeoTypes";
import { StatusChip, SuggestionBox, CopyBtn } from "./SeoShared";

interface Props {
  result: AnalysisResult;
  activeTab: "meta" | "content" | "keywords";
}

export default function SeoTabMeta({ result, activeTab }: Props) {
  const { report, page_data } = result;

  if (activeTab === "meta") {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {[
          { label: "Title — заголовок вкладки", status: report.meta?.title_status, current: page_data.title, chars: `${page_data.title_len} симв. · рек. 50–60`, issue: report.meta?.title_issue, suggestion: report.meta?.title_suggestion },
          { label: "Meta Description", status: report.meta?.description_status, current: page_data.description, chars: `${page_data.desc_len} симв. · рек. 120–160`, issue: report.meta?.description_issue, suggestion: report.meta?.description_suggestion },
          { label: "H1 — главный заголовок", status: report.meta?.h1_status, current: (page_data.headings?.h1 || [])[0] || "", chars: "рек. 30–60", issue: report.meta?.h1_issue, suggestion: report.meta?.h1_suggestion },
          { label: "Canonical URL", status: report.meta?.canonical_status, current: page_data.canonical, chars: "", issue: report.meta?.canonical_issue, suggestion: report.meta?.canonical_suggestion },
          {
            label: "Open Graph",
            status: report.meta?.og_status,
            current: [
              page_data.og_title && `og:title — ${page_data.og_title}`,
              page_data.og_description && `og:description — ${page_data.og_description}`,
              `og:image — ${page_data.og_image ? "есть" : "❌ нет"}`,
              page_data.og_url && `og:url — ${page_data.og_url}`,
            ].filter(Boolean).join("\n"),
            chars: "", issue: report.meta?.og_issue, suggestion: report.meta?.og_suggestion,
          },
          { label: "Twitter Cards", status: report.meta?.twitter_status, current: page_data.twitter_card ? `twitter:card — ${page_data.twitter_card}` : "", chars: "", issue: report.meta?.twitter_issue, suggestion: report.meta?.twitter_suggestion },
          { label: "Keywords", status: undefined, current: page_data.keywords, chars: "", issue: undefined, suggestion: undefined },
          { label: "Robots", status: undefined, current: page_data.robots_meta, chars: "", issue: undefined, suggestion: undefined },
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
                  {item.chars && <span style={{ fontSize: 11, color: "#94A3B8" }}>{item.chars}</span>}
                </div>
                <div style={{ fontSize: 13, color: "#334155", lineHeight: 1.6, whiteSpace: "pre-line" }}>{item.current}</div>
              </div>
            ) : (
              <div style={{ padding: "10px 14px", background: "#fef2f2", border: "1px solid #fca5a5", borderRadius: 10, marginBottom: 10, fontSize: 13, color: "#dc2626", fontWeight: 600 }}>❌ Отсутствует</div>
            )}
            {item.issue && <div style={{ fontSize: 13, color: "#64748B", lineHeight: 1.6 }}>{item.issue}</div>}
            <SuggestionBox text={item.suggestion || ""} />
          </div>
        ))}

        {/* Schema.org */}
        <div style={{ ...cardStyle, padding: "20px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
            <span style={{ fontSize: 14, fontWeight: 700, color: "#0F172A", flex: 1 }}>Schema.org разметка</span>
            {report.meta?.schema_status && <StatusChip status={report.meta.schema_status} />}
          </div>
          {page_data.schema_types?.length ? (
            <div style={{ background: "#F8FAFC", borderRadius: 10, padding: "10px 14px", marginBottom: 10, border: "1px solid #E2E8F0" }}>
              <div style={{ ...labelStyle, marginBottom: 4 }}>Найденные типы</div>
              <div style={{ fontSize: 13, color: "#334155" }}>{page_data.schema_types.join(", ")}</div>
            </div>
          ) : (
            <div style={{ padding: "10px 14px", background: "#fef2f2", border: "1px solid #fca5a5", borderRadius: 10, marginBottom: 10, fontSize: 13, color: "#dc2626", fontWeight: 600 }}>❌ Schema.org не найдена</div>
          )}
          {report.meta?.schema_issue && <div style={{ fontSize: 13, color: "#64748B", lineHeight: 1.6 }}>{report.meta.schema_issue}</div>}
          <SuggestionBox text={report.meta?.schema_jsonld || ""} />
        </div>

        {/* Все заголовки */}
        {Object.keys(page_data.headings || {}).length > 0 && (
          <div style={{ ...cardStyle, padding: "20px" }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: "#0F172A", marginBottom: 14 }}>Все заголовки страницы</div>
            {Object.entries(page_data.headings).map(([level, texts]) => (
              <div key={level} style={{ marginBottom: 12 }}>
                <div style={{ ...labelStyle, marginBottom: 6 }}>{level.toUpperCase()}</div>
                {(texts as string[]).map((t, i) => (
                  <div key={i} style={{ fontSize: 13, color: "#334155", padding: "5px 10px", background: "#F8FAFC", borderRadius: 6, marginBottom: 4 }}>{t}</div>
                ))}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  if (activeTab === "content") {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {page_data.word_count != null && (
          <div style={{ ...cardStyle, padding: "16px 20px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: report.content_analysis?.word_count_comment ? 8 : 0 }}>
              <span style={{ fontSize: 14, fontWeight: 700, color: "#0F172A", flex: 1 }}>Объём контента</span>
              <span style={{ fontSize: 14, fontWeight: 800, color: "#0F172A" }}>{page_data.word_count} слов</span>
              {report.content_analysis?.word_count_status && <StatusChip status={report.content_analysis.word_count_status} />}
            </div>
            {report.content_analysis?.word_count_comment && <div style={{ fontSize: 13, color: "#475569", lineHeight: 1.7 }}>{report.content_analysis.word_count_comment}</div>}
          </div>
        )}
        {[
          { icon: "MousePointerClick", label: "Призыв к действию (CTA)", ok: report.content_analysis?.cta_present, rec: report.content_analysis?.cta_recommendation },
          { icon: "Scissors", label: "Услуги на странице", ok: report.content_analysis?.services_mentioned, rec: report.content_analysis?.services_recommendation },
          { icon: "MapPin", label: "Локальное SEO", ok: report.content_analysis?.local_seo, rec: report.content_analysis?.local_seo_recommendation },
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
    );
  }

  // keywords
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      {report.keyword_suggestions ? (
        <>
          <div style={{ ...cardStyle, padding: "20px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
              <Icon name="Target" size={15} style={{ color: ACCENT }} />
              <span style={{ fontSize: 14, fontWeight: 700, color: "#0F172A" }}>Основные запросы</span>
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {report.keyword_suggestions.primary.map((kw, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 12px", background: "#eff6ff", border: "1px solid #bfdbfe", borderRadius: 20 }}>
                  <span style={{ fontSize: 13, color: "#1e40af", fontWeight: 600 }}>{kw}</span>
                  <CopyBtn text={kw} />
                </div>
              ))}
            </div>
          </div>
          <div style={{ ...cardStyle, padding: "20px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
              <Icon name="Layers" size={15} style={{ color: "#7c3aed" }} />
              <span style={{ fontSize: 14, fontWeight: 700, color: "#0F172A" }}>LSI-запросы (семантические)</span>
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {report.keyword_suggestions.secondary.map((kw, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 12px", background: "#faf5ff", border: "1px solid #e9d5ff", borderRadius: 20 }}>
                  <span style={{ fontSize: 13, color: "#5b21b6", fontWeight: 600 }}>{kw}</span>
                  <CopyBtn text={kw} />
                </div>
              ))}
            </div>
          </div>
          <div style={{ ...cardStyle, padding: "20px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
              <Icon name="Telescope" size={15} style={{ color: "#059669" }} />
              <span style={{ fontSize: 14, fontWeight: 700, color: "#0F172A" }}>Длинный хвост (низкая конкуренция)</span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {report.keyword_suggestions.long_tail.map((kw, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 12px", background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: 10 }}>
                  <Icon name="ArrowRight" size={12} style={{ color: "#059669", flexShrink: 0 }} />
                  <span style={{ fontSize: 13, color: "#065f46", flex: 1 }}>{kw}</span>
                  <CopyBtn text={kw} />
                </div>
              ))}
            </div>
          </div>
          {report.keyword_suggestions.comment && (
            <div style={{ ...cardStyle, padding: "16px 20px" }}>
              <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                <Icon name="Lightbulb" size={15} style={{ color: "#d97706", flexShrink: 0, marginTop: 2 }} />
                <div>
                  <div style={{ ...labelStyle, color: "#92400e", marginBottom: 4 }}>Совет по внедрению</div>
                  <div style={{ fontSize: 13, color: "#475569", lineHeight: 1.7 }}>{report.keyword_suggestions.comment}</div>
                </div>
              </div>
            </div>
          )}
        </>
      ) : (
        <div style={{ ...cardStyle, padding: "48px", textAlign: "center" }}>
          <Icon name="Search" size={32} style={{ color: "#CBD5E1", marginBottom: 8 }} />
          <div style={{ fontSize: 13, color: "#94A3B8" }}>Данные о ключевых словах недоступны</div>
        </div>
      )}
    </div>
  );
}
