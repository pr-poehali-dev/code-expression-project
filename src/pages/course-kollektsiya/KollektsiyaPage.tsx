import Icon from "@/components/ui/icon";
import DiscountTimer from "@/components/ui/DiscountTimer";
import { useDiscountTimer } from "@/hooks/useDiscountTimer";

const ACCENT = "hsl(185, 85%, 32%)";
const ACCENT_DARK = "hsl(185, 85%, 26%)";
const ACCENT_SHADOW = "hsla(185, 85%, 32%, 0.25)";
const GOLD = "#d4a017";
const GOLD_BG = "#fdf8ec";

const RETAIL_PRICE = 77600;
const DISCOUNT_PRICE = 23280;

const BUY_URL_RETAIL = "https://school.brossok.ru/buy/15";
const BUY_URL_DISCOUNT = "https://school.brossok.ru/buy/15";

const COURSES = [
  {
    id: 1,
    title: "Профессия массажист с нуля",
    subtitle: "Первый доход за 30 дней",
    price: "19 900 ₽",
    tag: "Новичкам",
    tagColor: ACCENT,
    icon: "GraduationCap",
    bullets: ["Базовые техники с нуля", "Практика с первого дня", "Без медобразования"],
    url: "/course/massazhist-s-nulya",
  },
  {
    id: 3,
    title: "Готовые протоколы массажа",
    subtitle: "Боль, стресс, зажимы",
    price: "19 900 ₽",
    tag: "Система",
    tagColor: "#7c3aed",
    icon: "BookOpen",
    bullets: ["Чёткие схемы работы", "Уверенность на сеансе", "Протоколы под любую жалобу"],
    url: "/course/gotovye-protokoly-massazha",
  },
  {
    id: 4,
    title: "Антистресс-техники массажа",
    subtitle: "Эффект сеанса ×2",
    price: "14 900 ₽",
    tag: "Апгрейд",
    tagColor: "#f59e0b",
    icon: "Zap",
    bullets: ["Техники из нейромассажа", "Клиенты рекомендуют вас", "Повышение среднего чека"],
    url: "/course/antistress-tehniki-massazha",
  },
  {
    id: 5,
    title: "Коррекция фигуры",
    subtitle: "Результаты за которые платят",
    price: "16 900 ₽",
    tag: "Высокий чек",
    tagColor: "#e11d48",
    icon: "TrendingUp",
    bullets: ["Антицеллюлитные программы", "Моделирование тела", "Клиенты платят охотно"],
    url: "/course/korrektsiya-figury",
  },
  {
    id: 6,
    title: "Висцеральный массаж с нуля",
    subtitle: "Старт без медобразования",
    price: "4 990 ₽",
    tag: "Быстрый старт",
    tagColor: "#059669",
    icon: "Heart",
    bullets: ["Безопасная техника", "Уникальная услуга", "Высокая востребованность"],
    url: "/course/visceralny-massazh-s-nulya",
  },
  {
    id: 7,
    title: "Массажист с потоком клиентов",
    subtitle: "От 0 до стабильной записи",
    price: "14 900 ₽",
    tag: "Бизнес",
    tagColor: "#0284c7",
    icon: "Users",
    bullets: ["Маркетинг и продвижение", "Личный бренд", "Стабильный поток записей"],
    url: "/course/massazhist-s-potokom-klientov",
  },
  {
    id: 202,
    title: "Фитнес для беременных",
    subtitle: "2-й триместр",
    price: "5 590 ₽",
    tag: "Специализация",
    tagColor: "#db2777",
    icon: "Baby",
    bullets: ["Уникальная целевая аудитория", "Безопасные протоколы", "Высокая лояльность клиенток"],
    url: "/course/fitnes-beremennyh",
  },
];

