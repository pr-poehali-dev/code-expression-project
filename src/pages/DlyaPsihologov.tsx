import { Link } from "react-router-dom";
import { Helmet } from "@/lib/helmet";
import BizNavbar from "@/components/BizNavbar";
import BizFooter from "@/components/BizFooter";
import Icon from "@/components/ui/icon";
import { TEAL, DARK, GRAY, SERIF, CTA_HREF } from "./dlya-psihologov/shared";

const HERO_IMG = "https://cdn.poehali.dev/projects/10f61e56-9821-40f3-b705-3590ddaffd08/files/4b1cb1b7-eb02-4473-bbf3-09f3cb9cd4b9.jpg";

const SITUATIONS = [
  { icon: "CalendarX", title: "Клиенты приходят нерегулярно", text: "В одни периоды расписание заполнено, в другие появляются свободные часы. Вы не хотите превращать работу в агрессивные продажи, но хотите понимать, как сделать привлечение клиентов более системным." },
  { icon: "MessageCircle", title: "Сложно рассказывать о себе", text: "Психологическая работа индивидуальна и часто требует деликатного подхода. Не всегда понятно, как объяснить, с какими запросами вы работаете, в чём особенности вашего подхода и кому могут подойти ваши услуги, не упрощая профессиональную работу до рекламного лозунга." },
  { icon: "Users", title: "Рекомендаций недостаточно для развития", text: "Клиенты могут рекомендовать вас знакомым, и это ценно. Но хочется, чтобы новые люди могли находить вас и самостоятельно понимать, подходит ли им ваше направление работы." },
  { icon: "EyeOff", title: "Продвижение вызывает внутреннее сопротивление", text: "Публикации, реклама, личный бренд, социальные сети. Может возникать ощущение, что для развития практики нужно постоянно показывать себя, создавать контент и привлекать внимание. Но такой формат подходит не каждому психологу." },
  { icon: "Compass", title: "Непонятно, на чём сосредоточиться", text: "Развивать специализацию, вести блог, запускать рекламу, проводить группы, создавать образовательные продукты или расширять частную практику? Возможностей много, но время и ресурсы ограничены." },
  { icon: "UserCheck", title: "Не хочется привлекать неподходящих клиентов", text: "Важно не просто увеличить количество обращений. Хочется, чтобы люди понимали особенности вашей работы, приходили с подходящими запросами и осознанно выбирали специалиста." },
];

const ANALYZED = [
  { icon: "Brain", title: "Ваши услуги и специализация", text: "индивидуальные консультации, семейная работа, группы, психологическое консультирование и другие направления, которые вы действительно предлагаете." },
  { icon: "Users", title: "Ваша аудитория", text: "для кого предназначена ваша работа, с какими запросами вы работаете и каких клиентов хотите привлекать." },
  { icon: "MapPin", title: "Ваш регион и формат работы", text: "география практики, очные или онлайн-консультации и другие указанные вами особенности." },
  { icon: "PenLine", title: "Ваше позиционирование", text: "как вы описываете свою работу и чем ваш подход отличается от других предложений." },
  { icon: "Clock", title: "Ваше время и ресурсы", text: "сколько времени вы можете уделять продвижению, не перегружая себя и не снижая качество работы с клиентами." },
  { icon: "Flag", title: "Ваши цели и текущая ситуация", text: "стабильность записи, развитие специализации, расширение практики или другие задачи." },
];

const VALUES = [
  { icon: "MessageSquareText", title: "Объяснять, с чем вы работаете", text: "Помогать людям понимать, какие вопросы вы рассматриваете в своей практике, как устроена работа и чего можно ожидать от процесса — без обещаний гарантированного результата." },
  { icon: "Fingerprint", title: "Делать свою специализацию понятнее", text: "Показывать особенности профессионального подхода и аудиторию, для которой он предназначен, не обесценивая другие направления психологии." },
  { icon: "Route", title: "Находить подходящие способы продвижения", text: "Рассматривать варианты развития практики с учетом вашего характера, доступного времени, формата работы и отношения к публичности." },
  { icon: "Sprout", title: "Выстраивать долгосрочное развитие", text: "Определять приоритеты, которые помогают последовательно работать над практикой, вместо постоянной смены идей и попыток повторить чужой успех." },
];

