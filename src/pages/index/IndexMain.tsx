import { Link } from "react-router-dom";
import Icon from "@/components/ui/icon";

const TEAL = "#2DD4BF";
const DARK = "#0F172A";
const GRAY = "#64748B";
const SERIF = "'Cormorant Garamond', serif";

const SEGMENTS = [
  {
    icon: "Building2",
    tag: "Владельцам салонов красоты",
    title: "Как увеличить загрузку салона и привлекать больше клиентов?",
    text: "Свободные окна у мастеров, нестабильная запись, недостаток новых клиентов или слабый возврат постоянных — у каждой ситуации свои причины. Важно понять, на чём сосредоточиться именно сейчас, чтобы развивать салон, а не тратить бюджет и время на случайные действия.",
    button: "Решения для салона",
    href: "/dlya-salonov",
  },
  {
    icon: "HandHeart",
    tag: "Частным мастерам и массажистам",
    title: "Как сделать запись стабильнее и развивать свою практику?",
    text: "Вы хорошо выполняете свою работу, но клиенты не всегда записываются регулярно, новые приходят преимущественно по рекомендациям, а на продвижение постоянно не хватает времени. Как привлекать клиентов, возвращать постоянных и развивать практику без необходимости заниматься всем сразу?",
    button: "Решения для моей практики",
    href: "/dlya-masterov",
  },
  {
    icon: "Brain",
    tag: "Психологам",
    title: "Как привлекать своих клиентов и развивать практику психолога?",
    text: "Вы умеете работать с людьми, но профессиональные навыки сами по себе не гарантируют стабильного потока клиентов. Как понятнее представить свои услуги, найти свою аудиторию, выстроить продвижение и развивать практику без бесконечных экспериментов?",
    button: "Решения для психолога",
    href: "/dlya-psihologov",
  },
  {
    icon: "Compass",
    tag: "Другим специалистам",
    title: "Как развивать своё дело и находить больше клиентов?",
    text: "Вы работаете на себя, оказываете услуги или развиваете небольшую практику. Вам нужно привлекать клиентов, повышать загрузку, возвращать постоянных и понимать, какие действия принесут пользу именно вашему делу. «Промт Диалог» поможет разобрать вашу ситуацию и определить приоритетные направления развития с учетом специфики ваших услуг и аудитории.",
    button: "Найти точки роста",
    href: "/diagnostika",
  },
];

const ANALYZED = [
  { icon: "Briefcase", title: "Ваши услуги", text: "что именно вы предлагаете клиентам." },
  { icon: "Users", title: "Ваша аудитория", text: "для кого предназначены ваши услуги и какие задачи решают клиенты." },
  { icon: "MapPin", title: "Ваш регион", text: "особенности местного рынка и доступной аудитории." },
  { icon: "Clock", title: "Ваше время и ресурсы", text: "сколько времени вы можете уделять развитию и какие возможности у вас есть." },
  { icon: "Flag", title: "Текущая ситуация", text: "ваши задачи, трудности и цели." },
  { icon: "Megaphone", title: "Продвижение и привлечение клиентов", text: "какие направления стоит рассмотреть в первую очередь." },
];

const RESULTS = [
  { icon: "TrendingUp", title: "Увидеть точки роста", text: "Определить, какие направления развития заслуживают внимания с учетом ситуации." },
  { icon: "ListOrdered", title: "Расставить приоритеты", text: "Сосредоточиться на конкретных задачах, а не пытаться одновременно менять всё." },
  { icon: "Lightbulb", title: "Найти идеи для привлечения клиентов", text: "Рассмотреть подходящие варианты продвижения ваших услуг, аудитории и возможностей." },
  { icon: "Footprints", title: "Перейти от размышлений к действиям", text: "Получить последовательные рекомендации, которые можно оценить и применить на практике." },
];

const STEPS = [
  { num: "1", title: "Расскажите о своем деле", text: "Укажите направление работы, услуги, аудиторию, регион и другие необходимые данные." },
  { num: "2", title: "Пройдите диагностику", text: "Ответьте на вопросы, которые помогут алгоритмам проанализировать вашу ситуацию." },
  { num: "3", title: "Получите свои шаги", text: "Ознакомьтесь с рекомендациями и определите, с чего начать развитие." },
];

function scrollToForm(e: React.MouseEvent) {
  e.preventDefault();
  document.getElementById("demo-form")?.scrollIntoView({ behavior: "smooth" });
}

