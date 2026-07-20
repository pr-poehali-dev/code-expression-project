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
  { icon: "MessageCircleQuestion", title: "«Я представляла совсем иначе»", desc: "Даже если работа выполнена качественно, клиент оценивает её через свою внутреннюю картинку. Если эта картинка не была проговорена — мастер может оказаться виноватым в чужом ожидании." },
  { icon: "AlertTriangle", title: "Сложный разговор уже после услуги", desc: "Вместо спокойного согласования до начала работы — объяснения у зеркала, скидка, переделка или неприятный отзыв." },
  { icon: "ShieldAlert", title: "Вы осторожничаете там, где могли бы предложить больше", desc: "Когда нет ясности, проще сделать «как обычно». Так безопаснее — но сложнее показать экспертность и предложить более сложный образ." },
  { icon: "CalendarX", title: "Клиент не записывается на изменения", desc: "Он хочет перемен, но боится не узнать себя в зеркале. И выбирает привычное: «Давайте пока ничего радикального»." },
  { icon: "Clock3", title: "Ваше время уходит на исправление недопонимания", desc: "Переделка — это не только материалы и часы. Это эмоциональная нагрузка, потерянное окно в записи и удар по уверенности в своей работе." },
];

const GAINS = [
  { icon: "Eye", title: "Меньше сюрпризов у зеркала", desc: "Мастер и клиент видят одно и то же направление образа ещё до начала работы — не два разных представления." },
  { icon: "MessagesSquare", title: "Предметный разговор вместо общих слов", desc: "Не «хочу что-нибудь стильное, но не слишком», а «вот такая длина нравится, но чёлку не хочу»." },
  { icon: "ShieldCheck", title: "Меньше поводов для спора после услуги", desc: "Если направление было показано и обсуждено заранее — сложнее сказать «я представляла по-другому»." },
];

const SCENARIOS = [
  { value: "haircut",  label: "Стрижка",        sub: "и укладка волос",  icon: "Scissors" },
  { value: "makeup",   label: "Макияж",         sub: "лица",             icon: "Sparkles" },
  { value: "manicure", label: "Ногти",          sub: "маникюр и дизайн", icon: "Hand" },
  { value: "figure",   label: "Фигура и стиль", sub: "образ и одежда",   icon: "PersonStanding" },
];

const WHEN_NEEDED = [
  { icon: "UserPlus", text: "Новый клиент, которого мастер ещё не знает" },
  { icon: "HelpCircle", text: "Запрос «хочу что-то поменять, но не понимаю что»" },
  { icon: "Wand2", text: "Сложное окрашивание, новая стрижка, макияж на событие" },
  { icon: "Images", text: "Клиент показывает несколько референсов: «Ну, примерно вот так»" },
  { icon: "EyeOff", text: "Мастер видит, что идея может не подойти, но не хочет обесценить желание клиента" },
  { icon: "Gem", text: "Дорогая услуга, где ошибка особенно заметна и болезненна" },
];

const STEPS = [
  { num: "01", title: "Загрузите фото", desc: "Своё или клиента — прямо здесь на странице или в личном кабинете.", icon: "Camera" },
  { num: "02", title: "Выберите направление", desc: "Стрижка, макияж, маникюр или образ целиком — и опишите пожелание в двух словах.", icon: "MessageSquareText" },
  { num: "03", title: "Обсудите результат вместе", desc: "ИИ покажет возможное направление — спросите: «Что нравится? Что точно не ваше? Что оставляем?»", icon: "MessagesSquare" },
];

