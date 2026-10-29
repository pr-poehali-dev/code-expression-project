import { Link } from "@/lib/router-compat";
import { Helmet } from "@/lib/helmet";
import BizNavbar from "@/components/BizNavbar";
import BizFooter from "@/components/BizFooter";
import Icon from "@/components/ui/icon";

const TEAL = "#2DD4BF";
const DARK = "#0F172A";
const GRAY = "#64748B";
const SERIF = "'Cormorant Garamond', serif";
const DIAG_URL = "/diagnostika";

const SITUATIONS = [
  { icon: "CalendarX", title: "Свободные окна", text: "У одних мастеров запись плотная, у других есть пустые часы. Как распределить загрузку и привлечь клиентов на нужные услуги?" },
  { icon: "UserPlus", title: "Новые клиенты", text: "Сарафанное радио работает, но хочется стабильного потока. Где искать аудиторию и чем заинтересовать ее?" },
  { icon: "Repeat", title: "Повторные визиты", text: "Клиенты приходят один раз и не возвращаются. Как работать с постоянными без навязчивых продаж?" },
  { icon: "Megaphone", title: "Продвижение мастеров", text: "Не все мастера умеют продвигать себя и вести запись." },
  { icon: "ListTodo", title: "Слишком много задач", text: "Реклама, акции, соцсети, администраторы, обучение сотрудников. Трудно понять, что важно сейчас." },
  { icon: "Target", title: "Непонятно, что подойдет салону", text: "Общие советы рассчитаны на всех. Какие действия подойдут именно вашим услугам и аудитории?" },
];

const ANALYZED = [
  "услуги салона и направления работы;",
  "аудиторию;",
  "регион и особенности рынка;",
  "текущие задачи и цели;",
  "время и ресурсы;",
  "как вы сейчас привлекаете клиентов.",
];

const TEAM_BLOCKS = [
  {
    icon: "Crown",
    tag: "Для владельца салона",
    title: "Владелец видит приоритеты",
    texts: [
      "Проходите диагностику, получайте шаги и определяйте приоритеты салона. Подключайте сотрудников, чтобы они сами продвигали свои услуги.",
      "Придумывать маркетинг для каждого мастера не нужно.",
    ],
  },
  {
    icon: "Scissors",
    tag: "Для мастеров вашей команды",
    title: "Мастер продвигает себя сам",
    texts: [
      "Добавьте сотрудников, и каждый будет развивать свои услуги и привлекать клиентов в рамках салона.",
      "Мастер не ждет указаний владельца и получает шаги под свою ситуацию.",
    ],
  },
  {
    icon: "Wallet",
    tag: "Общее управление",
    title: "Один счет для работы салона",
    texts: [
      "Оплачивайте платформу одним счетом и смотрите по отчетам, как сотрудники ею пользуются.",
      "Владелец видит активность команды по доступным данным.",
    ],
  },
];

const ADVANTAGES = [
  "Один счет на салон и сотрудников.",
  "Мастера сами продвигают свои услуги.",
  "Отчеты об использовании платформы.",
];

const RESULTS = [
  { icon: "TrendingUp", title: "Точки роста", text: "На что смотреть первым: привлечение клиентов, загрузка мастеров, повторные визиты или отдельные услуги." },
  { icon: "Footprints", title: "Следующие шаги", text: "Рекомендации вместо бесконечного поиска идей." },
  { icon: "UserCheck", title: "Самостоятельные мастера", text: "Подключите мастеров, чтобы они сами продвигали свои услуги." },
  { icon: "BarChart3", title: "Отчеты по команде", text: "Один счет и отчеты показывают, как команда пользуется платформой." },
  { icon: "Layers", title: "Постепенный старт", text: "Пройдите бесплатную диагностику и решите, какие рекомендации применить." },
  { icon: "Target", title: "Шаги под ваш салон", text: "Рекомендации строятся на ваших услугах, аудитории, регионе и ресурсах, а не на общем списке советов." },
];

