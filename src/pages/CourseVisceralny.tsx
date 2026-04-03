import { useState } from "react";
import DokNavbar from "@/components/DokNavbar";
import DokFooter from "@/components/DokFooter";
import Icon from "@/components/ui/icon";

const ACCENT = "hsl(185, 85%, 32%)";
const ACCENT_DARK = "hsl(185, 85%, 26%)";
const ACCENT_SHADOW = "hsla(185, 85%, 32%, 0.25)";
const BG = "#f8f8f6";
const BUY_URL = "https://school.brossok.ru/buy/55";

const HERO_IMG = "https://cdn.poehali.dev/projects/10f61e56-9821-40f3-b705-3590ddaffd08/files/253605ec-f2b1-4a6e-92f9-96181a4448cf.jpg";

const REVIEWS = [
  {
    name: "Анна В.",
    text: "Боялась работать с органами — казалось, это только для врачей. После курса провела первый сеанс уже через неделю. Клиенты чувствуют результат.",
    img: "https://cdn.poehali.dev/projects/10f61e56-9821-40f3-b705-3590ddaffd08/files/d2103950-a0da-42f1-a62c-1942d76ff96b.jpg",
  },
  {
    name: "Роман Г.",
    text: "Курс очень доступный. Всё объяснено понятно, без медицинского жаргона. Техники простые, но реально работают — клиенты замечают разницу.",
    img: "https://cdn.poehali.dev/projects/10f61e56-9821-40f3-b705-3590ddaffd08/files/51706198-ca05-4542-b459-8a934cfb8116.jpg",
  },
];

const MODULES = [
  {
    title: "Модуль 1: Основы висцеральной терапии",
    lessons: ["Анатомия и принципы работы внутренних органов", "Безопасность и противопоказания"],
  },
  {
    title: "Модуль 2: Базовые техники",
    lessons: ["Простейшие приёмы висцерального массажа", "Видео-практика с пошаговым разбором"],
  },
  {
    title: "Модуль 3: Полный сеанс",
    lessons: ["Сборка протокола от начала до конца", "Частые ошибки новичков и как их избежать"],
  },
  {
    title: "Модуль 4: Практика на клиенте",
    lessons: ["Пошаговое руководство первого приёма", "Подготовка к работе с реальными клиентами"],
  },
];

const FAQS = [
  {
    q: "Подходит ли новичкам?",
    a: "Да. Курс создан специально для начинающих без медицинского образования. Все техники объяснены доступно и пошагово.",
  },
  {
    q: "Сколько времени на освоение?",
    a: "1–2 недели при занятиях 1 час в день. Доступ к материалам бессрочный — возвращайтесь в любое время.",
  },
  {
    q: "Можно ли применять сразу?",
    a: "Да. Уже после второго модуля вы сможете применять базовые приёмы. В последнем модуле — готовый протокол для первого приёма.",
  },
  {
    q: "Что делать при сомнениях?",
    a: "В курсе подробно разобраны противопоказания и ситуации, когда нужно остановиться. Вы будете работать уверенно и безопасно.",
  },
];

const h2style: React.CSSProperties = {
  fontFamily: "Cormorant, serif",
  fontSize: "clamp(26px, 3.5vw, 38px)",
  fontWeight: 700,
  margin: "0 0 36px",
  color: "#1a1a1a",
};

