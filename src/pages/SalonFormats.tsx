import { useRef } from "react";
import { Helmet } from "@/lib/helmet";
import DokNavbar from "@/components/DokNavbar";
import DokFooter from "@/components/DokFooter";
import SalonForm from "@/components/SalonForm";

const ACCENT = "hsl(185, 85%, 32%)";
const ACCENT_DARK = "hsl(185, 85%, 24%)";
const ACCENT_SHADOW = "hsla(185, 85%, 32%, 0.22)";
const BG = "#f8f8f6";

const FORMATS = [
  {
    id: "standart",
    label: "Формат 1",
    title: "Стандарт",
    price: "190 000 ₽",
    forWhom: "Небольшие студии, массажные кабинеты, wellness-пространства, салоны до 5 специалистов.",
    goal: "Создать системность, единый уровень сервиса и профессиональную подачу.",
    includes: [
      "Обучение персонала",
      "Мышление специалиста",
      "Ведение клиента",
      "Коммуникация",
      "Диагностика тела",
      "Удержание клиента",
      "Повторная запись",
      "Доступ на 6 месяцев (до 5 сотрудников)",
      "PDF-материалы и скрипты общения",
      "Стандарты коммуникации",
    ],
    results: ["Больше повторных записей", "Сильнее доверие клиентов", "Более уверенный персонал", "Рост рекомендаций"],
    cta: "Обсудить формат Стандарт",
    dark: false,
    featured: false,
  },
  {
    id: "premium",
    label: "Формат 2",
    title: "Премиум салон",
    price: "490 000 ₽",
    forWhom: "Салоны среднего уровня, wellness-центры, студии с амбициями роста.",
    goal: "Перевести салон из обычного формата в системный премиальный уровень.",
    includes: [
      "Всё из формата «Стандарт»",
      "Диагностика клиента онлайн",
      "Анализ мышления специалиста",
      "Конструктор ведения клиента",
      "Карта диагностики тела",
      "Анализ сервиса, коммуникации и атмосферы",
      "Анализ удержания клиентов",
      "4 стратегические онлайн-встречи",
      "Доступ на 12 месяцев (до 15 сотрудников)",
    ],
    results: ["Рост среднего чека", "Удержание клиентов", "Повышение статуса", "Сильная команда", "Единая система работы"],
    cta: "Обсудить формат Премиум салон",
    dark: true,
    featured: true,
  },
  {
    id: "business",
    label: "Формат 3",
    title: "Dok Диалог Business",
    price: "от 1 200 000 ₽",
    forWhom: "Премиальные салоны, сети, wellness-пространства высокого уровня.",
    goal: "Создать сильную премиальную систему салона.",
    includes: [
      "Полное внедрение системы",
      "Обучение персонала и диагностика",
      "Стандарты сервиса и премиальная подача",
      "Работа с VIP-клиентами",
      "Безлимитный доступ к онлайн-платформе",
      "Аналитика сотрудников",
      "6–12 очных встреч",
      "Индивидуальная настройка под салон и бренд",
      "Создание внутренних стандартов",
      "Персональная поддержка руководителя",
    ],
    results: ["Сильный бренд", "Высокий уровень сервиса", "Стабильная база клиентов", "Рост рекомендаций", "Более дорогой сегмент клиентов"],
    cta: "Получить индивидуальное предложение",
    dark: false,
    featured: false,
  },
];

const EXTRA = [
  { title: "Аудит салона", price: "от 50 000 ₽", items: ["Анализ сервиса", "Анализ атмосферы", "Анализ коммуникации", "Выявление слабых зон", "Рекомендации"] },
  { title: "Обучение администраторов", price: "от 90 000 ₽", items: ["Коммуникация и запись клиента", "Удержание и премиальный сервис", "Работа с конфликтами"] },
  { title: "Настройка позиционирования", price: "от 150 000 ₽", items: ["Подача салона и визуал", "Тексты и атмосфера", "Премиальное позиционирование"] },
  { title: "Корпоративный доступ к платформе", price: "от 39 000 ₽ / мес", items: ["Доступ к инструментам", "Обновления и аналитика", "База знаний"] },
];