const OUTCOMES = [
  { icon: "Award", title: "Профессиональный массажист", text: "С нуля до уверенного специалиста — весь путь системно и без лишних затрат" },
  { icon: "TrendingUp", title: "Растущий доход", text: "Базовые техники, апгрейд услуг, коррекция фигуры — каждый курс увеличивает ваш средний чек" },
  { icon: "Users", title: "Стабильный поток клиентов", text: "Маркетинг, личный бренд и реклама — клиенты будут сами находить вас" },
  { icon: "Layers", title: "7 специализаций", text: "Антистресс, висцеральный, коррекция, протоколы — охват разной аудитории = разные источники дохода" },
  { icon: "Clock", title: "Обучение в своём темпе", text: "Все курсы доступны сразу, без дедлайнов — учитесь тогда, когда удобно" },
  { icon: "Infinity", title: "Пожизненный доступ", text: "Все материалы, обновления и новые уроки — навсегда, не нужно платить повторно" },
];

function BtnBuy({ children, href }: { children: React.ReactNode; href: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      style={{
        display: "inline-flex", alignItems: "center", justifyContent: "center",
        background: `linear-gradient(135deg, ${ACCENT}, ${ACCENT_DARK})`,
        color: "#fff", padding: "18px 48px", borderRadius: 14,
        fontSize: 17, fontWeight: 700, textDecoration: "none",
        boxShadow: `0 8px 32px ${ACCENT_SHADOW}`,
        transition: "all 0.2s", letterSpacing: 0.3,
        fontFamily: "Montserrat, sans-serif",
      }}
      onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.transform = "translateY(-2px)"; (e.currentTarget as HTMLAnchorElement).style.boxShadow = `0 14px 40px ${ACCENT_SHADOW}`; }}
      onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.transform = ""; (e.currentTarget as HTMLAnchorElement).style.boxShadow = `0 8px 32px ${ACCENT_SHADOW}`; }}
    >
      {children}
    </a>
  );
}

