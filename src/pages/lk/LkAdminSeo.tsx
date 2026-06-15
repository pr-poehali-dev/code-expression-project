import { useState } from "react";
import Icon from "@/components/ui/icon";
import { ACCENT, ACCENT_BG, ACCENT_BORDER, cardStyle, AnalysisResult } from "./SeoTypes";
import SeoReportView from "./SeoReportView";

const ADMIN_SEO_URL = "https://functions.poehali.dev/ab6ca380-8b84-4708-b715-cb3771fd07d9";
const ADMIN_TOKEN = "Sss07011974ssS";

export default function LkAdminSeo() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<AnalysisResult | null>(null);

  async function runAnalysis() {
    const trimmed = url.trim();
    if (!trimmed) { setError("Введите URL страницы"); return; }
    setLoading(true);
    setError("");
    try {
      const res = await fetch(ADMIN_SEO_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json", "X-Admin-Token": ADMIN_TOKEN },
        body: JSON.stringify({ url: trimmed }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Ошибка анализа");

      // Маппим ответ admin-seo в формат AnalysisResult
      setResult({
        analysis_id: 0,
        url: data.url,
        page_data: {
          ...data.page_data,
          robots_meta: data.page_data?.robots || data.page_data?.robots_meta || "",
        },
        report: {
          ...data.report,
          meta: data.report?.meta_audit ? mapMetaAudit(data.report.meta_audit) : data.report?.meta,
          content_analysis: data.report?.content_audit ? {
            word_count_status: data.report.content_audit.word_count_status,
            word_count_comment: data.report.content_audit.word_count_comment,
            cta_present: data.report.content_audit.cta_present,
            cta_recommendation: data.report.content_audit.cta_comment || "",
            services_mentioned: true,
            services_recommendation: "",
            local_seo: true,
            local_seo_recommendation: "",
          } : data.report?.content_analysis,
          critical: (data.report?.critical || []).map((c: { issue: string; impact?: string; fix?: string; example?: string; recommendation?: string }) => ({
            issue: c.issue,
            recommendation: c.fix || c.recommendation || c.impact || "",
            example: c.example || "",
          })),
          improvements: (data.report?.improvements || []).map((imp: { area: string; current: string; better: string; example?: string; priority?: string }) => ({
            area: imp.area,
            current: imp.current,
            better: imp.better,
            example: imp.example || "",
          })),
        },
        score: data.score,
        energy_spent: 0,
        energy_balance: 0,
      });
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Ошибка анализа");
    } finally { setLoading(false); }
  }

  if (result) return <SeoReportView result={result} onBack={() => setResult(null)} />;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
        <div style={{ width: 52, height: 52, borderRadius: 14, background: ACCENT_BG, border: `1.5px solid ${ACCENT_BORDER}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          <Icon name="Globe" size={24} style={{ color: ACCENT }} />
        </div>
        <div>
          <h2 style={{ fontSize: 20, fontWeight: 800, color: "#0F172A", margin: "0 0 3px", letterSpacing: -0.3 }}>SEO-аудит (Админ)</h2>
          <div style={{ fontSize: 12, color: "#94A3B8" }}>Анализ любого сайта через GPT-4o — без привязки к салону</div>
        </div>
      </div>

      <div style={{ ...cardStyle, padding: "20px 22px" }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: "#475569", marginBottom: 10 }}>URL страницы для анализа</div>
        <div style={{ display: "flex", gap: 10, alignItems: "stretch", flexWrap: "wrap" }}>
          <div style={{ flex: 1, minWidth: 220, position: "relative" }}>
            <Icon name="Globe" size={15} style={{ position: "absolute", left: 13, top: "50%", transform: "translateY(-50%)", color: "#94A3B8", pointerEvents: "none" }} />
            <input
              value={url}
              onChange={e => setUrl(e.target.value)}
              onKeyDown={e => e.key === "Enter" && !loading && runAnalysis()}
              placeholder="https://example.ru/about"
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
              : <><Icon name="Search" size={15} /> Запустить анализ</>
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
          Работает с любым публично доступным сайтом. Энергия не списывается.
        </div>
      </div>
    </div>
  );
}

function mapMetaAudit(meta_audit: Record<string, { status: string; issue: string; suggestion: string }>) {
  const f = (key: string) => meta_audit[key] || {};
  return {
    title_status: f("title").status as "good" | "warn" | "bad",
    title_issue: f("title").issue || "",
    title_suggestion: f("title").suggestion || "",
    description_status: f("description").status as "good" | "warn" | "bad",
    description_issue: f("description").issue || "",
    description_suggestion: f("description").suggestion || "",
    h1_status: f("h1").status as "good" | "warn" | "bad",
    h1_issue: f("h1").issue || "",
    h1_suggestion: f("h1").suggestion || "",
    canonical_status: f("canonical").status as "good" | "warn" | "bad",
    canonical_issue: f("canonical").issue || "",
    canonical_suggestion: f("canonical").suggestion || "",
    og_status: f("og").status as "good" | "warn" | "bad",
    og_issue: f("og").issue || "",
    og_suggestion: f("og").suggestion || "",
    twitter_status: f("twitter").status as "good" | "warn" | "bad",
    twitter_issue: f("twitter").issue || "",
    twitter_suggestion: f("twitter").suggestion || "",
    schema_status: f("schema").status as "good" | "warn" | "bad",
    schema_issue: f("schema").issue || "",
    schema_jsonld: f("schema").suggestion || "",
  };
}