const ctaStyle: React.CSSProperties = {
  display: "inline-flex", alignItems: "center", gap: 10,
  padding: "16px 40px", borderRadius: 2, fontSize: 15, fontWeight: 600,
  background: "linear-gradient(135deg,#2DD4BF,#14B8A6)", color: DARK,
  textDecoration: "none", cursor: "pointer",
};

const eyebrow: React.CSSProperties = {
  fontSize: 12, fontWeight: 600, color: TEAL, textTransform: "uppercase", letterSpacing: "2.5px", marginBottom: 20,
};

const h2Style: React.CSSProperties = {
  fontFamily: SERIF, fontSize: "clamp(30px,4vw,46px)", fontWeight: 500, color: DARK, margin: 0, letterSpacing: "-0.5px", lineHeight: 1.15,
};

export function IndexHeroMain() {
  return (
    <section style={{
      background: `radial-gradient(120% 100% at 80% 0%, #112B3C 0%, ${DARK} 55%, #060B16 100%)`,
      minHeight: "100vh", display: "flex", alignItems: "center", paddingTop: 76, position: "relative", overflow: "hidden",
    }}>
      <div style={{ position: "absolute", top: "8%", right: "-8%", width: 680, height: 680, borderRadius: "50%", background: "radial-gradient(circle, rgba(45,212,191,0.10) 0%, transparent 65%)", pointerEvents: "none" }} />
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "100px 32px", width: "100%", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 56, alignItems: "center" }} className="hero-grid">
        <div>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 10, border: "1px solid rgba(45,212,191,0.3)", borderRadius: 100, padding: "7px 18px", marginBottom: 32 }}>
            <div style={{ width: 6, height: 6, borderRadius: "50%", background: TEAL }} />
            <span style={{ fontSize: 12, color: TEAL, fontWeight: 500, letterSpacing: "1.5px", textTransform: "uppercase", lineHeight: 1 }}>Промт Диалог — AI-навигатор «ПоДелам»</span>
          </div>
          <h1 className="hero-h1" style={{ fontFamily: SERIF, fontSize: "clamp(38px,5vw,64px)", fontWeight: 500, color: "#fff", lineHeight: 1.08, margin: "0 0 24px", letterSpacing: "-0.5px" }}>
            Маркетинг, который понимает ваш бизнес
          </h1>
          <p className="hero-subtitle" style={{ fontSize: "clamp(14.5px,1.6vw,17px)", color: "rgba(255,255,255,0.65)", lineHeight: 1.65, margin: "0 0 36px", fontWeight: 300, maxWidth: 540 }}>
            Вы умеете работать со своими клиентами. Но чтобы развивать практику или бизнес, нужно ещё привлекать новых людей, удерживать постоянных и понимать, какие действия действительно принесут результат. «Промт Диалог» анализирует вашу ситуацию и помогает определить конкретные шаги для развития вашего дела.
          </p>
          <a href="#demo-form" onClick={scrollToForm} style={ctaStyle}>
            <Icon name="Compass" size={16} />
            Получить свои шаги
          </a>
          <div style={{ fontSize: 12, color: "rgba(255,255,255,0.45)", marginTop: 12 }}>Начните с диагностики своей практики или бизнеса.</div>
        </div>
        <div style={{ display: "flex", justifyContent: "center" }} className="hero-img">
          <div style={{ position: "relative", width: "100%" }}>
            <div style={{ position: "absolute", inset: -1, borderRadius: 6, background: "linear-gradient(135deg, rgba(45,212,191,0.4), transparent 50%, rgba(45,212,191,0.15))", pointerEvents: "none", zIndex: 2 }} />
            <img
              src="https://cdn.poehali.dev/projects/10f61e56-9821-40f3-b705-3590ddaffd08/bucket/17441cfe-b66d-4a86-ad10-5a1fca3bfed4.png"
              alt="Промт Диалог — AI-навигатор «ПоДелам»"
              fetchpriority="high"
              decoding="async"
              style={{ width: "100%", height: "auto", borderRadius: 4, display: "block", boxShadow: "0 32px 80px rgba(0,0,0,0.5)", position: "relative", zIndex: 1 }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}

