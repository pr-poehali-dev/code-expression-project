import { useState } from "react";
import { Helmet } from "react-helmet-async";
import DokNavbar from "@/components/DokNavbar";
import DokFooter from "@/components/DokFooter";
import Icon from "@/components/ui/icon";
import { ACCENT, ACCENT_DARK, ACCENT_SHADOW, BG, HERO_IMG, AUTHOR_IMG, h2style, BtnPrimary, AccordionItem } from "./CtShared";

const EXERCISES = [
  {
    icon: "Wind",
    title: "Дыхание «4–7–8»",
    subtitle: "Мгновенное торможение стресс-реакции",
    desc: "Физиологический тормоз для симпатической нервной системы. Вдох на 4 счёта — задержка на 7 — выдох на 8. Уже после 2–3 циклов уровень кортизола снижается, а парасимпатика берёт управление на себя.",
    color: "hsl(185, 85%, 32%)",
    bg: "hsl(185, 85%, 97%)",
  },
  {
    icon: "Activity",
    title: "Физиологический вздох",
    subtitle: "Техника NASA и армии США",
    desc: "Двойной вдох через нос + медленный выдох через рот. Это рефлекторный механизм, заложенный эволюцией: он мгновенно раскрывает альвеолы и убирает «застревание» в тревоге. Работает с первого раза.",
    color: "hsl(270, 60%, 45%)",
    bg: "hsl(270, 60%, 97%)",
  },
  {
    icon: "Heart",
    title: "Резонансное дыхание ВНС",
    subtitle: "Гармонизация вегетативной нервной системы",
    desc: "Дыхание в ритме 5–6 циклов в минуту синхронизирует сердечный ритм и нервную систему. 5–10 минут — и тело выходит из режима «опасность» в режим «всё под контролем». Доказано кардиологами.",
    color: "hsl(12, 80%, 45%)",
    bg: "hsl(12, 80%, 97%)",
  },
];

const RESULTS = [
  { icon: "Zap", text: "Снять острый приступ тревоги за 2–3 минуты" },
  { icon: "Moon", text: "Засыпать без мыслей в голове" },
  { icon: "TrendingDown", text: "Остановить нарастающую панику в моменте" },
  { icon: "Brain", text: "Понять, как ваша нервная система реагирует на стресс" },
  { icon: "Sun", text: "Начинать день без тревожного фона" },
  { icon: "Shield", text: "Чувствовать опору внутри, а не снаружи" },
];

const FAQS = [
  {
    q: "Это для всех или только для людей с тревожными расстройствами?",
    a: "Для всех. Техники основаны на физиологии — они работают независимо от того, есть ли у вас диагноз. Хронический стресс, беспокойство, усталость, невозможность расслабиться — это ровно то, для чего создан курс.",
  },
  {
    q: "Нужно ли какое-то специальное оборудование или место?",
    a: "Ничего. Только вы и ваше дыхание. Упражнения можно делать за рабочим столом, в машине, перед сном или в очереди. Буквально везде.",
  },
  {
    q: "Сколько времени займёт каждое упражнение?",
    a: "От 3 до 10 минут. Это не медитация на час — это точечное воздействие на нервную систему. Быстро, просто, с ощутимым результатом.",
  },
  {
    q: "Это действительно работает? Или это просто дыхательные практики?",
    a: "Техники основаны на нейрофизиологии и исследованиях вегетативной нервной системы. Их применяют в медицине, военной подготовке, спортивной психологии. Вы почувствуете разницу уже во время первого упражнения.",
  },
  {
    q: "Курс платный?",
    a: "Нет. Курс полностью бесплатный. Мы убеждены, что базовые инструменты управления стрессом должны быть доступны каждому.",
  },
];

