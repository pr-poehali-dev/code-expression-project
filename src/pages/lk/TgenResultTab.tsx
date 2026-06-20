import { useState } from "react";
import Icon from "@/components/ui/icon";
import { Spinner, actionBtn } from "./LkAdminShared";
import { TEAL, DARK, GRAY, SERIF, CARD_STYLE } from "./TgenTypes";
import type { GeneratedChapter } from "./TgenTypes";

interface Props {
  generated: GeneratedChapter[];
  onBack: () => void;
  onReset: () => void;
}

function downloadImage(url: string) {
  const a = document.createElement("a");
  a.href = url;
  a.download = url.split("/").pop() || "image.png";
  a.target = "_blank";
  a.click();
}

export function TgenResultTab({ generated, onBack, onReset }: Props) {
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);

  const copyText = (text: string, idx: number) => {
    navigator.clipboard.writeText(text);
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
              onClick={() => copyText(ch.text, idx)}
              style={{ ...actionBtn(copiedIdx === idx ? "hsl(145,60%,38%)" : TEAL), flexShrink: 0 }}
            >
              <Icon name={copiedIdx === idx ? "CheckCheck" : "Copy"} size={14} />
              {copiedIdx === idx ? "Скопировано!" : "Копировать текст"}
            </button>
          </div>

          <div style={{ fontSize: 14, color: "#334155", lineHeight: 1.9, whiteSpace: "pre-wrap", marginBottom: ch.images.length > 0 ? 20 : 0 }}>
            {ch.text}
          </div>

          {ch.images.length > 0 && (
            <div>
              <div style={{ fontSize: 12, fontWeight: 700, color: GRAY, textTransform: "uppercase", letterSpacing: "1px", marginBottom: 12 }}>
                Изображения к главе
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 12 }}>
                {ch.images.map((url, imgIdx) => (
                  <div key={imgIdx} style={{ borderRadius: 10, overflow: "hidden", border: "1.5px solid #e8e8e4", position: "relative" }}>
                    <img
                      src={url}
                      alt={`${ch.title} — изображение ${imgIdx + 1}`}
                      style={{ width: "100%", display: "block", aspectRatio: "1", objectFit: "cover" }}
                    />
                    <button
                      onClick={() => downloadImage(url)}
                      style={{
                        position: "absolute", bottom: 8, right: 8,
                        background: "rgba(0,0,0,0.7)", color: "#fff", border: "none",
                        borderRadius: 8, padding: "7px 12px", fontSize: 12, fontWeight: 600,
                        cursor: "pointer", display: "flex", alignItems: "center", gap: 6,
                      }}
                    >
                      <Icon name="Download" size={13} /> Скачать
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
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
