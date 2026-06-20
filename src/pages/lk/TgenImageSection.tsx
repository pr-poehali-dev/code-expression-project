import { useState } from "react";
import Icon from "@/components/ui/icon";
import { ACCENT, Spinner, actionBtn, inputStyle, labelStyle } from "./LkAdminShared";

const AI_IMAGE_URL = "https://functions.poehali.dev/4b0ee2e5-a98e-40b8-bb9a-8a11d39d6e5a";
// ADMIN_IMAGE_TOKEN kept for reference but auth goes via session
const _ADMIN_IMAGE_TOKEN = "Sss07011974ssS"; void _ADMIN_IMAGE_TOKEN;

const ASPECT_OPTIONS = [
  { value: "1024x1024", label: "Квадрат", sub: "1:1",  icon: "Square"     },
  { value: "1024x1792", label: "Портрет", sub: "2:3",  icon: "Smartphone" },
  { value: "1792x1024", label: "Пейзаж",  sub: "3:2",  icon: "Monitor"    },
];

interface HistoryItem {
  id: number; url: string; prompt: string; aspect_ratio: string; created_at: string;
}

function sid() { return localStorage.getItem("lk_session") || ""; }

async function triggerDownload(url: string) {
  try {
    const res = await fetch(url);
    const blob = await res.blob();
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "training-image.png";
    a.click();
    URL.revokeObjectURL(a.href);
  } catch {
    const a = document.createElement("a");
    a.href = url; a.target = "_blank"; a.click();
  }
}

