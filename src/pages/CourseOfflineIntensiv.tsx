import { useState } from "react";
import { Helmet } from "react-helmet-async";
import DokNavbar from "@/components/DokNavbar";
import DokFooter from "@/components/DokFooter";
import Icon from "@/components/ui/icon";

const ACCENT = "hsl(185, 85%, 32%)";
const ACCENT_DARK = "hsl(185, 85%, 26%)";
const ACCENT_SHADOW = "hsla(185, 85%, 32%, 0.25)";
const BG = "#f8f8f6";
const PAY_URL = "#pay";
const BOOK_URL = "#book";
const HERO_IMG = "https://cdn.poehali.dev/projects/10f61e56-9821-40f3-b705-3590ddaffd08/bucket/1a5aac68-8ad8-45e6-bb3c-bbab1439bb75.jpg";

const h2style: React.CSSProperties = {
  fontFamily: "Cormorant, serif",
  fontSize: "clamp(26px, 3.5vw, 38px)",
  fontWeight: 700,
  margin: "0 0 36px",
  color: "#1a1a1a",
};

function BtnPay({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  const [h, setH] = useState(false);
  return (
    <a
      href={PAY_URL}
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

function BtnBook({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  const [h, setH] = useState(false);
  return (
    <a
      href={BOOK_URL}
      onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)}
      style={{
        display: "inline-block", textDecoration: "none",
        background: "transparent", color: "#555",
        border: "1.5px solid #d0d0cc",
        borderRadius: 12, padding: "13px 28px", fontSize: 15, fontWeight: 600,
        cursor: "pointer", fontFamily: "Montserrat, sans-serif",
        transition: "all 0.2s",
        borderColor: h ? "#aaa" : "#d0d0cc", ...style,
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
        <div style={{ paddingBottom: 18, fontSize: 14, color: "#555", lineHeight: 1.7 }}>{children}</div>
      </div>
    </div>
  );
}

function PricingBlock() {
  return (
    <section id="pay" style={{ padding: "80px 0", background: "#fff" }}>
      <div style={{ maxWidth: 900, margin: "0 auto", padding: "0 24px" }}>
        <h2 style={{ ...h2style, textAlign: "center" }}>Выберите формат участия</h2>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, marginBottom: 40 }} className="pricing-grid">

          {/* Card 1 — Pay */}
          <div style={{
            background: "linear-gradient(135deg, hsl(185,85%,97%) 0%, #fff 100%)",
            border: `2px solid ${ACCENT}`,
            borderRadius: 20, padding: "32px 28px",
            position: "relative", overflow: "hidden",
          }}>
            <div style={{
              position: "absolute", top: 16, right: 16,
              background: ACCENT, color: "#fff",
              fontSize: 11, fontWeight: 700, padding: "4px 12px", borderRadius: 20, letterSpacing: 0.5,
            }}>ЛУЧШИЙ ВЫБОР</div>

            <div style={{ fontSize: 18, fontWeight: 700, margin: "0 0 20px", color: "#1a1a1a" }}>
              Оплатить полностью и сэкономить
            </div>

            <div style={{ marginBottom: 8 }}>
              <span style={{ fontSize: 15, color: "#bbb", textDecoration: "line-through" }}>15 000 руб.</span>
            </div>
            <div style={{ fontSize: 42, fontWeight: 800, color: "#1a1a1a", lineHeight: 1, marginBottom: 8 }}>9 900 <span style={{ fontSize: 24 }}>руб.</span></div>
            <div style={{
              display: "inline-flex", alignItems: "center", gap: 6,
              background: "#dcfce7", color: "#15803d",
              fontSize: 13, fontWeight: 700, padding: "5px 12px", borderRadius: 8, marginBottom: 24,
            }}>
              <Icon name="TrendingDown" size={14} />
              Вы экономите 5 100 руб.
            </div>

            <ul style={{ margin: "0 0 28px", padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 10 }}>
              {[
                "Место закрепляется сразу",
                "Без доплат и сюрпризов",
                "Фиксация минимальной цены",
                "Полный доступ ко всем материалам",
              ].map((item) => (
                <li key={item} style={{ display: "flex", gap: 10, alignItems: "flex-start", fontSize: 14, color: "#333" }}>
                  <span style={{ color: ACCENT, flexShrink: 0, marginTop: 1 }}>✓</span>
                  {item}
                </li>
              ))}
            </ul>

            <BtnPay style={{ width: "100%", textAlign: "center", padding: "16px 24px", fontSize: 16, borderRadius: 12 }}>
              Оплатить 9 900 руб.
            </BtnPay>
            <p style={{ fontSize: 12, color: "#888", margin: "12px 0 0", textAlign: "center", lineHeight: 1.5 }}>
              Вы фиксируете минимальную цену и гарантируете участие
            </p>
          </div>

          {/* Card 2 — Book */}
          <div id="book" style={{
            background: "#fafaf8",
            border: "1.5px solid #e8e8e4",
            borderRadius: 20, padding: "32px 28px",
          }}>
            <div style={{ fontSize: 18, fontWeight: 700, margin: "0 0 20px", color: "#1a1a1a" }}>
              Забронировать место
            </div>

            <div style={{ fontSize: 36, fontWeight: 800, color: "#1a1a1a", lineHeight: 1, marginBottom: 8 }}>2 000 <span style={{ fontSize: 20 }}>руб.</span></div>

            <div style={{ fontSize: 13, color: "#888", marginBottom: 8 }}>
              Останется доплатить:
            </div>
            <div style={{
              display: "inline-flex", alignItems: "center", gap: 6,
              background: "#fef9c3", color: "#854d0e",
              fontSize: 13, fontWeight: 600, padding: "5px 12px", borderRadius: 8, marginBottom: 24,
            }}>
              <Icon name="AlertCircle" size={14} />
              13 000 руб. (без скидки)
            </div>

            <ul style={{ margin: "0 0 28px", padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 10 }}>
              {[
                { text: "Фиксация места", ok: true },
                { text: "Доплата 13 000 руб. до события", ok: false },
                { text: "Итоговая стоимость выше", ok: false },
              ].map((item) => (
                <li key={item.text} style={{ display: "flex", gap: 10, alignItems: "flex-start", fontSize: 14, color: "#555" }}>
                  <span style={{ color: item.ok ? ACCENT : "#bbb", flexShrink: 0, marginTop: 1 }}>{item.ok ? "✓" : "–"}</span>
                  {item.text}
                </li>
              ))}
            </ul>

            <BtnBook style={{ width: "100%", textAlign: "center", padding: "15px 24px", fontSize: 15, borderRadius: 12 }}>
              Забронировать
            </BtnBook>
            <p style={{ fontSize: 12, color: "#aaa", margin: "12px 0 0", textAlign: "center", lineHeight: 1.5 }}>
              Подходит, если хотите занять место сейчас и оплатить позже
            </p>
          </div>
        </div>

        {/* Comparison */}
        <div style={{ background: "#f8f8f6", borderRadius: 16, padding: "28px 32px", border: "1px solid #e8e8e4" }}>
          <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 20, color: "#1a1a1a", textAlign: "center" }}>Сравнение вариантов</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }} className="compare-grid">
            <div>
              <div style={{ fontSize: 13, fontWeight: 700, color: ACCENT, marginBottom: 12, textTransform: "uppercase", letterSpacing: 0.5 }}>Полная оплата</div>
              {[
                "Экономия 5 100 руб.",
                "Место закреплено сразу",
                "Без доплат",
                "Лучший выбор",
              ].map((t) => (
                <div key={t} style={{ display: "flex", gap: 8, alignItems: "center", fontSize: 13, color: "#333", marginBottom: 8 }}>
                  <span style={{ color: ACCENT }}>✔</span> {t}
                </div>
              ))}
            </div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 700, color: "#999", marginBottom: 12, textTransform: "uppercase", letterSpacing: 0.5 }}>Бронь</div>
              {[
                "Только фиксация места",
                "Доплата 13 000 руб.",
                "Итог дороже",
              ].map((t) => (
                <div key={t} style={{ display: "flex", gap: 8, alignItems: "center", fontSize: 13, color: "#888", marginBottom: 8 }}>
                  <span style={{ color: "#ccc" }}>–</span> {t}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Triggers */}
        <div style={{ display: "flex", gap: 16, marginTop: 28, justifyContent: "center", flexWrap: "wrap" }}>
          {[
            { icon: "Clock", text: "Ограниченное количество мест" },
            { icon: "Users", text: "Группа до 10–12 человек" },
          ].map(({ icon, text }) => (
            <div key={text} style={{
              display: "flex", alignItems: "center", gap: 10,
              background: "#fff", border: "1px solid #e8e8e4",
              borderRadius: 12, padding: "12px 20px",
              fontSize: 14, fontWeight: 600, color: "#444",
            }}>
              <Icon name={icon} size={18} style={{ color: ACCENT }} />
              {text}
            </div>
          ))}
        </div>

        {/* Social proof */}
        <div style={{ textAlign: "center", marginTop: 24, fontSize: 14, color: "#888" }}>
          Осталось <strong style={{ color: "#1a1a1a" }}>7 мест</strong> · Уже записались <strong style={{ color: "#1a1a1a" }}>5 человек</strong>
        </div>
      </div>
    </section>
  );
}

