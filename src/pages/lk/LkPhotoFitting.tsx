import { useState, useEffect, useRef } from "react";
import { useLkAuth } from "@/contexts/LkAuthContext";
import { useEnergy } from "@/contexts/EnergyContext";
import { showEnergyGate } from "@/components/EnergyGate";
import Icon from "@/components/ui/icon";

const ACCENT = "hsl(185,85%,32%)";
const ACCENT_DARK = "hsl(185,85%,24%)";
const AI_IMAGE_URL = "https://functions.poehali.dev/4b0ee2e5-a98e-40b8-bb9a-8a11d39d6e5a";

const SCENARIOS = [
  { value: "haircut",  label: "Стрижка",        sub: "и укладка волос",      icon: "Scissors" },
  { value: "makeup",   label: "Макияж",         sub: "лица",                 icon: "Sparkles" },
  { value: "manicure", label: "Ногти",          sub: "маникюр и дизайн",     icon: "Hand" },
  { value: "figure",   label: "Фигура и стиль", sub: "образ и одежда",       icon: "PersonStanding" },
];

const NO_RECOMMENDATION_SCENARIOS = ["figure"];

function sid() { return localStorage.getItem("lk_session") || ""; }

interface HistoryItem {
  id: number;
  scenario: string;
  source_url: string;
  result_url: string;
  recommendation: string;
  created_at: string;
}

