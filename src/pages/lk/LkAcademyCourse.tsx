import { useState, useEffect, useRef } from "react";
import Icon from "@/components/ui/icon";
import { useEnergy } from "@/contexts/EnergyContext";

const API = "https://functions.poehali.dev/3e9572e2-e118-4584-91dd-809cac9fc3ea";
const ACCENT = "hsl(185,85%,32%)";
const SERIF = "Cormorant, serif";

function sid() { return localStorage.getItem("lk_session") || ""; }
function apiFetch(action: string, method = "GET", body?: object) {
  return fetch(`${API}?action=${action}`, {
    method,
    headers: { "Content-Type": "application/json", "X-Session-Id": sid() },
    body: body ? JSON.stringify(body) : undefined,
  }).then(r => r.json());
}

interface Course {
  id: number; title: string; description: string; cover_url: string;
  access_cost: number; lesson_cost: number; has_access: boolean;
  modules: Module[];
}
interface Module { id: number; title: string; sort_order: number; lessons: LessonMeta[]; }
interface LessonMeta { id: number; title: string; is_opened: boolean; }
interface LessonFull {
  id: number; title: string; content: string;
  video_urls: string[]; links: string[]; ai_context: string;
  files: { id: number; name: string; url: string }[];
  photos: { id: number; url: string }[];
}

interface Props {
  courseId: number;
  onBack: () => void;
}

