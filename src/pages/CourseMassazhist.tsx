import { useState } from "react";
import DokNavbar from "@/components/DokNavbar";
import DokFooter from "@/components/DokFooter";
import Icon from "@/components/ui/icon";

const ACCENT = "hsl(185, 85%, 32%)";
const ACCENT_DARK = "hsl(185, 85%, 26%)";
const ACCENT_SHADOW = "hsla(185, 85%, 32%, 0.25)";
const BG = "#f8f8f6";

const HERO_IMG = "https://cdn.poehali.dev/projects/10f61e56-9821-40f3-b705-3590ddaffd08/files/7cedf2c0-f95b-4849-92be-6fb3944e25d1.jpg";

const REVIEWS = [
  {
    name: "Анастасия К.",
    text: "Начала с нуля, через месяц уже принимала первых клиентов. Курс очень понятный, всё по шагам. Теперь это мой основной доход.",
    img: "https://cdn.poehali.dev/projects/10f61e56-9821-40f3-b705-3590ddaffd08/files/c207e068-8203-4f20-a40a-53d60df722e5.jpg",
  },
  {
    name: "Елена М.",
    text: "Долго сомневалась — нет образования, нет опыта. Но курс реально для новичков. За 3 недели освоила технику и уже зарабатываю.",
    img: "https://cdn.poehali.dev/projects/10f61e56-9821-40f3-b705-3590ddaffd08/files/3618e920-2b36-438e-b312-f7f0874826c3.jpg",
  },
];

const MODULES = [
  {
    title: "Модуль 1: Введение в профессию",
    lessons: ["Основы массажа и анатомия", "Подготовка рабочего места"],
  },
  {
    title: "Модуль 2: Базовые техники",
    lessons: ["Основные приёмы массажа", "Отработка техник на практике"],
  },
  {
    title: "Модуль 3: Работа с клиентом",
    lessons: ["Общение и доверие клиента", "Безопасность и противопоказания", "Структура полного сеанса"],
  },
  {
    title: "Модуль 4: Практика",
    lessons: ["Сборка полного сеанса от А до Я", "Частые ошибки и как их избежать"],
  },
  {
    title: "Модуль 5: Первые деньги",
    lessons: ["Как найти первых клиентов", "Как назначить цену и начать зарабатывать"],
  },
];

const FAQS = [
  {
    q: "Нужен ли медицинский диплом?",
    a: "Нет. Курс разработан специально для людей без медицинского образования. Вы получите всё необходимое для безопасной работы.",
  },
  {
    q: "Смогу ли я без опыта?",
    a: "Да. Курс начинается с самых основ — подойдёт абсолютному новичку. Всё объяснено пошагово с практическими заданиями.",
  },
  {
    q: "Сколько времени занимает обучение?",
    a: "В среднем 3–4 недели при обучении 1–2 часа в день. Доступ к материалам не ограничен по времени.",
  },
  {
    q: "Когда я смогу начать зарабатывать?",
    a: "Многие студенты принимают первых клиентов уже в процессе обучения — в конце курса есть специальный модуль по привлечению клиентов.",
  },
];

