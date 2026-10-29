import { Link } from "@/lib/router-compat";
import { Helmet } from "@/lib/helmet";
import BizNavbar from "@/components/BizNavbar";
import BizFooter from "@/components/BizFooter";
import Icon from "@/components/ui/icon";
import { TEAL, DARK, GRAY, SERIF, CTA_HREF } from "./dlya-psihologov/shared";

const HERO_IMG = "https://cdn.poehali.dev/projects/10f61e56-9821-40f3-b705-3590ddaffd08/files/4b1cb1b7-eb02-4473-bbf3-09f3cb9cd4b9.jpg";

const SITUATIONS = [
  { icon: "CalendarX", title: "Клиенты приходят нерегулярно", text: "В одни периоды расписание заполнено, в другие пустует. Вы не хотите агрессивных продаж, но хотите сделать привлечение клиентов системным." },
  { icon: "MessageCircle", title: "Сложно рассказывать о себе", text: "Непонятно, как объяснить, с какими запросами вы работаете и кому подойдет ваш подход, не сводя работу к рекламному лозунгу." },
  { icon: "Users", title: "Одних рекомендаций мало", text: "Клиенты советуют вас знакомым, но хочется, чтобы новые люди находили вас сами и понимали, подходит ли им ваше направление." },
  { icon: "EyeOff", title: "Продвижение вызывает сопротивление", text: "Публикации, реклама и личный бренд требуют постоянно показывать себя. Такой формат подходит не каждому психологу." },
  { icon: "Compass", title: "Непонятно, с чего начать", text: "Специализация, блог, реклама, группы, образовательные продукты или расширение практики? Вариантов много, а времени мало." },
  { icon: "UserCheck", title: "Нужны подходящие клиенты", text: "Важно не просто больше обращений, а клиенты, которые понимают вашу работу и приходят с подходящими запросами." },
];

const ANALYZED = [
  { icon: "Brain", title: "Услуги и специализация", text: "индивидуальные консультации, семейная работа, группы и другие ваши направления." },
  { icon: "Users", title: "Аудитория", text: "для кого ваша работа и каких клиентов вы хотите привлекать." },
  { icon: "MapPin", title: "Регион и формат", text: "география практики, очные или онлайн-консультации." },
  { icon: "PenLine", title: "Позиционирование", text: "как вы описываете работу и чем ваш подход отличается." },
  { icon: "Clock", title: "Время и ресурсы", text: "сколько времени вы готовы тратить на продвижение." },
  { icon: "Flag", title: "Цели и ситуация", text: "стабильная запись, развитие специализации или расширение практики." },
];

const VALUES = [
  { icon: "MessageSquareText", title: "Объяснять, с чем вы работаете", text: "Рассказывать, какие вопросы вы рассматриваете и чего ждать от работы, без обещаний результата." },
  { icon: "Fingerprint", title: "Уточнять специализацию", text: "Показывать особенности подхода и аудиторию, для которой он подходит, не обесценивая другие направления." },
  { icon: "Route", title: "Подбирать способы продвижения", text: "Учитывать ваш характер, время, формат работы и отношение к публичности." },
  { icon: "Sprout", title: "Работать по приоритетам", text: "Последовательно развивать практику, а не менять идеи и не копировать чужой успех." },
];

const RESULTS = [
  { icon: "TrendingUp", title: "Точки роста", text: "Какие направления развития важнее всего для вашей практики." },
  { icon: "PenLine", title: "Понятное позиционирование", text: "Как яснее представить специализацию, услуги и подход потенциальным клиентам." },
  { icon: "Lightbulb", title: "Идеи для привлечения клиентов", text: "Варианты продвижения под ваши услуги, аудиторию, регион и ресурсы." },
  { icon: "ListOrdered", title: "Приоритеты вместо хаоса", text: "Что решать сейчас, а что отложить, чтобы не распылять силы." },
  { icon: "Footprints", title: "Следующие шаги", text: "Рекомендации, которые можно оценить профессионально и адаптировать под свой стиль." },
  { icon: "Gift", title: "Бесплатный старт", text: "Диагностика и первые шаги бесплатны." },
];

