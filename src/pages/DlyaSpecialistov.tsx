import { Link } from "@/lib/router-compat";
import { Helmet } from "@/lib/helmet";
import BizNavbar from "@/components/BizNavbar";
import BizFooter from "@/components/BizFooter";
import Icon from "@/components/ui/icon";

const TEAL = "#2DD4BF";
const DARK = "#0F172A";
const GRAY = "#64748B";
const SERIF = "'Cormorant Garamond', serif";
const DIAG_URL = "/cabinet?type=other_specialist";
const BLOG_URL = "https://promtdialog.ru/blog";
const P = "https://cdn.poehali.dev/projects/10f61e56-9821-40f3-b705-3590ddaffd08/files/";

const HERO_IMG = P + "6697fb27-66de-4030-9557-621f5a61598c.jpg";

const AUDIENCE = [
  { img: P + "4a25a65d-d887-4ffe-95b5-fcc0cee79ecb.jpg", alt: "Репетитор занимается с учеником", title: "Репетиторам и частным преподавателям", text: "Учителям, преподавателям языков, музыкальным педагогам, наставникам. Привлекать учеников и заполнять расписание." },
  { img: P + "e67cab5d-7677-4223-90f0-025613467fe9.jpg", alt: "Персональный тренер на занятии", title: "Тренерам", text: "Персональным тренерам, инструкторам йоги, пилатеса, растяжки и танцев. Находить клиентов и развивать занятия." },
  { img: P + "2b5f19a6-1e1f-4e5f-bd99-755a03888082.jpg", alt: "Инструктор ведет группу в студии", title: "Инструкторам по движению", text: "Работающим индивидуально или в небольших студиях. Понятнее представить услуги и повысить загрузку." },
  { img: P + "fbe66996-74cc-4d01-9ba0-bc1ba0908084.jpg", alt: "Косметолог проводит процедуру", title: "Косметологам", text: "Развивать запись, привлекать новых клиентов и возвращать постоянных." },
  { img: P + "11bd39d9-9eb4-4ced-b4fb-c98fcbf79210.jpg", alt: "Фотограф на съемке", title: "Фотографам и видеографам", text: "Съемки для частных клиентов, семей, мероприятий и бизнеса. Выделиться среди конкурентов и найти аудиторию." },
  { img: P + "1bab8f05-a2b6-49c0-8135-234882ed332f.jpg", alt: "Ведущая на празднике", title: "Организаторам мероприятий", text: "Ведущим, организаторам праздников, свадебным координаторам, аниматорам. Привлекать заказчиков и держать загрузку в разные сезоны." },
  { img: P + "3754eff4-a65f-432f-a35f-ed4ebe6f307a.jpg", alt: "Консультант беседует с клиенткой", title: "Консультантам и наставникам", text: "Карьерным и бизнес-консультантам, наставникам. Понятно объяснять услуги и находить аудиторию." },
  { img: P + "43ec8604-4a43-4ef7-9456-aa176518282e.jpg", alt: "Мастер по бытовым услугам", title: "Бытовые услуги", text: "Организаторам пространства, клинингу, мастерам по ремонту и настройке техники, организаторам переездов." },
  { img: P + "b35c5d82-abe2-4f88-bb17-16dd4871b5a9.jpg", alt: "Няня играет с детьми", title: "Детские и семейные услуги", text: "Няням, организаторам детских занятий и другим специалистам для семей. Выстраивать доверие и находить клиентов." },
  { img: P + "47891d2a-7258-4308-b838-f1aa706ca546.jpg", alt: "Грумер ухаживает за собакой", title: "Уход за животными", text: "Грумерам, кинологам, специалистам по дрессировке и передержке. Развивать клиентскую базу." },
  { img: P + "d30b1ddf-af7e-453a-966b-710c830e7328.jpg", alt: "Стилист и визажист работает с невестой", title: "Стилистам и визажистам", text: "Стилистам, визажистам, имидж-консультантам. Помогать людям подготовиться к важным событиям." },
  { img: P + "08f9a622-781b-4b01-8fb8-9ee18ee0424d.jpg", alt: "Частный консультант с клиентом", title: "Другим частным консультантам", text: "Если вы работаете индивидуально и сами ищете клиентов, диагностика подскажет направления развития." },
];