function BtnPrimary({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  const [h, setH] = useState(false);
  return (
    <button
      onMouseEnter={() => setH(true)}
      onMouseLeave={() => setH(false)}
      style={{
        background: h ? ACCENT_DARK : ACCENT,
        color: "#fff",
        border: "none",
        borderRadius: 12,
        padding: "14px 32px",
        fontSize: 15,
        fontWeight: 700,
        cursor: "pointer",
        fontFamily: "Montserrat, sans-serif",
        boxShadow: `0 6px 20px ${ACCENT_SHADOW}`,
        transition: "all 0.2s",
        transform: h ? "translateY(-2px)" : "translateY(0)",
        ...style,
      }}
    >{children}</button>
  );
}

function BtnSecondary({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  const [h, setH] = useState(false);
  return (
    <button
      onMouseEnter={() => setH(true)}
      onMouseLeave={() => setH(false)}
      style={{
        background: "transparent",
        color: h ? ACCENT_DARK : ACCENT,
        border: `2px solid ${ACCENT}`,
        borderRadius: 12,
        padding: "13px 32px",
        fontSize: 15,
        fontWeight: 600,
        cursor: "pointer",
        fontFamily: "Montserrat, sans-serif",
        transition: "all 0.2s",
        ...style,
      }}
    >{children}</button>
  );
}

function AccordionItem({ title, children }: { title: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{
      borderBottom: "1px solid #e8e8e4",
      overflow: "hidden",
    }}>
      <button
        onClick={() => setOpen(!open)}
        style={{
          width: "100%",
          background: "none",
          border: "none",
          padding: "18px 0",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          cursor: "pointer",
          fontFamily: "Montserrat, sans-serif",
          fontSize: 15,
          fontWeight: 600,
          color: "#1a1a1a",
          textAlign: "left",
          gap: 12,
        }}
      >
        {title}
        <span style={{
          color: ACCENT,
          flexShrink: 0,
          transition: "transform 0.25s",
          transform: open ? "rotate(45deg)" : "rotate(0deg)",
          fontSize: 22,
          lineHeight: 1,
        }}>+</span>
      </button>
      <div style={{
        maxHeight: open ? 400 : 0,
        overflow: "hidden",
        transition: "max-height 0.3s ease",
      }}>
        <div style={{ paddingBottom: 18 }}>{children}</div>
      </div>
    </div>
  );
}

export default function CourseMassazhist() {
  return (
    <div style={{ background: BG, minHeight: "100vh", fontFamily: "Montserrat, sans-serif", color: "#1a1a1a" }}>
      <DokNavbar />

      {/* ── 1. HERO ────────────────────────────── */}
      <section style={{ paddingTop: 80 }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "60px 24px 0", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 60, alignItems: "center" }} className="course-hero-grid">
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
            <h1 style={{
              fontFamily: "Cormorant, serif",
              fontSize: "clamp(30px, 4vw, 48px)",
              fontWeight: 700,
              lineHeight: 1.15,
              margin: "0 0 20px",
            }}>
              Профессия массажист с нуля: первый доход за 30 дней
            </h1>
            <p style={{ fontSize: 17, color: "#555", lineHeight: 1.7, margin: "0 0 28px" }}>
              Освойте востребованную профессию и начните зарабатывать на массаже даже без медицинского образования
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 16, marginBottom: 36 }}>
              {[
                { icon: "GraduationCap", text: "Без медицинского образования" },
                { icon: "Zap", text: "Практика с первого дня" },
                { icon: "UserCheck", text: "Подходит для новичков" },
              ].map(({ icon, text }) => (
                <div key={text} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 14, color: "#444" }}>
                  <span style={{ color: ACCENT }}><Icon name={icon} size={16} /></span>
                  {text}
                </div>
              ))}
            </div>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              <BtnPrimary>Купить курс — 19 900 ₽</BtnPrimary>
              <BtnSecondary>Оформить рассрочку</BtnSecondary>
            </div>
          </div>
          <div style={{ borderRadius: 20, overflow: "hidden", boxShadow: "0 20px 60px rgba(0,0,0,0.15)" }}>
            <img src={HERO_IMG} alt="Курс массажа" style={{ width: "100%", height: 420, objectFit: "cover", display: "block" }} />
          </div>
        </div>
      </section>

      {/* ── 2. ЧТО ПОЛУЧИТЕ ────────────────────── */}
      <section style={{ padding: "80px 0 0" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 24px" }}>
          <h2 style={h2style}>Что вы получите</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }} className="course-3col">
            {[
              { icon: "Hand", text: "Освоите базовые техники массажа" },
              { icon: "Users", text: "Научитесь проводить полноценный сеанс" },
              { icon: "MessageCircle", text: "Поймёте, как работать с клиентом" },
              { icon: "ListChecks", text: "Получите пошаговый план старта" },
              { icon: "Banknote", text: "Сможете начать зарабатывать" },
            ].map(({ icon, text }) => (
              <div key={text} style={{
                background: "#fff",
                borderRadius: 14,
                padding: "24px 20px",
                display: "flex",
                alignItems: "flex-start",
                gap: 14,
                border: "1px solid #e8e8e4",
                boxShadow: "0 2px 12px rgba(0,0,0,0.05)",
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

      {/* ── АВТОР КУРСА ─────────────────────────── */}
      <section style={{ padding: "80px 0 0" }}>
        <div style={{ maxWidth: 1000, margin: "0 auto", padding: "0 24px" }}>
          <div style={{
            background: "#fff",
            border: "1px solid #e8e8e4",
            borderRadius: 24,
            overflow: "hidden",
            display: "grid",
            gridTemplateColumns: "320px 1fr",
            boxShadow: "0 4px 24px rgba(0,0,0,0.07)",
          }} className="course-author-grid">
            <div style={{ position: "relative", minHeight: 320 }}>
              <img
                src="https://cdn.poehali.dev/projects/10f61e56-9821-40f3-b705-3590ddaffd08/files/d0a7ff9d-716f-4a20-a395-e785aca57e30.jpg"
                alt="Автор курса"
                style={{ width: "100%", height: "100%", objectFit: "cover", display: "block", minHeight: 320 }}
              />
            </div>
            <div style={{ padding: "40px 44px" }} className="course-author-pad">
              <div style={{ fontSize: 12, fontWeight: 700, color: ACCENT, textTransform: "uppercase", letterSpacing: 1, marginBottom: 12 }}>
                Автор курса
              </div>
              <h3 style={{ fontFamily: "Cormorant, serif", fontSize: 32, fontWeight: 700, margin: "0 0 6px", color: "#1a1a1a" }}>
                Сергей Водопьянов
              </h3>
              <p style={{ color: "#999", fontSize: 14, margin: "0 0 24px" }}>
                Практикующий массажист, преподаватель · 12 лет опыта
              </p>
              <p style={{ fontSize: 15, color: "#555", lineHeight: 1.75, margin: "0 0 28px" }}>
                Начинал без медицинского образования — с нуля построил частную практику и вырастил более 500 учеников. Автор методики «Быстрый старт», по которой студенты выходят на первый заработок уже в процессе обучения.
              </p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
                {[
                  { value: "12+", label: "лет практики" },
                  { value: "500+", label: "учеников" },
                  { value: "95%", label: "доходят до результата" },
                ].map(({ value, label }) => (
                  <div key={label} style={{
                    background: BG,
                    borderRadius: 12,
                    padding: "12px 20px",
                    textAlign: "center",
                  }}>
                    <div style={{ fontFamily: "Cormorant, serif", fontSize: 26, fontWeight: 700, color: ACCENT, lineHeight: 1 }}>{value}</div>
                    <div style={{ fontSize: 12, color: "#888", marginTop: 4 }}>{label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA 1 ──────────────────────────────── */}
      <CtaBar />

      {/* ── 3. ДЛЯ КОГО ────────────────────────── */}
      <section style={{ padding: "80px 0 0" }}>
        <div style={{ maxWidth: 900, margin: "0 auto", padding: "0 24px" }}>
          <h2 style={h2style}>Для кого этот курс</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 16 }} className="course-2col">
            {[
              { icon: "Baby", text: "Новички без опыта" },
              { icon: "RefreshCw", text: "Те, кто хочет сменить профессию" },
              { icon: "PiggyBank", text: "Люди, ищущие дополнительный доход" },
              { icon: "Star", text: "Начинающие массажисты" },
            ].map(({ icon, text }) => (
              <div key={text} style={{
                background: "#fff",
                border: "1px solid #e8e8e4",
                borderRadius: 14,
                padding: "20px 24px",
                display: "flex",
                alignItems: "center",
                gap: 14,
                fontSize: 15,
                fontWeight: 500,
                color: "#333",
              }}>
                <Icon name={icon} size={22} style={{ color: ACCENT, flexShrink: 0 }} />
                {text}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 4. РЕЗУЛЬТАТ ────────────────────────── */}
      <section style={{ padding: "80px 0 0" }}>
        <div style={{ maxWidth: 900, margin: "0 auto", padding: "0 24px" }}>
          <div style={{
            background: `linear-gradient(135deg, ${ACCENT}, hsl(185,85%,22%))`,
            borderRadius: 20,
            padding: "48px 48px",
            color: "#fff",
          }} className="course-result-pad">
            <h2 style={{ fontFamily: "Cormorant, serif", fontSize: "clamp(24px, 3vw, 36px)", fontWeight: 700, margin: "0 0 8px" }}>
              После прохождения курса вы:
            </h2>
            <p style={{ opacity: 0.75, margin: "0 0 32px", fontSize: 15 }}>Конкретный результат, который вы получите</p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }} className="course-2col">
              {[
                "Умеете делать базовый массаж",
                "Можете принимать первых клиентов",
                "Понимаете, как зарабатывать на навыке",
                "Чувствуете уверенность в работе",
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

      {/* ── 5. ПРОГРАММА ───────────────────────── */}
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

      {/* ── 6. ФОРМАТ ──────────────────────────── */}
      <section style={{ padding: "80px 0 0" }}>
        <div style={{ maxWidth: 1000, margin: "0 auto", padding: "0 24px" }}>
          <h2 style={h2style}>Формат обучения</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 16 }} className="course-5col">
            {[
              { icon: "Wifi", text: "Онлайн-доступ 24/7" },
              { icon: "Video", text: "Видео-уроки" },
              { icon: "BookOpen", text: "Домашние задания" },
              { icon: "ClipboardCheck", text: "Тестирование" },
              { icon: "Award", text: "Сертификат" },
            ].map(({ icon, text }) => (
              <div key={text} style={{
                background: "#fff",
                border: "1px solid #e8e8e4",
                borderRadius: 14,
                padding: "24px 16px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 12,
                textAlign: "center",
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

      {/* ── CTA 2 ──────────────────────────────── */}
      <CtaBar />

      {/* ── 7. ОТЗЫВЫ ──────────────────────────── */}
      <section style={{ padding: "80px 0 0" }}>
        <div style={{ maxWidth: 900, margin: "0 auto", padding: "0 24px" }}>
          <h2 style={h2style}>Отзывы студентов</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 24 }} className="course-2col">
            {REVIEWS.map((r) => (
              <div key={r.name} style={{
                background: "#fff",
                border: "1px solid #e8e8e4",
                borderRadius: 18,
                padding: "28px",
                boxShadow: "0 2px 16px rgba(0,0,0,0.05)",
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

      {/* ── 8. СТОИМОСТЬ ───────────────────────── */}
      <section style={{ padding: "80px 0 0" }}>
        <div style={{ maxWidth: 700, margin: "0 auto", padding: "0 24px" }}>
          <div style={{
            background: "#fff",
            border: "1px solid #e8e8e4",
            borderRadius: 24,
            padding: "48px 40px",
            textAlign: "center",
            boxShadow: "0 8px 40px rgba(0,0,0,0.08)",
          }} className="course-price-pad">
            <div style={{ fontSize: 13, fontWeight: 700, color: ACCENT, textTransform: "uppercase", letterSpacing: 1, marginBottom: 8 }}>Стоимость курса</div>
            <div style={{ fontFamily: "Cormorant, serif", fontSize: 56, fontWeight: 700, color: "#1a1a1a", lineHeight: 1 }}>19 900 ₽</div>
            <div style={{ color: "#999", fontSize: 14, margin: "8px 0 32px" }}>или рассрочка от 1 658 ₽/мес</div>
            <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap", marginBottom: 24 }}>
              {["Полная оплата", "Рассрочка на 12 мес", "Рассрочка на 24 мес"].map((o) => (
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

      {/* ── 9. ГАРАНТИИ ────────────────────────── */}
      <section style={{ padding: "80px 0 0" }}>
        <div style={{ maxWidth: 900, margin: "0 auto", padding: "0 24px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }} className="course-3col">
            {[
              { icon: "ShieldCheck", title: "Подходит для новичков", text: "Курс создан специально для тех, кто начинает с нуля" },
              { icon: "Route", title: "Пошаговое обучение", text: "Никакой теории без практики — каждый шаг закрепляется заданием" },
              { icon: "HeartHandshake", title: "Поддержка на старте", text: "Вы не остаётесь один на один с вопросами — поддержка включена" },
            ].map(({ icon, title, text }) => (
              <div key={title} style={{
                background: "#fff",
                border: "1px solid #e8e8e4",
                borderRadius: 16,
                padding: "28px 24px",
                textAlign: "center",
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

      {/* ── 10. FAQ ─────────────────────────────── */}
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

      {/* ── 11. ФИНАЛЬНЫЙ CTA ──────────────────── */}
      <section style={{ padding: "80px 0" }}>
        <div style={{ maxWidth: 700, margin: "0 auto", padding: "0 24px", textAlign: "center" }}>
          <h2 style={{ fontFamily: "Cormorant, serif", fontSize: "clamp(26px, 4vw, 42px)", fontWeight: 700, margin: "0 0 16px", lineHeight: 1.2 }}>
            Начните зарабатывать на массаже уже в ближайший месяц
          </h2>
          <p style={{ fontSize: 16, color: "#666", margin: "0 0 36px" }}>
            Присоединяйтесь к студентам, которые уже изменили свою жизнь
          </p>
          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            <BtnPrimary style={{ padding: "16px 40px", fontSize: 16 }}>Купить курс — 19 900 ₽</BtnPrimary>
            <BtnSecondary style={{ padding: "15px 40px", fontSize: 16 }}>Рассрочка</BtnSecondary>
          </div>
        </div>
      </section>

      <DokFooter />

      <style>{`
        .course-hero-grid { grid-template-columns: 1fr 1fr; }
        .course-3col { grid-template-columns: repeat(3, 1fr); }
        .course-2col { grid-template-columns: repeat(2, 1fr); }
        .course-5col { grid-template-columns: repeat(5, 1fr); }
        .course-result-pad { padding: 48px; }
        .course-price-pad { padding: 48px 40px; }
        @media (max-width: 900px) {
          .course-hero-grid { grid-template-columns: 1fr !important; }
          .course-3col { grid-template-columns: repeat(2, 1fr) !important; }
          .course-5col { grid-template-columns: repeat(3, 1fr) !important; }
          .course-author-grid { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 600px) {
          .course-2col { grid-template-columns: 1fr !important; }
          .course-3col { grid-template-columns: 1fr !important; }
          .course-5col { grid-template-columns: repeat(2, 1fr) !important; }
          .course-result-pad { padding: 32px 24px !important; }
          .course-price-pad { padding: 36px 24px !important; }
          .course-author-pad { padding: 28px 24px !important; }
        }
      `}</style>
    </div>
  );
}

const h2style: React.CSSProperties = {
  fontFamily: "Cormorant, serif",
  fontSize: "clamp(26px, 3.5vw, 38px)",
  fontWeight: 700,
  margin: "0 0 36px",
  color: "#1a1a1a",
};

function CtaBar() {
  return (
    <div style={{ margin: "60px 0 0", background: "#fff", borderTop: "1px solid #e8e8e4", borderBottom: "1px solid #e8e8e4" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "28px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
        <div>
          <div style={{ fontWeight: 700, fontSize: 17 }}>Профессия массажист с нуля</div>
          <div style={{ color: "#999", fontSize: 13 }}>Начните уже сегодня</div>
        </div>
        <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
          <span style={{ fontFamily: "Cormorant, serif", fontSize: 28, fontWeight: 700 }}>19 900 ₽</span>
          <BtnPrimary>Купить курс</BtnPrimary>
          <BtnSecondary>Рассрочка</BtnSecondary>
        </div>
      </div>
    </div>
  );
}