export default function LkPhotoFitting() {
  useLkAuth();
  const { refresh: refreshBalance } = useEnergy();
  const fileRef = useRef<HTMLInputElement>(null);

  const [scenario, setScenario]       = useState("haircut");
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [photoBase64, setPhotoBase64] = useState<string | null>(null);
  const [wishes, setWishes]           = useState("");
  const [loading, setLoading]         = useState(false);
  const [error, setError]             = useState("");

  const [resultUrl, setResultUrl]           = useState<string | null>(null);
  const [recommendation, setRecommendation] = useState<string>("");

  const [history, setHistory]               = useState<HistoryItem[]>([]);
  const [historyOpen, setHistoryOpen]       = useState(true);
  const [historyLoading, setHistoryLoading] = useState(false);

  useEffect(() => { loadHistory(); }, []);

  const loadHistory = () => {
    setHistoryLoading(true);
    fetch(`${AI_IMAGE_URL}?action=fitting_history`, { headers: { "X-Session-Id": sid() } })
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

  async function handleGenerate() {
    if (!photoBase64) { setError("Загрузите фото"); return; }
    if (loading) return;
    setLoading(true); setError(""); setResultUrl(null); setRecommendation("");

    try {
      const res = await fetch(`${AI_IMAGE_URL}?action=fitting`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "X-Session-Id": sid() },
        body: JSON.stringify({
          scenario,
          photo_base64: photoBase64,
          wishes: wishes.trim(),
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        if (res.status === 402 || res.status === 403) {
          showEnergyGate({ message: data.error || "Недостаточно энергии для примерки." });
        } else {
          setError(data.error || "Ошибка обработки фото");
        }
        return;
      }
      setResultUrl(data.result_url);
      setRecommendation(data.recommendation || "");
      refreshBalance();
      loadHistory();
    } catch {
      setError("Долгий ответ сервера. Проверьте «Мои примерки» ниже — результат мог сохраниться.");
      loadHistory();
    } finally {
      setLoading(false);
      refreshBalance();
    }
  }

  function resetForm() {
    setPhotoPreview(null);
    setPhotoBase64(null);
    setWishes("");
    setResultUrl(null);
    setRecommendation("");
    setError("");
    if (fileRef.current) fileRef.current.value = "";
  }

  const scenarioLabel = SCENARIOS.find(s => s.value === scenario)?.label || "";

  return (
    <div style={{ maxWidth: 680 }}>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>

      {/* Заголовок */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
          <div style={{ width: 40, height: 40, borderRadius: 12, background: `linear-gradient(135deg,${ACCENT},${ACCENT_DARK})`, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Icon name="Wand2" size={20} style={{ color: "#fff" }} />
          </div>
          <h2 style={{ fontSize: "clamp(18px,2.5vw,24px)", fontWeight: 700, color: "#0F172A", margin: 0 }}>Примерочная</h2>
        </div>
        <p style={{ fontSize: 13, color: "#64748B", margin: "0 0 12px", lineHeight: 1.6 }}>
          Клиент загружает фото — ИИ показывает результат стрижки, макияжа, маникюра или новой фигуры и стиля одежды. Для стрижки, макияжа и маникюра дополнительно даётся рекомендация, как этого добиться у мастера.
        </p>
        <div style={{ padding: "12px 16px", background: "hsl(185,85%,97%)", borderRadius: 12, border: "1px solid hsl(185,85%,85%)", marginBottom: 4 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: "#0F172A", marginBottom: 6 }}>Как пользоваться</div>
          <div style={{ fontSize: 13, color: "#475569", lineHeight: 1.7 }}>
            Загрузите фото клиента, выберите, что примерить, опишите пожелания — и покажите результат прямо на консультации. Это помогает клиенту принять решение и убедиться в результате заранее.
          </div>
        </div>
      </div>

      {/* Форма */}
      <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #E8ECF0", padding: "20px 22px", marginBottom: 16, boxShadow: "0 1px 3px rgba(15,23,42,0.05)" }}>

        {/* Загрузка фото */}
        <div style={{ marginBottom: 18 }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: "#555", marginBottom: 8 }}>Фото клиента *</div>
          <input ref={fileRef} type="file" accept="image/*" onChange={handleFileChange} disabled={loading} style={{ display: "none" }} />
          {photoPreview ? (
            <div style={{ position: "relative", borderRadius: 12, overflow: "hidden", border: "1px solid #E2E8F0" }}>
              <img src={photoPreview} alt="Фото" style={{ width: "100%", maxHeight: 320, objectFit: "contain", display: "block", background: "#f8fafc" }} />
              {!loading && (
                <button
                  onClick={() => fileRef.current?.click()}
                  style={{ position: "absolute", top: 10, right: 10, display: "flex", alignItems: "center", gap: 6, background: "rgba(15,23,42,0.75)", color: "#fff", border: "none", borderRadius: 8, padding: "7px 12px", fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "Montserrat,sans-serif" }}
                >
                  <Icon name="RefreshCw" size={13} /> Заменить
                </button>
              )}
            </div>
          ) : (
            <button
              onClick={() => fileRef.current?.click()}
              disabled={loading}
              style={{ width: "100%", padding: "32px 16px", borderRadius: 12, border: "1.5px dashed #CBD5E1", background: "#F8FAFC", cursor: loading ? "default" : "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: 8, fontFamily: "Montserrat,sans-serif" }}
            >
              <Icon name="Upload" size={24} style={{ color: "#94A3B8" }} />
              <span style={{ fontSize: 13, fontWeight: 600, color: "#475569" }}>Загрузить фото</span>
              <span style={{ fontSize: 11, color: "#94A3B8" }}>JPG, PNG до 8 МБ</span>
            </button>
          )}
        </div>

        {/* Сценарий */}
        <div style={{ marginBottom: 18 }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: "#555", marginBottom: 8 }}>Что примерить</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 8 }}>
            {SCENARIOS.map(opt => (
              <button
                key={opt.value}
                onClick={() => !loading && setScenario(opt.value)}
                style={{ padding: "12px 10px", borderRadius: 10, border: `1.5px solid ${scenario === opt.value ? ACCENT : "#E2E8F0"}`, background: scenario === opt.value ? "hsla(185,85%,32%,0.07)" : "#fff", cursor: loading ? "default" : "pointer", fontFamily: "Montserrat,sans-serif", textAlign: "center" }}
              >
                <Icon name={opt.icon} size={18} style={{ color: scenario === opt.value ? ACCENT : "#bbb", marginBottom: 4 }} />
                <div style={{ fontSize: 12, fontWeight: 700, color: scenario === opt.value ? ACCENT : "#333" }}>{opt.label}</div>
                <div style={{ fontSize: 10, color: "#aaa" }}>{opt.sub}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Пожелания */}
        <div style={{ marginBottom: 18 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
            <label style={{ fontSize: 12, fontWeight: 700, color: "#555" }}>
              {scenario === "figure" ? "Опишите себя и одежду, которую хотите примерить" : "Пожелания клиента (необязательно)"}
            </label>
            <span style={{ fontSize: 11, color: wishes.length > 900 ? "#e55" : "#bbb" }}>{wishes.length} / 1000</span>
          </div>
          <textarea
            value={wishes}
            onChange={e => setWishes(e.target.value)}
            disabled={loading}
            maxLength={1000}
            rows={3}
            placeholder={scenario === "figure"
              ? "Например: стройная фигура, спортивное телосложение, чёрное вечернее платье в пол"
              : "Например: короткое каре с чёлкой, тёплый русый оттенок"}
            style={{ width: "100%", padding: "12px 14px", borderRadius: 10, border: "1.5px solid #E2E8F0", fontSize: 13, fontFamily: "Montserrat,sans-serif", resize: "vertical", outline: "none", background: loading ? "#f8f8f6" : "#fff", boxSizing: "border-box", color: "#0F172A", lineHeight: 1.6 }}
          />
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
              <div style={{ fontSize: 12, color: "hsl(0,50%,45%)", lineHeight: 1.5 }}>Обработка фото занимает 1–3 минуты. Если закрыть — энергия спишется, а результат не сохранится.</div>
            </div>
          </div>
        )}

        <button
          onClick={handleGenerate}
          disabled={loading || !photoBase64}
          style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, background: loading || !photoBase64 ? "#bbb" : `linear-gradient(135deg,${ACCENT},${ACCENT_DARK})`, color: "#fff", border: "none", borderRadius: 12, padding: "14px 24px", fontSize: 15, fontWeight: 700, cursor: loading || !photoBase64 ? "not-allowed" : "pointer", fontFamily: "Montserrat,sans-serif", boxShadow: loading || !photoBase64 ? "none" : "0 4px 18px hsla(185,85%,32%,0.3)" }}
        >
          {loading
            ? <><Icon name="Loader" size={17} style={{ animation: "spin 1s linear infinite" }} /> Обрабатываю фото...</>
            : <><Icon name="Wand2" size={17} /> Примерить {scenarioLabel.toLowerCase()}</>
          }
        </button>
      </div>

      {/* Результат */}
      {resultUrl && (
        <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #E8ECF0", padding: "20px 22px", marginBottom: 16, boxShadow: "0 1px 3px rgba(15,23,42,0.05)" }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: "#0F172A", marginBottom: 12, display: "flex", alignItems: "center", gap: 8 }}>
            <Icon name="CheckCircle" size={15} style={{ color: "hsl(145,60%,40%)" }} />
            Результат готов
          </div>
          <div style={{ borderRadius: 12, overflow: "hidden", border: "1px solid #F1F5F9", marginBottom: 14 }}>
            <img src={resultUrl} alt="Результат примерки" style={{ width: "100%", display: "block" }} />
          </div>

          {recommendation && !NO_RECOMMENDATION_SCENARIOS.includes(scenario) && (
            <div style={{ background: "hsl(185,85%,97%)", border: "1px solid hsl(185,85%,88%)", borderRadius: 12, padding: "14px 16px", marginBottom: 14 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: "#0F172A", marginBottom: 6, display: "flex", alignItems: "center", gap: 6 }}>
                <Icon name="ListChecks" size={14} style={{ color: ACCENT }} /> Как добиться такого результата
              </div>
              <div style={{ fontSize: 13, color: "#334155", lineHeight: 1.7, whiteSpace: "pre-wrap" }}>{recommendation}</div>
            </div>
          )}

          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <button
              onClick={resetForm}
              style={{ display: "flex", alignItems: "center", gap: 7, background: "#f5f5f2", color: "#666", border: "none", borderRadius: 10, padding: "11px 20px", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "Montserrat,sans-serif" }}
            >
              <Icon name="RotateCcw" size={14} /> Новая примерка
            </button>
          </div>
        </div>
      )}

      {/* История */}
      <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #E8ECF0", overflow: "hidden" }}>
        <button
          onClick={() => { setHistoryOpen(o => !o); if (!historyOpen) loadHistory(); }}
          style={{ width: "100%", display: "flex", alignItems: "center", gap: 10, padding: "14px 20px", background: "none", border: "none", cursor: "pointer", textAlign: "left" }}
        >
          <Icon name="Clock" size={16} style={{ color: ACCENT }} />
          <span style={{ flex: 1, fontSize: 14, fontWeight: 700, color: "#0F172A" }}>Мои примерки</span>
          <span style={{ fontSize: 12, color: "#aaa", marginRight: 6 }}>{history.length} шт.</span>
          <Icon name={historyOpen ? "ChevronUp" : "ChevronDown"} size={16} style={{ color: "#aaa" }} />
        </button>

        {historyOpen && (
          <div style={{ borderTop: "1px solid #F1F5F9", padding: "16px 20px" }}>
            {historyLoading ? (
              <div style={{ textAlign: "center", padding: "24px 0", color: "#aaa", fontSize: 13 }}>Загрузка...</div>
            ) : history.length === 0 ? (
              <div style={{ textAlign: "center", padding: "24px 0", color: "#aaa", fontSize: 13 }}>Примерок пока нет</div>
            ) : (
              <>
                <div style={{ fontSize: 12, color: "#aaa", marginBottom: 12, lineHeight: 1.5 }}>Хранятся 6 дней.</div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: 12 }}>
                  {history.map(item => (
                    <div key={item.id} style={{ borderRadius: 12, overflow: "hidden", border: "1px solid #E8ECF0", background: "#fff", boxShadow: "0 1px 4px rgba(15,23,42,0.06)" }}>
                      <img src={item.result_url} alt="" style={{ width: "100%", aspectRatio: "1/1", objectFit: "cover", display: "block" }} />
                      <div style={{ padding: "8px 10px" }}>
                        <div style={{ fontSize: 11, fontWeight: 700, color: ACCENT }}>
                          {SCENARIOS.find(s => s.value === item.scenario)?.label || item.scenario}
                        </div>
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