import { useState, useEffect } from "react";
import { Spinner, ACCENT } from "./LkAdminShared";
import { apiFetch, Course, Module, Lesson, Screen } from "./LkAdminCourses.types";
import { CourseList } from "./LkAdminCourseList";
import { CourseEditor } from "./LkAdminCourseEditor";
import { LessonEditor } from "./LkAdminLessonEditor";
import { OfflineParticipantsSection } from "./LkAdminOfflineParticipants";
import Icon from "@/components/ui/icon";

type Tab = "courses" | "participants";

export function CoursesSection() {
  const [tab, setTab] = useState<Tab>("courses");
  const [screen, setScreen] = useState<Screen>("list");
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeCourse, setActiveCourse] = useState<Course | null>(null);
  const [activeLesson, setActiveLesson] = useState<Lesson | null>(null);
  const [modules, setModules] = useState<Module[]>([]);

  const loadCourses = () => {
    setLoading(true);
    apiFetch("admin_courses_list")
      .then(d => setCourses(Array.isArray(d) ? d : []))
      .finally(() => setLoading(false));
  };

  useEffect(() => { loadCourses(); }, []);

  const openCourse = (c: Course | null) => {
    setActiveCourse(c);
    setScreen("course");
    window.scrollTo({ top: 0, behavior: "instant" });
    if (c?.id) loadModules(c.id);
    else setModules([]);
  };

  const loadModules = (courseId: number) => {
    apiFetch(`admin_course_detail&course_id=${courseId}`)
      .then(d => {
        if (d.modules) setModules(d.modules);
      });
  };

  if (loading && screen === "list" && tab === "courses") return <Spinner />;

  const offlineCount = courses.filter(c => c.type === "offline").length;

  return (
    <div>
      {/* Вкладки */}
      <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
        {([
          { id: "courses" as Tab, icon: "GraduationCap", label: "Тренинги и курсы" },
          { id: "participants" as Tab, icon: "Users", label: "Участники офлайн", badge: offlineCount > 0 },
        ]).map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} style={{
            display: "flex", alignItems: "center", gap: 7, padding: "8px 16px",
            borderRadius: 9, border: "none", cursor: "pointer",
            fontFamily: "Montserrat, sans-serif", fontSize: 13, fontWeight: 600,
            background: tab === t.id ? ACCENT : "#f0f0ec",
            color: tab === t.id ? "#fff" : "#666",
          }}>
            <Icon name={t.icon} size={14} />
            {t.label}
          </button>
        ))}
      </div>

      {tab === "participants" && <OfflineParticipantsSection courses={courses} />}

      {tab === "courses" && screen === "list" && (
        <CourseList
          courses={courses}
          onNew={() => openCourse(null)}
          onEdit={openCourse}
          onReload={loadCourses}
        />
      )}
      {tab === "courses" && screen === "course" && activeCourse !== undefined && (
        <CourseEditor
          course={activeCourse}
          modules={modules}
          onBack={() => { setScreen("list"); loadCourses(); window.scrollTo({ top: 0, behavior: "instant" }); }}
          onReloadModules={() => { if (activeCourse?.id) loadModules(activeCourse.id); }}
          onEditLesson={(l) => { setActiveLesson(l); setScreen("lesson"); window.scrollTo({ top: 0, behavior: "instant" }); }}
          onSaved={(c) => setActiveCourse(c)}
        />
      )}
      {tab === "courses" && screen === "lesson" && activeLesson !== undefined && activeCourse && (
        <LessonEditor
          lesson={activeLesson}
          courseId={activeCourse.id}
          modules={modules}
          onBack={() => { setScreen("course"); window.scrollTo({ top: 0, behavior: "instant" }); if (activeCourse?.id) loadModules(activeCourse.id); }}
          onSaved={(l) => setActiveLesson(l)}
        />
      )}
    </div>
  );
}