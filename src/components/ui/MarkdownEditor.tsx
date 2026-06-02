import { useRef, useCallback } from "react";
import Icon from "@/components/ui/icon";

const ACCENT = "hsl(185,85%,32%)";

interface Props {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  minHeight?: number;
}

const TOOLS = [
  { label: "Ж",    title: "Жирный (**текст**)",          wrap: ["**", "**"],    icon: null,        style: { fontWeight: 700 } },
  { label: "К",    title: "Курсив (*текст*)",             wrap: ["*", "*"],      icon: null,        style: { fontStyle: "italic" } },
  { label: "З",    title: "Зачёркнутый (~~текст~~)",      wrap: ["~~", "~~"],    icon: null,        style: { textDecoration: "line-through" } },
  { label: "H1",   title: "Заголовок 1 (# Текст)",        prefix: "# ",          icon: null,        style: { fontWeight: 700, fontSize: 12 } },
  { label: "H2",   title: "Заголовок 2 (## Текст)",       prefix: "## ",         icon: null,        style: { fontWeight: 700, fontSize: 11 } },
  { label: "H3",   title: "Заголовок 3 (### Текст)",      prefix: "### ",        icon: null,        style: { fontWeight: 600, fontSize: 11 } },
  { label: null,   title: "Маркированный список (- пункт)",prefix: "- ",         icon: "List",      style: {} },
  { label: null,   title: "Нумерованный список (1. пункт)",prefix: "1. ",        icon: "ListOrdered", style: {} },
  { label: null,   title: "Цитата (> текст)",             prefix: "> ",          icon: "Quote",     style: {} },
  { label: null,   title: "Горизонтальная линия (---)",   insert: "\n---\n",     icon: "Minus",     style: {} },
];

const HINTS = [
  "**жирный**",
  "*курсив*",
  "~~зачёркнутый~~",
  "# Заголовок 1",
  "## Заголовок 2",
  "### Заголовок 3",
  "- пункт списка",
  "1. нумерованный",
  "> цитата",
];

export default function MarkdownEditor({ value, onChange, placeholder, minHeight = 200 }: Props) {
  const taRef = useRef<HTMLTextAreaElement>(null);

  const applyTool = useCallback((tool: typeof TOOLS[0]) => {
    const ta = taRef.current;
    if (!ta) return;
    const start = ta.selectionStart;
    const end = ta.selectionEnd;
    const selected = value.slice(start, end);
    let newValue = value;
    let newStart = start;
    let newEnd = end;

    if (tool.insert) {
      newValue = value.slice(0, start) + tool.insert + value.slice(end);
      newStart = newEnd = start + tool.insert.length;
    } else if (tool.wrap) {
      const [pre, post] = tool.wrap;
      newValue = value.slice(0, start) + pre + selected + post + value.slice(end);
      newStart = start + pre.length;
      newEnd = end + pre.length;
    } else if (tool.prefix) {
      // Добавляем prefix в начало строки
      const lineStart = value.lastIndexOf("\n", start - 1) + 1;
      const line = value.slice(lineStart, end);
      newValue = value.slice(0, lineStart) + tool.prefix + line + value.slice(end);
      newStart = lineStart + tool.prefix.length;
      newEnd = newStart + selected.length;
    }

    onChange(newValue);
    setTimeout(() => {
      ta.focus();
      ta.setSelectionRange(newStart, newEnd);
    }, 0);
  }, [value, onChange]);

  const btnStyle = (active = false): React.CSSProperties => ({
    padding: "3px 8px",
    borderRadius: 6,
    border: `1px solid ${active ? ACCENT : "#e0e0dc"}`,
    background: active ? `hsla(185,85%,32%,0.08)` : "#fafafa",
    color: active ? ACCENT : "#555",
    cursor: "pointer",
    fontSize: 12,
    lineHeight: 1,
    fontFamily: "Montserrat, sans-serif",
    minWidth: 28,
    height: 26,
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
  });

  return (
    <div style={{ border: "1.5px solid #e8e8e4", borderRadius: 10, overflow: "hidden", background: "#fff" }}>
      {/* Тулбар */}
      <div style={{ display: "flex", alignItems: "center", gap: 4, padding: "6px 10px", background: "#f8f8f6", borderBottom: "1px solid #e8e8e4", flexWrap: "wrap" }}>
        {TOOLS.map((t, i) => (
          <button
            key={i}
            type="button"
            title={t.title}
            onClick={() => applyTool(t)}
            style={{ ...btnStyle(), ...t.style }}
          >
            {t.icon ? <Icon name={t.icon} size={13} /> : t.label}
          </button>
        ))}
      </div>

      {/* Поле ввода */}
      <textarea
        ref={taRef}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder || "Введите текст... Используйте тулбар выше или markdown-разметку"}
        style={{
          width: "100%",
          minHeight,
          padding: "12px 14px",
          border: "none",
          outline: "none",
          fontSize: 14,
          fontFamily: "Montserrat, sans-serif",
          lineHeight: 1.8,
          resize: "vertical",
          boxSizing: "border-box",
          background: "#fff",
          color: "#1a1a1a",
        }}
      />

      {/* Подсказки */}
      <div style={{ padding: "6px 10px", background: "#f8f8f6", borderTop: "1px solid #e8e8e4", display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
        <span style={{ fontSize: 10, color: "#bbb", fontWeight: 600 }}>ПОДСКАЗКИ:</span>
        {HINTS.map((h, i) => (
          <code key={i} style={{ fontSize: 10, color: "#888", background: "#eee", padding: "1px 5px", borderRadius: 4 }}>{h}</code>
        ))}
      </div>
    </div>
  );
}
