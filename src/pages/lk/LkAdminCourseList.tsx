import { useState } from "react";
import { ACCENT, actionBtn } from "./LkAdminShared";
import Icon from "@/components/ui/icon";
import { Course, apiFetch } from "./LkAdminCourses.types";

export function CourseList({ courses, onNew, onEdit, onReload }: {
  courses: Course[]; onNew: () => void; onEdit: (c: Course) => void; onReload: () => void;
}) {
  const [deleting, setDeleting] = useState<number | null>(null);

  const handleDelete = async (e: React.MouseEvent, c: Course) => {
    e.stopPropagation();
    if (!confirm(`Удалить тренинг «${c.title}»?\n\nВсе модули, уроки и доступы будут удалены. Это действие нельзя отменить.`)) return;
    setDeleting(c.id);
    await apiFetch("admin_course_delete", "POST", { id: c.id });
    setDeleting(null);
    onReload();
  };

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
                <div style={{ fontSize: 15, fontWeight: 700, color: "#1a1a1a", display: "flex", alignItems: "center", gap: 8 }}>
                  {c.title}
                  {c.is_partner && (
                    <span style={{ fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 20, background: "hsl(38,90%,92%)", color: "hsl(38,80%,35%)", whiteSpace: "nowrap" }}>
                      ПАРТНЁР
                    </span>
                  )}
                </div>
                <div style={{ fontSize: 12, color: "#888", marginTop: 3 }}>
                  {c.is_partner
                    ? (c.partner_name || "Внешняя школа") + (c.partner_price ? ` · ${c.partner_price}` : " · Бесплатно")
                    : `${c.modules_count ?? 0} модулей · ${c.lessons_count ?? 0} уроков · доступ ${c.access_cost}⚡ · урок ${c.lesson_cost}⚡`}
                </div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
                <div style={{ fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 20, background: c.is_published ? "hsl(130,60%,94%)" : "#f5f5f2", color: c.is_published ? "hsl(130,60%,35%)" : "#aaa" }}>
                  {c.is_published ? "Опубликован" : "Черновик"}
                </div>
                <button
                  onClick={(e) => handleDelete(e, c)}
                  disabled={deleting === c.id}
                  title="Удалить тренинг"
                  style={{ width: 30, height: 30, borderRadius: 8, border: "none", background: "hsl(0,70%,97%)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, opacity: deleting === c.id ? 0.5 : 1 }}
                >
                  <Icon name={deleting === c.id ? "Loader" : "Trash2"} size={14} style={{ color: "hsl(0,70%,55%)" }} />
                </button>
                <Icon name="ChevronRight" size={16} style={{ color: "#ccc" }} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}