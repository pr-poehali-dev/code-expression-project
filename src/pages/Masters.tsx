import { useState } from "react";
import { Link } from "react-router-dom";
import Icon from "@/components/ui/icon";
import BrandLogo from "@/components/BrandLogo";

const TEAL = "#2DD4BF";
const TEAL2 = "#14B8A6";
const DARK = "#0F172A";
const DARK2 = "#080E1C";
const GRAY = "#64748B";
const SERIF = "'Cormorant Garamond', serif";
const GOLD = "#C9A96E";

// ── Калькулятор ───────────────────────────────────────────────────────────────
function Calculator() {
  const [salons, setSalons] = useState(2);
  const [spend, setSpend] = useState(3000);
  const monthly = Math.round(salons * spend * 0.1);
  const yearly = monthly * 12;

  return (
    <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(45,212,191,0.2)", borderRadius: 24, padding: "40px 36px", maxWidth: 560, margin: "0 auto" }}>
      <div style={{ fontSize: 12, color: TEAL, fontWeight: 600, letterSpacing: 2, textTransform: "uppercase", marginBottom: 28 }}>Посчитайте свой доход</div>

      <div style={{ marginBottom: 28 }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
          <span style={{ fontSize: 14, color: "rgba(255,255,255,0.7)" }}>Количество приглашённых салонов</span>
          <span style={{ fontSize: 20, fontWeight: 700, color: "#fff" }}>{salons}</span>
        </div>
        <input type="range" min={1} max={20} value={salons} onChange={e => setSalons(+e.target.value)}
          style={{ width: "100%", accentColor: TEAL, cursor: "pointer" }} />
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "rgba(255,255,255,0.3)", marginTop: 4 }}>
          <span>1 салон</span><span>20 салонов</span>
        </div>
      </div>

      <div style={{ marginBottom: 36 }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
          <span style={{ fontSize: 14, color: "rgba(255,255,255,0.7)" }}>Среднемесячные траты салона</span>
          <span style={{ fontSize: 20, fontWeight: 700, color: "#fff" }}>{spend.toLocaleString("ru-RU")} ₽</span>
        </div>
        <input type="range" min={1000} max={15000} step={500} value={spend} onChange={e => setSpend(+e.target.value)}
          style={{ width: "100%", accentColor: TEAL, cursor: "pointer" }} />
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "rgba(255,255,255,0.3)", marginTop: 4 }}>
          <span>1 000 ₽</span><span>15 000 ₽</span>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <div style={{ background: "rgba(45,212,191,0.08)", border: "1px solid rgba(45,212,191,0.2)", borderRadius: 16, padding: "20px 22px" }}>
          <div style={{ fontSize: 11, color: TEAL, fontWeight: 600, letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 8 }}>В месяц</div>
          <div style={{ fontSize: 32, fontWeight: 700, color: "#fff", fontFamily: SERIF }}>{monthly.toLocaleString("ru-RU")} ₽</div>
        </div>
        <div style={{ background: `linear-gradient(135deg, rgba(45,212,191,0.15), rgba(20,184,166,0.08))`, border: "1px solid rgba(45,212,191,0.3)", borderRadius: 16, padding: "20px 22px" }}>
          <div style={{ fontSize: 11, color: TEAL, fontWeight: 600, letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 8 }}>В год</div>
          <div style={{ fontSize: 32, fontWeight: 700, color: TEAL, fontFamily: SERIF }}>{yearly.toLocaleString("ru-RU")} ₽</div>
        </div>
      </div>

      <div style={{ marginTop: 20, padding: "12px 16px", background: "rgba(255,255,255,0.03)", borderRadius: 10, fontSize: 12, color: "rgba(255,255,255,0.4)", lineHeight: 1.6 }}>
        10% с каждой траты салона · выплата через 30 дней · без срока давности
      </div>
    </div>
  );
}

