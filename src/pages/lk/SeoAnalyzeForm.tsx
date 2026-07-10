import Icon from "@/components/ui/icon";
import { ACCENT, ACCENT_BG, ACCENT_BORDER, AnalysisListItem, cardStyle, labelStyle } from "./SeoTypes";
import { EnergyComplexityNote } from "./LkMarketingShared";

interface Props {
  onBack: () => void;
  url: string;
  setUrl: (v: string) => void;
  loading: boolean;
  error: string;
  energyBalance: number | null;
  isMain: boolean;
  isRepeat: boolean;
  cost: number;
  history: AnalysisListItem[];
  historyLoading: boolean;
  onRunAnalysis: () => void;
}

export default function SeoAnalyzeForm({
  onBack, url, setUrl, loading, error, energyBalance,
  isMain, isRepeat, cost, history, historyLoading, onRunAnalysis,
}: Props) {
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

      <EnergyComplexityNote />

      {/* Форма */}
      <div style={{ ...cardStyle, padding: "20px 22px" }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: "#475569", marginBottom: 10 }}>URL страницы для анализа</div>
        <div style={{ display: "flex", gap: 10, alignItems: "stretch", flexWrap: "wrap" }}>
          <div style={{ flex: 1, minWidth: 220, position: "relative" }}>
            <Icon name="Globe" size={15} style={{ position: "absolute", left: 13, top: "50%", transform: "translateY(-50%)", color: "#94A3B8", pointerEvents: "none" }} />
            <input
              value={url}
              onChange={e => setUrl(e.target.value)}
              onKeyDown={e => e.key === "Enter" && !loading && onRunAnalysis()}
              placeholder="https://mysalon.ru"
              style={{ width: "100%", padding: "12px 14px 12px 38px", borderRadius: 12, border: "1.5px solid #E2E8F0", fontSize: 13, outline: "none", fontFamily: "Montserrat,sans-serif", color: "#0F172A", boxSizing: "border-box", transition: "border-color 0.2s" }}
              onFocus={e => (e.target.style.borderColor = ACCENT)}
              onBlur={e => (e.target.style.borderColor = "#E2E8F0")}
            />
          </div>
          <button
            onClick={onRunAnalysis}
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