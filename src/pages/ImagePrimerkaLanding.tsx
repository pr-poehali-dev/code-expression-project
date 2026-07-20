import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "@/lib/helmet";
import BizNavbar from "@/components/BizNavbar";
import BizFooter from "@/components/BizFooter";
import Icon from "@/components/ui/icon";
import { setFittingTrial } from "@/lib/fittingTrial";

const TEAL = "#2DD4BF";
const TEAL2 = "#14B8A6";
const DARK = "#0F172A";
const SERIF = "'Cormorant Garamond', serif";

const PAINS = [
  { icon: "MessageCircleQuestion", title: "«Не то, что я представляла»", desc: "Клиент описывает желаемый образ словами, мастер понимает по-своему — и в зеркале не та картинка, которую ждали." },
  { icon: "Clock3", title: "«Я подумаю» вместо записи", desc: "Клиент сомневается, боится радикальной перемены — и уходит взвешивать решение. Часто не возвращается." },
  { icon: "RefreshCcw", title: "Время и материалы на переделку", desc: "Неудачный результат — это повторный визит и часы работы, которые никто не оплатит дважды." },
];

const GAINS = [
  { icon: "Eye", title: "Клиент видит идею заранее", desc: "Ещё на консультации — визуальный вариант нового образа. Не описание, а картинка для разговора." },
  { icon: "MessagesSquare", title: "Общий язык с мастером", desc: "Пожелание «покороче» и «покороче на 5 см» — разные вещи. Изображение снимает недопонимание." },
  { icon: "ShieldCheck", title: "Больше уверенности в решении", desc: "Клиент записывается, уже представляя результат — меньше сомнений и отмен записи." },
];

const SCENARIOS = [
  { value: "haircut",  label: "Стрижка",        sub: "и укладка волос",  icon: "Scissors" },
  { value: "makeup",   label: "Макияж",         sub: "лица",             icon: "Sparkles" },
  { value: "manicure", label: "Ногти",          sub: "маникюр и дизайн", icon: "Hand" },
  { value: "figure",   label: "Фигура и стиль", sub: "образ и одежда",   icon: "PersonStanding" },
];

const STEPS = [
  { num: "01", title: "Загрузите фото", desc: "Своё или клиента — прямо здесь на странице или в личном кабинете.", icon: "Camera" },
  { num: "02", title: "Выберите цель", desc: "Стрижка, макияж, маникюр или образ целиком — и опишите пожелание в двух словах.", icon: "MessageSquareText" },
  { num: "03", title: "Получите результат", desc: "ИИ покажет визуальный вариант нового образа — обсуждайте его вместе с клиентом.", icon: "Wand2" },
];

const REVIEWS = [
  { name: "Алина Р.", role: "владелица салона, Екатеринбург", text: "Клиентка держала в голове образ из Pinterest, а описать не могла. Показали вариант на её фото — выбрала за минуту, мастер сделал ровно то, что она увидела на экране.", rating: 5 },
  { name: "Марат С.", role: "барбер, Казань", text: "«Покороче, но не слишком» теперь превращается в конкретную картинку. Сомневающихся клиентов стало заметно меньше.", rating: 5 },
  { name: "Виктория Л.", role: "мастер по маникюру, Санкт-Петербург", text: "Раньше клиентка листала картинки в телефоне. Теперь показываю дизайн прямо на её фото — согласование занимает секунды.", rating: 5 },
];

