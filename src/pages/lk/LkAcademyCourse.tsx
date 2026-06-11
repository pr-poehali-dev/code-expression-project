import { useState, useEffect } from "react";
import Icon from "@/components/ui/icon";
import { useEnergy } from "@/contexts/EnergyContext";
import { ACCENT, SERIF, apiFetch, renderContent, type Course, type LessonMeta, type LessonFull } from "./LkAcademyTypes";
import LkAcademyLessonAI from "./LkAcademyLessonAI";
import LkAcademyHomework from "./LkAcademyHomework";
import LkLessonTools from "./LkLessonTools";

export { type LessonFull };

interface Props {
  courseId: number;
  onBack: () => void;
  onNavigate?: (tab: string) => void;
}

export default function LkAcademyCourse({ courseId, onBack, onNavigate }: Props) {
  const { refresh: refreshEnergy } = useEnergy();
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [buying, setBuying] = useState(false);
  const [buyErr, setBuyErr] = useState("");
  const [activeLesson, setActiveLesson] = useState<LessonFull | null>(null);
  const [lessonLoading, setLessonLoading] = useState(false);
  const [lessonErr, setLessonErr] = useState("");

  useEffect(() => {
    setLoading(true);
    apiFetch(`course_detail&course_id=${courseId}`)
      .then(d => { if (!d.error) setCourse(d); })
      .finally(() => setLoading(false));
  }, [courseId]);

  const buyCourse = async () => {
    setBuying(true); setBuyErr("");
    const res = await apiFetch("course_access", "POST", { course_id: courseId });
    setBuying(false);
    if (res.error) { setBuyErr(res.error); return; }
    refreshEnergy();
    apiFetch(`course_detail&course_id=${courseId}`).then(d => { if (!d.error) setCourse(d); });
  };

  const openLesson = async (lesson: LessonMeta) => {
    setLessonLoading(true); setLessonErr(""); setActiveLesson(null);
    const res = await apiFetch("lesson_open", "POST", { lesson_id: lesson.id });
    setLessonLoading(false);
    if (res.error) { setLessonErr(res.error); return; }
    refreshEnergy();
    setActiveLesson(res);
    window.scrollTo({ top: 0, behavior: "instant" });
    apiFetch(`course_detail&course_id=${courseId}`).then(d => { if (!d.error) setCourse(d); });
  };

  if (loading) return (
    <div style={{ display: "flex", justifyContent: "center", padding: 60 }}>
      <div style={{ width: 28, height: 28, border: "3px solid #eee", borderTopColor: ACCENT, borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );

  if (!course) return (
    <div style={{ textAlign: "center", padding: 48, color: "#aaa" }}>Тренинг не найден</div>
  );

  if (activeLesson) {
    return (
      <LessonView
        lesson={activeLesson}
        courseTitle={course.title}
        onBack={() => { setActiveLesson(null); window.scrollTo({ top: 0, behavior: "instant" }); }}
        onRefreshLesson={(l) => setActiveLesson(l)}
        onNavigate={onNavigate}
      />
    );
  }

  return (
    <div style={{ maxWidth: 760 }}>
      <button onClick={() => { onBack(); window.scrollTo({ top: 0, behavior: "instant" }); }} style={{ display: "flex", alignItems: "center", gap: 6, background: "none", border: "none", cursor: "pointer", color: ACCENT, fontWeight: 600, fontSize: 14, marginBottom: 20, padding: 0 }}>
        <Icon name="ChevronLeft" size={16} /> Назад к Академии
      </button>

      {/* Трейлер или обложка */}
      {course.trailer_url ? (() => {
        const match = course.trailer_url!.match(/kinescope\.io\/([a-zA-Z0-9]+)/);
        const embedUrl = match ? `https://kinescope.io/embed/${match[1]}` : course.trailer_url!;
        return (
          <div style={{ position: "relative", paddingBottom: "56.25%", borderRadius: 16, overflow: "hidden", background: "#000", marginBottom: 20 }}>
            <iframe
              src={embedUrl}
              style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", border: "none" }}
              allowFullScreen
              allow="autoplay; fullscreen"
            />
          </div>
        );
      })() : course.cover_url ? (
        <img src={course.cover_url} alt="" style={{ width: "100%", borderRadius: 16, objectFit: "cover", maxHeight: 260, marginBottom: 20 }} />
      ) : null}

      <h1 style={{ fontFamily: SERIF, fontSize: "clamp(22px,3vw,30px)", fontWeight: 700, color: "#1a1a1a", margin: "0 0 10px" }}>{course.title}</h1>
      {course.description && (
        <p style={{ fontSize: 14, color: "#666", lineHeight: 1.7, margin: "0 0 20px" }}>{course.description}</p>
      )}

      {!course.has_access && (
        <div style={{ background: "hsl(185,85%,97%)", border: `1.5px solid hsl(185,85%,80%)`, borderRadius: 14, padding: "20px 24px", marginBottom: 24 }}>
          <div style={{ fontSize: 15, fontWeight: 700, color: "#1a1a1a", marginBottom: 6 }}>Нужен доступ к тренингу</div>
          <div style={{ fontSize: 13, color: "#555", lineHeight: 1.6, marginBottom: 14 }}>
            Чтобы открывать уроки, сначала получите доступ к тренингу.
            {course.access_cost > 0
              ? ` Стоимость: ${course.access_cost} ⚡`
              : " Доступ бесплатный."}
          </div>
          {buyErr && <div style={{ fontSize: 13, color: "hsl(0,70%,55%)", marginBottom: 10, fontWeight: 600 }}>{buyErr}</div>}
          <button
            onClick={buyCourse}
            disabled={buying}
            style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "11px 24px", borderRadius: 10, border: "none", background: ACCENT, color: "#fff", fontSize: 14, fontWeight: 700, cursor: buying ? "not-allowed" : "pointer", fontFamily: "Montserrat,sans-serif" }}
          >
            <Icon name="Unlock" size={15} />
            {buying ? "Открываем..." : course.access_cost > 0 ? `Получить доступ · ${course.access_cost} ⚡` : "Получить бесплатный доступ к тренингу"}
          </button>
        </div>
      )}

      {lessonErr && (
        <div style={{ background: "hsl(0,70%,97%)", border: "1.5px solid hsl(0,70%,85%)", borderRadius: 10, padding: "12px 16px", marginBottom: 16, fontSize: 13, color: "hsl(0,70%,40%)", fontWeight: 600 }}>
          {lessonErr}
        </div>
      )}

      {lessonLoading && (
        <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 0", color: "#888", fontSize: 13 }}>
          <div style={{ width: 18, height: 18, border: "2px solid #eee", borderTopColor: ACCENT, borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
          Открываем урок...
        </div>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        {course.modules.map(mod => (
          <div key={mod.id} style={{ background: "#fff", borderRadius: 14, border: "1.5px solid #e8e8e4", overflow: "hidden" }}>
            <div style={{ padding: "14px 18px", background: "hsl(185,85%,98%)", borderBottom: "1px solid #e8e8e4", display: "flex", alignItems: "center", gap: 10 }}>
              <Icon name="Layers" size={15} style={{ color: ACCENT }} />
              <span style={{ fontSize: 14, fontWeight: 700, color: "#1a1a1a" }}>{mod.title}</span>
              <span style={{ marginLeft: "auto", fontSize: 11, color: "#aaa" }}>{mod.lessons.length} уроков</span>
            </div>
            <div style={{ padding: "8px 0" }}>
              {mod.lessons.map(lesson => (
                <button
                  key={lesson.id}
                  onClick={() => course.has_access ? openLesson(lesson) : setBuyErr("Сначала получите доступ к тренингу")}
                  style={{ width: "100%", display: "flex", alignItems: "center", gap: 12, padding: "10px 18px", background: "none", border: "none", cursor: "pointer", textAlign: "left", transition: "background 0.15s" }}
                  onMouseEnter={e => (e.currentTarget.style.background = "#f8f8f6")}
                  onMouseLeave={e => (e.currentTarget.style.background = "")}
                >
                  <div style={{ width: 28, height: 28, borderRadius: 8, background: lesson.is_opened ? "hsl(130,60%,94%)" : course.has_access ? "hsl(185,85%,96%)" : "#f5f5f2", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <Icon
                      name={lesson.is_opened ? "CheckCircle" : course.has_access ? "PlayCircle" : "Lock"}
                      size={14}
                      style={{ color: lesson.is_opened ? "hsl(130,60%,40%)" : course.has_access ? ACCENT : "#bbb" }}
                    />
                  </div>
                  <span style={{ flex: 1, fontSize: 13, color: "#333", fontWeight: 500 }}>{lesson.title}</span>
                  {!lesson.is_opened && course.has_access && (
                    <span style={{ fontSize: 11, color: "#aaa" }}>{course.lesson_cost > 0 ? `${course.lesson_cost} ⚡` : "бесплатно"}</span>
                  )}
                  {lesson.is_opened && (
                    <span style={{ fontSize: 11, color: "hsl(130,60%,40%)", fontWeight: 600 }}>Открыт</span>
                  )}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Просмотр урока ────────────────────────────────────────────────────────────
export function LessonView({ lesson, courseTitle, onBack, onRefreshLesson, isPreview, onNavigate }: {
  lesson: LessonFull; courseTitle: string; onBack: () => void; onRefreshLesson: (l: LessonFull) => void; isPreview?: boolean; onNavigate?: (tab: string) => void;
}) {
  const parseLinkLabel = (s: string) => {
    const parts = s.split("|");
    return parts.length === 2 ? { label: parts[0], url: parts[1] } : { label: s, url: s };
  };

  const embedKinescope = (url: string) => {
    const match = url.match(/kinescope\.io\/([a-zA-Z0-9]+)/);
    if (match) return `https://kinescope.io/embed/${match[1]}`;
    return url;
  };

  return (
    <div style={{ maxWidth: 760 }}>
      <button onClick={onBack} style={{ display: "flex", alignItems: "center", gap: 6, background: "none", border: "none", cursor: "pointer", color: ACCENT, fontWeight: 600, fontSize: 14, marginBottom: 6, padding: 0 }}>
        <Icon name="ChevronLeft" size={16} /> Назад к курсу
      </button>
      <div style={{ fontSize: 12, color: "#aaa", marginBottom: 16 }}>{courseTitle}</div>

      <h2 style={{ fontFamily: SERIF, fontSize: "clamp(20px,2.5vw,26px)", fontWeight: 700, color: "#1a1a1a", margin: "0 0 20px" }}>{lesson.title}</h2>

      {lesson.video_urls.length > 0 && (
        <div style={{ display: "flex", flexDirection: "column", gap: 16, marginBottom: 24 }}>
          {lesson.video_urls.map((v, i) => (
            <div key={i} style={{ position: "relative", paddingBottom: "56.25%", borderRadius: 12, overflow: "hidden", background: "#000" }}>
              <iframe
                src={embedKinescope(v)}
                style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", border: "none" }}
                allowFullScreen
                allow="autoplay; fullscreen"
              />
            </div>
          ))}
        </div>
      )}

      {lesson.photos.length > 0 && (
        <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 24 }}>
          {lesson.photos.map(p => (
            <img key={p.id} src={p.url} alt="" style={{ width: "100%", borderRadius: 16, objectFit: "cover", cursor: "pointer", maxHeight: 420 }}
              onClick={() => window.open(p.url, "_blank")} />
          ))}
        </div>
      )}

      {lesson.content && (
        <div className="lesson-content" style={{ fontSize: 14, color: "#333", lineHeight: 1.85, marginBottom: 24 }}
          dangerouslySetInnerHTML={{ __html: renderContent(lesson.content) }}
        />
      )}
      <style>{`
        .lesson-content ul { padding-left: 20px; margin: 8px 0; }
        .lesson-content li { margin: 4px 0; }
        .lesson-content p { margin: 10px 0; }
        .lesson-content h1,.lesson-content h2,.lesson-content h3 { line-height: 1.3; }
        .lesson-content strong { font-weight: 700; }
        .lesson-content em { font-style: italic; }
        .lesson-content s { text-decoration: line-through; }
        .lesson-content blockquote { border-left: 3px solid hsl(185,85%,60%); margin: 12px 0; padding: 4px 14px; color: #555; font-style: italic; }
        .lesson-content hr { border: none; border-top: 1.5px solid #e8e8e4; margin: 20px 0; }
        .lesson-content iframe { width: 100%; border-radius: 12px; border: none; }
        .lesson-content img { max-width: 100%; border-radius: 10px; }
        .lesson-content a { color: hsl(185,85%,32%); }
      `}</style>

      {lesson.links.length > 0 && (
        <div style={{ marginBottom: 24 }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: "#888", marginBottom: 10, letterSpacing: "0.05em" }}>МАТЕРИАЛЫ</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {lesson.links.map((l, i) => {
              const { label, url } = parseLinkLabel(l);
              return (
                <a key={i} href={url} target="_blank" rel="noopener noreferrer"
                  style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 14px", background: "#f8f8f6", borderRadius: 10, textDecoration: "none", color: ACCENT, fontSize: 13, fontWeight: 600, border: "1px solid #e8e8e4" }}>
                  <Icon name="ExternalLink" size={14} />
                  {label !== url ? label : "Открыть ссылку"}
                </a>
              );
            })}
          </div>
        </div>
      )}

      {lesson.files.length > 0 && (
        <div style={{ marginBottom: 24 }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: "#888", marginBottom: 10, letterSpacing: "0.05em" }}>ФАЙЛЫ ДЛЯ СКАЧИВАНИЯ</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {lesson.files.map(f => (
              <a key={f.id} href={f.url} target="_blank" rel="noopener noreferrer" download={f.name}
                style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 14px", background: "#f8f8f6", borderRadius: 10, textDecoration: "none", color: "#333", fontSize: 13, border: "1px solid #e8e8e4" }}>
                <Icon name="FileDown" size={14} style={{ color: ACCENT }} />
                {f.name}
              </a>
            ))}
          </div>
        </div>
      )}

      {lesson.tools?.length > 0 && (
        <LkLessonTools tools={lesson.tools} onNavigate={onNavigate || (() => {})} previewMode={isPreview} />
      )}

      <LkAcademyLessonAI
        lessonId={lesson.id}
        preview={isPreview ? { title: lesson.title, content: lesson.content, ai_context: lesson.ai_context } : undefined}
      />

      {lesson.homework && (
        <LkAcademyHomework
          lessonId={lesson.id}
          homework={lesson.homework}
          preview={isPreview ? { title: lesson.title, content: lesson.content, ai_context: lesson.ai_context, homework: lesson.homework } : undefined}
        />
      )}
    </div>
  );
}