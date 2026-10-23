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
const BLOG_URL = "https://promtdialog.ru/blog";
const P = "https://cdn.poehali.dev/projects/10f61e56-9821-40f3-b705-3590ddaffd08/files/";

const HERO_IMG = P + "6697fb27-66de-4030-9557-621f5a61598c.jpg";

const AUDIENCE = [
  { img: P + "4a25a65d-d887-4ffe-95b5-fcc0cee79ecb.jpg", alt: "Репетитор занимается с учеником", title: "Репетиторам и частным преподавателям", text: "Учителям, преподавателям языков, музыкальным педагогам, наставникам по обучению и подготовке к экзаменам. Для тех, кто хочет привлекать учеников, заполнять расписание и развивать индивидуальные или групповые занятия." },
  { img: P + "e67cab5d-7677-4223-90f0-025613467fe9.jpg", alt: "Персональный тренер на занятии", title: "Тренерам и специалистам по физической активности", text: "Персональным тренерам, инструкторам йоги, пилатеса, растяжки, танцев и других направлений физической активности. Для тех, кто хочет находить новых клиентов, развивать персональные занятия и группы." },
  { img: P + "2b5f19a6-1e1f-4e5f-bd99-755a03888082.jpg", alt: "Инструктор ведёт группу в студии", title: "Фитнес-инструкторам и специалистам по движению", text: "Для специалистов, которые работают индивидуально или в небольших студиях и хотят понятнее представлять свои услуги, повышать загрузку и расширять клиентскую базу." },
  { img: P + "fbe66996-74cc-4d01-9ba0-bc1ba0908084.jpg", alt: "Косметолог проводит процедуру", title: "Косметологам и специалистам по уходу", text: "Для специалистов, работающих в рамках своей квалификации, которые хотят развивать запись, привлекать новых посетителей и поддерживать возвращение постоянных клиентов." },
  { img: P + "11bd39d9-9eb4-4ced-b4fb-c98fcbf79210.jpg", alt: "Фотограф на съёмке", title: "Фотографам и видеографам", text: "Для тех, кто проводит съемки для частных клиентов, семей, мероприятий, бизнеса и личных брендов. Помогает разобраться, как представить свои услуги, выделиться среди конкурентов и находить подходящую аудиторию." },
  { img: P + "1bab8f05-a2b6-49c0-8135-234882ed332f.jpg", alt: "Ведущая на празднике", title: "Организаторам мероприятий", text: "Ведущим, организаторам праздников, свадебным координаторам, аниматорам и другим специалистам событийной сферы. Для тех, кому важно привлекать заказчиков, развивать рекомендации и поддерживать загрузку в разные сезоны." },
  { img: P + "3754eff4-a65f-432f-a35f-ed4ebe6f307a.jpg", alt: "Консультант беседует с клиенткой", title: "Консультантам и наставникам", text: "Карьерным консультантам, бизнес-консультантам, наставникам и специалистам по личному развитию. Для тех, кто хочет понятнее объяснять ценность своих услуг, находить свою аудиторию и развивать частную практику." },
  { img: P + "43ec8604-4a43-4ef7-9456-aa176518282e.jpg", alt: "Мастер по бытовым услугам", title: "Специалистам по организации пространства и бытовым услугам", text: "Организаторам пространства, клининговым специалистам, мастерам по ремонту и настройке бытовой техники, специалистам по организации переездов и другим исполнителям, работающим напрямую с клиентами." },
  { img: P + "b35c5d82-abe2-4f88-bb17-16dd4871b5a9.jpg", alt: "Няня играет с детьми", title: "Специалистам по уходу за детьми и семейным услугам", text: "Няням, специалистам по сопровождению детей, организаторам детских занятий и другим специалистам, оказывающим услуги семьям. Для тех, кому важно выстраивать доверие, понятно представлять свои услуги и находить клиентов." },
  { img: P + "47891d2a-7258-4308-b838-f1aa706ca546.jpg", alt: "Грумер ухаживает за собакой", title: "Специалистам по уходу за животными", text: "Грумерам, кинологам, специалистам по дрессировке, передержке и уходу за питомцами. Для тех, кто хочет развивать клиентскую базу и делать поток обращений более системным." },
  { img: P + "d30b1ddf-af7e-453a-966b-710c830e7328.jpg", alt: "Стилист и визажист работает с невестой", title: "Свадебным и персональным специалистам", text: "Стилистам, визажистам, имидж-консультантам, персональным стилистам и другим специалистам, которые помогают людям подготовиться к важным событиям, подобрать образ или решить индивидуальную задачу." },
  { img: P + "08f9a622-781b-4b01-8fb8-9ee18ee0424d.jpg", alt: "Частный консультант с клиентом", title: "Частным консультантам в разных сферах", text: "Специалистам, которые работают индивидуально, помогают клиентам разобраться в определённых вопросах и оказывают экспертные услуги. Если ваша работа строится на взаимодействии с людьми и вы самостоятельно отвечаете за поиск клиентов, диагностика поможет определить возможные направления развития." },
];

