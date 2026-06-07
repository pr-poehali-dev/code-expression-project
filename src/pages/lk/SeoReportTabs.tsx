import { useState } from "react";
import Icon from "@/components/ui/icon";
import { ACCENT } from "./LkAdminShared";
import { AnalysisResult, StatusChip, SuggestionBox, ScoreRing, Card, CardHeader, CopyBtn } from "./SeoAdminTypes";

type Tab = "overview" | "meta" | "content" | "keywords" | "tech" | "data";

const TABS: { id: Tab; label: string; icon: string }[] = [
  { id: "overview",  label: "Обзор",    icon: "LayoutDashboard" },
  { id: "meta",      label: "Мета",     icon: "Code2" },
  { id: "content",   label: "Контент",  icon: "FileText" },
  { id: "keywords",  label: "Ключи",    icon: "Search" },
  { id: "tech",      label: "Техника",  icon: "Settings2" },
  { id: "data",      label: "Данные",   icon: "Database" },
];

function exportReport(result: AnalysisResult): string {
  const { report, page_data, url } = result;
  const lines: string[] = [
    `SEO-АУДИТ: ${url}`,
    `Оценка: ${report.score}/100 (${report.grade})`,
    ``,
    `РЕЗЮМЕ`,
    report.summary,
    ``,
  ];
  if (report.critical?.length) {
    lines.push("КРИТИЧЕСКИЕ ПРОБЛЕМЫ");
    report.critical.forEach((c, i) => {
      lines.push(`${i + 1}. ${c.issue}`);
      lines.push(`   Влияние: ${c.impact}`);
      lines.push(`   Решение: ${c.fix}`);
      if (c.example) lines.push(`   Код: ${c.example}`);
    });
    lines.push("");
  }
  if (report.improvements?.length) {
    lines.push("ЧТО УЛУЧШИТЬ");
    report.improvements.forEach((imp, i) => {
      lines.push(`${i + 1}. [${imp.priority.toUpperCase()}] ${imp.area}`);
      lines.push(`   Сейчас: ${imp.current}`);
      lines.push(`   Лучше: ${imp.better}`);
      if (imp.example) lines.push(`   Пример: ${imp.example}`);
    });
    lines.push("");
  }
  const ma = report.meta_audit;
  if (ma) {
    lines.push("МЕТА-АУДИТ");
    lines.push(`Title (${page_data.title_len} симв.): ${page_data.title || "отсутствует"}`);
    if (ma.title?.suggestion) lines.push(`  → ${ma.title.suggestion}`);
    lines.push(`Description (${page_data.desc_len} симв.): ${page_data.description || "отсутствует"}`);
    if (ma.description?.suggestion) lines.push(`  → ${ma.description.suggestion}`);
    lines.push(`H1: ${(page_data.headings?.h1 || [])[0] || "отсутствует"}`);
    if (ma.h1?.suggestion) lines.push(`  → ${ma.h1.suggestion}`);
    lines.push(`Canonical: ${page_data.canonical || "отсутствует"}`);
    if (ma.canonical?.suggestion) lines.push(`  → ${ma.canonical.suggestion}`);
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
    lines.push("");
  }
  return lines.join("\n");
}

