import { useRef } from "react";
import { Helmet } from "@/lib/helmet";
import DokNavbar from "@/components/DokNavbar";
import DokFooter from "@/components/DokFooter";
import SalonForm from "@/components/SalonForm";

const ACCENT = "hsl(185, 85%, 32%)";
const ACCENT_DARK = "hsl(185, 85%, 24%)";
const ACCENT_SHADOW = "hsla(185, 85%, 32%, 0.22)";
const BG = "#f8f8f6";

const STEPS = [
  {
    n: "01",
    title: "Старт без рисков",
    sub: "Договор",
    text: "Фиксируем цели, форматы работы и ожидаемые результаты. Салон точно понимает, что получает и за что платит. Никаких скрытых условий — только прозрачное партнёрство.",
    result: "Чёткие договорённости и план работы на руках.",
  },
  {
    n: "02",
    title: "Найдём, где салон теряет деньги",
    sub: "Оценка салона и персонала",
    text: "Проводим диагностику: смотрим компетенции каждого мастера, текущий прайс, загрузку и тайминг процедур. Считаем в деньгах, где и сколько салон недополучает прямо сейчас.",
    result: "Конкретные цифры: сколько теряет салон и почему.",
  },
  {
    n: "03",
    title: "Не курс, а результат",
    sub: "Внедрение под каждого мастера",
    text: "Обучаем конкретным техникам и протоколам с учётом физических данных, опыта и ресурса каждого специалиста. Цель — больше дохода при меньшем тайминге и меньшей нагрузке на тело мастера.",
    result: "Мастер зарабатывает больше, устаёт меньше, работает дольше.",
  },
  {
    n: "04",
    title: "База знаний всегда под рукой",
    sub: "Бесплатный доступ к онлайн-курсам",
    text: "Все мастера салона получают доступ к платформе Dok Диалог: протоколы, техники, разборы случаев. Обучение продолжается между очными встречами.",
    result: "Мастера растут системно, а не только во время тренингов.",
  },
  {
    n: "05",
    title: "Онлайн и офлайн поддержка",
    sub: "Дополнительные мероприятия",
    text: "По запросу проводим дополнительные вебинары, интенсивы и разборы работы мастеров. Поддерживаем рост команды на протяжении сотрудничества.",
    result: "Салон не остаётся один после внедрения.",
  },
];

const CHECKLIST = [
  "Компетенции мастеров",
  "Физический ресурс каждого специалиста",
  "Текущие техники и протоколы",
  "Прайс",
  "Тайминг процедур",
  "Загрузку кабинетов",
  "Повторные визиты",
  "Коммуникацию мастера",
  "Коммуникацию администратора",
  "Клиентский путь",
  "Точки потери денег",
];