// ── Главный компонент ─────────────────────────────────────────────────────────
export default function Masters() {
  const [menuOpen, setMenuOpen] = useState(false);

  const steps = [
    { num: "01", icon: "UserPlus", title: "Зарегистрируйтесь", desc: "Создайте аккаунт за 2 минуты. Прочитайте договор-оферту и примите условия участия." },
    { num: "02", icon: "Link", title: "Получите ссылку", desc: "Вам выдаётся персональная реферальная ссылка. Её можно отправить любому владельцу салона." },
    { num: "03", icon: "Send", title: "Пригласите руководство", desc: "Поделитесь ссылкой с владельцем вашего салона или любого другого. Они зарегистрируются — вы будете привязаны автоматически." },
    { num: "04", icon: "Wallet", title: "Получайте доход", desc: "10% с каждой траты салона поступают на ваш баланс. Через 30 дней сумма становится доступной к выводу." },
  ];

  const benefits = [
    { icon: "Infinity", title: "Без срока давности", desc: "Даже если вы сменили место работы — вознаграждение продолжает начисляться, пока салон тратит деньги на платформе." },
    { icon: "Users", title: "Без ограничений", desc: "Приглашайте любое количество салонов. Каждый из них — отдельный источник пассивного дохода." },
    { icon: "EyeOff", title: "Полная конфиденциальность", desc: "Владелец салона никогда не узнает, что вы его пригласили. Ваша связь нигде не отображается." },
    { icon: "Banknote", title: "Реальные деньги", desc: "Минимальная сумма вывода — 5 000 ₽. Перевод в течение 5 рабочих дней на ваши реквизиты." },
    { icon: "Shield", title: "Прозрачные условия", desc: "Договор-оферта, чёткие правила начисления, история всех транзакций в личном кабинете." },
    { icon: "TrendingUp", title: "Пассивный доход", desc: "Пригласили один раз — получаете годами. Салон развивается, тратит больше — ваш доход растёт вместе с ним." },
  ];

  const faq = [
    { q: "Кто может участвовать?", a: "Любой специалист индустрии красоты: мастера, администраторы, технологи. Для вывода денег потребуется статус самозанятого или ИП и ИНН." },
    { q: "Как владелец узнает обо мне?", a: "Никак. Связь между вами и приглашённым салоном нигде не отображается — ни в кабинете владельца, ни в каких-либо уведомлениях." },
    { q: "Что если я уволюсь из салона?", a: "Ничего не изменится. Реферальная связь не зависит от вашего места работы. Пока салон тратит деньги на платформе — вы получаете 10%." },
    { q: "Когда можно вывести деньги?", a: "Каждое начисление становится доступным через 30 дней после траты салона. Минимальная сумма вывода — 5 000 ₽. Обработка запроса — 5 рабочих дней." },
    { q: "Обязательно быть самозанятым сразу?", a: "Нет. Вы можете начать приглашать и накапливать баланс без статуса. Для первого вывода потребуется ИНН — оформить самозанятость можно через приложение «Мой налог» за 10 минут." },
    { q: "Сколько салонов можно пригласить?", a: "Без ограничений. Чем больше салонов — тем выше ваш ежемесячный доход." },
  ];

  return (
    <div style={{ fontFamily: "Inter, sans-serif", background: DARK2, minHeight: "100vh", color: "#fff" }}>

      {/* ── Навбар ── */}
      <header style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 100, background: "rgba(8,14,28,0.92)", backdropFilter: "blur(20px)", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 32px", height: 64, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Link to="/" style={{ textDecoration: "none" }}>
            <BrandLogo variant="light" size="md" />
          </Link>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <Link to="/masters/login" style={{ fontSize: 14, color: "rgba(255,255,255,0.6)", textDecoration: "none", padding: "8px 16px" }}>
              Войти
            </Link>
            <Link to="/masters/register" style={{ fontSize: 14, fontWeight: 600, color: DARK, background: `linear-gradient(135deg,${TEAL},${TEAL2})`, textDecoration: "none", padding: "9px 22px", borderRadius: 8 }}>
              Стать партнёром
            </Link>
          </div>
        </div>
      </header>

      {/* ── HERO ── */}
      <section style={{
        paddingTop: 64, minHeight: "100vh", display: "flex", alignItems: "center",
        position: "relative", overflow: "hidden",
        background: `radial-gradient(120% 100% at 75% 20%, #0D2B3E 0%, ${DARK2} 55%, #060912 100%)`,
      }}>
        {/* Декор сетка */}
        <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(255,255,255,0.025) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.025) 1px,transparent 1px)", backgroundSize: "64px 64px", pointerEvents: "none", maskImage: "radial-gradient(100% 80% at 50% 30%,black,transparent)" }} />
        {/* Glow */}
        <div style={{ position: "absolute", top: "10%", right: "-5%", width: 700, height: 700, borderRadius: "50%", background: "radial-gradient(circle,rgba(45,212,191,0.08) 0%,transparent 65%)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: "5%", left: "-10%", width: 500, height: 500, borderRadius: "50%", background: "radial-gradient(circle,rgba(201,169,110,0.06) 0%,transparent 65%)", pointerEvents: "none" }} />

        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "80px 32px", width: "100%", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80, alignItems: "center" }} className="masters-hero-grid">

          {/* Левая часть */}
          <div>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 8, border: `1px solid rgba(201,169,110,0.4)`, borderRadius: 100, padding: "6px 16px", marginBottom: 32 }}>
              <div style={{ width: 6, height: 6, borderRadius: "50%", background: GOLD }} />
              <span style={{ fontSize: 11, color: GOLD, fontWeight: 600, letterSpacing: 2, textTransform: "uppercase" }}>Партнёрская программа для мастеров</span>
            </div>

            <h1 style={{ fontFamily: SERIF, fontSize: "clamp(42px,5vw,68px)", fontWeight: 500, color: "#fff", lineHeight: 1.06, margin: "0 0 24px", letterSpacing: "-0.5px" }}>
              Зарабатывайте,<br />
              <span style={{ color: TEAL }}>пока работаете</span><br />
              — и после
            </h1>

            <p style={{ fontSize: 18, color: "rgba(255,255,255,0.6)", lineHeight: 1.7, margin: "0 0 40px", fontWeight: 300, maxWidth: 480 }}>
              Приглашайте владельцев салонов на платформу «Про Диалог» и получайте <strong style={{ color: "#fff", fontWeight: 600 }}>10% с каждой их траты</strong> — без ограничений по времени и количеству салонов.
            </p>

            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              <Link to="/masters/register" style={{ display: "inline-flex", alignItems: "center", gap: 10, padding: "16px 36px", borderRadius: 2, background: `linear-gradient(135deg,${TEAL},${TEAL2})`, color: DARK, fontSize: 15, fontWeight: 700, textDecoration: "none", letterSpacing: "0.3px" }}>
                Начать зарабатывать <Icon name="ArrowRight" size={16} />
              </Link>
              <a href="#how" style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "16px 28px", borderRadius: 2, border: "1px solid rgba(255,255,255,0.15)", color: "rgba(255,255,255,0.7)", fontSize: 15, textDecoration: "none" }}>
                Как это работает
              </a>
            </div>

            <div style={{ display: "flex", gap: 32, marginTop: 48, paddingTop: 48, borderTop: "1px solid rgba(255,255,255,0.08)" }}>
              {[
                { value: "10%", label: "с каждой траты салона" },
                { value: "∞", label: "без срока давности" },
                { value: "5 дн.", label: "срок выплаты" },
              ].map((s, i) => (
                <div key={i}>
                  <div style={{ fontFamily: SERIF, fontSize: 32, fontWeight: 600, color: TEAL, lineHeight: 1 }}>{s.value}</div>
                  <div style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", marginTop: 6, fontWeight: 300 }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Правая часть — место для фото */}
          <div style={{ position: "relative" }}>
            {/* МЕСТО ДЛЯ ФОТО: 560×640px — мастер/специалист салона красоты, премиальная атмосфера, тёмный фон */}
            <div style={{ width: "100%", aspectRatio: "7/8", borderRadius: 24, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 12 }}>
              <Icon name="Image" size={40} style={{ color: "rgba(255,255,255,0.15)" }} />
              <div style={{ fontSize: 13, color: "rgba(255,255,255,0.2)", textAlign: "center", lineHeight: 1.6 }}>
                МЕСТО ДЛЯ ФОТО<br />560 × 640 px<br />Мастер / специалист салона<br />Премиальная атмосфера
              </div>
            </div>
            {/* Карточка поверх фото */}
            <div style={{ position: "absolute", bottom: -24, left: -24, background: "rgba(8,14,28,0.92)", backdropFilter: "blur(16px)", border: "1px solid rgba(45,212,191,0.2)", borderRadius: 16, padding: "20px 24px", minWidth: 220 }}>
              <div style={{ fontSize: 11, color: TEAL, fontWeight: 600, letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 8 }}>Пример дохода</div>
              <div style={{ fontFamily: SERIF, fontSize: 28, fontWeight: 600, color: "#fff" }}>36 000 ₽</div>
              <div style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", marginTop: 4 }}>в год · 2 салона · 3 000 ₽/мес</div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Как это работает ── */}
      <section id="how" style={{ padding: "120px 32px", maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 72 }}>
          <div style={{ fontSize: 11, color: TEAL, fontWeight: 600, letterSpacing: 2, textTransform: "uppercase", marginBottom: 16 }}>Простая схема</div>
          <h2 style={{ fontFamily: SERIF, fontSize: "clamp(36px,4vw,54px)", fontWeight: 500, color: "#fff", margin: 0, letterSpacing: "-0.5px" }}>Как это работает</h2>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))", gap: 2, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.05)" }}>
          {steps.map((step, i) => (
            <div key={i} style={{ background: DARK2, padding: "40px 32px", position: "relative" }}>
              <div style={{ fontFamily: SERIF, fontSize: 64, fontWeight: 300, color: "rgba(45,212,191,0.12)", lineHeight: 1, marginBottom: 24, userSelect: "none" }}>{step.num}</div>
              <div style={{ width: 44, height: 44, borderRadius: 12, background: "rgba(45,212,191,0.1)", border: "1px solid rgba(45,212,191,0.2)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 20 }}>
                <Icon name={step.icon} size={20} style={{ color: TEAL }} />
              </div>
              <h3 style={{ fontFamily: SERIF, fontSize: 22, fontWeight: 600, color: "#fff", margin: "0 0 12px" }}>{step.title}</h3>
              <p style={{ fontSize: 14, color: "rgba(255,255,255,0.5)", lineHeight: 1.7, margin: 0, fontWeight: 300 }}>{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Калькулятор ── */}
      <section style={{ padding: "0 32px 120px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ background: `linear-gradient(135deg, rgba(13,43,62,0.8), rgba(8,14,28,0.95))`, border: "1px solid rgba(45,212,191,0.12)", borderRadius: 32, padding: "72px 48px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80, alignItems: "center" }} className="masters-calc-grid">
            <div>
              <div style={{ fontSize: 11, color: GOLD, fontWeight: 600, letterSpacing: 2, textTransform: "uppercase", marginBottom: 20 }}>Ваш потенциал</div>
              <h2 style={{ fontFamily: SERIF, fontSize: "clamp(32px,3.5vw,48px)", fontWeight: 500, color: "#fff", margin: "0 0 20px", letterSpacing: "-0.5px" }}>
                Посчитайте свой<br />пассивный доход
              </h2>
              <p style={{ fontSize: 16, color: "rgba(255,255,255,0.5)", lineHeight: 1.7, margin: "0 0 32px", fontWeight: 300 }}>
                Двигайте ползунки и смотрите, сколько вы будете получать ежемесячно — просто за то, что однажды поделились ссылкой.
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {["Начисляется автоматически", "Без участия с вашей стороны", "Чем больше тратит салон — тем выше доход"].map((t, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <Icon name="Check" size={14} style={{ color: TEAL }} />
                    <span style={{ fontSize: 14, color: "rgba(255,255,255,0.6)" }}>{t}</span>
                  </div>
                ))}
              </div>
            </div>
            <Calculator />
          </div>
        </div>
      </section>

      {/* ── Преимущества ── */}
      <section style={{ padding: "0 32px 120px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 72 }}>
            <div style={{ fontSize: 11, color: TEAL, fontWeight: 600, letterSpacing: 2, textTransform: "uppercase", marginBottom: 16 }}>Условия программы</div>
            <h2 style={{ fontFamily: SERIF, fontSize: "clamp(36px,4vw,54px)", fontWeight: 500, color: "#fff", margin: 0, letterSpacing: "-0.5px" }}>Почему это выгодно</h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(300px,1fr))", gap: 24 }}>
            {benefits.map((b, i) => (
              <div key={i} style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 20, padding: "32px 28px", transition: "border-color 0.2s" }}
                onMouseEnter={e => (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(45,212,191,0.25)"}
                onMouseLeave={e => (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(255,255,255,0.07)"}
              >
                <div style={{ width: 48, height: 48, borderRadius: 14, background: "rgba(45,212,191,0.08)", border: "1px solid rgba(45,212,191,0.15)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 20 }}>
                  <Icon name={b.icon} size={22} style={{ color: TEAL }} />
                </div>
                <h3 style={{ fontFamily: SERIF, fontSize: 22, fontWeight: 600, color: "#fff", margin: "0 0 10px" }}>{b.title}</h3>
                <p style={{ fontSize: 14, color: "rgba(255,255,255,0.5)", lineHeight: 1.7, margin: 0, fontWeight: 300 }}>{b.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Фото-разделитель ── */}
      <section style={{ padding: "0 32px 120px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", position: "relative", borderRadius: 32, overflow: "hidden" }}>
          {/* МЕСТО ДЛЯ ФОТО: 1200×400px — команда салона красоты, рабочая атмосфера, широкоформатное */}
          <div style={{ width: "100%", height: 400, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 12 }}>
            <Icon name="Image" size={40} style={{ color: "rgba(255,255,255,0.12)" }} />
            <div style={{ fontSize: 13, color: "rgba(255,255,255,0.18)", textAlign: "center", lineHeight: 1.6 }}>
              МЕСТО ДЛЯ ФОТО · 1200 × 400 px<br />Команда салона красоты · Рабочая атмосфера · Широкоформатное
            </div>
          </div>
          {/* Оверлей с текстом */}
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(90deg,rgba(8,14,28,0.85) 0%,rgba(8,14,28,0.3) 60%,transparent 100%)", display: "flex", alignItems: "center", padding: "0 64px" }}>
            <div style={{ maxWidth: 480 }}>
              <div style={{ fontFamily: SERIF, fontSize: "clamp(28px,3vw,42px)", fontWeight: 500, color: "#fff", lineHeight: 1.2, marginBottom: 16 }}>
                Ваши знания — ваш актив
              </div>
              <p style={{ fontSize: 16, color: "rgba(255,255,255,0.6)", lineHeight: 1.7, margin: 0, fontWeight: 300 }}>
                Вы знаете индустрию изнутри. Ваша рекомендация стоит дороже любой рекламы.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section style={{ padding: "0 32px 120px" }}>
        <div style={{ maxWidth: 800, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 64 }}>
            <div style={{ fontSize: 11, color: TEAL, fontWeight: 600, letterSpacing: 2, textTransform: "uppercase", marginBottom: 16 }}>Частые вопросы</div>
            <h2 style={{ fontFamily: SERIF, fontSize: "clamp(32px,4vw,48px)", fontWeight: 500, color: "#fff", margin: 0, letterSpacing: "-0.5px" }}>Всё, что важно знать</h2>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {faq.map((item, i) => (
              <FaqItem key={i} q={item.q} a={item.a} />
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={{ padding: "0 32px 120px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ background: `linear-gradient(135deg, #0D2B3E 0%, #0A1628 50%, #060912 100%)`, border: "1px solid rgba(45,212,191,0.15)", borderRadius: 32, padding: "80px 48px", textAlign: "center", position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: 600, height: 600, borderRadius: "50%", background: "radial-gradient(circle,rgba(45,212,191,0.07) 0%,transparent 65%)", pointerEvents: "none" }} />
            <div style={{ position: "relative" }}>
              <div style={{ fontSize: 11, color: GOLD, fontWeight: 600, letterSpacing: 2, textTransform: "uppercase", marginBottom: 20 }}>Начните сегодня</div>
              <h2 style={{ fontFamily: SERIF, fontSize: "clamp(36px,4.5vw,60px)", fontWeight: 500, color: "#fff", margin: "0 0 20px", letterSpacing: "-0.5px" }}>
                Первый шаг — регистрация.<br />Остальное — автоматически.
              </h2>
              <p style={{ fontSize: 17, color: "rgba(255,255,255,0.5)", margin: "0 0 48px", fontWeight: 300, maxWidth: 480, marginLeft: "auto", marginRight: "auto" }}>
                Пригласите одного владельца сегодня — и получайте пассивный доход годами.
              </p>
              <Link to="/masters/register" style={{ display: "inline-flex", alignItems: "center", gap: 12, padding: "18px 48px", borderRadius: 2, background: `linear-gradient(135deg,${TEAL},${TEAL2})`, color: DARK, fontSize: 16, fontWeight: 700, textDecoration: "none", letterSpacing: "0.3px" }}>
                Стать партнёром бесплатно <Icon name="ArrowRight" size={18} />
              </Link>
              <div style={{ marginTop: 24, fontSize: 13, color: "rgba(255,255,255,0.3)" }}>
                Регистрация бесплатна · Договор-оферта · Без скрытых условий
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Футер ── */}
      <footer style={{ borderTop: "1px solid rgba(255,255,255,0.06)", padding: "40px 32px", textAlign: "center" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <Link to="/" style={{ textDecoration: "none", display: "inline-block", marginBottom: 20 }}>
            <BrandLogo variant="light" size="md" />
          </Link>
          <div style={{ display: "flex", justifyContent: "center", gap: 32, marginBottom: 24, flexWrap: "wrap" }}>
            <Link to="/offer" style={{ fontSize: 13, color: "rgba(255,255,255,0.35)", textDecoration: "none" }}>Договор-оферта</Link>
            <Link to="/privacy" style={{ fontSize: 13, color: "rgba(255,255,255,0.35)", textDecoration: "none" }}>Конфиденциальность</Link>
            <a href="mailto:info@promtdialog.ru" style={{ fontSize: 13, color: "rgba(255,255,255,0.35)", textDecoration: "none" }}>info@promtdialog.ru</a>
          </div>
          <div style={{ fontSize: 12, color: "rgba(255,255,255,0.2)" }}>
            © 2026 Про Диалог · Партнёрская программа для мастеров
          </div>
        </div>
      </footer>

      <style>{`
        @media (max-width: 768px) {
          .masters-hero-grid { grid-template-columns: 1fr !important; gap: 40px !important; }
          .masters-calc-grid { grid-template-columns: 1fr !important; gap: 40px !important; }
        }
      `}</style>
    </div>
  );
}

// ── FAQ Item ──────────────────────────────────────────────────────────────────
function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ background: "rgba(255,255,255,0.03)", border: `1px solid ${open ? "rgba(45,212,191,0.2)" : "rgba(255,255,255,0.07)"}`, borderRadius: 12, overflow: "hidden", transition: "border-color 0.2s" }}>
      <button onClick={() => setOpen(!open)} style={{ width: "100%", padding: "22px 28px", display: "flex", justifyContent: "space-between", alignItems: "center", background: "none", border: "none", cursor: "pointer", gap: 16, fontFamily: "Inter, sans-serif" }}>
        <span style={{ fontSize: 16, fontWeight: 500, color: "#fff", textAlign: "left" }}>{q}</span>
        <Icon name={open ? "ChevronUp" : "ChevronDown"} size={18} style={{ color: "rgba(255,255,255,0.4)", flexShrink: 0 }} />
      </button>
      {open && (
        <div style={{ padding: "0 28px 22px", fontSize: 14, color: "rgba(255,255,255,0.55)", lineHeight: 1.8, fontWeight: 300 }}>
          {a}
        </div>
      )}
    </div>
  );
}