export function TrainingImageGenSection() {
  const [prompt, setPrompt]       = useState("");
  const [aspect, setAspect]       = useState("1024x1024");
  const [loading, setLoading]     = useState(false);
  const [imageUrl, setImageUrl]   = useState<string | null>(null);
  const [error, setError]         = useState("");
  const [history, setHistory]     = useState<HistoryItem[]>([]);
  const [histLoading, setHistLoading] = useState(false);
  const [histLoaded, setHistLoaded]   = useState(false);
  const [downloading, setDownloading] = useState(false);

  const loadHistory = () => {
    setHistLoading(true);
    fetch(AI_IMAGE_URL, { headers: { "X-Session-Id": sid() } })
      .then(r => r.json())
      .then(d => { if (Array.isArray(d)) setHistory(d); })
      .finally(() => { setHistLoading(false); setHistLoaded(true); });
  };

  const handleGenerate = async () => {
    if (!prompt.trim()) { setError("Введи описание изображения"); return; }
    setLoading(true); setError(""); setImageUrl(null);
    try {
      const res = await fetch(AI_IMAGE_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json", "X-Session-Id": sid() },
        body: JSON.stringify({ prompt: prompt.trim(), aspect_ratio: aspect }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "Ошибка генерации"); return; }
      const url = data.images?.[0]?.url;
      if (url) {
        setImageUrl(url);
        loadHistory();
        setDownloading(true);
        triggerDownload(url).finally(() => setDownloading(false));
      } else {
        setError("Изображение не вернулось. Проверь историю ниже.");
        loadHistory();
      }
    } catch {
      setError("Долгий ответ. Изображение могло сохраниться — проверь историю.");
      loadHistory();
    } finally {
      setLoading(false);
    }
  };

  const card: React.CSSProperties = {
    background: "#fff", borderRadius: 14, border: "1.5px solid #e8e8e4",
    padding: "24px 28px", marginBottom: 16,
  };

  return (
    <div>
      <div style={{ marginBottom: 20 }}>
        <h2 style={{ fontFamily: "Cormorant, serif", fontSize: 26, fontWeight: 700, color: "#1a1a1a", margin: "0 0 4px" }}>Генератор изображений</h2>
        <p style={{ margin: 0, fontSize: 13, color: "#64748b" }}>Опиши задачу из тренинга — ИИ создаст иллюстрацию, схему или инфографику. Хранится 6 дней.</p>
      </div>

      <div style={card}>
        {loading && (
          <div style={{ background: "hsl(0,90%,97%)", border: "1.5px solid hsl(0,80%,85%)", borderRadius: 10, padding: "12px 16px", marginBottom: 16, display: "flex", alignItems: "flex-start", gap: 10 }}>
            <Icon name="AlertTriangle" size={16} style={{ color: "hsl(0,75%,55%)", flexShrink: 0, marginTop: 1 }} />
            <div style={{ fontSize: 12, color: "hsl(0,65%,40%)", lineHeight: 1.5 }}>
              <strong>Не закрывай страницу!</strong> Генерация идёт 1–3 минуты.
            </div>
          </div>
        )}

        <div style={{ marginBottom: 16 }}>
          <label style={labelStyle}>Описание изображения</label>
          <textarea
            value={prompt}
            onChange={e => setPrompt(e.target.value)}
            disabled={loading}
            rows={4}
            placeholder="Например: инфографика «5 шагов к закрытию сделки», схема воронки продаж, иллюстрация доверия между клиентом и мастером..."
            style={{ ...inputStyle, resize: "vertical", fontSize: 13, lineHeight: 1.7 }}
          />
        </div>

        <div style={{ marginBottom: 20 }}>
          <label style={labelStyle}>Формат</label>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 8 }}>
            {ASPECT_OPTIONS.map(opt => (
              <button
                key={opt.value}
                onClick={() => !loading && setAspect(opt.value)}
                style={{
                  padding: "10px 8px", borderRadius: 10, textAlign: "center",
                  border: `1.5px solid ${aspect === opt.value ? ACCENT : "#e2e8f0"}`,
                  background: aspect === opt.value ? `hsla(185,85%,32%,0.07)` : "#fff",
                  cursor: loading ? "default" : "pointer", fontFamily: "Montserrat,sans-serif",
                }}
              >
                <Icon name={opt.icon} size={16} style={{ color: aspect === opt.value ? ACCENT : "#bbb", display: "block", margin: "0 auto 4px" }} />
                <div style={{ fontSize: 12, fontWeight: 700, color: aspect === opt.value ? ACCENT : "#333" }}>{opt.label}</div>
                <div style={{ fontSize: 10, color: "#aaa" }}>{opt.sub}</div>
              </button>
            ))}
          </div>
        </div>

        {error && (
          <div style={{ background: "hsl(0,70%,97%)", border: "1.5px solid hsl(0,70%,85%)", borderRadius: 10, padding: "11px 14px", marginBottom: 14, fontSize: 13, color: "hsl(0,70%,40%)", fontWeight: 600 }}>
            {error}
          </div>
        )}

        <button
          onClick={handleGenerate}
          disabled={loading || !prompt.trim()}
          style={{
            ...actionBtn(loading || !prompt.trim() ? "#ccc" : "hsl(40,90%,48%)"),
            width: "100%", justifyContent: "center", padding: "14px", fontSize: 14,
            boxShadow: loading || !prompt.trim() ? "none" : "0 4px 18px hsla(40,90%,50%,0.3)",
          }}
        >
          <Icon name={loading ? "Loader" : "Sparkles"} size={16} style={loading ? { animation: "spin 1s linear infinite" } : {}} />
          {loading ? "Генерирую... подождите" : "Сгенерировать и скачать"}
        </button>
      </div>

      {imageUrl && (
        <div style={card}>
          <div style={{ fontSize: 13, fontWeight: 700, color: "#1a1a1a", marginBottom: 12, display: "flex", alignItems: "center", gap: 8 }}>
            <Icon name="CheckCircle" size={15} style={{ color: "hsl(145,60%,40%)" }} /> Изображение готово
          </div>
          <div style={{ borderRadius: 12, overflow: "hidden", border: "1.5px solid #e8e8e4", marginBottom: 14 }}>
            <img src={imageUrl} alt="Результат" style={{ width: "100%", display: "block" }} />
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <button
              onClick={() => { setDownloading(true); triggerDownload(imageUrl).finally(() => setDownloading(false)); }}
              disabled={downloading}
              style={{ ...actionBtn(ACCENT) }}
            >
              <Icon name={downloading ? "Loader" : "Download"} size={14} />
              {downloading ? "Скачиваю..." : "Скачать ещё раз"}
            </button>
            <button onClick={() => { setImageUrl(null); setPrompt(""); setError(""); }} style={{ ...actionBtn("#64748b") }}>
              <Icon name="RotateCcw" size={14} /> Новое изображение
            </button>
          </div>
        </div>
      )}

      {/* История */}
      <div style={{ ...card, marginBottom: 0 }}>
        <button
          onClick={() => { if (!histLoaded) loadHistory(); setHistLoaded(v => !v); }}
          style={{ display: "flex", alignItems: "center", gap: 8, background: "none", border: "none", cursor: "pointer", padding: 0, width: "100%" }}
        >
          <Icon name="Clock" size={15} style={{ color: ACCENT }} />
          <span style={{ flex: 1, fontSize: 14, fontWeight: 700, color: "#1a1a1a", textAlign: "left" }}>
            Мои изображения {history.length > 0 && `(${history.length})`}
          </span>
          <Icon name={histLoaded ? "ChevronUp" : "ChevronDown"} size={15} style={{ color: "#aaa" }} />
        </button>

        {histLoaded && (
          <div style={{ marginTop: 16 }}>
            {histLoading ? (
              <div style={{ textAlign: "center", padding: "20px 0" }}><Spinner /></div>
            ) : history.length === 0 ? (
              <div style={{ textAlign: "center", padding: "20px 0", fontSize: 13, color: "#aaa" }}>Изображений пока нет</div>
            ) : (
              <>
                <div style={{ fontSize: 12, color: "#aaa", marginBottom: 12 }}>Хранятся 6 дней. Нажми для скачивания.</div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: 10 }}>
                  {history.map(item => (
                    <div key={item.id} style={{ borderRadius: 10, overflow: "hidden", border: "1.5px solid #e8e8e4" }}>
                      <img
                        src={item.url} alt=""
                        style={{ width: "100%", display: "block", aspectRatio: item.aspect_ratio === "1024x1792" ? "2/3" : item.aspect_ratio === "1792x1024" ? "3/2" : "1/1", objectFit: "cover" }}
                      />
                      <div style={{ padding: "8px 10px" }}>
                        <button
                          onClick={() => triggerDownload(item.url)}
                          style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 5, background: `hsla(185,85%,32%,0.08)`, border: "none", borderRadius: 7, padding: "6px 8px", cursor: "pointer", color: ACCENT, fontSize: 11, fontWeight: 700, fontFamily: "Montserrat,sans-serif" }}
                        >
                          <Icon name="Download" size={12} /> Скачать
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        )}
      </div>

      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );
}
