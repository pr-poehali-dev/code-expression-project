import { useState } from "react";
import Icon from "@/components/ui/icon";
import { renderMarkdown } from "@/utils/markdown";
import {
  AgentConfig, Message,
  PACKAGES, LK_URL, FREE_LIMIT, ENERGY_PER_MSG,
  copyToClipboard, downloadFile, detectFormat,
} from "./SalonAgentTypes";

// ── MessageBubble ──────────────────────────────────────────────────────────────

export function MessageBubble({ msg, agent, prevUserMsg }: { msg: Message; agent: AgentConfig; prevUserMsg?: string }) {
  const [copied, setCopied] = useState(false);
  const isUser = msg.role === "user";
  const isLong = msg.content.length > 300;
  const fmt = detectFormat(prevUserMsg || "");
  const hasTable = msg.content.includes("|");
  const showDownload = isLong || hasTable;

  return (
    <div style={{ display: "flex", flexDirection: isUser ? "row-reverse" : "row", gap: 10, alignItems: "flex-start" }}>
      <div style={{ width: 34, height: 34, borderRadius: 10, flexShrink: 0, background: isUser ? "#0F172A" : agent.bg, border: `1.5px solid ${isUser ? "transparent" : agent.borderColor}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Icon name={isUser ? "User" : agent.icon} size={15} style={{ color: isUser ? "#fff" : agent.color }} />
      </div>
      <div style={{ maxWidth: "80%", minWidth: 0 }}>
        <div style={{ background: isUser ? "#0F172A" : "#fff", color: isUser ? "#fff" : "#0F172A", borderRadius: isUser ? "16px 4px 16px 16px" : "4px 16px 16px 16px", padding: "12px 16px", fontSize: 14, lineHeight: 1.75, wordBreak: "break-word", border: isUser ? "none" : "1px solid #E8ECF0", boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}
          dangerouslySetInnerHTML={isUser ? undefined : { __html: renderMarkdown(msg.content) }}
        >
          {isUser ? msg.content : undefined}
        </div>
        {!isUser && (
          <div style={{ display: "flex", gap: 6, marginTop: 6, flexWrap: "wrap" }}>
            <button onClick={() => copyToClipboard(msg.content, setCopied)} style={{ display: "inline-flex", alignItems: "center", gap: 5, padding: "4px 10px", background: copied ? `${agent.color}15` : "transparent", border: `1px solid ${copied ? agent.color : "#e0e0da"}`, borderRadius: 7, cursor: "pointer", fontSize: 12, fontWeight: 600, color: copied ? agent.color : "#999", fontFamily: "Montserrat, sans-serif", transition: "all 0.2s" }}>
              <Icon name={copied ? "Check" : "Copy"} size={12} />
              {copied ? "Скопировано!" : "Скопировать"}
            </button>
            {showDownload && (
              <button
                onClick={() => downloadFile(msg.content, agent.label, fmt)}
                style={{ display: "inline-flex", alignItems: "center", gap: 5, padding: "4px 10px", background: "transparent", border: "1px solid #e0e0da", borderRadius: 7, cursor: "pointer", fontSize: 12, fontWeight: 600, color: "#999", fontFamily: "Montserrat, sans-serif", transition: "all 0.2s" }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = agent.color; e.currentTarget.style.color = agent.color; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = "#e0e0da"; e.currentTarget.style.color = "#999"; }}
              >
                <Icon name="Download" size={12} />
                Скачать .{fmt}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// ── PaywallModal ───────────────────────────────────────────────────────────────

export function PaywallModal({ onClose, energyBalance, onNavigateShop }: { onClose: () => void; energyBalance: number; onNavigateShop: () => void }) {
  const [paying, setPaying] = useState<string | null>(null);
  const sessionId = localStorage.getItem("lk_session") || "";

  async function buyPackage(code: string) {
    setPaying(code);
    try {
      const res = await fetch(`${LK_URL}?action=payment_create`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "X-Session-Id": sessionId },
        body: JSON.stringify({ package_code: code, return_url: window.location.href, enable_autopay: false, threshold: 50 }),
      });
      const data = await res.json();
      if (data.confirmation_url) { window.location.href = data.confirmation_url; }
      else { alert(data.error || "Ошибка создания платежа"); }
    } catch { alert("Не удалось подключиться к платёжной системе"); }
    finally { setPaying(null); }
  }

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(15,23,42,0.6)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }} onClick={onClose}>
      <div style={{ background: "#fff", borderRadius: 24, padding: "32px 28px", maxWidth: 520, width: "100%", boxShadow: "0 24px 80px rgba(0,0,0,0.25)" }} onClick={e => e.stopPropagation()}>
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 20 }}>
          <div>
            <div style={{ fontSize: 20, fontWeight: 800, color: "#0F172A", letterSpacing: -0.5 }}>Бесплатные сообщения закончились</div>
            <div style={{ fontSize: 13, color: "#94A3B8", marginTop: 4 }}>Баланс: {energyBalance} ⚡ · стоимость зависит от сложности запроса</div>
          </div>
          <button onClick={onClose} style={{ border: "none", background: "none", cursor: "pointer", color: "#94A3B8", padding: 4 }}><Icon name="X" size={20} /></button>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 16 }}>
          {PACKAGES.map(pkg => (
            <button key={pkg.code} onClick={() => buyPackage(pkg.code)} disabled={!!paying} style={{ position: "relative", padding: "16px 14px", borderRadius: 14, border: pkg.popular ? "2px solid #6d28d9" : "1.5px solid #E8ECF0", background: pkg.popular ? "#f5f3ff" : "#fff", cursor: paying ? "default" : "pointer", textAlign: "left", fontFamily: "Montserrat, sans-serif", transition: "all 0.15s", opacity: paying && paying !== pkg.code ? 0.6 : 1 }}>
              {pkg.popular && <div style={{ position: "absolute", top: -10, left: "50%", transform: "translateX(-50%)", background: "#6d28d9", color: "#fff", fontSize: 9, fontWeight: 700, padding: "3px 10px", borderRadius: 20, letterSpacing: 1, whiteSpace: "nowrap" }}>ПОПУЛЯРНЫЙ</div>}
              <div style={{ fontSize: 15, fontWeight: 800, color: "#0F172A", marginBottom: 2 }}>{pkg.name}</div>
              <div style={{ fontSize: 20, fontWeight: 800, color: pkg.popular ? "#6d28d9" : "#0F172A" }}>{pkg.price.toLocaleString("ru")} ₽</div>
              <div style={{ fontSize: 12, color: "#64748B", marginTop: 4 }}>{pkg.energy} ⚡ · ~{pkg.msgs} сообщений</div>
              {paying === pkg.code && <div style={{ marginTop: 6, fontSize: 11, color: "#6d28d9" }}>Переход к оплате...</div>}
            </button>
          ))}
        </div>

        <div style={{ display: "flex", gap: 10 }}>
          <button onClick={onNavigateShop} style={{ flex: 1, padding: "11px 0", borderRadius: 12, border: "1.5px solid #E8ECF0", background: "#fff", fontSize: 13, fontWeight: 600, color: "#64748B", cursor: "pointer", fontFamily: "Montserrat, sans-serif" }}>Раздел «Энергия»</button>
          <button onClick={onClose} style={{ flex: 1, padding: "11px 0", borderRadius: 12, border: "none", background: "#0F172A", fontSize: 13, fontWeight: 600, color: "#fff", cursor: "pointer", fontFamily: "Montserrat, sans-serif" }}>Назад к диалогу</button>
        </div>
        <div style={{ marginTop: 14, fontSize: 11, color: "#CBD5E1", textAlign: "center" }}>Оплата картой, СБП, ЮMoney через ЮКассу</div>
      </div>
    </div>
  );
}

// ── FreeUsageBar ───────────────────────────────────────────────────────────────

export function FreeUsageBar({ used, limit, energyBalance, onPaywall }: { used: number; limit: number; energyBalance: number; onPaywall: () => void }) {
  const remaining = limit - used;
  const isPaid = used >= limit;
  const pct = Math.min(100, (used / limit) * 100);

  if (isPaid) {
    return (
      <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 16px", background: "#fff", border: "1.5px solid #E8ECF0", borderRadius: 12 }}>
        <Icon name="Zap" size={14} style={{ color: "#f59e0b" }} />
        <span style={{ fontSize: 13, fontWeight: 700, color: "#0F172A" }}>{energyBalance} ⚡</span>
        <span style={{ fontSize: 12, color: "#94A3B8" }}>баланс · стоимость зависит от сложности запроса</span>
        {energyBalance < ENERGY_PER_MSG && (
          <button onClick={onPaywall} style={{ marginLeft: "auto", padding: "6px 14px", borderRadius: 8, border: "none", background: "#f59e0b", color: "#fff", fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: "Montserrat, sans-serif", whiteSpace: "nowrap" }}>
            Пополнить ⚡
          </button>
        )}
      </div>
    );
  }

  return (
    <div style={{ padding: "10px 16px", background: "#fff", border: "1.5px solid #E8ECF0", borderRadius: 12 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
        <div style={{ fontSize: 12, fontWeight: 600, color: "#64748B", display: "flex", alignItems: "center", gap: 5 }}>
          <Icon name="Gift" size={13} style={{ color: "#22c55e" }} />
          Бесплатный период
        </div>
        <span style={{ fontSize: 12, fontWeight: 700, color: remaining <= 3 ? "#ef4444" : "#0F172A" }}>
          осталось {remaining} из {limit}
        </span>
      </div>
      <div style={{ height: 6, background: "#F1F5F9", borderRadius: 3, overflow: "hidden" }}>
        <div style={{ height: "100%", width: `${pct}%`, background: remaining <= 3 ? "#ef4444" : "#22c55e", borderRadius: 3, transition: "width 0.4s ease" }} />
      </div>
      {remaining <= 3 && <div style={{ marginTop: 5, fontSize: 11, color: "#ef4444", fontWeight: 600 }}>Осталось мало — пополните баланс заранее</div>}
    </div>
  );
}