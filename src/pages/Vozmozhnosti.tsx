import { Link } from "react-router-dom";
import BizNavbar from "@/components/BizNavbar";
import BizFooter from "@/components/BizFooter";
import Icon from "@/components/ui/icon";

const TEAL = "#2DD4BF";
const DARK = "#0F172A";
const GRAY = "#64748B";
const SERIF = "'Cormorant Garamond', serif";

const SECTIONS = [
  {
    tag: "Маркетинг",
    icon: "Megaphone",
    title: "Маркетинг",
    desc: "Контент, который привлекает клиентов — без копирайтера и дизайнера.",
    tools: [
      { icon: "PenLine", name: "Генератор постов", desc: "Готовый текст для социальных сетей с уместными хэштегами за пару минут." },
      { icon: "Video", name: "Идеи для Reels", desc: "Сценарий короткого видео под интересы вашей целевой аудитории." },
      { icon: "Image", name: "Концепции изображений", desc: "Генерация изображений под ваш салон красоты." },
      { icon: "Calculator", name: "Расчёт рекламного бюджета", desc: "ДРР, прогноз по стратегиям Яндекс.Директ и оптимальное распределение бюджета под цели салона." },
    ],
  },
  {
    tag: "Управление",
    icon: "BarChart3",
    title: "Управление",
    desc: "Аналитика и решения, которые помогают видеть бизнес целиком.",
    tools: [
      { icon: "UserSearch", name: "Анализ персонала", desc: "Объективная картина по каждому сотруднику: кто приносит прибыль." },
      { icon: "ClipboardList", name: "Цифровой бизнес-разбор", desc: "Персональный план роста выручки на основе данных вашего салона." },
      { icon: "Stethoscope", name: "Диагностика салона", desc: "Полный аудит маркетинга, сервиса, финансов и команды." },
    ],
  },
  {
    tag: "Продажи",
    icon: "MessagesSquare",
    title: "Продажи",
    desc: "Готовые инструменты для роста среднего чека и возвращаемости.",
    tools: [
      { icon: "MessagesSquare", name: "Скрипты общения", desc: "Сценарии для администраторов на любую ситуацию: запись, допродажа, конфликт." },
      { icon: "ShieldCheck", name: "Работа с возражениями", desc: "Выверенные ответы на «дорого», «подумаю» и «не сейчас»." },
      { icon: "RotateCcw", name: "Повторная запись", desc: "Алгоритм возврата клиента через несколько недель после визита." },
    ],
  },
  {
    tag: "Специалисты",
    icon: "Stethoscope",
    title: "Специалисты",
    desc: "Инструменты, которые повышают качество работы и доверие клиентов.",
    tools: [
      { icon: "ScanLine", name: "Диагностика клиента", desc: "Структурированный опрос и анализ для специалистов по телу." },
      { icon: "FileText", name: "Шпаргалки мастера", desc: "Краткие памятки по техникам, противопоказаниям и продуктам." },
      { icon: "HeartPulse", name: "Программы восстановления", desc: "Индивидуальный план работы с клиентом на полный курс." },
    ],
  },
];

