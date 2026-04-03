import { useState } from "react";
import DokNavbar from "@/components/DokNavbar";
import DokFooter from "@/components/DokFooter";
import Icon from "@/components/ui/icon";

const ACCENT = "hsl(185, 85%, 32%)";
const ACCENT_DARK = "hsl(185, 85%, 26%)";
const ACCENT_SHADOW = "hsla(185, 85%, 32%, 0.25)";
const BG = "#f8f8f6";
const COURSE_URL = "https://school.brossok.ru/training/view/-laquo-massaghist-2-0-sozdanie-i-prodvighenie-lichnogo-brenda-raquo-";

const HERO_IMG = "https://cdn.poehali.dev/projects/10f61e56-9821-40f3-b705-3590ddaffd08/files/217850e4-84f3-47e2-bb32-208b4fdff715.jpg";

const REVIEWS = [
  {
    name: "Ксения М.",
    text: "До курса у меня было 3–4 клиента в месяц. Через 6 недель — стабильная запись на 3 недели вперёд. Теперь я планирую доход, а не жду «повезёт или нет».",
    img: "https://cdn.poehali.dev/projects/10f61e56-9821-40f3-b705-3590ddaffd08/files/86c97297-9734-4b88-a25c-081613ef18ff.jpg",
  },
  {
    name: "Артём В.",
    text: "Скептически относился к «маркетингу для массажистов». Но курс — это конкретные шаги, а не теория. Первых клиентов получил ещё в процессе обучения.",
    img: "https://cdn.poehali.dev/projects/10f61e56-9821-40f3-b705-3590ddaffd08/files/61d79a41-ee5a-422e-b4d7-8f401bd382d4.jpg",
  },
];

const MODULES = [
  {
    title: "Модуль 1: Система привлечения клиентов",
    lessons: ["Основные каналы для массажиста", "Реальные примеры и кейсы"],
  },
  {
    title: "Модуль 2: Система записи",
    lessons: ["Организация расписания", "Автоматизация и упрощение процесса"],
  },
  {
    title: "Модуль 3: Общение с клиентом",
    lessons: ["Готовые скрипты для переписки и звонков", "Работа с возражениями"],
  },
  {
    title: "Модуль 4: Удержание клиентов",
    lessons: ["Повторные продажи и абонементы", "Рекомендации и программы лояльности"],
  },
  {
    title: "Модуль 5: Практика",
    lessons: ["Планирование первого месяца", "Сборка системы «от 0 до стабильной записи»"],
  },
];

const FAQS = [
  {
    q: "Сколько времени до первых клиентов?",
    a: "При активном внедрении — первые результаты уже в течение 2–4 недель. Многие студенты получают клиентов ещё в процессе обучения.",
  },
  {
    q: "Можно ли использовать другие каналы?",
    a: "Да. Курс даёт универсальную систему, которую легко адаптировать под любые каналы — соцсети, сарафанное радио, онлайн-площадки.",
  },
  {
    q: "Подойдёт новичку?",
    a: "Да, курс создан для тех, кто начинает с нуля. Пошаговая система подходит даже без опыта в продвижении.",
  },
  {
    q: "Можно ли совмещать с другими курсами?",
    a: "Да. Этот курс отлично дополняет любые технические курсы по массажу — даёт систему, чтобы навыки приносили доход.",
  },
];

const h2style: React.CSSProperties = {
  fontFamily: "Cormorant, serif",
  fontSize: "clamp(26px, 3.5vw, 38px)",
  fontWeight: 700,
  margin: "0 0 36px",
  color: "#1a1a1a",
};

function BtnStart({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  const [h, setH] = useState(false);
  return (
    <a href={COURSE_URL} target="_blank" rel="noopener noreferrer"
      onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)}
      style={{
        display: "inline-block", textDecoration: "none",
        background: h ? ACCENT_DARK : ACCENT, color: "#fff",
        borderRadius: 12, padding: "14px 32px", fontSize: 15, fontWeight: 700,
        cursor: "pointer", fontFamily: "Montserrat, sans-serif",
        boxShadow: `0 6px 20px ${ACCENT_SHADOW}`, transition: "all 0.2s",
        transform: h ? "translateY(-2px)" : "translateY(0)", ...style,
      }}
    >{children}</a>
  );
}