export default function SalonFormats() {
  const formRef = useRef<HTMLDivElement>(null);
  const scrollToForm = (format?: string) => {
    formRef.current?.scrollIntoView({ behavior: "smooth" });
    type WY = Window & { ym?: (id: unknown, t: string, n: string) => void };
    if ((window as WY).ym) (window as WY).ym!(undefined, "reachGoal", "salon_format_click");
    if (format) {
      setTimeout(() => {
        const sel = formRef.current?.querySelector("select");
        if (sel) { sel.value = format; sel.dispatchEvent(new Event("change", { bubbles: true })); }
      }, 600);
    }
  };

  return (
    <div style={{ background: BG, minHeight: "100vh", fontFamily: "Montserrat, sans-serif" }}>
      <Helmet>
        <title>Форматы внедрения Dok Диалог для салонов</title>
        <meta name="description" content="Форматы работы для салонов: Стандарт, Премиум салон, Dok Диалог Business, аудит, обучение администраторов и корпоративный доступ к платформе." />
      </Helmet>
      <DokNavbar />

      {/* Hero */}
      <section style={{ paddingTop: 120, paddingBottom: 72, maxWidth: 900, margin: "0 auto", padding: "120px 24px 72px" }}>
        <a href="/dlya-salonov" style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 13, color: "#999", textDecoration: "none", marginBottom: 32 }}>
          ← Dok Диалог для салонов
        </a>
        <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: ACCENT, marginBottom: 18 }}>
          Форматы внедрения
        </div>
        <h1 style={{ fontFamily: "Cormorant, serif", fontSize: "clamp(34px, 5vw, 60px)", fontWeight: 700, color: "#1a1a1a", lineHeight: 1.15, margin: "0 0 24px", maxWidth: 720 }}>
          Форматы внедрения<br />Dok Диалог для салонов
        </h1>
        <p style={{ fontSize: 17, color: "#555", lineHeight: 1.8, maxWidth: 580, margin: 0 }}>
          От базовой систематизации работы мастеров до полного внедрения премиальной системы сервиса, удержания и клиентского опыта.
        </p>
      </section>

      {/* Форматы */}
      <section style={{ padding: "0 24px 80px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 24 }} className="formats-grid">
          {FORMATS.map(f => (
            <div key={f.id} style={{
              background: f.dark ? "#1a2a2a" : "#fff",
              borderRadius: 20, padding: "36px 32px",
              border: f.featured ? `2px solid ${ACCENT}` : "1px solid #eee",
              position: "relative", display: "flex", flexDirection: "column",
            }} className="format-pad">
              {f.featured && (
                <div style={{ position: "absolute", top: -14, left: 32, background: ACCENT, color: "#fff", fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", padding: "4px 14px", borderRadius: 20 }}>
                  Популярный выбор
                </div>
              )}
              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: f.dark ? "#888" : "#aaa", marginBottom: 8 }}>{f.label}</div>
              <div style={{ fontFamily: "Cormorant, serif", fontSize: 30, fontWeight: 700, color: f.dark ? "#fff" : "#1a1a1a", marginBottom: 6 }}>{f.title}</div>
              <div style={{ fontSize: 22, fontWeight: 700, color: ACCENT, marginBottom: 16 }}>{f.price}</div>
              <p style={{ fontSize: 13, color: f.dark ? "#aaa" : "#888", lineHeight: 1.65, marginBottom: 20 }}>{f.forWhom}</p>

              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: f.dark ? "#666" : "#bbb", marginBottom: 12 }}>Что входит</div>
              <div style={{ flex: 1, marginBottom: 24 }}>
                {f.includes.map(item => (
                  <div key={item} style={{ display: "flex", gap: 8, alignItems: "flex-start", marginBottom: 8 }}>
                    <div style={{ width: 5, height: 5, borderRadius: "50%", background: ACCENT, flexShrink: 0, marginTop: 7 }} />
                    <span style={{ fontSize: 13, color: f.dark ? "#ccc" : "#555", lineHeight: 1.5 }}>{item}</span>
                  </div>
                ))}
              </div>

              <div style={{ padding: "14px 16px", background: f.dark ? "rgba(255,255,255,0.05)" : BG, borderRadius: 12, marginBottom: 20, border: f.dark ? "1px solid rgba(255,255,255,0.08)" : "1px solid #eee" }}>
                <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: ACCENT, marginBottom: 8 }}>Результат</div>
                {f.results.map(r => (
                  <div key={r} style={{ fontSize: 13, color: f.dark ? "#bbb" : "#555", lineHeight: 1.5, marginBottom: 4 }}>— {r}</div>
                ))}
              </div>

              <div style={{ fontSize: 13, color: f.dark ? "#888" : "#999", fontStyle: "italic", marginBottom: 20, lineHeight: 1.6 }}>{f.goal}</div>

              <button onClick={() => scrollToForm(f.id === "standart" ? "Формат Стандарт" : f.id === "premium" ? "Формат Премиум салон" : "Dok Диалог Business")}
                style={{ width: "100%", padding: "14px", borderRadius: 12, border: f.dark ? "none" : `1.5px solid ${ACCENT}`, cursor: "pointer", background: f.dark ? `linear-gradient(135deg, ${ACCENT}, ${ACCENT_DARK})` : "transparent", color: f.dark ? "#fff" : ACCENT, fontSize: 14, fontWeight: 700, fontFamily: "Montserrat, sans-serif", boxShadow: f.dark ? `0 4px 20px ${ACCENT_SHADOW}` : "none" }}>
                {f.cta}
              </button>
            </div>
          ))}
        </div>
        <style>{`
          @media(max-width:640px){
            .formats-grid{grid-template-columns:1fr!important}
            .format-pad{padding:28px 20px!important}
          }
        `}</style>
      </section>

      {/* Дополнительные услуги */}
      <section style={{ background: "#fff", padding: "72px 24px" }}>
        <div style={{ maxWidth: 1000, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 44 }}>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: ACCENT, marginBottom: 14 }}>Дополнительно</div>
            <h2 style={{ fontFamily: "Cormorant, serif", fontSize: "clamp(24px, 3vw, 38px)", fontWeight: 700, color: "#1a1a1a", margin: 0 }}>
              Отдельные услуги
            </h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 20 }}>
            {EXTRA.map(ex => (
              <div key={ex.title} style={{ background: BG, borderRadius: 16, padding: "26px 22px", border: "1px solid #eee" }}>
                <div style={{ fontWeight: 700, fontSize: 15, color: "#1a1a1a", marginBottom: 6, lineHeight: 1.4 }}>{ex.title}</div>
                <div style={{ fontSize: 16, fontWeight: 700, color: ACCENT, marginBottom: 16 }}>{ex.price}</div>
                {ex.items.map(it => (
                  <div key={it} style={{ display: "flex", gap: 8, alignItems: "flex-start", marginBottom: 8 }}>
                    <div style={{ width: 5, height: 5, borderRadius: "50%", background: ACCENT, flexShrink: 0, marginTop: 7 }} />
                    <span style={{ fontSize: 13, color: "#666", lineHeight: 1.5 }}>{it}</span>
                  </div>
                ))}
                <button onClick={() => scrollToForm("Аудит салона")} style={{ marginTop: 16, width: "100%", padding: "11px", borderRadius: 10, border: `1.5px solid ${ACCENT}`, cursor: "pointer", background: "transparent", color: ACCENT, fontSize: 13, fontWeight: 600, fontFamily: "Montserrat, sans-serif" }}>
                  Обсудить
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Форма */}
      <section ref={formRef} style={{ padding: "80px 24px", background: BG }}>
        <div style={{ maxWidth: 720, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 44 }}>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: ACCENT, marginBottom: 14 }}>Контакт</div>
            <h2 style={{ fontFamily: "Cormorant, serif", fontSize: "clamp(24px, 3vw, 38px)", fontWeight: 700, color: "#1a1a1a", margin: "0 0 14px" }}>
              Обсудить формат внедрения
            </h2>
            <p style={{ fontSize: 15, color: "#888", lineHeight: 1.7 }}>
              Оставьте заявку — обсудим подходящий формат и подготовим предложение под ваш салон.
            </p>
          </div>
          <SalonForm />
        </div>
      </section>

      <DokFooter />
    </div>
  );
}
