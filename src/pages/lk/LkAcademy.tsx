import Icon from "@/components/ui/icon";

const ACCENT = "hsl(185,85%,32%)";
const SERIF = "Cormorant, serif";

interface Course {
  title: string;
  description: string;
  price?: string;
  slug: string;
}

interface Category {
  id: string;
  title: string;
  icon: string;
  color: string;
  bg: string;
  courses: Course[];
}

const CATEGORIES: Category[] = [
  {
    id: "owner",
    title: "Для владельца салона и руководителя",
    icon: "Building2",
    color: "hsl(185,85%,32%)",
    bg: "hsl(185,85%,96%)",
    courses: [],
  },
  {
    id: "admin",
    title: "Для администратора",
    icon: "UserCog",
    color: "hsl(240,70%,55%)",
    bg: "hsl(240,70%,97%)",
    courses: [],
  },
  {
    id: "master",
    title: "Для мастеров",
    icon: "Scissors",
    color: "hsl(20,85%,50%)",
    bg: "hsl(20,85%,96%)",
    courses: [],
  },
  {
    id: "body",
    title: "Для специалистов по телу",
    icon: "Heart",
    color: "hsl(340,75%,50%)",
    bg: "hsl(340,75%,97%)",
    courses: [],
  },
];

export default function LkAcademy() {
  return (
    <div style={{ maxWidth: 860 }}>
      <h1 style={{ fontFamily: SERIF, fontSize: "clamp(24px,3vw,32px)", fontWeight: 700, color: "#1a1a1a", margin: "0 0 8px" }}>
        Академия
      </h1>
      <p style={{ fontSize: 14, color: "#888", margin: "0 0 32px" }}>
        Онлайн-курсы для каждой роли в вашем салоне
      </p>

      <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
        {CATEGORIES.map(cat => (
          <div key={cat.id} style={{ background: "#fff", borderRadius: 20, border: "1.5px solid #f0f0ec", overflow: "hidden" }}>
            {/* Заголовок категории */}
            <div style={{ padding: "18px 24px", borderBottom: "1px solid #f5f5f2", display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ width: 38, height: 38, borderRadius: 10, background: cat.bg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <Icon name={cat.icon} size={18} style={{ color: cat.color }} />
              </div>
              <div style={{ fontSize: 16, fontWeight: 700, color: "#1a1a1a", fontFamily: "Montserrat, sans-serif" }}>
                {cat.title}
              </div>
            </div>

            {/* Курсы */}
            {cat.courses.length === 0 ? (
              <div style={{ padding: "32px 24px", display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
                <div style={{ width: 48, height: 48, borderRadius: 14, background: cat.bg, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Icon name="Clock" size={20} style={{ color: cat.color }} />
                </div>
                <div style={{ fontSize: 14, fontWeight: 600, color: "#555" }}>Курсы скоро появятся</div>
                <div style={{ fontSize: 12, color: "#aaa", textAlign: "center", maxWidth: 280, lineHeight: 1.6 }}>
                  Мы готовим материалы. Следите за обновлениями в этом разделе.
                </div>
              </div>
            ) : (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 1, background: "#f5f5f2" }}>
                {cat.courses.map(course => (
                  <CourseCard key={course.slug} course={course} color={cat.color} bg={cat.bg} />
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Подсказка */}
      <div style={{ marginTop: 24, padding: "14px 18px", background: `hsla(185,85%,32%,0.05)`, borderRadius: 12, border: `1px solid hsla(185,85%,32%,0.12)`, display: "flex", gap: 12, alignItems: "flex-start" }}>
        <Icon name="Info" size={15} style={{ color: ACCENT, marginTop: 1, flexShrink: 0 }} />
        <div style={{ fontSize: 12, color: "#666", lineHeight: 1.7 }}>
          Курсы размещены на внешней платформе. После выбора курса вы перейдёте на его страницу с описанием и возможностью покупки.
        </div>
      </div>
    </div>
  );
}

function CourseCard({ course, color, bg }: { course: Course; color: string; bg: string }) {
  return (
    <a
      href={`/courses/${course.slug}`}
      style={{ display: "flex", flexDirection: "column", gap: 10, padding: "20px 22px", background: "#fff", textDecoration: "none", transition: "background 0.15s" }}
      onMouseEnter={e => (e.currentTarget.style.background = bg)}
      onMouseLeave={e => (e.currentTarget.style.background = "#fff")}
    >
      <div style={{ fontSize: 14, fontWeight: 700, color: "#1a1a1a", lineHeight: 1.4 }}>{course.title}</div>
      <div style={{ fontSize: 12, color: "#888", lineHeight: 1.6, flex: 1 }}>{course.description}</div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 4 }}>
        {course.price && <div style={{ fontSize: 13, fontWeight: 800, color }}>{course.price}</div>}
        <div style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 12, color, fontWeight: 600 }}>
          Подробнее <Icon name="ArrowRight" size={13} />
        </div>
      </div>
    </a>
  );
}
