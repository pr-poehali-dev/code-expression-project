import { useState } from "react";
import Icon from "@/components/ui/icon";
import { ACCENT, ACCENT_LIGHT, SALON_TARIFFS, EXTRA_SERVICES, USEFUL_LINKS, copyText } from "./rep.constants";

function CopyBtn({ text, label = "Скопировать" }: { text: string; label?: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button onClick={() => copyText(text, setCopied)} style={{
      display: "inline-flex", alignItems: "center", gap: 5,
      padding: "5px 12px", borderRadius: 7,
      border: `1px solid ${copied ? ACCENT : "#e0e0da"}`,
      background: copied ? ACCENT_LIGHT : "transparent",
      color: copied ? ACCENT : "#999",
      fontSize: 12, fontWeight: 600, cursor: "pointer",
      fontFamily: "Montserrat, sans-serif", transition: "all 0.2s",
    }}>
      <Icon name={copied ? "Check" : "Copy"} size={12} />
      {copied ? "Скопировано!" : label}
    </button>
  );
}

export default function RepTariffsTab() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <h2 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: "#1a1a1a" }}>Тарифы для салонов</h2>

      {SALON_TARIFFS.map(t => (
        <div key={t.name} style={{ background: "#fff", borderRadius: 16, border: "1px solid #e8e8e4", overflow: "hidden", boxShadow: "0 2px 10px rgba(0,0,0,0.04)" }}>
          <div style={{ background: t.color, padding: "16px 20px", display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 8 }}>
            <div>
              <div style={{ fontWeight: 700, fontSize: 16, color: "#fff" }}>{t.name}</div>
              <div style={{ fontSize: 12, color: "rgba(255,255,255,0.75)", marginTop: 3 }}>{t.period}</div>
            </div>
            <div style={{ fontWeight: 800, fontSize: 20, color: "#fff" }}>{t.price}</div>
          </div>
          <div style={{ padding: "18px 20px" }}>
            <ul style={{ margin: "0 0 12px", paddingLeft: 18, display: "flex", flexDirection: "column", gap: 5 }}>
              {t.features.map(f => (
                <li key={f} style={{ fontSize: 13, color: "#444", lineHeight: 1.5 }}>{f}</li>
              ))}
            </ul>
            <div style={{ background: "#f8f8f6", borderRadius: 8, padding: "8px 12px", fontSize: 12, color: "#666", marginBottom: 14 }}>
              <strong>Результат:</strong> {t.result}
            </div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
              <a href={t.url} target="_blank" rel="noreferrer" style={{
                display: "inline-flex", alignItems: "center", gap: 6,
                padding: "7px 16px", borderRadius: 8,
                background: t.color, color: "#fff",
                fontSize: 12, fontWeight: 600, textDecoration: "none",
              }}>
                <Icon name="ExternalLink" size={12} />
                Открыть
              </a>
              <CopyBtn text={t.url} label="Скопировать ссылку" />
              <CopyBtn text={`${t.name} — ${t.price}\n${t.period}\n\n${t.features.join("\n")}\n\nРезультат: ${t.result}\n\nПодробнее: ${t.url}`} label="Скопировать текст" />
            </div>
          </div>
        </div>
      ))}

      {/* Доп. услуги */}
      <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #e8e8e4", padding: "18px 20px" }}>
        <div style={{ fontWeight: 700, fontSize: 15, color: "#1a1a1a", marginBottom: 14 }}>Дополнительные услуги</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {EXTRA_SERVICES.map(s => (
            <div key={s.name} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8, padding: "10px 12px", background: "#f8f8f6", borderRadius: 10 }}>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: "#1a1a1a" }}>{s.name}</div>
                <div style={{ fontSize: 12, color: ACCENT, fontWeight: 700, marginTop: 2 }}>{s.price}</div>
              </div>
              <div style={{ display: "flex", gap: 6 }}>
                <a href={s.url} target="_blank" rel="noreferrer" style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 30, height: 30, borderRadius: 7, border: "1px solid #e0e0da", background: "#fff", color: "#666", textDecoration: "none" }}>
                  <Icon name="ExternalLink" size={13} />
                </a>
                <CopyBtn text={s.url} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Полезные ссылки */}
      <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #e8e8e4", padding: "18px 20px" }}>
        <div style={{ fontWeight: 700, fontSize: 15, color: "#1a1a1a", marginBottom: 14 }}>Полезные ссылки</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {USEFUL_LINKS.map(l => (
            <div key={l.url} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
              <a href={l.url} target="_blank" rel="noreferrer" style={{ fontSize: 13, color: ACCENT, fontWeight: 600, textDecoration: "underline", textDecorationColor: `${ACCENT}50` }}>
                {l.label}
              </a>
              <CopyBtn text={l.url} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
