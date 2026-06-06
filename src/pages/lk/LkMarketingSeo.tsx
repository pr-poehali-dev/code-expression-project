import { useState, useEffect } from "react";
import Icon from "@/components/ui/icon";
import { useLkAuth } from "@/contexts/LkAuthContext";

const SEO_URL = "https://functions.poehali.dev/3603658f-6f23-4de6-b671-73bb1832b4e0";
const ENERGY_MAIN = 50;
const ENERGY_PAGE = 30;
const ENERGY_REPEAT = 20;
const ACCENT = "#0284c7";
const ACCENT_BG = "#f0f9ff";
const ACCENT_BORDER = "#bae6fd";

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

const cardStyle: React.CSSProperties = {
  background: "#fff",
  borderRadius: 16,
  border: "1.5px solid #E8ECF0",
  boxShadow: "0 1px 4px rgba(15,23,42,0.05)",
};

const labelStyle: React.CSSProperties = {
  fontSize: 11,
  fontWeight: 700,
  color: "#94A3B8",
  textTransform: "uppercase",
  letterSpacing: "0.7px",
};

function ScoreRing({ score }: { score: number }) {
  const color = score >= 70 ? "#16a34a" : score >= 40 ? "#d97706" : "#dc2626";
  const bg = score >= 70 ? "#f0fdf4" : score >= 40 ? "#fffbeb" : "#fef2f2";
  const label = score >= 70 ? "Хорошо" : score >= 40 ? "Средне" : "Плохо";
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4, padding: "16px 24px", background: bg, borderRadius: 16, border: `2px solid ${color}22`, flexShrink: 0 }}>
      <div style={{ fontSize: 40, fontWeight: 900, color, lineHeight: 1 }}>{score}</div>
      <div style={{ fontSize: 11, fontWeight: 700, color, textTransform: "uppercase", letterSpacing: 1 }}>{label}</div>
      <div style={{ fontSize: 10, color: "#94A3B8" }}>из 100</div>
    </div>
  );
}

function StatusChip({ status }: { status: "good" | "warn" | "bad" }) {
  const map = {
    good: { icon: "CheckCircle2", color: "#16a34a", bg: "#f0fdf4", label: "OK" },
    warn: { icon: "AlertTriangle", color: "#d97706", bg: "#fffbeb", label: "Улучшить" },
    bad:  { icon: "XCircle",       color: "#dc2626", bg: "#fef2f2", label: "Ошибка" },
  };
  const m = map[status];
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 4, padding: "3px 8px", background: m.bg, borderRadius: 20, fontSize: 11, fontWeight: 700, color: m.color, flexShrink: 0 }}>
      <Icon name={m.icon} size={11} />
      {m.label}
    </span>
  );
}

function CopyBtn({ text }: { text: string }) {
  const [done, setDone] = useState(false);
  return (
    <button
      onClick={() => { navigator.clipboard.writeText(text); setDone(true); setTimeout(() => setDone(false), 2000); }}
      style={{ display: "inline-flex", alignItems: "center", gap: 4, padding: "4px 10px", borderRadius: 7, border: "1px solid #E2E8F0", background: done ? "#f0fdf4" : "#fff", color: done ? "#16a34a" : "#64748B", fontSize: 11, fontWeight: 600, cursor: "pointer", fontFamily: "Montserrat,sans-serif", transition: "all 0.15s", flexShrink: 0 }}
    >
      <Icon name={done ? "Check" : "Copy"} size={11} />
      {done ? "Скопировано" : "Копировать"}
    </button>
  );
}

