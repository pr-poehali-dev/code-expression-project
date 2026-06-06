import { useState } from "react";
import Icon from "@/components/ui/icon";
import { ACCENT } from "./LkAdminShared";
import { renderMarkdown } from "@/utils/markdown";

const ADMIN_SEO_URL = "https://functions.poehali.dev/ab6ca380-8b84-4708-b715-cb3771fd07d9";
const ADMIN_TOKEN = "Sss07011974ssS";

// ── Типы ──────────────────────────────────────────────────────────────────────

interface MetaField { status: "good" | "warn" | "bad"; issue: string; suggestion?: string; }
interface Report {
  score: number;
  grade: string;
  summary: string;
  critical: { issue: string; impact: string; fix: string; example: string }[];
  improvements: { area: string; current: string; better: string; example: string; priority: string }[];
  meta_audit: { title: MetaField; description: MetaField; h1: MetaField; canonical: MetaField; og: MetaField };
  content_audit: { word_count_status: string; word_count_comment: string; readability: string; keywords_density: string; cta_present: boolean; cta_comment: string; uniqueness_risk: string };
  technical_audit: { mobile: { status: string; comment: string }; schema: { status: string; comment: string; recommended: string }; images: { status: string; comment: string }; links: { status: string; comment: string } };
  quick_wins: string[];
  growth_opportunities: string[];
}
interface PageData { title: string; title_len: number; description: string; desc_len: number; canonical: string; og_title: string; og_image: string; headings: Record<string, string[]>; word_count: number; internal_links: number; external_links: number; images_count: number; images_no_alt: number; schema_types: string[]; has_viewport: boolean; }
interface AnalysisResult { url: string; page_data: PageData; report: Report; score: number; grade: string; }

// ── Примитивы ─────────────────────────────────────────────────────────────────

const STATUS_MAP = {
  good: { icon: "CheckCircle2", color: "#16a34a", bg: "#f0fdf4", label: "OK" },
  warn: { icon: "AlertTriangle", color: "#d97706", bg: "#fffbeb", label: "Улучшить" },
  bad:  { icon: "XCircle",       color: "#dc2626", bg: "#fef2f2", label: "Ошибка" },
};

function StatusChip({ status }: { status: string }) {
  const m = STATUS_MAP[status as keyof typeof STATUS_MAP] ?? STATUS_MAP.warn;
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 4, padding: "3px 8px", background: m.bg, borderRadius: 20, fontSize: 11, fontWeight: 700, color: m.color, flexShrink: 0 }}>
      <Icon name={m.icon} size={11} />{m.label}
    </span>
  );
}

function CopyBtn({ text }: { text: string }) {
  const [done, setDone] = useState(false);
  return (
    <button onClick={() => { navigator.clipboard.writeText(text); setDone(true); setTimeout(() => setDone(false), 2000); }}
      style={{ display: "inline-flex", alignItems: "center", gap: 4, padding: "4px 10px", borderRadius: 7, border: "1px solid #E2E8F0", background: done ? "#f0fdf4" : "#fff", color: done ? "#16a34a" : "#64748B", fontSize: 11, fontWeight: 600, cursor: "pointer", fontFamily: "Montserrat,sans-serif", flexShrink: 0 }}>
      <Icon name={done ? "Check" : "Copy"} size={11} />
      {done ? "Скопировано" : "Копировать"}
    </button>
  );
}

function SuggestionBox({ text }: { text: string }) {
  if (!text) return null;
  return (
    <div style={{ background: "#f0fdf4", border: "1px solid #86efac", borderRadius: 10, padding: "10px 14px", marginTop: 8 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 5 }}>
        <span style={{ fontSize: 10, fontWeight: 700, color: "#16a34a", textTransform: "uppercase", letterSpacing: 0.5 }}>Готовый вариант</span>
        <CopyBtn text={text} />
      </div>
      <div style={{ fontSize: 12, color: "#166534", lineHeight: 1.6 }}>{text}</div>
    </div>
  );
}

