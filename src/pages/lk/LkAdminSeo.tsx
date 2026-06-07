import { useState } from "react";
import Icon from "@/components/ui/icon";
import { ACCENT } from "./LkAdminShared";
import { ADMIN_SEO_URL, ADMIN_TOKEN, AnalysisResult, HistoryItem } from "./SeoTypes";
import { ReportView } from "./SeoReportTabs";
import { SeoHistory } from "./SeoHistory";

export function SeoSection() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>(() => {
    try { return JSON.parse(localStorage.getItem("admin_seo_history_v2") || "[]"); } catch { return []; }
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
      const analysisResult = data as AnalysisResult;
      setResult(analysisResult);
      const newHistory: HistoryItem[] = [
        { url: data.url, score: data.score, grade: data.grade, ts: Date.now(), result: analysisResult },
        ...history.filter(h => h.url !== data.url),
      ].slice(0, 10);
      setHistory(newHistory);
      try { localStorage.setItem("admin_seo_history_v2", JSON.stringify(newHistory)); } catch { /* ignore */ }
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

      <SeoHistory
        history={history}
        onOpen={r => setResult(r)}
        onRepeat={u => setUrl(u)}
      />
    </div>
  );
}
