import { useState, useRef } from "react";
import Icon from "@/components/ui/icon";
import { apiFetch, type ChatMessage } from "./LkAcademyTypes";
import { useEnergy } from "@/contexts/EnergyContext";

interface Props {
  lessonId: number;
  homework: string;
}

export default function LkAcademyHomework({ lessonId, homework }: Props) {
  const { refresh: refreshEnergy } = useEnergy();
  const [hwOpen, setHwOpen] = useState(false);
  const [hwHistory, setHwHistory] = useState<ChatMessage[]>([]);
  const [hwInput, setHwInput] = useState("");
  const [hwLoading, setHwLoading] = useState(false);
  const [hwErr, setHwErr] = useState("");
  const hwBottomRef = useRef<HTMLDivElement>(null);

  const sendHomework = async () => {
    if (!hwInput.trim()) return;
    const userMsg: ChatMessage = { role: "user", content: hwInput.trim() };
    const newHistory = [...hwHistory, userMsg];
    setHwHistory(newHistory);
    setHwInput("");
    setHwLoading(true); setHwErr("");
    const res = await apiFetch("lesson_homework_ai", "POST", {
      lesson_id: lessonId,
      message: userMsg.content,
      history: hwHistory,
    });
    setHwLoading(false);
    if (res.error) { setHwErr(res.error); return; }
    setHwHistory([...newHistory, { role: "assistant", content: res.answer }]);
    refreshEnergy();
    setTimeout(() => hwBottomRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
  };

  return (
    <div style={{ marginTop: 24, background: "hsl(280,60%,98%)", border: "1.5px solid hsl(280,60%,85%)", borderRadius: 16, overflow: "hidden" }}>
      <button
        onClick={() => setHwOpen(o => !o)}
        style={{ width: "100%", display: "flex", alignItems: "center", gap: 10, padding: "16px 20px", background: "none", border: "none", cursor: "pointer", textAlign: "left" }}
      >
        <div style={{ width: 36, height: 36, borderRadius: 10, background: "hsl(280,60%,92%)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          <Icon name="ClipboardList" size={18} style={{ color: "hsl(280,60%,50%)" }} />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 15, fontWeight: 700, color: "#1a1a1a" }}>Домашнее задание</div>
          <div style={{ fontSize: 12, color: "#888", marginTop: 2 }}>Выполни с ИИ-куратором · 2 ⚡ за сообщение</div>
        </div>
        <Icon name={hwOpen ? "ChevronUp" : "ChevronDown"} size={18} style={{ color: "#aaa" }} />
      </button>

      {hwOpen && (
        <div style={{ padding: "0 20px 20px" }}>
          <div style={{ background: "hsl(280,60%,95%)", borderRadius: 10, padding: "14px 16px", marginBottom: 16, fontSize: 14, color: "#333", lineHeight: 1.75, whiteSpace: "pre-wrap" }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: "hsl(280,60%,50%)", marginBottom: 6, letterSpacing: "0.05em" }}>ЗАДАНИЕ</div>
            {homework}
          </div>

          {hwHistory.length === 0 && (
            <div style={{ fontSize: 13, color: "#aaa", textAlign: "center", padding: "12px 0 16px", fontStyle: "italic" }}>
              Напиши своё первое сообщение — куратор поможет выполнить задание шаг за шагом
            </div>
          )}

          <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: hwHistory.length > 0 ? 16 : 0 }}>
            {hwHistory.map((msg, i) => (
              <div key={i} style={{ display: "flex", justifyContent: msg.role === "user" ? "flex-end" : "flex-start" }}>
                <div style={{
                  maxWidth: "85%",
                  padding: "10px 14px",
                  borderRadius: msg.role === "user" ? "12px 12px 4px 12px" : "12px 12px 12px 4px",
                  background: msg.role === "user" ? "hsl(280,60%,50%)" : "#fff",
                  color: msg.role === "user" ? "#fff" : "#333",
                  fontSize: 13, lineHeight: 1.7,
                  border: msg.role === "assistant" ? "1.5px solid hsl(280,60%,88%)" : "none",
                  whiteSpace: "pre-wrap",
                }}>
                  {msg.role === "assistant" && (
                    <div style={{ fontSize: 10, fontWeight: 700, color: "hsl(280,60%,50%)", marginBottom: 4, letterSpacing: "0.05em" }}>КУРАТОР</div>
                  )}
                  {msg.content}
                </div>
              </div>
            ))}
            {hwLoading && (
              <div style={{ display: "flex", justifyContent: "flex-start" }}>
                <div style={{ padding: "10px 16px", background: "#fff", borderRadius: "12px 12px 12px 4px", border: "1.5px solid hsl(280,60%,88%)", display: "flex", gap: 6, alignItems: "center" }}>
                  {[0, 1, 2].map(i => (
                    <div key={i} style={{ width: 6, height: 6, borderRadius: "50%", background: "hsl(280,60%,70%)", animation: `bounce 1s ease-in-out ${i * 0.15}s infinite` }} />
                  ))}
                </div>
              </div>
            )}
            <div ref={hwBottomRef} />
          </div>

          {hwErr && (
            <div style={{ background: "hsl(0,70%,97%)", border: "1.5px solid hsl(0,70%,85%)", borderRadius: 10, padding: "10px 14px", marginBottom: 12, fontSize: 13, color: "hsl(0,70%,40%)", fontWeight: 600 }}>
              {hwErr}
            </div>
          )}

          <div style={{ display: "flex", gap: 8 }}>
            <textarea
              value={hwInput}
              onChange={e => setHwInput(e.target.value)}
              placeholder="Напиши свой ответ или вопрос куратору..."
              style={{ flex: 1, padding: "11px 14px", borderRadius: 10, border: "1.5px solid hsl(280,60%,80%)", fontSize: 14, fontFamily: "Montserrat,sans-serif", resize: "none", height: 80, outline: "none", lineHeight: 1.6, background: "#fff" }}
              onKeyDown={e => { if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) sendHomework(); }}
            />
            <button
              onClick={sendHomework}
              disabled={hwLoading || !hwInput.trim()}
              style={{ alignSelf: "flex-end", display: "flex", alignItems: "center", gap: 6, padding: "11px 18px", borderRadius: 10, border: "none", background: hwLoading || !hwInput.trim() ? "#e0e0e0" : "hsl(280,60%,50%)", color: hwLoading || !hwInput.trim() ? "#aaa" : "#fff", fontSize: 13, fontWeight: 700, cursor: hwLoading || !hwInput.trim() ? "not-allowed" : "pointer", fontFamily: "Montserrat,sans-serif", whiteSpace: "nowrap" }}
            >
              {hwLoading
                ? <div style={{ width: 14, height: 14, border: "2px solid rgba(255,255,255,0.4)", borderTopColor: "#fff", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
                : <><Icon name="Send" size={14} /> Отправить · 2 ⚡</>
              }
            </button>
          </div>
          <div style={{ fontSize: 11, color: "#aaa", marginTop: 6 }}>Ctrl+Enter для отправки</div>
          <style>{`@keyframes bounce{0%,100%{transform:translateY(0)}50%{transform:translateY(-4px)}}`}</style>
        </div>
      )}
    </div>
  );
}