export default function KollektsiyaPage() {
  const { isActive } = useDiscountTimer();
  const buyUrl = isActive ? BUY_URL_DISCOUNT : BUY_URL_RETAIL;
  const currentPrice = isActive ? DISCOUNT_PRICE : RETAIL_PRICE;

  return (
    <div style={{ background: "#f8f8f6", minHeight: "100vh", paddingTop: 80 }}>
      <style>{`
        .koll-hero-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 60px; align-items: center; }
        .koll-courses-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; }
        .koll-outcomes-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; }
        @media (max-width: 900px) {
          .koll-hero-grid { grid-template-columns: 1fr; gap: 40px; }
          .koll-courses-grid { grid-template-columns: repeat(2, 1fr); }
          .koll-outcomes-grid { grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 600px) {
          .koll-courses-grid { grid-template-columns: 1fr; }
          .koll-outcomes-grid { grid-template-columns: 1fr; }
        }
      `}</style>

      {/* ── HERO ─────────────────────────────────── */}
      <section style={{
        background: `linear-gradient(135deg, #0d2b2e 0%, #0a3d40 50%, #0d2b2e 100%)`,
        padding: "80px 0 90px",
        position: "relative",
        overflow: "hidden",
      }}>
        <div style={{
          position: "absolute", inset: 0,
          backgroundImage: `radial-gradient(ellipse at 20% 50%, hsla(185,85%,32%,0.18) 0%, transparent 60%), radial-gradient(ellipse at 80% 20%, hsla(185,85%,50%,0.1) 0%, transparent 50%)`,
          pointerEvents: "none",
        }} />
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 24px", position: "relative" }}>
          <div className="koll-hero-grid">
            <div>
              <a href="/catalog/private" style={{ display: "inline-flex", alignItems: "center", gap: 6, color: "rgba(255,255,255,0.5)", fontSize: 13, textDecoration: "none", marginBottom: 28 }}>
                <Icon name="ArrowLeft" size={13} />
                Все курсы
              </a>

              <div style={{
                display: "inline-flex", alignItems: "center", gap: 8,
                background: `linear-gradient(135deg, ${GOLD}22, ${GOLD}11)`,
                border: `1px solid ${GOLD}44`,
                color: GOLD, fontSize: 12, fontWeight: 700,
                padding: "6px 16px", borderRadius: 20, marginBottom: 20,
                letterSpacing: 0.8,
              }}>
                <Icon name="Crown" size={13} />
                ПОЛНАЯ КОЛЛЕКЦИЯ · 7 КУРСОВ
              </div>

              <h1 style={{
                fontFamily: "Cormorant, serif",
                fontSize: "clamp(32px, 4.5vw, 54px)",
                fontWeight: 700,
                lineHeight: 1.12,
                margin: "0 0 20px",
                color: "#fff",
              }}>
                Всё для роста<br />
                <span style={{ color: `hsl(185, 85%, 55%)` }}>в одном комплекте</span>
              </h1>

              <p style={{ fontSize: 17, color: "rgba(255,255,255,0.7)", lineHeight: 1.7, margin: "0 0 32px", maxWidth: 480 }}>
                7 курсов от базовых техник до маркетинга и привлечения клиентов. Полный путь от новичка до востребованного специалиста с очередью.
              </p>

              <div style={{ marginBottom: 32 }}>
                {isActive ? (
                  <div>
                    <DiscountTimer
                      oldPrice={`${RETAIL_PRICE.toLocaleString("ru-RU")} ₽`}
                      newPrice={`${DISCOUNT_PRICE.toLocaleString("ru-RU")} ₽`}
                      accent="hsl(185, 85%, 55%)"
                      size="lg"
                    />
                    <div style={{ fontSize: 13, color: "rgba(255,255,255,0.45)", marginTop: 8 }}>
                      Розничная стоимость 7 курсов по отдельности — 97 080 ₽
                    </div>
                  </div>
                ) : (
                  <div>
                    <div style={{ fontSize: 13, color: "rgba(255,255,255,0.5)", textDecoration: "line-through", marginBottom: 4 }}>
                      97 080 ₽ (при покупке каждого курса отдельно)
                    </div>
                    <div style={{ fontFamily: "Cormorant, serif", fontSize: 52, fontWeight: 700, color: "#fff", lineHeight: 1 }}>
                      {RETAIL_PRICE.toLocaleString("ru-RU")} ₽
                    </div>
                    <div style={{ fontSize: 13, color: "rgba(255,255,255,0.45)", marginTop: 4 }}>уже со скидкой 20% за опт</div>
                  </div>
                )}
              </div>

              <div style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
                <BtnBuy href={buyUrl}>
                  {isActive
                    ? `Купить коллекцию — ${DISCOUNT_PRICE.toLocaleString("ru-RU")} ₽`
                    : `Купить коллекцию — ${RETAIL_PRICE.toLocaleString("ru-RU")} ₽`
                  }
                </BtnBuy>
              </div>
            </div>

            {/* Right side — course stack visual */}
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {[
                { color: ACCENT, label: "Профессия массажист с нуля", price: "19 900 ₽" },
                { color: "#7c3aed", label: "Готовые протоколы массажа", price: "19 900 ₽" },
                { color: "#f59e0b", label: "Антистресс-техники", price: "14 900 ₽" },
                { color: "#e11d48", label: "Коррекция фигуры", price: "16 900 ₽" },
                { color: "#059669", label: "Висцеральный массаж", price: "4 990 ₽" },
                { color: "#0284c7", label: "Массажист с потоком клиентов", price: "14 900 ₽" },
                { color: "#db2777", label: "Фитнес для беременных", price: "5 590 ₽" },
              ].map((c, i) => (
                <div key={i} style={{
                  background: "rgba(255,255,255,0.06)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderLeft: `3px solid ${c.color}`,
                  borderRadius: 10,
                  padding: "10px 16px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 12,
                }}>
                  <span style={{ fontSize: 13, color: "rgba(255,255,255,0.8)", fontWeight: 500 }}>{c.label}</span>
                  <span style={{ fontSize: 13, color: "rgba(255,255,255,0.4)", textDecoration: "line-through", flexShrink: 0 }}>{c.price}</span>
                </div>
              ))}
              <div style={{
                background: `linear-gradient(135deg, ${ACCENT}33, ${ACCENT}11)`,
                border: `1px solid ${ACCENT}55`,
                borderRadius: 10,
                padding: "12px 16px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}>
                <span style={{ fontSize: 14, color: "#fff", fontWeight: 700 }}>Итого в коллекции</span>
                <span style={{ fontSize: 16, color: `hsl(185,85%,55%)`, fontWeight: 700 }}>
                  {currentPrice.toLocaleString("ru-RU")} ₽
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── ЧТО ВЫ ПОЛУЧИТЕ ──────────────────────── */}
      <section style={{ padding: "80px 0 0" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 24px" }}>
          <div style={{ textAlign: "center", marginBottom: 52 }}>
            <div style={{ display: "inline-block", background: `${ACCENT}15`, color: ACCENT, fontSize: 12, fontWeight: 700, padding: "4px 14px", borderRadius: 20, marginBottom: 12, letterSpacing: 0.5 }}>
              РЕЗУЛЬТАТ ОБУЧЕНИЯ
            </div>
            <h2 style={{ fontFamily: "Cormorant, serif", fontSize: "clamp(28px, 3.5vw, 42px)", fontWeight: 700, lineHeight: 1.2, margin: 0 }}>
              Что вы получите<br />после прохождения коллекции
            </h2>
          </div>

          <div className="koll-outcomes-grid">
            {OUTCOMES.map((o, i) => (
              <div key={i} style={{
                background: "#fff",
                borderRadius: 18,
                padding: "28px 24px",
                border: "1px solid #e8e8e4",
                boxShadow: "0 2px 16px rgba(0,0,0,0.05)",
              }}>
                <div style={{
                  width: 48, height: 48, borderRadius: 14,
                  background: `${ACCENT}15`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  marginBottom: 16,
                }}>
                  <Icon name={o.icon} size={22} style={{ color: ACCENT }} />
                </div>
                <div style={{ fontSize: 15, fontWeight: 700, color: "#1a1a1a", marginBottom: 8 }}>{o.title}</div>
                <div style={{ fontSize: 14, color: "#666", lineHeight: 1.6 }}>{o.text}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── КУРСЫ КОЛЛЕКЦИИ ───────────────────────── */}
      <section style={{ padding: "80px 0 0" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 24px" }}>
          <div style={{ textAlign: "center", marginBottom: 52 }}>
            <div style={{ display: "inline-block", background: `${ACCENT}15`, color: ACCENT, fontSize: 12, fontWeight: 700, padding: "4px 14px", borderRadius: 20, marginBottom: 12, letterSpacing: 0.5 }}>
              7 КУРСОВ В ОДНОМ
            </div>
            <h2 style={{ fontFamily: "Cormorant, serif", fontSize: "clamp(28px, 3.5vw, 42px)", fontWeight: 700, lineHeight: 1.2, margin: 0 }}>
              Что входит в коллекцию
            </h2>
            <p style={{ fontSize: 16, color: "#888", marginTop: 12 }}>Полный путь от первого сеанса до стабильного потока клиентов</p>
          </div>

          <div className="koll-courses-grid">
            {COURSES.map((c, i) => (
              <a
                key={c.id}
                href={c.url}
                style={{ textDecoration: "none", color: "inherit" }}
              >
                <div style={{
                  background: "#fff",
                  borderRadius: 18,
                  padding: "24px",
                  border: "1px solid #e8e8e4",
                  boxShadow: "0 2px 16px rgba(0,0,0,0.05)",
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  cursor: "pointer",
                  transition: "all 0.22s ease",
                }}
                  onMouseEnter={e => {
                    const el = e.currentTarget as HTMLDivElement;
                    el.style.transform = "translateY(-4px)";
                    el.style.boxShadow = "0 16px 48px rgba(0,0,0,0.12)";
                  }}
                  onMouseLeave={e => {
                    const el = e.currentTarget as HTMLDivElement;
                    el.style.transform = "";
                    el.style.boxShadow = "0 2px 16px rgba(0,0,0,0.05)";
                  }}
                >
                  <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 16 }}>
                    <div style={{
                      width: 44, height: 44, borderRadius: 12,
                      background: `${c.tagColor}15`,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      flexShrink: 0,
                    }}>
                      <Icon name={c.icon} size={20} style={{ color: c.tagColor }} />
                    </div>
                    <div style={{
                      fontSize: 11, fontWeight: 700, color: c.tagColor,
                      background: `${c.tagColor}12`,
                      padding: "3px 10px", borderRadius: 20,
                      letterSpacing: 0.3,
                    }}>
                      {c.tag}
                    </div>
                  </div>

                  <div style={{ fontSize: 15, fontWeight: 700, color: "#1a1a1a", lineHeight: 1.35, marginBottom: 4 }}>{c.title}</div>
                  <div style={{ fontSize: 13, color: "#888", marginBottom: 14 }}>{c.subtitle}</div>

                  <ul style={{ margin: "0 0 auto", padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 6 }}>
                    {c.bullets.map((b, j) => (
                      <li key={j} style={{ display: "flex", gap: 8, alignItems: "flex-start", fontSize: 13, color: "#555", lineHeight: 1.4 }}>
                        <span style={{ color: c.tagColor, marginTop: 2, flexShrink: 0 }}>✓</span>
                        {b}
                      </li>
                    ))}
                  </ul>

                  <div style={{
                    marginTop: 18, paddingTop: 16,
                    borderTop: "1px solid #f0f0ec",
                    display: "flex", alignItems: "center", justifyContent: "space-between",
                  }}>
                    <span style={{ fontSize: 14, color: "#aaa", textDecoration: "line-through" }}>{c.price}</span>
                    <span style={{ fontSize: 12, color: ACCENT, fontWeight: 600, display: "flex", alignItems: "center", gap: 4 }}>
                      <Icon name="CheckCircle" size={13} />
                      Входит в коллекцию
                    </span>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ── ПОЧЕМУ КОЛЛЕКЦИЯ ВЫГОДНЕЕ ─────────────── */}
      <section style={{ padding: "80px 0 0" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 24px" }}>
          <div style={{
            background: GOLD_BG,
            border: `1.5px solid ${GOLD}44`,
            borderRadius: 24,
            padding: "48px 40px",
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 48,
            alignItems: "center",
          }} className="koll-promo-inner">
            <style>{`.koll-promo-inner { } @media (max-width: 700px) { .koll-promo-inner { grid-template-columns: 1fr !important; } }`}</style>
            <div>
              <div style={{ display: "inline-flex", alignItems: "center", gap: 8, color: GOLD, fontSize: 13, fontWeight: 700, marginBottom: 16 }}>
                <Icon name="TrendingDown" size={16} />
                ПОЧЕМУ ЭТО ВЫГОДНО
              </div>
              <h3 style={{ fontFamily: "Cormorant, serif", fontSize: "clamp(24px, 3vw, 36px)", fontWeight: 700, lineHeight: 1.2, margin: "0 0 20px" }}>
                7 курсов дешевле,<br />чем 2 по отдельности
              </h3>
              <p style={{ fontSize: 15, color: "#666", lineHeight: 1.7, margin: 0 }}>
                При покупке каждого курса отдельно вы заплатите <strong>97 080 ₽</strong>. В коллекции вы получаете все 7 курсов за <strong>{RETAIL_PRICE.toLocaleString("ru-RU")} ₽</strong> — это скидка <strong>20%</strong> за оптовую покупку. А во время акции — ещё выгоднее.
              </p>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {[
                { label: "7 курсов по отдельности", value: "97 080 ₽", strike: true, color: "#999" },
                { label: "Коллекция (−20% опт)", value: `${RETAIL_PRICE.toLocaleString("ru-RU")} ₽`, strike: false, color: "#1a1a1a" },
                { label: "Акционная цена (−70%)", value: `${DISCOUNT_PRICE.toLocaleString("ru-RU")} ₽`, strike: false, color: ACCENT, bold: true },
              ].map((row, i) => (
                <div key={i} style={{
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                  padding: "14px 20px",
                  background: row.bold ? `${ACCENT}10` : "#fff",
                  borderRadius: 12,
                  border: row.bold ? `1.5px solid ${ACCENT}40` : "1px solid #e8e8e4",
                }}>
                  <span style={{ fontSize: 14, color: "#555" }}>{row.label}</span>
                  <span style={{
                    fontSize: row.bold ? 18 : 15,
                    fontWeight: row.bold ? 700 : 600,
                    color: row.color,
                    textDecoration: row.strike ? "line-through" : "none",
                  }}>
                    {row.value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── КОМУ ПОДХОДИТ ─────────────────────────── */}
      <section style={{ padding: "80px 0 0" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 24px" }}>
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <h2 style={{ fontFamily: "Cormorant, serif", fontSize: "clamp(28px, 3.5vw, 42px)", fontWeight: 700, lineHeight: 1.2, margin: 0 }}>
              Коллекция создана для вас, если...
            </h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 16 }} className="koll-for-grid">
            <style>{`.koll-for-grid { } @media (max-width: 600px) { .koll-for-grid { grid-template-columns: 1fr !important; } }`}</style>
            {[
              { icon: "Sprout", text: "Вы только начинаете и хотите освоить профессию с нуля, без медобразования" },
              { icon: "TrendingUp", text: "Вы уже делаете массаж, но хотите поднять чек и расширить список услуг" },
              { icon: "UserPlus", text: "Клиентов мало или нет совсем — хотите выстроить стабильный поток" },
              { icon: "Globe", text: "Хотите работать с разными аудиториями: беременные, спортсмены, клиенты с болью" },
              { icon: "Wallet", text: "Понимаете, что выгоднее купить всё сейчас и учиться в своём темпе" },
              { icon: "BookOpen", text: "Ищете полноценную систему, а не разрозненные уроки" },
            ].map((item, i) => (
              <div key={i} style={{
                display: "flex", alignItems: "flex-start", gap: 14,
                background: "#fff", borderRadius: 14, padding: "18px 20px",
                border: "1px solid #e8e8e4",
              }}>
                <div style={{
                  width: 36, height: 36, borderRadius: 10,
                  background: `${ACCENT}15`, display: "flex", alignItems: "center", justifyContent: "center",
                  flexShrink: 0,
                }}>
                  <Icon name={item.icon} size={17} style={{ color: ACCENT }} />
                </div>
                <span style={{ fontSize: 15, color: "#444", lineHeight: 1.6 }}>{item.text}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── ФИНАЛЬНЫЙ CTA ────────────────────────── */}
      <section style={{ padding: "80px 0 100px" }}>
        <div style={{ maxWidth: 700, margin: "0 auto", padding: "0 24px", textAlign: "center" }}>
          <div style={{
            background: `linear-gradient(135deg, #0d2b2e, #0a3d40)`,
            borderRadius: 28,
            padding: "56px 48px",
            color: "#fff",
            position: "relative",
            overflow: "hidden",
          }}>
            <div style={{
              position: "absolute", inset: 0,
              backgroundImage: `radial-gradient(ellipse at 50% 0%, hsla(185,85%,32%,0.25) 0%, transparent 60%)`,
              pointerEvents: "none",
            }} />
            <div style={{ position: "relative" }}>
              <div style={{ fontSize: 36, marginBottom: 12 }}>🏆</div>
              <h2 style={{
                fontFamily: "Cormorant, serif", fontSize: "clamp(26px, 3.5vw, 38px)",
                fontWeight: 700, lineHeight: 1.2, margin: "0 0 16px", color: "#fff",
              }}>
                Полная коллекция курсов
              </h2>
              <p style={{ fontSize: 16, color: "rgba(255,255,255,0.7)", lineHeight: 1.7, margin: "0 0 32px" }}>
                7 курсов. Один раз — и навсегда. Весь путь от новичка до профессионала с потоком клиентов.
              </p>

              <div style={{ marginBottom: 28 }}>
                {isActive ? (
                  <DiscountTimer
                    oldPrice={`${RETAIL_PRICE.toLocaleString("ru-RU")} ₽`}
                    newPrice={`${DISCOUNT_PRICE.toLocaleString("ru-RU")} ₽`}
                    accent="hsl(185, 85%, 55%)"
                    size="lg"
                  />
                ) : (
                  <div style={{ fontFamily: "Cormorant, serif", fontSize: 48, fontWeight: 700, color: "#fff", lineHeight: 1 }}>
                    {RETAIL_PRICE.toLocaleString("ru-RU")} ₽
                  </div>
                )}
              </div>

              <BtnBuy href={buyUrl}>
                {isActive
                  ? `Купить за ${DISCOUNT_PRICE.toLocaleString("ru-RU")} ₽`
                  : `Купить за ${RETAIL_PRICE.toLocaleString("ru-RU")} ₽`
                }
              </BtnBuy>

              <div style={{ fontSize: 13, color: "rgba(255,255,255,0.4)", marginTop: 16 }}>
                Пожизненный доступ ко всем курсам и обновлениям
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
