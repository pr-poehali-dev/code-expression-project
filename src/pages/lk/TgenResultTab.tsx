import { useState } from "react";
import Icon from "@/components/ui/icon";
import { Spinner, actionBtn } from "./LkAdminShared";
import { TEAL, DARK, SERIF, CARD_STYLE } from "./TgenTypes";
import type { GeneratedChapter } from "./TgenTypes";

interface Props {
  generated: GeneratedChapter[];
  onBack: () => void;
  onReset: () => void;
}


export function TgenResultTab({ generated, onBack, onReset }: Props) {
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);

  const copyText = (ch: GeneratedChapter, idx: number) => {
    const full = `Глава ${ch.num}: ${ch.title}\n\n${ch.text}`;
    navigator.clipboard.writeText(full);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 2000);
  };

  if (generated.length === 0) {
    return (
      <div style={{ ...CARD_STYLE, textAlign: "center", padding: "40px 24px" }}>
        <Spinner />
      </div>
    );
  }

  return (
    <div>
      {generated.map((ch, idx) => (
        <div key={ch.num} style={{ ...CARD_STYLE, marginBottom: 24 }}>
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 16, flexWrap: "wrap", gap: 10 }}>
            <div>
              <div style={{ fontSize: 12, fontWeight: 600, color: TEAL, textTransform: "uppercase", letterSpacing: "1.5px", marginBottom: 4 }}>
                Глава {ch.num}
              </div>
              <h3 style={{ fontFamily: SERIF, fontSize: 22, fontWeight: 700, color: DARK, margin: 0 }}>{ch.title}</h3>
            </div>
            <button
              onClick={() => copyText(ch, idx)}
              style={{ ...actionBtn(copiedIdx === idx ? "hsl(145,60%,38%)" : TEAL), flexShrink: 0 }}
            >
              <Icon name={copiedIdx === idx ? "CheckCheck" : "Copy"} size={14} />
              {copiedIdx === idx ? "Скопировано!" : "Копировать текст"}
            </button>
          </div>

          <div style={{ fontSize: 14, color: "#334155", lineHeight: 1.9, whiteSpace: "pre-wrap" }}>
            {ch.text}
          </div>
        </div>
      ))}

      <div style={{ display: "flex", justifyContent: "center", gap: 12, marginTop: 8 }}>
        <button onClick={onBack} style={{ ...actionBtn("#64748b") }}>
          <Icon name="ArrowLeft" size={14} /> Назад к главам
        </button>
        <button onClick={onReset} style={{ ...actionBtn(TEAL) }}>
          <Icon name="Plus" size={14} /> Новый тренинг
        </button>
      </div>
    </div>
  );
}