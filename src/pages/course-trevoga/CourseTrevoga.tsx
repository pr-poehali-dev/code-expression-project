import { Helmet } from "react-helmet-async";
import DokNavbar from "@/components/DokNavbar";
import DokFooter from "@/components/DokFooter";
import Icon from "@/components/ui/icon";
import { ACCENT, ACCENT_DARK, ACCENT_SHADOW, BG, HERO_IMG, AUTHOR_IMG, h2style, BtnPrimary, AccordionItem } from "./CtShared";

const ACCESS_URL = "#";

const EXERCISES = [
  {
    icon: "Wind",
    title: "Дыхание «4–7–8»",
    subtitle: "Мгновенное торможение стресс-реакции",
    desc: "Вдох на 4 счёта — задержка на 7 — выдох на 8. Уже после 2–3 циклов тело переключается из режима тревоги в режим покоя. Простой ритм, который работает в любой ситуации.",
    color: "hsl(185, 85%, 32%)",
    bg: "hsl(185, 85%, 97%)",
  },
  {
    icon: "Activity",
    title: "Физиологический вздох",
    subtitle: "Самый быстрый способ сбросить напряжение",
    desc: "Двойной вдох через нос + медленный выдох через рот. Это рефлекторный механизм, заложенный эволюцией: он мгновенно убирает «застревание» в тревоге. Работает с первого раза.",
    color: "hsl(270, 60%, 45%)",
    bg: "hsl(270, 60%, 97%)",
  },
  {
    icon: "Heart",
    title: "Резонансное дыхание",
    subtitle: "Гармонизация нервной системы",
    desc: "Дыхание в ритме 5–6 циклов в минуту синхронизирует сердечный ритм и нервную систему. 5–10 минут — и тело выходит из режима «опасность» в режим «всё под контролем».",
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
    q: "Это действительно работает?",
    a: "Техники основаны на нейрофизиологии и исследованиях вегетативной нервной системы. Их применяют в медицине и спортивной психологии. Вы почувствуете разницу уже во время первого упражнения.",
  },
  {
    q: "Курс платный?",
    a: "Нет. Курс полностью бесплатный. Мы убеждены, что базовые инструменты управления стрессом должны быть доступны каждому.",
  },
];

