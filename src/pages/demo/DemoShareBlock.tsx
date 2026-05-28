import { useState } from "react";
import Icon from "@/components/ui/icon";

const ACCENT = "hsl(185,85%,32%)";
const ACCENT_DARK = "hsl(185,85%,24%)";
const SHARE_URL = "https://docdialog.ru/demo";
const SHARE_TEXT = "Прошла бесплатный AI-инструмент для специалистов по телу — получила персональный разбор. Попробуй и ты:";

export default function DemoShareBlock() {
  const [copied, setCopied] = useState(false);

  function handleCopy() {
    navigator.clipboard.writeText(SHARE_URL).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  }

  const tgHref = `https://t.me/share/url?url=${encodeURIComponent(SHARE_URL)}&text=${encodeURIComponent(SHARE_TEXT)}`;

  return (
    <div style={{
      background: `linear-gradient(135deg, ${ACCENT_DARK}, ${ACCENT})`,
      borderRadius: 18, padding: "22px 24px", marginTop: 8, marginBottom: 8,
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
        <div style={{
          width: 34, height: 34, borderRadius: 10,
          background: "rgba(255,255,255,0.18)",
          display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
        }}>
          <Icon name="Share2" size={16} style={{ color: "#fff" }} />
        </div>
        <div>
          <div style={{ fontSize: 14, fontWeight: 700, color: "#fff", lineHeight: 1.3 }}>
            Поделись с коллегами
          </div>
          <div style={{ fontSize: 12, color: "rgba(255,255,255,0.72)", marginTop: 2 }}>
            2 инструмента доступны бесплатно — пусть попробуют
          </div>
        </div>
      </div>
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
        <button
          onClick={handleCopy}
          style={{
            flex: 1, minWidth: 120, padding: "11px 16px", borderRadius: 12,
            background: copied ? "rgba(255,255,255,0.3)" : "rgba(255,255,255,0.18)",
            border: "1.5px solid rgba(255,255,255,0.3)",
            color: "#fff", fontSize: 13, fontWeight: 700,
            cursor: "pointer", fontFamily: "Montserrat, sans-serif",
            display: "flex", alignItems: "center", justifyContent: "center", gap: 7,
            transition: "background 0.2s",
          }}
        >
          <Icon name={copied ? "Check" : "Link"} size={14} style={{ color: "#fff" }} />
          {copied ? "Скопировано!" : "Скопировать ссылку"}
        </button>
        <a
          href={tgHref}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            flex: 1, minWidth: 120, padding: "11px 16px", borderRadius: 12,
            background: "#fff",
            color: ACCENT_DARK, fontSize: 13, fontWeight: 700,
            textDecoration: "none", fontFamily: "Montserrat, sans-serif",
            display: "flex", alignItems: "center", justifyContent: "center", gap: 7,
          }}
        >
          <Icon name="Send" size={14} style={{ color: ACCENT_DARK }} />
          Отправить в Telegram
        </a>
      </div>
    </div>
  );
}