const REVIEWS = [
  { name: "Алина Р.", role: "владелица салона, Екатеринбург", text: "Раньше на новых клиентах чувствовала себя как сапёр — угадала или нет. Теперь сначала показываю направление и слышу «да, точно не это» ещё до начала работы.", rating: 5 },
  { name: "Марат С.", role: "барбер, Казань", text: "На сложных стрижках теперь сначала согласовываю направление. Если клиенту не нравится — узнаю об этом сразу, а не после уже сделанной работы.", rating: 5 },
  { name: "Виктория Л.", role: "мастер по маникюру, Санкт-Петербург", text: "На дорогом дизайне ошибка обходится дорого — и себе, и клиенту. Теперь сверяем направление заранее, и обеим сторонам спокойнее.", rating: 5 },
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
        <title>ИИ-примерка образа — согласуйте ожидания до услуги | Промт Диалог</title>
        <meta name="description" content="Не угадывайте, какой результат клиент назвал «красиво». Покажите направление образа до записи или до начала работы и обсудите ожидания на одном языке — ИИ-примерка для бьюти-мастеров и салонов." />
        <meta name="keywords" content="ии примерка образа, согласование ожиданий с клиентом, виртуальная примерка для салона красоты, примерка стрижки онлайн, инструменты для мастера бьюти" />
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

      {/* ── УЗНАВАНИЕ СИТУАЦИИ ────────────────────────────────────────────── */}
      <section style={{ background: "#fff", padding: "90px 32px 60px" }}>
        <div style={{ maxWidth: 900, margin: "0 auto", textAlign: "center" }}>
          <h2 style={{ fontFamily: SERIF, fontSize: "clamp(26px,3.4vw,38px)", fontWeight: 500, color: DARK, margin: "0 0 20px", lineHeight: 1.25 }}>
            Хороший мастер отвечает за технику.<br />
            Но репутация часто зависит от того,<br />о чём не договорились заранее.
          </h2>
          <p style={{ fontSize: 15, color: "#64748B", lineHeight: 1.8, margin: "0 0 16px", fontWeight: 300 }}>
            Клиент может говорить: «Хочу освежить образ», «Сделайте современно», «Как на этой фотографии». Вы слышите одно, он представляет другое — и разница обнаруживается только в зеркале.
          </p>
          <p style={{ fontSize: 15, color: "#64748B", lineHeight: 1.8, margin: 0, fontWeight: 300 }}>
            Это не всегда ошибка мастера. Часто это обычная проблема: человеку сложно словами описать образ, который он сам ещё не до конца сформулировал.
          </p>
        </div>
      </section>

      {/* ── БОЛИ — ЧЕРЕЗ МАСТЕРА ──────────────────────────────────────────── */}
      <section style={{ background: "#fff", padding: "40px 32px 100px" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <div style={{ marginBottom: 56 }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: "#EF4444", textTransform: "uppercase", letterSpacing: "2.5px", marginBottom: 16 }}>Когда ожидания не совпали</div>
            <h2 style={{ fontFamily: SERIF, fontSize: "clamp(30px,4vw,46px)", fontWeight: 500, color: DARK, margin: "0 0 16px", lineHeight: 1.1 }}>
              Последствия остаются у мастера
            </h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 1, background: "#E2E8F0", border: "1px solid #E2E8F0", borderRadius: 4, overflow: "hidden" }} className="pains-grid">
            {PAINS.map(({ icon, title, desc }, i) => (
              <div key={i} style={{ background: "#fff", padding: "32px 26px" }}>
                <div style={{ width: 40, height: 40, borderRadius: 10, background: "rgba(239,68,68,0.08)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 18 }}>
                  <Icon name={icon} size={18} style={{ color: "#EF4444" }} />
                </div>
                <div style={{ fontFamily: SERIF, fontSize: 17, fontWeight: 600, color: DARK, marginBottom: 8, lineHeight: 1.3 }}>{title}</div>
                <div style={{ fontSize: 13, color: "#64748B", lineHeight: 1.7 }}>{desc}</div>
              </div>
            ))}
          </div>
        </div>
        <style>{`@media(max-width:900px){.pains-grid{grid-template-columns:1fr!important;}}`}</style>
      </section>

      {/* ── КОГДА НУЖНА ПРИМЕРКА ──────────────────────────────────────────── */}
      <section style={{ background: "#F8FAFC", padding: "100px 32px" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <div style={{ marginBottom: 48, maxWidth: 720 }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: TEAL, textTransform: "uppercase", letterSpacing: "2.5px", marginBottom: 16 }}>Не для каждой услуги</div>
            <h2 style={{ fontFamily: SERIF, fontSize: "clamp(28px,3.6vw,42px)", fontWeight: 500, color: DARK, margin: "0 0 16px", lineHeight: 1.15 }}>
              Клиент не всегда приходит экспериментировать
            </h2>
            <p style={{ fontSize: 15, color: "#64748B", lineHeight: 1.8, margin: 0, fontWeight: 300 }}>
              Чаще он приходит за привычной услугой — и там примерка не нужна. Инструмент нужен именно в точках, где есть неопределённость:
            </p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 14 }} className="when-grid">
            {WHEN_NEEDED.map(({ icon, text }, i) => (
              <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 14, background: "#fff", borderRadius: 14, border: "1px solid #E2E8F0", padding: "18px 20px" }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: "rgba(45,212,191,0.1)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <Icon name={icon} size={16} style={{ color: TEAL2 }} />
                </div>
                <div style={{ fontSize: 14, color: DARK, lineHeight: 1.6, paddingTop: 6 }}>{text}</div>
              </div>
            ))}
          </div>
        </div>
        <style>{`@media(max-width:700px){.when-grid{grid-template-columns:1fr!important;}}`}</style>
      </section>

      {/* ── ГЛАВНАЯ МЫСЛЬ ─────────────────────────────────────────────────── */}
      <section style={{ background: DARK, padding: "90px 32px", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: 700, height: 380, background: "radial-gradient(ellipse,rgba(45,212,191,0.07) 0%,transparent 65%)", pointerEvents: "none" }} />
        <div style={{ maxWidth: 820, margin: "0 auto", position: "relative", textAlign: "center" }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: TEAL, textTransform: "uppercase", letterSpacing: "2.5px", marginBottom: 20 }}>Главная мысль</div>
          <h2 style={{ fontFamily: SERIF, fontSize: "clamp(26px,3.4vw,40px)", fontWeight: 500, color: "#fff", margin: "0 0 24px", lineHeight: 1.35 }}>
            ИИ-примерка — не инструмент, чтобы уговорить клиента на перемены.
          </h2>
          <p style={{ fontSize: "clamp(16px,1.8vw,20px)", color: "rgba(255,255,255,0.75)", lineHeight: 1.7, margin: 0, fontWeight: 300 }}>
            Это способ согласовать ожидания до услуги, чтобы мастер не работал вслепую, а клиент понимал, на что соглашается.
          </p>
        </div>
      </section>

      {/* ── ЧЕСТНОСТЬ О РЕЗУЛЬТАТЕ ────────────────────────────────────────── */}
      <section style={{ background: "#fff", padding: "90px 32px" }}>
        <div style={{ maxWidth: 780, margin: "0 auto" }}>
          <div style={{ background: "#F8FAFC", border: "1px solid #E2E8F0", borderRadius: 18, padding: "36px 36px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
              <div style={{ width: 38, height: 38, borderRadius: 10, background: "rgba(45,212,191,0.1)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <Icon name="Info" size={18} style={{ color: TEAL2 }} />
              </div>
              <div style={{ fontFamily: SERIF, fontSize: 19, fontWeight: 600, color: DARK }}>Важно: это не гарантия результата</div>
            </div>
            <p style={{ fontSize: 14.5, color: "#64748B", lineHeight: 1.8, margin: "0 0 16px", fontWeight: 300 }}>
              Сгенерированное изображение — не гарантия точного результата: реальный образ зависит от типа волос, состояния кожи, техники, освещения и других факторов.
            </p>
            <p style={{ fontSize: 14.5, color: DARK, lineHeight: 1.8, margin: 0, fontWeight: 400 }}>
              Но это сильная точка для диалога: «Вот направление. Что вам здесь нравится? Что точно не ваше? Что оставляем?» Именно так снижается риск недопонимания.
            </p>
          </div>
        </div>
      </section>

      {/* ── ПЕРЕХОД: ПРИМЕРКА НЕ ЗАМЕНЯЕТ КОНСУЛЬТАЦИЮ ────────────────────── */}
      <section style={{ background: "#F8FAFC", padding: "90px 32px" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <h2 style={{ fontFamily: SERIF, fontSize: "clamp(28px,3.6vw,42px)", fontWeight: 500, color: DARK, margin: "0 0 16px", lineHeight: 1.2 }}>
              Примерка не заменяет консультацию.<br />Она делает её понятнее.
            </h2>
            <p style={{ fontSize: 15, color: "#64748B", lineHeight: 1.8, margin: "0 auto", maxWidth: 600, fontWeight: 300 }}>
              Когда клиент видит возможное направление образа, разговор становится предметным.
            </p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, maxWidth: 900, margin: "0 auto" }} className="before-after-grid">
            <div style={{ background: "#fff", border: "1.5px solid #FCA5A5", borderRadius: 16, padding: "26px 24px" }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: "#EF4444", textTransform: "uppercase", letterSpacing: 1, marginBottom: 14 }}>Было</div>
              <div style={{ fontSize: 15, color: "#64748B", lineHeight: 1.7, fontStyle: "italic" }}>«Я хочу что-нибудь стильное, но не слишком».</div>
            </div>
            <div style={{ background: "#fff", border: "1.5px solid #99F6E4", borderRadius: 16, padding: "26px 24px" }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: TEAL2, textTransform: "uppercase", letterSpacing: 1, marginBottom: 14 }}>Стало</div>
              <div style={{ fontSize: 15, color: DARK, lineHeight: 1.7, fontStyle: "italic" }}>«Вот такая длина мне нравится, но чёлку не хочу». «Этот оттенок красиво, но для меня слишком ярко».</div>
            </div>
          </div>
        </div>
        <style>{`@media(max-width:700px){.before-after-grid{grid-template-columns:1fr!important;}}`}</style>
      </section>

      {/* ── ЧТО ДАЁТ ИНСТРУМЕНТ ──────────────────────────────────────────── */}
      <section style={{ background: "#fff", padding: "100px 32px" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <div style={{ marginBottom: 56 }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: TEAL, textTransform: "uppercase", letterSpacing: "2.5px", marginBottom: 16 }}>С согласованием заранее</div>
            <h2 style={{ fontFamily: SERIF, fontSize: "clamp(30px,4vw,46px)", fontWeight: 500, color: DARK, margin: 0, lineHeight: 1.1 }}>
              Меньше риска — больше доверия
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
            <div style={{ fontSize: 12, fontWeight: 600, color: TEAL, textTransform: "uppercase", letterSpacing: "2.5px", marginBottom: 16 }}>Примеры направления</div>
            <h2 style={{ fontFamily: SERIF, fontSize: "clamp(30px,4vw,46px)", fontWeight: 500, color: "#fff", margin: 0, lineHeight: 1.1 }}>
              Как выглядит согласование образа
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
              От фото до согласованного направления
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
            Согласуйте ожидания — не угадывайте их
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