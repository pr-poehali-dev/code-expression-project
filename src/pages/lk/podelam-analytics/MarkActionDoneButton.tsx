import Icon from "@/components/ui/icon";
import { hashActionText } from "../podelamShared";

// Кнопка «Выполнено» для рекомендации Пульса — ключ считается хэшем текста (не привязан к
// плану дня, т.к. Пульс пересчитывается раз в сутки без постоянных task_key).
export default function MarkActionDoneButton({ text, done, onToggle }: { text: string; done: boolean; onToggle: (key: string, text: string, done: boolean) => void }) {
  const key = hashActionText(text);
  return (
    <button
      onClick={() => onToggle(key, text, !done)}
      style={{
        display: "inline-flex", alignItems: "center", gap: 5, marginTop: 6,
        background: done ? "rgba(45,212,191,0.16)" : "rgba(255,255,255,0.06)",
        border: `1px solid ${done ? "rgba(45,212,191,0.4)" : "rgba(255,255,255,0.15)"}`,
        borderRadius: 8, padding: "5px 10px", cursor: "pointer",
        fontSize: 11, fontWeight: 700, color: done ? "#2DD4BF" : "rgba(255,255,255,0.6)",
        fontFamily: "Montserrat,sans-serif",
      }}
    >
      <Icon name={done ? "CheckCircle2" : "Circle"} size={12} />
      {done ? "Выполнено" : "Отметить выполненным"}
    </button>
  );
}