export function ReportView({ result, onBack }: { result: AnalysisResult; onBack: () => void }) {
  const [tab, setTab] = useState<Tab>("overview");
  const { report, page_data, url } = result;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10 }}>
        <button onClick={onBack} style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "none", border: "none", color: "#64748B", fontSize: 13, fontWeight: 600, cursor: "pointer", padding: 0, fontFamily: "Montserrat,sans-serif" }}>
          <Icon name="ArrowLeft" size={15} /> Новый анализ
        </button>
        <CopyBtn text={exportReport(result)} />
      </div>

      {/* Шапка */}
      <Card>
        <div style={{ padding: "20px 22px" }}>
          <div style={{ display: "flex", gap: 18, alignItems: "flex-start", flexWrap: "wrap" }}>
            <ScoreRing score={report.score} grade={report.grade} />
            <div style={{ flex: 1, minWidth: 200 }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: "#94A3B8", textTransform: "uppercase", letterSpacing: 0.7, marginBottom: 5 }}>Глубокий SEO-аудит · GPT-4o</div>
              <div style={{ fontSize: 13, fontWeight: 700, color: "#0F172A", marginBottom: 8, wordBreak: "break-all" }}>{url}</div>
              <div style={{ fontSize: 13, color: "#475569", lineHeight: 1.7 }}>{report.summary}</div>
            </div>
          </div>

          {report.quick_wins?.length > 0 && (
            <div style={{ marginTop: 18, padding: "14px 16px", background: "#f0f9ff", border: "1px solid #bae6fd", borderRadius: 12 }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: ACCENT, textTransform: "uppercase", letterSpacing: 0.7, marginBottom: 10 }}>⚡ Быстрые улучшения — без разработчика</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
                {report.quick_wins.map((w, i) => (
                  <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                    <div style={{ width: 20, height: 20, borderRadius: "50%", background: ACCENT, color: "#fff", fontSize: 10, fontWeight: 800, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 1 }}>{i + 1}</div>
                    <span style={{ fontSize: 13, color: "#0c4a6e", lineHeight: 1.6 }}>{w}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {report.growth_opportunities?.length > 0 && (
            <div style={{ marginTop: 10, padding: "12px 16px", background: "#faf5ff", border: "1px solid #e9d5ff", borderRadius: 12 }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: "#7c3aed", textTransform: "uppercase", letterSpacing: 0.7, marginBottom: 8 }}>🚀 Долгосрочные точки роста</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
                {report.growth_opportunities.map((op, i) => (
                  <div key={i} style={{ display: "flex", gap: 8, alignItems: "flex-start", fontSize: 13, color: "#5b21b6", lineHeight: 1.6 }}>
                    <span style={{ flexShrink: 0 }}>→</span>{op}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* Табы */}
      <div style={{ display: "flex", gap: 3, background: "#F1F5F9", borderRadius: 12, padding: 4, flexWrap: "wrap" }}>
        {TABS.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} style={{ flex: 1, minWidth: 52, display: "flex", alignItems: "center", justifyContent: "center", gap: 4, padding: "8px 4px", borderRadius: 8, border: "none", cursor: "pointer", fontFamily: "Montserrat,sans-serif", fontSize: 11, fontWeight: 700, background: tab === t.id ? "#fff" : "transparent", color: tab === t.id ? "#0F172A" : "#64748B", boxShadow: tab === t.id ? "0 1px 4px rgba(0,0,0,0.08)" : "none", transition: "all 0.15s" }}>
            <Icon name={t.icon} size={12} />{t.label}
          </button>
        ))}
      </div>

      {/* ── Обзор ── */}
      {tab === "overview" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {(report.critical?.length ?? 0) > 0 && (
            <Card>
              <CardHeader color="#dc2626" icon="AlertCircle" title="Критические проблемы" count={report.critical.length} />
              <div style={{ padding: "18px 20px", display: "flex", flexDirection: "column", gap: 18 }}>
                {report.critical.map((c, i) => (
                  <div key={i} style={{ paddingBottom: i < report.critical.length - 1 ? 18 : 0, borderBottom: i < report.critical.length - 1 ? "1px solid #F1F5F9" : "none" }}>
                    <div style={{ fontSize: 14, fontWeight: 700, color: "#0F172A", marginBottom: 4 }}>{c.issue}</div>
                    <div style={{ fontSize: 12, color: "#dc2626", fontWeight: 600, marginBottom: 4 }}>Влияние: {c.impact}</div>
                    <div style={{ fontSize: 13, color: "#475569", lineHeight: 1.7, marginBottom: 4 }}>{c.fix}</div>
                    <SuggestionBox text={c.example} />
                  </div>
                ))}
              </div>
            </Card>
          )}

          {(report.improvements?.length ?? 0) > 0 && (
            <Card>
              <CardHeader color="#d97706" icon="TrendingUp" title="Что улучшить" count={report.improvements.length} />
              <div style={{ padding: "18px 20px", display: "flex", flexDirection: "column", gap: 18 }}>
                {report.improvements.map((imp, i) => (
                  <div key={i} style={{ paddingBottom: i < report.improvements.length - 1 ? 18 : 0, borderBottom: i < report.improvements.length - 1 ? "1px solid #F1F5F9" : "none" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                      <span style={{ fontSize: 10, fontWeight: 700, color: "#94A3B8", textTransform: "uppercase", letterSpacing: 0.5 }}>{imp.area}</span>
                      <span style={{ fontSize: 10, padding: "2px 7px", borderRadius: 12, fontWeight: 700, background: imp.priority === "high" ? "#fef2f2" : imp.priority === "medium" ? "#fffbeb" : "#f0fdf4", color: imp.priority === "high" ? "#dc2626" : imp.priority === "medium" ? "#d97706" : "#16a34a" }}>{imp.priority === "high" ? "Высокий" : imp.priority === "medium" ? "Средний" : "Низкий"} приоритет</span>
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 4 }}>
                      <div style={{ padding: "9px 12px", background: "#fef2f2", borderRadius: 8 }}>
                        <div style={{ fontSize: 10, fontWeight: 700, color: "#dc2626", marginBottom: 3, textTransform: "uppercase" }}>Сейчас</div>
                        <div style={{ fontSize: 12, color: "#475569" }}>{imp.current}</div>
                      </div>
                      <div style={{ padding: "9px 12px", background: "#f0fdf4", borderRadius: 8 }}>
                        <div style={{ fontSize: 10, fontWeight: 700, color: "#16a34a", marginBottom: 3, textTransform: "uppercase" }}>Как лучше</div>
                        <div style={{ fontSize: 12, color: "#475569" }}>{imp.better}</div>
                      </div>
                    </div>
                    <SuggestionBox text={imp.example} />
                  </div>
                ))}
              </div>
            </Card>
          )}

          {!report.critical?.length && !report.improvements?.length && (
            <Card style={{ padding: 48, textAlign: "center" }}>
              <Icon name="CheckCircle2" size={40} style={{ color: "#16a34a", marginBottom: 12 }} />
              <div style={{ fontSize: 15, fontWeight: 700, color: "#0F172A" }}>Страница в отличном состоянии</div>
              <div style={{ fontSize: 13, color: "#64748B", marginTop: 6 }}>Критических SEO-проблем не обнаружено</div>
            </Card>
          )}
        </div>
      )}

      {/* ── Мета-теги ── */}
      {tab === "meta" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {[
            { label: "Title", chars: `${page_data.title_len} симв. · рек. 50–60`, current: page_data.title, field: report.meta_audit?.title },
            { label: "Meta Description", chars: `${page_data.desc_len} симв. · рек. 120–160`, current: page_data.description, field: report.meta_audit?.description },
            { label: "Keywords", chars: "", current: page_data.keywords, field: report.meta_audit?.keywords },
            { label: "Robots", chars: "", current: page_data.robots, field: report.meta_audit?.robots },
            { label: "H1 — главный заголовок", chars: "", current: (page_data.headings?.h1 || [])[0] || "", field: report.meta_audit?.h1 },
            { label: "Canonical URL", chars: "", current: page_data.canonical, field: report.meta_audit?.canonical },
            {
              label: "Open Graph",
              chars: "",
              current: [
                page_data.og_title ? `og:title — ${page_data.og_title}` : null,
                page_data.og_description ? `og:description — ${page_data.og_description}` : null,
                page_data.og_image ? `og:image — есть` : `og:image — ❌ нет`,
                page_data.og_url ? `og:url — ${page_data.og_url}` : null,
                page_data.og_type ? `og:type — ${page_data.og_type}` : null,
              ].filter(Boolean).join("\n"),
              field: report.meta_audit?.og,
            },
            {
              label: "Twitter Cards",
              chars: "",
              current: [
                page_data.twitter_card ? `twitter:card — ${page_data.twitter_card}` : null,
                page_data.twitter_title ? `twitter:title — ${page_data.twitter_title}` : null,
                page_data.twitter_description ? `twitter:description — ${page_data.twitter_description}` : null,
              ].filter(Boolean).join("\n"),
              field: report.meta_audit?.twitter,
            },
          ].map((item, i) => (
            <Card key={i} style={{ padding: 18 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                <span style={{ fontSize: 13, fontWeight: 700, color: "#0F172A", flex: 1 }}>{item.label}</span>
                {item.field?.status && <StatusChip status={item.field.status} />}
              </div>
              {item.current ? (
                <div style={{ background: "#F8FAFC", borderRadius: 10, padding: "9px 13px", marginBottom: 8, border: "1px solid #E2E8F0" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 3 }}>
                    <span style={{ fontSize: 10, fontWeight: 700, color: "#94A3B8", textTransform: "uppercase" }}>Текущее значение</span>
                    {item.chars && <span style={{ fontSize: 10, color: "#94A3B8" }}>{item.chars}</span>}
                  </div>
                  <div style={{ fontSize: 13, color: "#334155", lineHeight: 1.7, whiteSpace: "pre-line" }}>{item.current}</div>
                </div>
              ) : (
                <div style={{ padding: "9px 13px", background: "#fef2f2", border: "1px solid #fca5a5", borderRadius: 10, marginBottom: 8, fontSize: 13, color: "#dc2626", fontWeight: 600 }}>❌ Отсутствует</div>
              )}
              {item.field?.issue && <div style={{ fontSize: 12, color: "#64748B", lineHeight: 1.6, marginBottom: 6 }}>{item.field.issue}</div>}
              {item.field?.suggestion && <SuggestionBox text={item.field.suggestion} />}
            </Card>
          ))}

          {Object.keys(page_data.headings || {}).length > 0 && (
            <Card style={{ padding: 18 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: "#0F172A", marginBottom: 14 }}>Все заголовки страницы</div>
              {Object.entries(page_data.headings).map(([level, texts]) => (
                <div key={level} style={{ marginBottom: 12 }}>
                  <div style={{ fontSize: 10, fontWeight: 700, color: "#94A3B8", textTransform: "uppercase", letterSpacing: 0.7, marginBottom: 6 }}>{level.toUpperCase()}</div>
                  {(texts as string[]).map((t, i) => (
                    <div key={i} style={{ fontSize: 13, color: "#334155", padding: "5px 10px", background: "#F8FAFC", borderRadius: 6, marginBottom: 4 }}>{t}</div>
                  ))}
                </div>
              ))}
            </Card>
          )}
        </div>
      )}

      {/* ── Контент ── */}
      {tab === "content" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <Card style={{ padding: 18 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: "#0F172A", marginBottom: 14 }}>Анализ контента</div>
            {[
              { label: "Объём текста", value: `${page_data.word_count} слов`, status: report.content_audit?.word_count_status, comment: report.content_audit?.word_count_comment },
              { label: "Читаемость и структура", value: "", status: "", comment: report.content_audit?.readability },
              { label: "Плотность ключевых слов", value: "", status: "", comment: report.content_audit?.keywords_density },
              { label: "Призыв к действию (CTA)", value: report.content_audit?.cta_present ? "✓ Есть" : "✗ Отсутствует", status: report.content_audit?.cta_present ? "good" : "bad", comment: report.content_audit?.cta_comment },
              { label: "Риски тонкого контента", value: "", status: "", comment: report.content_audit?.uniqueness_risk },
            ].map((item, i) => (
              <div key={i} style={{ padding: "12px 0", borderBottom: i < 4 ? "1px solid #F1F5F9" : "none" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: item.comment ? 6 : 0 }}>
                  <span style={{ fontSize: 13, fontWeight: 600, color: "#0F172A", flex: 1 }}>{item.label}</span>
                  {item.value && <span style={{ fontSize: 12, fontWeight: 700, color: item.status === "good" ? "#16a34a" : item.status === "bad" ? "#dc2626" : "#0F172A" }}>{item.value}</span>}
                  {item.status && item.status !== "" && <StatusChip status={item.status} />}
                </div>
                {item.comment && <div style={{ fontSize: 13, color: "#475569", lineHeight: 1.7 }}>{item.comment}</div>}
              </div>
            ))}
          </Card>
        </div>
      )}

      {/* ── Ключевые слова ── */}
      {tab === "keywords" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {report.keyword_suggestions ? (
            <>
              <Card style={{ padding: 18 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
                  <Icon name="Target" size={15} style={{ color: ACCENT }} />
                  <span style={{ fontSize: 13, fontWeight: 700, color: "#0F172A" }}>Основные запросы</span>
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                  {report.keyword_suggestions.primary.map((kw, i) => (
                    <div key={i} style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 12px", background: "#eff6ff", border: "1px solid #bfdbfe", borderRadius: 20 }}>
                      <span style={{ fontSize: 13, color: "#1e40af", fontWeight: 600 }}>{kw}</span>
                      <CopyBtn text={kw} />
                    </div>
                  ))}
                </div>
              </Card>

              <Card style={{ padding: 18 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
                  <Icon name="Layers" size={15} style={{ color: "#7c3aed" }} />
                  <span style={{ fontSize: 13, fontWeight: 700, color: "#0F172A" }}>LSI-запросы (семантические)</span>
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                  {report.keyword_suggestions.secondary.map((kw, i) => (
                    <div key={i} style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 12px", background: "#faf5ff", border: "1px solid #e9d5ff", borderRadius: 20 }}>
                      <span style={{ fontSize: 13, color: "#5b21b6", fontWeight: 600 }}>{kw}</span>
                      <CopyBtn text={kw} />
                    </div>
                  ))}
                </div>
              </Card>

              <Card style={{ padding: 18 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
                  <Icon name="Telescope" size={15} style={{ color: "#059669" }} />
                  <span style={{ fontSize: 13, fontWeight: 700, color: "#0F172A" }}>Длинный хвост (low competition)</span>
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
              </Card>

              {report.keyword_suggestions.comment && (
                <Card style={{ padding: 18 }}>
                  <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                    <Icon name="Lightbulb" size={15} style={{ color: "#d97706", flexShrink: 0, marginTop: 2 }} />
                    <div>
                      <div style={{ fontSize: 12, fontWeight: 700, color: "#92400e", marginBottom: 4 }}>Совет по внедрению</div>
                      <div style={{ fontSize: 13, color: "#475569", lineHeight: 1.7 }}>{report.keyword_suggestions.comment}</div>
                    </div>
                  </div>
                </Card>
              )}
            </>
          ) : (
            <Card style={{ padding: 32, textAlign: "center" }}>
              <Icon name="Search" size={32} style={{ color: "#CBD5E1", marginBottom: 8 }} />
              <div style={{ fontSize: 13, color: "#94A3B8" }}>Данные о ключевых словах недоступны</div>
            </Card>
          )}
        </div>
      )}

      {/* ── Техника ── */}
      {tab === "tech" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {/* Скорость и размер */}
          {(page_data.load_time_ms != null || page_data.page_size_kb != null || page_data.http_status != null) && (
            <Card>
              <CardHeader color={ACCENT} icon="Zap" title="Производительность" />
              <div style={{ padding: "14px 18px", display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
                {page_data.http_status != null && (
                  <div style={{ padding: "10px 12px", background: page_data.http_status === 200 ? "#f0fdf4" : "#fef2f2", borderRadius: 10, border: `1px solid ${page_data.http_status === 200 ? "#bbf7d0" : "#fca5a5"}` }}>
                    <div style={{ fontSize: 11, color: "#94A3B8", marginBottom: 3 }}>HTTP статус</div>
                    <div style={{ fontSize: 20, fontWeight: 800, color: page_data.http_status === 200 ? "#16a34a" : "#dc2626" }}>{page_data.http_status}</div>
                  </div>
                )}
                {page_data.load_time_ms != null && (
                  <div style={{ padding: "10px 12px", background: page_data.load_time_ms < 1000 ? "#f0fdf4" : page_data.load_time_ms < 3000 ? "#fffbeb" : "#fef2f2", borderRadius: 10, border: `1px solid ${page_data.load_time_ms < 1000 ? "#bbf7d0" : page_data.load_time_ms < 3000 ? "#fde68a" : "#fca5a5"}` }}>
                    <div style={{ fontSize: 11, color: "#94A3B8", marginBottom: 3 }}>Время загрузки</div>
                    <div style={{ fontSize: 20, fontWeight: 800, color: page_data.load_time_ms < 1000 ? "#16a34a" : page_data.load_time_ms < 3000 ? "#d97706" : "#dc2626" }}>{page_data.load_time_ms} мс</div>
                  </div>
                )}
                {page_data.page_size_kb != null && (
                  <div style={{ padding: "10px 12px", background: page_data.page_size_kb < 500 ? "#f0fdf4" : "#fffbeb", borderRadius: 10, border: `1px solid ${page_data.page_size_kb < 500 ? "#bbf7d0" : "#fde68a"}` }}>
                    <div style={{ fontSize: 11, color: "#94A3B8", marginBottom: 3 }}>Размер страницы</div>
                    <div style={{ fontSize: 20, fontWeight: 800, color: page_data.page_size_kb < 500 ? "#16a34a" : "#d97706" }}>{page_data.page_size_kb} КБ</div>
                  </div>
                )}
              </div>
            </Card>
          )}

          {/* Технический аудит */}
          <Card style={{ padding: 18 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: "#0F172A", marginBottom: 14 }}>Технический аудит</div>
            {Object.entries(report.technical_audit || {}).map(([key, val]: [string, { status: string; comment: string; recommended?: string; schema_jsonld?: string }]) => {
              const labels: Record<string, string> = { mobile: "Mobile-friendly", schema: "Структурированные данные (Schema.org)", images: "Изображения", links: "Ссылочная структура" };
              return (
                <div key={key} style={{ padding: "12px 0", borderBottom: "1px solid #F1F5F9" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: val.comment ? 6 : 0 }}>
                    <span style={{ fontSize: 13, fontWeight: 600, color: "#0F172A", flex: 1 }}>{labels[key] || key}</span>
                    <StatusChip status={val.status} />
                  </div>
                  {val.comment && <div style={{ fontSize: 13, color: "#475569", lineHeight: 1.7 }}>{val.comment}</div>}
                  {val.recommended && <div style={{ marginTop: 6, fontSize: 12, color: "#6d28d9", background: "#faf5ff", padding: "6px 10px", borderRadius: 7, border: "1px solid #e9d5ff" }}>Рекомендуется: {val.recommended}</div>}
                  {val.schema_jsonld && <SuggestionBox text={val.schema_jsonld} />}
                </div>
              );
            })}
          </Card>

          {/* Метрики */}
          <Card>
            <CardHeader color="#64748B" icon="BarChart2" title="Метрики страницы" />
            <div style={{ padding: "14px 18px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              {[
                { label: "Viewport", value: page_data.has_viewport ? "Настроен" : "Отсутствует", ok: page_data.has_viewport },
                { label: "Charset", value: page_data.has_charset ? "Задан" : "Отсутствует", ok: page_data.has_charset },
                { label: "robots.txt", value: page_data.robots_exists ? "Есть" : "Не найден", ok: !!page_data.robots_exists },
                { label: "Sitemap", value: page_data.sitemap_url ? "Есть" : "Не найден", ok: !!page_data.sitemap_url },
                { label: "Schema.org типы", value: page_data.schema_types?.join(", ") || "нет", ok: (page_data.schema_types?.length ?? 0) > 0 },
                { label: "Hreflang", value: (page_data as { hreflang?: string[] }).hreflang?.length ? (page_data as { hreflang?: string[] }).hreflang!.join(", ") : "нет", ok: !!(page_data as { hreflang?: string[] }).hreflang?.length },
                { label: "Внутренних ссылок", value: page_data.internal_links, ok: page_data.internal_links > 2 },
                { label: "Внешних ссылок", value: page_data.external_links, ok: true },
                { label: "Изображений всего", value: page_data.images_count, ok: true },
                { label: "Без alt-тега", value: page_data.images_no_alt, ok: page_data.images_no_alt === 0 },
                { label: "С lazy-load", value: page_data.images_lazy, ok: true },
                { label: "OG Image", value: page_data.og_image ? "Есть" : "Отсутствует", ok: !!page_data.og_image },
              ].map((row, i) => (
                <div key={i} style={{ padding: "10px 12px", background: row.ok ? "#F8FAFC" : "#fef2f2", borderRadius: 10, border: `1px solid ${row.ok ? "#E2E8F0" : "#fca5a5"}` }}>
                  <div style={{ fontSize: 11, color: "#94A3B8", marginBottom: 3 }}>{row.label}</div>
                  <div style={{ fontSize: 15, fontWeight: 800, color: row.ok ? "#0F172A" : "#dc2626", wordBreak: "break-all" }}>{String(row.value)}</div>
                </div>
              ))}
            </div>
            {page_data.sitemap_url && (
              <div style={{ padding: "0 18px 14px" }}>
                <div style={{ fontSize: 11, color: "#94A3B8", marginBottom: 4 }}>URL Sitemap</div>
                <a href={page_data.sitemap_url} target="_blank" rel="noopener noreferrer" style={{ fontSize: 12, color: ACCENT, wordBreak: "break-all" }}>{page_data.sitemap_url}</a>
              </div>
            )}
          </Card>
        </div>
      )}

      {/* ── Сырые данные ── */}
      {tab === "data" && (
        <Card style={{ padding: 18 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: "#0F172A" }}>Сырые данные страницы</div>
            <CopyBtn text={JSON.stringify(result.page_data, null, 2)} />
          </div>
          <pre style={{ fontSize: 11, color: "#475569", background: "#F8FAFC", borderRadius: 10, padding: 14, overflowX: "auto", lineHeight: 1.6, border: "1px solid #E2E8F0" }}>
            {JSON.stringify(result.page_data, null, 2)}
          </pre>
        </Card>
      )}
    </div>
  );
}
