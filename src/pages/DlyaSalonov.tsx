import { useEffect, useRef, useState } from "react";
import { Helmet } from "@/lib/helmet";
import DokNavbar from "@/components/DokNavbar";
import DokFooter from "@/components/DokFooter";
import SalonForm from "@/components/SalonForm";

const ACCENT = "hsl(185, 85%, 32%)";
const ACCENT_DARK = "hsl(185, 85%, 24%)";
const ACCENT_SHADOW = "hsla(185, 85%, 32%, 0.22)";
const BG = "#f8f8f6";

function useInView(threshold = 0.1) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);
  return { ref, visible };
}

function FadeIn({ children, delay = 0, style = {} }: { children: React.ReactNode; delay?: number; style?: React.CSSProperties }) {
  const { ref, visible } = useInView();
  return (
    <div ref={ref} style={{ opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(24px)", transition: `opacity 0.6s ease ${delay}s, transform 0.6s ease ${delay}s`, ...style }}>
      {children}
    </div>
  );
}

const PAINS = [
  { title: "Мастера работают хаотично", text: "Нет единого подхода, каждый ведёт клиента по-своему." },
  { title: "Клиенты не возвращаются", text: "Процедура понравилась, но логика следующего визита не объяснена." },
  { title: "Слабая коммуникация", text: "Мастера и администраторы не умеют спокойно объяснять ценность услуги." },
  { title: "Прайс не ведёт клиента", text: "Клиент видит список техник, но не понимает, что выбрать." },
  { title: "Мастера выгорают", text: "Протоколы перегружают тело специалиста, тайминг расползается." },
  { title: "Низкие рекомендации", text: "Клиенту сложно объяснить, чем салон отличается." },
  { title: "Нет ощущения премиальности", text: "Сервис, речь, атмосфера и ведение клиента не собраны в единую систему." },
  { title: "Руководитель не видит цифры", text: "Непонятно, сколько салон теряет на загрузке, тайминге и повторных визитах." },
];

const STEPS = [
  { n: "01", title: "Старт без рисков", sub: "Договор", text: "Фиксируем цели, форматы работы и ожидаемые результаты." },
  { n: "02", title: "Найдём, где теряете деньги", sub: "Оценка салона и персонала", text: "Диагностика компетенций, прайса, загрузки и тайминга." },
  { n: "03", title: "Не курс, а результат", sub: "Внедрение под каждого мастера", text: "Конкретные техники с учётом физических данных и опыта каждого специалиста." },
  { n: "04", title: "База знаний всегда под рукой", sub: "Онлайн-доступ к платформе", text: "Мастера учатся системно между очными встречами." },
  { n: "05", title: "Онлайн и офлайн поддержка", sub: "Дополнительные мероприятия", text: "Вебинары, интенсивы и разборы работы на протяжении сотрудничества." },
];

const RESULTS = [
  "Больше повторных записей",
  "Выше ценность массажных услуг",
  "Понятнее прайс для клиента",
  "Увереннее мастера",
  "Меньше перегруза команды",
  "Сильнее администраторы",
  "Больше доверия клиентов",
  "Управляемая система качества",
];

const FOR_WHOM = [
  "Небольшие салоны и студии до 5 специалистов",
  "Салоны среднего уровня и wellness-центры",
  "Премиальные салоны и сети",
  "Пространства, где массаж есть, но не раскрыт как направление",
  "Команды, которым нужен единый стандарт работы",
];

function trackEvent(name: string) {
  type WY = Window & { ym?: (id: unknown, t: string, n: string) => void };
  if ((window as WY).ym) (window as WY).ym!(undefined, "reachGoal", name);
}

export default function DlyaSalonov() {
  const formRef = useRef<HTMLDivElement>(null);

  const scrollToForm = () => {
    formRef.current?.scrollIntoView({ behavior: "smooth" });
    trackEvent("salon_form_open");
  };

  return (
    <div style={{ background: BG, minHeight: "100vh", fontFamily: "Montserrat, sans-serif" }}>
      <Helmet>
        <title>Dok Диалог для салонов — система развития массажного направления</title>
        <meta name="description" content="Внедрение системы для салонов: диагностика мастеров, прайс, тайминг процедур, удержание клиентов, повторные записи и повышение ценности массажных услуг." />
      </Helmet>
      <DokNavbar />

      {/* Hero */}
      <section style={{ paddingTop: 120, paddingBottom: 80, maxWidth: 1100, margin: "0 auto", padding: "120px 24px 80px" }}>
        <div style={{ opacity: 0.7, fontSize: 12, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: ACCENT, marginBottom: 20 }}>
          Dok Диалог для салонов
        </div>
        <h1 style={{ fontFamily: "Cormorant, serif", fontSize: "clamp(36px, 5vw, 62px)", fontWeight: 700, color: "#1a1a1a", lineHeight: 1.15, margin: "0 0 24px", maxWidth: 760 }}>
          Массажное направление,<br />которое повышает уровень<br />салона и приносит деньги
        </h1>
        <p style={{ fontSize: 17, color: "#555", lineHeight: 1.75, maxWidth: 600, margin: "0 0 40px" }}>
          Помогаем салонам, SPA и wellness-пространствам выстроить систему массажных услуг: от диагностики мастеров и прайса до протоколов, коммуникации, повторных записей и удержания клиентов.
        </p>
        <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
          <button onClick={() => { scrollToForm(); trackEvent("salon_cta_click"); }}
            style={{ padding: "15px 32px", borderRadius: 12, border: "none", cursor: "pointer", background: `linear-gradient(135deg, ${ACCENT}, ${ACCENT_DARK})`, color: "#fff", fontSize: 15, fontWeight: 700, fontFamily: "Montserrat, sans-serif", boxShadow: `0 4px 20px ${ACCENT_SHADOW}` }}>
            Обсудить внедрение
          </button>
          <a href="/dlya-salonov/5-shagov" onClick={() => trackEvent("salon_5_steps_click")}
            style={{ padding: "15px 32px", borderRadius: 12, border: `1.5px solid ${ACCENT}`, cursor: "pointer", background: "transparent", color: ACCENT, fontSize: 15, fontWeight: 600, fontFamily: "Montserrat, sans-serif", textDecoration: "none" }}>
            Посмотреть 5 шагов
          </a>
        </div>
        <div style={{ display: "flex", gap: 24, flexWrap: "wrap", marginTop: 40 }}>
          {["Диагностика салона и персонала", "Внедрение под каждого мастера", "База знаний и онлайн-поддержка", "Фокус на деньгах, сервисе и повторных визитах"].map(f => (
            <div key={f} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "#666" }}>
              <div style={{ width: 6, height: 6, borderRadius: "50%", background: ACCENT, flexShrink: 0 }} />
              {f}
            </div>
          ))}
        </div>
      </section>

      {/* Главная мысль */}
      <section style={{ background: "#fff", padding: "72px 24px" }}>
        <div style={{ maxWidth: 820, margin: "0 auto" }}>
          <FadeIn>
            <h2 style={{ fontFamily: "Cormorant, serif", fontSize: "clamp(28px, 4vw, 44px)", fontWeight: 700, color: "#1a1a1a", margin: "0 0 24px" }}>
              Салону нужен не курс по массажу, а система уровня
            </h2>
            <p style={{ fontSize: 16, color: "#555", lineHeight: 1.85 }}>
              Массаж в салоне начинает приносить больше, когда он перестаёт быть отдельной процедурой в прайсе. Важны команда, протоколы, тайминг, прайс, администраторы, коммуникация, удержание и повторные визиты.
              <br /><br />
              «Dok Диалог» помогает собрать эти элементы в управляемое направление.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* Боли */}
      <section style={{ padding: "80px 24px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <FadeIn>
            <div style={{ textAlign: "center", marginBottom: 52 }}>
              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: ACCENT, marginBottom: 14 }}>Диагностика</div>
              <h2 style={{ fontFamily: "Cormorant, serif", fontSize: "clamp(26px, 3.5vw, 40px)", fontWeight: 700, color: "#1a1a1a", margin: 0 }}>
                Где салон чаще всего теряет деньги
              </h2>
            </div>
          </FadeIn>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 20 }}>
            {PAINS.map((p, i) => (
              <FadeIn key={p.title} delay={i * 0.05}>
                <div style={{ background: "#fff", borderRadius: 16, padding: "28px 26px", border: "1px solid #eee", height: "100%" }}>
                  <div style={{ width: 36, height: 3, background: ACCENT, borderRadius: 2, marginBottom: 18 }} />
                  <div style={{ fontWeight: 700, fontSize: 15, color: "#1a1a1a", marginBottom: 10, lineHeight: 1.4 }}>{p.title}</div>
                  <div style={{ fontSize: 14, color: "#777", lineHeight: 1.7 }}>{p.text}</div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Что продаётся */}
      <section style={{ background: "#1a2a2a", padding: "80px 24px" }}>
        <div style={{ maxWidth: 1000, margin: "0 auto" }}>
          <FadeIn>
            <div style={{ textAlign: "center", marginBottom: 52 }}>
              <h2 style={{ fontFamily: "Cormorant, serif", fontSize: "clamp(26px, 3.5vw, 42px)", fontWeight: 700, color: "#fff", margin: "0 0 14px" }}>
                Мы внедряем не техники. Мы внедряем систему
              </h2>
            </div>
          </FadeIn>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 40 }} className="salon-two-col">
            <FadeIn>
              <div style={{ background: "rgba(255,255,255,0.05)", borderRadius: 16, padding: "32px 28px" }}>
                <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "#888", marginBottom: 20 }}>Не это</div>
                {["Просто обучение персонала", "Разовый мастер-класс", "Набор техник", "Мотивационный тренинг", "«Курс по массажу»"].map(t => (
                  <div key={t} style={{ display: "flex", gap: 10, alignItems: "flex-start", marginBottom: 14 }}>
                    <span style={{ color: "#666", marginTop: 2, fontSize: 16 }}>—</span>
                    <span style={{ fontSize: 15, color: "#aaa", lineHeight: 1.5 }}>{t}</span>
                  </div>
                ))}
              </div>
            </FadeIn>
            <FadeIn delay={0.1}>
              <div style={{ background: `${ACCENT}18`, borderRadius: 16, padding: "32px 28px", border: `1px solid ${ACCENT}44` }}>
                <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: ACCENT, marginBottom: 20 }}>А это</div>
                {["Стандарты работы", "Диагностика потерь", "Единый уровень сервиса", "Протоколы под мастеров", "Удержание клиентов", "Повторные записи", "Рост ценности услуг", "Повышение прибыльности направления"].map(t => (
                  <div key={t} style={{ display: "flex", gap: 10, alignItems: "flex-start", marginBottom: 12 }}>
                    <div style={{ width: 6, height: 6, borderRadius: "50%", background: ACCENT, flexShrink: 0, marginTop: 7 }} />
                    <span style={{ fontSize: 15, color: "#e8e8e4", lineHeight: 1.5 }}>{t}</span>
                  </div>
                ))}
              </div>
            </FadeIn>
          </div>
        </div>
        <style>{`@media(max-width:640px){.salon-two-col{grid-template-columns:1fr!important}}`}</style>
      </section>

      {/* 5 шагов */}
      <section style={{ padding: "80px 24px", background: "#fff" }}>
        <div style={{ maxWidth: 1000, margin: "0 auto" }}>
          <FadeIn>
            <div style={{ textAlign: "center", marginBottom: 52 }}>
              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: ACCENT, marginBottom: 14 }}>Активная услуга</div>
              <h2 style={{ fontFamily: "Cormorant, serif", fontSize: "clamp(26px, 3.5vw, 42px)", fontWeight: 700, color: "#1a1a1a", margin: 0 }}>
                5 шагов к массажу, который приносит деньги
              </h2>
            </div>
          </FadeIn>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {STEPS.map((s, i) => (
              <FadeIn key={s.n} delay={i * 0.08}>
                <div style={{ display: "flex", gap: 24, alignItems: "flex-start", padding: "24px 28px", background: BG, borderRadius: 16, border: "1px solid #eee" }}>
                  <div style={{ fontFamily: "Cormorant, serif", fontSize: 36, fontWeight: 700, color: `${ACCENT}44`, flexShrink: 0, lineHeight: 1 }}>{s.n}</div>
                  <div>
                    <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: ACCENT, marginBottom: 4 }}>{s.sub}</div>
                    <div style={{ fontWeight: 700, fontSize: 16, color: "#1a1a1a", marginBottom: 6 }}>{s.title}</div>
                    <div style={{ fontSize: 14, color: "#777", lineHeight: 1.7 }}>{s.text}</div>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
          <FadeIn delay={0.4}>
            <div style={{ textAlign: "center", marginTop: 36 }}>
              <a href="/dlya-salonov/5-shagov" onClick={() => trackEvent("salon_5_steps_click")}
                style={{ display: "inline-block", padding: "14px 36px", borderRadius: 12, border: `1.5px solid ${ACCENT}`, color: ACCENT, fontSize: 15, fontWeight: 600, textDecoration: "none" }}>
                Подробнее о 5 шагах
              </a>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Результаты */}
      <section style={{ padding: "80px 24px" }}>
        <div style={{ maxWidth: 1000, margin: "0 auto" }}>
          <FadeIn>
            <div style={{ textAlign: "center", marginBottom: 52 }}>
              <h2 style={{ fontFamily: "Cormorant, serif", fontSize: "clamp(26px, 3.5vw, 42px)", fontWeight: 700, color: "#1a1a1a", margin: "0 0 14px" }}>
                Результат внедрения должен быть виден в работе салона
              </h2>
              <p style={{ fontSize: 14, color: "#888", fontStyle: "italic" }}>Ожидаемые бизнес-эффекты при корректном внедрении</p>
            </div>
          </FadeIn>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 16 }}>
            {RESULTS.map((r, i) => (
              <FadeIn key={r} delay={i * 0.05}>
                <div style={{ background: "#fff", borderRadius: 14, padding: "22px 20px", border: "1px solid #eee", display: "flex", gap: 12, alignItems: "flex-start" }}>
                  <div style={{ width: 8, height: 8, borderRadius: "50%", background: ACCENT, flexShrink: 0, marginTop: 5 }} />
                  <span style={{ fontSize: 14, color: "#333", lineHeight: 1.55, fontWeight: 500 }}>{r}</span>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Для кого */}
      <section style={{ background: "#fff", padding: "72px 24px" }}>
        <div style={{ maxWidth: 820, margin: "0 auto" }}>
          <FadeIn>
            <h2 style={{ fontFamily: "Cormorant, serif", fontSize: "clamp(26px, 3.5vw, 42px)", fontWeight: 700, color: "#1a1a1a", margin: "0 0 36px" }}>
              Кому подходит направление
            </h2>
          </FadeIn>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {FOR_WHOM.map((w, i) => (
              <FadeIn key={w} delay={i * 0.07}>
                <div style={{ display: "flex", gap: 16, alignItems: "center", padding: "18px 22px", background: BG, borderRadius: 12, border: "1px solid #eee" }}>
                  <div style={{ width: 4, height: 36, borderRadius: 2, background: ACCENT, flexShrink: 0 }} />
                  <span style={{ fontSize: 15, color: "#333", lineHeight: 1.5 }}>{w}</span>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Онлайн-курс */}
      <section style={{ padding: "72px 24px", background: BG }}>
        <div style={{ maxWidth: 720, margin: "0 auto" }}>
          <FadeIn>
            <div style={{ background: "#fff", borderRadius: 20, padding: "44px 44px", border: "1px solid #eee", textAlign: "center" }} className="salon-platform-pad">
              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: ACCENT, marginBottom: 16 }}>Скоро</div>
              <h2 style={{ fontFamily: "Cormorant, serif", fontSize: "clamp(24px, 3vw, 36px)", fontWeight: 700, color: "#1a1a1a", margin: "0 0 20px" }}>
                Онлайн-курс для салонов готовится к запуску
              </h2>
              <p style={{ fontSize: 15, color: "#666", lineHeight: 1.8, margin: "0 0 32px" }}>
                Мы готовим отдельный онлайн-курс для салонов. В центре — команда, управляющий, администраторы, прайс, загрузка, сервис, стандарты, повторные визиты и экономика процедур.
              </p>
              <p style={{ fontSize: 14, color: "#999", margin: "0 0 32px", fontStyle: "italic" }}>
                Пока курс в разработке, основной активный формат — услуга «5 шагов к массажу, который приносит деньги».
              </p>
              <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
                <button onClick={scrollToForm}
                  style={{ padding: "13px 28px", borderRadius: 12, border: "none", cursor: "pointer", background: `linear-gradient(135deg, ${ACCENT}, ${ACCENT_DARK})`, color: "#fff", fontSize: 14, fontWeight: 700, fontFamily: "Montserrat, sans-serif" }}>
                  Оставить заявку на внедрение
                </button>
                <button onClick={() => { scrollToForm(); trackEvent("salon_platform_interest"); }}
                  style={{ padding: "13px 28px", borderRadius: 12, border: `1.5px solid ${ACCENT}`, cursor: "pointer", background: "transparent", color: ACCENT, fontSize: 14, fontWeight: 600, fontFamily: "Montserrat, sans-serif" }}>
                  Получить уведомление о курсе
                </button>
              </div>
            </div>
          </FadeIn>
        </div>
        <style>{`@media(max-width:600px){.salon-platform-pad{padding:32px 20px!important}}`}</style>
      </section>

      {/* Форма */}
      <section ref={formRef} style={{ padding: "80px 24px", background: "#fff" }}>
        <div style={{ maxWidth: 720, margin: "0 auto" }}>
          <FadeIn>
            <div style={{ textAlign: "center", marginBottom: 44 }}>
              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: ACCENT, marginBottom: 14 }}>Контакт</div>
              <h2 style={{ fontFamily: "Cormorant, serif", fontSize: "clamp(26px, 3.5vw, 42px)", fontWeight: 700, color: "#1a1a1a", margin: "0 0 14px" }}>
                Обсудить внедрение для салона
              </h2>
              <p style={{ fontSize: 15, color: "#888", lineHeight: 1.7 }}>
                Опишите задачу — мы подберём подходящий формат работы и обсудим детали.
              </p>
            </div>
          </FadeIn>
          <FadeIn delay={0.1}>
            <SalonForm />
          </FadeIn>
        </div>
      </section>

      <DokFooter />
    </div>
  );
}