export function IndexSegments() {
  return (
    <section style={{ background: "#F8FAFC", padding: "100px 32px" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <div style={{ maxWidth: 640, marginBottom: 56 }}>
          <div style={eyebrow}>Направления</div>
          <h2 style={{ ...h2Style, marginBottom: 20 }}>Для кого «Промт Диалог»?</h2>
          <p style={{ fontSize: 16, color: GRAY, lineHeight: 1.7, margin: 0, fontWeight: 300 }}>
            У каждого бизнеса свои задачи. Выберите своё направление, чтобы получить рекомендации с учетом специфики вашей работы.
          </p>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }} className="dir-grid">
          {SEGMENTS.map((s, i) => (
            <div key={i} style={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: 16, padding: "32px 28px", display: "flex", flexDirection: "column" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
                <div style={{ width: 40, height: 40, borderRadius: 10, background: "rgba(45,212,191,0.12)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <Icon name={s.icon} fallback="Compass" size={20} style={{ color: "#0F766E" }} />
                </div>
                <span style={{ fontSize: 12, fontWeight: 600, color: "#0F766E", textTransform: "uppercase", letterSpacing: "1.5px" }}>{s.tag}</span>
              </div>
              <h3 style={{ fontFamily: SERIF, fontSize: 26, fontWeight: 600, color: DARK, lineHeight: 1.2, margin: "0 0 14px" }}>{s.title}</h3>
              <p style={{ fontSize: 14.5, color: "#475569", lineHeight: 1.7, margin: "0 0 24px", fontWeight: 300, flexGrow: 1 }}>{s.text}</p>
              <Link to={s.href} style={{
                alignSelf: "flex-start", display: "inline-flex", alignItems: "center", gap: 8,
                padding: "13px 28px", borderRadius: 2, fontSize: 14, fontWeight: 600,
                background: DARK, color: "#fff", textDecoration: "none",
              }}>
                {s.button}
                <Icon name="ArrowRight" size={15} />
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function IndexHowItWorks() {
  return (
    <section style={{ background: "#fff", padding: "100px 32px" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <div style={{ maxWidth: 720, marginBottom: 48 }}>
          <div style={eyebrow}>Как это работает</div>
          <h2 style={{ ...h2Style, marginBottom: 20 }}>Не очередные советы. Шаги для вашей ситуации.</h2>
          <p style={{ fontSize: 16, color: GRAY, lineHeight: 1.7, margin: 0, fontWeight: 300 }}>
            Универсальные рекомендации не учитывают, чем вы занимаетесь, кому оказываете услуги и в каких условиях работаете. Поэтому «Промт Диалог» использует встроенные алгоритмы анализа, чтобы формировать рекомендации с учётом вашей ситуации.
          </p>
        </div>
        <div style={{ fontSize: 15, fontWeight: 700, color: DARK, marginBottom: 20 }}>Что анализируется:</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(300px,100%),1fr))", gap: 16, marginBottom: 40 }}>
          {ANALYZED.map((a, i) => (
            <div key={i} style={{ display: "flex", gap: 14, alignItems: "flex-start", background: "#F8FAFC", border: "1px solid #E2E8F0", borderRadius: 12, padding: "18px 20px" }}>
              <div style={{ width: 36, height: 36, borderRadius: 9, background: "rgba(45,212,191,0.12)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <Icon name={a.icon} fallback="Circle" size={17} style={{ color: "#0F766E" }} />
              </div>
              <div style={{ fontSize: 14, color: "#475569", lineHeight: 1.55, fontWeight: 300 }}>
                <span style={{ fontWeight: 600, color: DARK }}>{a.title}</span> — {a.text}
              </div>
            </div>
          ))}
        </div>
        <p style={{ fontSize: 15, color: "#334155", lineHeight: 1.7, margin: "0 0 20px", maxWidth: 820 }}>
          На основе введенных данных встроенные алгоритмы формируют рекомендации и следующие шаги, которые можно использовать для развития своей практики или бизнеса.
        </p>
        <div style={{ background: DARK, borderRadius: 14, padding: "24px 28px", maxWidth: 820, display: "flex", gap: 14, alignItems: "flex-start" }}>
          <Icon name="Info" size={20} style={{ color: TEAL, flexShrink: 0, marginTop: 2 }} />
          <p style={{ fontSize: 14, color: "rgba(255,255,255,0.78)", lineHeight: 1.7, margin: 0, fontWeight: 300 }}>
            <span style={{ fontWeight: 600, color: "#fff" }}>Важное уточнение:</span> ИИ не просто выдает общий список маркетинговых советов и не гарантирует результат. Он анализирует предоставленные вами данные по встроенным алгоритмам и помогает определить возможные направления действий. Чем точнее исходная информация, тем полезнее могут быть рекомендации.
          </p>
        </div>
      </div>
    </section>
  );
}

export function IndexResults() {
  return (
    <section style={{ background: "#F8FAFC", padding: "100px 32px" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <div style={{ maxWidth: 720, marginBottom: 48 }}>
          <div style={eyebrow}>Что вы получите</div>
          <h2 style={{ ...h2Style, marginBottom: 20 }}>Понимание, что делать дальше</h2>
          <p style={{ fontSize: 16, color: GRAY, lineHeight: 1.7, margin: 0, fontWeight: 300 }}>
            Когда задач много, сложно понять, за что браться в первую очередь. «Промт Диалог» помогает посмотреть на свою ситуацию системно и определить следующие шаги.
          </p>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(240px,100%),1fr))", gap: 20 }}>
          {RESULTS.map((r, i) => (
            <div key={i} style={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: 16, padding: "28px 24px" }}>
              <div style={{ width: 44, height: 44, borderRadius: 11, background: "rgba(45,212,191,0.12)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 18 }}>
                <Icon name={r.icon} fallback="Circle" size={21} style={{ color: "#0F766E" }} />
              </div>
              <div style={{ fontSize: 12, color: GRAY, fontWeight: 600, marginBottom: 6 }}>{i + 1}</div>
              <div style={{ fontSize: 16, fontWeight: 700, color: DARK, marginBottom: 10, lineHeight: 1.3 }}>{r.title}</div>
              <div style={{ fontSize: 14, color: "#475569", lineHeight: 1.65, fontWeight: 300 }}>{r.text}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function IndexHowToStart() {
  return (
    <section style={{ background: `radial-gradient(120% 100% at 20% 0%, #112B3C 0%, ${DARK} 55%, #060B16 100%)`, padding: "100px 32px" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <div style={{ ...eyebrow }}>Как начать</div>
        <h2 style={{ ...h2Style, color: "#fff", marginBottom: 48 }}>Начните со своей ситуации</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(260px,100%),1fr))", gap: 24 }}>
          {STEPS.map((s) => (
            <div key={s.num} style={{ border: "1px solid rgba(45,212,191,0.25)", borderRadius: 16, padding: "28px 26px", background: "rgba(255,255,255,0.03)" }}>
              <div style={{ fontFamily: SERIF, fontSize: 44, fontWeight: 600, color: TEAL, lineHeight: 1, marginBottom: 14 }}>{s.num}</div>
              <div style={{ fontSize: 13, color: "rgba(255,255,255,0.45)", textTransform: "uppercase", letterSpacing: "1.5px", marginBottom: 8 }}>Шаг {s.num}</div>
              <div style={{ fontSize: 17, fontWeight: 600, color: "#fff", marginBottom: 10 }}>{s.title}</div>
              <div style={{ fontSize: 14, color: "rgba(255,255,255,0.65)", lineHeight: 1.65, fontWeight: 300 }}>{s.text}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function IndexFinal() {
  return (
    <section style={{ background: "#F8FAFC", padding: "110px 32px" }}>
      <div style={{ maxWidth: 820, margin: "0 auto", textAlign: "center" }}>
        <h2 style={{ ...h2Style, fontSize: "clamp(32px,4.5vw,52px)", marginBottom: 24 }}>
          Ваше дело заслуживает большего, чем случайные решения
        </h2>
        <p style={{ fontSize: 16, color: "#475569", lineHeight: 1.75, margin: "0 auto 36px", fontWeight: 300, maxWidth: 700 }}>
          Необязательно пробовать всё подряд, постоянно искать новые советы и самостоятельно разбираться во всех вопросах продвижения. Начните с анализа своей ситуации. Определите точки роста и получите рекомендации, которые помогут выбрать следующие шаги для развития вашей практики или бизнеса.
        </p>
        <a href="#demo-form" onClick={scrollToForm} style={ctaStyle}>
          <Icon name="Compass" size={16} />
          Получить свои шаги
        </a>
        <div style={{ fontSize: 13, color: GRAY, marginTop: 14 }}>Начните с бесплатной диагностики.</div>
      </div>
    </section>
  );
}
