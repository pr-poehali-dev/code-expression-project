import { useState, useEffect } from "react";
import { useLkAuth } from "@/contexts/LkAuthContext";
import { SEO_URL, ENERGY_MAIN, ENERGY_PAGE, ENERGY_REPEAT, AnalysisResult, AnalysisListItem } from "./SeoTypes";
import SeoAnalyzeForm from "./SeoAnalyzeForm";
import SeoReportView from "./SeoReportView";

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

  if (result) return <SeoReportView result={result} onBack={() => setResult(null)} />;

  return (
    <SeoAnalyzeForm
      onBack={onBack}
      url={url}
      setUrl={setUrl}
      loading={loading}
      error={error}
      energyBalance={energyBalance}
      isMain={isMain}
      isRepeat={isRepeat}
      cost={cost}
      history={history}
      historyLoading={historyLoading}
      onRunAnalysis={runAnalysis}
    />
  );
}