const SITUATIONS = [
  { icon: "CalendarX", title: "Клиенты приходят неравномерно", text: "В одни недели расписание заполнено, в другие появляются свободные часы. Хочется стабильнее привлекать клиентов и меньше зависеть от случайных обращений." },
  { icon: "Share2", title: "Рекомендации есть, но хочется большего", text: "Довольные клиенты рассказывают о вас знакомым. Это важно, но вы хотите, чтобы новые люди тоже могли находить ваши услуги." },
  { icon: "BadgeHelp", title: "Трудно объяснить, почему стоит выбрать именно вас", text: "Вы знаете, в чём сильны, но не всегда понимаете, как донести ценность своей работы до человека, который ещё не знаком с вами." },
  { icon: "Hourglass", title: "Продвижение отнимает время", text: "Социальные сети, реклама, публикации, ответы на сообщения, поиск новых каналов привлечения. Всё это нужно делать параллельно с основной работой." },
  { icon: "Layers", title: "Слишком много советов", text: "Один эксперт советует вести блог, другой — запускать рекламу, третий — делать скидки. Но вы не знаете, что подходит именно вашей профессии и ситуации." },
  { icon: "Leaf", title: "Хочется развиваться без лишней суеты", text: "Вам важно не просто постоянно быть занятым, а понимать, какие действия имеют смысл и как последовательно двигаться к своим целям." },
];

const ANALYZED = [
  { icon: "Briefcase", title: "Ваши услуги", text: "что вы предлагаете и какие задачи решаете для клиентов." },
  { icon: "Users", title: "Ваша аудитория", text: "кто ваши потенциальные клиенты и кому могут быть полезны ваши услуги." },
  { icon: "MapPin", title: "Ваш регион", text: "где вы работаете и какую аудиторию можете охватить." },
  { icon: "Shapes", title: "Формат работы", text: "индивидуальные услуги, занятия, консультации, группы, выездная или другая работа, если эти данные предусмотрены диагностикой." },
  { icon: "Clock", title: "Ваше время и ресурсы", text: "сколько времени и возможностей вы можете выделить на развитие." },
  { icon: "Flag", title: "Ваши цели и трудности", text: "что хотите изменить, какие задачи стоят перед вами и что уже пробовали." },
];

const RESULTS = [
  { icon: "TrendingUp", title: "Понимание точек роста", text: "Посмотрите на свою практику или услуги со стороны и определите, какие направления развития заслуживают внимания." },
  { icon: "Lightbulb", title: "Идеи для привлечения клиентов", text: "Рассмотрите возможные способы продвижения с учетом ваших услуг, аудитории, региона и доступных ресурсов." },
  { icon: "PenLine", title: "Более понятное представление услуг", text: "Определите, как яснее рассказывать о своей работе, ценности и задачах, которые вы помогаете решать клиентам." },
  { icon: "ListOrdered", title: "Приоритеты вместо хаотичных действий", text: "Сосредоточьтесь на тех задачах, которые имеют смысл для вашей ситуации, вместо попыток одновременно использовать все доступные способы продвижения." },
  { icon: "Footprints", title: "Следующие шаги", text: "Получите рекомендации, оцените их применимость и выберите, с чего начать развитие своего дела." },
  { icon: "Gift", title: "Бесплатный старт", text: "Диагностика и получение первых шагов бесплатны. Вы сможете оценить рекомендации и решить, что из них подходит вашей работе." },
];

