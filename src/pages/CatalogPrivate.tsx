import { useState } from "react";
import DokNavbar from "@/components/DokNavbar";
import Icon from "@/components/ui/icon";

const ACCENT = "hsl(185, 85%, 32%)";
const ACCENT_DARK = "hsl(185, 85%, 26%)";
const ACCENT_SHADOW = "hsla(185, 85%, 32%, 0.22)";
const BG = "#f8f8f6";

type Course = {
  id: number;
  title: string;
  description: string;
  bullets: string[];
  price: string;
  priceNote?: string;
  level: "beginner" | "practitioner" | "any";
  direction: "technique" | "income";
  tiers?: { label: string; color: string; price: string }[];
};

const COURSES: Course[] = [
  {
    id: 1,
    title: "Профессия массажист с нуля: первый доход за 30 дней",
    description: "Освойте базовые техники массажа и начните зарабатывать уже в первый месяц, даже без медицинского образования.",
    bullets: [
      "Выполнять базовые техники массажа уверенно и безопасно",
      "Проводить полноценный сеанс с клиентом",
      "Находить первых клиентов и зарабатывать",
    ],
    price: "19 900 ₽",
    priceNote: "или рассрочка",
    level: "beginner",
    direction: "income",
  },
  {
    id: 2,
    title: "Восстановительный массаж PRO: клиенты с болью, травмами и высоким чеком",
    description: "Научитесь работать с болевыми состояниями, травмами и сложными случаями, за которые клиенты готовы платить больше.",
    bullets: [
      "Работать с позвоночником, суставами и мышцами",
      "Понимать причины боли и подбирать техники",
      "Повышать средний чек за счёт результата",
    ],
    price: "39 900 ₽",
    priceNote: "или рассрочка",
    level: "practitioner",
    direction: "technique",
  },
  {
    id: 3,
    title: "Готовые протоколы массажа: что делать при боли, стрессе и зажимах",
    description: "Получите готовые схемы работы с клиентами под разные запросы и перестаньте гадать, какие техники применять.",
    bullets: [
      "Быстро подбирать технику под клиента",
      "Работать с болью в спине, шее и стрессом",
      "Повышать эффективность каждого сеанса",
    ],
    price: "19 900 ₽",
    level: "practitioner",
    direction: "technique",
  },
  {
    id: 4,
    title: "Антистресс-техники: как за 1 сеанс усиливать эффект массажа в 2 раза",
    description: "Освойте техники работы с нервной системой и увеличьте эффективность массажа уже после первого применения.",
    bullets: [
      "Регулировать состояние клиента во время сеанса",
      "Усиливать эффект массажа через ВНС",
      "Повышать лояльность и возврат клиентов",
    ],
    price: "14 900 ₽",
    level: "any",
    direction: "technique",
  },
  {
    id: 5,
    title: "Коррекция фигуры: быстрые результаты, за которые платят",
    description: "Освойте востребованные техники коррекции фигуры и начните зарабатывать на одном из самых прибыльных направлений.",
    bullets: [
      "Уменьшать объемы и работать с целлюлитом",
      "Устранять отёки и улучшать внешний вид",
      "Создавать курс процедур для клиента",
    ],
    price: "16 900 ₽",
    level: "any",
    direction: "income",
  },
  {
    id: 6,
    title: "Висцеральный массаж с нуля: быстрый старт без медобразования",
    description: "Освойте базовые техники работы с внутренними органами и расширьте спектр своих услуг.",
    bullets: [
      "Основам висцеральной терапии",
      "Безопасной работе с внутренними органами",
      "Применению техник на практике",
    ],
    price: "5 900 ₽",
    level: "beginner",
    direction: "technique",
  },
  {
    id: 7,
    title: "Массажист с потоком клиентов: от 0 до стабильной записи",
    description: "Системный подход к привлечению клиентов и стабильному доходу — выбери свой уровень.",
    bullets: [
      "Строить поток клиентов с нуля",
      "Упаковать личный бренд и повысить чек",
      "Выйти на стабильный доход",
    ],
    price: "от 4 900 ₽",
    priceNote: "3 тарифа",
    level: "any",
    direction: "income",
    tiers: [
      { label: "Старт", color: "#22c55e", price: "4 900 ₽" },
      { label: "Профи", color: "#f59e0b", price: "14 900 ₽" },
      { label: "Эксперт", color: "#ef4444", price: "34 900 ₽" },
    ],
  },
];