const SITUATIONS = [
  { icon: "CalendarX", title: "Клиенты приходят неравномерно", text: "В одни недели расписание заполнено, в другие пусто. Хочется меньше зависеть от случайных обращений." },
  { icon: "Share2", title: "Рекомендаций мало", text: "Довольные клиенты рассказывают о вас знакомым, но хочется, чтобы новые люди находили вас сами." },
  { icon: "BadgeHelp", title: "Трудно объяснить, чем вы лучше", text: "Вы знаете свои сильные стороны, но сложно донести их до человека, который с вами не знаком." },
  { icon: "Hourglass", title: "Продвижение отнимает время", text: "Соцсети, реклама, публикации, сообщения. Все это параллельно с основной работой." },
  { icon: "Layers", title: "Слишком много советов", text: "Один эксперт советует блог, другой рекламу, третий скидки. Что подойдет вашей профессии?" },
  { icon: "Leaf", title: "Хочется без суеты", text: "Понимать, какие действия имеют смысл, и двигаться к целям последовательно." },
];

const ANALYZED = [
  { icon: "Briefcase", title: "Услуги", text: "что вы предлагаете и какие задачи решаете." },
  { icon: "Users", title: "Аудитория", text: "кто ваши потенциальные клиенты." },
  { icon: "MapPin", title: "Регион", text: "где вы работаете." },
  { icon: "Shapes", title: "Формат работы", text: "индивидуальные услуги, занятия, консультации, группы, выездная работа." },
  { icon: "Clock", title: "Время и ресурсы", text: "сколько времени можно выделить на развитие." },
  { icon: "Flag", title: "Цели и трудности", text: "что хотите изменить и что уже пробовали." },
];

const RESULTS = [
  { icon: "TrendingUp", title: "Точки роста", text: "Какие направления развития важнее всего." },
  { icon: "Lightbulb", title: "Идеи для привлечения клиентов", text: "Способы продвижения под ваши услуги, аудиторию, регион и ресурсы." },
  { icon: "PenLine", title: "Понятнее об услугах", text: "Как яснее рассказывать о работе и задачах, которые вы решаете для клиентов." },
  { icon: "ListOrdered", title: "Приоритеты вместо хаоса", text: "Задачи, которые подходят вашей ситуации, вместо попыток использовать все способы сразу." },
  { icon: "Footprints", title: "Следующие шаги", text: "Рекомендации, с которых можно начать развитие дела." },
  { icon: "Gift", title: "Бесплатный старт", text: "Диагностика и первые шаги бесплатны." },
];

const STEPS = [
  { title: "Расскажите о работе", text: "Укажите услуги, аудиторию, регион и цели." },
  { title: "Пройдите диагностику", text: "Ответьте на вопросы о вашей ситуации." },
  { title: "Получите шаги", text: "Посмотрите рекомендации и выберите, с чего начать." },
];

const eyebrow: React.CSSProperties = { fontSize: 12, fontWeight: 600, color: TEAL, textTransform: "uppercase", letterSpacing: "2.5px", marginBottom: 20 };
const h2Style: React.CSSProperties = { fontFamily: SERIF, fontSize: "clamp(28px,4vw,46px)", fontWeight: 500, color: DARK, margin: 0, letterSpacing: "-0.5px", lineHeight: 1.15 };
const ctaStyle: React.CSSProperties = {
  display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 10, padding: "16px 36px", borderRadius: 2,
  fontSize: 15, fontWeight: 600, background: "linear-gradient(135deg,#2DD4BF,#14B8A6)", color: DARK, textDecoration: "none", textAlign: "center",
};
const iconBox: React.CSSProperties = {
  width: 44, height: 44, borderRadius: 11, background: "rgba(45,212,191,0.12)",
  display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
};
const grid = (min: number): React.CSSProperties => ({
  display: "grid", gridTemplateColumns: `repeat(auto-fit,minmax(min(${min}px,100%),1fr))`, gap: 20,
});

