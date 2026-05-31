import { useState } from "react";
import { useLkAuth } from "@/contexts/LkAuthContext";
import Icon from "@/components/ui/icon";

const ACCENT = "hsl(185,85%,32%)";
const ACCENT_DARK = "hsl(185,85%,24%)";
const AI_IMAGE_URL = "https://functions.poehali.dev/4b0ee2e5-a98e-40b8-bb9a-8a11d39d6e5a";

const ASPECT_OPTIONS = [
  { value: "1024x1024", label: "Квадрат",  sub: "1:1 — для постов",      icon: "Square"    },
  { value: "1024x1792", label: "Портрет",  sub: "2:3 — для сторис/рилс", icon: "Smartphone"},
  { value: "1792x1024", label: "Пейзаж",   sub: "3:2 — для баннеров",    icon: "Monitor"   },
];

export default function LkAiImageGen() {
  const { user } = useLkAuth();
  const hasSalon = !!user?.salon_id;

  const [prompt, setPrompt]         = useState("");
  const [aspect, setAspect]         = useState("1024x1024");
  const [useSalonCtx, setUseSalonCtx] = useState(hasSalon);
  const [loading, setLoading]       = useState(false);
  const [imageUrl, setImageUrl]     = useState<string | null>(null);
  const [downloading, setDownloading] = useState(false);
  const [error, setError]           = useState("");
  const [promptUsed, setPromptUsed] = useState("");

  async function handleGenerate() {
    if (!prompt.trim()) { setError("Введите описание изображения"); return; }
    setLoading(true); setError(""); setImageUrl(null); setPromptUsed("");

    try {
      const res = await fetch(AI_IMAGE_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Session-Id": localStorage.getItem("lk_session") || "",
        },
        body: JSON.stringify({
          prompt: prompt.trim(),
          aspect_ratio: aspect,
          max_images: 1,
          use_salon_context: useSalonCtx,
        }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "Ошибка генерации"); return; }
      const url = data.images?.[0]?.url;
      if (url) {
        setImageUrl(url);
        setPromptUsed(data.prompt_used || "");
        // Автоматически скачиваем
        await triggerDownload(url);
      } else {
        setError("Сервис не вернул изображение. Попробуйте ещё раз.");
      }
    } catch {
      setError("Ошибка соединения. Попробуйте ещё раз.");
    } finally {
      setLoading(false);
    }
  }

  async function triggerDownload(url: string) {
    setDownloading(true);
    try {
      const res = await fetch(url);
      const blob = await res.blob();
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = `pro-dialog-image.png`;
      a.click();
      URL.revokeObjectURL(a.href);
    } catch { /* тихо — пользователь может нажать кнопку вручную */ }
    finally { setDownloading(false); }
  }

  const charCount = prompt.length;

  return (
    <div style={{ maxWidth: 680 }}>

      {/* Заголовок */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
          <div style={{ width: 40, height: 40, borderRadius: 12, background: `linear-gradient(135deg,hsl(40,90%,50%),hsl(30,95%,55%))`, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Icon name="Sparkles" size={20} style={{ color: "#fff" }} />
          </div>
          <div>
            <h2 style={{ fontSize: "clamp(18px,2.5vw,24px)", fontWeight: 700, color: "#1a1a1a", margin: 0 }}>Генерация изображений</h2>
            <div style={{ fontSize: 12, color: "#aaa" }}>GPT Image 1.5 · polza.ai</div>
          </div>
        </div>
        <p style={{ fontSize: 13, color: "#777", margin: 0, lineHeight: 1.6 }}>
          Создавайте визуалы для постов, сторис и баннеров. Изображение скачается автоматически.
        </p>
      </div>

      {/* Форма */}
      <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #eee", padding: "20px 22px", marginBottom: 16 }}>

        {/* Контекст салона */}
        {hasSalon && (
          <div
            onClick={() => setUseSalonCtx(p => !p)}
            style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 14px", borderRadius: 10, background: useSalonCtx ? `hsla(185,85%,32%,0.06)` : "#f8f8f5", border: `1.5px solid ${useSalonCtx ? ACCENT : "#e8e8e4"}`, marginBottom: 18, cursor: "pointer", userSelect: "none" }}
          >
            <div style={{ width: 20, height: 20, borderRadius: 6, border: `2px solid ${useSalonCtx ? ACCENT : "#ccc"}`, background: useSalonCtx ? ACCENT : "transparent", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              {useSalonCtx && <Icon name="Check" size={11} style={{ color: "#fff" }} />}
            </div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 600, color: "#1a1a1a" }}>Учитывать контекст салона</div>
              <div style={{ fontSize: 11, color: "#aaa" }}>ИИ добавит данные вашего салона к промпту</div>
            </div>
          </div>
        )}

        {/* Промпт */}
        <div style={{ marginBottom: 18 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
            <label style={{ fontSize: 12, fontWeight: 700, color: "#555" }}>Описание изображения *</label>
            <span style={{ fontSize: 11, color: charCount > 4800 ? "#e55" : "#bbb" }}>{charCount} / 5000</span>
          </div>
          <textarea
            value={prompt}
            onChange={e => setPrompt(e.target.value)}
            maxLength={5000}
            rows={4}
            placeholder="Опишите что хотите получить. Например: уютный интерьер салона красоты, мягкий свет, цветы на столе, стиль минимализм, пастельные тона"
            style={{ width: "100%", padding: "12px 14px", borderRadius: 10, border: `1.5px solid ${error && !prompt.trim() ? "#fcc" : "#e8e8e4"}`, fontSize: 13, fontFamily: "Montserrat,sans-serif", resize: "vertical", outline: "none", background: "#fafaf8", boxSizing: "border-box", color: "#1a1a1a", lineHeight: 1.6 }}
          />
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 8 }}>
            {["Пост для Instagram", "Баннер с акцией", "Фото команды", "Атмосфера салона"].map(hint => (
              <button key={hint} onClick={() => setPrompt(p => p ? `${p}, ${hint.toLowerCase()}` : hint)} style={{ fontSize: 11, padding: "4px 10px", borderRadius: 20, border: "1px solid #e0e0db", background: "#fff", color: "#777", cursor: "pointer", fontFamily: "Montserrat,sans-serif" }}>
                + {hint}
              </button>
            ))}
          </div>
        </div>

        {/* Формат */}
        <div style={{ marginBottom: 20 }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: "#555", marginBottom: 8 }}>Формат</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 8 }}>
            {ASPECT_OPTIONS.map(opt => (
              <button key={opt.value} onClick={() => setAspect(opt.value)} style={{ padding: "10px 8px", borderRadius: 10, border: `1.5px solid ${aspect === opt.value ? ACCENT : "#e8e8e4"}`, background: aspect === opt.value ? `hsla(185,85%,32%,0.07)` : "#fff", cursor: "pointer", fontFamily: "Montserrat,sans-serif", textAlign: "center" }}>
                <Icon name={opt.icon} size={18} style={{ color: aspect === opt.value ? ACCENT : "#bbb", marginBottom: 4 }} />
                <div style={{ fontSize: 12, fontWeight: 700, color: aspect === opt.value ? ACCENT : "#333" }}>{opt.label}</div>
                <div style={{ fontSize: 10, color: "#aaa" }}>{opt.sub}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Ошибка */}
        {error && (
          <div style={{ background: "#fff0f0", border: "1px solid #fcc", borderRadius: 10, padding: "10px 14px", marginBottom: 14, fontSize: 13, color: "#c33", display: "flex", alignItems: "center", gap: 8 }}>
            <Icon name="AlertCircle" size={14} />
            {error}
          </div>
        )}

        {/* Кнопка */}
        <button
          onClick={handleGenerate}
          disabled={loading}
          style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, background: loading ? "#bbb" : `linear-gradient(135deg,hsl(40,90%,50%),hsl(30,95%,50%))`, color: "#fff", border: "none", borderRadius: 12, padding: "14px 24px", fontSize: 15, fontWeight: 700, cursor: loading ? "not-allowed" : "pointer", fontFamily: "Montserrat,sans-serif", boxShadow: loading ? "none" : "0 4px 18px hsla(40,90%,50%,0.35)" }}
        >
          {loading
            ? <><Icon name="Loader" size={17} style={{ animation: "spin 1s linear infinite" }} /> Генерирую... до 3 минут</>
            : <><Icon name="Sparkles" size={17} /> Сгенерировать и скачать</>
          }
        </button>
      </div>

      {/* Результат */}
      {imageUrl && (
        <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #eee", padding: "20px 22px" }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: "#1a1a1a", marginBottom: 12, display: "flex", alignItems: "center", gap: 8 }}>
            <Icon name="CheckCircle" size={15} style={{ color: "hsl(145,60%,40%)" }} />
            Изображение готово
          </div>

          <div style={{ borderRadius: 12, overflow: "hidden", border: "1px solid #eee", marginBottom: 14 }}>
            <img src={imageUrl} alt="Результат" style={{ width: "100%", display: "block" }} />
          </div>

          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <button
              onClick={() => triggerDownload(imageUrl)}
              disabled={downloading}
              style={{ display: "flex", alignItems: "center", gap: 7, background: downloading ? "#bbb" : `linear-gradient(135deg,${ACCENT},${ACCENT_DARK})`, color: "#fff", border: "none", borderRadius: 10, padding: "11px 20px", fontSize: 13, fontWeight: 700, cursor: downloading ? "not-allowed" : "pointer", fontFamily: "Montserrat,sans-serif" }}
            >
              {downloading
                ? <><Icon name="Loader" size={14} style={{ animation: "spin 1s linear infinite" }} /> Скачиваю...</>
                : <><Icon name="Download" size={14} /> Скачать ещё раз</>
              }
            </button>
            <button
              onClick={() => { setImageUrl(null); setPromptUsed(""); }}
              style={{ display: "flex", alignItems: "center", gap: 7, background: "#f5f5f2", color: "#666", border: "none", borderRadius: 10, padding: "11px 20px", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "Montserrat,sans-serif" }}
            >
              <Icon name="RotateCcw" size={14} />
              Новая генерация
            </button>
          </div>

          {promptUsed && promptUsed !== prompt && (
            <details style={{ marginTop: 14 }}>
              <summary style={{ fontSize: 11, color: "#ccc", cursor: "pointer" }}>Итоговый промпт</summary>
              <div style={{ fontSize: 11, color: "#999", marginTop: 6, padding: "8px 12px", background: "#f8f8f5", borderRadius: 8, lineHeight: 1.6 }}>{promptUsed}</div>
            </details>
          )}
        </div>
      )}

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}