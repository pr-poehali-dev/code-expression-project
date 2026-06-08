import { ACCENT, actionBtn } from "./LkAdminShared";
import Icon from "@/components/ui/icon";
import { Course } from "./LkAdminCourses.types";

export function CourseList({ courses, onNew, onEdit }: {
  courses: Course[]; onNew: () => void; onEdit: (c: Course) => void; onReload: () => void;
}) {
  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
        <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700 }}>Тренинги Академии</h2>
        <button style={actionBtn(ACCENT)} onClick={onNew}>
          <Icon name="Plus" size={15} /> Создать тренинг
        </button>
      </div>
      {courses.length === 0 ? (
        <div style={{ textAlign: "center", padding: "48px 0", color: "#aaa", fontSize: 14 }}>
          Тренингов пока нет — создайте первый
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {courses.map(c => (
            <div key={c.id} style={{ background: "#fff", borderRadius: 12, padding: "16px 20px", border: "1.5px solid #e8e8e4", display: "flex", alignItems: "center", gap: 14, cursor: "pointer" }} onClick={() => onEdit(c)}>
              {c.cover_url && <img src={c.cover_url} alt="" style={{ width: 60, height: 60, borderRadius: 10, objectFit: "cover", flexShrink: 0 }} />}
              {!c.cover_url && (
                <div style={{ width: 60, height: 60, borderRadius: 10, background: "hsl(185,85%,96%)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <Icon name="GraduationCap" size={24} style={{ color: ACCENT }} />
                </div>
              )}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 15, fontWeight: 700, color: "#1a1a1a" }}>{c.title}</div>
                <div style={{ fontSize: 12, color: "#888", marginTop: 3 }}>
                  {c.modules_count ?? 0} модулей · {c.lessons_count ?? 0} уроков · доступ {c.access_cost}⚡ · урок {c.lesson_cost}⚡
                </div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
                <div style={{ fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 20, background: c.is_published ? "hsl(130,60%,94%)" : "#f5f5f2", color: c.is_published ? "hsl(130,60%,35%)" : "#aaa" }}>
                  {c.is_published ? "Опубликован" : "Черновик"}
                </div>
                <Icon name="ChevronRight" size={16} style={{ color: "#ccc" }} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}