export default function SalonPyatShagov() {
  const formRef = useRef<HTMLDivElement>(null);
  const scrollToForm = () => formRef.current?.scrollIntoView({ behavior: "smooth" });

  return (
    <div style={{ background: BG, minHeight: "100vh", fontFamily: "Montserrat, sans-serif" }}>
      <Helmet>
        <title>5 шагов к массажу, который приносит деньги — Dok Диалог для салонов</title>
        <meta name="description" content="Диагностика салона, оценка мастеров, внедрение протоколов, онлайн-база знаний и поддержка команды для развития массажного направления." />
      </Helmet>
      <DokNavbar />

      {/* Hero */}
      <section style={{ paddingTop: 120, paddingBottom: 72, maxWidth: 900, margin: "0 auto", padding: "120px 24px 72px" }}>
        <a href="/dlya-salonov" style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 13, color: "#999", textDecoration: "none", marginBottom: 32 }}>
          ← Dok Диалог для салонов
        </a>
        <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: ACCENT, marginBottom: 18 }}>
          Активная услуга
        </div>
        <h1 style={{ fontFamily: "Cormorant, serif", fontSize: "clamp(34px, 5vw, 60px)", fontWeight: 700, color: "#1a1a1a", lineHeight: 1.15, margin: "0 0 24px", maxWidth: 700 }}>
          5 шагов к массажу,<br />который приносит деньги
        </h1>
        <p style={{ fontSize: 17, color: "#555", lineHeight: 1.8, maxWidth: 580, margin: "0 0 36px" }}>
          Система для салонов, где массаж должен стать не случайной услугой в прайсе, а управляемым направлением с понятной экономикой, командой и повторными визитами.
        </p>
        <button onClick={scrollToForm}
          style={{ padding: "15px 36px", borderRadius: 12, border: "none", cursor: "pointer", background: `linear-gradient(135deg, ${ACCENT}, ${ACCENT_DARK})`, color: "#fff", fontSize: 15, fontWeight: 700, fontFamily: "Montserrat, sans-serif", boxShadow: `0 4px 20px ${ACCENT_SHADOW}` }}>
          Оставить заявку на разбор салона
        </button>
      </section>

      {/* Почему не обычное обучение */}
      <section style={{ background: "#fff", padding: "72px 24px" }}>
        <div style={{ maxWidth: 820, margin: "0 auto" }}>
          <h2 style={{ fontFamily: "Cormorant, serif", fontSize: "clamp(24px, 3vw, 38px)", fontWeight: 700, color: "#1a1a1a", margin: "0 0 24px" }}>
            Не тренинг ради тренинга, а внедрение в реальную работу салона
          </h2>
          <p style={{ fontSize: 16, color: "#555", lineHeight: 1.85 }}>
            Мы не просто показываем мастерам техники. Сначала смотрим салон, команду, прайс, загрузку, тайминг и потери. После этого внедряем подходящие протоколы под конкретных мастеров и задачи салона.
          </p>
        </div>
      </section>

      {/* 5 шагов подробно */}
      <section style={{ padding: "80px 24px" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 52 }}>
            <h2 style={{ fontFamily: "Cormorant, serif", fontSize: "clamp(26px, 3.5vw, 42px)", fontWeight: 700, color: "#1a1a1a", margin: 0 }}>
              Как устроены 5 шагов
            </h2>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
            {STEPS.map((s, i) => (
              <div key={s.n} style={{ background: "#fff", borderRadius: 20, padding: "36px 40px", border: "1px solid #e8e8e4" }} className="step-pad">
                <div style={{ display: "flex", gap: 24, alignItems: "flex-start" }} className="step-inner">
                  <div style={{ fontFamily: "Cormorant, serif", fontSize: 56, fontWeight: 700, color: `${ACCENT}33`, flexShrink: 0, lineHeight: 1, minWidth: 64 }}>{s.n}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: ACCENT, marginBottom: 6 }}>{s.sub}</div>
                    <div style={{ fontFamily: "Cormorant, serif", fontSize: 24, fontWeight: 700, color: "#1a1a1a", marginBottom: 14, lineHeight: 1.3 }}>{s.title}</div>
                    <p style={{ fontSize: 15, color: "#555", lineHeight: 1.8, margin: "0 0 20px" }}>{s.text}</p>
                    <div style={{ display: "flex", gap: 10, alignItems: "flex-start", padding: "14px 18px", background: `${ACCENT}08`, borderRadius: 10, border: `1px solid ${ACCENT}22` }}>
                      <span style={{ fontSize: 12, fontWeight: 700, color: ACCENT, textTransform: "uppercase", letterSpacing: "0.08em", flexShrink: 0 }}>Результат:</span>
                      <span style={{ fontSize: 14, color: "#444", lineHeight: 1.6 }}>{s.result}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <style>{`
          @media(max-width:600px){
            .step-pad{padding:24px 20px!important}
            .step-inner{flex-direction:column;gap:12px!important}
          }
        `}</style>
      </section>

      {/* Что анализируем */}
      <section style={{ background: "#fff", padding: "72px 24px" }}>
        <div style={{ maxWidth: 820, margin: "0 auto" }}>
          <h2 style={{ fontFamily: "Cormorant, serif", fontSize: "clamp(26px, 3.5vw, 40px)", fontWeight: 700, color: "#1a1a1a", margin: "0 0 36px" }}>
            Что анализируем в процессе
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 12 }}>
            {CHECKLIST.map(c => (
              <div key={c} style={{ display: "flex", gap: 10, alignItems: "flex-start", padding: "14px 16px", background: BG, borderRadius: 10, border: "1px solid #eee" }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={ACCENT} strokeWidth="2.5" style={{ flexShrink: 0, marginTop: 1 }}><path d="M20 6 9 17l-5-5" /></svg>
                <span style={{ fontSize: 13, color: "#333", lineHeight: 1.5 }}>{c}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Итоговый CTA */}
      <section style={{ padding: "72px 24px", background: "#1a2a2a" }}>
        <div style={{ maxWidth: 620, margin: "0 auto", textAlign: "center" }}>
          <h2 style={{ fontFamily: "Cormorant, serif", fontSize: "clamp(24px, 3vw, 38px)", fontWeight: 700, color: "#fff", margin: "0 0 24px", lineHeight: 1.3 }}>
            Хотите понять, где ваш салон теряет деньги на массажном направлении?
          </h2>
          <button onClick={scrollToForm}
            style={{ padding: "15px 36px", borderRadius: 12, border: "none", cursor: "pointer", background: `linear-gradient(135deg, ${ACCENT}, ${ACCENT_DARK})`, color: "#fff", fontSize: 15, fontWeight: 700, fontFamily: "Montserrat, sans-serif", boxShadow: `0 4px 20px ${ACCENT_SHADOW}` }}>
            Оставить заявку на разбор
          </button>
        </div>
      </section>

      {/* Форма */}
      <section ref={formRef} style={{ padding: "80px 24px", background: BG }}>
        <div style={{ maxWidth: 720, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 44 }}>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: ACCENT, marginBottom: 14 }}>Заявка</div>
            <h2 style={{ fontFamily: "Cormorant, serif", fontSize: "clamp(24px, 3vw, 38px)", fontWeight: 700, color: "#1a1a1a", margin: "0 0 14px" }}>
              Оставить заявку на разбор салона
            </h2>
            <p style={{ fontSize: 15, color: "#888", lineHeight: 1.7 }}>
              Мы свяжемся с вами и обсудим формат первой диагностической встречи.
            </p>
          </div>
          <SalonForm defaultFormat="5 шагов к массажу, который приносит деньги" />
        </div>
      </section>

      <DokFooter />
    </div>
  );
}