export default function CourseTrevoga() {
  return (
    <div style={{ background: BG, minHeight: "100vh", fontFamily: "Montserrat, sans-serif", color: "#1a1a1a" }}>
      <Helmet>
        <title>«Выдохни» — бесплатный курс: снять тревогу за 5–10 минут в день | Dok Диалог</title>
        <meta name="description" content="3 упражнения на основе физиологии, которые помогут выйти из стресса и тревоги за 5–10 минут. Бесплатный онлайн-курс от Dok Диалог." />
      </Helmet>
      <DokNavbar />

      {/* HERO */}
      <section style={{ paddingTop: 90, background: "#fff" }}>
        <div style={{ maxWidth: 1160, margin: "0 auto", padding: "clamp(32px, 5vw, 60px) 20px 0" }}>
          <div className="ct-hero-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "clamp(28px, 5vw, 60px)", alignItems: "center" }}>
            <div>
              <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: `${ACCENT}14`, color: ACCENT, borderRadius: 100, padding: "6px 16px", fontSize: 13, fontWeight: 600, marginBottom: 20 }}>
                <Icon name="Gift" size={14} />
                Бесплатный курс · Точечный продукт
              </div>
              <h1 style={{ fontFamily: "Cormorant, serif", fontSize: "clamp(38px, 6vw, 62px)", fontWeight: 700, lineHeight: 1.1, margin: "0 0 16px", color: "#1a1a1a" }}>
                «Выдохни»
              </h1>
              <p style={{ fontSize: "clamp(16px, 2.2vw, 22px)", fontWeight: 600, color: "#333", margin: "0 0 14px", lineHeight: 1.4 }}>
                Как за 5–10 минут в день снять тревогу и выйти из стресса
              </p>
              <p style={{ fontSize: "clamp(14px, 1.5vw, 16px)", color: "#666", lineHeight: 1.75, margin: "0 0 28px" }}>
                3 упражнения на основе физиологии вегетативной нервной системы. Никаких таблеток. Никаких медитаций на час. Только то, как устроено ваше тело — и как это использовать прямо сейчас.
              </p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginBottom: 32 }}>
                {["Бесплатно", "Онлайн", "Для всех", "5–10 мин в день"].map((tag) => (
                  <span key={tag} style={{ padding: "5px 12px", borderRadius: 8, background: BG, border: "1px solid #e0e0dc", fontSize: 13, color: "#555", fontWeight: 500 }}>{tag}</span>
                ))}
              </div>
              <BtnPrimary href={ACCESS_URL} style={{ fontSize: "clamp(14px, 1.6vw, 17px)", padding: "clamp(14px, 2vw, 18px) clamp(28px, 4vw, 44px)" }}>
                Получить бесплатный доступ →
              </BtnPrimary>
            </div>
            <div className="ct-hero-img" style={{ borderRadius: 24, overflow: "hidden", boxShadow: "0 24px 80px rgba(0,0,0,0.12)" }}>
              <img src={HERO_IMG} alt="Курс Выдохни" style={{ width: "100%", height: "clamp(280px, 40vw, 480px)", objectFit: "cover", display: "block" }} />
            </div>
          </div>

          {/* Stats strip */}
          <div className="ct-stats" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", borderTop: "1px solid #e8e8e4", marginTop: 48 }}>
            {[
              { num: "5–10", label: "минут в день" },
              { num: "3", label: "упражнения" },
              { num: "0 ₽", label: "стоимость" },
              { num: "ВНС", label: "физиология в основе" },
            ].map((s, i) => (
              <div key={i} style={{ padding: "clamp(16px, 2vw, 28px) clamp(12px, 2vw, 24px)", borderRight: i < 3 ? "1px solid #e8e8e4" : "none", textAlign: "center" }}>
                <div style={{ fontFamily: "Cormorant, serif", fontSize: "clamp(24px, 3.5vw, 36px)", fontWeight: 700, color: ACCENT, lineHeight: 1 }}>{s.num}</div>
                <div style={{ fontSize: "clamp(11px, 1.2vw, 13px)", color: "#888", marginTop: 5 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PAIN */}
      <section style={{ padding: "clamp(48px, 7vw, 80px) 20px" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <h2 style={{ ...h2style, textAlign: "center" }}>Узнаёте себя?</h2>
          <div className="ct-pain-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            {[
              "Просыпаетесь с тревогой, хотя ничего плохого не случилось",
              "Не можете расслабиться даже когда «всё хорошо»",
              "Сердце колотится без причины, мысли по кругу",
              "Раздражение и усталость стали фоновым состоянием",
              "Засыпаете с телефоном, потому что тишина тревожит",
              "Чувствуете, что на грани, но не знаете как выйти",
            ].map((text, i) => (
              <div key={i} style={{ display: "flex", gap: 14, alignItems: "flex-start", background: "#fff", borderRadius: 14, padding: "16px 18px", border: "1px solid #e8e8e4" }}>
                <span style={{ fontSize: 18, flexShrink: 0, marginTop: 1 }}>😔</span>
                <span style={{ fontSize: "clamp(13px, 1.4vw, 14px)", color: "#444", lineHeight: 1.6 }}>{text}</span>
              </div>
            ))}
          </div>
          <div style={{ textAlign: "center", marginTop: 36 }}>
            <p style={{ fontSize: "clamp(15px, 1.8vw, 17px)", color: "#333", fontWeight: 600, lineHeight: 1.6, margin: 0 }}>
              Это не слабость и не «надо просто взять себя в руки».<br />
              <span style={{ color: ACCENT }}>Это физиология. И у неё есть выключатель.</span>
            </p>
          </div>
        </div>
      </section>

      {/* EXERCISES */}
      <section style={{ background: "#fff", padding: "clamp(48px, 7vw, 80px) 20px" }}>
        <div style={{ maxWidth: 1160, margin: "0 auto" }}>
          <h2 style={{ ...h2style, textAlign: "center" }}>3 упражнения, которые меняют состояние</h2>
          <p style={{ textAlign: "center", fontSize: "clamp(14px, 1.5vw, 16px)", color: "#666", margin: "-20px auto 40px", maxWidth: 600, lineHeight: 1.7 }}>
            Не аффирмации и не абстрактные практики. Прямое воздействие на вегетативную нервную систему через дыхание — так, как это делает ваш мозг в момент настоящего спокойствия.
          </p>
          <div className="ct-ex-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24 }}>
            {EXERCISES.map((ex, i) => (
              <div key={i} style={{ borderRadius: 20, border: "1px solid #e8e8e4", overflow: "hidden", background: "#fff", boxShadow: "0 2px 16px rgba(0,0,0,0.05)" }}>
                <div style={{ background: ex.bg, padding: "28px 24px 22px" }}>
                  <div style={{ width: 48, height: 48, borderRadius: 14, background: "#fff", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 14, boxShadow: "0 4px 12px rgba(0,0,0,0.08)" }}>
                    <Icon name={ex.icon} size={22} style={{ color: ex.color }} />
                  </div>
                  <div style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1, color: ex.color, marginBottom: 5 }}>Упражнение {i + 1}</div>
                  <h3 style={{ fontFamily: "Cormorant, serif", fontSize: "clamp(18px, 2vw, 22px)", fontWeight: 700, margin: "0 0 4px", color: "#1a1a1a" }}>{ex.title}</h3>
                  <div style={{ fontSize: 13, color: "#666", fontStyle: "italic" }}>{ex.subtitle}</div>
                </div>
                <div style={{ padding: "20px 24px" }}>
                  <p style={{ fontSize: "clamp(13px, 1.3vw, 14px)", color: "#555", lineHeight: 1.75, margin: 0 }}>{ex.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* RESULTS */}
      <section style={{ padding: "clamp(48px, 7vw, 80px) 20px" }}>
        <div style={{ maxWidth: 860, margin: "0 auto" }}>
          <h2 style={{ ...h2style, textAlign: "center" }}>Что вы сможете после курса</h2>
          <div className="ct-results-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            {RESULTS.map((r, i) => (
              <div key={i} style={{ display: "flex", gap: 14, alignItems: "center", background: "#fff", borderRadius: 14, padding: "18px 20px", border: "1px solid #e8e8e4" }}>
                <div style={{ width: 42, height: 42, borderRadius: 12, background: `${ACCENT}14`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <Icon name={r.icon} size={18} style={{ color: ACCENT }} />
                </div>
                <span style={{ fontSize: "clamp(13px, 1.4vw, 14px)", color: "#333", lineHeight: 1.5, fontWeight: 500 }}>{r.text}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* AUTHOR */}
      <section style={{ background: "#fff", padding: "clamp(48px, 7vw, 80px) 20px" }}>
        <div style={{ maxWidth: 860, margin: "0 auto" }}>
          <h2 style={{ ...h2style, textAlign: "center" }}>Кто ведёт курс</h2>
          <div className="ct-author-wrap" style={{ display: "flex", gap: 36, alignItems: "flex-start", background: BG, borderRadius: 24, padding: "clamp(24px, 4vw, 40px)", border: "1px solid #e8e8e4" }}>
            <img
              src={AUTHOR_IMG}
              alt="Автор курса"
              className="ct-author-img"
              style={{ width: "clamp(100px, 14vw, 160px)", height: "clamp(100px, 14vw, 160px)", borderRadius: "50%", objectFit: "cover", flexShrink: 0, border: `4px solid ${ACCENT}`, boxShadow: `0 8px 28px ${ACCENT_SHADOW}` }}
            />
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1, color: ACCENT, marginBottom: 6 }}>Автор и ведущий</div>
              <h3 style={{ fontFamily: "Cormorant, serif", fontSize: "clamp(22px, 3vw, 28px)", fontWeight: 700, margin: "0 0 6px", color: "#1a1a1a" }}>Dok Диалог</h3>
              <p style={{ fontSize: 13, color: "#888", margin: "0 0 14px" }}>Эксперт в области телесных практик, массажа и работы с нервной системой</p>
              <p style={{ fontSize: "clamp(13px, 1.5vw, 15px)", color: "#444", lineHeight: 1.75, margin: "0 0 12px" }}>
                Более 10 лет в работе с телом и нервной системой. Специализация — физиологические методы регуляции состояния: без эзотерики, без долгих медитаций, только работающие инструменты.
              </p>
              <p style={{ fontSize: "clamp(13px, 1.5vw, 15px)", color: "#444", lineHeight: 1.75, margin: 0 }}>
                Автор курсов по массажу для тысяч специалистов по всей России. Убеждён: понимание собственной физиологии — это суперсила, которая должна быть у каждого.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section style={{ padding: "clamp(48px, 7vw, 80px) 20px", background: `linear-gradient(135deg, hsl(185, 85%, 10%) 0%, hsl(185, 70%, 18%) 100%)` }}>
        <div style={{ maxWidth: 560, margin: "0 auto", textAlign: "center" }}>
          <div style={{ fontSize: 44, marginBottom: 16 }}>🌬️</div>
          <h2 style={{ fontFamily: "Cormorant, serif", fontSize: "clamp(26px, 4.5vw, 44px)", fontWeight: 700, color: "#fff", margin: "0 0 16px", lineHeight: 1.2 }}>
            Получите бесплатный доступ прямо сейчас
          </h2>
          <p style={{ fontSize: "clamp(14px, 1.6vw, 16px)", color: "rgba(255,255,255,0.75)", margin: "0 0 32px", lineHeight: 1.7 }}>
            Никакого спама. Только курс — и реальный инструмент управления своим состоянием.
          </p>
          <a
            href={ACCESS_URL}
            style={{
              display: "inline-block",
              textDecoration: "none",
              background: "#fff",
              color: ACCENT,
              borderRadius: 14,
              padding: "clamp(14px, 2vw, 18px) clamp(28px, 5vw, 52px)",
              fontSize: "clamp(15px, 1.7vw, 17px)",
              fontWeight: 700,
              cursor: "pointer",
              fontFamily: "Montserrat, sans-serif",
              boxShadow: "0 8px 32px rgba(0,0,0,0.2)",
            }}
          >
            Получить доступ бесплатно →
          </a>
        </div>
      </section>

      {/* FAQ */}
      <section style={{ padding: "clamp(48px, 7vw, 80px) 20px" }}>
        <div style={{ maxWidth: 760, margin: "0 auto" }}>
          <h2 style={{ ...h2style, textAlign: "center" }}>Частые вопросы</h2>
          <div style={{ background: "#fff", borderRadius: 20, padding: "0 clamp(16px, 4vw, 32px)", border: "1px solid #e8e8e4" }}>
            {FAQS.map((f, i) => (
              <AccordionItem key={i} title={f.q}>{f.a}</AccordionItem>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section style={{ padding: "0 20px clamp(48px, 7vw, 80px)" }}>
        <div style={{ maxWidth: 700, margin: "0 auto", textAlign: "center", background: "#fff", borderRadius: 24, padding: "clamp(32px, 5vw, 52px) clamp(20px, 5vw, 40px)", border: "1px solid #e8e8e4", boxShadow: "0 8px 40px rgba(0,0,0,0.06)" }}>
          <h2 style={{ fontFamily: "Cormorant, serif", fontSize: "clamp(22px, 3.5vw, 36px)", fontWeight: 700, margin: "0 0 14px", color: "#1a1a1a" }}>
            Вы заслуживаете чувствовать себя хорошо
          </h2>
          <p style={{ fontSize: "clamp(14px, 1.5vw, 16px)", color: "#666", lineHeight: 1.7, margin: "0 0 28px" }}>
            Не «терпеть», не «справляться», не «отвлекаться». А выдохнуть по-настоящему. Начните сегодня — это бесплатно и займёт 5 минут.
          </p>
          <BtnPrimary href={ACCESS_URL} style={{ fontSize: "clamp(14px, 1.6vw, 17px)", padding: "clamp(14px, 2vw, 18px) clamp(28px, 4vw, 44px)" }}>
            Хочу выдохнуть →
          </BtnPrimary>
        </div>
      </section>

      <style>{`
        @media (max-width: 860px) {
          .ct-hero-grid { grid-template-columns: 1fr !important; }
          .ct-hero-img { display: none !important; }
          .ct-stats { grid-template-columns: repeat(2, 1fr) !important; }
          .ct-ex-grid { grid-template-columns: 1fr !important; }
          .ct-author-wrap { flex-direction: column !important; align-items: center !important; text-align: center !important; }
          .ct-author-img { margin: 0 auto !important; }
        }
        @media (max-width: 600px) {
          .ct-pain-grid { grid-template-columns: 1fr !important; }
          .ct-results-grid { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 400px) {
          .ct-stats { grid-template-columns: repeat(2, 1fr) !important; }
        }
      `}</style>

      <DokFooter />
    </div>
  );
}