function ScoreRing({ score, grade }: { score: number; grade: string }) {
  const color = score >= 70 ? "#16a34a" : score >= 50 ? "#d97706" : "#dc2626";
  const bg = score >= 70 ? "#f0fdf4" : score >= 50 ? "#fffbeb" : "#fef2f2";
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2, padding: "14px 20px", background: bg, borderRadius: 14, border: `2px solid ${color}22`, flexShrink: 0 }}>
      <div style={{ fontSize: 38, fontWeight: 900, color, lineHeight: 1 }}>{score}</div>
      <div style={{ fontSize: 18, fontWeight: 800, color }}>{grade}</div>
      <div style={{ fontSize: 10, color: "#94A3B8" }}>из 100</div>
    </div>
  );
}

function Card({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <div style={{ background: "#fff", borderRadius: 14, border: "1.5px solid #E8ECF0", boxShadow: "0 1px 3px rgba(15,23,42,0.05)", overflow: "hidden", ...style }}>
      {children}
    </div>
  );
}

function CardHeader({ color, icon, title, count }: { color: string; bg?: string; icon: string; title: string; count?: number }) {
  return (
    <div style={{ padding: "12px 18px", background: `${color}12`, borderBottom: `1px solid ${color}30`, display: "flex", alignItems: "center", gap: 8 }}>
      <Icon name={icon} size={15} style={{ color }} />
      <span style={{ fontSize: 13, fontWeight: 700, color }}>{title}{count != null ? ` · ${count}` : ""}</span>
    </div>
  );
}

// ── Вкладки отчёта ────────────────────────────────────────────────────────────

type Tab = "overview" | "meta" | "content" | "tech" | "data";