const STEPS = [
  { title: "Расскажите о салоне", text: "Укажите услуги, аудиторию, регион и цели." },
  { title: "Получите шаги", text: "Пройдите диагностику и посмотрите рекомендации." },
  { title: "Подключите команду", text: "Добавьте сотрудников для самостоятельного продвижения." },
  { title: "Следите за отчетами", text: "Смотрите, как команда использует платформу." },
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

export default function DlyaSalonov() {
  return (
    <div style={{ fontFamily: "Inter, sans-serif", background: "#fff" }}>
      <Helmet>
        <title>Как увеличить загрузку салона красоты и привлечь клиентов | Промт Диалог</title>
        <meta name="description" content="Бесплатная диагностика для владельцев салонов красоты: AI-навигатор «ПоДелам» определит точки роста, поможет заполнить свободные окна и вернуть постоянных клиентов." />
        <meta name="keywords" content="как увеличить загрузку салона красоты, как привлечь клиентов в салон красоты, продвижение салона красоты, маркетинг для салона красоты, заполнить свободные окна у мастеров, повторные визиты клиентов, развитие салона красоты, ИИ для салона красоты, бесплатная диагностика салона, маркетинг для владельца салона" />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://promtdialog.ru/dlya-salonov" />
        <meta property="og:title" content="Как увеличить загрузку салона красоты и привлечь клиентов — Промт Диалог" />
        <meta property="og:description" content="Бесплатная диагностика и персональные шаги для владельцев салонов красоты: загрузка мастеров, новые клиенты, повторные визиты, работа команды." />
        <meta property="og:url" content="https://promtdialog.ru/dlya-salonov" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Как увеличить загрузку салона красоты — Промт Диалог" />
        <meta name="twitter:description" content="Бесплатная диагностика салона и персональные шаги для привлечения клиентов и развития команды." />
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebPage",
          "name": "Как увеличить загрузку салона красоты и привлечь клиентов",
          "url": "https://promtdialog.ru/dlya-salonov",
          "description": "Бесплатная диагностика для владельцев салонов красоты: точки роста, загрузка мастеров, привлечение клиентов, повторные визиты и работа команды.",
          "isPartOf": { "@type": "WebSite", "name": "Промт Диалог", "url": "https://promtdialog.ru" }
        })}</script>
      </Helmet>
      <BizNavbar />

      <section style={{ background: `radial-gradient(120% 100% at 70% 0%, #1a2e3c 0%, ${DARK} 55%, #060B16 100%)`, minHeight: "80vh", display: "flex", alignItems: "center", paddingTop: 76, position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: 0, right: "-5%", width: 600, height: 600, borderRadius: "50%", background: "radial-gradient(circle, rgba(45,212,191,0.10) 0%, transparent 65%)", pointerEvents: "none" }} />
        <div className="salon-hero-grid" style={{ maxWidth: 1200, margin: "0 auto", padding: "80px 32px", width: "100%", position: "relative", display: "grid", gridTemplateColumns: "1.15fr 0.85fr", gap: 56, alignItems: "center" }}>
          <div>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 10, border: "1px solid rgba(45,212,191,0.3)", borderRadius: 100, padding: "7px 18px", marginBottom: 32 }}>
            <div style={{ width: 6, height: 6, borderRadius: "50%", background: TEAL }} />
            <span style={{ fontSize: 12, color: TEAL, fontWeight: 500, letterSpacing: "1.5px", textTransform: "uppercase", lineHeight: 1 }}>Промт Диалог — AI-навигатор «ПоДелам»</span>
          </div>
          <h1 style={{ fontFamily: SERIF, fontSize: "clamp(36px,5vw,64px)", fontWeight: 500, color: "#fff", lineHeight: 1.15, margin: "0 0 28px", letterSpacing: "-0.5px", paddingBottom: 4 }}>
            Как привлечь больше клиентов и увеличить загрузку салона?
          </h1>
          <p style={{ fontSize: "clamp(15px,1.6vw,17px)", color: "rgba(255,255,255,0.65)", lineHeight: 1.7, margin: "0 0 16px", fontWeight: 300, maxWidth: 720 }}>
            Нужно привлекать клиентов, возвращать постоянных, заполнять окна и развивать мастеров, а времени на все не хватает.
          </p>
          <p style={{ fontSize: "clamp(15px,1.6vw,17px)", color: "rgba(255,255,255,0.65)", lineHeight: 1.7, margin: "0 0 36px", fontWeight: 300, maxWidth: 720 }}>
            «Промт Диалог» разберет вашу ситуацию и предложит шаги. Подключайте сотрудников: каждый развивает свою клиентскую базу в рамках салона.
          </p>
          <CtaButton>Пройти диагностику бесплатно</CtaButton>
          <div style={{ fontSize: 12, color: "rgba(255,255,255,0.45)", marginTop: 12 }}>Диагностика и шаги бесплатны.</div>
          </div>
          <div className="salon-hero-img" style={{ position: "relative" }}>
            <div style={{ position: "absolute", inset: -1, borderRadius: 6, background: "linear-gradient(135deg, rgba(45,212,191,0.4), transparent 50%, rgba(45,212,191,0.15))", pointerEvents: "none", zIndex: 2 }} />
            <img
              src="https://cdn.poehali.dev/projects/10f61e56-9821-40f3-b705-3590ddaffd08/files/97c32278-ee03-4e7d-a76e-e5d5f4a06a81.jpg"
              alt="Владелица салона красоты и мастер в салоне"
              fetchPriority="high"
              decoding="async"
              style={{ width: "100%", height: "auto", borderRadius: 4, display: "block", boxShadow: "0 32px 80px rgba(0,0,0,0.5)", position: "relative", zIndex: 1 }}
            />
          </div>
        </div>
      </section>

      <section style={{ background: "#F8FAFC", padding: "100px 32px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ maxWidth: 720, marginBottom: 48 }}>
            <div style={eyebrow}>Знакомая ситуация</div>
            <h2 style={h2Style}>Салон работает, а точки роста не видны</h2>
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
            Не нужно решать все сразу: определите приоритеты и выберите следующие действия.
          </p>
        </div>
      </section>

      <section style={{ background: "#fff", padding: "100px 32px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ maxWidth: 760, marginBottom: 40 }}>
            <div style={eyebrow}>Решение</div>
            <h2 style={{ ...h2Style, marginBottom: 20 }}>Шаги для вашего салона</h2>
            <p style={{ fontSize: 16, color: GRAY, lineHeight: 1.7, margin: 0, fontWeight: 300 }}>
              Вы проходите бесплатную диагностику и получаете рекомендации под ваш бизнес.
            </p>
          </div>
          <div style={{ fontSize: 15, fontWeight: 700, color: DARK, marginBottom: 16 }}>Алгоритмы учитывают:</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(300px,100%),1fr))", gap: 12, marginBottom: 32 }}>
            {ANALYZED.map((a, i) => (
              <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start", background: "#F8FAFC", border: "1px solid #E2E8F0", borderRadius: 12, padding: "14px 18px" }}>
                <Icon name="CheckCircle2" size={17} style={{ color: TEAL, flexShrink: 0, marginTop: 2 }} />
                <span style={{ fontSize: 14, color: "#334155", lineHeight: 1.5 }}>{a}</span>
              </div>
            ))}
          </div>
          <p style={{ fontSize: 15, color: "#334155", lineHeight: 1.7, margin: "0 0 24px", maxWidth: 820 }}>
            По этим данным платформа находит точки роста и расставляет приоритеты.
          </p>
          <div style={{ background: DARK, borderRadius: 14, padding: "24px 28px", maxWidth: 820, marginBottom: 36, display: "flex", gap: 14, alignItems: "flex-start" }}>
            <Icon name="Sparkles" size={20} style={{ color: TEAL, flexShrink: 0, marginTop: 2 }} />
            <p style={{ fontSize: 15, color: "rgba(255,255,255,0.85)", lineHeight: 1.7, margin: 0, fontWeight: 300 }}>
              Становиться маркетологом не нужно: начните с диагностики.
            </p>
          </div>
          <CtaButton>Получить шаги бесплатно</CtaButton>
        </div>
      </section>

      <section style={{ background: "#F8FAFC", padding: "100px 32px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ maxWidth: 760, marginBottom: 48 }}>
            <div style={eyebrow}>Владелец и команда</div>
            <h2 style={{ ...h2Style, marginBottom: 20 }}>Салон и команда в одной системе</h2>
            <p style={{ fontSize: 16, color: GRAY, lineHeight: 1.7, margin: 0, fontWeight: 300 }}>
              Развивайте салон как единый бизнес, а мастера сами привлекают клиентов.
            </p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(310px,100%),1fr))", gap: 24, marginBottom: 40 }}>
            {TEAM_BLOCKS.map((b, i) => (
              <div key={i} style={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: 16, padding: "30px 26px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 18 }}>
                  <div style={iconBox}><Icon name={b.icon} fallback="Circle" size={21} style={{ color: "#0F766E" }} /></div>
                  <span style={{ fontSize: 12, fontWeight: 600, color: "#0F766E", textTransform: "uppercase", letterSpacing: "1.5px" }}>{b.tag}</span>
                </div>
                <h3 style={{ fontFamily: SERIF, fontSize: 24, fontWeight: 600, color: DARK, lineHeight: 1.2, margin: "0 0 14px" }}>{b.title}</h3>
                {b.texts.map((t, j) => (
                  <p key={j} style={{ fontSize: 14, color: "#475569", lineHeight: 1.7, margin: "0 0 12px", fontWeight: 300 }}>{t}</p>
                ))}
              </div>
            ))}
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(260px,100%),1fr))", gap: 16 }}>
            {ADVANTAGES.map((a, i) => (
              <div key={i} style={{ display: "flex", gap: 12, alignItems: "flex-start", background: DARK, borderRadius: 12, padding: "18px 20px" }}>
                <Icon name="Check" size={18} style={{ color: TEAL, flexShrink: 0, marginTop: 2 }} />
                <span style={{ fontSize: 14, color: "rgba(255,255,255,0.85)", lineHeight: 1.55 }}>{a}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section style={{ background: "#fff", padding: "100px 32px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={eyebrow}>Что вы получите</div>
          <h2 style={{ ...h2Style, marginBottom: 48 }}>Что вы получите от диагностики</h2>
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
          <h2 style={{ ...h2Style, color: "#fff", marginBottom: 48 }}>Начните с диагностики</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(240px,100%),1fr))", gap: 20, marginBottom: 44 }}>
            {STEPS.map((s, i) => (
              <div key={i} style={{ border: "1px solid rgba(45,212,191,0.25)", borderRadius: 16, padding: "28px 24px", background: "rgba(255,255,255,0.03)" }}>
                <div style={{ fontFamily: SERIF, fontSize: 44, fontWeight: 600, color: TEAL, lineHeight: 1, marginBottom: 12 }}>{i + 1}</div>
                <div style={{ fontSize: 12, color: "rgba(255,255,255,0.45)", textTransform: "uppercase", letterSpacing: "1.5px", marginBottom: 8 }}>Шаг {i + 1}</div>
                <div style={{ fontSize: 17, fontWeight: 600, color: "#fff", marginBottom: 10 }}>{s.title}</div>
                <div style={{ fontSize: 14, color: "rgba(255,255,255,0.65)", lineHeight: 1.65, fontWeight: 300 }}>{s.text}</div>
              </div>
            ))}
          </div>
          <CtaButton>Пройти диагностику бесплатно</CtaButton>
          <div style={{ fontSize: 12, color: "rgba(255,255,255,0.45)", marginTop: 12 }}>Диагностика и шаги бесплатны.</div>
        </div>
      </section>

      <section style={{ background: "#F8FAFC", padding: "100px 32px" }}>
        <div style={{ maxWidth: 820, margin: "0 auto", textAlign: "center" }}>
          <div style={{ ...iconBox, margin: "0 auto 20px" }}>
            <Icon name="BookOpen" size={21} style={{ color: "#0F766E" }} />
          </div>
          <h2 style={{ ...h2Style, marginBottom: 20 }}>Материалы для владельцев салонов</h2>
          <p style={{ fontSize: 16, color: "#475569", lineHeight: 1.75, margin: "0 0 14px", fontWeight: 300 }}>
            Привлечение клиентов, загрузка мастеров, повторные визиты и развитие команды.
          </p>
          <p style={{ fontSize: 16, color: "#475569", lineHeight: 1.75, margin: "0 0 32px", fontWeight: 300 }}>
            Читайте и берите идеи для своего салона.
          </p>
          <Link
            to="/blog?role=owner"
            style={{ display: "inline-flex", alignItems: "center", gap: 10, padding: "15px 36px", borderRadius: 2, fontSize: 15, fontWeight: 600, background: DARK, color: "#fff", textDecoration: "none" }}
          >
            Читать материалы
            <Icon name="ArrowRight" size={16} />
          </Link>
        </div>
      </section>

      <section style={{ padding: "110px 32px", background: `linear-gradient(135deg, ${DARK} 0%, #0F2A30 100%)`, position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: "-30%", left: "50%", transform: "translateX(-50%)", width: 700, height: 700, borderRadius: "50%", background: "radial-gradient(circle, rgba(45,212,191,0.10) 0%, transparent 65%)", pointerEvents: "none" }} />
        <div style={{ maxWidth: 800, margin: "0 auto", textAlign: "center", position: "relative" }}>
          <h2 style={{ fontFamily: SERIF, fontSize: "clamp(30px,4.2vw,50px)", fontWeight: 500, color: "#fff", margin: "0 0 24px", lineHeight: 1.12 }}>
            Подключайте команду и действуйте по шагам
          </h2>
          <p style={{ fontSize: 16, color: "rgba(255,255,255,0.65)", lineHeight: 1.75, margin: "0 0 16px", fontWeight: 300 }}>
            Салону нужны новые клиенты, возврат постоянных и развитие мастеров.
          </p>
          <p style={{ fontSize: 16, color: "rgba(255,255,255,0.65)", lineHeight: 1.75, margin: "0 0 16px", fontWeight: 300 }}>
            Начните с бесплатной диагностики и получите первые шаги.
          </p>
          
          <CtaButton>Пройти диагностику бесплатно</CtaButton>
        </div>
      </section>

      <BizFooter />
      <style>{`
        @media (max-width: 860px) {
          .salon-hero-grid { grid-template-columns: 1fr !important; gap: 36px !important; }
          .salon-hero-img { max-width: 480px; width: 100%; margin: 0 auto; }
        }
        @media (max-width: 560px) {
          section { padding-left: 20px !important; padding-right: 20px !important; }
          .salon-hero-grid { padding-left: 0 !important; padding-right: 0 !important; padding-top: 48px !important; padding-bottom: 56px !important; }
        }
      `}</style>
    </div>
  );
}