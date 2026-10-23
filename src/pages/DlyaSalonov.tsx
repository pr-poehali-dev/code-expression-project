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

const SITUATIONS = [
  { icon: "CalendarX", title: "Свободные окна", text: "У одних мастеров запись плотная, у других остаются свободные часы. Как равномернее распределить загрузку и привлечь клиентов на востребованные услуги?" },
  { icon: "UserPlus", title: "Новые клиенты", text: "Сарафанное радио работает, но хочется стабильнее привлекать новых посетителей. Где искать свою аудиторию и как заинтересовать её услугами салона?" },
  { icon: "Repeat", title: "Повторные визиты", text: "Клиенты приходят один раз и не всегда возвращаются. Как выстраивать работу с постоянными посетителями и поддерживать интерес к услугам без навязчивых продаж?" },
  { icon: "Megaphone", title: "Продвижение команды", text: "Каждый мастер обладает своими навыками, услугами и сильными сторонами. Но не все умеют самостоятельно продвигать себя, вести коммуникацию с аудиторией и формировать запись." },
  { icon: "ListTodo", title: "Слишком много задач", text: "Реклама, акции, социальные сети, работа администраторов, развитие сотрудников. Сложно заниматься всем одновременно и понимать, что сейчас действительно важно." },
  { icon: "Target", title: "Непонятно, что подходит именно вам", text: "Советов по продвижению много, но они рассчитаны на всех сразу. Как выбрать те действия, которые подойдут услугам, аудитории и возможностям именно вашего салона?" },
];

const ANALYZED = [
  "услуги салона и направления работы;",
  "целевую аудиторию;",
  "регион и особенности рынка;",
  "текущие задачи и цели;",
  "доступное время и ресурсы;",
  "информацию о продвижении и привлечении клиентов.",
];

const TEAM_BLOCKS = [
  {
    icon: "Crown",
    tag: "Для владельца салона",
    title: "Вы управляете развитием бизнеса",
    texts: [
      "Проходите диагностику, получайте собственные шаги и определяйте приоритетные направления развития салона. Подключайте сотрудников, чтобы они могли работать над продвижением своих услуг самостоятельно.",
      "Вам не нужно лично придумывать маркетинговые действия для каждого мастера. Сотрудники получают возможность разбираться в своих задачах и последовательно работать над развитием клиентской базы.",
    ],
  },
  {
    icon: "Scissors",
    tag: "Для мастеров вашей команды",
    title: "Каждый мастер может продвигать себя самостоятельно",
    texts: [
      "Вы можете добавить сотрудников в систему, чтобы каждый из них работал над развитием своих услуг, привлечением клиентов и продвижением в рамках салона.",
      "Мастеру не нужно каждый раз ждать, пока владелец или администратор придумает за него, что делать. Он сможет самостоятельно проходить предусмотренные для него этапы работы и получать персональные шаги в соответствии со своей ситуацией.",
    ],
  },
  {
    icon: "Wallet",
    tag: "Общее управление",
    title: "Один счёт для работы салона",
    texts: [
      "Используйте единый счёт для работы с «Промт Диалог» и отслеживайте применение платформы сотрудниками через предусмотренные системой отчёты.",
      "Владелец получает возможность видеть, как используется инструмент в рамках салона, и оценивать активность команды на основе доступных данных.",
    ],
  },
];

const ADVANTAGES = [
  "Единый счёт для работы салона и сотрудников.",
  "Самостоятельная работа мастеров над продвижением своих услуг.",
  "Отчёты по применению «Промт Диалог» для контроля использования платформы.",
];

const RESULTS = [
  { icon: "TrendingUp", title: "Понимание точек роста", text: "Определите направления, которые стоит изучить в первую очередь: привлечение клиентов, загрузка мастеров, повторные визиты или развитие отдельных услуг." },
  { icon: "Footprints", title: "Конкретные следующие шаги", text: "Вместо бесконечного поиска идей получите рекомендации, которые помогут организовать дальнейшую работу." },
  { icon: "UserCheck", title: "Самостоятельность сотрудников", text: "Подключайте мастеров, чтобы они могли последовательно работать над продвижением своих услуг в рамках салона." },
  { icon: "BarChart3", title: "Общую картину использования платформы", text: "Используйте единый счет и доступные отчеты, чтобы видеть применение «Промт Диалог» в работе команды." },
  { icon: "Layers", title: "Возможность действовать постепенно", text: "Начните с бесплатной диагностики, оцените рекомендации и решите, какие действия подходят вашему салону." },
];