function BtnPrimary({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  const [h, setH] = useState(false);
  return (
    <a href={BUY_URL} target="_blank" rel="noopener noreferrer"
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

function BtnSecondary({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  const [h, setH] = useState(false);
  return (
    <a href={BUY_URL} target="_blank" rel="noopener noreferrer"
      onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)}
      style={{
        display: "inline-block", textDecoration: "none",
        background: "transparent", color: h ? ACCENT_DARK : ACCENT,
        border: `2px solid ${ACCENT}`, borderRadius: 12, padding: "13px 32px",
        fontSize: 15, fontWeight: 600, cursor: "pointer",
        fontFamily: "Montserrat, sans-serif", transition: "all 0.2s", ...style,
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
          <div style={{ fontWeight: 700, fontSize: 17 }}>Висцеральный массаж с нуля</div>
          <div style={{ color: "#999", fontSize: 13 }}>Безопасный старт без медобразования</div>
        </div>
        <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
          <span style={{ fontFamily: "Cormorant, serif", fontSize: 28, fontWeight: 700 }}>2 990 ₽</span>
          <BtnPrimary>Купить курс</BtnPrimary>
          <BtnSecondary>Рассрочка</BtnSecondary>
        </div>
      </div>
    </div>
  );
}

export default function CourseVisceralny() {
  return (
    <div style={{ background: BG, minHeight: "100vh", fontFamily: "Montserrat, sans-serif", color: "#1a1a1a" }}>
      <DokNavbar />

      {/* ── 1. HERO ── */}
      <section style={{ paddingTop: 80 }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "60px 24px 0", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 60, alignItems: "center" }} className="cvm-hero-grid">
          <div>
            <a href="/catalog/private" style={{ display: "inline-flex", alignItems: "center", gap: 6, color: "#999", fontSize: 13, textDecoration: "none", marginBottom: 24 }}
              onMouseEnter={e => (e.currentTarget.style.color = ACCENT)}
              onMouseLeave={e => (e.currentTarget.style.color = "#999")}
            >
              <Icon name="ArrowLeft" size={13} />
              Все курсы
            </a>
            <div style={{ display: "inline-block", background: `${ACCENT}15`, color: ACCENT, fontSize: 12, fontWeight: 700, padding: "4px 12px", borderRadius: 20, marginBottom: 16, letterSpacing: 0.5 }}>
              ДЛЯ НОВИЧКОВ
            </div>
            <h1 style={{ fontFamily: "Cormorant, serif", fontSize: "clamp(28px, 4vw, 46px)", fontWeight: 700, lineHeight: 1.15, margin: "0 0 20px" }}>
              Висцеральный массаж с нуля: быстрый старт без медобразования
            </h1>
            <p style={{ fontSize: 17, color: "#555", lineHeight: 1.7, margin: "0 0 28px" }}>
              Освойте эффективные техники работы с внутренними органами и начинайте практиковать безопасно уже с первого дня
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 16, marginBottom: 36 }}>
              {[
                { icon: "GraduationCap", text: "Не требует медицинского образования" },
                { icon: "Zap", text: "Практика с первого дня" },
                { icon: "ListChecks", text: "Простые пошаговые инструкции" },
              ].map(({ icon, text }) => (
                <div key={text} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 14, color: "#444" }}>
                  <span style={{ color: ACCENT }}><Icon name={icon} size={16} /></span>
                  {text}
                </div>
              ))}
            </div>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              <BtnPrimary>Купить курс — 2 990 ₽</BtnPrimary>
              <BtnSecondary>Оформить рассрочку</BtnSecondary>
            </div>
          </div>
          <div style={{ borderRadius: 20, overflow: "hidden", boxShadow: "0 20px 60px rgba(0,0,0,0.15)" }}>
            <img src={HERO_IMG} alt="Висцеральный массаж" style={{ width: "100%", height: 440, objectFit: "cover", display: "block" }} />
          </div>
        </div>
      </section>

      {/* ── 2. ПРОБЛЕМА ── */}
      <section style={{ padding: "80px 0 0" }}>
        <div style={{ maxWidth: 1000, margin: "0 auto", padding: "0 24px" }}>
          <h2 style={h2style}>Знакомо?</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 16 }} className="cvm-2col">
            {[
              { icon: "AlertTriangle", text: "Боитесь работать с внутренними органами" },
              { icon: "HelpCircle", text: "Нет пошагового руководства с чего начать" },
              { icon: "ShieldAlert", text: "Страх ошибок и навредить клиенту" },
              { icon: "UserMinus", text: "Теряете клиентов из-за ограниченного спектра услуг" },
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
          <div style={{ background: "#fff", border: "1px solid #e8e8e4", borderRadius: 20, padding: "44px 48px", boxShadow: "0 4px 24px rgba(0,0,0,0.06)" }} className="cvm-solution-pad">
            <div style={{ fontSize: 12, fontWeight: 700, color: ACCENT, textTransform: "uppercase", letterSpacing: 1, marginBottom: 12 }}>Решение</div>
            <h2 style={{ fontFamily: "Cormorant, serif", fontSize: "clamp(22px, 3vw, 32px)", fontWeight: 700, margin: "0 0 20px", color: "#1a1a1a" }}>
              Курс даёт всё необходимое для уверенного старта:
            </h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 14 }} className="cvm-2col">
              {[
                "Пошаговые инструкции для начинающих",
                "Демонстрацию безопасных техник",
                "Практическую методику работы с органами",
                "Уверенность при работе с клиентами",
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
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }} className="cvm-3col">
            {[
              { icon: "BookOpen", text: "Полный курс по висцеральной терапии" },
              { icon: "ShieldCheck", text: "Простые и безопасные техники" },
              { icon: "ClipboardList", text: "Пошаговые протоколы работы" },
              { icon: "UserCheck", text: "Подготовка к реальному приёму клиентов" },
              { icon: "Award", text: "Сертификат после окончания" },
              { icon: "Banknote", text: "Новое направление для заработка" },
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
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 16 }} className="cvm-2col">
            {[
              { icon: "Baby", text: "Начинающие массажисты" },
              { icon: "GraduationCap", text: "Люди без медицинского образования" },
              { icon: "PlusCircle", text: "Те, кто хочет расширить спектр практики" },
              { icon: "Zap", text: "Новички, ищущие быстрый старт в профессии" },
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
          }} className="cvm-result-pad">
            <h2 style={{ fontFamily: "Cormorant, serif", fontSize: "clamp(24px, 3vw, 36px)", fontWeight: 700, margin: "0 0 8px" }}>
              После курса вы:
            </h2>
            <p style={{ opacity: 0.75, margin: "0 0 32px", fontSize: 15 }}>Конкретный результат, который вы получите</p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }} className="cvm-2col">
              {[
                "Уверенно выполняете висцеральный массаж",
                "Понимаете, как работать безопасно",
                "Готовы принимать первых клиентов",
                "Получаете сертификат и новый источник дохода",
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
          <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 16 }} className="cvm-5col">
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
          <h2 style={h2style}>Отзывы студентов</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 24 }} className="cvm-2col">
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

      {/* ── 10. СТОИМОСТЬ ── */}
      <section style={{ padding: "80px 0 0" }}>
        <div style={{ maxWidth: 700, margin: "0 auto", padding: "0 24px" }}>
          <div style={{
            background: "#fff", border: "1px solid #e8e8e4", borderRadius: 24,
            padding: "48px 40px", textAlign: "center",
            boxShadow: "0 8px 40px rgba(0,0,0,0.08)",
          }} className="cvm-price-pad">
            <div style={{ fontSize: 13, fontWeight: 700, color: ACCENT, textTransform: "uppercase", letterSpacing: 1, marginBottom: 8 }}>Стоимость курса</div>
            <div style={{ fontFamily: "Cormorant, serif", fontSize: 56, fontWeight: 700, color: "#1a1a1a", lineHeight: 1 }}>2 990 ₽</div>
            <div style={{ color: "#999", fontSize: 14, margin: "8px 0 32px" }}>или рассрочка от 250 ₽/мес</div>
            <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap", marginBottom: 24 }}>
              {["Полная оплата", "Рассрочка на 12 мес"].map((o) => (
                <div key={o} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, color: "#555" }}>
                  <Icon name="Check" size={14} style={{ color: ACCENT }} />
                  {o}
                </div>
              ))}
            </div>
            <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
              <BtnPrimary>Купить курс</BtnPrimary>
              <BtnSecondary>Оформить рассрочку</BtnSecondary>
            </div>
          </div>
        </div>
      </section>

      {/* ── 11. СНЯТИЕ ВОЗРАЖЕНИЙ ── */}
      <section style={{ padding: "80px 0 0" }}>
        <div style={{ maxWidth: 900, margin: "0 auto", padding: "0 24px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }} className="cvm-3col">
            {[
              { icon: "ShieldCheck", title: "Безопасно для новичков", text: "Курс полностью адаптирован для тех, кто начинает с нуля" },
              { icon: "Zap", title: "Применяйте сразу", text: "Уже после второго модуля можно работать с первыми клиентами" },
              { icon: "GraduationCap", title: "Без медобразования", text: "Специальных медицинских знаний не требуется" },
            ].map(({ icon, title, text }) => (
              <div key={title} style={{
                background: "#fff", border: "1px solid #e8e8e4", borderRadius: 16,
                padding: "28px 24px", textAlign: "center",
              }}>
                <div style={{ width: 52, height: 52, borderRadius: 14, background: `${ACCENT}15`, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
                  <Icon name={icon} size={24} style={{ color: ACCENT }} />
                </div>
                <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 8 }}>{title}</div>
                <div style={{ fontSize: 13, color: "#666", lineHeight: 1.55 }}>{text}</div>
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
            Начните работать с висцеральным массажем безопасно и уверенно
          </h2>
          <p style={{ fontSize: 16, color: "#666", margin: "0 0 36px" }}>
            Всё необходимое — в одном курсе. Доступно. Безопасно. С первого дня.
          </p>
          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            <BtnPrimary style={{ padding: "16px 40px", fontSize: 16 }}>Купить курс — 2 990 ₽</BtnPrimary>
            <BtnSecondary style={{ padding: "15px 40px", fontSize: 16 }}>Рассрочка</BtnSecondary>
          </div>
        </div>
      </section>

      <DokFooter />

      <style>{`
        .cvm-hero-grid { grid-template-columns: 1fr 1fr; }
        .cvm-3col { grid-template-columns: repeat(3, 1fr); }
        .cvm-2col { grid-template-columns: repeat(2, 1fr); }
        .cvm-5col { grid-template-columns: repeat(5, 1fr); }
        .cvm-result-pad { padding: 48px; }
        .cvm-solution-pad { padding: 44px 48px; }
        .cvm-price-pad { padding: 48px 40px; }
        @media (max-width: 900px) {
          .cvm-hero-grid { grid-template-columns: 1fr !important; }
          .cvm-3col { grid-template-columns: repeat(2, 1fr) !important; }
          .cvm-5col { grid-template-columns: repeat(3, 1fr) !important; }
        }
        @media (max-width: 600px) {
          .cvm-2col { grid-template-columns: 1fr !important; }
          .cvm-3col { grid-template-columns: 1fr !important; }
          .cvm-5col { grid-template-columns: repeat(2, 1fr) !important; }
          .cvm-result-pad { padding: 28px 20px !important; }
          .cvm-solution-pad { padding: 28px 20px !important; }
          .cvm-price-pad { padding: 36px 24px !important; }
        }
      `}</style>
    </div>
  );
}
