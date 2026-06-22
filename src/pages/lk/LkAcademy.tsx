import { useState, useEffect } from "react";
import Icon from "@/components/ui/icon";
import LkAcademyCourse from "./LkAcademyCourse";

const API = "https://functions.poehali.dev/3e9572e2-e118-4584-91dd-809cac9fc3ea";
const ACCENT = "hsl(185,85%,32%)";
const SERIF = "Cormorant, serif";

function sid() { return localStorage.getItem("lk_session") || ""; }

interface ScheduleBlock { time_start: string; time_end: string; title: string; }

interface DbCourse {
  id: number; title: string; description: string; cover_url: string;
  category: string; categories: string[]; access_cost: number; lesson_cost: number;
  has_access: boolean; sort_order: number;
  type?: "online" | "offline";
  event_date?: string; event_time_start?: string; event_time_end?: string;
  event_location?: string; schedule?: ScheduleBlock[];
  energy_reward?: number; max_participants?: number;
}

// Статические лендинги (продажные страницы вне кабинета)
interface LandingCourse {
  title: string; description: string; price?: string; badge?: string; href: string;
}

interface Category {
  id: string; title: string; icon: string; color: string; bg: string;
  landings: LandingCourse[];
}

const CATEGORIES: Category[] = [
  {
    id: "owner", title: "Для владельца салона и руководителя",
    icon: "Building2", color: "hsl(185,85%,32%)", bg: "hsl(185,85%,96%)", landings: [],
  },
  {
    id: "admin", title: "Для администратора",
    icon: "UserCog", color: "hsl(240,70%,55%)", bg: "hsl(240,70%,97%)", landings: [],
  },
  {
    id: "master", title: "Для мастеров",
    icon: "Scissors", color: "hsl(20,85%,50%)", bg: "hsl(20,85%,96%)", landings: [],
  },
  {
    id: "body", title: "Для специалистов по телу",
    icon: "Heart", color: "hsl(340,75%,50%)", bg: "hsl(340,75%,97%)", landings: [],
  },
];

