import { useState, useEffect } from "react";
import Icon from "@/components/ui/icon";
import { useLkAuth } from "@/contexts/LkAuthContext";

const SEO_URL = "https://functions.poehali.dev/3603658f-6f23-4de6-b671-73bb1832b4e0";
const ENERGY_MAIN = 50;
const ENERGY_PAGE = 30;
const ENERGY_REPEAT = 20;

interface SeoReport {
  score: number;
  summary: string;
  critical: { issue: string; recommendation: string; example: string }[];
  improvements: { area: string; current: string; better: string; example: string }[];
  meta: {
    title_status: "good" | "warn" | "bad";
    title_issue: string;
    title_suggestion: string;
    description_status: "good" | "warn" | "bad";
    description_issue: string;
    description_suggestion: string;
    h1_status: "good" | "warn" | "bad";
    h1_issue: string;
    h1_suggestion: string;
  };
  content_analysis: {
    cta_present: boolean;
    cta_recommendation: string;
    services_mentioned: boolean;
    services_recommendation: string;
    local_seo: boolean;
    local_seo_recommendation: string;
  };
  quick_wins: string[];
}

interface AnalysisResult {
  analysis_id: number;
  url: string;
  page_data: {
    title: string;
    description: string;
    keywords: string;
    headings: Record<string, string[]>;
    internal_links: number;
    external_links: number;
    images_count: number;
    images_no_alt: number;
    canonical: string;
  };
  report: SeoReport;
  score: number;
  energy_spent: number;
  energy_balance: number;
}

interface AnalysisListItem {
  id: number;
  url: string;
  is_main_page: boolean;
  status: string;
  title: string;
  score: number;
  energy_spent: number;
  created_at: string;
}

function ScoreBadge({ score }: { score: number }) {
  const color = score >= 70 ? "#16a34a" : score >= 40 ? "#d97706" : "#dc2626";
  const bg = score >= 70 ? "#f0fdf4" : score >= 40 ? "#fffbeb" : "#fef2f2";
  const border = score >= 70 ? "#86efac" : score >= 40 ? "#fde68a" : "#fca5a5";
  return (
    <div style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "6px 14px", background: bg, border: `1.5px solid ${border}`, borderRadius: 50 }}>
      <div style={{ width: 8, height: 8, borderRadius: "50%", background: color }} />
      <span style={{ fontSize: 14, fontWeight: 800, color }}>{score}/100</span>
    </div>
  );
}

function StatusIcon({ status }: { status: "good" | "warn" | "bad" }) {
  if (status === "good") return <Icon name="CheckCircle2" size={16} style={{ color: "#16a34a", flexShrink: 0 }} />;
  if (status === "warn") return <Icon name="AlertTriangle" size={16} style={{ color: "#d97706", flexShrink: 0 }} />;
  return <Icon name="XCircle" size={16} style={{ color: "#dc2626", flexShrink: 0 }} />;
}

function CopyBtn({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      onClick={() => { navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 2000); }}
      style={{ display: "inline-flex", alignItems: "center", gap: 4, padding: "3px 9px", borderRadius: 6, border: "1px solid #E2E8F0", background: copied ? "#f0fdf4" : "#fff", color: copied ? "#16a34a" : "#94A3B8", fontSize: 11, fontWeight: 600, cursor: "pointer", fontFamily: "Montserrat,sans-serif" }}
    >
      <Icon name={copied ? "Check" : "Copy"} size={11} />
      {copied ? "Скопировано" : "Копировать"}
    </button>
  );
}