const STEPS = [
  { title: "Расскажите о своей работе", text: "Укажите направление деятельности, услуги, аудиторию, регион, цели и текущие задачи." },
  { title: "Пройдите диагностику", text: "Ответьте на вопросы, необходимые для анализа вашей ситуации." },
  { title: "Получите свои шаги", text: "Изучите рекомендации, сформированные с помощью встроенных алгоритмов, и определите, какие действия стоит рассмотреть в первую очередь." },
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
        <meta name="description" content="Бесплатная диагностика для специалистов, работающих с людьми: репетиторов, тренеров, фотографов, консультантов. AI-навигатор «ПоДелам» поможет определить шаги развития." />
        <meta name="keywords" content="как найти клиентов специалисту, продвижение частного специалиста, привлечение клиентов репетитору, продвижение тренера, продвижение фотографа, маркетинг для самозанятых, как развивать своё дело, продвижение услуг, частная практика, ИИ для специалиста, бесплатная диагностика" />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://promtdialog.ru/dlya-specialistov" />
        <meta property="og:title" content="Как найти клиентов специалисту — Промт Диалог" />
        <meta property="og:description" content="Бесплатная диагностика и персональные шаги для тех, кто работает с людьми и развивает своё дело." />
        <meta property="og:url" content="https://promtdialog.ru/dlya-specialistov" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Как найти клиентов специалисту — Промт Диалог" />
        <meta name="twitter:description" content="Бесплатная диагностика и персональные шаги для специалистов, работающих с людьми." />
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
              Вы оказываете услуги, развиваете профессиональные навыки и помогаете людям решать их задачи. Но, когда работаешь на себя, приходится самостоятельно заниматься ещё и продвижением: искать новых клиентов, рассказывать о своих услугах, поддерживать запись и думать о дальнейшем развитии.
            </p>
            <p style={{ fontSize: "clamp(15px,1.6vw,17px)", color: "rgba(255,255,255,0.65)", lineHeight: 1.7, margin: "0 0 16px", fontWeight: 300, maxWidth: 720 }}>
              Как понять, какие способы продвижения подходят именно вам? На чём сосредоточиться, если времени мало, а советов вокруг слишком много?
            </p>
            <p style={{ fontSize: "clamp(15px,1.6vw,17px)", color: "rgba(255,255,255,0.65)", lineHeight: 1.7, margin: "0 0 36px", fontWeight: 300, maxWidth: 720 }}>
              «Промт Диалог» анализирует вашу ситуацию и помогает определить конкретные шаги для развития вашей практики — с учётом ваших услуг, аудитории, региона, времени и возможностей.
            </p>
            <CtaButton>Пройти диагностику бесплатно</CtaButton>
            <div style={{ fontSize: 12, color: "rgba(255,255,255,0.45)", marginTop: 12 }}>Диагностика и получение персональных шагов бесплатны.</div>
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
            <h2 style={{ ...h2Style, marginBottom: 20 }}>Для тех, кто работает с людьми и развивает свое дело</h2>
            <p style={{ fontSize: 16, color: GRAY, lineHeight: 1.7, margin: 0, fontWeight: 300 }}>
              Если ваш доход зависит от клиентов, качества услуг и вашей способности находить новых людей, «Промт Диалог» поможет разобраться в возможных направлениях развития.
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
            Это не закрытый список профессий. Если вы работаете с людьми, оказываете услуги и хотите развивать свое дело, вы можете пройти диагностику и посмотреть, какие рекомендации подходят вашей ситуации.
          </p>
        </div>
      </section>

      <section style={{ background: "#fff", padding: "100px 32px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={eyebrow}>Знакомая ситуация</div>
          <h2 style={{ ...h2Style, marginBottom: 48, maxWidth: 780 }}>Вы умеете делать свою работу. Но кто помогает развивать ваше дело?</h2>
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
            Вам не обязательно становиться специалистом по маркетингу. Начните с анализа своей ситуации и определите, какие направления развития стоит рассмотреть в первую очередь.
          </p>
        </div>
      </section>

      <section style={{ background: "#F8FAFC", padding: "100px 32px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ maxWidth: 780, marginBottom: 40 }}>
            <div style={eyebrow}>Решение</div>
            <h2 style={{ ...h2Style, marginBottom: 20 }}>Рекомендации не для всех сразу, а для вашей ситуации</h2>
            <p style={{ fontSize: 16, color: GRAY, lineHeight: 1.7, margin: "0 0 14px", fontWeight: 300 }}>
              У разных специалистов разные услуги, аудитории, условия работы и цели. Поэтому универсальные советы не всегда помогают понять, что делать именно вам.
            </p>
            <p style={{ fontSize: 16, color: GRAY, lineHeight: 1.7, margin: 0, fontWeight: 300 }}>
              «Промт Диалог» использует встроенные алгоритмы анализа, чтобы формировать рекомендации на основе данных, которые вы указываете при диагностике.
            </p>
          </div>
          <div style={{ fontSize: 15, fontWeight: 700, color: DARK, marginBottom: 16 }}>Что учитывается при анализе:</div>
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
            На основе предоставленных данных алгоритмы формируют рекомендации и помогают определить возможные следующие шаги.
          </p>
          <div style={{ background: DARK, borderRadius: 14, padding: "24px 28px", maxWidth: 820, marginBottom: 36, display: "flex", gap: 14, alignItems: "flex-start" }}>
            <Icon name="Sparkles" size={20} style={{ color: TEAL, flexShrink: 0, marginTop: 2 }} />
            <p style={{ fontSize: 15, color: "rgba(255,255,255,0.85)", lineHeight: 1.7, margin: 0, fontWeight: 300 }}>
              Не нужно пробовать всё подряд. Важно понять, что подходит именно вашему делу, и выбрать действия, которые вы сможете последовательно реализовывать.
            </p>
          </div>
          <CtaButton>Получить свои шаги бесплатно</CtaButton>
        </div>
      </section>

      <section style={{ background: "#fff", padding: "100px 32px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={eyebrow}>Что вы получите</div>
          <h2 style={{ ...h2Style, marginBottom: 48, maxWidth: 760 }}>Больше ясности в развитии своего дела</h2>
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
          <h2 style={{ ...h2Style, color: "#fff", marginBottom: 48, maxWidth: 760 }}>Три шага к развитию вашей практики</h2>
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
          <div style={{ fontSize: 12, color: "rgba(255,255,255,0.45)", marginTop: 12 }}>Диагностика и получение шагов бесплатны.</div>
        </div>
      </section>

      <section style={{ background: "#F8FAFC", padding: "100px 32px" }}>
        <div style={{ maxWidth: 820, margin: "0 auto", textAlign: "center" }}>
          <div style={{ ...iconBox, margin: "0 auto 20px" }}>
            <Icon name="BookOpen" size={21} style={{ color: "#0F766E" }} />
          </div>
          <h2 style={{ ...h2Style, marginBottom: 20 }}>Идеи для тех, кто работает с людьми</h2>
          <p style={{ fontSize: 16, color: "#475569", lineHeight: 1.75, margin: "0 0 14px", fontWeight: 300 }}>
            Как привлекать клиентов, рассказывать о своих услугах, развивать частную практику, поддерживать повторные обращения и находить время на продвижение.
          </p>
          <p style={{ fontSize: 16, color: "#475569", lineHeight: 1.75, margin: "0 0 32px", fontWeight: 300 }}>
            Читайте практические материалы, знакомьтесь с разными подходами и выбирайте идеи, которые можно адаптировать к своей профессии.
          </p>
          <a
            href={BLOG_URL}
            style={{ display: "inline-flex", alignItems: "center", gap: 10, padding: "15px 36px", borderRadius: 2, fontSize: 15, fontWeight: 600, background: DARK, color: "#fff", textDecoration: "none" }}
          >
            Полезные материалы для специалистов
            <Icon name="ArrowRight" size={16} />
          </a>
        </div>
      </section>

      <section style={{ padding: "110px 32px", background: `linear-gradient(135deg, ${DARK} 0%, #0F2A30 100%)`, position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: "-30%", left: "50%", transform: "translateX(-50%)", width: 700, height: 700, borderRadius: "50%", background: "radial-gradient(circle, rgba(45,212,191,0.10) 0%, transparent 65%)", pointerEvents: "none" }} />
        <div style={{ maxWidth: 800, margin: "0 auto", textAlign: "center", position: "relative" }}>
          <h2 style={{ fontFamily: SERIF, fontSize: "clamp(28px,4.2vw,50px)", fontWeight: 500, color: "#fff", margin: "0 0 24px", lineHeight: 1.12 }}>
            Развивайте своё дело, не пытаясь делать всё самостоятельно
          </h2>
          <p style={{ fontSize: 16, color: "rgba(255,255,255,0.65)", lineHeight: 1.75, margin: "0 0 16px", fontWeight: 300 }}>
            Вы можете быть хорошим специалистом и при этом не знать, какой способ продвижения выбрать, где искать новых клиентов и на чём сосредоточиться в первую очередь.
          </p>
          <p style={{ fontSize: 16, color: "rgba(255,255,255,0.65)", lineHeight: 1.75, margin: "0 0 16px", fontWeight: 300 }}>
            «Промт Диалог» поможет проанализировать вашу ситуацию и определить возможные направления развития с учётом ваших услуг, аудитории, региона, времени и ресурсов.
          </p>
          <p style={{ fontSize: 16, color: "rgba(255,255,255,0.85)", lineHeight: 1.75, margin: "0 0 36px", fontWeight: 400 }}>
            Начните с бесплатной диагностики. Получите свои шаги и решите, что подходит именно вам.
          </p>
          <CtaButton>Пройти диагностику и получить шаги бесплатно</CtaButton>
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