export default function ImagePrimerkaLanding() {
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
      <Helmet>
        <title>ИИ-примерка образа — покажите клиенту идею до записи | Промт Диалог</title>
        <meta name="description" content="Загрузите фото — ИИ покажет визуальный вариант новой стрижки, макияжа, маникюра или образа. Помогите клиенту увидеть идею заранее и увереннее принять решение о записи." />
        <meta name="keywords" content="ии примерка образа, виртуальная примерка для салона красоты, примерка стрижки онлайн, инструменты для мастера бьюти" />
      </Helmet>

      <BizNavbar />

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

              <h1 style={{ fontFamily: SERIF, fontSize: "clamp(36px,5vw,60px)", fontWeight: 500, color: "#fff", lineHeight: 1.1, margin: "0 0 24px", letterSpacing: "-0.5px" }}>
                Клиент сомневается<br />в новом образе?<br />
                <span style={{ color: TEAL }}>Помогите ему увидеть</span><br />
                идею до записи
              </h1>

              <p style={{ fontSize: "clamp(15px,1.5vw,17px)", color: "rgba(255,255,255,0.6)", lineHeight: 1.75, margin: "0 0 32px", fontWeight: 300, maxWidth: 480 }}>
                ИИ-примерка в «Промт Диалоге» помогает салонам и бьюти-мастерам показать клиенту визуальный вариант стрижки, окрашивания, укладки или макияжа — <strong style={{ color: "#fff", fontWeight: 600 }}>ещё до того, как он сядет в кресло</strong>.
              </p>

              <div style={{ display: "flex", gap: 32, paddingTop: 28, borderTop: "1px solid rgba(255,255,255,0.07)", flexWrap: "wrap" }}>
                {[["4 сценария","стрижка, макияж, ногти, стиль"],["1 раз","бесплатно на старте"],["Без опыта","достаточно одного фото"]].map(([v, l], i) => (
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

      {/* ── БОЛИ ──────────────────────────────────────────────────────────── */}
      <section style={{ background: "#fff", padding: "100px 32px" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <div style={{ marginBottom: 56 }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: "#EF4444", textTransform: "uppercase", letterSpacing: "2.5px", marginBottom: 16 }}>Знакомая ситуация?</div>
            <h2 style={{ fontFamily: SERIF, fontSize: "clamp(30px,4vw,46px)", fontWeight: 500, color: DARK, margin: "0 0 16px", lineHeight: 1.1 }}>
              Клиент сомневается —<br />и уходит думать
            </h2>
            <p style={{ fontSize: 15, color: "#64748B", lineHeight: 1.75, margin: 0, maxWidth: 600, fontWeight: 300 }}>
              Перемены во внешности пугают. Без наглядного примера убедить словами получается не всегда.
            </p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 1, background: "#E2E8F0", border: "1px solid #E2E8F0", borderRadius: 4, overflow: "hidden" }} className="pains-grid">
            {PAINS.map(({ icon, title, desc }, i) => (
              <div key={i} style={{ background: "#fff", padding: "32px 26px" }}>
                <div style={{ width: 40, height: 40, borderRadius: 10, background: "rgba(239,68,68,0.08)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 18 }}>
                  <Icon name={icon} size={18} style={{ color: "#EF4444" }} />
                </div>
                <div style={{ fontFamily: SERIF, fontSize: 18, fontWeight: 600, color: DARK, marginBottom: 8, lineHeight: 1.25 }}>{title}</div>
                <div style={{ fontSize: 13, color: "#64748B", lineHeight: 1.7 }}>{desc}</div>
              </div>
            ))}
          </div>
        </div>
        <style>{`@media(max-width:900px){.pains-grid{grid-template-columns:1fr!important;}}`}</style>
      </section>

      {/* ── ЧТО ДАЁТ ИНСТРУМЕНТ ──────────────────────────────────────────── */}
      <section style={{ background: "#F8FAFC", padding: "100px 32px" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <div style={{ marginBottom: 56 }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: TEAL, textTransform: "uppercase", letterSpacing: "2.5px", marginBottom: 16 }}>С примеркой заранее</div>
            <h2 style={{ fontFamily: SERIF, fontSize: "clamp(30px,4vw,46px)", fontWeight: 500, color: DARK, margin: 0, lineHeight: 1.1 }}>
              Уверенность вместо сомнений
            </h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 1, background: "#E2E8F0", border: "1px solid #E2E8F0", borderRadius: 4, overflow: "hidden" }} className="gains-grid">
            {GAINS.map(({ icon, title, desc }, i) => (
              <div key={i} style={{ background: "#fff", padding: "32px 26px" }}>
                <div style={{ width: 40, height: 40, borderRadius: 10, background: "rgba(45,212,191,0.1)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 18 }}>
                  <Icon name={icon} size={18} style={{ color: TEAL }} />
                </div>
                <div style={{ fontFamily: SERIF, fontSize: 18, fontWeight: 600, color: DARK, marginBottom: 8, lineHeight: 1.25 }}>{title}</div>
                <div style={{ fontSize: 13, color: "#64748B", lineHeight: 1.6 }}>{desc}</div>
              </div>
            ))}
          </div>
        </div>
        <style>{`@media(max-width:900px){.gains-grid{grid-template-columns:1fr!important;}}`}</style>
      </section>

      {/* ── ГАЛЕРЕЯ ПРИМЕРОВ (место под фото до/после) ───────────────────── */}
      <section id="examples" style={{ background: DARK, padding: "100px 32px", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: 800, height: 400, background: "radial-gradient(ellipse,rgba(45,212,191,0.06) 0%,transparent 65%)", pointerEvents: "none" }} />
        <div style={{ maxWidth: 1280, margin: "0 auto", position: "relative" }}>
          <div style={{ marginBottom: 48 }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: TEAL, textTransform: "uppercase", letterSpacing: "2.5px", marginBottom: 16 }}>Примеры результата</div>
            <h2 style={{ fontFamily: SERIF, fontSize: "clamp(30px,4vw,46px)", fontWeight: 500, color: "#fff", margin: 0, lineHeight: 1.1 }}>
              Как выглядит примерка
            </h2>
          </div>
          {/* Место под 4 фото-примера "до/после" — по одному на каждый сценарий: стрижка, макияж, маникюр, образ/стиль.
              Формат: исходное фото клиента слева, сгенерированный результат справа, в едином кадре или парой карточек.
              Изображения должны выглядеть реалистично и аккуратно — без ярких неоновых эффектов, в спокойной цветовой гамме салона. */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16 }} className="examples-grid">
            {SCENARIOS.map(({ icon, label }, i) => (
              <div key={i} style={{ borderRadius: 14, overflow: "hidden", border: "1px solid rgba(255,255,255,0.08)", background: "rgba(255,255,255,0.02)" }}>
                <div style={{ aspectRatio: "3/4", background: "linear-gradient(160deg,rgba(255,255,255,0.04),rgba(255,255,255,0.01))", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 10 }}>
                  {/* [ФОТО-ПРИМЕР "ДО/ПОСЛЕ" — ${label.toUpperCase()}] */}
                  <Icon name={icon} size={28} style={{ color: "rgba(45,212,191,0.4)" }} />
                  <span style={{ fontSize: 11, color: "rgba(255,255,255,0.3)", textAlign: "center", padding: "0 12px" }}>Фото-пример «до/после» — {label.toLowerCase()}</span>
                </div>
                <div style={{ padding: "12px 14px", textAlign: "center" }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: "#fff" }}>{label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <style>{`@media(max-width:900px){.examples-grid{grid-template-columns:1fr 1fr!important;}}@media(max-width:520px){.examples-grid{grid-template-columns:1fr!important;}}`}</style>
      </section>

      {/* ── КАК ЭТО РАБОТАЕТ ──────────────────────────────────────────────── */}
      <section style={{ background: "#fff", padding: "100px 32px" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <div style={{ marginBottom: 64 }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: TEAL, textTransform: "uppercase", letterSpacing: "2.5px", marginBottom: 16 }}>Три шага</div>
            <h2 style={{ fontFamily: SERIF, fontSize: "clamp(30px,4vw,46px)", fontWeight: 500, color: DARK, margin: 0, lineHeight: 1.1 }}>
              От фото до готовой идеи
            </h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 32 }} className="steps-grid">
            {STEPS.map(({ num, title, desc, icon }, i) => (
              <div key={i}>
                <div style={{ width: 64, height: 64, borderRadius: "50%", background: i === 0 ? `linear-gradient(135deg,${TEAL},${TEAL2})` : "#F1F5F9", border: i === 0 ? "none" : "1px solid #E2E8F0", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 20, boxShadow: i === 0 ? "0 8px 24px rgba(45,212,191,0.3)" : "none" }}>
                  <Icon name={icon} size={24} style={{ color: i === 0 ? DARK : TEAL }} />
                </div>
                <div style={{ fontSize: 11, color: TEAL, fontWeight: 700, letterSpacing: "1.5px", marginBottom: 8 }}>Шаг {num}</div>
                <div style={{ fontFamily: SERIF, fontSize: 19, fontWeight: 600, color: DARK, marginBottom: 8, lineHeight: 1.2 }}>{title}</div>
                <div style={{ fontSize: 13, color: "#64748B", lineHeight: 1.6 }}>{desc}</div>
              </div>
            ))}
          </div>
        </div>
        <style>{`@media(max-width:700px){.steps-grid{grid-template-columns:1fr!important;}}`}</style>
      </section>

      {/* ── ОТЗЫВЫ ─────────────────────────────────────────────────────────── */}
      <section style={{ background: "#F8FAFC", padding: "100px 32px" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <div style={{ marginBottom: 56 }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: TEAL, textTransform: "uppercase", letterSpacing: "2.5px", marginBottom: 16 }}>Отзывы мастеров и салонов</div>
            <h2 style={{ fontFamily: SERIF, fontSize: "clamp(30px,4vw,46px)", fontWeight: 500, color: DARK, margin: 0, lineHeight: 1.1 }}>
              Что говорят те, кто уже пробует
            </h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 1, background: "#E2E8F0", border: "1px solid #E2E8F0", borderRadius: 4, overflow: "hidden" }} className="reviews-grid">
            {REVIEWS.map(({ name, role, text, rating }, i) => (
              <div key={i} style={{ background: "#fff", padding: "30px 26px", display: "flex", flexDirection: "column" }}>
                <div style={{ display: "flex", gap: 3, marginBottom: 14 }}>
                  {Array.from({ length: rating }).map((_, si) => (
                    <Icon key={si} name="Star" size={13} style={{ color: "#F59E0B", fill: "#F59E0B" }} />
                  ))}
                </div>
                <p style={{ fontFamily: SERIF, fontSize: 16, color: DARK, lineHeight: 1.6, margin: "0 0 18px", fontStyle: "italic", flex: 1 }}>
                  «{text}»
                </p>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{ width: 38, height: 38, borderRadius: "50%", background: `linear-gradient(135deg,${TEAL},${TEAL2})`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <span style={{ fontSize: 14, fontWeight: 700, color: DARK }}>{name.charAt(0)}</span>
                  </div>
                  <div>
                    <div style={{ fontSize: 13.5, fontWeight: 700, color: DARK }}>{name}</div>
                    <div style={{ fontSize: 11.5, color: "#64748B" }}>{role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <style>{`@media(max-width:900px){.reviews-grid{grid-template-columns:1fr!important;}}`}</style>
      </section>

      {/* ── ФИНАЛЬНЫЙ CTA ─────────────────────────────────────────────────── */}
      <section style={{ background: DARK, padding: "120px 32px", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: 600, height: 350, background: "radial-gradient(ellipse,rgba(45,212,191,0.08) 0%,transparent 65%)", pointerEvents: "none" }} />
        <div style={{ maxWidth: 1280, margin: "0 auto", position: "relative", textAlign: "center" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, border: "1px solid rgba(45,212,191,0.25)", borderRadius: 100, padding: "7px 20px", marginBottom: 32 }}>
            <div style={{ width: 6, height: 6, borderRadius: "50%", background: TEAL }} />
            <span style={{ fontSize: 12, color: TEAL, fontWeight: 500, letterSpacing: "1.5px", textTransform: "uppercase" }}>Бесплатно на первый раз</span>
          </div>
          <h2 style={{ fontFamily: SERIF, fontSize: "clamp(32px,4.5vw,54px)", fontWeight: 500, color: "#fff", margin: "0 auto 20px", lineHeight: 1.1, maxWidth: 680 }}>
            Не убеждайте словами — покажите идею
          </h2>
          <p style={{ fontSize: "clamp(14px,1.4vw,16px)", color: "rgba(255,255,255,0.5)", lineHeight: 1.75, margin: "0 auto 40px", fontWeight: 300, maxWidth: 560 }}>
            Прокрутите наверх, загрузите фото и попробуйте примерку прямо сейчас — первый результат бесплатно.
          </p>
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            style={{
              display: "inline-flex", alignItems: "center", gap: 10,
              padding: "17px 36px", borderRadius: 2, border: "none", cursor: "pointer",
              background: `linear-gradient(135deg,${TEAL},${TEAL2})`,
              color: DARK, fontSize: 16, fontWeight: 700,
              boxShadow: "0 12px 40px rgba(45,212,191,0.4)",
              fontFamily: "Montserrat,sans-serif",
            }}>
            <Icon name="ArrowUp" size={18} />
            Попробовать примерку бесплатно
          </button>
        </div>
      </section>

      <BizFooter />
    </>
  );
}