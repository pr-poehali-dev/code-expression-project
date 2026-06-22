import { ACCENT, labelStyle, inputStyle, actionBtn } from "./LkAdminShared";
import Icon from "@/components/ui/icon";
import { Lesson, Module } from "./LkAdminCourses.types";
import MarkdownEditor from "@/components/ui/MarkdownEditor";
import { HTML_MARKER, isHtmlContent, renderContent } from "./LkAcademyTypes";

interface Props {
  form: Partial<Lesson>;
  modules: Module[];
  saving: boolean;
  msg: string;
  rehosting: boolean;
  rehostMsg: string;
  onChange: (patch: Partial<Lesson>) => void;
  onSave: () => void;
  onRehostImages: (html: string) => void;
}

export default function LkAdminLessonFormMain({
  form, modules, saving, msg, rehosting, rehostMsg,
  onChange, onSave, onRehostImages,
}: Props) {
  return (
    <div style={{ background: "#fff", borderRadius: 14, padding: "20px 22px", border: "1.5px solid #e8e8e4", display: "flex", flexDirection: "column", gap: 14 }}>
      <div style={{ fontSize: 13, fontWeight: 700, color: "#1a1a1a" }}>Основное</div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }} className="admin-grid-2">
        <div>
          <label style={labelStyle}>МОДУЛЬ *</label>
          <select style={{ ...inputStyle }} value={form.module_id || ""} onChange={e => onChange({ module_id: +e.target.value })}>
            {modules.map(m => <option key={m.id} value={m.id}>{m.title}</option>)}
          </select>
        </div>
        <div>
          <label style={labelStyle}>СОРТИРОВКА</label>
          <input style={inputStyle} type="number" min={0} value={form.sort_order ?? 0} onChange={e => onChange({ sort_order: +e.target.value })} />
        </div>
      </div>

      <div>
        <label style={labelStyle}>ЗАГОЛОВОК УРОКА *</label>
        <input style={inputStyle} value={form.title || ""} onChange={e => onChange({ title: e.target.value })} placeholder="Заголовок урока" />
      </div>

      <div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
          <label style={{ ...labelStyle, margin: 0 }}>ТЕКСТОВАЯ ЧАСТЬ</label>
          <div style={{ display: "flex", gap: 2, background: "#f0f0ec", borderRadius: 8, padding: 3 }}>
            {[{ id: false, label: "Markdown" }, { id: true, label: "HTML" }].map(m => {
              const active = isHtmlContent(form.content || "") === m.id;
              return (
                <button key={String(m.id)} onClick={() => {
                  const cur = form.content || "";
                  if (m.id && !isHtmlContent(cur)) {
                    onChange({ content: HTML_MARKER + "\n" + cur });
                  } else if (!m.id && isHtmlContent(cur)) {
                    onChange({ content: cur.trimStart().slice(HTML_MARKER.length).trimStart() });
                  }
                }} style={{ padding: "4px 10px", borderRadius: 6, border: "none", background: active ? "#fff" : "transparent", color: active ? "#1a1a1a" : "#888", fontSize: 11, fontWeight: active ? 700 : 500, cursor: "pointer", fontFamily: "Montserrat,sans-serif", boxShadow: active ? "0 1px 3px rgba(0,0,0,0.08)" : "none" }}>
                  {m.label}
                </button>
              );
            })}
          </div>
        </div>
        {isHtmlContent(form.content || "") ? (
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <textarea
              value={(form.content || "").trimStart().slice(HTML_MARKER.length)}
              onChange={e => onChange({ content: HTML_MARKER + "\n" + e.target.value })}
              onPaste={e => {
                const pasted = e.clipboardData.getData("text");
                if (pasted && /<img/i.test(pasted)) {
                  setTimeout(() => onRehostImages(pasted), 50);
                }
              }}
              placeholder="Вставьте HTML из другой платформы..."
              style={{ ...inputStyle, height: 220, lineHeight: 1.6, fontFamily: "monospace", fontSize: 12, resize: "vertical" }}
            />
            {(rehosting || rehostMsg) && (
              <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12, color: rehosting ? ACCENT : rehostMsg.startsWith("Ошибка") ? "hsl(0,70%,50%)" : "hsl(130,60%,35%)", fontWeight: 600 }}>
                {rehosting && <div style={{ width: 12, height: 12, border: "2px solid currentColor", borderTopColor: "transparent", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />}
                {rehosting ? "Загружаю картинки в CDN..." : rehostMsg}
              </div>
            )}
            <div style={{ background: "#f8f8f6", borderRadius: 10, border: "1.5px solid #e8e8e4", padding: "14px 16px" }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: "#aaa", letterSpacing: "0.06em", marginBottom: 8 }}>ПРЕДПРОСМОТР HTML</div>
              <div className="lesson-content" style={{ fontSize: 14, color: "#333", lineHeight: 1.85 }}
                dangerouslySetInnerHTML={{ __html: renderContent(form.content || "") }}
              />
            </div>
            <style>{`
              .lesson-content iframe { width: 100%; border-radius: 12px; border: none; }
              .lesson-content img { max-width: 100%; border-radius: 10px; }
              .lesson-content a { color: hsl(185,85%,32%); }
              .lesson-content p { margin: 10px 0; }
              .lesson-content ul { padding-left: 20px; margin: 8px 0; }
              .lesson-content li { margin: 4px 0; }
            `}</style>
          </div>
        ) : (
          <MarkdownEditor
            value={form.content || ""}
            onChange={v => onChange({ content: v })}
            placeholder="Основной текст урока..."
            minHeight={220}
          />
        )}
      </div>

      <div>
        <label style={labelStyle}>КОНТЕКСТ ДЛЯ ИИ (дополнительные тезисы, которые ИИ использует при ответах)</label>
        <textarea style={{ ...inputStyle, height: 90, lineHeight: 1.7 }} value={form.ai_context || ""} onChange={e => onChange({ ai_context: e.target.value })} placeholder="Ключевые тезисы, термины, пояснения для ИИ-помощника..." />
      </div>

      <div style={{ borderTop: "1.5px solid #f0f0ec", paddingTop: 14 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
          <Icon name="ClipboardList" size={15} style={{ color: "hsl(280,60%,55%)" }} />
          <label style={{ ...labelStyle, margin: 0, color: "hsl(280,60%,45%)" }}>ДОМАШНЕЕ ЗАДАНИЕ</label>
        </div>
        <MarkdownEditor
          value={form.homework || ""}
          onChange={v => onChange({ homework: v })}
          placeholder="Опишите задание для самостоятельной работы. ИИ-куратор будет вести ученика по этому заданию в диалоге..."
          minHeight={130}
        />
        <div style={{ fontSize: 11, color: "#aaa", marginTop: 4 }}>
          ИИ получит текст урока + этот текст и будет вести ученика через диалог до выполнения задания
        </div>
      </div>

      {msg && <div style={{ fontSize: 13, color: msg.includes("✓") ? "hsl(130,60%,35%)" : "hsl(0,70%,55%)", fontWeight: 600 }}>{msg}</div>}
      <button style={actionBtn(ACCENT)} onClick={onSave} disabled={saving}>
        {saving ? "Сохраняем..." : form.id ? "Сохранить урок" : "Создать урок"}
      </button>
      {!form.id && <div style={{ fontSize: 12, color: "#aaa" }}>После создания урока можно добавить видео, фото и файлы</div>}
    </div>
  );
}
