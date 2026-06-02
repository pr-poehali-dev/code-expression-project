import { useState, useEffect } from "react";
import { Spinner } from "./LkAdminShared";
import { apiFetch, Course, Module, Lesson, Screen } from "./LkAdminCourses.types";
import { CourseList } from "./LkAdminCourseList";
import { CourseEditor } from "./LkAdminCourseEditor";
import { LessonEditor } from "./LkAdminLessonEditor";

export function CoursesSection() {
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
    if (c?.id) loadModules(c.id);
    else setModules([]);
  };

  const loadModules = (courseId: number) => {
    apiFetch(`course_detail&course_id=${courseId}`)
      .then(d => {
        if (d.modules) setModules(d.modules);
      });
  };

  if (loading && screen === "list") return <Spinner />;

  return (
    <div>
      {screen === "list" && (
        <CourseList
          courses={courses}
          onNew={() => openCourse(null)}
          onEdit={openCourse}
          onReload={loadCourses}
        />
      )}
      {screen === "course" && activeCourse !== undefined && (
        <CourseEditor
          course={activeCourse}
          modules={modules}
          onBack={() => { setScreen("list"); loadCourses(); }}
          onReloadModules={() => { if (activeCourse?.id) loadModules(activeCourse.id); }}
          onEditLesson={(l) => { setActiveLesson(l); setScreen("lesson"); }}
          onSaved={(c) => setActiveCourse(c)}
        />
      )}
      {screen === "lesson" && activeLesson !== undefined && activeCourse && (
        <LessonEditor
          lesson={activeLesson}
          courseId={activeCourse.id}
          modules={modules}
          onBack={() => { setScreen("course"); if (activeCourse?.id) loadModules(activeCourse.id); }}
          onSaved={(l) => setActiveLesson(l)}
        />
      )}
    </div>
  );
}
