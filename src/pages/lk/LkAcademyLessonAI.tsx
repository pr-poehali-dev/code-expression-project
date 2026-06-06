import { useState, useRef } from "react";
import Icon from "@/components/ui/icon";
import { ACCENT, apiFetch } from "./LkAcademyTypes";
import { renderMarkdown } from "@/utils/markdown";
import { useEnergy } from "@/contexts/EnergyContext";

interface Props {
  lessonId: number;
  preview?: { title: string; content: string; ai_context: string };
}

export default function LkAcademyLessonAI({ lessonId, preview }: Props) {
  const { refresh: refreshEnergy } = useEnergy();
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [asking, setAsk] = useState(false);
  const [askErr, setAskErr] = useState("");
  const chatRef = useRef<HTMLDivElement>(null);

  const askAI = async () => {
    if (!question.trim()) return;
    setAsk(true); setAskErr(""); setAnswer("");
    const body = preview
      ? { preview: true, question: question.trim(), ...preview }
      : { lesson_id: lessonId, question: question.trim() };
    const res = await apiFetch("lesson_ask_ai", "POST", body);
    setAsk(false);
    if (res.error) { setAskErr(res.error); return; }
    setAnswer(res.answer);
    if (!preview) refreshEnergy();
    setQuestion("");
    setTimeout(() => chatRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
  };

  return (
    <div style={{ marginTop: 32, borderTop: "1.5px solid #e8e8e4", paddingTop: 24 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
        <Icon name="Bot" size={18} style={{ color: ACCENT }} />
        <span style={{ fontSize: 15, fontWeight: 700, color: "#1a1a1a" }}>Задать вопрос по уроку</span>
      </div>

      {answer && (
        <div ref={chatRef} style={{ background: "hsl(185,85%,97%)", border: "1.5px solid hsl(185,85%,80%)", borderRadius: 12, padding: "16px 18px", marginBottom: 16, fontSize: 14, color: "#333", lineHeight: 1.75, wordBreak: "break-word" }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: ACCENT, marginBottom: 8, letterSpacing: "0.05em" }}>ОТВЕТ ИИ</div>
          <div dangerouslySetInnerHTML={{ __html: renderMarkdown(answer) }} />
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
          {asking
            ? <><div style={{ width: 14, height: 14, border: "2px solid rgba(255,255,255,0.4)", borderTopColor: "#fff", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} /> Думаю...</>
            : <><Icon name="Send" size={14} /> Спросить</>
          }
        </button>
      </div>
      <div style={{ fontSize: 11, color: "#aaa", marginTop: 8 }}>Ctrl+Enter для отправки</div>
    </div>
  );
}