export default function Vozmozhnosti() {
  return (
    <div style={{ fontFamily: "Inter, sans-serif", background: "#fff" }}>
      <BizNavbar />

      {/* ── HERO ── */}
      <section style={{
        background: `radial-gradient(120% 100% at 80% 0%, #112B3C 0%, ${DARK} 55%, #060B16 100%)`,
        paddingTop: 76, position: "relative", overflow: "hidden",
      }}>
        <div style={{ position: "absolute", top: "8%", right: "-8%", width: 680, height: 680, borderRadius: "50%", background: "radial-gradient(circle, rgba(45,212,191,0.10) 0%, transparent 65%)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)", backgroundSize: "64px 64px", pointerEvents: "none", maskImage: "radial-gradient(100% 80% at 50% 30%, black, transparent)" }} />

        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "120px 32px", width: "100%", textAlign: "center", position: "relative" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 10, border: "1px solid rgba(45,212,191,0.3)", borderRadius: 100, padding: "7px 18px", marginBottom: 36 }}>
            <div style={{ width: 6, height: 6, borderRadius: "50%", background: TEAL }} />
            <span style={{ fontSize: 12, color: TEAL, fontWeight: 500, letterSpacing: "1.5px", textTransform: "uppercase" }}>Возможности</span>
          </div>

          <h1 style={{ fontFamily: SERIF, fontSize: "clamp(44px,6vw,76px)", fontWeight: 500, color: "#fff", lineHeight: 1.04, margin: "0 0 28px", letterSpacing: "-0.5px" }}>
            Возможности платформы
          </h1>
          <p style={{ fontSize: "clamp(15px,1.6vw,18px)", color: "rgba(255,255,255,0.62)", lineHeight: 1.7, margin: "0 auto 40px", fontWeight: 300, maxWidth: 640 }}>
            Всё необходимое для роста салона в едином кабинете — маркетинг, управление, продажи и развитие команды. Спокойные, выверенные инструменты для ежедневной работы.
          </p>

          <Link to="/cabinet" style={{
            display: "inline-block", padding: "16px 38px", borderRadius: 2, fontSize: 15, fontWeight: 500, letterSpacing: "0.3px",
            background: "linear-gradient(135deg,#2DD4BF,#14B8A6)", color: "#0F172A",
            textDecoration: "none", transition: "all 0.3s",
          }}
            onMouseEnter={e => { const el = e.currentTarget as HTMLAnchorElement; el.style.transform = "translateY(-2px)"; el.style.boxShadow = "0 16px 40px rgba(45,212,191,0.3)"; }}
            onMouseLeave={e => { const el = e.currentTarget as HTMLAnchorElement; el.style.transform = "translateY(0)"; el.style.boxShadow = "none"; }}
          >
            Попробовать бесплатно
          </Link>
        </div>
      </section>

      {/* ── РАЗДЕЛЫ ── */}
      {SECTIONS.map((s, si) => (
        <section key={si} style={{ padding: "120px 32px", background: si % 2 === 0 ? "#fff" : "#F8FAFC" }}>
          <div style={{ maxWidth: 1280, margin: "0 auto" }}>
            <div style={{ display: "flex", alignItems: "flex-start", gap: 24, marginBottom: 64, flexWrap: "wrap" }}>
              <div style={{ width: 56, height: 56, borderRadius: 2, border: `1px solid ${TEAL}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <Icon name={s.icon} size={26} style={{ color: TEAL }} />
              </div>
              <div style={{ maxWidth: 640 }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: TEAL, textTransform: "uppercase", letterSpacing: "2.5px", marginBottom: 14 }}>{s.tag}</div>
                <h2 style={{ fontFamily: SERIF, fontSize: "clamp(32px,4vw,48px)", fontWeight: 500, color: DARK, margin: "0 0 12px", letterSpacing: "-0.5px", lineHeight: 1.1 }}>{s.title}</h2>
                <p style={{ fontSize: 18, color: GRAY, margin: 0, fontWeight: 300, lineHeight: 1.6 }}>{s.desc}</p>
              </div>
            </div>

            <div className="tools-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(300px,1fr))", gap: 1, background: "#E2E8F0", border: "1px solid #E2E8F0" }}>
              {s.tools.map((t, ti) => (
                <div key={ti} style={{ background: si % 2 === 0 ? "#fff" : "#F8FAFC", padding: "40px 32px", transition: "all 0.3s", cursor: "default" }}
                  onMouseEnter={e => (e.currentTarget as HTMLDivElement).style.background = "rgba(45,212,191,0.05)"}
                  onMouseLeave={e => { const el = e.currentTarget as HTMLDivElement; el.style.background = si % 2 === 0 ? "#fff" : "#F8FAFC"; }}
                >
                  <div style={{ width: 48, height: 48, borderRadius: 2, border: "1px solid #EAEEF3", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 24 }}>
                    <Icon name={t.icon} size={22} style={{ color: TEAL }} />
                  </div>
                  <h3 style={{ fontFamily: SERIF, fontSize: 23, fontWeight: 600, color: DARK, margin: "0 0 10px" }}>{t.name}</h3>
                  <p style={{ fontSize: 14, color: GRAY, margin: 0, lineHeight: 1.7, fontWeight: 300 }}>{t.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      ))}

      {/* ── CTA ── */}
      <section style={{ background: "#fff", padding: "120px 32px" }}>
        <div style={{ maxWidth: 1000, margin: "0 auto", background: `linear-gradient(135deg, ${DARK}, #112B3C)`, borderRadius: 6, padding: "80px 56px", textAlign: "center", position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", top: "-30%", right: "-10%", width: 400, height: 400, borderRadius: "50%", background: "radial-gradient(circle, rgba(45,212,191,0.12) 0%, transparent 70%)", pointerEvents: "none" }} />
          <h2 style={{ fontFamily: SERIF, fontSize: "clamp(34px,5vw,56px)", fontWeight: 500, color: "#fff", margin: "0 0 20px", letterSpacing: "-0.5px", lineHeight: 1.05, position: "relative" }}>
            Готовы начать?
          </h2>
          <p style={{ fontSize: 18, color: "rgba(255,255,255,0.6)", margin: "0 0 40px", fontWeight: 300, position: "relative" }}>
            Создайте профиль салона и получите доступ ко всем инструментам платформы. Без карты и обязательств.
          </p>
          <Link to="/cabinet" style={{ display: "inline-block", padding: "16px 44px", borderRadius: 2, background: "linear-gradient(135deg,#2DD4BF,#14B8A6)", color: "#0F172A", fontSize: 15, fontWeight: 600, textDecoration: "none", letterSpacing: "0.3px", position: "relative" }}>
            Попробовать бесплатно
          </Link>
        </div>
      </section>

      <BizFooter />

      <style>{`
        @media (max-width: 880px) {
          .tools-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}