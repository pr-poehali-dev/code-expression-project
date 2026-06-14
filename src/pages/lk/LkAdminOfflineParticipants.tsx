import { useState, useEffect } from "react";
import { apiFetch, Course } from "./LkAdminCourses.types";
import { ACCENT, Spinner } from "./LkAdminShared";
import Icon from "@/components/ui/icon";

interface Participant {
  access_id: number;
  granted_at: string;
  course_id: number;
  course_title: string;
  event_date?: string;
  event_time_start?: string;
  event_time_end?: string;
  event_location?: string;
  user_id: number;
  full_name: string;
  email: string;
  username: string;
  segment: string;
  salon_id?: number;
  salon_name?: string;
  salon_city?: string;
  salon_address?: string;
  salon_telegram?: string;
  salon_instagram?: string;
}

function formatDate(d?: string) {
  if (!d) return "";
  const dt = new Date(d + "T00:00:00");
  return dt.toLocaleDateString("ru-RU", { day: "numeric", month: "long", year: "numeric" });
}

function formatTime(t?: string) {
  return t ? t.slice(0, 5) : "";
}

function formatGranted(s: string) {
  return new Date(s).toLocaleDateString("ru-RU", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
}

export function OfflineParticipantsSection({ courses }: { courses: Course[] }) {
  const offlineCourses = courses.filter(c => c.type === "offline");
  const [selectedCourseId, setSelectedCourseId] = useState<number | "all">("all");
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [loading, setLoading] = useState(false);

  const load = (courseId: number | "all") => {
    setLoading(true);
    const action = courseId === "all"
      ? "admin_offline_participants"
      : `admin_offline_participants&course_id=${courseId}`;
    apiFetch(action)
      .then(d => setParticipants(Array.isArray(d) ? d : []))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load("all"); }, []);

  const handleFilter = (id: number | "all") => {
    setSelectedCourseId(id);
    load(id);
  };

  // Группируем по курсу
  const grouped = participants.reduce<Record<number, Participant[]>>((acc, p) => {
    if (!acc[p.course_id]) acc[p.course_id] = [];
    acc[p.course_id].push(p);
    return acc;
  }, {});

  const hasSalon = (p: Participant) => !!p.salon_id && !!p.salon_name;

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18, flexWrap: "wrap", gap: 10 }}>
        <div style={{ fontSize: 15, fontWeight: 700, color: "#1a1a1a" }}>
          Участники офлайн-тренингов
        </div>
        <div style={{ fontSize: 13, color: "#888" }}>
          Всего: {participants.length} чел.
        </div>
      </div>

      {/* Фильтр по тренингу */}
      {offlineCourses.length > 1 && (
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 20 }}>
          <button onClick={() => handleFilter("all")}
            style={{ padding: "7px 16px", borderRadius: 8, border: "none", cursor: "pointer", fontFamily: "Montserrat, sans-serif", fontSize: 12, fontWeight: 600,
              background: selectedCourseId === "all" ? ACCENT : "#f0f0ec",
              color: selectedCourseId === "all" ? "#fff" : "#666" }}>
            Все тренинги
          </button>
          {offlineCourses.map(c => (
            <button key={c.id} onClick={() => handleFilter(c.id)}
              style={{ padding: "7px 16px", borderRadius: 8, border: "none", cursor: "pointer", fontFamily: "Montserrat, sans-serif", fontSize: 12, fontWeight: 600,
                background: selectedCourseId === c.id ? ACCENT : "#f0f0ec",
                color: selectedCourseId === c.id ? "#fff" : "#666" }}>
              {c.title}
            </button>
          ))}
        </div>
      )}

      {loading ? <Spinner /> : participants.length === 0 ? (
        <div style={{ textAlign: "center", padding: "48px 20px", color: "#aaa", fontSize: 14 }}>
          Пока никто не записался на офлайн-тренинги
        </div>
      ) : (
        Object.entries(grouped).map(([courseId, list]) => {
          const first = list[0];
          return (
            <div key={courseId} style={{ background: "#fff", borderRadius: 14, border: "1.5px solid #e8e8e4", marginBottom: 20, overflow: "hidden" }}>
              {/* Шапка тренинга */}
              <div style={{ background: "#fafaf8", padding: "14px 20px", borderBottom: "1px solid #f0f0ec", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 8 }}>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: "#1a1a1a" }}>{first.course_title}</div>
                  <div style={{ display: "flex", gap: 16, marginTop: 4, flexWrap: "wrap" }}>
                    {first.event_date && (
                      <span style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 12, color: "#666" }}>
                        <Icon name="Calendar" size={12} style={{ color: ACCENT }} />
                        {formatDate(first.event_date)}
                        {first.event_time_start && (
                          <> · {formatTime(first.event_time_start)}{first.event_time_end ? `–${formatTime(first.event_time_end)}` : ""}</>
                        )}
                      </span>
                    )}
                    {first.event_location && (
                      <span style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 12, color: "#666" }}>
                        <Icon name="MapPin" size={12} style={{ color: ACCENT }} />
                        {first.event_location}
                      </span>
                    )}
                  </div>
                </div>
                <div style={{ fontSize: 13, fontWeight: 700, color: ACCENT }}>
                  {list.length} участник{list.length === 1 ? "" : list.length < 5 ? "а" : "ов"}
                </div>
              </div>

              {/* Список участников */}
              {list.map((p, i) => (
                <div key={p.access_id} style={{
                  padding: "14px 20px",
                  borderBottom: i < list.length - 1 ? "1px solid #f5f5f2" : "none",
                  display: "flex", alignItems: "flex-start", gap: 14,
                }}>
                  {/* Аватар */}
                  <div style={{ width: 38, height: 38, borderRadius: 10, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, fontWeight: 700, color: "#fff",
                    background: hasSalon(p) ? "hsl(185,85%,32%)" : "hsl(270,65%,52%)" }}>
                    {(p.full_name || p.username || "?")[0].toUpperCase()}
                  </div>

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                      <span style={{ fontSize: 14, fontWeight: 700, color: "#1a1a1a" }}>{p.full_name || p.username}</span>
                      <span style={{ fontSize: 10, fontWeight: 700, padding: "2px 7px", borderRadius: 5,
                        background: hasSalon(p) ? "hsl(185,85%,94%)" : "hsl(270,65%,94%)",
                        color: hasSalon(p) ? "hsl(185,85%,32%)" : "hsl(270,65%,45%)" }}>
                        {hasSalon(p) ? "Салон" : "Мастер"}
                      </span>
                    </div>

                    <div style={{ display: "flex", gap: 16, marginTop: 5, flexWrap: "wrap" }}>
                      <a href={`mailto:${p.email}`} style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 12, color: "#555", textDecoration: "none" }}>
                        <Icon name="Mail" size={12} style={{ color: "#aaa" }} />
                        {p.email}
                      </a>
                      {hasSalon(p) && (
                        <span style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 12, color: "#555" }}>
                          <Icon name="Building2" size={12} style={{ color: "#aaa" }} />
                          {p.salon_name}{p.salon_city ? `, ${p.salon_city}` : ""}
                        </span>
                      )}
                      {p.salon_telegram && (
                        <a href={`https://t.me/${p.salon_telegram.replace("@", "")}`} target="_blank" rel="noreferrer"
                          style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 12, color: "#555", textDecoration: "none" }}>
                          <Icon name="Send" size={12} style={{ color: "#aaa" }} />
                          {p.salon_telegram}
                        </a>
                      )}
                      {p.salon_address && (
                        <span style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 12, color: "#888" }}>
                          <Icon name="MapPin" size={12} style={{ color: "#aaa" }} />
                          {p.salon_address}
                        </span>
                      )}
                    </div>
                  </div>

                  <div style={{ fontSize: 11, color: "#bbb", flexShrink: 0, textAlign: "right", paddingTop: 2 }}>
                    {formatGranted(p.granted_at)}
                  </div>
                </div>
              ))}
            </div>
          );
        })
      )}
    </div>
  );
}
