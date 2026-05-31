import { useState } from "react";
import { useLkAuth } from "@/contexts/LkAuthContext";
import Icon from "@/components/ui/icon";

const ACCENT = "hsl(185,85%,32%)";
const ACCENT_DARK = "hsl(185,85%,24%)";
const AI_IMAGE_URL = "https://functions.poehali.dev/4b0ee2e5-a98e-40b8-bb9a-8a11d39d6e5a";

function getSessionId() {
  return localStorage.getItem("lk_session") || "";
}

const ASPECT_OPTIONS = [
  { value: "1024x1024", label: "Квадрат", sub: "1:1 — для постов", icon: "Square" },
  { value: "1024x1792", label: "Портрет", sub: "2:3 — для сторис/рилс", icon: "Smartphone" },
  { value: "1792x1024", label: "Пейзаж", sub: "3:2 — для баннеров", icon: "Monitor" },
];

interface GeneratedImage {
  url: string;
  downloading?: boolean;
}

export default function LkAiImageGen() {
  const { user } = useLkAuth();
  const hasSalon = !!user?.salon_id;

  const [prompt, setPrompt] = useState("");
  const [aspect, setAspect] = useState("1024x1024");
  const [count, setCount] = useState(1);
  const [useSalonCtx, setUseSalonCtx] = useState(hasSalon);
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState<GeneratedImage[]>([]);
  const [error, setError] = useState("");
  const [promptUsed, setPromptUsed] = useState("");

  async function handleGenerate() {
    if (!prompt.trim()) { setError("Введите описание изображения"); return; }
    setLoading(true); setError(""); setImages([]); setPromptUsed("");

    try {
      const res = await fetch(AI_IMAGE_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json", "X-Session-Id": getSessionId() },
        body: JSON.stringify({
          prompt: prompt.trim(),
          aspect_ratio: aspect,
          max_images: count,
          use_salon_context: useSalonCtx,
        }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "Ошибка генерации"); return; }
      setImages((data.images || []).map((img: { url: string }) => ({ url: img.url })));
      setPromptUsed(data.prompt_used || "");
    } catch {
      setError("Ошибка соединения. Попробуйте ещё раз.");
    } finally {
      setLoading(false);
    }
  }

  async function handleDownload(imgUrl: string, idx: number) {
    setImages(prev => prev.map((img, i) => i === idx ? { ...img, downloading: true } : img));
    try {
      const res = await fetch(imgUrl);
      const blob = await res.blob();
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = `pro-dialog-image-${idx + 1}.png`;
      a.click();
      URL.revokeObjectURL(a.href);
    } catch {
      alert("Не удалось скачать изображение");
    } finally {
      setImages(prev => prev.map((img, i) => i === idx ? { ...img, downloading: false } : img));
    }
  }

  const charCount = prompt.length;

  return (
    <div style={{ maxWidth: 720 }}>

      {/* Заголовок */}
      <div style={{ marginBottom: 28 }}>
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
          Создавайте визуалы для постов, сторис и баннеров. Опишите что хотите получить — ИИ нарисует.
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
              <div style={{ fontSize: 11, color: "#aaa" }}>ИИ добавит данные вашего салона (название, аудитория, стиль) к промпту</div>
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
          {/* Подсказки */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 8 }}>
            {["Пост для Instagram", "Баннер с акцией", "Фото команды", "Атмосфера салона"].map(hint => (
              <button key={hint} onClick={() => setPrompt(p => p ? `${p}, ${hint.toLowerCase()}` : hint)} style={{ fontSize: 11, padding: "4px 10px", borderRadius: 20, border: "1px solid #e0e0db", background: "#fff", color: "#777", cursor: "pointer", fontFamily: "Montserrat,sans-serif" }}>
                + {hint}
              </button>
            ))}
          </div>
        </div>

        {/* Размер */}
        <div style={{ marginBottom: 18 }}>
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

        {/* Количество */}
        <div style={{ marginBottom: 20 }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: "#555", marginBottom: 8 }}>Количество изображений</div>
          <div style={{ display: "flex", gap: 8 }}>
            {[1, 2, 3, 4].map(n => (
              <button key={n} onClick={() => setCount(n)} style={{ width: 44, height: 44, borderRadius: 10, border: `1.5px solid ${count === n ? ACCENT : "#e8e8e4"}`, background: count === n ? `hsla(185,85%,32%,0.07)` : "#fff", fontSize: 14, fontWeight: 700, color: count === n ? ACCENT : "#666", cursor: "pointer", fontFamily: "Montserrat,sans-serif" }}>
                {n}
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
          style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, background: loading ? "#aaa" : `linear-gradient(135deg,hsl(40,90%,50%),hsl(30,95%,50%))`, color: "#fff", border: "none", borderRadius: 12, padding: "14px 24px", fontSize: 15, fontWeight: 700, cursor: loading ? "not-allowed" : "pointer", fontFamily: "Montserrat,sans-serif", boxShadow: loading ? "none" : "0 4px 18px hsla(40,90%,50%,0.35)" }}
        >
          {loading
            ? <><Icon name="Loader" size={17} style={{ animation: "spin 1s linear infinite" }} /> Генерирую... это займёт 15–30 сек</>
            : <><Icon name="Sparkles" size={17} /> Сгенерировать {count > 1 ? `${count} изображения` : "изображение"}</>
          }
        </button>
      </div>

      {/* Результат */}
      {images.length > 0 && (
        <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #eee", padding: "20px 22px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: "#1a1a1a" }}>Готово — {images.length} {images.length === 1 ? "изображение" : "изображения"}</div>
            <div style={{ fontSize: 11, color: "#aaa", display: "flex", alignItems: "center", gap: 5 }}>
              <Icon name="Info" size={12} />
              Скачайте до закрытия страницы
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: images.length === 1 ? "1fr" : "repeat(auto-fill,minmax(280px,1fr))", gap: 12 }}>
            {images.map((img, i) => (
              <div key={i} style={{ borderRadius: 12, overflow: "hidden", border: "1px solid #eee", position: "relative" }}>
                <img src={img.url} alt={`Изображение ${i + 1}`} style={{ width: "100%", display: "block" }} />
                <button
                  onClick={() => handleDownload(img.url, i)}
                  disabled={img.downloading}
                  style={{ position: "absolute", bottom: 10, right: 10, display: "flex", alignItems: "center", gap: 6, background: img.downloading ? "rgba(0,0,0,0.5)" : "rgba(0,0,0,0.75)", color: "#fff", border: "none", borderRadius: 8, padding: "8px 14px", fontSize: 12, fontWeight: 700, cursor: img.downloading ? "not-allowed" : "pointer", fontFamily: "Montserrat,sans-serif", backdropFilter: "blur(4px)" }}
                >
                  {img.downloading
                    ? <><Icon name="Loader" size={13} style={{ animation: "spin 1s linear infinite" }} /> Скачиваю...</>
                    : <><Icon name="Download" size={13} /> Скачать</>
                  }
                </button>
              </div>
            ))}
          </div>

          {promptUsed && promptUsed !== prompt && (
            <details style={{ marginTop: 14 }}>
              <summary style={{ fontSize: 11, color: "#bbb", cursor: "pointer" }}>Итоговый промпт (с контекстом салона)</summary>
              <div style={{ fontSize: 11, color: "#999", marginTop: 6, padding: "8px 12px", background: "#f8f8f5", borderRadius: 8, lineHeight: 1.6 }}>{promptUsed}</div>
            </details>
          )}

          <button
            onClick={() => { setImages([]); setPromptUsed(""); }}
            style={{ marginTop: 14, display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "#aaa", background: "none", border: "none", cursor: "pointer", fontFamily: "Montserrat,sans-serif", padding: 0 }}
          >
            <Icon name="RotateCcw" size={13} />
            Новая генерация
          </button>
        </div>
      )}

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}