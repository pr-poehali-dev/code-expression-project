import { useState } from "react";
import { useLkAuth } from "@/contexts/LkAuthContext";
import Icon from "@/components/ui/icon";

const ACCENT = "hsl(185,85%,32%)";
const ACCENT_DARK = "hsl(185,85%,24%)";
const LK_URL = "https://functions.poehali.dev/1c0ad024-179b-4644-9621-377174bbeba3";
const AI_IMAGE_URL = "https://functions.poehali.dev/4b0ee2e5-a98e-40b8-bb9a-8a11d39d6e5a";

function sid() { return localStorage.getItem("lk_session") || ""; }

const TONE_OPTIONS = ["Динамичный", "Душевный", "Экспертный", "Юмористический", "Вдохновляющий"];
const GOAL_OPTIONS = ["Привлечь клиентов", "Показать услугу", "Повысить доверие", "Анонс акции", "Набрать подписчиков"];
const ASPECT_OPTIONS = [
  { value: "1024x1792", label: "Рилс", sub: "9:16 вертикальный", icon: "Smartphone" },
  { value: "1024x1024", label: "Пост", sub: "1:1 квадрат", icon: "Square" },
];

type Step = "input" | "ideas" | "script";

const inp: React.CSSProperties = {
  width: "100%", padding: "10px 13px", borderRadius: 10, border: "1.5px solid #e8e8e4",
  fontSize: 13, fontFamily: "Montserrat,sans-serif", background: "#fafaf8",
  boxSizing: "border-box", color: "#1a1a1a", outline: "none",
};