export default function CourseTrevoga() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [error, setError] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !email.trim()) { setError("Заполните имя и email"); return; }
    if (!agreed) { setError("Подтвердите согласие на обработку данных"); return; }
    setError("");
    setSubmitted(true);
  }

  return (
    <div style={{ background: BG, minHeight: "100vh", fontFamily: "Montserrat, sans-serif", color: "#1a1a1a" }}>
      <Helmet>
        <title>«Выдохни» — бесплатный курс: снять тревогу за 5–10 минут в день | Dok Диалог</title>
        <meta name="description" content="3 упражнения на основе физиологии ВНС, которые помогут выйти из стресса и тревоги за 5–10 минут. Бесплатный онлайн-курс от Dok Диалог." />
      </Helmet>
      <DokNavbar />

      {/* HERO */}
      <section style={{ paddingTop: 90, background: "#fff" }}>
        <div style={{ maxWidth: 1160, margin: "0 auto", padding: "60px 24px 0", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 60, alignItems: "center" }} className="ct-hero-grid">
          <div>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: `${ACCENT}14`, color: ACCENT, borderRadius: 100, padding: "6px 16px", fontSize: 13, fontWeight: 600, marginBottom: 24 }}>
              <Icon name="Gift" size={14} />
              Бесплатный курс · Точечный продукт
            </div>
            <h1 style={{ fontFamily: "Cormorant, serif", fontSize: "clamp(36px, 5vw, 58px)", fontWeight: 700, lineHeight: 1.1, margin: "0 0 20px", color: "#1a1a1a" }}>
              «Выдохни»
            </h1>
            <p style={{ fontSize: "clamp(18px, 2.2vw, 24px)", fontWeight: 600, color: "#333", margin: "0 0 16px", lineHeight: 1.4 }}>
              Как за 5–10 минут в день снять тревогу и выйти из стресса
            </p>
            <p style={{ fontSize: 16, color: "#666", lineHeight: 1.7, margin: "0 0 32px" }}>
              3 упражнения на основе физиологии вегетативной нервной системы. Никаких таблеток. Никаких медитаций на час. Только то, как устроено ваше тело — и как это использовать прямо сейчас.
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginBottom: 36 }}>
              {["Бесплатно", "Онлайн", "Для всех", "5–10 мин в день"].map((tag) => (
                <span key={tag} style={{ padding: "6px 14px", borderRadius: 8, background: BG, border: "1px solid #e0e0dc", fontSize: 13, color: "#555", fontWeight: 500 }}>{tag}</span>
              ))}
            </div>
            <BtnPrimary href="#form" style={{ fontSize: 17, padding: "18px 44px" }}>
              Получить бесплатный доступ →
            </BtnPrimary>
          </div>
          <div style={{ borderRadius: 24, overflow: "hidden", boxShadow: "0 24px 80px rgba(0,0,0,0.12)" }} className="ct-hero-img">
            <img src={HERO_IMG} alt="Курс Выдохни" style={{ width: "100%", height: 480, objectFit: "cover", display: "block" }} />
          </div>
        </div>

        {/* Stats strip */}
        <div style={{ maxWidth: 1160, margin: "0 auto", padding: "0 24px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 0, borderTop: "1px solid #e8e8e4", marginTop: 60 }} className="ct-stats">
            {[
              { num: "5–10", label: "минут в день" },
              { num: "3", label: "упражнения" },
              { num: "0 ₽", label: "стоимость" },
              { num: "ВНС", label: "физиология в основе" },
            ].map((s, i) => (
              <div key={i} style={{ padding: "28px 24px", borderRight: i < 3 ? "1px solid #e8e8e4" : "none", textAlign: "center" }}>
                <div style={{ fontFamily: "Cormorant, serif", fontSize: 36, fontWeight: 700, color: ACCENT, lineHeight: 1 }}>{s.num}</div>
                <div style={{ fontSize: 13, color: "#888", marginTop: 6 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PAIN */}
      <section style={{ padding: "80px 24px", maxWidth: 900, margin: "0 auto" }}>
        <h2 style={{ ...h2style, textAlign: "center" }}>Узнаёте себя?</h2>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }} className="ct-pain-grid">
          {[
            "Просыпаетесь с тревогой, хотя ничего плохого не случилось",
            "Не можете расслабиться даже когда «всё хорошо»",
            "Сердце колотится без причины, мысли по кругу",
            "Раздражение и усталость стали фоновым состоянием",
            "Засыпаете с телефоном, потому что тишина тревожит",
            "Чувствуете, что на грани, но не знаете как «слезть»",
          ].map((text, i) => (
            <div key={i} style={{ display: "flex", gap: 14, alignItems: "flex-start", background: "#fff", borderRadius: 14, padding: "18px 20px", border: "1px solid #e8e8e4" }}>
              <span style={{ fontSize: 20, flexShrink: 0, marginTop: 1 }}>😔</span>
              <span style={{ fontSize: 14, color: "#444", lineHeight: 1.6 }}>{text}</span>
            </div>
          ))}
        </div>
        <div style={{ textAlign: "center", marginTop: 40 }}>
          <p style={{ fontSize: 17, color: "#333", fontWeight: 600, lineHeight: 1.6 }}>
            Это не слабость и не «надо просто взять себя в руки».<br />
            <span style={{ color: ACCENT }}>Это физиология. И у неё есть выключатель.</span>
          </p>
        </div>
      </section>

      {/* EXERCISES */}
      <section style={{ background: "#fff", padding: "80px 24px" }}>
        <div style={{ maxWidth: 1160, margin: "0 auto" }}>
          <h2 style={{ ...h2style, textAlign: "center" }}>3 упражнения, которые меняют состояние</h2>
          <p style={{ textAlign: "center", fontSize: 16, color: "#666", margin: "-20px auto 48px", maxWidth: 600, lineHeight: 1.7 }}>
            Не медитация. Не аффirmации. Прямое воздействие на вегетативную нервную систему через дыхание — так, как это делает ваш мозг в момент настоящего спокойствия.
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24 }} className="ct-ex-grid">
            {EXERCISES.map((ex, i) => (
              <div key={i} style={{ borderRadius: 20, border: "1px solid #e8e8e4", overflow: "hidden", background: "#fff", boxShadow: "0 2px 16px rgba(0,0,0,0.05)" }}>
                <div style={{ background: ex.bg, padding: "32px 28px 24px" }}>
                  <div style={{ width: 52, height: 52, borderRadius: 14, background: "#fff", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 16, boxShadow: "0 4px 12px rgba(0,0,0,0.08)" }}>
                    <Icon name={ex.icon} size={24} style={{ color: ex.color }} />
                  </div>
                  <div style={{ fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1, color: ex.color, marginBottom: 6 }}>Упражнение {i + 1}</div>
                  <h3 style={{ fontFamily: "Cormorant, serif", fontSize: 22, fontWeight: 700, margin: "0 0 4px", color: "#1a1a1a" }}>{ex.title}</h3>
                  <div style={{ fontSize: 13, color: "#666", fontStyle: "italic" }}>{ex.subtitle}</div>
                </div>
                <div style={{ padding: "24px 28px" }}>
                  <p style={{ fontSize: 14, color: "#555", lineHeight: 1.75, margin: 0 }}>{ex.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* RESULTS */}
      <section style={{ padding: "80px 24px" }}>
        <div style={{ maxWidth: 860, margin: "0 auto" }}>
          <h2 style={{ ...h2style, textAlign: "center" }}>Что вы сможете после курса</h2>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }} className="ct-results-grid">
            {RESULTS.map((r, i) => (
              <div key={i} style={{ display: "flex", gap: 16, alignItems: "center", background: "#fff", borderRadius: 14, padding: "20px 24px", border: "1px solid #e8e8e4" }}>
                <div style={{ width: 44, height: 44, borderRadius: 12, background: `${ACCENT}14`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <Icon name={r.icon} size={20} style={{ color: ACCENT }} />
                </div>
                <span style={{ fontSize: 14, color: "#333", lineHeight: 1.5, fontWeight: 500 }}>{r.text}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* AUTHOR */}
      <section style={{ background: "#fff", padding: "80px 24px" }}>
        <div style={{ maxWidth: 860, margin: "0 auto" }}>
          <h2 style={{ ...h2style, textAlign: "center" }}>Кто ведёт курс</h2>
          <div style={{ display: "flex", gap: 40, alignItems: "flex-start", background: BG, borderRadius: 24, padding: "40px", border: "1px solid #e8e8e4" }} className="ct-author-wrap">
            <img
              src={AUTHOR_IMG}
              alt="Автор курса"
              style={{ width: 160, height: 160, borderRadius: "50%", objectFit: "cover", flexShrink: 0, border: `4px solid ${ACCENT}`, boxShadow: `0 8px 28px ${ACCENT_SHADOW}` }}
              className="ct-author-img"
            />
            <div>
              <div style={{ fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1, color: ACCENT, marginBottom: 8 }}>Автор и ведущий</div>
              <h3 style={{ fontFamily: "Cormorant, serif", fontSize: 28, fontWeight: 700, margin: "0 0 6px", color: "#1a1a1a" }}>Dok Диалог</h3>
              <p style={{ fontSize: 13, color: "#888", margin: "0 0 16px" }}>Эксперт в области телесных практик, массажа и работы с нервной системой</p>
              <p style={{ fontSize: 15, color: "#444", lineHeight: 1.75, margin: "0 0 16px" }}>
                Более 10 лет в работе с телом и нервной системой. Специализация — физиологические методы регуляции состояния: без эзотерики, без долгих медитаций, только работающие инструменты.
              </p>
              <p style={{ fontSize: 15, color: "#444", lineHeight: 1.75, margin: 0 }}>
                Автор курсов по массажу для тысяч специалистов по всей России. Убеждён: понимание собственной физиологии — это суперсила, которая должна быть у каждого.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FORM */}
      <section id="form" style={{ padding: "80px 24px", background: `linear-gradient(135deg, hsl(185, 85%, 10%) 0%, hsl(185, 70%, 18%) 100%)` }}>
        <div style={{ maxWidth: 560, margin: "0 auto", textAlign: "center" }}>
          <div style={{ fontSize: 40, marginBottom: 16 }}>🌬️</div>
          <h2 style={{ fontFamily: "Cormorant, serif", fontSize: "clamp(28px, 4vw, 42px)", fontWeight: 700, color: "#fff", margin: "0 0 16px", lineHeight: 1.2 }}>
            Получите бесплатный доступ прямо сейчас
          </h2>
          <p style={{ fontSize: 16, color: "rgba(255,255,255,0.75)", margin: "0 0 36px", lineHeight: 1.7 }}>
            Введите имя и email — и мы пришлём ссылку на курс. Никакого спама. Только полезное.
          </p>

          {submitted ? (
            <div style={{ background: "rgba(255,255,255,0.12)", borderRadius: 20, padding: "40px 32px", border: "1px solid rgba(255,255,255,0.2)" }}>
              <div style={{ fontSize: 48, marginBottom: 16 }}>✅</div>
              <h3 style={{ fontFamily: "Cormorant, serif", fontSize: 28, color: "#fff", margin: "0 0 12px" }}>Отлично, {name.split(" ")[0]}!</h3>
              <p style={{ color: "rgba(255,255,255,0.8)", fontSize: 15, lineHeight: 1.7, margin: 0 }}>
                Доступ к курсу уже летит на ваш email. Проверьте папку «Входящие» (и иногда «Спам» — на всякий случай).
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ background: "rgba(255,255,255,0.1)", borderRadius: 20, padding: "36px", border: "1px solid rgba(255,255,255,0.15)", backdropFilter: "blur(10px)" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                <input
                  type="text"
                  placeholder="Ваше имя"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  style={{ padding: "14px 18px", borderRadius: 12, border: "1px solid rgba(255,255,255,0.25)", background: "rgba(255,255,255,0.12)", color: "#fff", fontSize: 15, fontFamily: "Montserrat, sans-serif", outline: "none" }}
                />
                <input
                  type="email"
                  placeholder="Ваш email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  style={{ padding: "14px 18px", borderRadius: 12, border: "1px solid rgba(255,255,255,0.25)", background: "rgba(255,255,255,0.12)", color: "#fff", fontSize: 15, fontFamily: "Montserrat, sans-serif", outline: "none" }}
                />
                <label style={{ display: "flex", gap: 10, alignItems: "flex-start", cursor: "pointer" }}>
                  <input
                    type="checkbox"
                    checked={agreed}
                    onChange={e => setAgreed(e.target.checked)}
                    style={{ marginTop: 3, accentColor: ACCENT, width: 16, height: 16, flexShrink: 0, cursor: "pointer" }}
                  />
                  <span style={{ fontSize: 12, color: "rgba(255,255,255,0.65)", lineHeight: 1.5, textAlign: "left" }}>
                    Я согласен(а) на обработку персональных данных в соответствии с{" "}
                    <a href="/privacy" target="_blank" rel="noopener noreferrer" style={{ color: "rgba(255,255,255,0.9)", textDecoration: "underline" }}>политикой конфиденциальности</a>
                  </span>
                </label>
                {error && (
                  <div style={{ fontSize: 13, color: "#ffb3b3", background: "rgba(255,100,100,0.15)", borderRadius: 8, padding: "10px 14px", border: "1px solid rgba(255,100,100,0.3)" }}>
                    {error}
                  </div>
                )}
                <button
                  type="submit"
                  style={{
                    padding: "16px", borderRadius: 12, border: "none",
                    background: ACCENT, color: "#fff",
                    fontSize: 16, fontWeight: 700, cursor: "pointer",
                    fontFamily: "Montserrat, sans-serif",
                    boxShadow: `0 6px 20px ${ACCENT_SHADOW}`,
                    marginTop: 4,
                  }}
                >
                  Получить доступ бесплатно →
                </button>
              </div>
            </form>
          )}
        </div>
      </section>

      {/* FAQ */}
      <section style={{ padding: "80px 24px" }}>
        <div style={{ maxWidth: 760, margin: "0 auto" }}>
          <h2 style={{ ...h2style, textAlign: "center" }}>Частые вопросы</h2>
          <div style={{ background: "#fff", borderRadius: 20, padding: "0 32px", border: "1px solid #e8e8e4" }}>
            {FAQS.map((f, i) => (
              <AccordionItem key={i} title={f.q}>{f.a}</AccordionItem>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section style={{ padding: "0 24px 80px" }}>
        <div style={{ maxWidth: 700, margin: "0 auto", textAlign: "center", background: "#fff", borderRadius: 24, padding: "52px 40px", border: "1px solid #e8e8e4", boxShadow: "0 8px 40px rgba(0,0,0,0.06)" }}>
          <h2 style={{ fontFamily: "Cormorant, serif", fontSize: "clamp(26px, 3.5vw, 36px)", fontWeight: 700, margin: "0 0 16px", color: "#1a1a1a" }}>
            Вы заслуживаете чувствовать себя хорошо
          </h2>
          <p style={{ fontSize: 16, color: "#666", lineHeight: 1.7, margin: "0 0 32px" }}>
            Не «терпеть», не «справляться», не «отвлекаться». А выдохнуть по-настоящему. Начните сегодня — это бесплатно и займёт 5 минут.
          </p>
          <BtnPrimary href="#form" style={{ fontSize: 17, padding: "18px 44px" }}>
            Хочу выдохнуть →
          </BtnPrimary>
        </div>
      </section>

      <style>{`
        @media (max-width: 860px) {
          .ct-hero-grid { grid-template-columns: 1fr !important; }
          .ct-hero-img { display: none !important; }
          .ct-stats { grid-template-columns: repeat(2, 1fr) !important; }
          .ct-pain-grid { grid-template-columns: 1fr !important; }
          .ct-ex-grid { grid-template-columns: 1fr !important; }
          .ct-results-grid { grid-template-columns: 1fr !important; }
          .ct-author-wrap { flex-direction: column !important; align-items: center !important; text-align: center !important; }
          .ct-author-img { margin: 0 auto !important; }
        }
        @media (max-width: 480px) {
          .ct-stats { grid-template-columns: repeat(2, 1fr) !important; }
        }
        input::placeholder { color: rgba(255,255,255,0.5); }
      `}</style>

      <DokFooter />
    </div>
  );
}
