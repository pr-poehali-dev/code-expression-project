import { Link } from "react-router-dom";
import { Helmet } from "@/lib/helmet";
import BizNavbar from "@/components/BizNavbar";
import BizFooter from "@/components/BizFooter";
import Icon from "@/components/ui/icon";

const TEAL = "#2DD4BF";
const DARK = "#0F172A";
const GRAY = "#64748B";
const SERIF = "'Cormorant Garamond', serif";
const DIAG_URL = "/diagnostika";
const HERO_IMG = "https://cdn.poehali.dev/projects/10f61e56-9821-40f3-b705-3590ddaffd08/files/2319b0d6-47ca-40b5-bdab-f081e6c2fdb2.jpg";

const SITUATIONS = [
  { icon: "CalendarX", title: "Запись нестабильна", text: "Сегодня расписание заполнено, а на следующей неделе появляются свободные окна. Хочется понимать, как привлекать клиентов регулярнее, а не зависеть только от случайных обращений." },
  { icon: "Users", title: "Клиенты приходят по рекомендациям", text: "Сарафанное радио помогает, и это ценно. Но хочется, чтобы о вас узнавали и новые люди, а развитие практики не зависело исключительно от рекомендаций знакомых и постоянных клиентов." },
  { icon: "Repeat", title: "Не все клиенты возвращаются", text: "Человек получил услугу, остался доволен, но больше не записался. Как поддерживать контакт, напоминать о себе уместно и помогать клиентам возвращаться без навязчивых предложений?" },
  { icon: "Clock", title: "На продвижение не хватает времени", text: "Вы работаете с клиентами, готовите кабинет, покупаете материалы, отвечаете на сообщения. Когда заниматься публикациями, рекламой и поиском новых способов привлечения людей?" },
  { icon: "HelpCircle", title: "Непонятно, что действительно сработает", text: "Советов по продвижению много: вести социальные сети, запускать рекламу, делать скидки, записывать видео. Но что подходит именно вашей практике и стоит ли тратить на это время и деньги?" },
  { icon: "Sparkles", title: "Трудно рассказать о себе", text: "Вы знаете, чем ваша работа полезна клиентам, но не всегда понятно, как объяснить это словами и показать ценность услуг так, чтобы человек захотел записаться именно к вам." },
];

const ANALYZED = [
  { icon: "Hand", title: "Ваши услуги", text: "массаж, косметические процедуры, уходовые услуги и другие направления вашей практики." },
  { icon: "Users", title: "Ваша аудитория", text: "кому подходят ваши услуги, какие задачи решают клиенты и кого вы хотите привлекать." },
  { icon: "MapPin", title: "Ваш регион", text: "где вы работаете и какую аудиторию можете охватить." },
  { icon: "Clock", title: "Ваше время", text: "сколько времени реально выделять на продвижение помимо работы с клиентами." },
  { icon: "Briefcase", title: "Ваши ресурсы", text: "какие возможности есть для развития и продвижения." },
  { icon: "Flag", title: "Ваша текущая ситуация", text: "что уже работает, какие трудности возникают и каких результатов вы хотите достичь." },
];

const RESULTS = [
  { icon: "Search", title: "Понять, где искать новых клиентов", text: "Разобраться, какие направления привлечения аудитории стоит рассмотреть с учетом ваших услуг, региона и возможностей." },
  { icon: "CalendarCheck", title: "Работать над стабильностью записи", text: "Определить, какие действия можно предпринять, чтобы уменьшить количество свободных окон и сделать привлечение клиентов более системным." },
  { icon: "HeartHandshake", title: "Развивать отношения с постоянными клиентами", text: "Рассмотреть способы поддерживать контакт, стимулировать повторные обращения и напоминать о своих услугах без навязчивости." },
  { icon: "Megaphone", title: "Продвигать свои услуги понятнее", text: "Определить, как рассказывать о своей работе, доносить ценность услуг и помогать потенциальным клиентам понять, почему им стоит обратиться именно к вам." },
  { icon: "Footprints", title: "Выбрать реальные следующие шаги", text: "Получить рекомендации, которые можно оценить и постепенно внедрять, не пытаясь переделать всю практику за один день." },
  { icon: "Timer", title: "Учесть своё время и возможности", text: "Подобрать способы продвижения, которые реально вписать в рабочий график между приёмами, не жертвуя временем на клиентов и отдых." },
];

