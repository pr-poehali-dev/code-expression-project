import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Icon from "@/components/ui/icon";
import { setFittingTrial } from "@/lib/fittingTrial";

const TEAL = "#2DD4BF";
const TEAL2 = "#14B8A6";
const DARK = "#0F172A";
const SERIF = "'Cormorant Garamond', serif";

const SCENARIOS = [
  { value: "haircut",  label: "Стрижка",        sub: "и укладка волос",  icon: "Scissors" },
  { value: "makeup",   label: "Макияж",         sub: "лица",             icon: "Sparkles" },
  { value: "manicure", label: "Ногти",          sub: "маникюр и дизайн", icon: "Hand" },
  { value: "figure",   label: "Фигура и стиль", sub: "образ и одежда",   icon: "PersonStanding" },
];

export default function ImagePrimerkaHero() {
  const navigate = useNavigate();
  const fileRef = useRef<HTMLInputElement>(null);

  const [scenario, setScenario] = useState("haircut");
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [wishes, setWishes] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 8 * 1024 * 1024) { setError("Файл слишком большой (максимум 8 МБ)"); return; }
    setError("");
    const reader = new FileReader();
    reader.onload = () => setPhotoPreview(reader.result as string);
    reader.readAsDataURL(file);
  }

  function handleTrySubmit() {
    if (!photoPreview) { setError("Загрузите фото"); return; }
    setSubmitting(true);
    setFittingTrial({ photo: photoPreview, scenario, wishes: wishes.trim() });
    // Сохранённые данные подхватит форма регистрации/примерки в личном кабинете —
    // для нового пользователя это будет вкладка регистрации, для уже вошедшего сразу примерка.
    navigate("/cabinet");
  }

  const scenarioLabel = SCENARIOS.find(s => s.value === scenario)?.label || "";

  return (
    <>
      {/* ── HERO с интерактивной демо-формой ─────────────────────────────── */}
      <section style={{
        background: `radial-gradient(120% 100% at 80% 0%, #112B3C 0%, ${DARK} 55%, #060B16 100%)`,
        minHeight: "100vh", display: "flex", alignItems: "center",
        paddingTop: 76, position: "relative", overflow: "hidden",
      }}>
        <div style={{ position: "absolute", top: "15%", right: "6%", width: 520, height: 520, borderRadius: "50%", background: "radial-gradient(circle,rgba(45,212,191,0.10) 0%,transparent 65%)", pointerEvents: "none" }} />

        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "100px 32px", width: "100%" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 0.95fr", gap: 56, alignItems: "center" }} className="hero-fit-grid">

            {/* Левая часть: текст */}
            <div>
              <div style={{ display: "inline-flex", alignItems: "center", gap: 10, border: "1px solid rgba(45,212,191,0.3)", borderRadius: 100, padding: "7px 18px", marginBottom: 32 }}>
                <div style={{ width: 6, height: 6, borderRadius: "50%", background: TEAL }} />
                <span style={{ fontSize: 12, color: TEAL, fontWeight: 500, letterSpacing: "1.5px", textTransform: "uppercase" }}>Попробуйте прямо сейчас</span>
              </div>

              <h1 style={{ fontFamily: SERIF, fontSize: "clamp(34px,4.6vw,56px)", fontWeight: 500, color: "#fff", lineHeight: 1.15, margin: "0 0 24px", letterSpacing: "-0.5px" }}>
                Не угадывайте, какой результат<br />клиент назвал <span style={{ color: TEAL }}>«красиво»</span>
              </h1>

              <p style={{ fontSize: "clamp(15px,1.5vw,17px)", color: "rgba(255,255,255,0.6)", lineHeight: 1.75, margin: "0 0 20px", fontWeight: 300, maxWidth: 500 }}>
                Покажите направление образа до записи или до начала работы — и обсудите ожидания на одном языке.
              </p>

              <p style={{ fontSize: 14, color: "rgba(255,255,255,0.5)", lineHeight: 1.75, margin: "0 0 32px", fontWeight: 300, maxWidth: 500 }}>
                ИИ-примерка в «Промт Диалоге» помогает бьюти-мастеру и салону визуализировать идеи стрижки, окрашивания, укладки, макияжа, ногтей и стиля по фото клиента. Не чтобы обещать невозможное — а чтобы заранее понять: «Да, именно этого я хочу», или скорректировать ожидания до того, как клиент сядет в кресло.
              </p>

              <div style={{ display: "flex", gap: 32, paddingTop: 28, borderTop: "1px solid rgba(255,255,255,0.07)", flexWrap: "wrap" }}>
                {[["4 сценария","волосы, макияж, ногти, стиль"],["1 раз","бесплатно на старте"],["Без опыта","достаточно одного фото"]].map(([v, l], i) => (
                  <div key={i}>
                    <div style={{ fontFamily: SERIF, fontSize: 22, fontWeight: 600, color: "#fff", lineHeight: 1 }}>{v}</div>
                    <div style={{ fontSize: 12, color: "rgba(255,255,255,0.38)", marginTop: 5 }}>{l}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Правая часть: интерактивная демо-форма примерки */}
            <div style={{ position: "relative" }}>
              <div style={{ position: "absolute", inset: -1, borderRadius: 20, background: `linear-gradient(135deg, rgba(45,212,191,0.35), transparent 50%, rgba(45,212,191,0.12))`, pointerEvents: "none", zIndex: 0 }} />
              <div style={{ position: "relative", background: "#fff", borderRadius: 18, padding: "26px 24px", boxShadow: "0 32px 80px rgba(0,0,0,0.45)" }}>

                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 18 }}>
                  <div style={{ width: 36, height: 36, borderRadius: 10, background: `linear-gradient(135deg,${TEAL},${TEAL2})`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <Icon name="Wand2" size={18} style={{ color: DARK }} />
                  </div>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: DARK }}>Попробовать примерку</div>
                    <div style={{ fontSize: 11.5, color: "#94A3B8" }}>Бесплатно, результат за секунды</div>
                  </div>
                </div>

                {/* Загрузка фото */}
                <input ref={fileRef} type="file" accept="image/*" onChange={handleFileChange} style={{ display: "none" }} />
                {photoPreview ? (
                  <div style={{ position: "relative", borderRadius: 12, overflow: "hidden", border: "1px solid #E2E8F0", marginBottom: 14 }}>
                    <img src={photoPreview} alt="Загруженное фото" style={{ width: "100%", maxHeight: 240, objectFit: "contain", display: "block", background: "#f8fafc" }} />
                    <button
                      onClick={() => fileRef.current?.click()}
                      style={{ position: "absolute", top: 8, right: 8, display: "flex", alignItems: "center", gap: 6, background: "rgba(15,23,42,0.75)", color: "#fff", border: "none", borderRadius: 8, padding: "6px 10px", fontSize: 11, fontWeight: 600, cursor: "pointer", fontFamily: "Montserrat,sans-serif" }}
                    >
                      <Icon name="RefreshCw" size={12} /> Заменить
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => fileRef.current?.click()}
                    style={{ width: "100%", padding: "28px 14px", borderRadius: 12, border: "1.5px dashed #CBD5E1", background: "#F8FAFC", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: 6, marginBottom: 14, fontFamily: "Montserrat,sans-serif" }}
                  >
                    <Icon name="Upload" size={22} style={{ color: "#94A3B8" }} />
                    <span style={{ fontSize: 12.5, fontWeight: 600, color: "#475569" }}>Загрузите фото — своё или клиента</span>
                    <span style={{ fontSize: 10.5, color: "#94A3B8" }}>JPG, PNG до 8 МБ</span>
                  </button>
                )}

                {/* Сценарий */}
                <div style={{ marginBottom: 14 }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: "#555", marginBottom: 7 }}>Что примерить</div>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 6 }}>
                    {SCENARIOS.map(opt => (
                      <button
                        key={opt.value}
                        onClick={() => setScenario(opt.value)}
                        style={{ padding: "9px 8px", borderRadius: 9, border: `1.5px solid ${scenario === opt.value ? TEAL : "#E2E8F0"}`, background: scenario === opt.value ? "rgba(45,212,191,0.08)" : "#fff", cursor: "pointer", fontFamily: "Montserrat,sans-serif", textAlign: "center" }}
                      >
                        <Icon name={opt.icon} size={15} style={{ color: scenario === opt.value ? TEAL2 : "#bbb", marginBottom: 2 }} />
                        <div style={{ fontSize: 11, fontWeight: 700, color: scenario === opt.value ? TEAL2 : "#333" }}>{opt.label}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Пожелания */}
                <div style={{ marginBottom: 14 }}>
                  <label style={{ fontSize: 11, fontWeight: 700, color: "#555", display: "block", marginBottom: 6 }}>
                    Пожелания (необязательно)
                  </label>
                  <textarea
                    value={wishes}
                    onChange={e => setWishes(e.target.value)}
                    maxLength={1000}
                    rows={2}
                    placeholder="Например: короткое каре с чёлкой, тёплый русый оттенок"
                    style={{ width: "100%", padding: "10px 12px", borderRadius: 9, border: "1.5px solid #E2E8F0", fontSize: 12.5, fontFamily: "Montserrat,sans-serif", resize: "vertical", outline: "none", boxSizing: "border-box", color: DARK, lineHeight: 1.5 }}
                  />
                </div>

                {error && (
                  <div style={{ background: "#fff0f0", border: "1px solid #fcc", borderRadius: 9, padding: "8px 12px", marginBottom: 12, fontSize: 12, color: "#c33", display: "flex", alignItems: "center", gap: 6 }}>
                    <Icon name="AlertCircle" size={13} /> {error}
                  </div>
                )}

                <button
                  onClick={handleTrySubmit}
                  disabled={submitting || !photoPreview}
                  style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, background: !photoPreview ? "#bbb" : `linear-gradient(135deg,${TEAL},${TEAL2})`, color: DARK, border: "none", borderRadius: 11, padding: "13px 20px", fontSize: 14, fontWeight: 700, cursor: !photoPreview ? "not-allowed" : "pointer", fontFamily: "Montserrat,sans-serif" }}
                >
                  <Icon name="Sparkles" size={16} />
                  {photoPreview ? `Получить результат: ${scenarioLabel.toLowerCase()}` : "Сначала загрузите фото"}
                </button>
                <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 10, fontSize: 11, color: "#94A3B8", justifyContent: "center" }}>
                  <Icon name="Lock" size={11} />
                  Понадобится быстрая регистрация — 1 попытка бесплатно
                </div>
              </div>
            </div>
          </div>
        </div>
        <style>{`@media(max-width:960px){.hero-fit-grid{grid-template-columns:1fr!important;}}`}</style>
      </section>
    </>
  );
}
