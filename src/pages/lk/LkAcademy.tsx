import { useState, useEffect } from "react";
import Icon from "@/components/ui/icon";
import LkAcademyCourse from "./LkAcademyCourse";

const API = "https://functions.poehali.dev/3e9572e2-e118-4584-91dd-809cac9fc3ea";
const ACCENT = "hsl(185,85%,32%)";
const SERIF = "Cormorant, serif";
const PAGE_SIZE = 9;

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
  is_partner?: boolean; partner_name?: string; partner_url?: string;
  partner_price?: string; partner_format?: "online" | "offline" | "";
}

interface CategoryInfo {
  code: string; title: string; description: string; cover_url: string; icon: string; sort_order: number;
}

export default function LkAcademy({ onNavigate, excludeCategories }: { onNavigate?: (tab: string) => void; excludeCategories?: string[] }) {
  const [categories, setCategories] = useState<CategoryInfo[]>([]);
  const [dbCourses, setDbCourses] = useState<DbCourse[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCat, setSelectedCat] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [activeCourseId, setActiveCourseId] = useState<number | null>(() => {
    const saved = sessionStorage.getItem("lk_open_course_id");
    if (saved) { sessionStorage.removeItem("lk_open_course_id"); return Number(saved); }
    return null;
  });

  const reloadCourses = () => {
    fetch(`${API}?action=courses_list`, { headers: { "X-Session-Id": sid() } })
      .then(r => r.json())
      .then(d => { if (Array.isArray(d)) setDbCourses(d); });
  };

  useEffect(() => {
    Promise.all([
      fetch(`${API}?action=categories_list`).then(r => r.json()),
      fetch(`${API}?action=courses_list`, { headers: { "X-Session-Id": sid() } }).then(r => r.json()),
    ])
      .then(([cats, courses]) => {
        if (Array.isArray(cats)) setCategories(cats);
        if (Array.isArray(courses)) setDbCourses(courses);
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { setPage(1); }, [selectedCat]);

  if (activeCourseId) {
    return (
      <LkAcademyCourse
        courseId={activeCourseId}
        onBack={() => { setActiveCourseId(null); window.scrollTo({ top: 0, behavior: "instant" }); }}
        onNavigate={onNavigate}
      />
    );
  }

  const visibleCategories = (excludeCategories?.length
    ? categories.filter(c => !excludeCategories.includes(c.code))
    : categories
  ).map(cat => ({
    ...cat,
    courses: dbCourses.filter(c => (c.categories?.length ? c.categories : [c.category]).includes(cat.code)),
  }));

  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", padding: 60 }}>
        <div style={{ width: 28, height: 28, border: "3px solid #eee", borderTopColor: ACCENT, borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
        <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      </div>
    );
  }

  // ── Экран: тренинги выбранной категории ─────────────────────────────────
  if (selectedCat) {
    const cat = visibleCategories.find(c => c.code === selectedCat);
    if (!cat) { setSelectedCat(null); return null; }
    const totalPages = Math.max(1, Math.ceil(cat.courses.length / PAGE_SIZE));
    const pageCourses = cat.courses.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

    return (
      <div style={{ maxWidth: 900 }}>
        <button
          onClick={() => setSelectedCat(null)}
          style={{ display: "flex", alignItems: "center", gap: 6, background: "none", border: "none", cursor: "pointer", color: ACCENT, fontWeight: 600, fontSize: 14, marginBottom: 18, padding: 0, fontFamily: "Montserrat, sans-serif" }}
        >
          <Icon name="ChevronLeft" size={16} /> Все категории
        </button>

        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
          <div style={{ width: 38, height: 38, borderRadius: 10, background: "hsl(185,85%,96%)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <Icon name={cat.icon || "GraduationCap"} size={18} style={{ color: ACCENT }} />
          </div>
          <h1 style={{ fontFamily: SERIF, fontSize: "clamp(22px,2.8vw,30px)", fontWeight: 700, color: "#1a1a1a", margin: 0 }}>{cat.title}</h1>
        </div>
        {cat.description && <p style={{ fontSize: 14, color: "#888", margin: "0 0 28px", maxWidth: 640 }}>{cat.description}</p>}

        {cat.courses.length === 0 ? (
          <div style={{ background: "#fff", borderRadius: 20, border: "1.5px solid #f0f0ec", padding: "48px 24px", display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
            <div style={{ width: 48, height: 48, borderRadius: 14, background: "hsl(185,85%,96%)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Icon name="Clock" size={20} style={{ color: ACCENT }} />
            </div>
            <div style={{ fontSize: 14, fontWeight: 600, color: "#555" }}>Тренинги скоро появятся</div>
            <div style={{ fontSize: 12, color: "#aaa", textAlign: "center", maxWidth: 280, lineHeight: 1.6 }}>
              Мы готовим материалы. Следите за обновлениями в этом разделе.
            </div>
          </div>
        ) : (
          <>
            <div className="academy-course-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
              {pageCourses.map(c => {
                if (c.is_partner) return <PartnerCourseCard key={c.id} course={c} />;
                if (c.type === "offline") return <OfflineCourseCard key={c.id} course={c} onBought={reloadCourses} />;
                return <DbCourseCard key={c.id} course={c} onClick={() => { setActiveCourseId(c.id); window.scrollTo({ top: 0, behavior: "instant" }); }} />;
              })}
            </div>

            {totalPages > 1 && (
              <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 8, marginTop: 32, flexWrap: "wrap" }}>
                <button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  style={{ width: 36, height: 36, borderRadius: 8, border: "1.5px solid #e8e8e4", background: "#fff", color: page === 1 ? "#ccc" : "#444", cursor: page === 1 ? "default" : "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
                >
                  <Icon name="ChevronLeft" size={15} />
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                  <button
                    key={p}
                    onClick={() => setPage(p)}
                    style={{
                      minWidth: 36, height: 36, borderRadius: 8, fontSize: 13, fontWeight: 600, fontFamily: "Montserrat, sans-serif",
                      border: p === page ? "none" : "1.5px solid #e8e8e4",
                      background: p === page ? ACCENT : "#fff",
                      color: p === page ? "#fff" : "#666", cursor: "pointer",
                    }}
                  >
                    {p}
                  </button>
                ))}
                <button
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  style={{ width: 36, height: 36, borderRadius: 8, border: "1.5px solid #e8e8e4", background: "#fff", color: page === totalPages ? "#ccc" : "#444", cursor: page === totalPages ? "default" : "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
                >
                  <Icon name="ChevronRight" size={15} />
                </button>
              </div>
            )}
          </>
        )}

        <style>{`
          @media (max-width: 900px) { .academy-course-grid { grid-template-columns: repeat(2,1fr) !important; } }
          @media (max-width: 600px) { .academy-course-grid { grid-template-columns: 1fr !important; } }
        `}</style>
      </div>
    );
  }

  // ── Экран: список категорий ─────────────────────────────────────────────
  return (
    <div style={{ maxWidth: 900 }}>
      <h1 style={{ fontFamily: SERIF, fontSize: "clamp(24px,3vw,32px)", fontWeight: 700, color: "#1a1a1a", margin: "0 0 8px" }}>
        Академия
      </h1>
      <p style={{ fontSize: 14, color: "#888", margin: "0 0 32px" }}>
        Тренинги для каждой роли в вашем салоне
      </p>

      {visibleCategories.length === 0 ? (
        <div style={{ textAlign: "center", padding: "60px 20px", background: "#fff", borderRadius: 20, border: "1.5px solid #f0f0ec" }}>
          <Icon name="GraduationCap" size={40} style={{ color: "#ddd", marginBottom: 12 }} />
          <div style={{ fontSize: 15, fontWeight: 600, color: "#aaa" }}>Категории скоро появятся</div>
        </div>
      ) : (
        <div className="academy-cat-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
          {visibleCategories.map(cat => (
            <div
              key={cat.code}
              onClick={() => setSelectedCat(cat.code)}
              style={{ background: "#fff", borderRadius: 18, border: "1.5px solid #f0f0ec", overflow: "hidden", cursor: "pointer", display: "flex", flexDirection: "column", transition: "border-color 0.15s, transform 0.15s" }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = ACCENT; e.currentTarget.style.transform = "translateY(-2px)"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = "#f0f0ec"; e.currentTarget.style.transform = "translateY(0)"; }}
            >
              {cat.cover_url ? (
                <img src={cat.cover_url} alt="" style={{ width: "100%", aspectRatio: "16/9", objectFit: "cover", display: "block" }} />
              ) : (
                <div style={{ width: "100%", aspectRatio: "16/9", background: "hsl(185,85%,96%)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Icon name={cat.icon || "GraduationCap"} size={36} style={{ color: ACCENT }} />
                </div>
              )}
              <div style={{ padding: "16px 18px", display: "flex", flexDirection: "column", gap: 6, flex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <div style={{ fontSize: 15, fontWeight: 700, color: "#1a1a1a", lineHeight: 1.3, flex: 1 }}>{cat.title}</div>
                  {cat.courses.length > 0 && (
                    <span style={{ fontSize: 11, fontWeight: 700, color: ACCENT, background: "hsl(185,85%,95%)", padding: "2px 8px", borderRadius: 20, flexShrink: 0 }}>
                      {cat.courses.length}
                    </span>
                  )}
                </div>
                {cat.description && <div style={{ fontSize: 12, color: "#888", lineHeight: 1.6, flex: 1 }}>{cat.description}</div>}
                <div style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 12, color: ACCENT, fontWeight: 600, marginTop: 4 }}>
                  Открыть <Icon name="ArrowRight" size={13} />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div style={{ marginTop: 24, padding: "14px 18px", background: `hsla(185,85%,32%,0.05)`, borderRadius: 12, border: `1px solid hsla(185,85%,32%,0.12)`, display: "flex", gap: 12, alignItems: "flex-start" }}>
        <Icon name="Info" size={15} style={{ color: ACCENT, marginTop: 1, flexShrink: 0 }} />
        <div style={{ fontSize: 12, color: "#666", lineHeight: 1.7 }}>
          Нажмите «Подробнее» на карточке тренинга — перейдёте на страницу с описанием и оформлением доступа.
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) { .academy-cat-grid { grid-template-columns: repeat(2,1fr) !important; } }
        @media (max-width: 600px) { .academy-cat-grid { grid-template-columns: 1fr !important; } }
      `}</style>
    </div>
  );
}

// ── Карточка курса из БД (с уроками внутри кабинета) ──────────────────────────
function DbCourseCard({ course, onClick }: { course: DbCourse; onClick: () => void }) {
  return (
    <div
      onClick={onClick}
      style={{ background: "#fff", borderRadius: 14, border: "1.5px solid #f0f0ec", cursor: "pointer", transition: "border-color 0.15s", display: "flex", flexDirection: "column", position: "relative", overflow: "hidden" }}
      onMouseEnter={e => (e.currentTarget.style.borderColor = ACCENT)}
      onMouseLeave={e => (e.currentTarget.style.borderColor = "#f0f0ec")}
    >
      {course.cover_url && (
        <img src={course.cover_url} alt="" style={{ width: "100%", aspectRatio: "16/9", objectFit: "cover", display: "block" }} />
      )}
      {course.has_access && (
        <div style={{ position: "absolute", top: 10, right: 12, fontSize: 10, fontWeight: 700, color: "hsl(130,60%,40%)", background: "hsl(130,60%,94%)", padding: "2px 8px", borderRadius: 6, border: "1px solid hsl(130,60%,75%)" }}>
          Доступ открыт
        </div>
      )}
      <div style={{ padding: "16px 18px", flex: 1, display: "flex", flexDirection: "column", gap: 8 }}>
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
    <div style={{ background: "#fff", borderRadius: 14, border: "1.5px solid #f0f0ec", display: "flex", flexDirection: "column", position: "relative", overflow: "hidden" }}>
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
        <img src={course.cover_url} alt="" loading="lazy" style={{ width: "100%", aspectRatio: "16/9", objectFit: "cover", display: "block" }} />
      )}
      <div style={{ padding: "16px 18px", display: "flex", flexDirection: "column", gap: 10, flex: 1 }}>
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

// ── Карточка партнёрского тренинга (внешняя школа) ─────────────────────────────
function PartnerCourseCard({ course }: { course: DbCourse }) {
  const priceLabel = course.partner_price?.trim() || "Бесплатно";
  return (
    <div style={{ background: "#fff", borderRadius: 14, border: "1.5px solid #f0f0ec", display: "flex", flexDirection: "column", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", top: 12, left: 12, zIndex: 2, fontSize: 10, fontWeight: 800, letterSpacing: "0.06em", color: "hsl(38,80%,35%)", background: "#fff", padding: "3px 9px", borderRadius: 6, border: "1px solid hsl(38,80%,70%)" }}>
        ПАРТНЁР
      </div>
      {course.partner_format && (
        <div style={{ position: "absolute", top: 12, right: 12, zIndex: 2, fontSize: 10, fontWeight: 700, letterSpacing: "0.06em", color: "#fff", background: course.partner_format === "offline" ? "hsl(270,65%,52%)" : "hsl(200,80%,45%)", padding: "3px 9px", borderRadius: 6 }}>
          {course.partner_format === "offline" ? "ОФЛАЙН" : "ОНЛАЙН"}
        </div>
      )}
      {course.cover_url ? (
        <img src={course.cover_url} alt="" loading="lazy" style={{ width: "100%", aspectRatio: "16/9", objectFit: "cover", display: "block" }} />
      ) : (
        <div style={{ width: "100%", aspectRatio: "16/9", background: "hsl(38,90%,96%)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Icon name="ExternalLink" size={28} style={{ color: "hsl(38,80%,50%)" }} />
        </div>
      )}
      <div style={{ padding: "16px 18px", display: "flex", flexDirection: "column", gap: 8, flex: 1 }}>
        {course.partner_name && (
          <div style={{ fontSize: 11, color: "#aaa", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.03em" }}>{course.partner_name}</div>
        )}
        <div style={{ fontSize: 14, fontWeight: 700, color: "#1a1a1a", lineHeight: 1.4 }}>{course.title}</div>
        {course.description && (
          <div style={{ fontSize: 12, color: "#888", lineHeight: 1.6, flex: 1 }}>{course.description}</div>
        )}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 4, gap: 8 }}>
          <span style={{ fontSize: 13, fontWeight: 800, color: "hsl(38,80%,40%)" }}>{priceLabel}</span>
          <a
            href={course.partner_url || "#"}
            target="_blank"
            rel="noopener noreferrer"
            style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 12, color: "#fff", fontWeight: 700, background: "hsl(38,80%,50%)", padding: "8px 14px", borderRadius: 9, textDecoration: "none", whiteSpace: "nowrap" }}
          >
            Подробнее <Icon name="ArrowUpRight" size={13} />
          </a>
        </div>
      </div>
    </div>
  );
}
