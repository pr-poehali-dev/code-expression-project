import { useState } from "react";
import { Link } from "react-router-dom";
import Icon from "@/components/ui/icon";

const TEAL = "#2DD4BF";
const DARK = "#0F172A";
const GRAY = "#64748B";
const SERIF = "'Cormorant Garamond', serif";

const SITUATIONS = [
  {
    icon: "UserX",
    color: "#7c3aed",
    bg: "#faf5ff",
    border: "#e9d5ff",
    title: "Мало записей",
    desc: "«ПоДелам» проверит, что сработает быстрее рекламы: старую базу, свободные окна, сезонные поводы, рекомендации.",
    result: "Готовые сообщения, оффер, пост или страница записи",
  },
  {
    icon: "UserMinus",
    color: "#0369a1",
    bg: "#f0f9ff",
    border: "#bae6fd",
    title: "Клиенты приходят один раз и исчезают",
    desc: "Найдём, где теряется повторный визит: нет повода вернуться, не предложена следующая запись, нет коммуникации после процедуры.",
    result: "Сценарии сопровождения и идеи комплексов услуг",
  },
];

const REVIEWS = [
  { name: "Анна, Студия Blossom", city: "Москва", text: "За 2 месяца средний чек вырос на 35%. ИИ-диагностика показала, что мастера просто не предлагали уходовые процедуры — теперь это исправлено.", result: "+35% к среднему чеку" },
  { name: "Михаил, Барбершоп GentleMan", city: "Санкт-Петербург", text: "Генератор контента экономит 4 часа в неделю. Посты стали живее, подписчики растут. Клиенты говорят, что нашли нас во ВКонтакте.", result: "–4 часа в неделю на контент" },
  { name: "Ольга, Салон \"Гармония\"", city: "Краснодар", text: "Раньше теряла 2-3 мастера в год. Прошли тренинг по коммуникации через платформу — текучка упала, команда стала работать как единое целое.", result: "Текучка сократилась в 2 раза" },
];

const FAQ = [
  { q: "Чем «ПоДелам» отличается от обычного чата с ИИ?", a: "Чат отвечает на вопросы в моменте. «ПоДелам» анализирует ваши данные — доход, чек, базу, загрузку — и строит план на день, неделю и месяц с расчётом вклада каждого действия в выручку." },
  { q: "Как быстро появится план действий?", a: "Сразу после диагностики — это 10–15 минут. Вы получаете карту точек роста и первое главное дело на сегодня." },
  { q: "Подойдёт, если я работаю один, без компании?", a: "Да. «ПоДелам» одинаково работает и для частного специалиста, и для компании с командой — просто набор рекомендаций и инструментов будет разным." },
];