function ReportView({ result, onBack }: { result: AnalysisResult; onBack: () => void }) {
  const [tab, setTab] = useState<Tab>("overview");
  const { report, page_data, url } = result;

  const tabs: { id: Tab; label: string; icon: string }[] = [
    { id: "overview", label: "Обзор",    icon: "LayoutDashboard" },
    { id: "meta",     label: "Мета",     icon: "Code2" },
    { id: "content",  label: "Контент",  icon: "FileText" },
    { id: "tech",     label: "Техника",  icon: "Settings2" },
    { id: "data",     label: "Данные",   icon: "Database" },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <button onClick={onBack} style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "none", border: "none", color: "#64748B", fontSize: 13, fontWeight: 600, cursor: "pointer", padding: 0, fontFamily: "Montserrat,sans-serif", width: "fit-content" }}>
        <Icon name="ArrowLeft" size={15} /> Новый анализ
      </button>

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

          {/* Быстрые победы */}
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

          {/* Точки роста */}
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
      <div style={{ display: "flex", gap: 4, background: "#F1F5F9", borderRadius: 12, padding: 4 }}>
        {tabs.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 5, padding: "8px 6px", borderRadius: 8, border: "none", cursor: "pointer", fontFamily: "Montserrat,sans-serif", fontSize: 11, fontWeight: 700, background: tab === t.id ? "#fff" : "transparent", color: tab === t.id ? "#0F172A" : "#64748B", boxShadow: tab === t.id ? "0 1px 4px rgba(0,0,0,0.08)" : "none", transition: "all 0.15s" }}>
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
            { label: "H1 — главный заголовок", chars: "", current: (page_data.headings?.h1 || [])[0] || "", field: report.meta_audit?.h1 },
            { label: "Canonical URL", chars: "", current: page_data.canonical, field: report.meta_audit?.canonical },
            { label: "Open Graph", chars: "", current: page_data.og_title ? `OG Title: ${page_data.og_title}` : "", field: report.meta_audit?.og },
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
                  <div style={{ fontSize: 13, color: "#334155", lineHeight: 1.6 }}>{item.current}</div>
                </div>
              ) : (
                <div style={{ padding: "9px 13px", background: "#fef2f2", border: "1px solid #fca5a5", borderRadius: 10, marginBottom: 8, fontSize: 13, color: "#dc2626", fontWeight: 600 }}>❌ Отсутствует</div>
              )}
              {item.field?.issue && <div style={{ fontSize: 12, color: "#64748B", lineHeight: 1.6, marginBottom: 6 }}>{item.field.issue}</div>}
              {item.field?.suggestion && <SuggestionBox text={item.field.suggestion} />}
            </Card>
          ))}

          {/* Все заголовки */}
          {Object.keys(page_data.headings || {}).length > 0 && (
            <Card style={{ padding: 18 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: "#0F172A", marginBottom: 14 }}>Все заголовки страницы</div>
              {Object.entries(page_data.headings).map(([level, texts]) => (
                <div key={level} style={{ marginBottom: 12 }}>
                  <div style={{ fontSize: 10, fontWeight: 700, color: "#94A3B8", textTransform: "uppercase", letterSpacing: 0.7, marginBottom: 6 }}>{level.toUpperCase()}</div>
                  {(texts as string[]).slice(0, 6).map((t, i) => (
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

      {/* ── Техника ── */}
      {tab === "tech" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <Card style={{ padding: 18 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: "#0F172A", marginBottom: 14 }}>Технический аудит</div>
            {Object.entries(report.technical_audit || {}).map(([key, val]: [string, { status: string; comment: string; recommended?: string }]) => {
              const labels: Record<string, string> = { mobile: "Mobile-friendly", schema: "Структурированные данные (Schema.org)", images: "Изображения", links: "Ссылочная структура" };
              return (
                <div key={key} style={{ padding: "12px 0", borderBottom: "1px solid #F1F5F9" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: val.comment ? 6 : 0 }}>
                    <span style={{ fontSize: 13, fontWeight: 600, color: "#0F172A", flex: 1 }}>{labels[key] || key}</span>
                    <StatusChip status={val.status} />
                  </div>
                  {val.comment && <div style={{ fontSize: 13, color: "#475569", lineHeight: 1.7 }}>{val.comment}</div>}
                  {val.recommended && <div style={{ marginTop: 6, fontSize: 12, color: "#6d28d9", background: "#faf5ff", padding: "6px 10px", borderRadius: 7, border: "1px solid #e9d5ff" }}>Рекомендуется: {val.recommended}</div>}
                </div>
              );
            })}
          </Card>

          <Card>
            <CardHeader color="#64748B" icon="BarChart2" title="Метрики страницы" />
            <div style={{ padding: "14px 18px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              {[
                { label: "Viewport", value: page_data.has_viewport ? "Настроен" : "Отсутствует", ok: page_data.has_viewport },
                { label: "Schema.org типы", value: page_data.schema_types?.join(", ") || "нет", ok: (page_data.schema_types?.length ?? 0) > 0 },
                { label: "Внутренних ссылок", value: page_data.internal_links, ok: page_data.internal_links > 2 },
                { label: "Внешних ссылок", value: page_data.external_links, ok: true },
                { label: "Изображений всего", value: page_data.images_count, ok: true },
                { label: "Без alt-тега", value: page_data.images_no_alt, ok: page_data.images_no_alt === 0 },
                { label: "OG Image", value: page_data.og_image ? "Есть" : "Отсутствует", ok: !!page_data.og_image },
              ].map((row, i) => (
                <div key={i} style={{ padding: "10px 12px", background: row.ok ? "#F8FAFC" : "#fef2f2", borderRadius: 10, border: `1px solid ${row.ok ? "#E2E8F0" : "#fca5a5"}` }}>
                  <div style={{ fontSize: 11, color: "#94A3B8", marginBottom: 3 }}>{row.label}</div>
                  <div style={{ fontSize: 16, fontWeight: 800, color: row.ok ? "#0F172A" : "#dc2626" }}>{String(row.value)}</div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}

      {/* ── Сырые данные ── */}
      {tab === "data" && (
        <Card style={{ padding: 18 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: "#0F172A", marginBottom: 12 }}>Сырые данные страницы</div>
          <pre style={{ fontSize: 11, color: "#475569", background: "#F8FAFC", borderRadius: 10, padding: 14, overflowX: "auto", lineHeight: 1.6, border: "1px solid #E2E8F0" }}>
            {JSON.stringify(result.page_data, null, 2)}
          </pre>
        </Card>
      )}
    </div>
  );
}

// ── Главный компонент ─────────────────────────────────────────────────────────

export function SeoSection() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [history, setHistory] = useState<{ url: string; score: number; grade: string; ts: number }[]>(() => {
    try { return JSON.parse(localStorage.getItem("admin_seo_history") || "[]"); } catch { return []; }
  });

  async function runAnalysis() {
    const trimmed = url.trim();
    if (!trimmed) { setError("Введите URL"); return; }
    setLoading(true); setError(""); setResult(null);
    try {
      const res = await fetch(ADMIN_SEO_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json", "X-Admin-Token": ADMIN_TOKEN },
        body: JSON.stringify({ url: trimmed }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Ошибка анализа");
      setResult(data as AnalysisResult);
      const newHistory = [{ url: data.url, score: data.score, grade: data.grade, ts: Date.now() }, ...history.filter(h => h.url !== data.url)].slice(0, 10);
      setHistory(newHistory);
      try { localStorage.setItem("admin_seo_history", JSON.stringify(newHistory)); } catch { /* ignore */ }
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Ошибка");
    } finally { setLoading(false); }
  }

  if (result) return <ReportView result={result} onBack={() => setResult(null)} />;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>

      {/* Шапка */}
      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
        <div style={{ width: 44, height: 44, borderRadius: 12, background: "#f0f9ff", border: "1.5px solid #bae6fd", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          <Icon name="Globe" size={22} style={{ color: ACCENT }} />
        </div>
        <div>
          <div style={{ fontWeight: 700, fontSize: 15, color: "#0F172A" }}>SEO-анализатор PRO</div>
          <div style={{ fontSize: 11, color: "#94A3B8" }}>Глубокий аудит любого сайта · GPT-4o · без привязки к салону</div>
        </div>
      </div>

      <p style={{ fontSize: 13, color: "#64748B", margin: 0, lineHeight: 1.7, maxWidth: 560 }}>
        Введи URL любого сайта — ИИ загрузит страницу, извлечёт все мета-данные, заголовки, Schema.org, OG-теги и выдаст полный аудит с готовыми текстами для исправления.
      </p>

      {/* Форма */}
      <div style={{ background: "#fff", borderRadius: 14, border: "1.5px solid #E8ECF0", padding: "18px 20px", boxShadow: "0 1px 3px rgba(15,23,42,0.05)" }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: "#475569", marginBottom: 10 }}>URL для анализа</div>
        <div style={{ display: "flex", gap: 10, alignItems: "stretch", flexWrap: "wrap" }}>
          <div style={{ flex: 1, minWidth: 220, position: "relative" }}>
            <Icon name="Globe" size={14} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "#94A3B8", pointerEvents: "none" }} />
            <input
              value={url}
              onChange={e => setUrl(e.target.value)}
              onKeyDown={e => e.key === "Enter" && !loading && runAnalysis()}
              placeholder="https://example.com"
              style={{ width: "100%", padding: "11px 13px 11px 36px", borderRadius: 10, border: "1.5px solid #E2E8F0", fontSize: 13, outline: "none", fontFamily: "Montserrat,sans-serif", color: "#0F172A", boxSizing: "border-box" }}
              onFocus={e => (e.target.style.borderColor = ACCENT)}
              onBlur={e => (e.target.style.borderColor = "#E2E8F0")}
            />
          </div>
          <button
            onClick={runAnalysis}
            disabled={loading || !url.trim()}
            style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, padding: "11px 22px", borderRadius: 10, border: "none", background: loading || !url.trim() ? "#E2E8F0" : ACCENT, color: loading || !url.trim() ? "#94A3B8" : "#fff", fontSize: 13, fontWeight: 700, cursor: loading || !url.trim() ? "default" : "pointer", fontFamily: "Montserrat,sans-serif", whiteSpace: "nowrap", flexShrink: 0 }}
          >
            {loading
              ? <><Icon name="Loader2" size={15} style={{ animation: "spin 1s linear infinite" }} /> Анализирую...</>
              : <><Icon name="Search" size={15} /> Запустить анализ</>
            }
          </button>
        </div>

        {loading && (
          <div style={{ marginTop: 12, display: "flex", alignItems: "center", gap: 10, padding: "10px 14px", background: "#f0f9ff", border: "1px solid #bae6fd", borderRadius: 10 }}>
            <Icon name="Loader2" size={14} style={{ color: ACCENT, animation: "spin 1s linear infinite", flexShrink: 0 }} />
            <div>
              <div style={{ fontSize: 12, fontWeight: 700, color: ACCENT }}>Загружаю страницу и запускаю GPT-4o...</div>
              <div style={{ fontSize: 11, color: "#94A3B8", marginTop: 2 }}>Глубокий анализ занимает 20–40 секунд</div>
            </div>
          </div>
        )}

        {error && (
          <div style={{ marginTop: 10, display: "flex", alignItems: "center", gap: 8, padding: "10px 12px", background: "#fef2f2", border: "1px solid #fca5a5", borderRadius: 8 }}>
            <Icon name="AlertCircle" size={14} style={{ color: "#dc2626", flexShrink: 0 }} />
            <span style={{ fontSize: 13, color: "#dc2626" }}>{error}</span>
          </div>
        )}

        <div style={{ marginTop: 10, fontSize: 11, color: "#94A3B8", display: "flex", alignItems: "center", gap: 5 }}>
          <Icon name="Info" size={11} />
          Работает с любыми HTML-сайтами: Tilda, WordPress, лендинги, интернет-магазины
        </div>
      </div>

      {/* История */}
      {history.length > 0 && (
        <div>
          <div style={{ fontSize: 11, fontWeight: 700, color: "#94A3B8", textTransform: "uppercase", letterSpacing: 0.7, marginBottom: 10 }}>История анализов</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {history.map((item, i) => {
              const scoreColor = item.score >= 70 ? "#16a34a" : item.score >= 50 ? "#d97706" : "#dc2626";
              return (
                <div key={i} onClick={() => setUrl(item.url)}
                  style={{ background: "#fff", borderRadius: 12, border: "1.5px solid #E8ECF0", display: "flex", alignItems: "center", gap: 12, padding: "12px 16px", cursor: "pointer", transition: "all 0.15s", boxShadow: "0 1px 3px rgba(15,23,42,0.04)" }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = "#bae6fd"; e.currentTarget.style.boxShadow = "0 4px 14px rgba(0,0,0,0.06)"; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = "#E8ECF0"; e.currentTarget.style.boxShadow = "0 1px 3px rgba(15,23,42,0.04)"; }}
                >
                  <div style={{ width: 34, height: 34, borderRadius: 9, background: "#f0f9ff", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <Icon name="Globe" size={15} style={{ color: ACCENT }} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: "#0F172A", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{item.url}</div>
                    <div style={{ fontSize: 11, color: "#94A3B8", marginTop: 2 }}>{new Date(item.ts).toLocaleString("ru", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}</div>
                  </div>
                  <div style={{ fontWeight: 800, fontSize: 18, color: scoreColor, minWidth: 40, textAlign: "right" }}>
                    {item.score}<span style={{ fontSize: 9, fontWeight: 400, color: "#94A3B8" }}>/100</span>
                  </div>
                  <div style={{ fontSize: 14, fontWeight: 900, color: scoreColor, minWidth: 22, textAlign: "center" }}>{item.grade}</div>
                  <div style={{ display: "flex", alignItems: "center", gap: 4, padding: "5px 9px", background: "#F1F5F9", borderRadius: 7, flexShrink: 0 }}>
                    <Icon name="RefreshCw" size={10} style={{ color: "#64748B" }} />
                    <span style={{ fontSize: 11, fontWeight: 600, color: "#64748B" }}>Повторить</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
