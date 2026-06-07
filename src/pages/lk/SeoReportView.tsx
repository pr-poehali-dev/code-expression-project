import { useState } from "react";
import Icon from "@/components/ui/icon";
import { AnalysisResult, ACCENT, ACCENT_BG, ACCENT_BORDER, cardStyle, labelStyle } from "./SeoTypes";
import { ScoreRing, StatusChip, SuggestionBox, CopyBtn } from "./SeoShared";

type Tab = "overview" | "meta" | "content" | "keywords" | "tech";

const TABS: { id: Tab; label: string; icon: string }[] = [
  { id: "overview",  label: "Обзор",    icon: "LayoutDashboard" },
  { id: "meta",      label: "Мета",     icon: "Code2" },
  { id: "content",   label: "Контент",  icon: "FileText" },
  { id: "keywords",  label: "Ключи",    icon: "Search" },
  { id: "tech",      label: "Техника",  icon: "Settings2" },
];

function exportText(result: AnalysisResult): string {
  const { report, page_data, url } = result;
  const lines = [`SEO-АУДИТ: ${url}`, `Оценка: ${report.score}/100`, ``, `РЕЗЮМЕ`, report.summary, ``];
  if (report.critical?.length) {
    lines.push("КРИТИЧЕСКИЕ ПРОБЛЕМЫ");
    report.critical.forEach((c, i) => {
      lines.push(`${i + 1}. ${c.issue}`);
      lines.push(`   ${c.recommendation}`);
      if (c.example) lines.push(`   Код: ${c.example}`);
    });
    lines.push("");
  }
  if (report.improvements?.length) {
    lines.push("ЧТО УЛУЧШИТЬ");
    report.improvements.forEach((imp, i) => {
      lines.push(`${i + 1}. ${imp.area}: ${imp.better}`);
      if (imp.example) lines.push(`   ${imp.example}`);
    });
    lines.push("");
  }
  const m = report.meta;
  if (m) {
    lines.push("МЕТА-ДАННЫЕ");
    lines.push(`Title (${page_data.title_len} с): ${page_data.title || "нет"}`);
    if (m.title_suggestion) lines.push(`  → ${m.title_suggestion}`);
    lines.push(`Description (${page_data.desc_len} с): ${page_data.description || "нет"}`);
    if (m.description_suggestion) lines.push(`  → ${m.description_suggestion}`);
    lines.push(`H1: ${(page_data.headings?.h1 || [])[0] || "нет"}`);
    if (m.h1_suggestion) lines.push(`  → ${m.h1_suggestion}`);
    if (m.schema_jsonld) { lines.push("Schema.org:"); lines.push(m.schema_jsonld); }
    lines.push("");
  }
  if (report.keyword_suggestions) {
    const ks = report.keyword_suggestions;
    lines.push("КЛЮЧЕВЫЕ СЛОВА");
    lines.push(`Основные: ${ks.primary.join(", ")}`);
    lines.push(`LSI: ${ks.secondary.join(", ")}`);
    lines.push(`Длинный хвост: ${ks.long_tail.join(", ")}`);
    if (ks.comment) lines.push(`Совет: ${ks.comment}`);
    lines.push("");
  }
  if (report.quick_wins?.length) {
    lines.push("БЫСТРЫЕ УЛУЧШЕНИЯ");
    report.quick_wins.forEach((w, i) => lines.push(`${i + 1}. ${w}`));
  }
  return lines.join("\n");
}