const RESULTS = [
  { icon: "TrendingUp", title: "Понимание точек роста", text: "Посмотрите на свою практику со стороны и определите, какие направления развития заслуживают внимания в первую очередь." },
  { icon: "PenLine", title: "Более понятное позиционирование", text: "Разберитесь, как яснее представить свою специализацию, услуги и особенности подхода потенциальным клиентам." },
  { icon: "Lightbulb", title: "Идеи для привлечения подходящей аудитории", text: "Рассмотрите варианты продвижения ваших услуг, целевой аудитории, региона и доступных ресурсов." },
  { icon: "ListOrdered", title: "Приоритеты вместо хаотичных действий", text: "Определите, какие задачи стоит решать сейчас, а какие можно отложить, чтобы не распылять время и силы." },
  { icon: "Footprints", title: "Следующие шаги для практики", text: "Получите рекомендации, которые можно оценить с профессиональной точки зрения и адаптировать под собственный стиль работы." },
];

const STEPS = [
  { title: "Расскажите о своей практике", text: "Укажите специализацию, услуги, аудиторию, формат работы, регион, цели и текущие задачи." },
  { title: "Пройдите бесплатную диагностику", text: "Ответьте на вопросы, необходимые для анализа вашей ситуации." },
  { title: "Получите персональные шаги", text: "Ознакомьтесь с рекомендациями и определите, какие направления развития стоит рассмотреть в первую очередь." },
];

const eyebrow: React.CSSProperties = { fontSize: 12, fontWeight: 600, color: TEAL, textTransform: "uppercase", letterSpacing: "2.5px", marginBottom: 20 };
const h2Style: React.CSSProperties = { fontFamily: SERIF, fontSize: "clamp(30px,4vw,46px)", fontWeight: 500, color: DARK, margin: 0, letterSpacing: "-0.5px", lineHeight: 1.15 };
const ctaStyle: React.CSSProperties = {
  display: "inline-flex", alignItems: "center", gap: 10, padding: "16px 40px", borderRadius: 2,
  fontSize: 15, fontWeight: 600, background: "linear-gradient(135deg,#2DD4BF,#14B8A6)", color: DARK, textDecoration: "none",
};
const iconBox: React.CSSProperties = {
  width: 44, height: 44, borderRadius: 11, background: "rgba(45,212,191,0.12)",
  display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
};

function CtaButton({ children }: { children: React.ReactNode }) {
  return (
    <Link to={CTA_HREF} style={ctaStyle}>
      <Icon name="Compass" size={16} />
      {children}
    </Link>
  );
}