export default function LkAcademyCourse({ courseId, onBack }: Props) {
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
    apiFetch(`course_detail&course_id=${courseId}`).then(d => { if (!d.error) setCourse(d); });
  };

  if (loading) return (
    <div style={{ display: "flex", justifyContent: "center", padding: 60 }}>
      <div style={{ width: 28, height: 28, border: "3px solid #eee", borderTopColor: ACCENT, borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );

  if (!course) return (
    <div style={{ textAlign: "center", padding: 48, color: "#aaa" }}>Курс не найден</div>
  );

  if (activeLesson) {
    return (
      <LessonView
        lesson={activeLesson}
        courseTitle={course.title}
        onBack={() => setActiveLesson(null)}
        onRefreshLesson={(l) => setActiveLesson(l)}
      />
    );
  }

  return (
    <div style={{ maxWidth: 760 }}>
      <button onClick={onBack} style={{ display: "flex", alignItems: "center", gap: 6, background: "none", border: "none", cursor: "pointer", color: ACCENT, fontWeight: 600, fontSize: 14, marginBottom: 20, padding: 0 }}>
        <Icon name="ChevronLeft" size={16} /> Назад к Академии
      </button>

      {course.cover_url && (
        <img src={course.cover_url} alt="" style={{ width: "100%", borderRadius: 16, objectFit: "cover", maxHeight: 260, marginBottom: 20 }} />
      )}

      <h1 style={{ fontFamily: SERIF, fontSize: "clamp(22px,3vw,30px)", fontWeight: 700, color: "#1a1a1a", margin: "0 0 10px" }}>{course.title}</h1>
      {course.description && (
        <p style={{ fontSize: 14, color: "#666", lineHeight: 1.7, margin: "0 0 20px" }}>{course.description}</p>
      )}

      {!course.has_access && (
        <div style={{ background: "hsl(185,85%,97%)", border: `1.5px solid hsl(185,85%,80%)`, borderRadius: 14, padding: "20px 24px", marginBottom: 24 }}>
          <div style={{ fontSize: 15, fontWeight: 700, color: "#1a1a1a", marginBottom: 6 }}>Нужен доступ к курсу</div>
          <div style={{ fontSize: 13, color: "#555", lineHeight: 1.6, marginBottom: 14 }}>
            Чтобы открывать уроки, сначала получите доступ к курсу.
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
            {buying ? "Открываем..." : course.access_cost > 0 ? `Получить доступ · ${course.access_cost} ⚡` : "Получить бесплатный доступ"}
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
                  onClick={() => course.has_access ? openLesson(lesson) : setBuyErr("Сначала получите доступ к курсу")}
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
function LessonView({ lesson, courseTitle, onBack, onRefreshLesson }: {
  lesson: LessonFull; courseTitle: string; onBack: () => void; onRefreshLesson: (l: LessonFull) => void;
}) {
  const { refresh: refreshEnergy } = useEnergy();
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [asking, setAsk] = useState(false);
  const [askErr, setAskErr] = useState("");
  const chatRef = useRef<HTMLDivElement>(null);

  const askAI = async () => {
    if (!question.trim()) return;
    setAsk(true); setAskErr(""); setAnswer("");
    const res = await apiFetch("lesson_ask_ai", "POST", { lesson_id: lesson.id, question: question.trim() });
    setAsk(false);
    if (res.error) { setAskErr(res.error); return; }
    setAnswer(res.answer);
    refreshEnergy();
    setQuestion("");
    setTimeout(() => chatRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
  };

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
        <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginBottom: 20 }}>
          {lesson.photos.map(p => (
            <img key={p.id} src={p.url} alt="" style={{ width: 160, height: 120, borderRadius: 10, objectFit: "cover", cursor: "pointer" }}
              onClick={() => window.open(p.url, "_blank")} />
          ))}
        </div>
      )}

      {lesson.content && (
        <div style={{ fontSize: 14, color: "#333", lineHeight: 1.85, marginBottom: 24, whiteSpace: "pre-wrap" }}>
          {lesson.content}
        </div>
      )}

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

      <div style={{ marginTop: 32, borderTop: "1.5px solid #e8e8e4", paddingTop: 24 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
          <Icon name="Bot" size={18} style={{ color: ACCENT }} />
          <span style={{ fontSize: 15, fontWeight: 700, color: "#1a1a1a" }}>Задать вопрос по уроку</span>
          <span style={{ fontSize: 11, color: "#aaa", marginLeft: 4 }}>2 ⚡ за вопрос</span>
        </div>

        {answer && (
          <div ref={chatRef} style={{ background: "hsl(185,85%,97%)", border: "1.5px solid hsl(185,85%,80%)", borderRadius: 12, padding: "16px 18px", marginBottom: 16, fontSize: 14, color: "#333", lineHeight: 1.75, whiteSpace: "pre-wrap" }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: ACCENT, marginBottom: 8, letterSpacing: "0.05em" }}>ОТВЕТ ИИ</div>
            {answer}
          </div>
        )}

        {askErr && (
          <div style={{ background: "hsl(0,70%,97%)", border: "1.5px solid hsl(0,70%,85%)", borderRadius: 10, padding: "10px 14px", marginBottom: 12, fontSize: 13, color: "hsl(0,70%,40%)", fontWeight: 600 }}>
            {askErr}
          </div>
        )}

        <div style={{ display: "flex", gap: 8 }}>
          <textarea
            value={question}
            onChange={e => setQuestion(e.target.value)}
            placeholder="Напишите вопрос по материалу урока..."
            style={{ flex: 1, padding: "11px 14px", borderRadius: 10, border: "1.5px solid #e8e8e4", fontSize: 14, fontFamily: "Montserrat,sans-serif", resize: "none", height: 80, outline: "none", lineHeight: 1.6 }}
            onKeyDown={e => { if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) askAI(); }}
          />
          <button
            onClick={askAI}
            disabled={asking || !question.trim()}
            style={{ alignSelf: "flex-end", display: "flex", alignItems: "center", gap: 6, padding: "11px 20px", borderRadius: 10, border: "none", background: asking || !question.trim() ? "#e0e0e0" : ACCENT, color: asking || !question.trim() ? "#aaa" : "#fff", fontSize: 13, fontWeight: 700, cursor: asking || !question.trim() ? "not-allowed" : "pointer", fontFamily: "Montserrat,sans-serif", whiteSpace: "nowrap" }}
          >
            {asking ? <><div style={{ width: 14, height: 14, border: "2px solid rgba(255,255,255,0.4)", borderTopColor: "#fff", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} /> Думаю...</> : <><Icon name="Send" size={14} /> Спросить · 2 ⚡</>}
          </button>
        </div>
        <div style={{ fontSize: 11, color: "#aaa", marginTop: 8 }}>Ctrl+Enter для отправки</div>
      </div>
    </div>
  );
}