function SuggestionBox({ text }: { text: string }) {
  if (!text) return null;
  return (
    <div style={{ background: "#f0fdf4", border: "1px solid #86efac", borderRadius: 10, padding: "12px 14px", marginTop: 10 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
        <span style={{ ...labelStyle, color: "#16a34a" }}>Готовый вариант</span>
        <CopyBtn text={text} />
      </div>
      <div style={{ fontSize: 13, color: "#166534", lineHeight: 1.6 }}>{text}</div>
    </div>
  );
}

function ReportView({ result, onBack }: { result: AnalysisResult; onBack: () => void }) {
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

  const isRepeat = history.some(h => h.url === url.trim());
  const isMain = !url.replace(/https?:\/\/[^/]+/, "").replace(/\?.*/, "").replace(/^\/+$/, "");
  const cost = isRepeat ? ENERGY_REPEAT : isMain ? ENERGY_MAIN : ENERGY_PAGE;

  useEffect(() => {
    if (!user?.salon_id) return;
    fetch(`${SEO_URL}?action=list`, { headers: { "X-Session-Id": sessionId } })
      .then(r => r.json())
      .then(d => setHistory(d.analyses || []))
      .catch(() => {})
      .finally(() => setHistoryLoading(false));
  }, [sessionId, user?.salon_id]);

  useEffect(() => {
    if (!url && initialUrl) setUrl(initialUrl);
  }, [initialUrl]);

  async function runAnalysis() {
    const trimmed = url.trim();
    if (!trimmed) { setError("Введите URL страницы"); return; }
    setLoading(true);
    setError("");
    try {
      const res = await fetch(SEO_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json", "X-Session-Id": sessionId },
        body: JSON.stringify({ url: trimmed, is_main_page: isMain }),
      });
      const data = await res.json();
      if (data.error === "no_energy") { setError(`Недостаточно энергии. Нужно ${cost} ⚡`); return; }
      if (data.error === "fetch_error") { setError("Не удалось открыть страницу. Проверьте URL и доступность сайта."); return; }
      if (!res.ok) throw new Error(data.error || "Ошибка анализа");
      setResult(data as AnalysisResult);
      setEnergyBalance(data.energy_balance);
      setHistory(prev => {
        const filtered = prev.filter(h => h.url !== data.url);
        return [{ id: data.analysis_id, url: data.url, is_main_page: isMain, status: "done", title: data.page_data?.title || "", score: data.score, energy_spent: data.energy_spent, created_at: new Date().toISOString() }, ...filtered];
      });
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Ошибка анализа");
    } finally { setLoading(false); }
  }

  if (result) return <ReportView result={result} onBack={() => setResult(null)} />;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <button onClick={onBack} style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "none", border: "none", color: "#64748B", fontSize: 13, fontWeight: 600, cursor: "pointer", padding: 0, fontFamily: "Montserrat,sans-serif", width: "fit-content" }}>
        <Icon name="ArrowLeft" size={15} /> Назад к маркетингу
      </button>

      {/* Шапка */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 16, flexWrap: "wrap" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{ width: 52, height: 52, borderRadius: 14, background: ACCENT_BG, border: `1.5px solid ${ACCENT_BORDER}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <Icon name="Globe" size={24} style={{ color: ACCENT }} />
          </div>
          <div>
            <h2 style={{ fontSize: 20, fontWeight: 800, color: "#0F172A", margin: "0 0 3px", letterSpacing: -0.3 }}>SEO-оптимизатор</h2>
            <div style={{ fontSize: 12, color: "#94A3B8" }}>Анализ и улучшение сайта салона через ИИ</div>
          </div>
        </div>
        {energyBalance !== null && (
          <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 14px", background: "#fffbeb", border: "1.5px solid #fde68a", borderRadius: 10 }}>
            <Icon name="Zap" size={14} style={{ color: "#f59e0b" }} />
            <span style={{ fontSize: 13, fontWeight: 700, color: "#92400e" }}>Баланс: {energyBalance} ⚡</span>
          </div>
        )}
      </div>

      <p style={{ fontSize: 13, color: "#64748B", margin: 0, lineHeight: 1.7, maxWidth: 600 }}>
        Вставьте адрес страницы — ИИ проверит мета-теги, заголовки и текст, выдаст конкретные правки с готовыми вариантами для копирования.
      </p>

      {/* Стоимость */}
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        {[
          { label: "Главная страница", cost: ENERGY_MAIN, active: isMain && !isRepeat },
          { label: "Подстраница",      cost: ENERGY_PAGE, active: !isMain && !isRepeat },
          { label: "Повторный анализ", cost: ENERGY_REPEAT, active: isRepeat },
        ].map(item => (
          <div key={item.label} style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 12px", background: item.active ? ACCENT_BG : "#F8FAFC", border: `1.5px solid ${item.active ? ACCENT_BORDER : "#E8ECF0"}`, borderRadius: 8, transition: "all 0.2s" }}>
            <Icon name="Zap" size={12} style={{ color: item.active ? ACCENT : "#94A3B8" }} />
            <span style={{ fontSize: 12, color: item.active ? "#0c4a6e" : "#64748B" }}>{item.label}:</span>
            <span style={{ fontSize: 12, fontWeight: 800, color: item.active ? ACCENT : "#0F172A" }}>{item.cost} ⚡</span>
          </div>
        ))}
      </div>

      {/* Форма */}
      <div style={{ ...cardStyle, padding: "20px 22px" }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: "#475569", marginBottom: 10 }}>URL страницы для анализа</div>
        <div style={{ display: "flex", gap: 10, alignItems: "stretch", flexWrap: "wrap" }}>
          <div style={{ flex: 1, minWidth: 220, position: "relative" }}>
            <Icon name="Globe" size={15} style={{ position: "absolute", left: 13, top: "50%", transform: "translateY(-50%)", color: "#94A3B8", pointerEvents: "none" }} />
            <input
              value={url}
              onChange={e => setUrl(e.target.value)}
              onKeyDown={e => e.key === "Enter" && !loading && runAnalysis()}
              placeholder="https://mysalon.ru"
              style={{ width: "100%", padding: "12px 14px 12px 38px", borderRadius: 12, border: "1.5px solid #E2E8F0", fontSize: 13, outline: "none", fontFamily: "Montserrat,sans-serif", color: "#0F172A", boxSizing: "border-box", transition: "border-color 0.2s" }}
              onFocus={e => (e.target.style.borderColor = ACCENT)}
              onBlur={e => (e.target.style.borderColor = "#E2E8F0")}
            />
          </div>
          <button
            onClick={runAnalysis}
            disabled={loading || !url.trim()}
            style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, padding: "12px 22px", borderRadius: 12, border: "none", background: loading || !url.trim() ? "#E2E8F0" : ACCENT, color: loading || !url.trim() ? "#94A3B8" : "#fff", fontSize: 13, fontWeight: 700, cursor: loading || !url.trim() ? "default" : "pointer", fontFamily: "Montserrat,sans-serif", whiteSpace: "nowrap", transition: "background 0.2s", flexShrink: 0 }}
          >
            {loading
              ? <><Icon name="Loader2" size={15} style={{ animation: "spin 1s linear infinite" }} /> Анализирую...</>
              : <><Icon name="Search" size={15} /> Запустить · {cost} ⚡</>
            }
          </button>
        </div>

        {error && (
          <div style={{ marginTop: 10, display: "flex", alignItems: "center", gap: 8, padding: "10px 12px", background: "#fef2f2", border: "1px solid #fca5a5", borderRadius: 8 }}>
            <Icon name="AlertCircle" size={14} style={{ color: "#dc2626", flexShrink: 0 }} />
            <span style={{ fontSize: 13, color: "#dc2626" }}>{error}</span>
          </div>
        )}

        <div style={{ marginTop: 10, fontSize: 11, color: "#94A3B8", display: "flex", alignItems: "center", gap: 5 }}>
          <Icon name="Info" size={11} />
          Работает с Tilda, WordPress, 2ГИС, Яндекс.Бизнес и другими HTML-сайтами
        </div>
      </div>

      {/* История */}
      {!historyLoading && history.length > 0 && (
        <div>
          <div style={{ ...labelStyle, marginBottom: 10 }}>История анализов</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {history.map(item => {
              const sc = item.score;
              const scoreColor = sc >= 70 ? "#16a34a" : sc >= 40 ? "#d97706" : "#dc2626";
              return (
                <div
                  key={item.id}
                  onClick={() => setUrl(item.url)}
                  style={{ ...cardStyle, display: "flex", alignItems: "center", gap: 14, padding: "14px 18px", cursor: "pointer", transition: "all 0.15s" }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = ACCENT_BORDER; e.currentTarget.style.boxShadow = "0 4px 14px rgba(0,0,0,0.06)"; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = "#E8ECF0"; e.currentTarget.style.boxShadow = "0 1px 4px rgba(15,23,42,0.05)"; }}
                >
                  <div style={{ width: 36, height: 36, borderRadius: 10, background: ACCENT_BG, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <Icon name="Globe" size={16} style={{ color: ACCENT }} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: "#0F172A", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{item.title || item.url}</div>
                    <div style={{ fontSize: 11, color: "#94A3B8", marginTop: 2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{item.url}</div>
                  </div>
                  {sc != null && (
                    <div style={{ fontWeight: 800, fontSize: 18, color: scoreColor, minWidth: 48, textAlign: "right" }}>
                      {sc}<span style={{ fontSize: 10, fontWeight: 400, color: "#94A3B8" }}>/100</span>
                    </div>
                  )}
                  <div style={{ display: "flex", alignItems: "center", gap: 5, padding: "5px 10px", background: "#F1F5F9", borderRadius: 8, flexShrink: 0 }}>
                    <Icon name="RefreshCw" size={11} style={{ color: "#64748B" }} />
                    <span style={{ fontSize: 11, fontWeight: 600, color: "#64748B" }}>Обновить</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {historyLoading && (
        <div style={{ textAlign: "center", padding: "24px 0", color: "#94A3B8", fontSize: 13, display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
          <Icon name="Loader2" size={16} style={{ animation: "spin 1s linear infinite" }} />
          Загружаю историю...
        </div>
      )}

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
