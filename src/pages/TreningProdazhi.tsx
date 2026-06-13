import { useState } from "react";
import { Link } from "react-router-dom";
import BizNavbar from "@/components/BizNavbar";
import BizFooter from "@/components/BizFooter";
import Icon from "@/components/ui/icon";

const TEAL = "#2DD4BF";
const DARK = "#0F172A";
const SERIF = "'Cormorant Garamond', serif";
const PURPLE = "hsl(270,65%,52%)";
const PURPLE_BG = "hsl(270,65%,97%)";

const BENEFITS = [
  { icon: "MessageCircle", text: "Диалог, который возвращает клиентов" },
  { icon: "Ear", text: "Навык слушать и слышать человека" },
  { icon: "ShieldCheck", text: "Продажи без давления и стыда" },
  { icon: "ClipboardList", text: "Практика на реальных случаях" },
  { icon: "GraduationCap", text: "Личные техники эксперта с 17+ летним опытом" },
];

const OUTCOMES = [
  "Почувствуете себя увереннее в разговоре с клиентом — без страха «навязаться»",
  "Узнаете, как вести диалог так, чтобы ваше мастерство замечали и ценили",
  "Научитесь выявлять реальные потребности клиента, чтобы он сам хотел вернуться",
  "Получите готовые фразы и техники для ответов на возражения — спокойно и по-взрослому",
  "Освоите новый подход к продажам через заботу, а не манипуляцию",
  "Прокачаете навык слушания — важнейший для мастера и управленца",
  "Сможете сразу применить инструменты в своей работе",
];

const FORMAT = [
  { icon: "CalendarDays", text: "Проходит по воскресеньям в уютном зале в центре Москвы" },
  { icon: "Clock", text: "6-часовой интерактив с практикой и разбором реальных кейсов" },
  { icon: "Users", text: "Группы до 20 человек — максимум внимания каждому" },
  { icon: "Zap", text: "После участия — +1500 Энергии на платформе «Про диалог»" },
  { icon: "Mail", text: "После оплаты — письмо с подтверждением, датой и инструкцией" },
];

const STEPS = [
  { num: "01", title: "Зарегистрируйтесь", desc: "Создайте аккаунт на платформе или войдите в личный кабинет" },
  { num: "02", title: "Пополните баланс", desc: "Внесите 9 900 ₽ на баланс платформы удобным способом" },
  { num: "03", title: "Запишитесь", desc: "В разделе «Академия» нажмите «Записаться» — место забронировано" },
  { num: "04", title: "Получите подтверждение", desc: "Менеджер свяжется с вами и сообщит ближайшую дату и адрес" },
];

const ENERGY_FEATURES = [
  { icon: "Image", text: "Генератор изображений для соцсетей" },
  { icon: "FileText", text: "Готовые посты и сценарии для Reels" },
  { icon: "MessageSquare", text: "Скрипты общения с клиентом" },
  { icon: "Star", text: "Ответы на отзывы (позитивные и негативные)" },
  { icon: "Brain", text: "ИИ-агенты для бизнеса" },
  { icon: "TrendingUp", text: "Инструменты для удержания и возврата клиентов" },
];

