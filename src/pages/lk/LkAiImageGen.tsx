import { useState, useEffect, useRef } from "react";
import { useLkAuth } from "@/contexts/LkAuthContext";
import { useEnergy } from "@/contexts/EnergyContext";
import Icon from "@/components/ui/icon";

const ACCENT = "hsl(185,85%,32%)";
const ACCENT_DARK = "hsl(185,85%,24%)";

const IMAGE_START_URL  = "https://functions.poehali.dev/c5ff1cc7-1732-48f7-a184-b6aa078d47e2";
const IMAGE_WORKER_URL = "https://functions.poehali.dev/29d21b9b-d07b-4dba-8139-a9f5d903a583";
const AI_IMAGE_URL     = "https://functions.poehali.dev/4b0ee2e5-a98e-40b8-bb9a-8a11d39d6e5a"; // история

const ASPECT_OPTIONS = [
  { value: "1024x1024", label: "Квадрат",  sub: "1:1 — для постов",      icon: "Square"     },
  { value: "1024x1792", label: "Портрет",  sub: "2:3 — для сторис/рилс", icon: "Smartphone" },
  { value: "1792x1024", label: "Пейзаж",   sub: "3:2 — для баннеров",    icon: "Monitor"    },
];

const POLL_INTERVAL_MS = 4000;  // опрос каждые 4 сек
const POLL_MAX_TRIES   = 75;    // максимум 75 × 4с = 5 минут

function sid() { return localStorage.getItem("lk_session") || ""; }

interface HistoryItem {
  id: number; url: string; prompt: string; aspect_ratio: string; created_at: string;
}

type GenStatus = "idle" | "starting" | "waiting" | "done" | "error";

