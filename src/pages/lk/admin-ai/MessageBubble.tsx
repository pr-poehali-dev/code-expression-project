import { useState } from "react";
import Icon from "@/components/ui/icon";
import { ACCENT } from "../LkAdminShared";
import SimpleMarkdown from "./SimpleMarkdown";
import { Message, ROLES, copyToClipboard, extractMarkdownTable, downloadCsv } from "./shared";

export default function MessageBubble({ msg }: { msg: Message }) {
  const [copied, setCopied] = useState(false);
  const isUser = msg.role === "user";
  const role = ROLES.find(r => r.id === msg.roleId);
  const tableRows = !isUser ? extractMarkdownTable(msg.content) : null;

  return (
    <div style={{ display: "flex", flexDirection: isUser ? "row-reverse" : "row", gap: 10, alignItems: "flex-start" }}>
      <div style={{
        width: 32, height: 32, borderRadius: 10, flexShrink: 0,
        background: isUser ? ACCENT : (role?.bg ?? "#f0f0ed"),
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        <Icon name={isUser ? "User" : (role?.icon ?? "Bot")} size={15} style={{ color: isUser ? "#fff" : (role?.color ?? "#666") }} />
      </div>

      <div style={{ maxWidth: "78%", minWidth: 0 }}>
        {!isUser && role && (
          <div style={{ fontSize: 10, fontWeight: 700, color: role.color, marginBottom: 4, textTransform: "uppercase", letterSpacing: 0.5 }}>
            {role.label}
          </div>
        )}
        <div style={{
          background: isUser ? ACCENT : "#fff",
          color: isUser ? "#fff" : "#0F172A",
          borderRadius: isUser ? "16px 4px 16px 16px" : "4px 16px 16px 16px",
          padding: "12px 16px",
          fontSize: 14,
          lineHeight: 1.75,
          wordBreak: "break-word",
          border: isUser ? "none" : "1px solid #E8ECF0",
          boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
        }}>
          {isUser ? msg.content : <SimpleMarkdown text={msg.content} />}
        </div>

        {!isUser && (
          <div style={{ display: "flex", gap: 8, marginTop: 6 }}>
            <button
              onClick={() => copyToClipboard(msg.content, setCopied)}
              style={{
                display: "inline-flex", alignItems: "center", gap: 5,
                padding: "4px 10px",
                background: copied ? `${ACCENT}18` : "transparent",
                border: `1px solid ${copied ? ACCENT : "#e0e0da"}`,
                borderRadius: 7, cursor: "pointer",
                fontSize: 12, fontWeight: 600,
                color: copied ? ACCENT : "#999",
                fontFamily: "Montserrat, sans-serif",
                transition: "all 0.2s",
              }}
            >
              <Icon name={copied ? "Check" : "Copy"} size={12} />
              {copied ? "Скопировано!" : "Скопировать"}
            </button>
            {tableRows && (
              <button
                onClick={() => downloadCsv(tableRows)}
                style={{
                  display: "inline-flex", alignItems: "center", gap: 5,
                  padding: "4px 10px",
                  background: "transparent",
                  border: "1px solid #e0e0da",
                  borderRadius: 7, cursor: "pointer",
                  fontSize: 12, fontWeight: 600,
                  color: "#999",
                  fontFamily: "Montserrat, sans-serif",
                  transition: "all 0.2s",
                }}
              >
                <Icon name="Download" size={12} />
                Скачать таблицу (CSV)
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
