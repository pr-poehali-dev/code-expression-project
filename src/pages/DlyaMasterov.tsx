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
  { icon: "CalendarX", title: "Запись нестабильна", text: "Сегодня расписание заполнено, а на следующей неделе пусто. Хочется привлекать клиентов регулярно, а не зависеть от случайных обращений." },
  { icon: "Users", title: "Только по рекомендациям", text: "Сарафанное радио помогает, но хочется, чтобы о вас узнавали и новые люди." },
  { icon: "Repeat", title: "Клиенты не возвращаются", text: "Человек доволен, но больше не записался. Как уместно напомнить о себе без навязчивости?" },
  { icon: "Clock", title: "Нет времени на продвижение", text: "Клиенты, кабинет, материалы, сообщения. Когда заниматься публикациями и рекламой?" },
  { icon: "HelpCircle", title: "Непонятно, что сработает", text: "Соцсети, реклама, скидки, видео. Что подойдет вашей практике и стоит ли тратить на это время и деньги?" },
  { icon: "Sparkles", title: "Трудно рассказать о себе", text: "Сложно объяснить словами, чем полезна ваша работа, чтобы человек записался именно к вам." },
];

const ANALYZED = [
  { icon: "Hand", title: "Услуги", text: "массаж, косметические процедуры, уходовые услуги." },
  { icon: "Users", title: "Аудитория", text: "кому подходят услуги и каких клиентов вы хотите привлекать." },
  { icon: "MapPin", title: "Регион", text: "где вы работаете и какую аудиторию можете охватить." },
  { icon: "Clock", title: "Время", text: "сколько времени можно выделять на продвижение помимо работы." },
  { icon: "Briefcase", title: "Ресурсы", text: "чем вы располагаете для продвижения." },
  { icon: "Flag", title: "Текущая ситуация", text: "что уже работает, что мешает и чего вы хотите достичь." },
];

const RESULTS = [
  { icon: "Search", title: "Найти новых клиентов", text: "Выбрать способы привлечения под ваши услуги и регион." },
  { icon: "CalendarCheck", title: "Стабилизировать запись", text: "Уменьшить число свободных окон." },
  { icon: "HeartHandshake", title: "Вернуть постоянных клиентов", text: "Уместно напоминать о себе и стимулировать повторные записи." },
  { icon: "Megaphone", title: "Понятнее рассказывать об услугах", text: "Объяснить потенциальным клиентам, почему записаться стоит к вам." },
  { icon: "Footprints", title: "Выбрать следующие шаги", text: "Рекомендации, которые можно внедрять постепенно, не переделывая всю практику." },
  { icon: "Timer", title: "Учесть свое время", text: "Способы продвижения, которые вписываются в график между приемами." },
];

const AUDIENCE = [
  { icon: "Hand", title: "Массажистам", text: "Расширять клиентскую базу, увеличивать повторные визиты и меньше зависеть от рекомендаций." },
  { icon: "Sparkles", title: "Мастерам красоты", text: "Сделать запись стабильнее, понятнее рассказывать об услугах и находить клиентов." },
  { icon: "UserCog", title: "Другим частным специалистам", text: "Для тех, кто сам оказывает услуги и отвечает за собственное продвижение." },
];