export default function LkReelScript() {
  const { user } = useLkAuth();
  const hasSalon = !!user?.salon_id;

  const [service, setService] = useState("");
  const [goal, setGoal] = useState("");
  const [tone, setTone] = useState("");

  const [ideas, setIdeas] = useState<string[]>([]);
  const [selectedIdea, setSelectedIdea] = useState("");

  const [script, setScript] = useState("");
  const [imagePrompt, setImagePrompt] = useState("");
  const [aspect, setAspect] = useState("1024x1792");
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  const [step, setStep] = useState<Step>("input");
  const [loading, setLoading] = useState(false);
  const [imgLoading, setImgLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleGenerateIdeas() {
    if (!service.trim()) { setError("Введите услугу или тему"); return; }
    setLoading(true); setError("");
    try {
      const res = await fetch(`${LK_URL}?action=reel_ideas`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "X-Session-Id": sid() },
        body: JSON.stringify({ service, goal, tone }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "Ошибка генерации"); return; }
      setIdeas(data.ideas || []);
      setStep("ideas");
    } catch { setError("Ошибка соединения. Попробуйте ещё раз."); }
    finally { setLoading(false); }
  }

  async function handleSelectIdea(idea: string) {
    setSelectedIdea(idea);
    setLoading(true); setError(""); setScript(""); setImageUrl(null);
    try {
      const res = await fetch(`${LK_URL}?action=reel_script`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "X-Session-Id": sid() },
        body: JSON.stringify({ idea, service, goal, tone }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "Ошибка генерации сценария"); setStep("ideas"); return; }
      setScript(data.script || "");
      setImagePrompt(data.image_prompt || "");
      setStep("script");
    } catch { setError("Ошибка соединения."); setStep("ideas"); }
    finally { setLoading(false); }
  }

  async function handleGeneratePreview() {
    setImgLoading(true); setImageUrl(null);
    try {
      const res = await fetch(AI_IMAGE_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json", "X-Session-Id": sid() },
        body: JSON.stringify({ prompt: imagePrompt, aspect_ratio: aspect, max_images: 1 }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "Ошибка генерации картинки"); return; }
      setImageUrl(data.images?.[0]?.url || null);
    } catch { setError("Ошибка генерации картинки."); }
    finally { setImgLoading(false); }
  }

  async function handleDownload() {
    if (!imageUrl) return;
    const res = await fetch(imageUrl);
    const blob = await res.blob();
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "reel-preview.png";
    a.click();
    URL.revokeObjectURL(a.href);
  }

  function copyScript() { navigator.clipboard.writeText(script); }

  function reset() {
    setStep("input"); setIdeas([]); setSelectedIdea("");
    setScript(""); setImageUrl(null); setError("");
  }

  return (
    <div style={{ maxWidth: 680 }}>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>

      {/* Заголовок */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
          <div style={{ width: 40, height: 40, borderRadius: 12, background: `linear-gradient(135deg,hsl(335,80%,50%),hsl(310,70%,50%))`, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Icon name="Video" size={20} style={{ color: "#fff" }} />
          </div>
          <h2 style={{ fontSize: "clamp(18px,2.5vw,24px)", fontWeight: 700, color: "#1a1a1a", margin: 0 }}>Сценарий для рилса</h2>
        </div>
        <p style={{ fontSize: 13, color: "#777", margin: 0, lineHeight: 1.6 }}>
          Выберите идею — ИИ напишет покадровый сценарий и обложку для вашего рилса.
        </p>
      </div>

      {/* Прогресс */}
      <div style={{ display: "flex", gap: 0, marginBottom: 24, background: "#f5f5f2", borderRadius: 12, padding: 4 }}>
        {[
          { id: "input", label: "1. Тема" },
          { id: "ideas", label: "2. Идея" },
          { id: "script", label: "3. Сценарий" },
        ].map((s) => {
          const steps = ["input", "ideas", "script"];
          const current = steps.indexOf(step);
          const idx = steps.indexOf(s.id);
          const active = s.id === step;
          const done = idx < current;
          return (
            <div key={s.id} onClick={() => done && setStep(s.id as Step)}
              style={{ flex: 1, padding: "8px 0", borderRadius: 9, textAlign: "center", fontSize: 12, fontWeight: active ? 700 : 500, background: active ? "#fff" : "transparent", color: active ? "hsl(335,80%,50%)" : done ? "#888" : "#bbb", cursor: done ? "pointer" : "default", transition: "all 0.2s", boxShadow: active ? "0 1px 4px rgba(0,0,0,0.08)" : "none" }}
            >
              {s.label}
            </div>
          );
        })}
      </div>

      {error && (
        <div style={{ background: "#fff0f0", border: "1px solid #fcc", borderRadius: 10, padding: "10px 14px", marginBottom: 14, fontSize: 13, color: "#c33", display: "flex", alignItems: "center", gap: 8 }}>
          <Icon name="AlertCircle" size={14} />
          {error}
          <button onClick={() => setError("")} style={{ marginLeft: "auto", background: "none", border: "none", cursor: "pointer", color: "#c33" }}>✕</button>
        </div>
      )}

      {/* ── Шаг 1: Вводные ── */}
      {step === "input" && (
        <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #eee", padding: "22px 22px 20px" }}>
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: "#555", marginBottom: 6 }}>Услуга или тема *</label>
            <input style={inp} value={service} onChange={e => setService(e.target.value)} placeholder="Например: маникюр, массаж спины, уход за лицом" />
          </div>

          <div style={{ marginBottom: 16 }}>
            <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: "#555", marginBottom: 8 }}>Цель рилса</label>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {GOAL_OPTIONS.map(g => (
                <button key={g} onClick={() => setGoal(goal === g ? "" : g)} style={{ fontSize: 12, padding: "6px 12px", borderRadius: 20, border: `1.5px solid ${goal === g ? "hsl(335,80%,50%)" : "#e0e0db"}`, background: goal === g ? `hsla(335,80%,50%,0.08)` : "#fff", color: goal === g ? "hsl(335,80%,50%)" : "#666", fontWeight: goal === g ? 700 : 400, cursor: "pointer", fontFamily: "Montserrat,sans-serif" }}>
                  {g}
                </button>
              ))}
            </div>
          </div>

          <div style={{ marginBottom: 22 }}>
            <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: "#555", marginBottom: 8 }}>Стиль</label>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {TONE_OPTIONS.map(t => (
                <button key={t} onClick={() => setTone(tone === t ? "" : t)} style={{ fontSize: 12, padding: "6px 12px", borderRadius: 20, border: `1.5px solid ${tone === t ? "hsl(335,80%,50%)" : "#e0e0db"}`, background: tone === t ? `hsla(335,80%,50%,0.08)` : "#fff", color: tone === t ? "hsl(335,80%,50%)" : "#666", fontWeight: tone === t ? 700 : 400, cursor: "pointer", fontFamily: "Montserrat,sans-serif" }}>
                  {t}
                </button>
              ))}
            </div>
          </div>

          {hasSalon && (
            <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 14px", background: `hsla(185,85%,32%,0.05)`, borderRadius: 10, marginBottom: 18, border: `1px solid hsla(185,85%,32%,0.12)` }}>
              <Icon name="Info" size={13} style={{ color: ACCENT, flexShrink: 0 }} />
              <div style={{ fontSize: 12, color: "#666" }}>Данные вашего салона будут учтены автоматически</div>
            </div>
          )}

          <button onClick={handleGenerateIdeas} disabled={loading} style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, background: loading ? "#bbb" : `linear-gradient(135deg,hsl(335,80%,50%),hsl(310,70%,50%))`, color: "#fff", border: "none", borderRadius: 12, padding: "14px 24px", fontSize: 14, fontWeight: 700, cursor: loading ? "not-allowed" : "pointer", fontFamily: "Montserrat,sans-serif" }}>
            {loading
              ? <><Icon name="Loader" size={16} style={{ animation: "spin 1s linear infinite" }} /> Генерирую идеи...</>
              : <><Icon name="Sparkles" size={16} /> Придумать идеи для рилса</>
            }
          </button>
        </div>
      )}

      {/* ── Шаг 2: Выбор идеи ── */}
      {step === "ideas" && (
        <div>
          <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #eee", padding: "20px 22px", marginBottom: 14 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: "#1a1a1a", marginBottom: 4 }}>Выберите идею</div>
            <div style={{ fontSize: 12, color: "#aaa", marginBottom: 16 }}>Нажмите — ИИ напишет полный покадровый сценарий</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {ideas.map((idea, i) => (
                <button key={i} onClick={() => handleSelectIdea(idea)} disabled={loading}
                  style={{ textAlign: "left", padding: "14px 16px", borderRadius: 12, border: "1.5px solid #e8e8e4", background: "#fff", fontSize: 13, fontWeight: 600, color: "#1a1a1a", cursor: loading ? "not-allowed" : "pointer", fontFamily: "Montserrat,sans-serif", display: "flex", alignItems: "center", gap: 12, transition: "all 0.15s" }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = "hsl(335,80%,50%)"; e.currentTarget.style.background = `hsla(335,80%,50%,0.04)`; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = "#e8e8e4"; e.currentTarget.style.background = "#fff"; }}
                >
                  <div style={{ width: 26, height: 26, borderRadius: 8, background: `hsla(335,80%,50%,0.1)`, color: "hsl(335,80%,50%)", fontSize: 12, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{i + 1}</div>
                  <span style={{ flex: 1 }}>{idea}</span>
                  {loading && selectedIdea === idea
                    ? <Icon name="Loader" size={15} style={{ color: "hsl(335,80%,50%)", animation: "spin 1s linear infinite" }} />
                    : <Icon name="ChevronRight" size={15} style={{ color: "#ccc" }} />
                  }
                </button>
              ))}
            </div>
          </div>
          <button onClick={() => setStep("input")} style={{ display: "flex", alignItems: "center", gap: 7, background: "none", border: "none", color: "#aaa", fontSize: 13, cursor: "pointer", fontFamily: "Montserrat,sans-serif", padding: 0 }}>
            <Icon name="ArrowLeft" size={14} />
            Изменить тему
          </button>
        </div>
      )}

      {/* ── Шаг 3: Сценарий + превью ── */}
      {step === "script" && (
        <div>
          {/* Сценарий */}
          <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #eee", padding: "20px 22px", marginBottom: 14 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
              <div>
                <div style={{ fontSize: 13, fontWeight: 700, color: "#1a1a1a" }}>Сценарий рилса</div>
                <div style={{ fontSize: 11, color: "#aaa", marginTop: 2 }}>{selectedIdea}</div>
              </div>
              <button onClick={copyScript} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, fontWeight: 600, color: ACCENT, background: `hsla(185,85%,32%,0.08)`, border: "none", borderRadius: 8, padding: "6px 12px", cursor: "pointer", fontFamily: "Montserrat,sans-serif" }}>
                <Icon name="Copy" size={13} />
                Копировать
              </button>
            </div>
            <textarea value={script} onChange={e => setScript(e.target.value)} rows={16}
              style={{ ...inp, resize: "vertical", lineHeight: 1.8, fontSize: 12 }} />
          </div>

          {/* Превью */}
          <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #eee", padding: "20px 22px", marginBottom: 14 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: "#1a1a1a", marginBottom: 14 }}>Обложка рилса</div>

            <div style={{ marginBottom: 14 }}>
              <label style={{ display: "block", fontSize: 11, fontWeight: 600, color: "#aaa", marginBottom: 6 }}>Описание обложки</label>
              <textarea value={imagePrompt} onChange={e => setImagePrompt(e.target.value)} rows={2} style={{ ...inp, resize: "none" }} />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 16 }}>
              {ASPECT_OPTIONS.map(opt => (
                <button key={opt.value} onClick={() => setAspect(opt.value)} style={{ padding: "10px 8px", borderRadius: 10, border: `1.5px solid ${aspect === opt.value ? "hsl(335,80%,50%)" : "#e8e8e4"}`, background: aspect === opt.value ? `hsla(335,80%,50%,0.07)` : "#fff", cursor: "pointer", fontFamily: "Montserrat,sans-serif", textAlign: "center" }}>
                  <Icon name={opt.icon} size={18} style={{ color: aspect === opt.value ? "hsl(335,80%,50%)" : "#bbb", marginBottom: 3 }} />
                  <div style={{ fontSize: 12, fontWeight: 700, color: aspect === opt.value ? "hsl(335,80%,50%)" : "#333" }}>{opt.label}</div>
                  <div style={{ fontSize: 10, color: "#aaa" }}>{opt.sub}</div>
                </button>
              ))}
            </div>

            <button onClick={handleGeneratePreview} disabled={imgLoading} style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, background: imgLoading ? "#bbb" : `linear-gradient(135deg,hsl(40,90%,50%),hsl(30,95%,50%))`, color: "#fff", border: "none", borderRadius: 10, padding: "12px 20px", fontSize: 13, fontWeight: 700, cursor: imgLoading ? "not-allowed" : "pointer", fontFamily: "Montserrat,sans-serif" }}>
              {imgLoading
                ? <><Icon name="Loader" size={15} style={{ animation: "spin 1s linear infinite" }} /> Генерирую... до 3 минут</>
                : <><Icon name="Image" size={15} /> Сгенерировать обложку</>
              }
            </button>

            {imageUrl && (
              <div style={{ marginTop: 14 }}>
                <img src={imageUrl} alt="Обложка рилса" style={{ width: "100%", borderRadius: 12, display: "block" }} />
                <button onClick={handleDownload} style={{ marginTop: 10, display: "flex", alignItems: "center", gap: 7, background: `linear-gradient(135deg,${ACCENT},${ACCENT_DARK})`, color: "#fff", border: "none", borderRadius: 10, padding: "10px 18px", fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "Montserrat,sans-serif" }}>
                  <Icon name="Download" size={14} />
                  Скачать обложку
                </button>
              </div>
            )}
          </div>

          <div style={{ display: "flex", gap: 10 }}>
            <button onClick={() => setStep("ideas")} style={{ display: "flex", alignItems: "center", gap: 7, background: "#f5f5f2", color: "#666", border: "none", borderRadius: 10, padding: "11px 18px", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "Montserrat,sans-serif" }}>
              <Icon name="ArrowLeft" size={14} />
              Другая идея
            </button>
            <button onClick={reset} style={{ display: "flex", alignItems: "center", gap: 7, background: "#f5f5f2", color: "#666", border: "none", borderRadius: 10, padding: "11px 18px", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "Montserrat,sans-serif" }}>
              <Icon name="RotateCcw" size={14} />
              Новый сценарий
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