function AccordionItem({ title, children }: { title: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ borderBottom: "1px solid #e8e8e4", overflow: "hidden" }}>
      <button onClick={() => setOpen(!open)} style={{
        width: "100%", background: "none", border: "none", padding: "18px 0",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        cursor: "pointer", fontFamily: "Montserrat, sans-serif", fontSize: 15,
        fontWeight: 600, color: "#1a1a1a", textAlign: "left", gap: 12,
      }}>
        {title}
        <span style={{ color: ACCENT, flexShrink: 0, transition: "transform 0.25s", transform: open ? "rotate(45deg)" : "rotate(0deg)", fontSize: 22, lineHeight: 1 }}>+</span>
      </button>
      <div style={{ maxHeight: open ? 400 : 0, overflow: "hidden", transition: "max-height 0.3s ease" }}>
        <div style={{ paddingBottom: 18 }}>{children}</div>
      </div>
    </div>
  );
}

function CtaBar() {
  return (
    <div style={{ margin: "60px 0 0", background: "#fff", borderTop: "1px solid #e8e8e4", borderBottom: "1px solid #e8e8e4" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "28px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
        <div>
          <div style={{ fontWeight: 700, fontSize: 17 }}>Массажист с потоком клиентов</div>
          <div style={{ color: "#999", fontSize: 13 }}>От 0 до стабильной записи</div>
        </div>
        <BtnStart>Начать бесплатно</BtnStart>
      </div>
    </div>
  );
}

export default function CoursePotok() {
  return (
    <div style={{ background: BG, minHeight: "100vh", fontFamily: "Montserrat, sans-serif", color: "#1a1a1a" }}>
      <DokNavbar />

      {/* ── 1. HERO ── */}
      <section style={{ paddingTop: 80 }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "60px 24px 0", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 60, alignItems: "center" }} className="cpt-hero-grid">
          <div>
            <a href="/catalog/private" style={{ display: "inline-flex", alignItems: "center", gap: 6, color: "#999", fontSize: 13, textDecoration: "none", marginBottom: 24 }}
              onMouseEnter={e => (e.currentTarget.style.color = ACCENT)}
              onMouseLeave={e => (e.currentTarget.style.color = "#999")}
            >
              <Icon name="ArrowLeft" size={13} />
              Все курсы
            </a>
            <div style={{ display: "inline-block", background: `${ACCENT}15`, color: ACCENT, fontSize: 12, fontWeight: 700, padding: "4px 12px", borderRadius: 20, marginBottom: 16, letterSpacing: 0.5 }}>
              ДОХОД / КЛИЕНТЫ
            </div>
            <h1 style={{ fontFamily: "Cormorant, serif", fontSize: "clamp(28px, 4vw, 46px)", fontWeight: 700, lineHeight: 1.15, margin: "0 0 20px" }}>
              Массажист с потоком клиентов: от 0 до стабильной записи
            </h1>
            <p style={{ fontSize: 17, color: "#555", lineHeight: 1.7, margin: "0 0 28px" }}>
              Научитесь привлекать клиентов, создавать стабильный доход и уверенно развивать частную практику
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 16, marginBottom: 36 }}>
              {[
                { icon: "Users", text: "Стратегия привлечения клиентов" },
                { icon: "CalendarCheck", text: "Система для стабильной записи" },
                { icon: "TrendingUp", text: "Повышение дохода без постоянного стресса" },
              ].map(({ icon, text }) => (
                <div key={text} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 14, color: "#444" }}>
                  <span style={{ color: ACCENT }}><Icon name={icon} size={16} /></span>
                  {text}
                </div>
              ))}
            </div>
            <BtnStart style={{ padding: "16px 40px", fontSize: 16 }}>Начать бесплатно</BtnStart>
          </div>
          <div style={{ borderRadius: 20, overflow: "hidden", boxShadow: "0 20px 60px rgba(0,0,0,0.15)" }}>
            <img src={HERO_IMG} alt="Массажист с потоком клиентов" style={{ width: "100%", height: 440, objectFit: "cover", display: "block" }} />
          </div>
        </div>
      </section>

      {/* ── 2. ПРОБЛЕМА ── */}
      <section style={{ padding: "80px 0 0" }}>
        <div style={{ maxWidth: 1000, margin: "0 auto", padding: "0 24px" }}>
          <h2 style={h2style}>Знакомо?</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 16 }} className="cpt-2col">
            {[
              { icon: "UserX", text: "Нет постоянных клиентов, запись пустая" },
              { icon: "Shuffle", text: "Доход зависит от «счастливого случая»" },
              { icon: "BarChart2", text: "Сложно планировать и строить рост" },
              { icon: "HelpCircle", text: "Нет системного подхода к продвижению" },
            ].map(({ icon, text }) => (
              <div key={text} style={{
                background: "#fff", border: "1px solid #e8e8e4", borderRadius: 14,
                padding: "20px 24px", display: "flex", alignItems: "center", gap: 14,
                fontSize: 15, color: "#333",
              }}>
                <div style={{ width: 40, height: 40, borderRadius: 10, background: "#fff3f3", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <Icon name={icon} size={20} style={{ color: "#e05050" }} />
                </div>
                {text}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 3. РЕШЕНИЕ ── */}
      <section style={{ padding: "80px 0 0" }}>
        <div style={{ maxWidth: 900, margin: "0 auto", padding: "0 24px" }}>
          <div style={{ background: "#fff", border: "1px solid #e8e8e4", borderRadius: 20, padding: "44px 48px", boxShadow: "0 4px 24px rgba(0,0,0,0.06)" }} className="cpt-solution-pad">
            <div style={{ fontSize: 12, fontWeight: 700, color: ACCENT, textTransform: "uppercase", letterSpacing: 1, marginBottom: 12 }}>Решение</div>
            <h2 style={{ fontFamily: "Cormorant, serif", fontSize: "clamp(22px, 3vw, 32px)", fontWeight: 700, margin: "0 0 20px", color: "#1a1a1a" }}>
              Курс даёт готовую систему для роста практики:
            </h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 14 }} className="cpt-2col">
              {[
                "Пошаговую стратегию привлечения клиентов",
                "Систему записи и повторных продаж",
                "Практические инструменты продвижения",
                "Уверенность в росте частной практики",
              ].map((item) => (
                <div key={item} style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 15, color: "#333" }}>
                  <span style={{ width: 24, height: 24, borderRadius: "50%", background: `${ACCENT}18`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontSize: 12, color: ACCENT, fontWeight: 700 }}>✓</span>
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── 4. ЧТО ПОЛУЧИТЕ ── */}
      <section style={{ padding: "80px 0 0" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 24px" }}>
          <h2 style={h2style}>Что вы получите</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }} className="cpt-3col">
            {[
              { icon: "GitBranch", text: "Структуру работы с клиентами" },
              { icon: "Radio", text: "Каналы привлечения новых клиентов" },
              { icon: "MessageSquare", text: "Готовые скрипты для общения" },
              { icon: "CalendarDays", text: "Пошаговые инструкции по расписанию" },
              { icon: "Repeat", text: "Методы удержания и возврата клиентов" },
              { icon: "TrendingUp", text: "Систему стабильного и растущего дохода" },
            ].map(({ icon, text }) => (
              <div key={text} style={{
                background: "#fff", borderRadius: 14, padding: "24px 20px",
                display: "flex", alignItems: "flex-start", gap: 14,
                border: "1px solid #e8e8e4", boxShadow: "0 2px 12px rgba(0,0,0,0.05)",
              }}>
                <div style={{ width: 40, height: 40, borderRadius: 10, background: `${ACCENT}15`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <Icon name={icon} size={20} style={{ color: ACCENT }} />
                </div>
                <span style={{ fontSize: 14, fontWeight: 500, lineHeight: 1.5, color: "#333" }}>{text}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CtaBar />

      {/* ── 5. ДЛЯ КОГО ── */}
      <section style={{ padding: "80px 0 0" }}>
        <div style={{ maxWidth: 900, margin: "0 auto", padding: "0 24px" }}>
          <h2 style={h2style}>Для кого этот курс</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 16 }} className="cpt-2col">
            {[
              { icon: "Baby", text: "Новички и начинающие массажисты" },
              { icon: "UserX", text: "Мастера без стабильного потока клиентов" },
              { icon: "TrendingUp", text: "Специалисты, желающие повысить доход" },
              { icon: "LayoutDashboard", text: "Те, кто хочет системно развивать практику" },
            ].map(({ icon, text }) => (
              <div key={text} style={{
                background: "#fff", border: "1px solid #e8e8e4", borderRadius: 14,
                padding: "20px 24px", display: "flex", alignItems: "center", gap: 14,
                fontSize: 15, fontWeight: 500, color: "#333",
              }}>
                <Icon name={icon} size={22} style={{ color: ACCENT, flexShrink: 0 }} />
                {text}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 6. РЕЗУЛЬТАТ ── */}
      <section style={{ padding: "80px 0 0" }}>
        <div style={{ maxWidth: 900, margin: "0 auto", padding: "0 24px" }}>
          <div style={{
            background: `linear-gradient(135deg, ${ACCENT}, hsl(185,85%,22%))`,
            borderRadius: 20, padding: "48px", color: "#fff",
          }} className="cpt-result-pad">
            <h2 style={{ fontFamily: "Cormorant, serif", fontSize: "clamp(24px, 3vw, 36px)", fontWeight: 700, margin: "0 0 8px" }}>
              После курса вы:
            </h2>
            <p style={{ opacity: 0.75, margin: "0 0 32px", fontSize: 15 }}>Конкретный результат, который вы получите</p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }} className="cpt-2col">
              {[
                "Получаете первых клиентов за короткий срок",
                "Создаёте систему постоянной записи",
                "Планируете доход на месяцы вперёд",
                "Уверенно развиваете частную практику",
              ].map((item) => (
                <div key={item} style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 15, fontWeight: 500 }}>
                  <span style={{ width: 24, height: 24, borderRadius: "50%", background: "rgba(255,255,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontSize: 12 }}>✓</span>
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── 7. ПРОГРАММА ── */}
      <section style={{ padding: "80px 0 0" }}>
        <div style={{ maxWidth: 800, margin: "0 auto", padding: "0 24px" }}>
          <h2 style={h2style}>Программа курса</h2>
          <div style={{ background: "#fff", borderRadius: 18, border: "1px solid #e8e8e4", padding: "8px 32px", boxShadow: "0 2px 16px rgba(0,0,0,0.05)" }}>
            {MODULES.map((m, i) => (
              <AccordionItem key={i} title={m.title}>
                <ul style={{ margin: 0, padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 8 }}>
                  {m.lessons.map((l) => (
                    <li key={l} style={{ display: "flex", gap: 10, alignItems: "center", fontSize: 14, color: "#555" }}>
                      <Icon name="PlayCircle" size={15} style={{ color: ACCENT, flexShrink: 0 }} />
                      {l}
                    </li>
                  ))}
                </ul>
              </AccordionItem>
            ))}
          </div>
        </div>
      </section>

      {/* ── 8. ФОРМАТ ── */}
      <section style={{ padding: "80px 0 0" }}>
        <div style={{ maxWidth: 1000, margin: "0 auto", padding: "0 24px" }}>
          <h2 style={h2style}>Формат обучения</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 16 }} className="cpt-5col">
            {[
              { icon: "Wifi", text: "Онлайн 24/7" },
              { icon: "Video", text: "Видео-уроки" },
              { icon: "FileText", text: "Пошаговые инструкции" },
              { icon: "BookOpen", text: "Домашние задания" },
              { icon: "Award", text: "Сертификат" },
            ].map(({ icon, text }) => (
              <div key={text} style={{
                background: "#fff", border: "1px solid #e8e8e4", borderRadius: 14,
                padding: "24px 16px", display: "flex", flexDirection: "column",
                alignItems: "center", gap: 12, textAlign: "center",
              }}>
                <div style={{ width: 48, height: 48, borderRadius: 12, background: `${ACCENT}15`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Icon name={icon} size={22} style={{ color: ACCENT }} />
                </div>
                <span style={{ fontSize: 13, fontWeight: 500, color: "#444", lineHeight: 1.4 }}>{text}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CtaBar />

      {/* ── 9. ОТЗЫВЫ ── */}
      <section style={{ padding: "80px 0 0" }}>
        <div style={{ maxWidth: 900, margin: "0 auto", padding: "0 24px" }}>
          <h2 style={h2style}>Результаты студентов</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 24 }} className="cpt-2col">
            {REVIEWS.map((r) => (
              <div key={r.name} style={{
                background: "#fff", border: "1px solid #e8e8e4", borderRadius: 18,
                padding: "28px", boxShadow: "0 2px 16px rgba(0,0,0,0.05)",
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 16 }}>
                  <img src={r.img} alt={r.name} style={{ width: 52, height: 52, borderRadius: "50%", objectFit: "cover" }} />
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 15 }}>{r.name}</div>
                    <div style={{ color: "#f59e0b", fontSize: 14 }}>★★★★★</div>
                  </div>
                </div>
                <p style={{ fontSize: 14, color: "#555", lineHeight: 1.65, margin: 0 }}>{r.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 10. СТОИМОСТЬ / ТАРИФЫ ── */}
      <section style={{ padding: "80px 0 0" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 24px" }}>
          <h2 style={{ ...h2style, textAlign: "center" }}>Выберите тариф</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 20 }} className="cpt-4col">

            {/* Бесплатный */}
            <div style={{ background: "#fff", border: "1px solid #e8e8e4", borderRadius: 20, padding: "32px 24px", display: "flex", flexDirection: "column", boxShadow: "0 2px 16px rgba(0,0,0,0.05)" }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: "#22c55e", textTransform: "uppercase", letterSpacing: 1, marginBottom: 10 }}>Бесплатный</div>
              <div style={{ fontFamily: "Cormorant, serif", fontSize: 36, fontWeight: 700, color: "#1a1a1a", lineHeight: 1, marginBottom: 4 }}>0 ₽</div>
              <div style={{ fontSize: 13, color: "#999", marginBottom: 20 }}>Навсегда бесплатно</div>
              <div style={{ fontWeight: 600, fontSize: 13, color: "#333", marginBottom: 10 }}>«Массажист 2.0: Создание и Продвижение Личного Бренда»</div>
              <p style={{ fontSize: 13, color: "#666", lineHeight: 1.55, margin: "0 0 20px", flex: 1 }}>Базовые знания для тех, кто только начинает. Введение в интернет-маркетинг и бизнес-маркетинг.</p>
              <a href={COURSE_URL} target="_blank" rel="noopener noreferrer" style={{ display: "block", textAlign: "center", background: "#22c55e", color: "#fff", borderRadius: 10, padding: "11px 16px", fontSize: 13, fontWeight: 700, textDecoration: "none", transition: "opacity 0.2s" }}
                onMouseEnter={e => (e.currentTarget as HTMLAnchorElement).style.opacity = "0.85"}
                onMouseLeave={e => (e.currentTarget as HTMLAnchorElement).style.opacity = "1"}
              >Начать бесплатно</a>
            </div>

            {/* Старт */}
            <div style={{ background: "#fff", border: "1px solid #e8e8e4", borderRadius: 20, padding: "32px 24px", display: "flex", flexDirection: "column", boxShadow: "0 2px 16px rgba(0,0,0,0.05)" }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: ACCENT, textTransform: "uppercase", letterSpacing: 1, marginBottom: 10 }}>Стартовый</div>
              <div style={{ fontFamily: "Cormorant, serif", fontSize: 36, fontWeight: 700, color: "#1a1a1a", lineHeight: 1, marginBottom: 4 }}>4 900 ₽</div>
              <div style={{ fontSize: 13, color: "#999", marginBottom: 20 }}>Полная оплата</div>
              <div style={{ fontWeight: 600, fontSize: 13, color: "#333", marginBottom: 10 }}>«Массажист 2.0: Создание и Продвижение Личного Бренда»</div>
              <p style={{ fontSize: 13, color: "#666", lineHeight: 1.55, margin: "0 0 20px", flex: 1 }}>Комплексные знания о бизнес-маркетинге, анализ состояния бизнеса и стратегии для привлечения клиентов.</p>
              <a href="https://school.brossok.ru/buy/11" target="_blank" rel="noopener noreferrer" style={{ display: "block", textAlign: "center", background: ACCENT, color: "#fff", borderRadius: 10, padding: "11px 16px", fontSize: 13, fontWeight: 700, textDecoration: "none", transition: "opacity 0.2s" }}
                onMouseEnter={e => (e.currentTarget as HTMLAnchorElement).style.opacity = "0.85"}
                onMouseLeave={e => (e.currentTarget as HTMLAnchorElement).style.opacity = "1"}
              >Купить курс</a>
            </div>

            {/* Профи */}
            <div style={{ background: "#fff", border: `2px solid ${ACCENT}`, borderRadius: 20, padding: "32px 24px", display: "flex", flexDirection: "column", boxShadow: `0 8px 32px ${ACCENT}22`, position: "relative" }}>
              <div style={{ position: "absolute", top: -12, left: "50%", transform: "translateX(-50%)", background: ACCENT, color: "#fff", fontSize: 11, fontWeight: 700, padding: "4px 14px", borderRadius: 20, whiteSpace: "nowrap" }}>Популярный</div>
              <div style={{ fontSize: 11, fontWeight: 700, color: "#f59e0b", textTransform: "uppercase", letterSpacing: 1, marginBottom: 10 }}>Профи</div>
              <div style={{ fontFamily: "Cormorant, serif", fontSize: 36, fontWeight: 700, color: "#1a1a1a", lineHeight: 1, marginBottom: 4 }}>14 900 ₽</div>
              <div style={{ fontSize: 13, color: "#999", marginBottom: 20 }}>Полная оплата</div>
              <div style={{ fontWeight: 600, fontSize: 13, color: "#333", marginBottom: 10 }}>«Массажный Бизнес 2.0: Продвижение и Оптимизация»</div>
              <p style={{ fontSize: 13, color: "#666", lineHeight: 1.55, margin: "0 0 20px", flex: 1 }}>SEO, контекстная реклама, Яндекс Директ, VK, Telegram, воронки продаж и медиапланирование.</p>
              <a href="https://school.brossok.ru/buy/12" target="_blank" rel="noopener noreferrer" style={{ display: "block", textAlign: "center", background: ACCENT, color: "#fff", borderRadius: 10, padding: "11px 16px", fontSize: 13, fontWeight: 700, textDecoration: "none", transition: "opacity 0.2s" }}
                onMouseEnter={e => (e.currentTarget as HTMLAnchorElement).style.opacity = "0.85"}
                onMouseLeave={e => (e.currentTarget as HTMLAnchorElement).style.opacity = "1"}
              >Купить курс</a>
            </div>

            {/* Эксперт */}
            <div style={{ background: "#fff", border: "1px solid #e8e8e4", borderRadius: 20, padding: "32px 24px", display: "flex", flexDirection: "column", boxShadow: "0 2px 16px rgba(0,0,0,0.05)" }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: "#ef4444", textTransform: "uppercase", letterSpacing: 1, marginBottom: 10 }}>Эксперт</div>
              <div style={{ fontFamily: "Cormorant, serif", fontSize: 36, fontWeight: 700, color: "#1a1a1a", lineHeight: 1, marginBottom: 4 }}>34 900 ₽</div>
              <div style={{ fontSize: 13, color: "#999", marginBottom: 20 }}>Полная оплата</div>
              <div style={{ fontWeight: 600, fontSize: 13, color: "#333", marginBottom: 10 }}>«Маркетинг: От Основ до Эксперта»</div>
              <p style={{ fontSize: 13, color: "#666", lineHeight: 1.55, margin: "0 0 20px", flex: 1 }}>Аудит бизнеса, таргетированная реклама, SEO, управление рекламой — полный арсенал для роста и масштабирования.</p>
              <a href="https://school.brossok.ru/buy/13" target="_blank" rel="noopener noreferrer" style={{ display: "block", textAlign: "center", background: ACCENT, color: "#fff", borderRadius: 10, padding: "11px 16px", fontSize: 13, fontWeight: 700, textDecoration: "none", transition: "opacity 0.2s" }}
                onMouseEnter={e => (e.currentTarget as HTMLAnchorElement).style.opacity = "0.85"}
                onMouseLeave={e => (e.currentTarget as HTMLAnchorElement).style.opacity = "1"}
              >Купить курс</a>
            </div>

          </div>
        </div>
      </section>

      {/* ── 11. СНЯТИЕ ВОЗРАЖЕНИЙ ── */}
      <section style={{ padding: "80px 0 0" }}>
        <div style={{ maxWidth: 900, margin: "0 auto", padding: "0 24px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }} className="cpt-4col">
            {[
              { icon: "Baby", title: "Подходит новичкам", text: "Система создана с нуля под начинающих" },
              { icon: "Zap", title: "Внедряйте сразу", text: "Первые шаги применяются уже в процессе" },
              { icon: "GraduationCap", title: "Без медобразования", text: "Курс про бизнес, а не про медицину" },
              { icon: "ShieldCheck", title: "Проверено практикой", text: "Система основана на реальных результатах студентов" },
            ].map(({ icon, title, text }) => (
              <div key={title} style={{
                background: "#fff", border: "1px solid #e8e8e4", borderRadius: 16,
                padding: "24px 20px", textAlign: "center",
              }}>
                <div style={{ width: 48, height: 48, borderRadius: 12, background: `${ACCENT}15`, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 14px" }}>
                  <Icon name={icon} size={22} style={{ color: ACCENT }} />
                </div>
                <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 6 }}>{title}</div>
                <div style={{ fontSize: 12, color: "#666", lineHeight: 1.5 }}>{text}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 12. FAQ ── */}
      <section style={{ padding: "80px 0 0" }}>
        <div style={{ maxWidth: 800, margin: "0 auto", padding: "0 24px" }}>
          <h2 style={h2style}>Частые вопросы</h2>
          <div style={{ background: "#fff", borderRadius: 18, border: "1px solid #e8e8e4", padding: "8px 32px", boxShadow: "0 2px 16px rgba(0,0,0,0.05)" }}>
            {FAQS.map((f, i) => (
              <AccordionItem key={i} title={f.q}>
                <p style={{ margin: 0, fontSize: 14, color: "#555", lineHeight: 1.65 }}>{f.a}</p>
              </AccordionItem>
            ))}
          </div>
        </div>
      </section>

      {/* ── 13. ФИНАЛЬНЫЙ CTA ── */}
      <section style={{ padding: "80px 0" }}>
        <div style={{ maxWidth: 700, margin: "0 auto", padding: "0 24px", textAlign: "center" }}>
          <h2 style={{ fontFamily: "Cormorant, serif", fontSize: "clamp(26px, 4vw, 42px)", fontWeight: 700, margin: "0 0 16px", lineHeight: 1.2 }}>
            Начните получать стабильный поток клиентов и доход уже с первого месяца
          </h2>
          <p style={{ fontSize: 16, color: "#666", margin: "0 0 36px" }}>
            Система, которая работает — даже если сейчас поток нулевой
          </p>
          <BtnStart style={{ padding: "16px 40px", fontSize: 16 }}>Начать бесплатно</BtnStart>
        </div>
      </section>

      <DokFooter />

      <style>{`
        .cpt-hero-grid { grid-template-columns: 1fr 1fr; }
        .cpt-3col { grid-template-columns: repeat(3, 1fr); }
        .cpt-2col { grid-template-columns: repeat(2, 1fr); }
        .cpt-4col { grid-template-columns: repeat(4, 1fr); }
        .cpt-5col { grid-template-columns: repeat(5, 1fr); }
        .cpt-result-pad { padding: 48px; }
        .cpt-solution-pad { padding: 44px 48px; }
        .cpt-price-pad { padding: 48px 40px; }
        @media (max-width: 900px) {
          .cpt-hero-grid { grid-template-columns: 1fr !important; }
          .cpt-3col { grid-template-columns: repeat(2, 1fr) !important; }
          .cpt-4col { grid-template-columns: repeat(2, 1fr) !important; }
          .cpt-5col { grid-template-columns: repeat(3, 1fr) !important; }
        }
        @media (max-width: 600px) {
          .cpt-2col { grid-template-columns: 1fr !important; }
          .cpt-3col { grid-template-columns: 1fr !important; }
          .cpt-4col { grid-template-columns: repeat(2, 1fr) !important; }
          .cpt-5col { grid-template-columns: repeat(2, 1fr) !important; }
          .cpt-result-pad { padding: 28px 20px !important; }
          .cpt-solution-pad { padding: 28px 20px !important; }
          .cpt-price-pad { padding: 36px 24px !important; }
        }
      `}</style>
    </div>
  );
}