export default function IndexBottom() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <>
      {/* ── 7. РЕШЕНИЯ ПОД СИТУАЦИЮ ── */}
      <section style={{ padding: "120px 32px", background: "#fff" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ maxWidth: 560, marginBottom: 56 }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: TEAL, textTransform: "uppercase", letterSpacing: "2.5px", marginBottom: 20 }}>Ваша ситуация</div>
            <h2 style={{ fontFamily: SERIF, fontSize: "clamp(34px,4.5vw,54px)", fontWeight: 500, color: DARK, margin: 0, letterSpacing: "-0.5px", lineHeight: 1.1 }}>
              Решения под вашу ситуацию
            </h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }} className="value-grid">
            {SITUATIONS.map((s, i) => (
              <div key={i} style={{ border: `1.5px solid ${s.border}`, borderRadius: 20, padding: "32px 28px" }}>
                <div style={{ width: 48, height: 48, borderRadius: 12, background: s.bg, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 20 }}>
                  <Icon name={s.icon} size={22} style={{ color: s.color }} />
                </div>
                <div style={{ fontSize: 18, fontWeight: 700, color: DARK, marginBottom: 12, lineHeight: 1.3 }}>{s.title}</div>
                <p style={{ margin: "0 0 18px", fontSize: 14, color: GRAY, lineHeight: 1.7, fontWeight: 300 }}>{s.desc}</p>
                <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: s.bg, borderRadius: 8, padding: "9px 14px" }}>
                  <Icon name="ArrowRight" size={14} style={{ color: s.color }} />
                  <span style={{ fontSize: 12.5, fontWeight: 600, color: s.color }}>{s.result}</span>
                </div>
              </div>
            ))}
          </div>
          <div style={{ textAlign: "center", marginTop: 48 }}>
            <a href="#demo-form" onClick={e => { e.preventDefault(); document.getElementById("demo-form")?.scrollIntoView({ behavior: "smooth" }); }} style={{
              display: "inline-flex", alignItems: "center", gap: 10,
              padding: "16px 40px", borderRadius: 2, fontSize: 15, fontWeight: 600,
              background: "linear-gradient(135deg,#2DD4BF,#14B8A6)", color: "#0F172A",
              textDecoration: "none", transition: "all 0.3s", cursor: "pointer",
            }}
              onMouseEnter={e => { const el = e.currentTarget as HTMLAnchorElement; el.style.transform = "translateY(-2px)"; el.style.boxShadow = "0 16px 40px rgba(45,212,191,0.3)"; }}
              onMouseLeave={e => { const el = e.currentTarget as HTMLAnchorElement; el.style.transform = "translateY(0)"; el.style.boxShadow = "none"; }}
            >
              <Icon name="Compass" size={16} />
              Получить план роста
            </a>
          </div>
        </div>
      </section>

      {/* ── 8. ТАРИФЫ ── */}
      <section style={{ padding: "120px 32px", background: "#F8FAFC" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 48, alignItems: "center" }} className="tarif-grid">
            <div>
              <div style={{ fontSize: 12, fontWeight: 600, color: TEAL, textTransform: "uppercase", letterSpacing: "2.5px", marginBottom: 20 }}>Тарифы</div>
              <h2 style={{ fontFamily: SERIF, fontSize: "clamp(34px,4.5vw,54px)", fontWeight: 500, color: DARK, margin: "0 0 24px", letterSpacing: "-0.5px", lineHeight: 1.1 }}>
                Тарифы и условия
              </h2>
              <div style={{ display: "flex", flexDirection: "column", gap: 16, marginBottom: 36 }}>
                {[
                  { icon: "User", title: "Для специалистов", desc: "Бесплатный и PRO тарифы — без скрытых платежей" },
                  { icon: "Building2", title: "Для компаний и команд", desc: "Гибкие пакеты под ваши задачи и команду — от Старт до Премиум" },
                  { icon: "Zap", title: "Внутренняя энергия", desc: "Честная система: платите только за то, что используете" },
                ].map((item, i) => (
                  <div key={i} style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
                    <div style={{ width: 36, height: 36, borderRadius: 10, background: "rgba(45,212,191,0.1)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 1 }}>
                      <Icon name={item.icon} size={16} style={{ color: TEAL }} />
                    </div>
                    <div>
                      <div style={{ fontSize: 15, fontWeight: 700, color: DARK, marginBottom: 3 }}>{item.title}</div>
                      <div style={{ fontSize: 14, color: GRAY, fontWeight: 300 }}>{item.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
              <Link to="/tseny" style={{
                display: "inline-flex", alignItems: "center", gap: 10,
                padding: "14px 32px", borderRadius: 2, fontSize: 15, fontWeight: 600,
                border: `1.5px solid ${TEAL}`, color: TEAL,
                textDecoration: "none", transition: "all 0.3s",
              }}
                onMouseEnter={e => { const el = e.currentTarget as HTMLAnchorElement; el.style.background = TEAL; el.style.color = "#0F172A"; }}
                onMouseLeave={e => { const el = e.currentTarget as HTMLAnchorElement; el.style.background = "transparent"; el.style.color = TEAL; }}
              >
                Смотреть тарифы <Icon name="ArrowRight" size={16} />
              </Link>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }} className="tarif-cards-grid">
              {[
                { name: "Старт", price: "990 ₽", energy: "150 энергий", discount: null, color: "#64748B", bg: "#F8FAFC", border: "#E2E8F0" },
                { name: "Бизнес", price: "2 990 ₽", energy: "550 энергий", discount: "Выгода 18%", color: TEAL, bg: "rgba(45,212,191,0.04)", border: TEAL, popular: true },
                { name: "Рост", price: "4 990 ₽", energy: "1 200 энергий", discount: "Выгода 37%", color: "#7c3aed", bg: "#faf5ff", border: "#e9d5ff" },
                { name: "Премиум", price: "9 990 ₽", energy: "3 000 энергий", discount: "Выгода 50%", color: "#059669", bg: "#f0fdf4", border: "#bbf7d0" },
              ].map((pkg, i) => (
                <div key={i} style={{ border: `1.5px solid ${pkg.border}`, borderRadius: 14, padding: "22px 18px", background: pkg.bg, position: "relative" }}>
                  {pkg.popular && (
                    <div style={{ position: "absolute", top: -1, left: 16, background: TEAL, color: "#0F172A", fontSize: 9, fontWeight: 700, padding: "3px 10px", borderRadius: "0 0 8px 8px", letterSpacing: "1.5px" }}>POPULAR</div>
                  )}
                  <div style={{ fontSize: 11, fontWeight: 700, color: "#94A3B8", letterSpacing: "1.5px", textTransform: "uppercase", marginBottom: 8, marginTop: pkg.popular ? 8 : 0 }}>{pkg.name}</div>
                  <div style={{ fontFamily: SERIF, fontSize: 26, fontWeight: 700, color: DARK, marginBottom: 12, lineHeight: 1 }}>{pkg.price}</div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <Icon name="Zap" size={12} style={{ color: pkg.color }} />
                      <span style={{ fontSize: 12, color: GRAY }}>{pkg.energy}</span>
                    </div>
                    {pkg.discount && (
                      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                        <Icon name="TrendingDown" size={12} style={{ color: pkg.color }} />
                        <span style={{ fontSize: 12, fontWeight: 700, color: pkg.color }}>{pkg.discount}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── 9. ОТЗЫВЫ ── */}
      <section style={{ padding: "120px 32px", background: "#fff" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ maxWidth: 560, marginBottom: 72 }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: TEAL, textTransform: "uppercase", letterSpacing: "2.5px", marginBottom: 20 }}>Отзывы</div>
            <h2 style={{ fontFamily: SERIF, fontSize: "clamp(34px,4.5vw,54px)", fontWeight: 500, color: DARK, margin: 0, letterSpacing: "-0.5px", lineHeight: 1.1 }}>
              Реальные истории роста
            </h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(300px,1fr))", gap: 20 }}>
            {REVIEWS.map((r, i) => (
              <div key={i} style={{ border: "1.5px solid #E8ECF0", borderRadius: 20, padding: "36px 32px", display: "flex", flexDirection: "column", gap: 20 }}>
                <div style={{ display: "flex", gap: 4 }}>
                  {Array.from({ length: 5 }).map((_, j) => (
                    <Icon key={j} name="Star" size={14} style={{ color: "#F59E0B" }} />
                  ))}
                </div>
                <p style={{ margin: 0, fontSize: 15, color: "#334155", lineHeight: 1.7, fontWeight: 300, flex: 1 }}>«{r.text}»</p>
                <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(45,212,191,0.08)", borderRadius: 8, padding: "8px 12px" }}>
                  <Icon name="TrendingUp" size={14} style={{ color: TEAL }} />
                  <span style={{ fontSize: 12, fontWeight: 700, color: TEAL }}>{r.result}</span>
                </div>
                <div style={{ borderTop: "1px solid #F1F5F9", paddingTop: 16 }}>
                  <div style={{ fontSize: 14, fontWeight: 700, color: DARK }}>{r.name}</div>
                  <div style={{ fontSize: 12, color: GRAY, marginTop: 2 }}>{r.city}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 10. FAQ ── */}
      <section style={{ padding: "120px 32px", background: "#F8FAFC" }}>
        <div style={{ maxWidth: 800, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 72 }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: TEAL, textTransform: "uppercase", letterSpacing: "2.5px", marginBottom: 20 }}>FAQ</div>
            <h2 style={{ fontFamily: SERIF, fontSize: "clamp(34px,4.5vw,54px)", fontWeight: 500, color: DARK, margin: 0, letterSpacing: "-0.5px", lineHeight: 1.1 }}>
              Часто задаваемые вопросы
            </h2>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {FAQ.map((item, i) => (
              <div key={i} style={{ border: "1.5px solid #E8ECF0", borderRadius: 14, overflow: "hidden", background: "#fff" }}>
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, padding: "22px 24px", background: "none", border: "none", cursor: "pointer", textAlign: "left", fontFamily: "Inter, sans-serif" }}
                >
                  <span style={{ fontSize: 16, fontWeight: 600, color: DARK, lineHeight: 1.4 }}>{item.q}</span>
                  <Icon name={openFaq === i ? "ChevronUp" : "ChevronDown"} size={18} style={{ color: GRAY, flexShrink: 0 }} />
                </button>
                {openFaq === i && (
                  <div style={{ padding: "0 24px 22px", fontSize: 15, color: GRAY, lineHeight: 1.7, fontWeight: 300 }}>{item.a}</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA финальный ── */}
      <section style={{
        padding: "100px 32px",
        background: `radial-gradient(120% 100% at 80% 0%, #112B3C 0%, ${DARK} 55%, #060B16 100%)`,
        position: "relative", overflow: "hidden",
      }}>
        <div style={{ position: "absolute", top: "10%", left: "-5%", width: 500, height: 500, borderRadius: "50%", background: "radial-gradient(circle, rgba(45,212,191,0.08) 0%, transparent 65%)", pointerEvents: "none" }} />
        <div style={{ maxWidth: 700, margin: "0 auto", textAlign: "center", position: "relative" }}>
          <div style={{ fontFamily: SERIF, fontSize: "clamp(34px,5vw,56px)", fontWeight: 500, color: "#fff", lineHeight: 1.1, marginBottom: 24 }}>
            Начните с диагностики — получите первый план
          </div>
          <p style={{ fontSize: 17, color: "rgba(255,255,255,0.55)", marginBottom: 40, fontWeight: 300, lineHeight: 1.7 }}>
            Получите план роста дохода бесплатно — без оплаты, без обязательств.
          </p>
          <a href="#demo-form" onClick={e => { e.preventDefault(); document.getElementById("demo-form")?.scrollIntoView({ behavior: "smooth" }); }} style={{
            display: "inline-flex", alignItems: "center", gap: 10,
            padding: "18px 48px", borderRadius: 2, fontSize: 15, fontWeight: 600,
            background: "linear-gradient(135deg,#2DD4BF,#14B8A6)", color: "#0F172A",
            textDecoration: "none", transition: "all 0.3s", cursor: "pointer",
          }}
            onMouseEnter={e => { const el = e.currentTarget as HTMLAnchorElement; el.style.transform = "translateY(-2px)"; el.style.boxShadow = "0 16px 40px rgba(45,212,191,0.3)"; }}
            onMouseLeave={e => { const el = e.currentTarget as HTMLAnchorElement; el.style.transform = "translateY(0)"; el.style.boxShadow = "none"; }}
          >
            <Icon name="Compass" size={16} />
            Получить план роста
          </a>
        </div>
      </section>
    </>
  );
}