export default function CourseOfflineIntensiv() {
  return (
    <div style={{ background: BG, minHeight: "100vh", fontFamily: "Montserrat, sans-serif", color: "#1a1a1a" }}>
      <Helmet>
        <title>Однодневный интенсив для массажистов — увеличение дохода | Dok Диалог</title>
        <meta name="description" content="Офлайн интенсив за 1 день: диагностика практики, техники повышения дохода, поток клиентов. От 9 900 руб. Группа до 12 человек." />
        <meta name="keywords" content="офлайн курс массаж, интенсив для массажистов, увеличение дохода массажист, живой курс массаж" />
        <meta property="og:title" content="Однодневный интенсив: увеличение дохода массажиста через практику" />
        <meta property="og:description" content="За 1 день — диагностика практики, техники роста дохода и план действий. От 9 900 руб." />
        <meta property="og:type" content="website" />
      </Helmet>
      <DokNavbar />

      {/* ── 1. HERO ── */}
      <section style={{ paddingTop: 80 }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "60px 24px 0", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 60, alignItems: "center" }} className="coi-hero-grid">
          <div>
            <a href="/catalog/private" style={{ display: "inline-flex", alignItems: "center", gap: 6, color: "#999", fontSize: 13, textDecoration: "none", marginBottom: 24 }}
              onMouseEnter={e => (e.currentTarget.style.color = ACCENT)}
              onMouseLeave={e => (e.currentTarget.style.color = "#999")}
            >
              <Icon name="ArrowLeft" size={13} />
              Все курсы
            </a>
            <div style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap" }}>
              <div style={{ background: "#1a1a1a", color: "#fff", fontSize: 12, fontWeight: 700, padding: "4px 12px", borderRadius: 20, letterSpacing: 0.5 }}>
                ОФЛАЙН
              </div>
              <div style={{ background: `${ACCENT}15`, color: ACCENT, fontSize: 12, fontWeight: 700, padding: "4px 12px", borderRadius: 20 }}>
                1 ДЕНЬ
              </div>
              <div style={{ background: "#dcfce7", color: "#15803d", fontSize: 12, fontWeight: 700, padding: "4px 12px", borderRadius: 20 }}>
                ДОХОД / КЛИЕНТЫ
              </div>
            </div>
            <h1 style={{ fontFamily: "Cormorant, serif", fontSize: "clamp(28px, 4vw, 48px)", fontWeight: 700, lineHeight: 1.15, margin: "0 0 20px" }}>
              Однодневный интенсив: увеличение дохода массажиста через практику
            </h1>
            <p style={{ fontSize: 17, color: "#555", lineHeight: 1.7, margin: "0 0 28px" }}>
              За 1 день вы продиагностируете свою практику, поймёте, где теряете деньги, и освоите техники, которые увеличивают поток клиентов и доход
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 16, marginBottom: 36 }}>
              {[
                { icon: "Target", text: "Диагностика практики" },
                { icon: "TrendingUp", text: "Рост дохода" },
                { icon: "Users", text: "Поток клиентов" },
              ].map(({ icon, text }) => (
                <div key={text} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 14, color: "#444" }}>
                  <span style={{ color: ACCENT }}><Icon name={icon} size={16} /></span>
                  {text}
                </div>
              ))}
            </div>
            <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }} className="coi-hero-btns">
              <BtnPay style={{ padding: "16px 40px", fontSize: 16 }}>Оплатить 9 900 руб.</BtnPay>
              <BtnBook style={{ padding: "16px 28px", fontSize: 15 }}>Забронировать</BtnBook>
            </div>
            <div style={{ marginTop: 20, fontSize: 13, color: "#aaa" }}>
              Осталось <strong style={{ color: "#555" }}>7 мест</strong> · Группа до 12 человек
            </div>
          </div>
          <div style={{ borderRadius: 20, overflow: "hidden", boxShadow: "0 20px 60px rgba(0,0,0,0.15)" }}>
            <img src={HERO_IMG} alt="Офлайн интенсив для массажистов" style={{ width: "100%", height: 460, objectFit: "cover", display: "block" }} />
          </div>
        </div>
      </section>

      {/* ── 2. ПРОБЛЕМА ── */}
      <section style={{ padding: "80px 0 0" }}>
        <div style={{ maxWidth: 800, margin: "0 auto", padding: "0 24px" }}>
          <h2 style={h2style}>Узнаёте себя?</h2>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }} className="problems-grid">
            {[
              "Клиенты есть, но доход не растёт",
              "Не понимаете, почему клиенты не возвращаются",
              "Не знаете, как поднять чек без потери записи",
              "Работаете много, а денег — как было",
              "Нет системы — живёте от записи к записи",
              "Хотите больше, но не знаете с чего начать",
            ].map((t) => (
              <div key={t} style={{
                background: "#fff", border: "1px solid #e8e8e4",
                borderRadius: 14, padding: "18px 20px",
                display: "flex", gap: 12, alignItems: "flex-start",
                fontSize: 14, color: "#444", lineHeight: 1.5,
              }}>
                <Icon name="AlertCircle" size={18} style={{ color: "#f59e0b", flexShrink: 0, marginTop: 1 }} />
                {t}
              </div>
            ))}
          </div>
          <div style={{ marginTop: 36, background: `${ACCENT}10`, border: `1.5px solid ${ACCENT}30`, borderRadius: 16, padding: "24px 28px" }}>
            <p style={{ margin: 0, fontSize: 16, color: "#1a1a1a", lineHeight: 1.7, fontWeight: 500 }}>
              За 1 день интенсива вы разберёте свою ситуацию, найдёте точки роста и уйдёте с конкретным планом — без воды и общих фраз.
            </p>
          </div>
        </div>
      </section>

      {/* ── 3. РЕЗУЛЬТАТЫ ── */}
      <section style={{ padding: "80px 0 0" }}>
        <div style={{ maxWidth: 900, margin: "0 auto", padding: "0 24px" }}>
          <h2 style={h2style}>После интенсива вы</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }} className="results-grid">
            {[
              { icon: "Search", title: "Найдёте слабые места", text: "Поймёте, где и почему теряете деньги прямо сейчас" },
              { icon: "TrendingUp", title: "Увеличите доход", text: "Получите техники, которые реально работают на рост чека" },
              { icon: "Users", title: "Выстроите поток", text: "Научитесь превращать разовых клиентов в постоянных" },
              { icon: "Target", title: "Составите план", text: "Уйдёте с конкретными шагами на ближайший месяц" },
              { icon: "CheckCircle", title: "Снимете хаос", text: "Поймёте систему — и перестанете работать «вхолостую»" },
              { icon: "Star", title: "Повысите уверенность", text: "Начнёте позиционировать себя как профессионал с ценой" },
            ].map(({ icon, title, text }) => (
              <div key={title} style={{ background: "#fff", border: "1px solid #e8e8e4", borderRadius: 16, padding: "22px 20px" }}>
                <div style={{ color: ACCENT, marginBottom: 12 }}><Icon name={icon} size={24} /></div>
                <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 8, color: "#1a1a1a" }}>{title}</div>
                <div style={{ fontSize: 13.5, color: "#666", lineHeight: 1.6 }}>{text}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 4. ПРОГРАММА ── */}
      <section style={{ padding: "80px 0 0" }}>
        <div style={{ maxWidth: 800, margin: "0 auto", padding: "0 24px" }}>
          <h2 style={h2style}>Программа дня</h2>
          {[
            { time: "11:00–12:30", title: "Диагностика практики", desc: "Анализируем текущую ситуацию каждого участника: клиенты, доход, чек, повторные записи. Находим главные точки потерь." },
            { time: "12:30–14:00", title: "Техники повышения чека", desc: "Практические методы увеличения стоимости услуг без потери клиентов. Разбираем страхи и работаем с позиционированием." },
            { time: "14:00–15:00", title: "Обед", desc: "" },
            { time: "15:00–16:15", title: "Система привлечения клиентов", desc: "Конкретные каналы и инструменты под каждый формат работы. Разбираем кейсы участников." },
            { time: "16:15–17:15", title: "Удержание и возврат", desc: "Как превратить разового клиента в постоянного. Скрипты, поводы для контакта, программы лояльности." },
            { time: "17:15–18:00", title: "Составление личного плана", desc: "Каждый участник уходит с индивидуальным планом действий на ближайший месяц." },
          ].map(({ time, title, desc }, i) => (
            <div key={i} style={{ display: "flex", gap: 20, marginBottom: 28 }}>
              <div style={{ flexShrink: 0, width: 100, paddingTop: 2 }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: ACCENT, background: `${ACCENT}12`, borderRadius: 8, padding: "4px 8px", textAlign: "center" }}>{time}</div>
              </div>
              <div style={{ borderLeft: `2px solid ${ACCENT}30`, paddingLeft: 20, flex: 1 }}>
                <div style={{ fontWeight: 700, fontSize: 16, color: "#1a1a1a", marginBottom: 6 }}>{title}</div>
                <div style={{ fontSize: 14, color: "#666", lineHeight: 1.6 }}>{desc}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── 5. ФОРМАТ ── */}
      <section style={{ padding: "80px 0 0" }}>
        <div style={{ maxWidth: 900, margin: "0 auto", padding: "0 24px" }}>
          <h2 style={h2style}>Формат</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }} className="format-grid">
            {[
              { icon: "MapPin", label: "Офлайн", sub: "Живое участие" },
              { icon: "Clock", label: "1 день", sub: "11:00–18:00" },
              { icon: "Users", label: "До 12 человек", sub: "Малая группа" },
              { icon: "MessageSquare", label: "Практика", sub: "80% практики" },
            ].map(({ icon, label, sub }) => (
              <div key={label} style={{ background: "#fff", border: "1px solid #e8e8e4", borderRadius: 16, padding: "22px 18px", textAlign: "center" }}>
                <div style={{ color: ACCENT, marginBottom: 10 }}><Icon name={icon} size={26} /></div>
                <div style={{ fontWeight: 700, fontSize: 15, color: "#1a1a1a", marginBottom: 4 }}>{label}</div>
                <div style={{ fontSize: 13, color: "#999" }}>{sub}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 6. БОНУСЫ ── */}
      <section style={{ padding: "80px 0 0" }}>
        <div style={{ maxWidth: 900, margin: "0 auto", padding: "0 24px" }}>
          <h2 style={h2style}>Бонусы участника</h2>
          {/* Плашка онлайн-доступ */}
          <div style={{
            background: `linear-gradient(135deg, ${ACCENT}18 0%, ${ACCENT}08 100%)`,
            border: `2px solid ${ACCENT}40`,
            borderRadius: 16, padding: "20px 24px",
            display: "flex", alignItems: "center", gap: 16,
            marginBottom: 16,
          }}>
            <div style={{ flexShrink: 0, background: ACCENT, borderRadius: 12, padding: 10 }}>
              <Icon name="PlayCircle" size={28} style={{ color: "#fff" }} />
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: 16, color: "#1a1a1a", marginBottom: 4 }}>
                Онлайн-доступ к техникам интенсива
              </div>
              <div style={{ fontSize: 14, color: "#555", lineHeight: 1.5 }}>
                После мероприятия вы получите доступ к онлайн-урокам по всем техникам, которые проходили на интенсиве — для повторения и закрепления
              </div>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }} className="bonuses-grid">
            {[
              { icon: "FileText", title: "Чек-лист диагностики", text: "Готовый инструмент для регулярного анализа своей практики" },
              { icon: "BookOpen", title: "Скрипты общения", text: "Готовые фразы для работы с возражениями и повышения чека" },
              { icon: "MessageCircle", title: "Чат участников", text: "Закрытый чат для поддержки и обмена опытом после интенсива" },
            ].map(({ icon, title, text }) => (
              <div key={title} style={{ background: "#fff", border: "1px solid #e8e8e4", borderRadius: 16, padding: "22px 20px", display: "flex", gap: 16 }}>
                <div style={{ color: ACCENT, flexShrink: 0 }}><Icon name={icon} size={24} /></div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 6, color: "#1a1a1a" }}>{title}</div>
                  <div style={{ fontSize: 13.5, color: "#666", lineHeight: 1.6 }}>{text}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 7. ДЛЯ ИНОГОРОДНИХ ── */}
      <section style={{ padding: "80px 0 0" }}>
        <div style={{ maxWidth: 800, margin: "0 auto", padding: "0 24px" }}>
          <div style={{ background: "#fff", border: "1px solid #e8e8e4", borderRadius: 20, padding: "36px 40px" }}>
            <h2 style={{ ...h2style, marginBottom: 20 }}>Приедете из другого города?</h2>
            <p style={{ fontSize: 15, color: "#555", lineHeight: 1.7, margin: "0 0 20px" }}>
              Мы поможем с организацией поездки: расскажем о ближайших гостиницах, поможем скоординировать время приезда и ответим на вопросы.
            </p>
            <div style={{ display: "flex", gap: 24, flexWrap: "wrap" }}>
              {[
                { icon: "Hotel", text: "Варианты жилья рядом" },
                { icon: "MapPin", text: "Удобное расположение" },
                { icon: "Phone", text: "Помощь в организации" },
              ].map(({ icon, text }) => (
                <div key={text} style={{ display: "flex", gap: 8, alignItems: "center", fontSize: 14, color: "#444" }}>
                  <span style={{ color: ACCENT }}><Icon name={icon} size={16} /></span>
                  {text}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── 8. ОБ АВТОРЕ ── */}
      <section style={{ padding: "80px 0 0" }}>
        <div style={{ maxWidth: 1000, margin: "0 auto", padding: "0 24px" }}>
          <h2 style={h2style}>Об авторе</h2>
          <div style={{
            background: "#fff",
            border: "1px solid #e8e8e4",
            borderRadius: 24,
            overflow: "hidden",
            display: "grid",
            gridTemplateColumns: "320px 1fr",
            boxShadow: "0 4px 24px rgba(0,0,0,0.07)",
          }} className="course-author-grid">
            <div style={{ position: "relative", minHeight: 380 }}>
              <img
                src="https://cdn.poehali.dev/projects/10f61e56-9821-40f3-b705-3590ddaffd08/bucket/e1094aa6-0054-4675-a2d2-f6112eab1bf6.png"
                alt="Сергей Водопьянов"
                style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "top center", display: "block", minHeight: 380 }}
              />
            </div>
            <div style={{ padding: "40px 44px" }} className="course-author-pad">
              <div style={{ fontSize: 12, fontWeight: 700, color: ACCENT, textTransform: "uppercase", letterSpacing: 1, marginBottom: 12 }}>
                Автор курса
              </div>
              <h3 style={{ fontFamily: "Cormorant, serif", fontSize: 32, fontWeight: 700, margin: "0 0 6px", color: "#1a1a1a" }}>
                Сергей Водопьянов
              </h3>
              <p style={{ color: "#999", fontSize: 14, margin: "0 0 20px" }}>
                Остеопат · 17 лет опыта ·{" "}
                <a href="https://assotsiatsiya-osteopatov.ru/user/svodopianoff/" target="_blank" rel="noopener noreferrer" style={{ color: ACCENT, textDecoration: "none" }}>Член Российской остеопатической ассоциации</a>
              </p>
              <p style={{ fontSize: 15, color: "#555", lineHeight: 1.75, margin: "0 0 28px" }}>
                За годы практики работал с тысячами людей, помогая улучшить самочувствие при болях в спине и шее, восстановить осанку. Специализируется на работе с офисными сотрудниками, спортсменами и беременными женщинами.
              </p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
                {[
                  { value: "17", label: "лет практики" },
                  { value: "3000+", label: "консультаций" },
                  { value: "Автор", label: "курсов Dok Диалог" },
                  { value: "РОА", label: "сертификат" },
                ].map(({ value, label }) => (
                  <div key={label} style={{ background: BG, borderRadius: 12, padding: "12px 20px", textAlign: "center", minWidth: 90 }}>
                    <div style={{ fontFamily: "Cormorant, serif", fontSize: 24, fontWeight: 700, color: ACCENT, lineHeight: 1 }}>{value}</div>
                    <div style={{ fontSize: 11, color: "#888", marginTop: 4, lineHeight: 1.3 }}>{label}</div>
                  </div>
                ))}
                <a href="https://massopro.ru/catalog/1" target="_blank" rel="noopener noreferrer" style={{ background: BG, borderRadius: 12, padding: "12px 20px", textAlign: "center", minWidth: 90, textDecoration: "none" }}>
                  <div style={{ fontFamily: "Cormorant, serif", fontSize: 24, fontWeight: 700, color: ACCENT, lineHeight: 1 }}>5.0</div>
                  <div style={{ fontSize: 11, color: "#888", marginTop: 4, lineHeight: 1.3 }}>MassoPRO</div>
                </a>
                <a href="https://yandex.com/maps/org/osteopat_plyus/99582120415/reviews/" target="_blank" rel="noopener noreferrer" style={{ background: BG, borderRadius: 12, padding: "12px 20px", textAlign: "center", minWidth: 90, textDecoration: "none" }}>
                  <div style={{ fontFamily: "Cormorant, serif", fontSize: 24, fontWeight: 700, color: ACCENT, lineHeight: 1 }}>5.0</div>
                  <div style={{ fontSize: 11, color: "#888", marginTop: 4, lineHeight: 1.3 }}>Отзывы Яндекс</div>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 9. ОТЗЫВЫ ── */}
      <section style={{ padding: "80px 0 0" }}>
        <div style={{ maxWidth: 900, margin: "0 auto", padding: "0 24px" }}>
          <h2 style={h2style}>Отзывы участников</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 24 }} className="reviews-grid">
            {[
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
              {
                name: "Ксения М.",
                text: "До этого было 3–4 клиента в месяц. После интенсива выстроила систему — теперь стабильная запись на 3 недели вперёд.",
                img: "https://cdn.poehali.dev/projects/10f61e56-9821-40f3-b705-3590ddaffd08/files/86c97297-9734-4b88-a25c-081613ef18ff.jpg",
              },
              {
                name: "Артём В.",
                text: "Скептически относился к «маркетингу для массажистов». Но интенсив — это конкретные шаги, а не теория. Клиентов получил ещё в процессе.",
                img: "https://cdn.poehali.dev/projects/10f61e56-9821-40f3-b705-3590ddaffd08/files/61d79a41-ee5a-422e-b4d7-8f401bd382d4.jpg",
              },
            ].map((r) => (
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

      {/* ── 10. БЛОК ОПЛАТЫ (повтор) ── */}
      <PricingBlock />

      {/* ── 10. FAQ ── */}
      <section style={{ padding: "80px 0" }}>
        <div style={{ maxWidth: 720, margin: "0 auto", padding: "0 24px" }}>
          <h2 style={h2style}>Частые вопросы</h2>
          <AccordionItem title="Для кого подходит интенсив?">
            Для практикующих массажистов, которые хотят увеличить доход, выстроить поток клиентов или разобраться, почему практика «застыла». Подойдёт и новичкам, которые хотят сразу выстроить правильную систему.
          </AccordionItem>
          <AccordionItem title="Нужен ли опыт?">
            Опыт в массаже желателен, но необязателен. Главное — желание разобраться в системе и готовность работать.
          </AccordionItem>
          <AccordionItem title="Что будет после оплаты?">
            Мы свяжемся с вами в течение 24 часов, уточним детали и пришлём всю информацию о встрече.
          </AccordionItem>
          <AccordionItem title="Чем отличается бронь от полной оплаты?">
            При брони вы фиксируете место, но доплачиваете 13 000 руб. до мероприятия — итого 15 000 руб. При полной оплате сейчас — 9 900 руб. Экономия 5 100 руб.
          </AccordionItem>
          <AccordionItem title="Можно ли вернуть деньги?">
            Да, если вы отменяете участие не менее чем за 7 дней до мероприятия — возвращаем полную сумму.
          </AccordionItem>
        </div>
      </section>

      <style>{`
        @media (max-width: 860px) {
          .coi-hero-grid { grid-template-columns: 1fr !important; }
          .pricing-grid { grid-template-columns: 1fr !important; }
          .compare-grid { grid-template-columns: 1fr !important; }
          .results-grid { grid-template-columns: 1fr 1fr !important; }
          .format-grid { grid-template-columns: 1fr 1fr !important; }
          .bonuses-grid { grid-template-columns: 1fr !important; }
          .author-block { flex-direction: column !important; }
          .problems-grid { grid-template-columns: 1fr !important; }
          .course-author-grid { grid-template-columns: 1fr !important; }
          .course-author-pad { padding: 28px 24px !important; }
          .reviews-grid { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 500px) {
          .results-grid { grid-template-columns: 1fr !important; }
          .format-grid { grid-template-columns: 1fr 1fr !important; }
          .coi-hero-btns { flex-direction: column !important; }
        }
      `}</style>
      <DokFooter />
    </div>
  );
}