const STEPS = [
  { title: "Расскажите о практике", text: "Укажите специализацию, услуги, аудиторию, формат, регион и цели." },
  { title: "Пройдите диагностику", text: "Ответьте на вопросы о вашей ситуации." },
  { title: "Получите шаги", text: "Посмотрите рекомендации и выберите, с чего начать." },
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
        <meta name="description" content="Бесплатная диагностика для психологов: AI-навигатор «ПоДелам» определит шаги развития частной практики и продвижения." />
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
          "description": "Бесплатная диагностика для психологов: позиционирование, продвижение и развитие частной практики с учетом профессиональных ценностей.",
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
              Частная практика требует не только компетентности: нужно объяснять, чем вы полезны, находить клиентов, выстраивать продвижение и планировать загрузку.
            </p>
            <p style={{ fontSize: "clamp(15px,1.6vw,17px)", color: "rgba(255,255,255,0.65)", lineHeight: 1.7, margin: "0 0 16px", fontWeight: 300, maxWidth: 720 }}>
              Как рассказывать о себе без навязчивой саморекламы и находить людей, которым подходит ваш подход?
            </p>
            <p style={{ fontSize: "clamp(15px,1.6vw,17px)", color: "rgba(255,255,255,0.65)", lineHeight: 1.7, margin: "0 0 36px", fontWeight: 300, maxWidth: 720 }}>
              «Промт Диалог» разберет вашу ситуацию и предложит шаги с учетом услуг, аудитории и региона.
            </p>
            <CtaButton>Пройти диагностику бесплатно</CtaButton>
            <div style={{ fontSize: 12, color: "rgba(255,255,255,0.45)", marginTop: 12 }}>Диагностика и шаги бесплатны.</div>
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
            <h2 style={{ ...h2Style, marginBottom: 20 }}>Частная практика психолога — это еще и работа над ее развитием</h2>
            <p style={{ fontSize: 16, color: GRAY, lineHeight: 1.7, margin: 0, fontWeight: 300 }}>
              Профессиональная подготовка сама по себе не отвечает на вопросы о позиционировании, продвижении и стабильной записи.
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
            Продвигать практику можно, не нарушая профессиональные ценности и границы.
          </p>
        </div>
      </section>

      <section style={{ background: "#fff", padding: "100px 32px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ maxWidth: 760, marginBottom: 40 }}>
            <div style={eyebrow}>Решение</div>
            <h2 style={{ ...h2Style, marginBottom: 20 }}>Продвижение с учетом специфики практики</h2>
            <p style={{ fontSize: 16, color: GRAY, lineHeight: 1.7, margin: 0, fontWeight: 300 }}>
              Вы проходите диагностику, алгоритмы анализируют ваши данные и предлагают точки роста и следующие действия.
            </p>
          </div>
          <div style={{ fontSize: 15, fontWeight: 700, color: DARK, marginBottom: 16 }}>Что учитывается:</div>
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
            По введенным данным алгоритмы определяют, что рассмотреть первым, и выстраивают порядок шагов.
          </p>
          <div style={{ background: DARK, borderRadius: 14, padding: "24px 28px", maxWidth: 820, marginBottom: 36, display: "flex", gap: 14, alignItems: "flex-start" }}>
            <Icon name="Sparkles" size={20} style={{ color: TEAL, flexShrink: 0, marginTop: 2 }} />
            <p style={{ fontSize: 15, color: "rgba(255,255,255,0.85)", lineHeight: 1.7, margin: 0, fontWeight: 300 }}>
              Не нужно копировать чужую стратегию и становиться блогером. Выберите способы, которые подходят вашей практике и принципам.
            </p>
          </div>
          <CtaButton>Получить шаги бесплатно</CtaButton>
        </div>
      </section>

      <section style={{ background: "#F8FAFC", padding: "100px 32px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ maxWidth: 800, marginBottom: 48 }}>
            <div style={eyebrow}>Профессиональные ценности</div>
            <h2 style={{ ...h2Style, marginBottom: 20 }}>Практика и продвижение не противоречат друг другу</h2>
            <p style={{ fontSize: 16, color: GRAY, lineHeight: 1.7, margin: "0 0 14px", fontWeight: 300 }}>
              Не обещать быстрых изменений, не давить на уязвимость и не превращать сложные ситуации людей в рекламу.
            </p>
            <p style={{ fontSize: 16, color: GRAY, lineHeight: 1.7, margin: 0, fontWeight: 300 }}>
              Можно понятно рассказывать о работе, объяснять формат услуг и последовательно общаться с клиентами.
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
              Профессиональная этика остается основой практики.
            </p>
          </div>
        </div>
      </section>

      <section style={{ background: "#fff", padding: "100px 32px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={eyebrow}>Что вы получите</div>
          <h2 style={{ ...h2Style, marginBottom: 48, maxWidth: 760 }}>Что вы получите от диагностики</h2>
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
          <h2 style={{ ...h2Style, color: "#fff", marginBottom: 48, maxWidth: 760 }}>Начните со своей ситуации</h2>
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
          <div style={{ fontSize: 12, color: "rgba(255,255,255,0.45)", marginTop: 12 }}>Диагностика и шаги бесплатны.</div>
        </div>
      </section>

      <section style={{ background: "#F8FAFC", padding: "100px 32px" }}>
        <div style={{ maxWidth: 820, margin: "0 auto", textAlign: "center" }}>
          <div style={{ ...iconBox, margin: "0 auto 20px" }}>
            <Icon name="BookOpen" size={21} style={{ color: "#0F766E" }} />
          </div>
          <h2 style={{ ...h2Style, marginBottom: 20 }}>Материалы о развитии практики</h2>
          <p style={{ fontSize: 16, color: "#475569", lineHeight: 1.75, margin: "0 0 14px", fontWeight: 300 }}>
            Как рассказывать о работе, объяснять специализацию и планировать продвижение.
          </p>
          <p style={{ fontSize: 16, color: "#475569", lineHeight: 1.75, margin: "0 0 32px", fontWeight: 300 }}>
            Статьи для психологов с разными подходами.
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
            Развитие практики можно сделать понятным
          </h2>
          <p style={{ fontSize: 16, color: "rgba(255,255,255,0.65)", lineHeight: 1.75, margin: "0 0 16px", fontWeight: 300 }}>
            Не нужно самому разбираться во всем маркетинге.
          </p>
          <p style={{ fontSize: 16, color: "rgba(255,255,255,0.65)", lineHeight: 1.75, margin: "0 0 16px", fontWeight: 300 }}>
            Начните с диагностики: что уже работает и чего вы хотите достичь.
          </p>
          <p style={{ fontSize: 16, color: "rgba(255,255,255,0.85)", lineHeight: 1.75, margin: "0 0 36px", fontWeight: 400 }}>
            Пройдите диагностику и получите шаги.
          </p>
          <CtaButton>Пройти диагностику бесплатно</CtaButton>
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