const STEPS = [
  { title: "Расскажите о салоне", text: "Укажите основные направления работы, услуги, аудиторию, регион, цели и текущие задачи." },
  { title: "Получите персональные шаги", text: "Пройдите диагностику и ознакомьтесь с рекомендациями, сформированными на основе предоставленных данных и встроенных алгоритмов анализа." },
  { title: "Подключите команду", text: "Добавьте сотрудников, чтобы они могли работать над продвижением своих услуг в рамках салона." },
  { title: "Отслеживайте использование", text: "Используйте единый счет и отчёты по применению платформы." },
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
        <title>Как привлечь больше клиентов и увеличить загрузку салона — Промт Диалог</title>
        <meta name="description" content="Промт Диалог — AI-навигатор «ПоДелам» для владельцев салонов красоты: бесплатная диагностика, персональные шаги для привлечения клиентов, загрузки мастеров и повторных визитов. Подключение команды." />
        <link rel="canonical" href="https://promtdialog.ru/dlya-salonov" />
        <meta property="og:title" content="Как привлечь больше клиентов и увеличить загрузку салона" />
        <meta property="og:description" content="Бесплатная диагностика и персональные шаги для развития салона красоты и работы команды." />
        <meta property="og:url" content="https://promtdialog.ru/dlya-salonov" />
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
            Вы отвечаете за салон, команду, клиентов и выручку. Нужно привлекать новых посетителей, возвращать постоянных, заполнять свободные окна и помогать мастерам развиваться. Но времени на все задачи не хватает, а непонятно, какие действия дадут наибольшую пользу именно вашему салону.
          </p>
          <p style={{ fontSize: "clamp(15px,1.6vw,17px)", color: "rgba(255,255,255,0.65)", lineHeight: 1.7, margin: "0 0 36px", fontWeight: 300, maxWidth: 720 }}>
            «Промт Диалог» анализирует вашу ситуацию и помогает определить конкретные шаги для развития бизнеса. Вы можете использовать платформу сами и подключать сотрудников, чтобы каждый развивал свою клиентскую базу в рамках салона.
          </p>
          <CtaButton>Пройти диагностику бесплатно</CtaButton>
          <div style={{ fontSize: 12, color: "rgba(255,255,255,0.45)", marginTop: 12 }}>Диагностика и персональные шаги — бесплатно.</div>
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
            <h2 style={h2Style}>Знакомо? Салон работает, а точки роста остаются незаметными</h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(300px,1fr))", gap: 20, marginBottom: 40 }}>
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
            Необязательно решать всё сразу. Сначала нужно разобраться в ситуации, определить приоритеты и выбрать следующие действия.
          </p>
        </div>
      </section>

      <section style={{ background: "#fff", padding: "100px 32px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ maxWidth: 760, marginBottom: 40 }}>
            <div style={eyebrow}>Решение</div>
            <h2 style={{ ...h2Style, marginBottom: 20 }}>Не просто советы по маркетингу. Шаги для вашего салона</h2>
            <p style={{ fontSize: 16, color: GRAY, lineHeight: 1.7, margin: 0, fontWeight: 300 }}>
              «Промт Диалог» помогает посмотреть на развитие салона системно. Вы проходите бесплатную диагностику и получаете рекомендации, сформированные с учетом специфики вашего бизнеса.
            </p>
          </div>
          <div style={{ fontSize: 15, fontWeight: 700, color: DARK, marginBottom: 16 }}>Встроенные алгоритмы анализируют предоставленные вами данные, включая:</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(300px,1fr))", gap: 12, marginBottom: 32 }}>
            {ANALYZED.map((a, i) => (
              <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start", background: "#F8FAFC", border: "1px solid #E2E8F0", borderRadius: 12, padding: "14px 18px" }}>
                <Icon name="CheckCircle2" size={17} style={{ color: TEAL, flexShrink: 0, marginTop: 2 }} />
                <span style={{ fontSize: 14, color: "#334155", lineHeight: 1.5 }}>{a}</span>
              </div>
            ))}
          </div>
          <p style={{ fontSize: 15, color: "#334155", lineHeight: 1.7, margin: "0 0 24px", maxWidth: 820 }}>
            На основе этих данных платформа помогает определить возможные точки роста, расставить приоритеты и сформировать последовательность действий.
          </p>
          <div style={{ background: DARK, borderRadius: 14, padding: "24px 28px", maxWidth: 820, marginBottom: 36, display: "flex", gap: 14, alignItems: "flex-start" }}>
            <Icon name="Sparkles" size={20} style={{ color: TEAL, flexShrink: 0, marginTop: 2 }} />
            <p style={{ fontSize: 15, color: "rgba(255,255,255,0.85)", lineHeight: 1.7, margin: 0, fontWeight: 300 }}>
              Вам не нужно становиться маркетологом и разбираться во всём самостоятельно. Начните с диагностики и определите, на что стоит обратить внимание именно сейчас.
            </p>
          </div>
          <CtaButton>Получить шаги бесплатно</CtaButton>
        </div>
      </section>

      <section style={{ background: "#F8FAFC", padding: "100px 32px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ maxWidth: 760, marginBottom: 48 }}>
            <div style={eyebrow}>Владелец и команда</div>
            <h2 style={{ ...h2Style, marginBottom: 20 }}>Один салон — общая система развития и самостоятельность каждого мастера</h2>
            <p style={{ fontSize: 16, color: GRAY, lineHeight: 1.7, margin: 0, fontWeight: 300 }}>
              Развивайте салон как единый бизнес и помогайте сотрудникам привлекать клиентов без необходимости контролировать каждый их шаг.
            </p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(310px,1fr))", gap: 24, marginBottom: 40 }}>
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
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))", gap: 16 }}>
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
          <h2 style={{ ...h2Style, marginBottom: 48 }}>Больше ясности в развитии салона</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(300px,1fr))", gap: 20 }}>
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
          <h2 style={{ ...h2Style, color: "#fff", marginBottom: 48 }}>Начните с диагностики своего салона</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))", gap: 20, marginBottom: 44 }}>
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
          <div style={{ fontSize: 12, color: "rgba(255,255,255,0.45)", marginTop: 12 }}>Диагностика и получение шагов бесплатны.</div>
        </div>
      </section>

      <section style={{ background: "#F8FAFC", padding: "100px 32px" }}>
        <div style={{ maxWidth: 820, margin: "0 auto", textAlign: "center" }}>
          <div style={{ ...iconBox, margin: "0 auto 20px" }}>
            <Icon name="BookOpen" size={21} style={{ color: "#0F766E" }} />
          </div>
          <h2 style={{ ...h2Style, marginBottom: 20 }}>Больше идей для развития салона</h2>
          <p style={{ fontSize: 16, color: "#475569", lineHeight: 1.75, margin: "0 0 14px", fontWeight: 300 }}>
            Практические материалы для владельцев салонов красоты: привлечение клиентов, загрузка мастеров, повторные визиты, продвижение услуг и развитие команды.
          </p>
          <p style={{ fontSize: 16, color: "#475569", lineHeight: 1.75, margin: "0 0 32px", fontWeight: 300 }}>
            Читайте, разбирайте знакомые ситуации и находите идеи, которые можно адаптировать к своему салону.
          </p>
          <Link
            to="/blog?role=owner"
            style={{ display: "inline-flex", alignItems: "center", gap: 10, padding: "15px 36px", borderRadius: 2, fontSize: 15, fontWeight: 600, background: DARK, color: "#fff", textDecoration: "none" }}
          >
            Полезные материалы для владельцев
            <Icon name="ArrowRight" size={16} />
          </Link>
        </div>
      </section>

      <section style={{ padding: "110px 32px", background: `linear-gradient(135deg, ${DARK} 0%, #0F2A30 100%)`, position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: "-30%", left: "50%", transform: "translateX(-50%)", width: 700, height: 700, borderRadius: "50%", background: "radial-gradient(circle, rgba(45,212,191,0.10) 0%, transparent 65%)", pointerEvents: "none" }} />
        <div style={{ maxWidth: 800, margin: "0 auto", textAlign: "center", position: "relative" }}>
          <h2 style={{ fontFamily: SERIF, fontSize: "clamp(30px,4.2vw,50px)", fontWeight: 500, color: "#fff", margin: "0 0 24px", lineHeight: 1.12 }}>
            Развивайте салон системно. Подключайте команду. Действуйте по шагам.
          </h2>
          <p style={{ fontSize: 16, color: "rgba(255,255,255,0.65)", lineHeight: 1.75, margin: "0 0 16px", fontWeight: 300 }}>
            Чтобы салон рос, недостаточно просто хорошо оказывать услуги. Важно привлекать новых клиентов, возвращать постоянных, развивать мастеров и понимать, какие задачи требуют внимания в первую очередь.
          </p>
          <p style={{ fontSize: 16, color: "rgba(255,255,255,0.65)", lineHeight: 1.75, margin: "0 0 16px", fontWeight: 300 }}>
            «Промт Диалог» поможет проанализировать вашу ситуацию, определить возможные точки роста и организовать работу над продвижением — для вас и вашей команды.
          </p>
          <p style={{ fontSize: 16, color: "rgba(255,255,255,0.85)", lineHeight: 1.75, margin: "0 0 36px", fontWeight: 400 }}>
            Начните с бесплатной диагностики. Получите первые шаги и решите, как использовать их в развитии салона.
          </p>
          <CtaButton>Пройти диагностику и получить шаги бесплатно</CtaButton>
        </div>
      </section>

      <BizFooter />
      <style>{`
        @media (max-width: 860px) {
          .salon-hero-grid { grid-template-columns: 1fr !important; gap: 36px !important; }
        }
      `}</style>
    </div>
  );
}