export default function SeoReportView({ result, onBack }: { result: AnalysisResult; onBack: () => void }) {
  const { report, page_data, url } = result;
  const [tab, setTab] = useState<Tab>("overview");

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <button onClick={onBack} style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "none", border: "none", color: "#64748B", fontSize: 13, fontWeight: 600, cursor: "pointer", padding: 0, fontFamily: "Montserrat,sans-serif" }}>
          <Icon name="ArrowLeft" size={15} /> Назад
        </button>
        <CopyBtn text={exportText(result)} />
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

      {/* Табы */}
      <div style={{ display: "flex", gap: 3, background: "#F1F5F9", borderRadius: 12, padding: 4 }}>
        {TABS.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 5, padding: "9px 6px", borderRadius: 8, border: "none", cursor: "pointer", fontFamily: "Montserrat,sans-serif", fontSize: 11, fontWeight: 700, background: tab === t.id ? "#fff" : "transparent", color: tab === t.id ? "#0F172A" : "#64748B", boxShadow: tab === t.id ? "0 1px 4px rgba(0,0,0,0.08)" : "none", transition: "all 0.15s" }}>
            <Icon name={t.icon} size={12} />{t.label}
          </button>
        ))}
      </div>

      {/* ── Обзор ── */}
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

      {/* ── Мета-теги ── */}
      {tab === "meta" && (
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
      )}

      {/* ── Контент ── */}
      {tab === "content" && (
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
      )}

      {/* ── Ключевые слова ── */}
      {tab === "keywords" && (
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
                    <div key={i} style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 12px", background: ACCENT_BG, border: `1px solid ${ACCENT_BORDER}`, borderRadius: 20 }}>
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
      )}

      {/* ── Техника ── */}
      {tab === "tech" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {/* Скорость */}
          {(page_data.load_time_ms != null || page_data.page_size_kb != null) && (
            <div style={{ ...cardStyle, overflow: "hidden" }}>
              <div style={{ padding: "14px 20px", borderBottom: "1px solid #F1F5F9" }}>
                <span style={{ fontSize: 13, fontWeight: 700, color: "#0F172A" }}>Производительность</span>
              </div>
              <div style={{ padding: "14px 20px", display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
                {page_data.http_status != null && (
                  <div style={{ padding: "12px 14px", background: page_data.http_status === 200 ? "#f0fdf4" : "#fef2f2", borderRadius: 10, border: `1px solid ${page_data.http_status === 200 ? "#bbf7d0" : "#fca5a5"}` }}>
                    <div style={{ fontSize: 11, color: "#94A3B8", marginBottom: 4 }}>HTTP статус</div>
                    <div style={{ fontSize: 20, fontWeight: 800, color: page_data.http_status === 200 ? "#16a34a" : "#dc2626" }}>{page_data.http_status}</div>
                  </div>
                )}
                {page_data.load_time_ms != null && (
                  <div style={{ padding: "12px 14px", background: page_data.load_time_ms < 1500 ? "#f0fdf4" : page_data.load_time_ms < 3000 ? "#fffbeb" : "#fef2f2", borderRadius: 10, border: `1px solid ${page_data.load_time_ms < 1500 ? "#bbf7d0" : page_data.load_time_ms < 3000 ? "#fde68a" : "#fca5a5"}` }}>
                    <div style={{ fontSize: 11, color: "#94A3B8", marginBottom: 4 }}>Время загрузки</div>
                    <div style={{ fontSize: 20, fontWeight: 800, color: page_data.load_time_ms < 1500 ? "#16a34a" : page_data.load_time_ms < 3000 ? "#d97706" : "#dc2626" }}>{page_data.load_time_ms} мс</div>
                  </div>
                )}
                {page_data.page_size_kb != null && (
                  <div style={{ padding: "12px 14px", background: page_data.page_size_kb < 500 ? "#f0fdf4" : "#fffbeb", borderRadius: 10, border: `1px solid ${page_data.page_size_kb < 500 ? "#bbf7d0" : "#fde68a"}` }}>
                    <div style={{ fontSize: 11, color: "#94A3B8", marginBottom: 4 }}>Размер страницы</div>
                    <div style={{ fontSize: 20, fontWeight: 800, color: page_data.page_size_kb < 500 ? "#16a34a" : "#d97706" }}>{page_data.page_size_kb} КБ</div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Все метрики */}
          <div style={{ ...cardStyle, overflow: "hidden" }}>
            <div style={{ padding: "14px 20px", borderBottom: "1px solid #F1F5F9" }}>
              <span style={{ fontSize: 13, fontWeight: 700, color: "#0F172A" }}>Технические параметры</span>
            </div>
            <div style={{ padding: "16px 20px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              {[
                { label: "Viewport (mobile)", value: page_data.has_viewport ? "Настроен" : "Отсутствует", ok: page_data.has_viewport },
                { label: "Favicon", value: page_data.has_favicon ? "Есть" : "Отсутствует", ok: page_data.has_favicon },
                { label: "robots.txt", value: page_data.robots_exists ? "Есть" : "Не найден", ok: !!page_data.robots_exists },
                { label: "Sitemap", value: page_data.sitemap_url ? "Есть" : "Не найден", ok: !!page_data.sitemap_url },
                { label: "Canonical URL", value: page_data.canonical ? "Настроен" : "Отсутствует", ok: !!page_data.canonical },
                { label: "Schema.org", value: page_data.schema_types?.length ? page_data.schema_types.join(", ") : "Нет", ok: !!(page_data.schema_types?.length) },
                { label: "OG Image", value: page_data.og_image ? "Есть" : "Отсутствует", ok: !!page_data.og_image },
                { label: "Twitter Card", value: page_data.twitter_card || "Нет", ok: !!page_data.twitter_card },
                { label: "Внутренних ссылок", value: page_data.internal_links, ok: page_data.internal_links > 2, hint: "рек. 3+" },
                { label: "Внешних ссылок", value: page_data.external_links, ok: true },
                { label: "Nofollow ссылок", value: page_data.nofollow_links ?? 0, ok: true },
                { label: "Изображений", value: page_data.images_count, ok: true },
                { label: "Без alt-тега", value: page_data.images_no_alt, ok: page_data.images_no_alt === 0, hint: "должно быть 0" },
                { label: "С lazy-load", value: page_data.images_lazy ?? 0, ok: true },
              ].map((row, i) => (
                <div key={i} style={{ padding: "12px 14px", background: row.ok ? "#F8FAFC" : "#fef2f2", borderRadius: 10, border: `1px solid ${row.ok ? "#E2E8F0" : "#fca5a5"}` }}>
                  <div style={{ fontSize: 11, color: "#94A3B8", marginBottom: 4 }}>{row.label}</div>
                  <div style={{ fontSize: 16, fontWeight: 800, color: row.ok ? "#0F172A" : "#dc2626", wordBreak: "break-all" }}>{String(row.value)}</div>
                  {(row as { hint?: string }).hint && <div style={{ fontSize: 10, color: "#94A3B8", marginTop: 2 }}>{(row as { hint?: string }).hint}</div>}
                </div>
              ))}
            </div>
            {page_data.sitemap_url && (
              <div style={{ padding: "0 20px 16px" }}>
                <div style={{ fontSize: 11, color: "#94A3B8", marginBottom: 4 }}>URL Sitemap</div>
                <a href={page_data.sitemap_url} target="_blank" rel="noopener noreferrer" style={{ fontSize: 12, color: ACCENT, wordBreak: "break-all" }}>{page_data.sitemap_url}</a>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