function CtaButton({ children }: { children: React.ReactNode }) {
  return (
    <Link to={DIAG_URL} style={ctaStyle}>
      <Icon name="Compass" size={16} />
      {children}
    </Link>
  );
}

export default function DlyaSpecialistov() {
  return (
    <div style={{ fontFamily: "Inter, sans-serif", background: "#fff" }}>
      <Helmet>
        <title>Как найти клиентов специалисту: развитие своего дела | Промт Диалог</title>
        <meta name="description" content="Бесплатная диагностика для специалистов, работающих с людьми: репетиторов, тренеров, фотографов, консультантов. AI-навигатор «ПоДелам» определит шаги развития." />
        <meta name="keywords" content="как найти клиентов специалисту, продвижение частного специалиста, привлечение клиентов репетитору, продвижение тренера, продвижение фотографа, маркетинг для самозанятых, как развивать свое дело, продвижение услуг, частная практика, ИИ для специалиста, бесплатная диагностика" />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://promtdialog.ru/dlya-specialistov" />
        <meta property="og:title" content="Как найти клиентов специалисту — Промт Диалог" />
        <meta property="og:description" content="Бесплатная диагностика и шаги для тех, кто работает с людьми." />
        <meta property="og:url" content="https://promtdialog.ru/dlya-specialistov" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Как найти клиентов специалисту — Промт Диалог" />
        <meta name="twitter:description" content="Бесплатная диагностика и шаги для специалистов." />
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebPage",
          "name": "Как найти клиентов специалисту: развитие своего дела",
          "url": "https://promtdialog.ru/dlya-specialistov",
          "description": "Бесплатная диагностика для специалистов, работающих с людьми: услуги, аудитория, регион, ресурсы и следующие шаги.",
          "isPartOf": { "@type": "WebSite", "name": "Промт Диалог", "url": "https://promtdialog.ru" }
        })}</script>
      </Helmet>

      <BizNavbar />

      <section style={{ background: `radial-gradient(120% 100% at 70% 0%, #1a2e3c 0%, ${DARK} 55%, #060B16 100%)`, display: "flex", alignItems: "center", paddingTop: 76, position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: 0, right: "-5%", width: 600, height: 600, borderRadius: "50%", background: "radial-gradient(circle, rgba(45,212,191,0.10) 0%, transparent 65%)", pointerEvents: "none" }} />
        <div className="sp-hero-grid" style={{ maxWidth: 1200, margin: "0 auto", padding: "80px 32px", width: "100%", position: "relative", display: "grid", gridTemplateColumns: "1.15fr 0.85fr", gap: 56, alignItems: "center" }}>
          <div>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 10, border: "1px solid rgba(45,212,191,0.3)", borderRadius: 100, padding: "7px 18px", marginBottom: 32 }}>
              <div style={{ width: 6, height: 6, borderRadius: "50%", background: TEAL, flexShrink: 0 }} />
              <span style={{ fontSize: 12, color: TEAL, fontWeight: 500, letterSpacing: "1.5px", textTransform: "uppercase", lineHeight: 1.3 }}>Промт Диалог — AI-навигатор «ПоДелам»</span>
            </div>
            <h1 style={{ fontFamily: SERIF, fontSize: "clamp(32px,4.6vw,56px)", fontWeight: 500, color: "#fff", lineHeight: 1.15, margin: "0 0 28px", letterSpacing: "-0.5px" }}>
              Вы работаете с людьми. Как находить больше своих клиентов?
            </h1>
            <p style={{ fontSize: "clamp(15px,1.6vw,17px)", color: "rgba(255,255,255,0.65)", lineHeight: 1.7, margin: "0 0 16px", fontWeight: 300, maxWidth: 720 }}>
              Работая на себя, приходится самому искать клиентов, рассказывать об услугах и поддерживать запись.
            </p>
            <p style={{ fontSize: "clamp(15px,1.6vw,17px)", color: "rgba(255,255,255,0.65)", lineHeight: 1.7, margin: "0 0 16px", fontWeight: 300, maxWidth: 720 }}>
              Какие способы продвижения подходят вам, если времени мало, а советов много?
            </p>
            <p style={{ fontSize: "clamp(15px,1.6vw,17px)", color: "rgba(255,255,255,0.65)", lineHeight: 1.7, margin: "0 0 36px", fontWeight: 300, maxWidth: 720 }}>
              «Промт Диалог» разберет вашу ситуацию и предложит шаги под ваши услуги, аудиторию и регион.
            </p>
            <CtaButton>Пройти диагностику бесплатно</CtaButton>
            <div style={{ fontSize: 12, color: "rgba(255,255,255,0.45)", marginTop: 12 }}>Диагностика и шаги бесплатны.</div>
          </div>
          <div className="sp-hero-img" style={{ position: "relative" }}>
            <img
              src={HERO_IMG}
              alt="Специалист, работающий с клиентами, в своей студии"
              fetchPriority="high"
              decoding="async"
              style={{ width: "100%", height: "auto", borderRadius: 6, display: "block", boxShadow: "0 32px 80px rgba(0,0,0,0.5)" }}
            />
          </div>
        </div>
      </section>

      <section style={{ background: "#F8FAFC", padding: "100px 32px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ maxWidth: 780, marginBottom: 48 }}>
            <div style={eyebrow}>Кому подходит</div>
            <h2 style={{ ...h2Style, marginBottom: 20 }}>Для тех, кто работает с людьми</h2>
            <p style={{ fontSize: 16, color: GRAY, lineHeight: 1.7, margin: 0, fontWeight: 300 }}>
              Если ваш доход зависит от клиентов и умения находить новых, диагностика подойдет вам.
            </p>
          </div>
          <div style={{ ...grid(300), gap: 24, marginBottom: 40 }}>
            {AUDIENCE.map((a, i) => (
              <article key={i} style={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: 16, overflow: "hidden", display: "flex", flexDirection: "column" }}>
                <img src={a.img} alt={a.alt} loading="lazy" decoding="async" style={{ width: "100%", aspectRatio: "16 / 9", objectFit: "cover", display: "block" }} />
                <div style={{ padding: "22px 24px 26px" }}>
                  <h3 style={{ fontSize: 17, fontWeight: 700, color: DARK, margin: "0 0 10px", lineHeight: 1.3 }}>{i + 1}. {a.title}</h3>
                  <p style={{ fontSize: 14, color: "#475569", lineHeight: 1.7, margin: 0, fontWeight: 300 }}>{a.text}</p>
                </div>
              </article>
            ))}
          </div>
          <p style={{ fontSize: 17, color: DARK, lineHeight: 1.7, margin: 0, maxWidth: 840, fontWeight: 500 }}>
            Список не закрытый: если вы работаете с людьми и оказываете услуги, пройдите диагностику.
          </p>
        </div>
      </section>

      <section style={{ background: "#fff", padding: "100px 32px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={eyebrow}>Знакомая ситуация</div>
          <h2 style={{ ...h2Style, marginBottom: 48, maxWidth: 780 }}>Вы умеете работать. Кто поможет развивать дело?</h2>
          <div style={{ ...grid(300), marginBottom: 40 }}>
            {SITUATIONS.map((s, i) => (
              <div key={i} style={{ background: "#F8FAFC", border: "1px solid #E2E8F0", borderRadius: 16, padding: "28px 26px" }}>
                <div style={{ ...iconBox, marginBottom: 18 }}>
                  <Icon name={s.icon} fallback="Circle" size={21} style={{ color: "#0F766E" }} />
                </div>
                <h3 style={{ fontSize: 17, fontWeight: 700, color: DARK, margin: "0 0 10px", lineHeight: 1.3 }}>{s.title}</h3>
                <p style={{ fontSize: 14, color: "#475569", lineHeight: 1.7, margin: 0, fontWeight: 300 }}>{s.text}</p>
              </div>
            ))}
          </div>
          <p style={{ fontSize: 17, color: DARK, lineHeight: 1.7, margin: 0, maxWidth: 800, fontWeight: 500 }}>
            Становиться маркетологом не нужно: начните с анализа своей ситуации.
          </p>
        </div>
      </section>

      <section style={{ background: "#F8FAFC", padding: "100px 32px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ maxWidth: 780, marginBottom: 40 }}>
            <div style={eyebrow}>Решение</div>
            <h2 style={{ ...h2Style, marginBottom: 20 }}>Рекомендации для вашей ситуации</h2>
            <p style={{ fontSize: 16, color: GRAY, lineHeight: 1.7, margin: "0 0 14px", fontWeight: 300 }}>
              У специалистов разные услуги, аудитории и цели, поэтому универсальные советы работают плохо.
            </p>
            <p style={{ fontSize: 16, color: GRAY, lineHeight: 1.7, margin: 0, fontWeight: 300 }}>
              Алгоритмы строят рекомендации по данным, которые вы указываете в диагностике.
            </p>
          </div>
          <div style={{ fontSize: 15, fontWeight: 700, color: DARK, marginBottom: 16 }}>Что учитывается:</div>
          <div style={{ ...grid(300), gap: 16, marginBottom: 32 }}>
            {ANALYZED.map((a, i) => (
              <div key={i} style={{ display: "flex", gap: 14, alignItems: "flex-start", background: "#fff", border: "1px solid #E2E8F0", borderRadius: 12, padding: "18px 20px" }}>
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
            По этим данным алгоритмы определяют следующие шаги.
          </p>
          <div style={{ background: DARK, borderRadius: 14, padding: "24px 28px", maxWidth: 820, marginBottom: 36, display: "flex", gap: 14, alignItems: "flex-start" }}>
            <Icon name="Sparkles" size={20} style={{ color: TEAL, flexShrink: 0, marginTop: 2 }} />
            <p style={{ fontSize: 15, color: "rgba(255,255,255,0.85)", lineHeight: 1.7, margin: 0, fontWeight: 300 }}>
              Не пробуйте все подряд: выберите действия, которые сможете выполнять регулярно.
            </p>
          </div>
          <CtaButton>Получить шаги бесплатно</CtaButton>
        </div>
      </section>

      <section style={{ background: "#fff", padding: "100px 32px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={eyebrow}>Что вы получите</div>
          <h2 style={{ ...h2Style, marginBottom: 48, maxWidth: 760 }}>Что вы получите от диагностики</h2>
          <div style={grid(300)}>
            {RESULTS.map((r, i) => (
              <div key={i} style={{ background: "#F8FAFC", border: "1px solid #E2E8F0", borderRadius: 16, padding: "28px 24px" }}>
                <div style={{ ...iconBox, marginBottom: 16 }}>
                  <Icon name={r.icon} fallback="Circle" size={21} style={{ color: "#0F766E" }} />
                </div>
                <div style={{ fontSize: 12, color: GRAY, fontWeight: 600, marginBottom: 6 }}>{i + 1}</div>
                <h3 style={{ fontSize: 16, fontWeight: 700, color: DARK, margin: "0 0 10px", lineHeight: 1.3 }}>{r.title}</h3>
                <p style={{ fontSize: 14, color: "#475569", lineHeight: 1.65, margin: 0, fontWeight: 300 }}>{r.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section style={{ background: `radial-gradient(120% 100% at 20% 0%, #112B3C 0%, ${DARK} 55%, #060B16 100%)`, padding: "100px 32px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={eyebrow}>Как начать</div>
          <h2 style={{ ...h2Style, color: "#fff", marginBottom: 48, maxWidth: 760 }}>Три шага</h2>
          <div style={{ ...grid(260), gap: 24, marginBottom: 44 }}>
            {STEPS.map((s, i) => (
              <div key={i} style={{ border: "1px solid rgba(45,212,191,0.25)", borderRadius: 16, padding: "28px 26px", background: "rgba(255,255,255,0.03)" }}>
                <div style={{ fontFamily: SERIF, fontSize: 44, fontWeight: 600, color: TEAL, lineHeight: 1, marginBottom: 12 }}>{i + 1}</div>
                <div style={{ fontSize: 12, color: "rgba(255,255,255,0.45)", textTransform: "uppercase", letterSpacing: "1.5px", marginBottom: 8 }}>Шаг {i + 1}</div>
                <h3 style={{ fontSize: 17, fontWeight: 600, color: "#fff", margin: "0 0 10px" }}>{s.title}</h3>
                <p style={{ fontSize: 14, color: "rgba(255,255,255,0.65)", lineHeight: 1.65, margin: 0, fontWeight: 300 }}>{s.text}</p>
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
          <h2 style={{ ...h2Style, marginBottom: 20 }}>Материалы для специалистов</h2>
          <p style={{ fontSize: 16, color: "#475569", lineHeight: 1.75, margin: "0 0 14px", fontWeight: 300 }}>
            Привлечение клиентов, рассказ об услугах, повторные обращения и время на продвижение.
          </p>
          <p style={{ fontSize: 16, color: "#475569", lineHeight: 1.75, margin: "0 0 32px", fontWeight: 300 }}>
            Читайте статьи и берите идеи для своей профессии.
          </p>
          <a
            href={BLOG_URL}
            style={{ display: "inline-flex", alignItems: "center", gap: 10, padding: "15px 36px", borderRadius: 2, fontSize: 15, fontWeight: 600, background: DARK, color: "#fff", textDecoration: "none" }}
          >
            Читать материалы
            <Icon name="ArrowRight" size={16} />
          </a>
        </div>
      </section>

      <section style={{ padding: "110px 32px", background: `linear-gradient(135deg, ${DARK} 0%, #0F2A30 100%)`, position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: "-30%", left: "50%", transform: "translateX(-50%)", width: 700, height: 700, borderRadius: "50%", background: "radial-gradient(circle, rgba(45,212,191,0.10) 0%, transparent 65%)", pointerEvents: "none" }} />
        <div style={{ maxWidth: 800, margin: "0 auto", textAlign: "center", position: "relative" }}>
          <h2 style={{ fontFamily: SERIF, fontSize: "clamp(28px,4.2vw,50px)", fontWeight: 500, color: "#fff", margin: "0 0 24px", lineHeight: 1.12 }}>
            Развивайте дело, не делая все сами
          </h2>
          <p style={{ fontSize: 16, color: "rgba(255,255,255,0.65)", lineHeight: 1.75, margin: "0 0 16px", fontWeight: 300 }}>
            Хороший специалист не обязан знать, как продвигаться. Начните с бесплатной диагностики.
          </p>
          
          
          <CtaButton>Пройти диагностику бесплатно</CtaButton>
        </div>
      </section>

      <BizFooter />

      <div className="sp-mobile-sticky-cta" style={{
        display: "none", position: "fixed", left: 0, right: 0, bottom: 0, zIndex: 150,
        padding: "12px 16px calc(12px + env(safe-area-inset-bottom,0px))",
        background: "rgba(8,14,28,0.96)", backdropFilter: "blur(12px)",
        borderTop: "1px solid rgba(45,212,191,0.15)",
      }}>
        <Link to={DIAG_URL} style={{
          display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
          width: "100%", padding: 14, borderRadius: 10, fontSize: 14, fontWeight: 700,
          background: "linear-gradient(135deg,#2DD4BF,#14B8A6)", color: DARK,
          textDecoration: "none", fontFamily: "Inter, sans-serif",
        }}>
          <Icon name="Compass" size={16} />
          Пройти диагностику
        </Link>
      </div>

      <style>{`
        @media (max-width: 860px) {
          .sp-hero-grid { grid-template-columns: 1fr !important; gap: 36px !important; }
          .sp-hero-img { max-width: 480px; width: 100%; margin: 0 auto; }
          .sp-mobile-sticky-cta { display: block !important; }
        }
        @media (max-width: 560px) {
          section { padding-left: 20px !important; padding-right: 20px !important; }
          .sp-hero-grid { padding: 48px 0 56px !important; }
        }
      `}</style>
    </div>
  );
}