export default function DlyaPsihologov() {
  return (
    <div style={{ fontFamily: "Inter, sans-serif", background: "#fff" }}>
      <Helmet>
        <title>Развитие практики психолога: как найти клиентов | Промт Диалог</title>
        <meta name="description" content="Бесплатная диагностика для психологов: AI-навигатор «ПоДелам» поможет определить шаги развития частной практики и продвижения с учётом ваших ценностей." />
        <meta name="keywords" content="развитие частной практики психолога, как психологу найти клиентов, привлечение клиентов психологу, продвижение психолога, маркетинг для психолога, позиционирование психолога, как рассказать о себе психологу, продвижение без навязчивой рекламы, ИИ для психолога, бесплатная диагностика практики" />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://promtdialog.ru/dlya-psihologov" />
        <meta property="og:title" content="Развитие практики психолога: как найти клиентов — Промт Диалог" />
        <meta property="og:description" content="Бесплатная диагностика и персональные шаги для психологов: позиционирование, продвижение, стабильность практики." />
        <meta property="og:url" content="https://promtdialog.ru/dlya-psihologov" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Развитие практики психолога: как найти клиентов — Промт Диалог" />
        <meta name="twitter:description" content="Бесплатная диагностика практики и персональные шаги для психологов." />
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebPage",
          "name": "Развитие практики психолога: как найти клиентов",
          "url": "https://promtdialog.ru/dlya-psihologov",
          "description": "Бесплатная диагностика для психологов: позиционирование, продвижение и развитие частной практики с учётом профессиональных ценностей.",
          "isPartOf": { "@type": "WebSite", "name": "Промт Диалог", "url": "https://promtdialog.ru" }
        })}</script>
      </Helmet>
      <BizNavbar />

      <section style={{ background: `radial-gradient(120% 100% at 70% 0%, #1a2e3c 0%, ${DARK} 55%, #060B16 100%)`, minHeight: "80vh", display: "flex", alignItems: "center", paddingTop: 76, position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: 0, right: "-5%", width: 600, height: 600, borderRadius: "50%", background: "radial-gradient(circle, rgba(45,212,191,0.10) 0%, transparent 65%)", pointerEvents: "none" }} />
        <div className="psy-hero-grid" style={{ maxWidth: 1200, margin: "0 auto", padding: "80px 32px", width: "100%", position: "relative", display: "grid", gridTemplateColumns: "1.15fr 0.85fr", gap: 56, alignItems: "center" }}>
          <div>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 10, border: "1px solid rgba(45,212,191,0.3)", borderRadius: 100, padding: "7px 18px", marginBottom: 32 }}>
              <div style={{ width: 6, height: 6, borderRadius: "50%", background: TEAL }} />
              <span style={{ fontSize: 12, color: TEAL, fontWeight: 500, letterSpacing: "1.5px", textTransform: "uppercase", lineHeight: 1 }}>Промт Диалог — AI-навигатор «ПоДелам»</span>
            </div>
            <h1 style={{ fontFamily: SERIF, fontSize: "clamp(32px,4.4vw,54px)", fontWeight: 500, color: "#fff", lineHeight: 1.15, margin: "0 0 28px", letterSpacing: "-0.5px", paddingBottom: 4 }}>
              Вы помогаете людям разобраться в себе. А кто помогает развивать вашу практику?
            </h1>
            <p style={{ fontSize: "clamp(15px,1.6vw,17px)", color: "rgba(255,255,255,0.65)", lineHeight: 1.7, margin: "0 0 16px", fontWeight: 300, maxWidth: 720 }}>
              Вы вкладываетесь в работу с клиентами, развиваете профессиональные навыки и бережно относитесь к доверию людей. Но частная практика требует не только компетентности: нужно объяснять ценность своей работы, находить подходящих клиентов, выстраивать продвижение и планировать загрузку.
            </p>
            <p style={{ fontSize: "clamp(15px,1.6vw,17px)", color: "rgba(255,255,255,0.65)", lineHeight: 1.7, margin: "0 0 16px", fontWeight: 300, maxWidth: 720 }}>
              Как рассказывать о себе без навязчивой саморекламы? Как находить людей, которым действительно подходит ваш подход? Как развивать практику, не превращая психологическую работу в бесконечную гонку за клиентами?
            </p>
            <p style={{ fontSize: "clamp(15px,1.6vw,17px)", color: "rgba(255,255,255,0.65)", lineHeight: 1.7, margin: "0 0 36px", fontWeight: 300, maxWidth: 720 }}>
              «Промт Диалог» помогает проанализировать вашу ситуацию и определить следующие шаги для развития практики — с учётом ваших услуг, аудитории, региона, времени и возможностей.
            </p>
            <CtaButton>Пройти диагностику бесплатно</CtaButton>
            <div style={{ fontSize: 12, color: "rgba(255,255,255,0.45)", marginTop: 12 }}>Диагностика и получение персональных шагов бесплатны.</div>
          </div>
          <div className="psy-hero-img" style={{ position: "relative" }}>
            <div style={{ position: "absolute", inset: -1, borderRadius: 6, background: "linear-gradient(135deg, rgba(45,212,191,0.4), transparent 50%, rgba(45,212,191,0.15))", pointerEvents: "none", zIndex: 2 }} />
            <img
              src={HERO_IMG}
              alt="Психологи в уютном кабинете частной практики"
              fetchPriority="high"
              decoding="async"
              style={{ width: "100%", height: "auto", borderRadius: 4, display: "block", boxShadow: "0 32px 80px rgba(0,0,0,0.5)", position: "relative", zIndex: 1 }}
            />
          </div>
        </div>
      </section>

      <section style={{ background: "#F8FAFC", padding: "100px 32px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ maxWidth: 760, marginBottom: 48 }}>
            <div style={eyebrow}>Знакомая ситуация</div>
            <h2 style={{ ...h2Style, marginBottom: 20 }}>Вы психолог. Но частная практика — это ещё и работа над её развитием</h2>
            <p style={{ fontSize: 16, color: GRAY, lineHeight: 1.7, margin: 0, fontWeight: 300 }}>
              Вы можете быть внимательным специалистом, постоянно учиться и помогать клиентам решать важные для них задачи. Но профессиональная подготовка сама по себе не отвечает на вопросы о позиционировании, продвижении и стабильности практики.
            </p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(300px,100%),1fr))", gap: 20, marginBottom: 40 }}>
            {SITUATIONS.map((s, i) => (
              <div key={i} style={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: 16, padding: "28px 26px" }}>
                <div style={{ ...iconBox, marginBottom: 18 }}>
                  <Icon name={s.icon} fallback="Circle" size={21} style={{ color: "#0F766E" }} />
                </div>
                <div style={{ fontSize: 17, fontWeight: 700, color: DARK, marginBottom: 10, lineHeight: 1.3 }}>{s.title}</div>
                <div style={{ fontSize: 14, color: "#475569", lineHeight: 1.7, fontWeight: 300 }}>{s.text}</div>
              </div>
            ))}
          </div>
          <p style={{ fontSize: 17, color: DARK, lineHeight: 1.7, margin: 0, maxWidth: 800, fontWeight: 500 }}>
            Развитие практики не должно противоречить вашим профессиональным ценностям. Можно искать подходящие способы продвижения, сохраняя уважение к клиентам, собственным границам и специфике психологической работы.
          </p>
        </div>
      </section>

      <section style={{ background: "#fff", padding: "100px 32px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ maxWidth: 760, marginBottom: 40 }}>
            <div style={eyebrow}>Решение</div>
            <h2 style={{ ...h2Style, marginBottom: 20 }}>Продвижение, которое учитывает специфику вашей практики</h2>
            <p style={{ fontSize: 16, color: GRAY, lineHeight: 1.7, margin: "0 0 14px", fontWeight: 300 }}>
              «Промт Диалог» помогает посмотреть на развитие практики системно: понять текущую ситуацию, определить возможные точки роста и выбрать следующие действия.
            </p>
            <p style={{ fontSize: 16, color: GRAY, lineHeight: 1.7, margin: 0, fontWeight: 300 }}>
              Вы проходите бесплатную диагностику. Встроенные алгоритмы анализируют предоставленные вами данные и формируют рекомендации с учётом особенностей вашей работы.
            </p>
          </div>
          <div style={{ fontSize: 15, fontWeight: 700, color: DARK, marginBottom: 16 }}>Что учитывается при анализе:</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(300px,100%),1fr))", gap: 16, marginBottom: 32 }}>
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
          <p style={{ fontSize: 15, color: "#334155", lineHeight: 1.7, margin: "0 0 24px", maxWidth: 820 }}>
            На основе введенных данных алгоритмы помогают определить направления, которые стоит рассмотреть в первую очередь, и сформировать последовательность дальнейших шагов.
          </p>
          <div style={{ background: DARK, borderRadius: 14, padding: "24px 28px", maxWidth: 820, marginBottom: 36, display: "flex", gap: 14, alignItems: "flex-start" }}>
            <Icon name="Sparkles" size={20} style={{ color: TEAL, flexShrink: 0, marginTop: 2 }} />
            <p style={{ fontSize: 15, color: "rgba(255,255,255,0.85)", lineHeight: 1.7, margin: 0, fontWeight: 300 }}>
              Не нужно копировать чужую стратегию, становиться блогером или использовать навязчивые продажи. Начните с анализа своей ситуации и выберите способы развития, которые соответствуют вашей практике и профессиональным принципам.
            </p>
          </div>
          <CtaButton>Получить свои шаги бесплатно</CtaButton>
        </div>
      </section>

      <section style={{ background: "#F8FAFC", padding: "100px 32px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ maxWidth: 800, marginBottom: 48 }}>
            <div style={eyebrow}>Профессиональные ценности</div>
            <h2 style={{ ...h2Style, marginBottom: 20 }}>Вам не нужно выбирать между хорошей практикой и продвижением</h2>
            <p style={{ fontSize: 16, color: GRAY, lineHeight: 1.7, margin: "0 0 14px", fontWeight: 300 }}>
              Продвижение психологических услуг требует особого подхода. Здесь важно не обещать быстрых изменений, не давить на уязвимость людей и не превращать сложные жизненные ситуации в рекламные инструменты.
            </p>
            <p style={{ fontSize: 16, color: GRAY, lineHeight: 1.7, margin: 0, fontWeight: 300 }}>
              Развивать практику можно иначе: понятно рассказывать о своей работе, помогать потенциальным клиентам разобраться в формате услуг и выстраивать последовательную коммуникацию.
            </p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(300px,100%),1fr))", gap: 20, marginBottom: 40 }}>
            {VALUES.map((v, i) => (
              <div key={i} style={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: 16, padding: "28px 26px" }}>
                <div style={{ ...iconBox, marginBottom: 16 }}>
                  <Icon name={v.icon} fallback="Circle" size={21} style={{ color: "#0F766E" }} />
                </div>
                <div style={{ fontSize: 12, color: GRAY, fontWeight: 600, marginBottom: 6 }}>{i + 1}</div>
                <div style={{ fontSize: 16, fontWeight: 700, color: DARK, marginBottom: 10, lineHeight: 1.3 }}>{v.title}</div>
                <div style={{ fontSize: 14, color: "#475569", lineHeight: 1.7, fontWeight: 300 }}>{v.text}</div>
              </div>
            ))}
          </div>
          <div style={{ background: DARK, borderRadius: 14, padding: "24px 28px", maxWidth: 820, display: "flex", gap: 14, alignItems: "flex-start" }}>
            <Icon name="Scale" size={20} style={{ color: TEAL, flexShrink: 0, marginTop: 2 }} />
            <p style={{ fontSize: 15, color: "rgba(255,255,255,0.85)", lineHeight: 1.7, margin: 0, fontWeight: 300 }}>
              Ваша профессиональная этика — не препятствие для развития. Это важная часть того, как вы строите практику и отношения с клиентами.
            </p>
          </div>
        </div>
      </section>

      <section style={{ background: "#fff", padding: "100px 32px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={eyebrow}>Что вы получите</div>
          <h2 style={{ ...h2Style, marginBottom: 48, maxWidth: 760 }}>Больше ясности в развитии вашей практики</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(300px,100%),1fr))", gap: 20 }}>
            {RESULTS.map((r, i) => (
              <div key={i} style={{ background: "#F8FAFC", border: "1px solid #E2E8F0", borderRadius: 16, padding: "28px 24px" }}>
                <div style={{ ...iconBox, marginBottom: 16 }}>
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

      <section style={{ background: `radial-gradient(120% 100% at 20% 0%, #112B3C 0%, ${DARK} 55%, #060B16 100%)`, padding: "100px 32px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={eyebrow}>Как начать</div>
          <h2 style={{ ...h2Style, color: "#fff", marginBottom: 48, maxWidth: 760 }}>Начните с вашей ситуации, а не с чужих советов</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(260px,100%),1fr))", gap: 24, marginBottom: 44 }}>
            {STEPS.map((s, i) => (
              <div key={i} style={{ border: "1px solid rgba(45,212,191,0.25)", borderRadius: 16, padding: "28px 26px", background: "rgba(255,255,255,0.03)" }}>
                <div style={{ fontFamily: SERIF, fontSize: 44, fontWeight: 600, color: TEAL, lineHeight: 1, marginBottom: 12 }}>{i + 1}</div>
                <div style={{ fontSize: 12, color: "rgba(255,255,255,0.45)", textTransform: "uppercase", letterSpacing: "1.5px", marginBottom: 8 }}>Шаг {i + 1}</div>
                <div style={{ fontSize: 17, fontWeight: 600, color: "#fff", marginBottom: 10 }}>{s.title}</div>
                <div style={{ fontSize: 14, color: "rgba(255,255,255,0.65)", lineHeight: 1.65, fontWeight: 300 }}>{s.text}</div>
              </div>
            ))}
          </div>
          <CtaButton>Пройти диагностику бесплатно</CtaButton>
          <div style={{ fontSize: 12, color: "rgba(255,255,255,0.45)", marginTop: 12 }}>Диагностика и получение шагов бесплатны.</div>
        </div>
      </section>

      <section style={{ background: "#F8FAFC", padding: "100px 32px" }}>
        <div style={{ maxWidth: 820, margin: "0 auto", textAlign: "center" }}>
          <div style={{ ...iconBox, margin: "0 auto 20px" }}>
            <Icon name="BookOpen" size={21} style={{ color: "#0F766E" }} />
          </div>
          <h2 style={{ ...h2Style, marginBottom: 20 }}>О развитии психологической практики — без шаблонных рецептов</h2>
          <p style={{ fontSize: 16, color: "#475569", lineHeight: 1.75, margin: "0 0 14px", fontWeight: 300 }}>
            Как рассказывать о своей работе, объяснять специализацию, находить подходящих клиентов, развивать частную практику и планировать продвижение, сохраняя профессиональные ценности.
          </p>
          <p style={{ fontSize: 16, color: "#475569", lineHeight: 1.75, margin: "0 0 32px", fontWeight: 300 }}>
            Читайте материалы для психологов, знакомьтесь с разными подходами и выбирайте идеи, которые подходят вашей практике, формату работы и отношению к публичности.
          </p>
          <Link
            to="/blog?role=psych"
            style={{ display: "inline-flex", alignItems: "center", gap: 10, padding: "15px 36px", borderRadius: 2, fontSize: 15, fontWeight: 600, background: DARK, color: "#fff", textDecoration: "none" }}
          >
            Полезные материалы для психологов
            <Icon name="ArrowRight" size={16} />
          </Link>
        </div>
      </section>

      <section style={{ padding: "110px 32px", background: `linear-gradient(135deg, ${DARK} 0%, #0F2A30 100%)`, position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: "-30%", left: "50%", transform: "translateX(-50%)", width: 700, height: 700, borderRadius: "50%", background: "radial-gradient(circle, rgba(45,212,191,0.10) 0%, transparent 65%)", pointerEvents: "none" }} />
        <div style={{ maxWidth: 800, margin: "0 auto", textAlign: "center", position: "relative" }}>
          <h2 style={{ fontFamily: SERIF, fontSize: "clamp(30px,4.2vw,50px)", fontWeight: 500, color: "#fff", margin: "0 0 24px", lineHeight: 1.12 }}>
            Помогайте людям. А развитие своей практики сделайте более понятным
          </h2>
          <p style={{ fontSize: 16, color: "rgba(255,255,255,0.65)", lineHeight: 1.75, margin: "0 0 16px", fontWeight: 300 }}>
            Вам не обязательно самостоятельно разбираться во всех вопросах маркетинга, постоянно создавать контент или пробовать каждый новый способ продвижения.
          </p>
          <p style={{ fontSize: 16, color: "rgba(255,255,255,0.65)", lineHeight: 1.75, margin: "0 0 16px", fontWeight: 300 }}>
            Можно начать с понимания своей ситуации: что уже работает, каких результатов вы хотите достичь и какие действия стоит рассмотреть дальше.
          </p>
          <p style={{ fontSize: 16, color: "rgba(255,255,255,0.65)", lineHeight: 1.75, margin: "0 0 16px", fontWeight: 300 }}>
            «Промт Диалог» поможет проанализировать вашу практику и определить возможные направления развития с учётом вашей специализации, аудитории, региона, времени и ресурсов.
          </p>
          <p style={{ fontSize: 16, color: "rgba(255,255,255,0.85)", lineHeight: 1.75, margin: "0 0 36px", fontWeight: 400 }}>
            Пройдите бесплатную диагностику, получите свои шаги и решите, что подходит именно вам.
          </p>
          <CtaButton>Пройти диагностику и получить шаги бесплатно</CtaButton>
        </div>
      </section>

      <BizFooter />

      <div className="psy-mobile-sticky-cta" style={{
        display: "none", position: "fixed", left: 0, right: 0, bottom: 0, zIndex: 150,
        padding: "12px 16px calc(12px + env(safe-area-inset-bottom,0px))",
        background: "rgba(8,14,28,0.96)", backdropFilter: "blur(12px)",
        borderTop: "1px solid rgba(45,212,191,0.15)",
      }}>
        <Link to={CTA_HREF} style={{
          display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
          width: "100%", padding: "14px", borderRadius: 10, fontSize: 14, fontWeight: 700,
          background: "linear-gradient(135deg,#2DD4BF,#14B8A6)", color: DARK,
          textDecoration: "none", fontFamily: "Inter, sans-serif",
        }}>
          <Icon name="Compass" size={16} />
          Пройти диагностику
        </Link>
      </div>

      <style>{`
        @media (max-width: 860px) {
          .psy-hero-grid { grid-template-columns: 1fr !important; gap: 36px !important; }
          .psy-hero-img { max-width: 480px; width: 100%; margin: 0 auto; }
          .psy-mobile-sticky-cta { display: block !important; }
        }
        @media (max-width: 560px) {
          section { padding-left: 20px !important; padding-right: 20px !important; }
          .psy-hero-grid { padding-left: 0 !important; padding-right: 0 !important; padding-top: 48px !important; padding-bottom: 56px !important; }
        }
      `}</style>
    </div>
  );
}