export default function LkAiImageGen() {
  const { user } = useLkAuth();
  const { refresh: refreshBalance } = useEnergy();
  const hasSalon = !!user?.salon_id;

  const [prompt, setPrompt]                     = useState("");
  const [aspect, setAspect]                     = useState("1024x1024");
  const [useSalonCtx, setUseSalonCtx]           = useState(hasSalon);
  const [includeLogoText, setIncludeLogoText]   = useState(false);
  const [includeSalonName, setIncludeSalonName] = useState(false);

  const [status, setStatus]       = useState<GenStatus>("idle");
  const [statusText, setStatusText] = useState("");
  const [imageUrl, setImageUrl]   = useState<string | null>(null);
  const [downloading, setDownloading] = useState(false);
  const [error, setError]         = useState("");

  const [history, setHistory]           = useState<HistoryItem[]>([]);
  const [historyOpen, setHistoryOpen]   = useState(false);
  const [historyLoading, setHistoryLoading] = useState(false);

  // Ref для отмены поллинга при размонтировании
  const pollRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const abortedRef = useRef(false);

  useEffect(() => {
    loadHistory();
    return () => {
      abortedRef.current = true;
      if (pollRef.current) clearTimeout(pollRef.current);
    };
  }, []);

  const loading = status === "starting" || status === "waiting";

  const loadHistory = () => {
    setHistoryLoading(true);
    fetch(AI_IMAGE_URL, { headers: { "X-Session-Id": sid() } })
      .then(r => r.json())
      .then(d => { if (Array.isArray(d)) setHistory(d); })
      .finally(() => setHistoryLoading(false));
  };

  async function pollStatus(jobId: string, tries = 0) {
    if (abortedRef.current) return;
    if (tries >= POLL_MAX_TRIES) {
      setStatus("error");
      setError("Генерация заняла слишком долго. Проверьте «Мои изображения» — картинка может появиться там.");
      refreshBalance();
      loadHistory();
      return;
    }

    try {
      const r = await fetch(`${IMAGE_WORKER_URL}?job_id=${jobId}`, {
        headers: { "X-Session-Id": sid() },
      });
      const d = await r.json();

      if (abortedRef.current) return;

      if (d.status === "done" && d.url) {
        setImageUrl(d.url);
        setStatus("done");
        setStatusText("");
        refreshBalance();
        loadHistory();
        triggerDownload(d.url);
        return;
      }

      if (d.status === "error") {
        setStatus("error");
        setError("Ошибка генерации. Кредиты возвращены на баланс.");
        refreshBalance();
        loadHistory();
        return;
      }

      // pending / running — продолжаем ждать
      const elapsed = tries * POLL_INTERVAL_MS / 1000;
      setStatusText(`Генерирую... ${Math.round(elapsed)}с`);
      pollRef.current = setTimeout(() => pollStatus(jobId, tries + 1), POLL_INTERVAL_MS);

    } catch {
      if (abortedRef.current) return;
      // Сетевая ошибка — повторяем через интервал
      pollRef.current = setTimeout(() => pollStatus(jobId, tries + 1), POLL_INTERVAL_MS);
    }
  }

  async function startWorker(jobId: string) {
    // Запускаем воркер (долгий POST, может упасть по таймауту платформы — это нормально)
    // Параллельно идёт поллинг, он поймает результат
    try {
      await fetch(IMAGE_WORKER_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json", "X-Session-Id": sid() },
        body: JSON.stringify({ job_id: jobId }),
      });
    } catch {
      // Таймаут платформы — игнорируем, поллинг всё равно поймает результат
    }
  }

  async function handleGenerate() {
    if (!prompt.trim()) { setError("Введите описание изображения"); return; }
    if (loading) return;

    setStatus("starting");
    setError("");
    setImageUrl(null);
    abortedRef.current = false;
    if (pollRef.current) clearTimeout(pollRef.current);

    try {
      // Шаг 1: быстро создаём задачу и списываем кредиты (~1 сек)
      const res = await fetch(IMAGE_START_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json", "X-Session-Id": sid() },
        body: JSON.stringify({
          prompt: prompt.trim(),
          aspect_ratio: aspect,
          use_salon_context: useSalonCtx,
          include_logo_text: includeLogoText,
          include_salon_name: includeSalonName,
        }),
      });
      const data = await res.json();

      if (!res.ok) {
        setStatus("error");
        setError(data.error || "Ошибка запуска генерации");
        return;
      }

      const jobId = data.job_id;
      setStatus("waiting");
      setStatusText("Генерирую... 0с");
      refreshBalance();

      // Шаг 2: запускаем воркер (fire-and-forget) + поллинг параллельно
      startWorker(jobId);
      pollRef.current = setTimeout(() => pollStatus(jobId, 0), POLL_INTERVAL_MS);

    } catch {
      setStatus("error");
      setError("Ошибка соединения. Попробуйте ещё раз.");
    }
  }

  async function triggerDownload(url: string) {
    setDownloading(true);
    try {
      const res = await fetch(url);
      const blob = await res.blob();
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = "pro-dialog-image.png";
      a.click();
      URL.revokeObjectURL(a.href);
    } catch { /* пользователь скачает вручную */ }
    finally { setDownloading(false); }
  }

  const charCount = prompt.length;

  return (
    <div style={{ maxWidth: 680 }}>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>

      {/* Заголовок */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
          <div style={{ width: 40, height: 40, borderRadius: 12, background: `linear-gradient(135deg,hsl(40,90%,50%),hsl(30,95%,55%))`, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Icon name="Sparkles" size={20} style={{ color: "#fff" }} />
          </div>
          <div>
            <h2 style={{ fontSize: "clamp(18px,2.5vw,24px)", fontWeight: 700, color: "#0F172A", margin: 0 }}>Генерация изображений</h2>
          </div>
        </div>
        <p style={{ fontSize: 13, color: "#777", margin: 0, lineHeight: 1.6 }}>
          Создавайте визуалы для постов, сторис и баннеров. Изображение скачается автоматически.
        </p>
      </div>

      {/* Форма */}
      <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #E8ECF0", padding: "20px 22px", marginBottom: 16, boxShadow: "0 1px 3px rgba(15,23,42,0.05)" }}>

        {hasSalon && (
          <div
            onClick={() => !loading && setUseSalonCtx(p => !p)}
            style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 14px", borderRadius: 10, background: useSalonCtx ? `hsla(185,85%,32%,0.06)` : "#fff", border: `1.5px solid ${useSalonCtx ? ACCENT : "#E2E8F0"}`, marginBottom: useSalonCtx ? 10 : 18, cursor: loading ? "default" : "pointer", userSelect: "none" }}
          >
            <div style={{ width: 20, height: 20, borderRadius: 6, border: `2px solid ${useSalonCtx ? ACCENT : "#ccc"}`, background: useSalonCtx ? ACCENT : "transparent", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              {useSalonCtx && <Icon name="Check" size={11} style={{ color: "#fff" }} />}
            </div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 600, color: "#0F172A" }}>Учитывать контекст салона</div>
              <div style={{ fontSize: 11, color: "#aaa" }}>ИИ добавит данные вашего салона к промпту</div>
            </div>
          </div>
        )}

        {hasSalon && useSalonCtx && (
          <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 18, padding: "12px 14px", borderRadius: 10, background: "#fffbf0", border: "1.5px solid #fde68a" }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: "#92400e", marginBottom: 2 }}>Художественная интерпретация — на усмотрение ИИ</div>
            {([
              { state: includeSalonName, set: setIncludeSalonName, label: "Добавить название салона на изображение" },
              { state: includeLogoText,  set: setIncludeLogoText,  label: "Добавить художественный логотип-символ" },
            ] as { state: boolean; set: (v: (p: boolean) => boolean) => void; label: string }[]).map(({ state, set, label }) => (
              <div key={label} onClick={() => !loading && set(p => !p)} style={{ display: "flex", alignItems: "center", gap: 10, cursor: loading ? "default" : "pointer", userSelect: "none" }}>
                <div style={{ width: 16, height: 16, borderRadius: 4, border: `2px solid ${state ? "#d97706" : "#ccc"}`, background: state ? "#d97706" : "transparent", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  {state && <Icon name="Check" size={9} style={{ color: "#fff" }} />}
                </div>
                <span style={{ fontSize: 12, color: "#78350f" }}>{label}</span>
              </div>
            ))}
            <div style={{ fontSize: 10, color: "#b45309", lineHeight: 1.5, marginTop: 2 }}>
              ⚠️ ИИ рисует название и логотип по своему усмотрению — результат не будет совпадать с вашим фирменным стилем
            </div>
          </div>
        )}

        <div style={{ marginBottom: 18 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
            <label style={{ fontSize: 12, fontWeight: 700, color: "#555" }}>Описание изображения *</label>
            <span style={{ fontSize: 11, color: charCount > 4800 ? "#e55" : "#bbb" }}>{charCount} / 5000</span>
          </div>
          <textarea
            value={prompt}
            onChange={e => setPrompt(e.target.value)}
            disabled={loading}
            maxLength={5000}
            rows={4}
            placeholder="Опишите что хотите получить. Например: уютный интерьер салона красоты, мягкий свет, цветы на столе, стиль минимализм, пастельные тона"
            style={{ width: "100%", padding: "12px 14px", borderRadius: 10, border: `1.5px solid ${error && !prompt.trim() ? "#fcc" : "#E2E8F0"}`, fontSize: 13, fontFamily: "Montserrat,sans-serif", resize: "vertical", outline: "none", background: loading ? "#f8f8f6" : "#fff", boxSizing: "border-box", color: "#0F172A", lineHeight: 1.6 }}
          />
          {!loading && (
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 8 }}>
              {["Пост для Instagram", "Баннер с акцией", "Фото команды", "Атмосфера салона"].map(hint => (
                <button key={hint} onClick={() => setPrompt(p => p ? `${p}, ${hint.toLowerCase()}` : hint)} style={{ fontSize: 11, padding: "4px 10px", borderRadius: 20, border: "1px solid #e0e0db", background: "#fff", color: "#777", cursor: "pointer", fontFamily: "Montserrat,sans-serif" }}>
                  + {hint}
                </button>
              ))}
            </div>
          )}
        </div>

        <div style={{ marginBottom: 20 }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: "#555", marginBottom: 8 }}>Формат</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 8 }}>
            {ASPECT_OPTIONS.map(opt => (
              <button key={opt.value} onClick={() => !loading && setAspect(opt.value)} style={{ padding: "10px 8px", borderRadius: 10, border: `1.5px solid ${aspect === opt.value ? ACCENT : "#E2E8F0"}`, background: aspect === opt.value ? `hsla(185,85%,32%,0.07)` : "#fff", cursor: loading ? "default" : "pointer", fontFamily: "Montserrat,sans-serif", textAlign: "center" }}>
                <Icon name={opt.icon} size={18} style={{ color: aspect === opt.value ? ACCENT : "#bbb", marginBottom: 4 }} />
                <div style={{ fontSize: 12, fontWeight: 700, color: aspect === opt.value ? ACCENT : "#333" }}>{opt.label}</div>
                <div style={{ fontSize: 10, color: "#aaa" }}>{opt.sub}</div>
              </button>
            ))}
          </div>
        </div>

        {error && (
          <div style={{ background: "#fff0f0", border: "1px solid #fcc", borderRadius: 10, padding: "10px 14px", marginBottom: 14, fontSize: 13, color: "#c33", display: "flex", alignItems: "flex-start", gap: 8 }}>
            <Icon name="AlertCircle" size={14} style={{ flexShrink: 0, marginTop: 1 }} />
            {error}
          </div>
        )}

        <button
          onClick={handleGenerate}
          disabled={loading}
          style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, background: loading ? "#bbb" : `linear-gradient(135deg,hsl(40,90%,50%),hsl(30,95%,50%))`, color: "#fff", border: "none", borderRadius: 12, padding: "14px 24px", fontSize: 15, fontWeight: 700, cursor: loading ? "not-allowed" : "pointer", fontFamily: "Montserrat,sans-serif", boxShadow: loading ? "none" : "0 4px 18px hsla(40,90%,50%,0.35)" }}
        >
          {status === "starting"
            ? <><Icon name="Loader" size={17} style={{ animation: "spin 1s linear infinite" }} /> Запускаю генерацию...</>
            : status === "waiting"
            ? <><Icon name="Loader" size={17} style={{ animation: "spin 1s linear infinite" }} /> {statusText || "Генерирую..."}</>
            : <><Icon name="Sparkles" size={17} /> Сгенерировать и скачать</>
          }
        </button>

        {loading && (
          <div style={{ marginTop: 12, display: "flex", alignItems: "flex-start", gap: 8, padding: "10px 14px", background: "hsl(40,90%,97%)", border: "1px solid hsl(40,90%,80%)", borderRadius: 10, fontSize: 12, color: "hsl(40,60%,35%)", lineHeight: 1.6 }}>
            <Icon name="AlertTriangle" size={14} style={{ flexShrink: 0, marginTop: 1 }} />
            <span>Можно закрыть страницу — генерация идёт на сервере. Результат появится в «Мои изображения».</span>
          </div>
        )}
      </div>

      {/* Результат */}
      {imageUrl && status === "done" && (
        <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #E8ECF0", padding: "20px 22px", marginBottom: 16, boxShadow: "0 1px 3px rgba(15,23,42,0.05)" }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: "#0F172A", marginBottom: 12, display: "flex", alignItems: "center", gap: 8 }}>
            <Icon name="CheckCircle" size={15} style={{ color: "hsl(145,60%,40%)" }} />
            Изображение готово
          </div>
          <div style={{ borderRadius: 12, overflow: "hidden", border: "1px solid #F1F5F9", marginBottom: 14 }}>
            <img src={imageUrl} alt="Результат" style={{ width: "100%", display: "block" }} />
          </div>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <button
              onClick={() => triggerDownload(imageUrl)}
              disabled={downloading}
              style={{ display: "flex", alignItems: "center", gap: 7, background: downloading ? "#bbb" : `linear-gradient(135deg,${ACCENT},${ACCENT_DARK})`, color: "#fff", border: "none", borderRadius: 10, padding: "11px 20px", fontSize: 13, fontWeight: 700, cursor: downloading ? "not-allowed" : "pointer", fontFamily: "Montserrat,sans-serif" }}
            >
              {downloading ? <><Icon name="Loader" size={14} style={{ animation: "spin 1s linear infinite" }} /> Скачиваю...</> : <><Icon name="Download" size={14} /> Скачать ещё раз</>}
            </button>
            <button
              onClick={() => { setImageUrl(null); setStatus("idle"); setError(""); }}
              style={{ display: "flex", alignItems: "center", gap: 7, background: "#f5f5f2", color: "#666", border: "none", borderRadius: 10, padding: "11px 20px", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "Montserrat,sans-serif" }}
            >
              <Icon name="RotateCcw" size={14} /> Новая генерация
            </button>
          </div>
        </div>
      )}

      {/* История изображений */}
      <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #E8ECF0", overflow: "hidden" }}>
        <button
          onClick={() => { setHistoryOpen(o => !o); if (!historyOpen) loadHistory(); }}
          style={{ width: "100%", display: "flex", alignItems: "center", gap: 10, padding: "14px 20px", background: "none", border: "none", cursor: "pointer", textAlign: "left" }}
        >
          <Icon name="Clock" size={16} style={{ color: ACCENT }} />
          <span style={{ flex: 1, fontSize: 14, fontWeight: 700, color: "#0F172A" }}>Мои изображения</span>
          <span style={{ fontSize: 12, color: "#aaa", marginRight: 6 }}>{history.length} шт.</span>
          <Icon name={historyOpen ? "ChevronUp" : "ChevronDown"} size={16} style={{ color: "#aaa" }} />
        </button>

        {historyOpen && (
          <div style={{ borderTop: "1px solid #F1F5F9", padding: "16px 20px" }}>
            {historyLoading ? (
              <div style={{ textAlign: "center", padding: "24px 0", color: "#aaa", fontSize: 13 }}>Загрузка...</div>
            ) : history.length === 0 ? (
              <div style={{ textAlign: "center", padding: "24px 0", color: "#aaa", fontSize: 13 }}>Изображений пока нет</div>
            ) : (
              <>
                <div style={{ fontSize: 12, color: "#aaa", marginBottom: 12, lineHeight: 1.5 }}>
                  Хранятся 24 часа. Нажмите на картинку чтобы скачать.
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))", gap: 10 }}>
                  {history.map(item => (
                    <div key={item.id} style={{ borderRadius: 10, overflow: "hidden", border: "1px solid #E8ECF0", position: "relative" }}>
                      <img
                        src={item.url} alt=""
                        style={{ width: "100%", display: "block", aspectRatio: item.aspect_ratio === "1024x1792" || item.aspect_ratio === "2:3" ? "2/3" : item.aspect_ratio === "1792x1024" || item.aspect_ratio === "3:2" ? "3/2" : "1/1", objectFit: "cover", cursor: "pointer" }}
                        onClick={() => triggerDownload(item.url)}
                        title={item.prompt || "Скачать"}
                      />
                      <div style={{ padding: "6px 8px", fontSize: 10, color: "#aaa", background: "#fff", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                        <span>{new Date(item.created_at).toLocaleDateString("ru-RU", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}</span>
                        <button
                          onClick={() => {
                            fetch(AI_IMAGE_URL, {
                              method: "DELETE",
                              headers: { "Content-Type": "application/json", "X-Session-Id": sid() },
                              body: JSON.stringify({ id: item.id }),
                            }).then(() => setHistory(h => h.filter(x => x.id !== item.id)));
                          }}
                          title="Удалить"
                          style={{ background: "none", border: "none", cursor: "pointer", padding: "2px 4px", color: "#ccc", lineHeight: 1 }}
                          onMouseEnter={e => (e.currentTarget.style.color = "#e55")}
                          onMouseLeave={e => (e.currentTarget.style.color = "#ccc")}
                        >
                          <Icon name="Trash2" size={12} />
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
    </div>
  );
}