export default function LkAcademy({ onNavigate }: { onNavigate?: (tab: string) => void }) {
  const [dbCourses, setDbCourses] = useState<DbCourse[]>([]);
  const [activeCourseId, setActiveCourseId] = useState<number | null>(() => {
    const saved = sessionStorage.getItem("lk_open_course_id");
    if (saved) { sessionStorage.removeItem("lk_open_course_id"); return Number(saved); }
    return null;
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API}?action=courses_list`, { headers: { "X-Session-Id": sid() } })
      .then(r => r.json())
      .then(d => { if (Array.isArray(d)) setDbCourses(d); })
      .finally(() => setLoading(false));
  }, []);

  if (activeCourseId) {
    return (
      <LkAcademyCourse
        courseId={activeCourseId}
        onBack={() => { setActiveCourseId(null); window.scrollTo({ top: 0, behavior: "instant" }); }}
        onNavigate={onNavigate}
      />
    );
  }

  return (
    <div style={{ maxWidth: 860 }}>
      <h1 style={{ fontFamily: SERIF, fontSize: "clamp(24px,3vw,32px)", fontWeight: 700, color: "#1a1a1a", margin: "0 0 8px" }}>
        Академия
      </h1>
      <p style={{ fontSize: 14, color: "#888", margin: "0 0 32px" }}>
        Тренинги для каждой роли в вашем салоне
      </p>

      {/* Категории: лендинги + курсы из БД */}
      <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
        {CATEGORIES.map(cat => {
          const catDbCourses = dbCourses.filter(c => (c.categories?.length ? c.categories : [c.category]).includes(cat.id));
          const hasContent = cat.landings.length > 0 || catDbCourses.length > 0;
          return (
            <div key={cat.id} style={{ background: "#fff", borderRadius: 20, border: "1.5px solid #f0f0ec", overflow: "hidden" }}>
              <div style={{ padding: "18px 24px", borderBottom: "1px solid #f5f5f2", display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ width: 38, height: 38, borderRadius: 10, background: cat.bg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <Icon name={cat.icon} size={18} style={{ color: cat.color }} />
                </div>
                <div style={{ fontSize: 16, fontWeight: 700, color: "#1a1a1a" }}>{cat.title}</div>
              </div>

              {!hasContent ? (
                <div style={{ padding: "32px 24px", display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
                  <div style={{ width: 48, height: 48, borderRadius: 14, background: cat.bg, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Icon name="Clock" size={20} style={{ color: cat.color }} />
                  </div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: "#555" }}>Тренинги скоро появятся</div>
                  <div style={{ fontSize: 12, color: "#aaa", textAlign: "center", maxWidth: 280, lineHeight: 1.6 }}>
                    Мы готовим материалы. Следите за обновлениями в этом разделе.
                  </div>
                </div>
              ) : (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 1, background: "#f5f5f2" }}>
                  {catDbCourses.map(c => c.type === "offline"
                    ? <OfflineCourseCard key={c.id} course={c} onBought={() => {
                        fetch(`${API}?action=courses_list`, { headers: { "X-Session-Id": sid() } })
                          .then(r => r.json()).then(d => { if (Array.isArray(d)) setDbCourses(d); });
                      }} />
                    : <DbCourseCard key={c.id} course={c} onClick={() => { setActiveCourseId(c.id); window.scrollTo({ top: 0, behavior: "instant" }); }} />
                  )}
                  {cat.landings.map(course => (
                    <LandingCard key={course.href} course={course} color={cat.color} bg={cat.bg} />
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div style={{ marginTop: 24, padding: "14px 18px", background: `hsla(185,85%,32%,0.05)`, borderRadius: 12, border: `1px solid hsla(185,85%,32%,0.12)`, display: "flex", gap: 12, alignItems: "flex-start" }}>
        <Icon name="Info" size={15} style={{ color: ACCENT, marginTop: 1, flexShrink: 0 }} />
        <div style={{ fontSize: 12, color: "#666", lineHeight: 1.7 }}>
          Нажмите «Подробнее» на карточке тренинга — перейдёте на страницу с описанием и оформлением доступа.
        </div>
      </div>
    </div>
  );
}

// ── Карточка курса из БД (с уроками внутри кабинета) ──────────────────────────
function DbCourseCard({ course, onClick }: { course: DbCourse; onClick: () => void }) {
  return (
    <div
      onClick={onClick}
      style={{ background: "#fff", cursor: "pointer", transition: "background 0.15s", display: "flex", flexDirection: "column", position: "relative" }}
      onMouseEnter={e => (e.currentTarget.style.background = "hsl(185,85%,96%)")}
      onMouseLeave={e => (e.currentTarget.style.background = "#fff")}
    >
      {course.cover_url && (
        <img src={course.cover_url} alt="" style={{ width: "100%", objectFit: "contain", display: "block" }} />
      )}
      {course.has_access && (
        <div style={{ position: "absolute", top: 10, right: 12, fontSize: 10, fontWeight: 700, color: "hsl(130,60%,40%)", background: "hsl(130,60%,94%)", padding: "2px 8px", borderRadius: 6, border: "1px solid hsl(130,60%,75%)" }}>
          Доступ открыт
        </div>
      )}
      <div style={{ padding: "16px 22px", flex: 1, display: "flex", flexDirection: "column", gap: 8 }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: "#1a1a1a", lineHeight: 1.4 }}>{course.title}</div>
        {course.description && (
          <div style={{ fontSize: 12, color: "#888", lineHeight: 1.6, flex: 1 }}>{course.description}</div>
        )}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 4 }}>
          <span style={{ fontSize: 12, color: "#aaa" }}>
            {!course.has_access && course.access_cost > 0 ? `${course.access_cost} ⚡` : ""}
          </span>
          <div style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 12, color: ACCENT, fontWeight: 600 }}>
            Перейти <Icon name="ArrowRight" size={13} />
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Карточка офлайн-тренинга ──────────────────────────────────────────────────
function OfflineCourseCard({ course, onBought }: { course: DbCourse; onBought: () => void }) {
  const [buying, setBuying] = useState(false);
  const [bought, setBought] = useState(course.has_access);
  const [err, setErr] = useState("");
  const [expanded, setExpanded] = useState(false);

  const formatDate = (d?: string) => {
    if (!d) return "";
    const dt = new Date(d + "T00:00:00");
    return dt.toLocaleDateString("ru-RU", { day: "numeric", month: "long", year: "numeric" });
  };

  const formatTime = (t?: string) => t ? t.slice(0, 5) : "";

  const buy = async () => {
    if (buying || bought) return;
    setBuying(true); setErr("");
    const res = await fetch(`${API}?action=offline_training_buy`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "X-Session-Id": sid() },
      body: JSON.stringify({ course_id: course.id }),
    }).then(r => r.json());
    setBuying(false);
    if (res.error) { setErr(res.error); return; }
    setBought(true);
    onBought();
  };

  return (
    <div style={{ background: "#fff", display: "flex", flexDirection: "column", position: "relative" }}>
      {/* Плашка ОФЛАЙН */}
      <div style={{ position: "absolute", top: 12, left: 12, zIndex: 2, fontSize: 10, fontWeight: 800, letterSpacing: "0.08em", color: "#fff", background: "hsl(270,65%,52%)", padding: "3px 9px", borderRadius: 6 }}>
        ОФЛАЙН
      </div>
      {bought && (
        <div style={{ position: "absolute", top: 12, right: 12, zIndex: 2, fontSize: 10, fontWeight: 700, color: "hsl(130,60%,40%)", background: "hsl(130,60%,94%)", padding: "2px 8px", borderRadius: 6, border: "1px solid hsl(130,60%,75%)" }}>
          Вы записаны
        </div>
      )}
      {course.cover_url && (
        <img src={course.cover_url} alt="" loading="lazy" style={{ width: "100%", objectFit: "contain", display: "block" }} />
      )}
      <div style={{ padding: "16px 20px", display: "flex", flexDirection: "column", gap: 10, flex: 1 }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: "#1a1a1a", lineHeight: 1.4 }}>{course.title}</div>

        {/* Дата и место */}
        {course.event_date && (
          <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "#555" }}>
              <Icon name="Calendar" size={13} style={{ color: ACCENT }} />
              {formatDate(course.event_date)}
              {course.event_time_start && (
                <span style={{ color: "#aaa" }}>· {formatTime(course.event_time_start)}{course.event_time_end ? `–${formatTime(course.event_time_end)}` : ""}</span>
              )}
            </div>
            {course.event_location && (
              <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "#555" }}>
                <Icon name="MapPin" size={13} style={{ color: ACCENT }} />
                {course.event_location}
              </div>
            )}
            {course.max_participants && (
              <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "#888" }}>
                <Icon name="Users" size={13} style={{ color: "#aaa" }} />
                Группа до {course.max_participants} человек
              </div>
            )}
          </div>
        )}

        {/* Расписание по блокам */}
        {course.schedule && course.schedule.length > 0 && (
          <div>
            <button onClick={() => setExpanded(v => !v)}
              style={{ display: "flex", alignItems: "center", gap: 4, background: "none", border: "none", cursor: "pointer", color: ACCENT, fontSize: 12, fontWeight: 600, padding: 0, fontFamily: "Montserrat, sans-serif" }}>
              <Icon name={expanded ? "ChevronUp" : "ChevronDown"} size={13} />
              {expanded ? "Скрыть расписание" : "Программа тренинга"}
            </button>
            {expanded && (
              <div style={{ marginTop: 8, display: "flex", flexDirection: "column", gap: 4 }}>
                {course.schedule.map((b, i) => (
                  <div key={i} style={{ display: "flex", gap: 8, fontSize: 12, color: "#444", alignItems: "baseline" }}>
                    <span style={{ flexShrink: 0, fontWeight: 700, color: ACCENT, minWidth: 95 }}>
                      {formatTime(b.time_start)}{b.time_end ? `–${formatTime(b.time_end)}` : ""}
                    </span>
                    <span style={{ color: "#555" }}>{b.title}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {course.description && (
          <div style={{ fontSize: 12, color: "#888", lineHeight: 1.6 }}>{course.description}</div>
        )}

        {/* Бонус энергии */}
        {(course.energy_reward ?? 0) > 0 && (
          <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "hsl(40,90%,40%)", background: "hsl(40,90%,96%)", borderRadius: 8, padding: "6px 10px" }}>
            <Icon name="Zap" size={13} />
            <span>+{course.energy_reward} Энергии вернётся сразу после оплаты</span>
          </div>
        )}

        {err && <div style={{ fontSize: 12, color: "hsl(0,70%,55%)", fontWeight: 600 }}>{err}</div>}

        {/* Кнопка покупки */}
        {bought ? (
          <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, fontWeight: 700, color: "hsl(130,60%,40%)" }}>
            <Icon name="CheckCircle" size={15} /> Вы записаны на тренинг
          </div>
        ) : (
          <button onClick={buy} disabled={buying}
            style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6, padding: "10px 0", borderRadius: 10, border: "none", cursor: buying ? "default" : "pointer",
              background: buying ? "#e0e0dc" : "hsl(270,65%,52%)", color: "#fff", fontSize: 13, fontWeight: 700, fontFamily: "Montserrat, sans-serif", transition: "background 0.2s" }}>
            {buying ? "Обрабатываем..." : (
              <>
                <Icon name="Ticket" size={14} />
                Записаться{course.access_cost > 0 ? ` · ${course.access_cost} ⚡` : " бесплатно"}
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
}

// ── Карточка лендинга (внешняя ссылка) ────────────────────────────────────────
function LandingCard({ course, color, bg }: { course: LandingCourse; color: string; bg: string }) {
  return (
    <a
      href={course.href}
      style={{ display: "flex", flexDirection: "column", gap: 10, padding: "20px 22px", background: "#fff", textDecoration: "none", transition: "background 0.15s", position: "relative" }}
      onMouseEnter={e => (e.currentTarget.style.background = bg)}
      onMouseLeave={e => (e.currentTarget.style.background = "#fff")}
    >
      {course.badge && (
        <div style={{ position: "absolute", top: 14, right: 16, fontSize: 10, fontWeight: 700, color, background: bg, borderRadius: 6, padding: "2px 8px", border: `1px solid ${color}`, letterSpacing: "0.05em" }}>
          {course.badge}
        </div>
      )}
      <div style={{ fontSize: 14, fontWeight: 700, color: "#1a1a1a", lineHeight: 1.4, paddingRight: course.badge ? 70 : 0 }}>{course.title}</div>
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