type LevelFilter = "all" | "beginner" | "practitioner";
type DirectionFilter = "all" | "technique" | "income";

export default function CatalogPrivate() {
  const [levelFilter, setLevelFilter] = useState<LevelFilter>("all");
  const [directionFilter, setDirectionFilter] = useState<DirectionFilter>("all");

  const filtered = COURSES.filter((c) => {
    const levelOk =
      levelFilter === "all" ||
      c.level === "any" ||
      c.level === levelFilter;
    const dirOk = directionFilter === "all" || c.direction === directionFilter;
    return levelOk && dirOk;
  });

  return (
    <div style={{ background: BG, minHeight: "100vh", fontFamily: "Montserrat, sans-serif", color: "#1a1a1a" }}>
      <DokNavbar />

      <main style={{ paddingTop: 100, paddingBottom: 80 }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px" }}>

          {/* Hero */}
          <div style={{ marginBottom: 48 }}>
            <a href="/catalog" style={{ display: "inline-flex", alignItems: "center", gap: 6, color: "#999", fontSize: 14, textDecoration: "none", marginBottom: 24 }}
              onMouseEnter={e => (e.currentTarget.style.color = ACCENT)}
              onMouseLeave={e => (e.currentTarget.style.color = "#999")}
            >
              <Icon name="ArrowLeft" size={14} />
              Назад к каталогу
            </a>
            <h1 style={{
              fontFamily: "Cormorant, serif",
              fontSize: "clamp(32px, 5vw, 52px)",
              fontWeight: 700,
              margin: "0 0 12px",
              lineHeight: 1.1,
            }}>
              Курсы для массажистов
            </h1>
            <p style={{ fontSize: 17, color: "#666", margin: 0 }}>
              Практические курсы для роста навыков и дохода — от первых клиентов до высокого чека
            </p>
          </div>

          {/* Filters */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginBottom: 44 }}>
            <FilterGroup
              label="Уровень:"
              options={[
                { value: "all", label: "Все" },
                { value: "beginner", label: "Новичок" },
                { value: "practitioner", label: "Практикующий" },
              ]}
              active={levelFilter}
              onChange={(v) => setLevelFilter(v as LevelFilter)}
            />
            <div style={{ width: 1, background: "#e8e8e4", alignSelf: "stretch" }} />
            <FilterGroup
              label="Направление:"
              options={[
                { value: "all", label: "Все" },
                { value: "technique", label: "Техника" },
                { value: "income", label: "Доход / клиенты" },
              ]}
              active={directionFilter}
              onChange={(v) => setDirectionFilter(v as DirectionFilter)}
            />
          </div>

          {/* Grid */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 24,
          }} className="cp-grid">
            {filtered.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>

          {filtered.length === 0 && (
            <div style={{ textAlign: "center", padding: "80px 0", color: "#999", fontSize: 16 }}>
              По выбранным фильтрам курсов не найдено
            </div>
          )}
        </div>
      </main>

      <style>{`
        @media (max-width: 900px) {
          .cp-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @media (max-width: 600px) {
          .cp-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}

function FilterGroup({
  label, options, active, onChange,
}: {
  label: string;
  options: { value: string; label: string }[];
  active: string;
  onChange: (v: string) => void;
}) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
      <span style={{ fontSize: 13, color: "#999", fontWeight: 500 }}>{label}</span>
      {options.map((o) => (
        <button
          key={o.value}
          onClick={() => onChange(o.value)}
          style={{
            padding: "6px 14px",
            borderRadius: 8,
            border: `1.5px solid ${active === o.value ? ACCENT : "#e0e0dc"}`,
            background: active === o.value ? `${ACCENT}18` : "#fff",
            color: active === o.value ? ACCENT : "#555",
            fontSize: 13,
            fontWeight: active === o.value ? 600 : 400,
            cursor: "pointer",
            transition: "all 0.18s",
            fontFamily: "Montserrat, sans-serif",
          }}
          onMouseEnter={e => { if (active !== o.value) (e.currentTarget as HTMLButtonElement).style.borderColor = ACCENT; }}
          onMouseLeave={e => { if (active !== o.value) (e.currentTarget as HTMLButtonElement).style.borderColor = "#e0e0dc"; }}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

function CourseCard({ course }: { course: Course }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: "#fff",
        borderRadius: 18,
        border: "1px solid #e8e8e4",
        padding: "28px 28px 24px",
        display: "flex",
        flexDirection: "column",
        gap: 0,
        boxShadow: hovered ? "0 20px 56px rgba(0,0,0,0.13)" : "0 2px 16px rgba(0,0,0,0.06)",
        transform: hovered ? "translateY(-4px)" : "translateY(0)",
        transition: "all 0.25s ease",
      }}
    >
      <h3 style={{
        fontSize: 16,
        fontWeight: 700,
        lineHeight: 1.35,
        margin: "0 0 12px",
        color: "#1a1a1a",
      }}>
        {course.title}
      </h3>

      <p style={{ fontSize: 13.5, color: "#666", lineHeight: 1.6, margin: "0 0 18px" }}>
        {course.description}
      </p>

      {/* Bullets */}
      <div style={{ marginBottom: 20 }}>
        <div style={{ fontSize: 12, fontWeight: 600, color: ACCENT, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 8 }}>
          Чему научитесь
        </div>
        <ul style={{ margin: 0, padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 6 }}>
          {course.bullets.map((b, i) => (
            <li key={i} style={{ display: "flex", gap: 8, alignItems: "flex-start", fontSize: 13, color: "#444", lineHeight: 1.4 }}>
              <span style={{ color: ACCENT, marginTop: 2, flexShrink: 0 }}>✓</span>
              {b}
            </li>
          ))}
        </ul>
      </div>

      {/* Tiers (for course 7) */}
      {course.tiers && (
        <div style={{ display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap" }}>
          {course.tiers.map((t) => (
            <div key={t.label} style={{
              flex: 1, minWidth: 70,
              border: `1.5px solid ${t.color}22`,
              borderRadius: 10,
              padding: "8px 10px",
              background: `${t.color}08`,
            }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: t.color, marginBottom: 2 }}>{t.label}</div>
              <div style={{ fontSize: 13, fontWeight: 600, color: "#1a1a1a" }}>{t.price}</div>
            </div>
          ))}
        </div>
      )}

      <div style={{ marginTop: "auto" }}>
        {/* Price */}
        <div style={{ marginBottom: 16 }}>
          <span style={{ fontSize: 22, fontWeight: 700, color: "#1a1a1a" }}>{course.price}</span>
          {course.priceNote && (
            <span style={{ fontSize: 13, color: "#999", marginLeft: 8 }}>{course.priceNote}</span>
          )}
        </div>

        {/* Buttons */}
        <div style={{ display: "flex", gap: 10 }}>
          <button
            style={{
              flex: 1,
              padding: "10px 14px",
              borderRadius: 10,
              border: `1.5px solid ${ACCENT}`,
              background: "transparent",
              color: ACCENT,
              fontSize: 13,
              fontWeight: 600,
              cursor: "pointer",
              fontFamily: "Montserrat, sans-serif",
              transition: "all 0.18s",
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = `${ACCENT}12`; }}
            onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = "transparent"; }}
          >
            Подробнее
          </button>
          <button
            style={{
              flex: 1,
              padding: "10px 14px",
              borderRadius: 10,
              border: "none",
              background: ACCENT,
              color: "#fff",
              fontSize: 13,
              fontWeight: 600,
              cursor: "pointer",
              fontFamily: "Montserrat, sans-serif",
              boxShadow: `0 4px 14px ${ACCENT_SHADOW}`,
              transition: "all 0.18s",
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = ACCENT_DARK; }}
            onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = ACCENT; }}
          >
            Купить / Рассрочка
          </button>
        </div>
      </div>
    </div>
  );
}