const AUDIENCE = [
  { icon: "Hand", title: "Массажистам", text: "Для тех, кто хочет расширять клиентскую базу, работать над повторными визитами и развивать практику без постоянной зависимости от рекомендаций." },
  { icon: "Sparkles", title: "Мастерам красоты", text: "Для специалистов, которые хотят сделать запись стабильнее, понятнее рассказывать о своих услугах и находить новых клиентов." },
  { icon: "UserCog", title: "Частным специалистам других направлений", text: "Для тех, кто самостоятельно оказывает услуги, отвечает за собственное продвижение и хочет понимать, какие действия помогут развивать дело." },
];

const STEPS = [
  { title: "Расскажите о своей работе", text: "Укажите услуги, аудиторию, регион, цели и текущие задачи." },
  { title: "Пройдите бесплатную диагностику", text: "Ответьте на вопросы, необходимые для анализа вашей ситуации." },
  { title: "Получите персональные шаги", text: "Изучите рекомендации и определите, с чего начать развитие практики." },
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
    <Link to={DIAG_URL} style={ctaStyle}>
      <Icon name="Compass" size={16} />
      {children}
    </Link>
  );
}

export default function DlyaMasterov() {
  return (
    <div style={{ fontFamily: "Inter, sans-serif", background: "#fff" }}>
      <Helmet>
        <title>Как привлечь клиентов мастеру и массажисту | Промт Диалог</title>
        <meta name="description" content="Бесплатная диагностика для частных мастеров и массажистов: AI-навигатор «ПоДелам» поможет определить шаги для стабильной записи и привлечения клиентов." />
        <meta name="keywords" content="как привлечь клиентов массажисту, продвижение массажиста, маркетинг для частного мастера, стабильная запись клиентов, свободные окна в записи, повторные записи клиентов, продвижение мастера красоты, как найти клиентов мастеру, продвижение частной практики, ИИ для мастера, бесплатная диагностика практики" />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://promtdialog.ru/dlya-masterov" />
        <meta property="og:title" content="Как привлечь клиентов мастеру и массажисту — Промт Диалог" />
        <meta property="og:description" content="Бесплатная диагностика и персональные шаги для мастеров и массажистов: запись, новые клиенты, повторные визиты." />
        <meta property="og:url" content="https://promtdialog.ru/dlya-masterov" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Как привлечь клиентов мастеру и массажисту — Промт Диалог" />
        <meta name="twitter:description" content="Бесплатная диагностика практики и персональные шаги для развития." />
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebPage",
          "name": "Как привлечь клиентов мастеру и массажисту",
          "url": "https://promtdialog.ru/dlya-masterov",
          "description": "Бесплатная диагностика для частных мастеров и массажистов: стабильная запись, привлечение клиентов, повторные визиты.",
          "isPartOf": { "@type": "WebSite", "name": "Промт Диалог", "url": "https://promtdialog.ru" }
        })}</script>
      </Helmet>
      <BizNavbar />

      <section style={{ background: `radial-gradient(120% 100% at 70% 0%, #1a2e3c 0%, ${DARK} 55%, #060B16 100%)`, minHeight: "80vh", display: "flex", alignItems: "center", paddingTop: 76, position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: 0, right: "-5%", width: 600, height: 600, borderRadius: "50%", background: "radial-gradient(circle, rgba(45,212,191,0.10) 0%, transparent 65%)", pointerEvents: "none" }} />
        <div className="master-hero-grid" style={{ maxWidth: 1200, margin: "0 auto", padding: "80px 32px", width: "100%", position: "relative", display: "grid", gridTemplateColumns: "1.15fr 0.85fr", gap: 56, alignItems: "center" }}>
          <div>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 10, border: "1px solid rgba(45,212,191,0.3)", borderRadius: 100, padding: "7px 18px", marginBottom: 32 }}>
              <div style={{ width: 6, height: 6, borderRadius: "50%", background: TEAL }} />
              <span style={{ fontSize: 12, color: TEAL, fontWeight: 500, letterSpacing: "1.5px", textTransform: "uppercase", lineHeight: 1 }}>Промт Диалог — AI-навигатор «ПоДелам»</span>
            </div>
            <h1 style={{ fontFamily: SERIF, fontSize: "clamp(34px,4.6vw,58px)", fontWeight: 500, color: "#fff", lineHeight: 1.15, margin: "0 0 28px", letterSpacing: "-0.5px", paddingBottom: 4 }}>
              Вы хорошо работаете. Как сделать так, чтобы клиентов стало больше?
            </h1>
            <p style={{ fontSize: "clamp(15px,1.6vw,17px)", color: "rgba(255,255,255,0.65)", lineHeight: 1.7, margin: "0 0 16px", fontWeight: 300, maxWidth: 720 }}>
              Вы вкладываете силы в свою работу, заботитесь о клиентах и развиваете профессиональные навыки. Но стабильная запись зависит не только от качества услуг. Нужно ещё привлекать новых клиентов, возвращать постоянных, рассказывать о себе и находить время на продвижение.
            </p>
            <p style={{ fontSize: "clamp(15px,1.6vw,17px)", color: "rgba(255,255,255,0.65)", lineHeight: 1.7, margin: "0 0 36px", fontWeight: 300, maxWidth: 720 }}>
              «Промт Диалог» анализирует вашу ситуацию и помогает определить конкретные шаги для развития практики — с учётом ваших услуг, аудитории, региона, времени и возможностей.
            </p>
            <CtaButton>Пройти диагностику бесплатно</CtaButton>
            <div style={{ fontSize: 12, color: "rgba(255,255,255,0.45)", marginTop: 12 }}>Диагностика и получение персональных шагов бесплатны.</div>
          </div>
          <div className="master-hero-img" style={{ position: "relative" }}>
            <div style={{ position: "absolute", inset: -1, borderRadius: 6, background: "linear-gradient(135deg, rgba(45,212,191,0.4), transparent 50%, rgba(45,212,191,0.15))", pointerEvents: "none", zIndex: 2 }} />
            <img
              src={HERO_IMG}
              alt="Массажист и мастер красоты в частном кабинете"
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
            <h2 style={{ ...h2Style, marginBottom: 20 }}>Вы мастер. Но вместе с работой на вас ещё и весь бизнес</h2>
            <p style={{ fontSize: 16, color: GRAY, lineHeight: 1.7, margin: 0, fontWeight: 300 }}>
              Когда работаешь на себя, нужно не только качественно оказывать услуги. Приходится самому думать о клиентах, записи, продвижении и доходе. И не всегда понятно, за что браться в первую очередь.
            </p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(300px,100%),1fr))", gap: 20, marginBottom: 40 }}>
            {SITUATIONS.map((s, i) => (
              <div key={i} style={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: 16, padding: "28px 26px" }}>
                <div style={{ ...iconBox, marginBottom: 18 }}>
                  <Icon name={s.icon} fallback="Circle" size={21} style={{ color: "#0F766E" }} />
                </div>
                <div style={{ fontSize: 17, fontWeight: 700, color: DARK, marginBottom: 10 }}>{s.title}</div>
                <div style={{ fontSize: 14, color: "#475569", lineHeight: 1.7, fontWeight: 300 }}>{s.text}</div>
              </div>
            ))}
          </div>
          <p style={{ fontSize: 17, color: DARK, lineHeight: 1.7, margin: 0, maxWidth: 760, fontWeight: 500 }}>
            Вам не обязательно становиться маркетологом. Важно понять свою ситуацию, определить приоритеты и выбрать действия, которые реально вписать в рабочую жизнь.
          </p>
        </div>
      </section>

      <section style={{ background: "#fff", padding: "100px 32px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ maxWidth: 760, marginBottom: 40 }}>
            <div style={eyebrow}>Решение</div>
            <h2 style={{ ...h2Style, marginBottom: 20 }}>Не универсальные советы. Шаги для вашей практики</h2>
            <p style={{ fontSize: 16, color: GRAY, lineHeight: 1.7, margin: "0 0 14px", fontWeight: 300 }}>
              «Промт Диалог» помогает разобраться, что может мешать развитию вашей практики и на какие направления стоит обратить внимание.
            </p>
            <p style={{ fontSize: 16, color: GRAY, lineHeight: 1.7, margin: 0, fontWeight: 300 }}>
              Вы проходите бесплатную диагностику, а встроенные алгоритмы анализируют предоставленные вами данные и формируют рекомендации с учётом особенностей вашей работы.
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
            На основе введенных данных вы получаете рекомендации, которые помогают определить возможные точки роста и следующие действия.
          </p>
          <div style={{ background: DARK, borderRadius: 14, padding: "24px 28px", maxWidth: 820, marginBottom: 36, display: "flex", gap: 14, alignItems: "flex-start" }}>
            <Icon name="Sparkles" size={20} style={{ color: TEAL, flexShrink: 0, marginTop: 2 }} />
            <p style={{ fontSize: 15, color: "rgba(255,255,255,0.85)", lineHeight: 1.7, margin: 0, fontWeight: 300 }}>
              Не нужно хвататься за все способы продвижения сразу. Начните с понимания своей ситуации и определите, что имеет смысл попробовать именно вам.
            </p>
          </div>
          <CtaButton>Получить свои шаги бесплатно</CtaButton>
        </div>
      </section>

      <section style={{ background: "#F8FAFC", padding: "100px 32px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={eyebrow}>Чем это поможет</div>
          <h2 style={{ ...h2Style, marginBottom: 48, maxWidth: 760 }}>Чтобы развивать практику, а не бесконечно искать советы</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(300px,100%),1fr))", gap: 20 }}>
            {RESULTS.map((r, i) => (
              <div key={i} style={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: 16, padding: "28px 24px" }}>
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

      <section style={{ background: "#fff", padding: "100px 32px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ maxWidth: 760, marginBottom: 48 }}>
            <div style={eyebrow}>Для кого</div>
            <h2 style={{ ...h2Style, marginBottom: 20 }}>Для тех, кто работает с людьми и развивает свое дело</h2>
            <p style={{ fontSize: 16, color: GRAY, lineHeight: 1.7, margin: 0, fontWeight: 300 }}>
              «Промт Диалог» подходит частным специалистам, которым важно развивать собственную практику и привлекать клиентов.
            </p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(300px,100%),1fr))", gap: 20, marginBottom: 32 }}>
            {AUDIENCE.map((a, i) => (
              <div key={i} style={{ background: "#F8FAFC", border: "1px solid #E2E8F0", borderRadius: 16, padding: "30px 26px" }}>
                <div style={{ ...iconBox, marginBottom: 18 }}>
                  <Icon name={a.icon} fallback="Circle" size={21} style={{ color: "#0F766E" }} />
                </div>
                <h3 style={{ fontFamily: SERIF, fontSize: 24, fontWeight: 600, color: DARK, lineHeight: 1.2, margin: "0 0 12px" }}>{a.title}</h3>
                <p style={{ fontSize: 14, color: "#475569", lineHeight: 1.7, margin: 0, fontWeight: 300 }}>{a.text}</p>
              </div>
            ))}
          </div>
          <p style={{ fontSize: 16, color: DARK, lineHeight: 1.7, margin: 0, maxWidth: 760, fontWeight: 500 }}>
            У каждого направления своя специфика. Поэтому рекомендации формируются на основе данных о вашей конкретной ситуации, а не только названия профессии.
          </p>
        </div>
      </section>

      <section style={{ background: `radial-gradient(120% 100% at 20% 0%, #112B3C 0%, ${DARK} 55%, #060B16 100%)`, padding: "100px 32px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={eyebrow}>Как начать</div>
          <h2 style={{ ...h2Style, color: "#fff", marginBottom: 48, maxWidth: 760 }}>Три шага к более системному развитию практики</h2>
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
          <h2 style={{ ...h2Style, marginBottom: 20 }}>Идеи для развития вашей практики</h2>
          <p style={{ fontSize: 16, color: "#475569", lineHeight: 1.75, margin: "0 0 14px", fontWeight: 300 }}>
            Как привлекать клиентов, работать с повторными записями, рассказывать о своих услугах и находить время на продвижение, когда основная работа — это клиенты.
          </p>
          <p style={{ fontSize: 16, color: "#475569", lineHeight: 1.75, margin: "0 0 32px", fontWeight: 300 }}>
            Читайте практические материалы для частных мастеров и массажистов, знакомьтесь с разными подходами и выбирайте идеи, которые подходят вашей ситуации.
          </p>
          <Link
            to="/blog?role=master,massage"
            style={{ display: "inline-flex", alignItems: "center", gap: 10, padding: "15px 36px", borderRadius: 2, fontSize: 15, fontWeight: 600, background: DARK, color: "#fff", textDecoration: "none" }}
          >
            Полезные материалы для мастеров
            <Icon name="ArrowRight" size={16} />
          </Link>
        </div>
      </section>

      <section style={{ padding: "110px 32px", background: `linear-gradient(135deg, ${DARK} 0%, #0F2A30 100%)`, position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: "-30%", left: "50%", transform: "translateX(-50%)", width: 700, height: 700, borderRadius: "50%", background: "radial-gradient(circle, rgba(45,212,191,0.10) 0%, transparent 65%)", pointerEvents: "none" }} />
        <div style={{ maxWidth: 800, margin: "0 auto", textAlign: "center", position: "relative" }}>
          <h2 style={{ fontFamily: SERIF, fontSize: "clamp(30px,4.2vw,50px)", fontWeight: 500, color: "#fff", margin: "0 0 24px", lineHeight: 1.12 }}>
            Вы уже умеете делать свою работу. Давайте разберемся, как развивать её дальше
          </h2>
          <p style={{ fontSize: 16, color: "rgba(255,255,255,0.65)", lineHeight: 1.75, margin: "0 0 16px", fontWeight: 300 }}>
            Вам не нужно быть специалистом во всём. Можно хорошо оказывать услуги и при этом не знать, как выстроить продвижение, где искать новых клиентов и что поможет сделать запись стабильнее.
          </p>
          <p style={{ fontSize: 16, color: "rgba(255,255,255,0.65)", lineHeight: 1.75, margin: "0 0 16px", fontWeight: 300 }}>
            «Промт Диалог» поможет проанализировать вашу ситуацию, увидеть возможные точки роста и определить следующие шаги с учётом ваших услуг, аудитории, региона, времени и ресурсов.
          </p>
          <p style={{ fontSize: 16, color: "rgba(255,255,255,0.85)", lineHeight: 1.75, margin: "0 0 36px", fontWeight: 400 }}>
            Начните с бесплатной диагностики. Посмотрите на свою практику со стороны и решите, что стоит попробовать в первую очередь.
          </p>
          <CtaButton>Пройти диагностику и получить шаги бесплатно</CtaButton>
        </div>
      </section>

      <BizFooter />
      <style>{`
        @media (max-width: 860px) {
          .master-hero-grid { grid-template-columns: 1fr !important; gap: 36px !important; }
          .master-hero-img { max-width: 480px; width: 100%; margin: 0 auto; }
        }
        @media (max-width: 560px) {
          section { padding-left: 20px !important; padding-right: 20px !important; }
          .master-hero-grid { padding-left: 0 !important; padding-right: 0 !important; padding-top: 48px !important; padding-bottom: 56px !important; }
        }
      `}</style>
    </div>
  );
}