const STEPS = [
  { title: "Расскажите о работе", text: "Укажите услуги, аудиторию, регион и цели." },
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
        <meta name="description" content="Бесплатная диагностика для частных мастеров и массажистов: AI-навигатор «ПоДелам» определит шаги для стабильной записи и привлечения клиентов." />
        <meta name="keywords" content="как привлечь клиентов массажисту, продвижение массажиста, маркетинг для частного мастера, стабильная запись клиентов, свободные окна в записи, повторные записи клиентов, продвижение мастера красоты, как найти клиентов мастеру, продвижение частной практики, ИИ для мастера, бесплатная диагностика практики" />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://promtdialog.ru/dlya-masterov" />
        <meta property="og:title" content="Как привлечь клиентов мастеру и массажисту — Промт Диалог" />
        <meta property="og:description" content="Бесплатная диагностика и шаги для мастеров и массажистов: запись, новые клиенты, повторные визиты." />
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
              Стабильная запись зависит не только от качества услуг: нужно привлекать новых клиентов, возвращать постоянных и находить время на продвижение.
            </p>
            <p style={{ fontSize: "clamp(15px,1.6vw,17px)", color: "rgba(255,255,255,0.65)", lineHeight: 1.7, margin: "0 0 36px", fontWeight: 300, maxWidth: 720 }}>
              «Промт Диалог» разберет вашу ситуацию и предложит шаги под ваши услуги, аудиторию и регион.
            </p>
            <CtaButton>Пройти диагностику бесплатно</CtaButton>
            <div style={{ fontSize: 12, color: "rgba(255,255,255,0.45)", marginTop: 12 }}>Диагностика и шаги бесплатны.</div>
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
            <h2 style={{ ...h2Style, marginBottom: 20 }}>Мастер работает на себя и отвечает за весь бизнес</h2>
            <p style={{ fontSize: 16, color: GRAY, lineHeight: 1.7, margin: 0, fontWeight: 300 }}>
              Приходится самому думать о клиентах, записи, продвижении и доходе, и непонятно, за что браться первым.
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
            Становиться маркетологом не нужно: определите приоритеты и выберите действия, которые вписываются в рабочий график.
          </p>
        </div>
      </section>

      <section style={{ background: "#fff", padding: "100px 32px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ maxWidth: 760, marginBottom: 40 }}>
            <div style={eyebrow}>Решение</div>
            <h2 style={{ ...h2Style, marginBottom: 20 }}>Шаги для вашей практики</h2>
            <p style={{ fontSize: 16, color: GRAY, lineHeight: 1.7, margin: "0 0 14px", fontWeight: 300 }}>
              Вы проходите диагностику, алгоритмы анализируют ваши данные и дают рекомендации под вашу работу.
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
            По этим данным вы получаете точки роста и следующие действия.
          </p>
          <div style={{ background: DARK, borderRadius: 14, padding: "24px 28px", maxWidth: 820, marginBottom: 36, display: "flex", gap: 14, alignItems: "flex-start" }}>
            <Icon name="Sparkles" size={20} style={{ color: TEAL, flexShrink: 0, marginTop: 2 }} />
            <p style={{ fontSize: 15, color: "rgba(255,255,255,0.85)", lineHeight: 1.7, margin: 0, fontWeight: 300 }}>
              Не берите все способы продвижения сразу: начните с понимания своей ситуации.
            </p>
          </div>
          <CtaButton>Получить шаги бесплатно</CtaButton>
        </div>
      </section>

      <section style={{ background: "#F8FAFC", padding: "100px 32px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={eyebrow}>Чем это поможет</div>
          <h2 style={{ ...h2Style, marginBottom: 48, maxWidth: 760 }}>Развивать практику, а не искать советы</h2>
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
            <h2 style={{ ...h2Style, marginBottom: 20 }}>Для частных специалистов</h2>
            <p style={{ fontSize: 16, color: GRAY, lineHeight: 1.7, margin: 0, fontWeight: 300 }}>
              Для тех, кто развивает собственную практику и привлекает клиентов.
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
            Рекомендации строятся на данных о вашей ситуации, а не на названии профессии.
          </p>
        </div>
      </section>

      <section style={{ background: `radial-gradient(120% 100% at 20% 0%, #112B3C 0%, ${DARK} 55%, #060B16 100%)`, padding: "100px 32px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={eyebrow}>Как начать</div>
          <h2 style={{ ...h2Style, color: "#fff", marginBottom: 48, maxWidth: 760 }}>Три шага</h2>
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
          <h2 style={{ ...h2Style, marginBottom: 20 }}>Материалы для мастеров</h2>
          <p style={{ fontSize: 16, color: "#475569", lineHeight: 1.75, margin: "0 0 14px", fontWeight: 300 }}>
            Привлечение клиентов, повторные записи, рассказ об услугах и время на продвижение.
          </p>
          <p style={{ fontSize: 16, color: "#475569", lineHeight: 1.75, margin: "0 0 32px", fontWeight: 300 }}>
            Читайте статьи для мастеров и массажистов и берите подходящие идеи.
          </p>
          <Link
            to="/blog?role=master,massage"
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
            Вы умеете работать. Разберемся, как развивать практику
          </h2>
          <p style={{ fontSize: 16, color: "rgba(255,255,255,0.65)", lineHeight: 1.75, margin: "0 0 16px", fontWeight: 300 }}>
            Хорошо оказывать услуги и уметь продвигаться — разные навыки. Помогаем со вторым.
          </p>
          
          <p style={{ fontSize: 16, color: "rgba(255,255,255,0.85)", lineHeight: 1.75, margin: "0 0 36px", fontWeight: 400 }}>
            Начните с бесплатной диагностики и решите, что попробовать первым.
          </p>
          <CtaButton>Пройти диагностику бесплатно</CtaButton>
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