function ReportView({ result, onBack }: { result: AnalysisResult; onBack: () => void }) {
  const { report, page_data, url } = result;
  const [tab, setTab] = useState<"overview" | "meta" | "content" | "technical">("overview");

  const tabStyle = (active: boolean): React.CSSProperties => ({
    padding: "8px 16px", borderRadius: 8, border: "none", cursor: "pointer",
    fontFamily: "Montserrat,sans-serif", fontSize: 12, fontWeight: 700,
    background: active ? "#0F172A" : "transparent",
    color: active ? "#fff" : "#64748B",
    transition: "all 0.15s",
  });

  return (
    <div>
      <button onClick={onBack} style={{ display: "flex", alignItems: "center", gap: 6, background: "none", border: "none", color: "#64748B", fontSize: 13, fontWeight: 600, cursor: "pointer", padding: 0, marginBottom: 20, fontFamily: "Montserrat,sans-serif" }}>
        <Icon name="ArrowLeft" size={15} /> Назад к SEO-оптимизатору
      </button>

      {/* Шапка */}
      <div style={{ background: "#fff", borderRadius: 18, border: "1.5px solid #E8ECF0", padding: "24px 28px", marginBottom: 16, boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 16, flexWrap: "wrap" }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: "#94A3B8", letterSpacing: 1, textTransform: "uppercase", marginBottom: 6 }}>SEO-анализ страницы</div>
            <div style={{ fontSize: 16, fontWeight: 700, color: "#0F172A", marginBottom: 4, wordBreak: "break-all" }}>{url}</div>
            <div style={{ fontSize: 13, color: "#64748B", lineHeight: 1.6 }}>{report.summary}</div>
          </div>
          <ScoreBadge score={report.score} />
        </div>

        {/* Быстрые победы */}
        {report.quick_wins?.length > 0 && (
          <div style={{ marginTop: 18, padding: "14px 16px", background: "#eff6ff", borderRadius: 12, border: "1px solid #bfdbfe" }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: "#1e40af", marginBottom: 10 }}>Быстрые улучшения (без разработчика)</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {report.quick_wins.map((w, i) => (
                <div key={i} style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
                  <div style={{ width: 18, height: 18, borderRadius: "50%", background: "#1e40af", color: "#fff", fontSize: 10, fontWeight: 800, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 1 }}>{i + 1}</div>
                  <span style={{ fontSize: 13, color: "#1e3a8a", lineHeight: 1.5 }}>{w}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Табы */}
      <div style={{ display: "flex", gap: 4, background: "#F1F5F9", borderRadius: 10, padding: 4, marginBottom: 16 }}>
        {[
          { id: "overview", label: "Обзор", icon: "LayoutDashboard" },
          { id: "meta", label: "Мета-теги", icon: "Code2" },
          { id: "content", label: "Контент", icon: "FileText" },
          { id: "technical", label: "Техническое", icon: "Settings2" },
        ].map(t => (
          <button key={t.id} onClick={() => setTab(t.id as typeof tab)} style={tabStyle(tab === t.id)}>
            <span style={{ display: "flex", alignItems: "center", gap: 5 }}>
              <Icon name={t.icon} size={12} />
              {t.label}
            </span>
          </button>
        ))}
      </div>

      {/* Обзор — критические проблемы и улучшения */}
      {tab === "overview" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {report.critical?.length > 0 && (
            <div style={{ background: "#fff", borderRadius: 16, border: "1.5px solid #fca5a5", overflow: "hidden" }}>
              <div style={{ padding: "14px 20px", background: "#fef2f2", borderBottom: "1px solid #fca5a5", display: "flex", alignItems: "center", gap: 8 }}>
                <Icon name="AlertCircle" size={15} style={{ color: "#dc2626" }} />
                <span style={{ fontSize: 13, fontWeight: 700, color: "#dc2626" }}>Критические проблемы ({report.critical.length})</span>
              </div>
              <div style={{ padding: "16px 20px", display: "flex", flexDirection: "column", gap: 16 }}>
                {report.critical.map((c, i) => (
                  <div key={i} style={{ paddingBottom: i < report.critical.length - 1 ? 16 : 0, borderBottom: i < report.critical.length - 1 ? "1px solid #F1F5F9" : "none" }}>
                    <div style={{ fontSize: 14, fontWeight: 700, color: "#0F172A", marginBottom: 4 }}>{c.issue}</div>
                    <div style={{ fontSize: 13, color: "#475569", marginBottom: 8, lineHeight: 1.6 }}>{c.recommendation}</div>
                    {c.example && (
                      <div style={{ background: "#F8FAFC", borderRadius: 8, padding: "10px 14px", border: "1px solid #E2E8F0" }}>
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 4 }}>
                          <span style={{ fontSize: 11, fontWeight: 700, color: "#94A3B8", textTransform: "uppercase", letterSpacing: 0.5 }}>Готовый вариант</span>
                          <CopyBtn text={c.example} />
                        </div>
                        <div style={{ fontSize: 13, color: "#334155", lineHeight: 1.6, whiteSpace: "pre-wrap" }}>{c.example}</div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {report.improvements?.length > 0 && (
            <div style={{ background: "#fff", borderRadius: 16, border: "1.5px solid #fde68a", overflow: "hidden" }}>
              <div style={{ padding: "14px 20px", background: "#fffbeb", borderBottom: "1px solid #fde68a", display: "flex", alignItems: "center", gap: 8 }}>
                <Icon name="TrendingUp" size={15} style={{ color: "#d97706" }} />
                <span style={{ fontSize: 13, fontWeight: 700, color: "#d97706" }}>Улучшения ({report.improvements.length})</span>
              </div>
              <div style={{ padding: "16px 20px", display: "flex", flexDirection: "column", gap: 16 }}>
                {report.improvements.map((imp, i) => (
                  <div key={i} style={{ paddingBottom: i < report.improvements.length - 1 ? 16 : 0, borderBottom: i < report.improvements.length - 1 ? "1px solid #F1F5F9" : "none" }}>
                    <div style={{ fontSize: 12, fontWeight: 700, color: "#94A3B8", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 4 }}>{imp.area}</div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 8 }}>
                      <div style={{ background: "#FEF2F2", borderRadius: 8, padding: "8px 12px" }}>
                        <div style={{ fontSize: 10, fontWeight: 700, color: "#dc2626", marginBottom: 3 }}>КАК СЕЙЧАС</div>
                        <div style={{ fontSize: 12, color: "#475569", lineHeight: 1.5 }}>{imp.current}</div>
                      </div>
                      <div style={{ background: "#F0FDF4", borderRadius: 8, padding: "8px 12px" }}>
                        <div style={{ fontSize: 10, fontWeight: 700, color: "#16a34a", marginBottom: 3 }}>КАК УЛУЧШИТЬ</div>
                        <div style={{ fontSize: 12, color: "#475569", lineHeight: 1.5 }}>{imp.better}</div>
                      </div>
                    </div>
                    {imp.example && (
                      <div style={{ background: "#F8FAFC", borderRadius: 8, padding: "10px 14px", border: "1px solid #E2E8F0" }}>
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 4 }}>
                          <span style={{ fontSize: 11, fontWeight: 700, color: "#94A3B8", textTransform: "uppercase", letterSpacing: 0.5 }}>Пример</span>
                          <CopyBtn text={imp.example} />
                        </div>
                        <div style={{ fontSize: 13, color: "#334155", lineHeight: 1.6, whiteSpace: "pre-wrap" }}>{imp.example}</div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Мета-теги */}
      {tab === "meta" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {[
            { label: "Title (заголовок страницы)", status: report.meta.title_status, current: page_data.title, issue: report.meta.title_issue, suggestion: report.meta.title_suggestion },
            { label: "Meta Description", status: report.meta.description_status, current: page_data.description, issue: report.meta.description_issue, suggestion: report.meta.description_suggestion },
            { label: "H1 — главный заголовок", status: report.meta.h1_status, current: (page_data.headings?.h1 || [])[0] || "", issue: report.meta.h1_issue, suggestion: report.meta.h1_suggestion },
          ].map((item, i) => (
            <div key={i} style={{ background: "#fff", borderRadius: 14, border: "1.5px solid #E8ECF0", padding: "18px 20px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
                <StatusIcon status={item.status} />
                <span style={{ fontSize: 14, fontWeight: 700, color: "#0F172A" }}>{item.label}</span>
              </div>
              {item.current ? (
                <div style={{ background: "#F8FAFC", borderRadius: 8, padding: "10px 14px", marginBottom: 10, border: "1px solid #E2E8F0" }}>
                  <div style={{ fontSize: 10, fontWeight: 700, color: "#94A3B8", marginBottom: 4, textTransform: "uppercase" }}>Текущее значение</div>
                  <div style={{ fontSize: 13, color: "#334155", lineHeight: 1.5 }}>{item.current}</div>
                  <div style={{ fontSize: 11, color: "#94A3B8", marginTop: 4 }}>{item.current.length} символов</div>
                </div>
              ) : (
                <div style={{ background: "#FEF2F2", borderRadius: 8, padding: "8px 14px", marginBottom: 10, border: "1px solid #fca5a5" }}>
                  <span style={{ fontSize: 12, color: "#dc2626", fontWeight: 600 }}>❌ Отсутствует</span>
                </div>
              )}
              {item.issue && <div style={{ fontSize: 13, color: "#64748B", marginBottom: 10, lineHeight: 1.6 }}>{item.issue}</div>}
              {item.suggestion && (
                <div style={{ background: "#F0FDF4", borderRadius: 8, padding: "10px 14px", border: "1px solid #86efac" }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
                    <span style={{ fontSize: 11, fontWeight: 700, color: "#16a34a", textTransform: "uppercase" }}>Рекомендуемый вариант</span>
                    <CopyBtn text={item.suggestion} />
                  </div>
                  <div style={{ fontSize: 13, color: "#166534", lineHeight: 1.5 }}>{item.suggestion}</div>
                </div>
              )}
            </div>
          ))}

          {/* Прочие мета */}
          <div style={{ background: "#fff", borderRadius: 14, border: "1.5px solid #E8ECF0", padding: "18px 20px" }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: "#0F172A", marginBottom: 12 }}>Другие заголовки</div>
            {Object.entries(page_data.headings || {}).map(([level, texts]) => (
              <div key={level} style={{ marginBottom: 10 }}>
                <span style={{ fontSize: 11, fontWeight: 700, color: "#94A3B8", textTransform: "uppercase", marginRight: 8 }}>{level}</span>
                {(texts as string[]).slice(0, 3).map((t, i) => (
                  <div key={i} style={{ fontSize: 13, color: "#334155", padding: "4px 0", borderBottom: "1px solid #F1F5F9" }}>{t}</div>
                ))}
              </div>
            ))}
            {page_data.keywords && (
              <div style={{ marginTop: 10 }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: "#94A3B8", textTransform: "uppercase", marginBottom: 4 }}>KEYWORDS</div>
                <div style={{ fontSize: 13, color: "#334155" }}>{page_data.keywords}</div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Контент */}
      {tab === "content" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {[
            { icon: "MousePointerClick", title: "Призыв к действию (CTA)", ok: report.content_analysis.cta_present, rec: report.content_analysis.cta_recommendation },
            { icon: "Scissors", title: "Услуги на странице", ok: report.content_analysis.services_mentioned, rec: report.content_analysis.services_recommendation },
            { icon: "MapPin", title: "Локальное SEO", ok: report.content_analysis.local_seo, rec: report.content_analysis.local_seo_recommendation },
          ].map((item, i) => (
            <div key={i} style={{ background: "#fff", borderRadius: 14, border: "1.5px solid #E8ECF0", padding: "18px 20px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                <Icon name={item.icon} size={16} style={{ color: "#64748B" }} />
                <span style={{ fontSize: 14, fontWeight: 700, color: "#0F172A", flex: 1 }}>{item.title}</span>
                {item.ok
                  ? <span style={{ fontSize: 11, fontWeight: 700, color: "#16a34a", background: "#f0fdf4", padding: "3px 9px", borderRadius: 20 }}>✓ Есть</span>
                  : <span style={{ fontSize: 11, fontWeight: 700, color: "#dc2626", background: "#fef2f2", padding: "3px 9px", borderRadius: 20 }}>✗ Нет</span>
                }
              </div>
              <div style={{ fontSize: 13, color: "#475569", lineHeight: 1.6 }}>{item.rec}</div>
            </div>
          ))}
        </div>
      )}

      {/* Техническое */}
      {tab === "technical" && (
        <div style={{ background: "#fff", borderRadius: 16, border: "1.5px solid #E8ECF0", overflow: "hidden" }}>
          <div style={{ padding: "14px 20px", borderBottom: "1px solid #F1F5F9" }}>
            <span style={{ fontSize: 13, fontWeight: 700, color: "#0F172A" }}>Технические параметры</span>
          </div>
          <div style={{ padding: "16px 20px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            {[
              { label: "Внутренних ссылок", value: page_data.internal_links, ok: page_data.internal_links > 2 },
              { label: "Внешних ссылок", value: page_data.external_links, ok: true },
              { label: "Изображений", value: page_data.images_count, ok: true },
              { label: "Изображений без alt", value: page_data.images_no_alt, ok: page_data.images_no_alt === 0 },
              { label: "Canonical URL", value: page_data.canonical ? "Настроен" : "Отсутствует", ok: !!page_data.canonical },
            ].map((row, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 14px", background: "#F8FAFC", borderRadius: 10 }}>
                <span style={{ fontSize: 12, color: "#64748B" }}>{row.label}</span>
                <span style={{ fontSize: 13, fontWeight: 700, color: row.ok ? "#0F172A" : "#dc2626" }}>{row.value}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default function LkMarketingSeo({ onBack, initialUrl }: { onBack: () => void; initialUrl?: string }) {
  const { user } = useLkAuth();
  const sessionId = localStorage.getItem("lk_session") || "";
  const [url, setUrl] = useState(initialUrl || "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [history, setHistory] = useState<AnalysisListItem[]>([]);
  const [historyLoading, setHistoryLoading] = useState(true);
  const [energyBalance, setEnergyBalance] = useState<number | null>(null);

  const isRepeat = history.some(h => h.url === url);
  const cost = isRepeat ? ENERGY_REPEAT : (url.replace(/https?:\/\//, "").split("/").length <= 1 ? ENERGY_MAIN : ENERGY_PAGE);

  useEffect(() => {
    if (!user?.salon_id) return;
    fetch(`${SEO_URL}?action=list`, { headers: { "X-Session-Id": sessionId } })
      .then(r => r.json())
      .then(d => setHistory(d.analyses || []))
      .catch(() => {})
      .finally(() => setHistoryLoading(false));
  }, [sessionId, user?.salon_id]);

  // Подставляем сайт из профиля если пустой
  useEffect(() => {
    if (!url && initialUrl) setUrl(initialUrl);
  }, [initialUrl]);

  async function runAnalysis() {
    if (!url.trim()) { setError("Введите URL страницы"); return; }
    setLoading(true);
    setError("");
    try {
      const res = await fetch(SEO_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json", "X-Session-Id": sessionId },
        body: JSON.stringify({ url: url.trim(), is_main_page: !url.includes("/", url.indexOf("//") + 3) }),
      });
      const data = await res.json();
      if (data.error === "no_energy") { setError(`Недостаточно энергии. Нужно ${cost} ⚡`); return; }
      if (data.error === "fetch_error") { setError("Не удалось открыть страницу. Проверьте URL и доступность сайта."); return; }
      if (!res.ok) throw new Error(data.error || "Ошибка анализа");
      setResult(data as AnalysisResult);
      setEnergyBalance(data.energy_balance);
      // Обновляем историю
      setHistory(prev => {
        const filtered = prev.filter(h => h.url !== data.url);
        return [{ id: data.analysis_id, url: data.url, is_main_page: true, status: "done", title: data.page_data.title, score: data.score, energy_spent: data.energy_spent, created_at: new Date().toISOString() }, ...filtered];
      });
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Ошибка анализа");
    } finally { setLoading(false); }
  }

  if (result) {
    return <ReportView result={result} onBack={() => setResult(null)} />;
  }

  return (
    <div>
      <button onClick={onBack} style={{ display: "flex", alignItems: "center", gap: 6, background: "none", border: "none", color: "#64748B", fontSize: 13, fontWeight: 600, cursor: "pointer", padding: 0, marginBottom: 24, fontFamily: "Montserrat,sans-serif" }}>
        <Icon name="ArrowLeft" size={15} /> Назад к маркетингу
      </button>

      {/* Шапка */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
          <div style={{ width: 44, height: 44, borderRadius: 12, background: "#f0f9ff", border: "1.5px solid #bae6fd", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Icon name="Search" size={20} style={{ color: "#0284c7" }} />
          </div>
          <div>
            <h2 style={{ fontSize: 20, fontWeight: 800, color: "#0F172A", margin: 0, letterSpacing: -0.3 }}>SEO-оптимизатор</h2>
            <div style={{ fontSize: 12, color: "#94A3B8" }}>Анализ и улучшение сайта салона</div>
          </div>
        </div>
        <p style={{ fontSize: 13, color: "#64748B", lineHeight: 1.6, margin: 0, maxWidth: 600 }}>
          Введите адрес страницы — ИИ проверит мета-теги, структуру заголовков, текст и выдаст конкретные рекомендации с готовыми вариантами.
        </p>
      </div>

      {/* Цены */}
      <div style={{ display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap" }}>
        {[
          { label: "Главная страница", cost: ENERGY_MAIN },
          { label: "Подстраница", cost: ENERGY_PAGE },
          { label: "Повторный анализ", cost: ENERGY_REPEAT },
        ].map(item => (
          <div key={item.label} style={{ display: "flex", alignItems: "center", gap: 6, padding: "5px 12px", background: "#fff", border: "1.5px solid #E8ECF0", borderRadius: 8 }}>
            <Icon name="Zap" size={12} style={{ color: "#f59e0b" }} />
            <span style={{ fontSize: 12, color: "#64748B" }}>{item.label}:</span>
            <span style={{ fontSize: 12, fontWeight: 700, color: "#0F172A" }}>{item.cost} ⚡</span>
          </div>
        ))}
        {energyBalance !== null && (
          <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "5px 12px", background: "#fffbeb", border: "1.5px solid #fde68a", borderRadius: 8 }}>
            <Icon name="Zap" size={12} style={{ color: "#f59e0b" }} />
            <span style={{ fontSize: 12, fontWeight: 700, color: "#92400e" }}>Баланс: {energyBalance} ⚡</span>
          </div>
        )}
      </div>

      {/* Форма */}
      <div style={{ background: "#fff", borderRadius: 18, border: "1.5px solid #E8ECF0", padding: "24px 24px 20px", marginBottom: 20, boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: "#475569", marginBottom: 8 }}>
          URL страницы для анализа
          {isRepeat && <span style={{ marginLeft: 8, fontSize: 11, color: "#d97706", fontWeight: 700 }}>— повторный анализ ({ENERGY_REPEAT} ⚡)</span>}
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <input
            value={url}
            onChange={e => setUrl(e.target.value)}
            onKeyDown={e => e.key === "Enter" && runAnalysis()}
            placeholder="https://mysalon.ru"
            style={{ flex: 1, padding: "11px 14px", borderRadius: 12, border: "1.5px solid #E2E8F0", fontSize: 14, outline: "none", fontFamily: "Montserrat,sans-serif", color: "#0F172A" }}
          />
          <button
            onClick={runAnalysis}
            disabled={loading || !url.trim()}
            style={{ display: "flex", alignItems: "center", gap: 8, padding: "11px 22px", borderRadius: 12, border: "none", background: loading || !url.trim() ? "#E2E8F0" : "#0284c7", color: loading || !url.trim() ? "#94A3B8" : "#fff", fontSize: 14, fontWeight: 700, cursor: loading || !url.trim() ? "default" : "pointer", fontFamily: "Montserrat,sans-serif", whiteSpace: "nowrap", transition: "background 0.2s" }}
          >
            {loading ? <><Icon name="Loader2" size={15} style={{ animation: "spin 1s linear infinite" }} /> Анализирую...</> : <><Icon name="Search" size={15} /> Запустить · {cost} ⚡</>}
          </button>
        </div>
        {error && (
          <div style={{ marginTop: 10, display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "#dc2626" }}>
            <Icon name="AlertCircle" size={14} />{error}
          </div>
        )}
        <div style={{ marginTop: 8, fontSize: 11, color: "#94A3B8" }}>
          Поддерживаются все сайты с HTML-контентом: Tilda, WordPress, 2ГИС, Яндекс.Бизнес и другие
        </div>
      </div>

      {/* История анализов */}
      {!historyLoading && history.length > 0 && (
        <div>
          <div style={{ fontSize: 12, fontWeight: 700, color: "#94A3B8", textTransform: "uppercase", letterSpacing: 1, marginBottom: 10 }}>История анализов</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {history.map(item => (
              <div
                key={item.id}
                onClick={() => setUrl(item.url)}
                style={{ display: "flex", alignItems: "center", gap: 14, padding: "14px 18px", background: "#fff", border: "1.5px solid #E8ECF0", borderRadius: 14, cursor: "pointer", transition: "all 0.15s" }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = "#bae6fd"; e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.06)"; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = "#E8ECF0"; e.currentTarget.style.boxShadow = "none"; }}
              >
                <div style={{ width: 36, height: 36, borderRadius: 10, background: "#f0f9ff", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <Icon name="Globe" size={16} style={{ color: "#0284c7" }} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: "#0F172A", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{item.title || item.url}</div>
                  <div style={{ fontSize: 11, color: "#94A3B8", marginTop: 2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{item.url}</div>
                </div>
                {item.score != null && <ScoreBadge score={item.score} />}
                <div style={{ display: "flex", alignItems: "center", gap: 5, padding: "5px 12px", background: "#F1F5F9", borderRadius: 8 }}>
                  <Icon name="RefreshCw" size={12} style={{ color: "#64748B" }} />
                  <span style={{ fontSize: 11, fontWeight: 600, color: "#64748B" }}>Обновить</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {historyLoading && (
        <div style={{ textAlign: "center", padding: "30px 0", color: "#94A3B8", fontSize: 13 }}>Загружаю историю...</div>
      )}

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
