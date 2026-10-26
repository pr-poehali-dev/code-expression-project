import { useMemo, useState } from "react";
import Icon from "@/components/ui/icon";
import { FAQ, GRAY, DARK, LINE } from "./data";
import { card, inputCss } from "./ui";

export default function PartnerFaq() {
  const [q, setQ] = useState("");
  const [open, setOpen] = useState<string | null>("how");
  const list = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return FAQ;
    return FAQ.filter(i => (i.q + " " + i.a + " " + i.tags).toLowerCase().includes(s));
  }, [q]);
  return (
    <div style={{ maxWidth: 760 }}>
      <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 26, margin: "0 0 6px" }}>Частые вопросы</h2>
      <p style={{ fontSize: 13.5, color: GRAY, margin: "0 0 14px" }}>Как работают модерация, сроки и показы. Введите слово, чтобы найти ответ.</p>
      <div style={{ position: "relative", marginBottom: 14 }}>
        <Icon name="Search" size={16} style={{ position: "absolute", left: 12, top: 13, color: GRAY }} />
        <input style={{ ...inputCss, paddingLeft: 36 }} placeholder="Например: срок, цена, показы" value={q} onChange={e => setQ(e.target.value)} />
      </div>
      {list.length === 0 && <div style={card}><div style={{ fontSize: 14, color: GRAY }}>Ничего не нашлось. Попробуйте другое слово или напишите нам через раздел «Контакты».</div></div>}
      <div style={{ display: "grid", gap: 8 }}>
        {list.map(i => {
          const isOpen = open === i.id || !!q.trim();
          return (
            <div key={i.id} style={{ ...card, padding: 0, overflow: "hidden" }}>
              <button onClick={() => setOpen(open === i.id ? null : i.id)} style={{ width: "100%", textAlign: "left", background: "none", border: "none", padding: "15px 18px", cursor: "pointer", display: "flex", justifyContent: "space-between", gap: 10, alignItems: "center", fontFamily: "inherit" }}>
                <span style={{ fontSize: 14.5, fontWeight: 700, color: DARK }}>{i.q}</span>
                <Icon name={isOpen ? "ChevronUp" : "ChevronDown"} size={16} style={{ color: GRAY, flexShrink: 0 }} />
              </button>
              {isOpen && <div style={{ padding: "0 18px 16px", fontSize: 14, color: "#334155", lineHeight: 1.65, borderTop: `1px solid ${LINE}`, paddingTop: 12 }}>{i.a}</div>}
            </div>
          );
        })}
      </div>
    </div>
  );
}
