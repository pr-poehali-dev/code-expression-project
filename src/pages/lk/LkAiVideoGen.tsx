import { useState, useEffect, useRef } from "react";
import { useLkAuth } from "@/contexts/LkAuthContext";
import { useEnergy } from "@/contexts/EnergyContext";
import Icon from "@/components/ui/icon";
import ToolUsageBadge from "@/components/ToolUsageBadge";

const REFERENCE_PHOTO_SURCHARGE = 5;

const ACCENT = "hsl(185,85%,32%)";
const ACCENT_DARK = "hsl(185,85%,24%)";
const AI_VIDEO_URL = "https://functions.poehali.dev/bee8e5b9-0c2e-4194-967a-540e0178fac7";

const DURATION_OPTIONS = [
  { value: "5s",  label: "5 секунд",  complexity: "Проще и быстрее" },
  { value: "10s", label: "10 секунд", complexity: "Больше деталей" },
];

function sid() { return localStorage.getItem("lk_session") || ""; }

interface HistoryItem {
  id: number; url: string; prompt: string; resolution: string; duration: string; created_at: string; reference_photo_url?: string | null;
}

interface LkAiVideoGenProps {
  initialPrompt?: string;
  initialDuration?: string;
}

export default function LkAiVideoGen({ initialPrompt, initialDuration }: LkAiVideoGenProps = {}) {
  const { user } = useLkAuth();
  const { refresh: refreshBalance } = useEnergy();
  void user;
  const fileRef = useRef<HTMLInputElement>(null);

  const [prompt, setPrompt]     = useState(initialPrompt || "");
  const [duration, setDuration] = useState(initialDuration || "5s");
  const [loading, setLoading]   = useState(false);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [error, setError]       = useState("");

  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [photoBase64, setPhotoBase64]   = useState<string | null>(null);

  const [history, setHistory]               = useState<HistoryItem[]>([]);
  const [historyOpen, setHistoryOpen]       = useState(true);
  const [historyLoading, setHistoryLoading] = useState(false);

  useEffect(() => { loadHistory(); }, []);

  const loadHistory = () => {
    setHistoryLoading(true);
    fetch(AI_VIDEO_URL, { headers: { "X-Session-Id": sid() } })
      .then(r => r.json())
      .then(d => { if (Array.isArray(d)) setHistory(d); })
      .finally(() => setHistoryLoading(false));
  };

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 8 * 1024 * 1024) { setError("Файл слишком большой (максимум 8 МБ)"); return; }
    setError("");
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      setPhotoPreview(result);
      setPhotoBase64(result);
    };
    reader.readAsDataURL(file);
  }

  function removePhoto() {
    setPhotoPreview(null);
    setPhotoBase64(null);
    if (fileRef.current) fileRef.current.value = "";
  }

  async function handleGenerate() {
    if (!prompt.trim()) { setError("Введите описание видео"); return; }
    if (loading) return;
    setLoading(true); setError(""); setVideoUrl(null);

    try {
      const res = await fetch(AI_VIDEO_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json", "X-Session-Id": sid() },
        body: JSON.stringify({
          prompt: prompt.trim(),
          resolution: "720p",
          duration,
          reference_photo_base64: photoBase64 || undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        if (res.status === 403) {
          setError(data.error || "Инструмент доступен только после пополнения баланса.");
        } else {
          setError(data.error || "Ошибка генерации");
        }
        loadHistory();
        return;
      }
      const url = data.video?.url;
      if (url) {
        setVideoUrl(url);
        refreshBalance();
        loadHistory();
      } else {
        setError("Сервис не вернул видео. Проверьте «Мои видео» ниже.");
        loadHistory();
      }
    } catch {
      setError("Долгий ответ сервера. Проверьте «Мои видео» — ролик мог сохраниться.");
      loadHistory();
    } finally {
      setLoading(false);
      refreshBalance();
    }
  }

  const charCount = prompt.length;

  return (
    <div style={{ maxWidth: 680 }}>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>

      {/* Заголовок */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
          <div style={{ width: 40, height: 40, borderRadius: 12, background: `linear-gradient(135deg,hsl(335,80%,50%),hsl(320,85%,55%))`, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Icon name="Clapperboard" size={20} style={{ color: "#fff" }} />
          </div>
          <h2 style={{ fontSize: "clamp(18px,2.5vw,24px)", fontWeight: 700, color: "#0F172A", margin: 0 }}>Создание видео-ролика</h2>
        </div>
        <p style={{ fontSize: 13, color: "#64748B", margin: "0 0 12px", lineHeight: 1.6 }}>
          Опишите ролик — ИИ сгенерирует короткое видео для сторис, рилс или рекламы.
        </p>
        <div style={{ padding: "12px 16px", background: "hsl(335,80%,97%)", borderRadius: 12, border: "1px solid hsl(335,80%,90%)", marginBottom: 4 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: "#0F172A", marginBottom: 6 }}>Как пользоваться</div>
          <div style={{ fontSize: 13, color: "#475569", lineHeight: 1.7 }}>
            Опишите сюжет — например, атмосферу салона или процедуру. ИИ создаст готовый видеоролик за 1–3 минуты. Пробный формат — попробуйте и напишите нам, что получилось.
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "flex-start", gap: 8, background: "hsl(40,90%,97%)", border: "1px solid hsl(40,90%,85%)", borderRadius: 10, padding: "10px 14px", marginTop: 8 }}>
          <Icon name="Zap" size={14} style={{ color: "hsl(40,70%,40%)", flexShrink: 0, marginTop: 1 }} />
          <span style={{ fontSize: 12.5, color: "hsl(40,60%,30%)", lineHeight: 1.6 }}>
            Стоимость зависит от сложности задачи: чем длиннее видео, тем больше энергии тратится на результат. Сумма списывается автоматически с баланса салона.
          </span>
        </div>
      </div>

      {/* Форма */}
      <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #E8ECF0", padding: "20px 22px", marginBottom: 16, boxShadow: "0 1px 3px rgba(15,23,42,0.05)" }}>

        {/* Фото мастера (опционально) */}
        <div style={{ marginBottom: 18 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
            <label style={{ fontSize: 12, fontWeight: 700, color: "#555" }}>Фото мастера (необязательно)</label>
            <div style={{ fontSize: 10, fontWeight: 700, color: "hsl(335,80%,50%)", background: "hsl(335,80%,96%)", borderRadius: 20, padding: "2px 8px" }}>
              +{REFERENCE_PHOTO_SURCHARGE} энергии
            </div>
          </div>
          <input ref={fileRef} type="file" accept="image/*" onChange={handleFileChange} disabled={loading} style={{ display: "none" }} />
          {photoPreview ? (
            <div style={{ position: "relative", borderRadius: 12, overflow: "hidden", border: "1px solid #E2E8F0", maxWidth: 220 }}>
              <img src={photoPreview} alt="Фото мастера" style={{ width: "100%", maxHeight: 200, objectFit: "contain", display: "block", background: "#f8fafc" }} />
              {!loading && (
                <button
                  onClick={removePhoto}
                  style={{ position: "absolute", top: 8, right: 8, display: "flex", alignItems: "center", gap: 5, background: "rgba(15,23,42,0.75)", color: "#fff", border: "none", borderRadius: 8, padding: "6px 10px", fontSize: 11, fontWeight: 600, cursor: "pointer", fontFamily: "Montserrat,sans-serif" }}
                >
                  <Icon name="X" size={12} /> Убрать
                </button>
              )}
            </div>
          ) : (
            <button
              onClick={() => fileRef.current?.click()}
              disabled={loading}
              style={{ width: "100%", padding: "18px 16px", borderRadius: 12, border: "1.5px dashed #CBD5E1", background: "#F8FAFC", cursor: loading ? "default" : "pointer", display: "flex", alignItems: "center", gap: 10, fontFamily: "Montserrat,sans-serif" }}
            >
              <Icon name="Upload" size={18} style={{ color: "#94A3B8" }} />
              <div style={{ textAlign: "left" }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: "#475569" }}>Загрузить фото — видео будет с этим человеком</div>
                <div style={{ fontSize: 10, color: "#94A3B8" }}>JPG, PNG до 8 МБ. Без фото — как обычно, случайные лица</div>
              </div>
            </button>
          )}
          <div style={{ display: "flex", alignItems: "flex-start", gap: 7, marginTop: 10, padding: "8px 12px", background: "hsl(40,90%,97%)", border: "1px solid hsl(40,90%,88%)", borderRadius: 10 }}>
            <Icon name="Info" size={13} style={{ color: "hsl(40,80%,45%)", flexShrink: 0, marginTop: 1 }} />
            <div style={{ fontSize: 11, color: "#78716C", lineHeight: 1.5 }}>
              Для точного результата: лицо крупным планом и хорошо освещено, ракурс — анфас или лёгкий поворот, фон — светлый и без лишних людей.
            </div>
          </div>
        </div>

        <div style={{ marginBottom: 18 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
            <label style={{ fontSize: 12, fontWeight: 700, color: "#555" }}>Описание видео *</label>
            <span style={{ fontSize: 11, color: charCount > 1900 ? "#e55" : "#bbb" }}>{charCount} / 2000</span>
          </div>
          <textarea
            value={prompt}
            onChange={e => setPrompt(e.target.value)}
            disabled={loading}
            maxLength={2000}
            rows={4}
            placeholder="Опишите что хотите получить. Например: уютный интерьер салона красоты, мягкий свет, камера плавно движется вдоль зоны ресепшн"
            style={{ width: "100%", padding: "12px 14px", borderRadius: 10, border: `1.5px solid ${error && !prompt.trim() ? "#fcc" : "#E2E8F0"}`, fontSize: 13, fontFamily: "Montserrat,sans-serif", resize: "vertical", outline: "none", background: loading ? "#f8f8f6" : "#fff", boxSizing: "border-box", color: "#0F172A", lineHeight: 1.6 }}
          />
          {!loading && (
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 8 }}>
              {[
                { label: "Атмосфера салона", add: "атмосфера салона, тёплый свет" },
                { label: "Процедура крупным планом", add: "процедура крупным планом, плавная камера" },
                { label: "Тизер для рилс", add: "динамичный тизер для рилс, смена ракурсов" },
                { label: "Интерьер", add: "интерьер салона, плавное панорамирование" },
              ].map(hint => (
                <button key={hint.label} onClick={() => setPrompt(p => p ? `${p}, ${hint.add}` : hint.add)} style={{ fontSize: 11, padding: "4px 10px", borderRadius: 20, border: "1px solid #e0e0db", background: "#fff", color: "#777", cursor: "pointer", fontFamily: "Montserrat,sans-serif" }}>
                  + {hint.label}
                </button>
              ))}
            </div>
          )}
          <div style={{ display: "flex", alignItems: "flex-start", gap: 7, marginTop: 10, padding: "8px 12px", background: "hsl(40,90%,97%)", border: "1px solid hsl(40,90%,88%)", borderRadius: 10 }}>
            <Icon name="Info" size={13} style={{ color: "hsl(40,80%,45%)", flexShrink: 0, marginTop: 1 }} />
            <div style={{ fontSize: 11, color: "#78716C", lineHeight: 1.5 }}>
              Не описывайте текст, надписи или вывески на экране — ИИ не умеет рисовать русские буквы, вместо них получится нечитаемая «каша». Также не пишите про речь и диалоги людей — ИИ не говорит по-русски, в видео добавится только фоновая музыка.
            </div>
          </div>
        </div>

        <div style={{ marginBottom: 20 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: "#555" }}>Длительность</div>
            {initialDuration && (
              <div style={{ fontSize: 10, fontWeight: 700, color: "hsl(335,80%,50%)", background: "hsl(335,80%,96%)", borderRadius: 20, padding: "2px 8px" }}>
                Рекомендовано по сценарию
              </div>
            )}
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 8 }}>
            {DURATION_OPTIONS.map(opt => (
              <button key={opt.value} onClick={() => !loading && setDuration(opt.value)} style={{ padding: "10px 8px", borderRadius: 10, border: `1.5px solid ${duration === opt.value ? ACCENT : "#E2E8F0"}`, background: duration === opt.value ? `hsla(185,85%,32%,0.07)` : "#fff", cursor: loading ? "default" : "pointer", fontFamily: "Montserrat,sans-serif", textAlign: "center" }}>
                <Icon name="Clock" size={16} style={{ color: duration === opt.value ? ACCENT : "#bbb", marginBottom: 4 }} />
                <div style={{ fontSize: 12, fontWeight: 700, color: duration === opt.value ? ACCENT : "#333" }}>{opt.label}</div>
                <div style={{ fontSize: 10, color: "#aaa" }}>{opt.complexity}</div>
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

        {loading && (
          <div style={{ background: "hsl(0,90%,97%)", border: "1.5px solid hsl(0,80%,85%)", borderRadius: 12, padding: "14px 16px", marginBottom: 16, display: "flex", alignItems: "flex-start", gap: 10 }}>
            <Icon name="AlertTriangle" size={18} style={{ color: "hsl(0,75%,55%)", flexShrink: 0, marginTop: 1 }} />
            <div>
              <div style={{ fontSize: 13, fontWeight: 700, color: "hsl(0,65%,40%)", marginBottom: 3 }}>Не закрывайте страницу!</div>
              <div style={{ fontSize: 12, color: "hsl(0,50%,45%)", lineHeight: 1.5 }}>Видео генерируется 1–3 минуты. Если закрыть — энергия спишется, а ролик не сохранится.</div>
            </div>
          </div>
        )}

        <button
          onClick={handleGenerate}
          disabled={loading}
          style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, background: loading ? "#bbb" : `linear-gradient(135deg,hsl(335,80%,50%),hsl(320,85%,50%))`, color: "#fff", border: "none", borderRadius: 12, padding: "14px 24px", fontSize: 15, fontWeight: 700, cursor: loading ? "not-allowed" : "pointer", fontFamily: "Montserrat,sans-serif", boxShadow: loading ? "none" : "0 4px 18px hsla(335,80%,50%,0.35)" }}
        >
          {loading
            ? <><Icon name="Loader" size={17} style={{ animation: "spin 1s linear infinite" }} /> Генерирую... подождите</>
            : <><Icon name="Clapperboard" size={17} /> Сгенерировать видео</>
          }
        </button>
        <div style={{ display: "flex", justifyContent: "center", marginTop: 10 }}>
          <ToolUsageBadge toolKey="video_gen" />
        </div>
      </div>

      {/* Результат */}
      {videoUrl && (
        <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #E8ECF0", padding: "20px 22px", marginBottom: 16, boxShadow: "0 1px 3px rgba(15,23,42,0.05)" }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: "#0F172A", marginBottom: 12, display: "flex", alignItems: "center", gap: 8 }}>
            <Icon name="CheckCircle" size={15} style={{ color: "hsl(145,60%,40%)" }} />
            Видео готово
          </div>
          <div style={{ borderRadius: 12, overflow: "hidden", border: "1px solid #F1F5F9", marginBottom: 14, background: "#000" }}>
            <video src={videoUrl} controls style={{ width: "100%", display: "block" }} />
          </div>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <a
              href={videoUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{ display: "flex", alignItems: "center", gap: 7, background: `linear-gradient(135deg,${ACCENT},${ACCENT_DARK})`, color: "#fff", border: "none", borderRadius: 10, padding: "11px 20px", fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "Montserrat,sans-serif", textDecoration: "none" }}
            >
              <Icon name="Download" size={14} /> Открыть / скачать
            </a>
            <button
              onClick={() => { setVideoUrl(null); setError(""); }}
              style={{ display: "flex", alignItems: "center", gap: 7, background: "#f5f5f2", color: "#666", border: "none", borderRadius: 10, padding: "11px 20px", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "Montserrat,sans-serif" }}
            >
              <Icon name="RotateCcw" size={14} /> Новая генерация
            </button>
          </div>
        </div>
      )}

      {/* История видео */}
      <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #E8ECF0", overflow: "hidden" }}>
        <button
          onClick={() => { setHistoryOpen(o => !o); if (!historyOpen) loadHistory(); }}
          style={{ width: "100%", display: "flex", alignItems: "center", gap: 10, padding: "14px 20px", background: "none", border: "none", cursor: "pointer", textAlign: "left" }}
        >
          <Icon name="Clock" size={16} style={{ color: ACCENT }} />
          <span style={{ flex: 1, fontSize: 14, fontWeight: 700, color: "#0F172A" }}>Мои видео</span>
          <span style={{ fontSize: 12, color: "#aaa", marginRight: 6 }}>{history.length} шт.</span>
          <Icon name={historyOpen ? "ChevronUp" : "ChevronDown"} size={16} style={{ color: "#aaa" }} />
        </button>

        {historyOpen && (
          <div style={{ borderTop: "1px solid #F1F5F9", padding: "16px 20px" }}>
            {historyLoading ? (
              <div style={{ textAlign: "center", padding: "24px 0", color: "#aaa", fontSize: 13 }}>Загрузка...</div>
            ) : history.length === 0 ? (
              <div style={{ textAlign: "center", padding: "24px 0", color: "#aaa", fontSize: 13 }}>Видео пока нет</div>
            ) : (
              <>
                <div style={{ fontSize: 12, color: "#aaa", marginBottom: 12, lineHeight: 1.5 }}>
                  Хранятся 6 дней. Нажмите на видео, чтобы посмотреть или скачать.
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: 12 }}>
                  {history.map(item => (
                    <div key={item.id} style={{ borderRadius: 12, overflow: "hidden", border: "1px solid #E8ECF0", background: "#fff", boxShadow: "0 1px 4px rgba(15,23,42,0.06)" }}>
                      <video src={item.url} controls style={{ width: "100%", display: "block", aspectRatio: "9/16", objectFit: "cover", background: "#000" }} />
                      <div style={{ padding: "8px 10px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 6 }}>
                        <a
                          href={item.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{ flex: 1, display: "flex", alignItems: "center", gap: 5, background: `hsla(185,85%,32%,0.08)`, border: "none", borderRadius: 7, padding: "6px 8px", cursor: "pointer", color: ACCENT, fontSize: 11, fontWeight: 700, fontFamily: "Montserrat,sans-serif", textDecoration: "none", justifyContent: "center" }}
                        >
                          <Icon name="Download" size={12} /> Открыть
                        </a>
                        <button
                          onClick={() => {
                            fetch(AI_VIDEO_URL, {
                              method: "DELETE",
                              headers: { "Content-Type": "application/json", "X-Session-Id": sid() },
                              body: JSON.stringify({ id: item.id }),
                            }).then(() => setHistory(h => h.filter(x => x.id !== item.id)));
                          }}
                          title="Удалить"
                          style={{ background: "hsl(0,70%,97%)", border: "none", borderRadius: 7, padding: "6px 8px", cursor: "pointer", display: "flex", alignItems: "center" }}
                        >
                          <Icon name="Trash2" size={12} style={{ color: "hsl(0,70%,55%)" }} />
                        </button>
                      </div>
                      <div style={{ padding: "0 10px 8px", fontSize: 10, color: "#bbb" }}>
                        {new Date(item.created_at).toLocaleDateString("ru-RU", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}
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