function DateModal({ onClose }: { onClose: () => void }) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [sent, setSent] = useState(false);

  const submit = () => {
    if (!name.trim() || !phone.trim()) return;
    setSent(true);
  };

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 1000, background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)", display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}
      onClick={onClose}>
      <div style={{ background: "#fff", borderRadius: 20, padding: "36px 32px", maxWidth: 440, width: "100%", position: "relative" }}
        onClick={e => e.stopPropagation()}>
        <button onClick={onClose} style={{ position: "absolute", top: 16, right: 16, background: "none", border: "none", cursor: "pointer", color: "#aaa" }}>
          <Icon name="X" size={20} />
        </button>
        {sent ? (
          <div style={{ textAlign: "center", padding: "16px 0" }}>
            <div style={{ width: 56, height: 56, borderRadius: "50%", background: "hsl(130,60%,94%)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
              <Icon name="Check" size={26} style={{ color: "hsl(130,60%,40%)" }} />
            </div>
            <div style={{ fontSize: 20, fontWeight: 700, color: DARK, marginBottom: 8 }}>Заявка отправлена!</div>
            <div style={{ fontSize: 14, color: "#64748b", lineHeight: 1.7 }}>Мы свяжемся с вами в ближайшее время и сообщим дату ближайшего тренинга.</div>
          </div>
        ) : (
          <>
            <div style={{ fontSize: 20, fontWeight: 700, color: DARK, marginBottom: 6, fontFamily: SERIF }}>Узнать ближайшую дату</div>
            <div style={{ fontSize: 13, color: "#64748b", marginBottom: 24, lineHeight: 1.6 }}>Оставьте контакты — менеджер свяжется и сообщит дату и место проведения тренинга</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <input value={name} onChange={e => setName(e.target.value)} placeholder="Ваше имя"
                style={{ padding: "12px 14px", borderRadius: 10, border: "1.5px solid #e2e8f0", fontSize: 14, fontFamily: "Inter, sans-serif", outline: "none", width: "100%", boxSizing: "border-box" }} />
              <input value={phone} onChange={e => setPhone(e.target.value)} placeholder="Телефон или e-mail"
                style={{ padding: "12px 14px", borderRadius: 10, border: "1.5px solid #e2e8f0", fontSize: 14, fontFamily: "Inter, sans-serif", outline: "none", width: "100%", boxSizing: "border-box" }} />
              <button onClick={submit} disabled={!name.trim() || !phone.trim()}
                style={{ padding: "14px", borderRadius: 10, border: "none", cursor: name.trim() && phone.trim() ? "pointer" : "default",
                  background: name.trim() && phone.trim() ? `linear-gradient(135deg, ${TEAL}, #14B8A6)` : "#e2e8f0",
                  color: name.trim() && phone.trim() ? DARK : "#aaa", fontSize: 15, fontWeight: 600, fontFamily: "Inter, sans-serif" }}>
                Отправить заявку
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default function TreningProdazhi() {
  const [showModal, setShowModal] = useState(false);

  return (
    <div style={{ fontFamily: "Inter, sans-serif", background: "#fff", color: DARK }}>
      <BizNavbar />

      {/* ── HERO ─────────────────────────────────────────────────────────────── */}
      <section style={{
        background: `radial-gradient(120% 100% at 80% 0%, #1a0a3c 0%, ${DARK} 55%, #060B16 100%)`,
        paddingTop: 140, paddingBottom: 80, position: "relative", overflow: "hidden",
      }}>
        <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)", backgroundSize: "48px 48px", pointerEvents: "none" }} />
        <div style={{ position: "absolute", top: "30%", right: "10%", width: 500, height: 500, borderRadius: "50%", background: `radial-gradient(circle, hsla(270,65%,52%,0.12) 0%, transparent 65%)`, pointerEvents: "none" }} />

        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 32px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 420px", gap: 64, alignItems: "center" }} className="hero-training-grid">
            <div>
              <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(139,92,246,0.15)", border: "1px solid rgba(139,92,246,0.3)", borderRadius: 100, padding: "6px 16px", fontSize: 12, fontWeight: 600, color: "#c4b5fd", marginBottom: 28, letterSpacing: "0.05em" }}>
                <Icon name="MapPin" size={12} /> ОФЛАЙН-ТРЕНИНГ · МОСКВА
              </div>
              <h1 style={{ fontFamily: SERIF, fontSize: "clamp(40px, 5vw, 68px)", fontWeight: 600, color: "#fff", margin: "0 0 20px", lineHeight: 1.1 }}>
                Продажи<br />без продаж
              </h1>
              <p style={{ fontSize: "clamp(15px, 1.6vw, 18px)", color: "rgba(255,255,255,0.65)", margin: "0 0 12px", lineHeight: 1.7, maxWidth: 520 }}>
                Тренинг для мастеров бьюти и wellness, которые хотят вернуть клиентов и найти уверенность в диалоге
              </p>
              <p style={{ fontSize: 14, color: "rgba(255,255,255,0.45)", margin: "0 0 36px", lineHeight: 1.6 }}>
                Ведущий — <strong style={{ color: "rgba(255,255,255,0.7)" }}>Сергей Водопьянов</strong>, практик с 17+ летним стажем в салонном бизнесе
              </p>

              <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                <Link to="/cabinet" style={{
                  display: "inline-flex", alignItems: "center", gap: 8,
                  padding: "14px 28px", borderRadius: 2,
                  background: `linear-gradient(135deg, ${PURPLE}, hsl(270,65%,38%))`,
                  color: "#fff", fontSize: 15, fontWeight: 600, textDecoration: "none",
                  boxShadow: `0 8px 32px hsla(270,65%,52%,0.35)`,
                  transition: "all 0.3s",
                }}>
                  <Icon name="Ticket" size={16} />
                  Записаться — 9 900 ₽
                </Link>
                <button onClick={() => setShowModal(true)} style={{
                  display: "inline-flex", alignItems: "center", gap: 8,
                  padding: "14px 24px", borderRadius: 2,
                  border: "1px solid rgba(255,255,255,0.2)",
                  background: "transparent", color: "#fff", fontSize: 15, fontWeight: 400,
                  cursor: "pointer", fontFamily: "Inter, sans-serif", transition: "all 0.3s",
                }}>
                  <Icon name="Calendar" size={16} />
                  Узнать ближайшую дату
                </button>
              </div>

              {/* Энергия-бейдж */}
              <div style={{ display: "inline-flex", alignItems: "center", gap: 10, marginTop: 28, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12, padding: "12px 18px" }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: "hsl(40,90%,20%)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <Icon name="Zap" size={18} style={{ color: "hsl(40,90%,60%)" }} />
                </div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: "hsl(40,90%,65%)" }}>+1500 Энергии</div>
                  <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", lineHeight: 1.5 }}>начисляются после участия и используются<br />на инструменты платформы «Про диалог»</div>
                </div>
              </div>
            </div>

            {/* Карточка-анонс */}
            <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 24, padding: "32px 28px", backdropFilter: "blur(12px)" }}>
              <div style={{ fontSize: 11, fontWeight: 600, color: "rgba(255,255,255,0.35)", letterSpacing: "2px", textTransform: "uppercase", marginBottom: 20 }}>О ТРЕНИНГЕ</div>
              {[
                { icon: "Clock", label: "Длительность", value: "6 часов" },
                { icon: "Users", label: "Размер группы", value: "до 20 человек" },
                { icon: "CalendarDays", label: "График", value: "По воскресеньям" },
                { icon: "MapPin", label: "Место", value: "Центр Москвы" },
                { icon: "Banknote", label: "Участие", value: "9 900 ₽" },
                { icon: "Zap", label: "Бонус", value: "+1500 Энергии" },
              ].map(r => (
                <div key={r.label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingBottom: 14, marginBottom: 14, borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "rgba(255,255,255,0.45)" }}>
                    <Icon name={r.icon} size={13} />
                    {r.label}
                  </div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: "#fff" }}>{r.value}</div>
                </div>
              ))}
              <Link to="/cabinet" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, padding: "13px", borderRadius: 10, background: `linear-gradient(135deg, ${PURPLE}, hsl(270,65%,38%))`, color: "#fff", fontSize: 14, fontWeight: 600, textDecoration: "none", marginTop: 4 }}>
                <Icon name="Ticket" size={15} /> Занять место на тренинге
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── О ТРЕНИНГЕ ────────────────────────────────────────────────────────── */}
      <section style={{ padding: "80px 32px", maxWidth: 1280, margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 64, alignItems: "center" }} className="about-training-grid">
          <div>
            <div style={{ fontSize: 12, fontWeight: 600, color: TEAL, letterSpacing: "2px", textTransform: "uppercase", marginBottom: 16 }}>ЧТО ВАС ЖДЁТ?</div>
            <h2 style={{ fontFamily: SERIF, fontSize: "clamp(28px, 3.5vw, 44px)", fontWeight: 600, color: DARK, margin: "0 0 20px", lineHeight: 1.2 }}>
              Честные продажи<br />через заботу
            </h2>
            <p style={{ fontSize: 15, color: "#64748b", lineHeight: 1.8, margin: "0 0 32px" }}>
              Многим мастерам сложно предлагать свои услуги — хочется помочь клиенту, а не «продавать». На этом тренинге вы поймёте, как вести диалог честно и экологично, чтобы клиенты возвращались, а вы чувствовали уважение и уверенность в себе.
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {BENEFITS.map(b => (
                <div key={b.text} style={{ display: "flex", alignItems: "center", gap: 14 }}>
                  <div style={{ width: 40, height: 40, borderRadius: 10, background: PURPLE_BG, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <Icon name={b.icon} size={18} style={{ color: PURPLE }} />
                  </div>
                  <span style={{ fontSize: 14, color: "#334155", lineHeight: 1.5 }}>{b.text}</span>
                </div>
              ))}
            </div>
          </div>
          <div style={{ background: `linear-gradient(135deg, ${PURPLE_BG}, hsl(270,65%,93%))`, borderRadius: 24, padding: "40px 36px", border: `1px solid hsla(270,65%,52%,0.15)` }}>
            <Icon name="Quote" size={36} style={{ color: PURPLE, opacity: 0.4, marginBottom: 20 }} />
            <p style={{ fontSize: 17, color: "#1e1b4b", lineHeight: 1.8, margin: "0 0 24px", fontStyle: "italic" }}>
              «Продажа — это не то, что вы делаете с клиентом. Это то, что вы делаете для клиента. Когда вы искренне хотите помочь — клиент это чувствует.»
            </p>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ width: 44, height: 44, borderRadius: "50%", background: PURPLE, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Icon name="User" size={20} style={{ color: "#fff" }} />
              </div>
              <div>
                <div style={{ fontSize: 14, fontWeight: 700, color: DARK }}>Сергей Водопьянов</div>
                <div style={{ fontSize: 12, color: "#6b7280" }}>Ведущий тренинга</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── ЧТО ВЫ ПОЛУЧИТЕ ────────────────────────────────────────────────────── */}
      <section style={{ background: "#f8fafc", padding: "80px 32px" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 52 }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: TEAL, letterSpacing: "2px", textTransform: "uppercase", marginBottom: 12 }}>РЕЗУЛЬТАТЫ</div>
            <h2 style={{ fontFamily: SERIF, fontSize: "clamp(28px, 3.5vw, 44px)", fontWeight: 600, color: DARK, margin: 0 }}>
              Что вы почувствуете и чему научитесь
            </h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 16 }}>
            {OUTCOMES.map((o, i) => (
              <div key={i} style={{ background: "#fff", borderRadius: 16, padding: "22px 24px", border: "1.5px solid #e2e8f0", display: "flex", gap: 14, alignItems: "flex-start" }}>
                <div style={{ width: 28, height: 28, borderRadius: 8, background: `linear-gradient(135deg, ${PURPLE}, hsl(270,65%,38%))`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 1 }}>
                  <Icon name="Check" size={14} style={{ color: "#fff" }} />
                </div>
                <span style={{ fontSize: 14, color: "#334155", lineHeight: 1.6 }}>{o}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── О ВЕДУЩЕМ ───────────────────────────────────────────────────────────── */}
      <section style={{ padding: "80px 32px", maxWidth: 1280, margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "380px 1fr", gap: 64, alignItems: "center" }} className="speaker-grid">
          <div style={{ position: "relative" }}>
            <div style={{ aspectRatio: "3/4", borderRadius: 24, background: `linear-gradient(135deg, ${DARK}, hsl(270,40%,15%))`, display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
              <Icon name="User" size={80} style={{ color: "rgba(255,255,255,0.15)" }} />
              <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, background: "linear-gradient(transparent, rgba(0,0,0,0.7))", padding: "40px 24px 24px" }}>
                <div style={{ fontSize: 18, fontWeight: 700, color: "#fff" }}>Сергей Водопьянов</div>
                <div style={{ fontSize: 13, color: "rgba(255,255,255,0.6)" }}>Ведущий тренинга</div>
              </div>
            </div>
            <div style={{ position: "absolute", top: 20, right: -16, background: "#fff", borderRadius: 14, padding: "14px 18px", boxShadow: "0 8px 32px rgba(0,0,0,0.12)", border: "1.5px solid #f0f0ec" }}>
              <div style={{ fontSize: 26, fontWeight: 800, color: PURPLE }}>17+</div>
              <div style={{ fontSize: 11, color: "#64748b", lineHeight: 1.4 }}>лет в<br />салонном бизнесе</div>
            </div>
          </div>
          <div>
            <div style={{ fontSize: 12, fontWeight: 600, color: TEAL, letterSpacing: "2px", textTransform: "uppercase", marginBottom: 16 }}>О ВЕДУЩЕМ</div>
            <h2 style={{ fontFamily: SERIF, fontSize: "clamp(28px, 3vw, 40px)", fontWeight: 600, color: DARK, margin: "0 0 20px", lineHeight: 1.2 }}>
              Сергей Водопьянов
            </h2>
            <p style={{ fontSize: 15, color: "#64748b", lineHeight: 1.85, margin: "0 0 24px" }}>
              Основатель платформы «Про диалог». Более 17 лет в салонном бизнесе: от мастера до организатора сетевых проектов. Провёл сотни групп и индивидуальных консультаций.
            </p>
            <p style={{ fontSize: 15, color: "#64748b", lineHeight: 1.85, margin: "0 0 32px" }}>
              Знаю, как трудно бывает «продавать себя» и как важно заботиться о клиентах — и о себе. На тренинге делюсь только теми техниками, которые проверил лично.
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              {[
                { icon: "BookOpen", label: "Авторские техники диалога" },
                { icon: "Users", label: "Сотни выпускников" },
                { icon: "Building2", label: "Опыт сетевых проектов" },
                { icon: "Heart", label: "Экологичный подход" },
              ].map(f => (
                <div key={f.label} style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 13, color: "#334155" }}>
                  <Icon name={f.icon} size={16} style={{ color: TEAL, flexShrink: 0 }} />
                  {f.label}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── КАК ПРОХОДИТ ────────────────────────────────────────────────────────── */}
      <section style={{ background: "#f8fafc", padding: "80px 32px" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 52 }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: TEAL, letterSpacing: "2px", textTransform: "uppercase", marginBottom: 12 }}>ФОРМАТ</div>
            <h2 style={{ fontFamily: SERIF, fontSize: "clamp(28px, 3.5vw, 44px)", fontWeight: 600, color: DARK, margin: 0 }}>
              Как проходит тренинг
            </h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 16 }}>
            {FORMAT.map((f, i) => (
              <div key={i} style={{ background: "#fff", borderRadius: 18, padding: "28px 24px", border: "1.5px solid #e2e8f0", display: "flex", flexDirection: "column", gap: 14 }}>
                <div style={{ width: 48, height: 48, borderRadius: 14, background: PURPLE_BG, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Icon name={f.icon} size={22} style={{ color: PURPLE }} />
                </div>
                <p style={{ fontSize: 14, color: "#334155", lineHeight: 1.65, margin: 0 }}>{f.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── ЭНЕРГИЯ ─────────────────────────────────────────────────────────────── */}
      <section style={{ background: DARK, padding: "80px 32px", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: 800, height: 800, borderRadius: "50%", background: "radial-gradient(circle, hsla(40,90%,50%,0.06) 0%, transparent 65%)", pointerEvents: "none" }} />
        <div style={{ maxWidth: 1280, margin: "0 auto", position: "relative" }}>
          <div style={{ textAlign: "center", marginBottom: 52 }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(255,193,7,0.12)", border: "1px solid rgba(255,193,7,0.25)", borderRadius: 100, padding: "6px 18px", fontSize: 12, fontWeight: 600, color: "hsl(40,90%,65%)", marginBottom: 16, letterSpacing: "0.05em" }}>
              <Icon name="Zap" size={12} /> +1500 ЭНЕРГИИ ПОСЛЕ УЧАСТИЯ
            </div>
            <h2 style={{ fontFamily: SERIF, fontSize: "clamp(28px, 3.5vw, 44px)", fontWeight: 600, color: "#fff", margin: "0 0 16px" }}>
              Энергия работает на вас
            </h2>
            <p style={{ fontSize: 15, color: "rgba(255,255,255,0.5)", maxWidth: 540, margin: "0 auto", lineHeight: 1.7 }}>
              После участия в тренинге на ваш баланс начисляются 1500 Энергии — используйте их на инструменты платформы
            </p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 12 }}>
            {ENERGY_FEATURES.map((f, i) => (
              <div key={i} style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 16, padding: "20px 22px", display: "flex", alignItems: "center", gap: 14 }}>
                <div style={{ width: 40, height: 40, borderRadius: 10, background: "rgba(255,193,7,0.12)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <Icon name={f.icon} size={18} style={{ color: "hsl(40,90%,65%)" }} />
                </div>
                <span style={{ fontSize: 13, color: "rgba(255,255,255,0.7)", lineHeight: 1.5 }}>{f.text}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── КАК ПОПАСТЬ ─────────────────────────────────────────────────────────── */}
      <section style={{ padding: "80px 32px", maxWidth: 1280, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 52 }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: TEAL, letterSpacing: "2px", textTransform: "uppercase", marginBottom: 12 }}>КАК ПОПАСТЬ</div>
          <h2 style={{ fontFamily: SERIF, fontSize: "clamp(28px, 3.5vw, 44px)", fontWeight: 600, color: DARK, margin: 0 }}>
            4 простых шага
          </h2>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 20, position: "relative" }}>
          {STEPS.map((s, i) => (
            <div key={i} style={{ position: "relative" }}>
              <div style={{ background: "#fff", borderRadius: 20, padding: "28px 24px", border: "1.5px solid #e2e8f0", height: "100%", boxSizing: "border-box" }}>
                <div style={{ fontSize: 40, fontWeight: 800, color: "#f0f0ec", fontFamily: SERIF, lineHeight: 1, marginBottom: 16 }}>{s.num}</div>
                <div style={{ fontSize: 16, fontWeight: 700, color: DARK, marginBottom: 8 }}>{s.title}</div>
                <div style={{ fontSize: 13, color: "#64748b", lineHeight: 1.65 }}>{s.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA ─────────────────────────────────────────────────────────────────── */}
      <section style={{ background: `linear-gradient(135deg, hsl(270,65%,15%), ${DARK})`, padding: "80px 32px", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)", backgroundSize: "48px 48px", pointerEvents: "none" }} />
        <div style={{ maxWidth: 640, margin: "0 auto", textAlign: "center", position: "relative" }}>
          <h2 style={{ fontFamily: SERIF, fontSize: "clamp(32px, 4vw, 52px)", fontWeight: 600, color: "#fff", margin: "0 0 16px", lineHeight: 1.15 }}>
            Готовы начать диалог с клиентами по-новому?
          </h2>
          <p style={{ fontSize: 15, color: "rgba(255,255,255,0.5)", margin: "0 0 36px", lineHeight: 1.7 }}>
            Запишитесь на тренинг и получите не только знания, но и 1500 Энергии для роста на платформе «Про диалог»
          </p>
          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            <Link to="/cabinet" style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "16px 32px", borderRadius: 2, background: `linear-gradient(135deg, ${PURPLE}, hsl(270,65%,38%))`, color: "#fff", fontSize: 16, fontWeight: 600, textDecoration: "none", boxShadow: `0 8px 32px hsla(270,65%,52%,0.4)` }}>
              <Icon name="Ticket" size={18} />
              Записаться — 9 900 ₽
            </Link>
            <button onClick={() => setShowModal(true)} style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "16px 24px", borderRadius: 2, border: "1px solid rgba(255,255,255,0.2)", background: "transparent", color: "#fff", fontSize: 15, fontWeight: 400, cursor: "pointer", fontFamily: "Inter, sans-serif" }}>
              <Icon name="Calendar" size={16} />
              Узнать дату
            </button>
          </div>
        </div>
      </section>

      <BizFooter />

      {showModal && <DateModal onClose={() => setShowModal(false)} />}

      <style>{`
        @media (max-width: 900px) {
          .hero-training-grid { grid-template-columns: 1fr !important; }
          .about-training-grid { grid-template-columns: 1fr !important; }
          .speaker-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
