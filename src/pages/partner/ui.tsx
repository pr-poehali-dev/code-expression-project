import { ReactNode, useState } from "react";
import Icon from "@/components/ui/icon";
import { TEAL, TEAL_DARK, DARK, GRAY, LINE, OFFER_STATUS, FieldHint } from "./data";

export const card: React.CSSProperties = { background: "#fff", border: `1px solid ${LINE}`, borderRadius: 14, padding: 22 };
export const inputCss: React.CSSProperties = {
  width: "100%", boxSizing: "border-box", padding: "11px 13px", borderRadius: 9, border: `1.5px solid ${LINE}`,
  fontSize: 14, fontFamily: "inherit", color: DARK, background: "#fff", outline: "none",
};

export function Btn({ children, onClick, kind = "primary", disabled, type = "button", full }: {
  children: ReactNode; onClick?: () => void; kind?: "primary" | "ghost" | "danger"; disabled?: boolean; type?: "button" | "submit"; full?: boolean;
}) {
  const styles: Record<string, React.CSSProperties> = {
    primary: { background: `linear-gradient(135deg,${TEAL},${TEAL_DARK})`, color: DARK, border: "none" },
    ghost: { background: "#fff", color: DARK, border: `1.5px solid ${LINE}` },
    danger: { background: "#fff", color: "#B91C1C", border: "1.5px solid #FECACA" },
  };
  return (
    <button type={type} onClick={onClick} disabled={disabled} style={{
      ...styles[kind], display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 8, padding: "11px 20px",
      borderRadius: 9, fontSize: 14, fontWeight: 700, cursor: disabled ? "default" : "pointer", opacity: disabled ? 0.6 : 1,
      fontFamily: "inherit", width: full ? "100%" : undefined,
    }}>{children}</button>
  );
}

export function StatusBadge({ status }: { status: string }) {
  const s = OFFER_STATUS[status] || OFFER_STATUS.draft;
  return <span style={{ background: s.bg, color: s.color, fontSize: 12, fontWeight: 700, padding: "4px 10px", borderRadius: 999, whiteSpace: "nowrap" }}>{s.label}</span>;
}

export function Notice({ kind, children }: { kind: "info" | "warn" | "error" | "success"; children: ReactNode }) {
  const c = {
    info: ["#EFF6FF", "#BFDBFE", "#1E3A8A", "Info"], warn: ["#FFFBEB", "#FDE68A", "#78350F", "AlertTriangle"],
    error: ["#FEF2F2", "#FECACA", "#7F1D1D", "AlertCircle"], success: ["#F0FDF4", "#BBF7D0", "#14532D", "CheckCircle2"],
  }[kind];
  return (
    <div style={{ display: "flex", gap: 10, alignItems: "flex-start", background: c[0], border: `1px solid ${c[1]}`, color: c[2], borderRadius: 10, padding: "12px 14px", fontSize: 13.5, lineHeight: 1.55 }}>
      <Icon name={c[3]} size={16} style={{ flexShrink: 0, marginTop: 2 }} />
      <div style={{ flex: 1 }}>{children}</div>
    </div>
  );
}

export function Field({ hint, children, error, extraLabel }: { hint: FieldHint; children: ReactNode; error?: boolean; extraLabel?: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ marginBottom: 18 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
        <label style={{ fontSize: 13.5, fontWeight: 700, color: DARK }}>
          {extraLabel || hint.label}{hint.required && <span style={{ color: "#DC2626" }}> *</span>}
        </label>
        <button type="button" onClick={() => setOpen(o => !o)} aria-label="Подсказка" style={{
          width: 20, height: 20, borderRadius: "50%", border: `1.5px solid ${TEAL_DARK}`, background: open ? TEAL_DARK : "#fff",
          color: open ? "#fff" : TEAL_DARK, fontSize: 12, fontWeight: 700, cursor: "pointer", padding: 0, lineHeight: 1,
        }}>?</button>
      </div>
      {open && (
        <div style={{ background: "#F0FDFA", border: "1px solid #99F6E4", borderRadius: 9, padding: "10px 12px", fontSize: 13, color: "#134E4A", lineHeight: 1.55, marginBottom: 8 }}>
          {hint.hint}
          {hint.example && <div style={{ marginTop: 6, color: "#0F766E" }}><b>Пример:</b> {hint.example}</div>}
        </div>
      )}
      <div style={error ? { outline: "2px solid #FCA5A5", borderRadius: 10 } : undefined}>{children}</div>
      {hint.limit > 0 && <div style={{ fontSize: 11.5, color: GRAY, marginTop: 4 }}>{hint.example && !open ? `Например: ${hint.example}` : ""}</div>}
    </div>
  );
}

export function fmtDate(v?: string | null) {
  if (!v) return "";
  return new Date(v).toLocaleDateString("ru-RU", { day: "numeric", month: "long", year: "numeric" });
}

export function Spinner() {
  return <div style={{ display: "flex", justifyContent: "center", padding: 60 }}>
    <div style={{ width: 30, height: 30, border: `3px solid ${LINE}`, borderTopColor: TEAL_DARK, borderRadius: "50%", animation: "pspin 0.9s linear infinite" }} />
    <style>{`@keyframes pspin{to{transform:rotate(360deg)}}`}</style>
  </div>;
}
