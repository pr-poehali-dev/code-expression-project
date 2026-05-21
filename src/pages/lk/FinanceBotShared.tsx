import Icon from "@/components/ui/icon";
import {
  FINANCE_ACCENT, FINANCE_ACCENT_LIGHT, FINANCE_ACCENT_DARK,
  FinanceData, FinanceStep, LIFE_ITEMS_DEFAULT,
} from "./finance.types";

export const G  = FINANCE_ACCENT;
export const GL = FINANCE_ACCENT_LIGHT;
export const GD = FINANCE_ACCENT_DARK;

export const TOTAL_STEPS = 8;

// ── defaultData ───────────────────────────────────────────────────────────────

export function defaultData(): FinanceData {
  return {
    lifeItems: LIFE_ITEMS_DEFAULT.map(i => ({ ...i, amount: 0, importance: 3 })),
    goals: { desiredIncome: 0, savings: 0, goalDescription: "", goalMonths: 12 },
    currentModel: { currentIncome: 0, avgCheck: 0, clientsPerMonth: 0, hoursPerWeek: 40, workDaysPerMonth: 20, sessionDurationHours: 1 },
    expenses: { rent: 0, materials: 0, taxes: 0, education: 0, marketing: 0, personal: 0, loans: 0, other: 0 },
    energy: { tiredness: 3, emotionalLoad: 3, physicalLoad: 3, desireToWorkMore: 3 },
    mindset: { fearRaisePrice: false, feelUnworthy: false, fearLoseClients: false, hardToTalkMoney: false, incomeCapInHead: false },
  };
}

// ── StepShell ─────────────────────────────────────────────────────────────────

interface StepShellProps {
  step: FinanceStep;
  onBack: () => void;
  children: React.ReactNode;
}

export function StepShell({ step, onBack, children }: StepShellProps) {
  const progress = Math.round(((step - 1) / TOTAL_STEPS) * 100);
  return (
    <div style={{ fontFamily: "Montserrat, sans-serif", maxWidth: 560, margin: "0 auto" }}>
      <div style={{ marginBottom: 24 }}>
        <button onClick={onBack} style={{
          display: "inline-flex", alignItems: "center", gap: 8,
          background: "none", border: "none", color: "#888",
          fontSize: 13, cursor: "pointer", padding: "0 0 14px",
          fontFamily: "Montserrat, sans-serif",
        }}>
          <Icon name="ArrowLeft" size={15} /> {step === 1 ? "К инструментам" : "Назад"}
        </button>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
          <span style={{ fontSize: 12, color: "#aaa" }}>Этап {step} из {TOTAL_STEPS}</span>
          <span style={{ fontSize: 12, fontWeight: 700, color: G }}>{progress}%</span>
        </div>
        <div style={{ height: 4, background: "#e8e8e0", borderRadius: 2 }}>
          <div style={{ width: `${progress}%`, height: "100%", background: `linear-gradient(90deg, ${G}, ${GD})`, borderRadius: 2, transition: "width 0.4s ease" }} />
        </div>
      </div>
      {children}
    </div>
  );
}

// ── NumInput ──────────────────────────────────────────────────────────────────

interface NumInputProps {
  label: string;
  value: number;
  onChange: (v: number) => void;
  prefix?: string;
  suffix?: string;
  placeholder?: string;
  hint?: string;
}

export function NumInput({ label, value, onChange, prefix, suffix, placeholder, hint }: NumInputProps) {
  return (
    <div style={{ marginBottom: 16 }}>
      <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#444", marginBottom: 6 }}>{label}</label>
      {hint && <div style={{ fontSize: 12, color: "#aaa", marginBottom: 6 }}>{hint}</div>}
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        {prefix && <span style={{ fontSize: 14, color: "#888", minWidth: 20 }}>{prefix}</span>}
        <input
          type="number"
          value={value || ""}
          onChange={e => onChange(parseFloat(e.target.value) || 0)}
          placeholder={placeholder || "0"}
          style={{
            flex: 1, padding: "11px 14px", borderRadius: 10, border: "1.5px solid #e8e8e4",
            fontSize: 15, fontFamily: "Montserrat, sans-serif", background: "#fafafa",
            outline: "none", transition: "border-color 0.2s",
          }}
          onFocus={e => { e.target.style.borderColor = G; e.target.style.background = GL; }}
          onBlur={e => { e.target.style.borderColor = "#e8e8e4"; e.target.style.background = "#fafafa"; }}
        />
        {suffix && <span style={{ fontSize: 13, color: "#888", minWidth: 36 }}>{suffix}</span>}
      </div>
    </div>
  );
}

// ── TextInput ─────────────────────────────────────────────────────────────────

interface TextInputProps {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}

export function TextInput({ label, value, onChange, placeholder }: TextInputProps) {
  return (
    <div style={{ marginBottom: 16 }}>
      <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#444", marginBottom: 6 }}>{label}</label>
      <input
        type="text"
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        style={{
          width: "100%", padding: "11px 14px", borderRadius: 10, border: "1.5px solid #e8e8e4",
          fontSize: 14, fontFamily: "Montserrat, sans-serif", background: "#fafafa",
          outline: "none", boxSizing: "border-box",
        }}
        onFocus={e => { e.target.style.borderColor = G; e.target.style.background = GL; }}
        onBlur={e => { e.target.style.borderColor = "#e8e8e4"; e.target.style.background = "#fafafa"; }}
      />
    </div>
  );
}

// ── SectionCard ───────────────────────────────────────────────────────────────

interface SectionCardProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}

export function SectionCard({ title, subtitle, children }: SectionCardProps) {
  return (
    <div style={{ background: "#fff", borderRadius: 20, padding: "24px 24px 20px", marginBottom: 16, boxShadow: "0 2px 12px rgba(0,0,0,0.05)" }}>
      <div style={{ fontSize: 11, fontWeight: 700, color: G, textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 4 }}>{title}</div>
      {subtitle && <p style={{ fontSize: 13, color: "#888", margin: "0 0 18px", lineHeight: 1.6 }}>{subtitle}</p>}
      {children}
    </div>
  );
}

// ── NextBtn ───────────────────────────────────────────────────────────────────

interface NextBtnProps {
  onClick: () => void;
  disabled?: boolean;
  label?: string;
}

export function NextBtn({ onClick, disabled, label = "Далее →" }: NextBtnProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        width: "100%", padding: "14px", borderRadius: 14, border: "none",
        background: disabled ? "#e8e8e0" : `linear-gradient(135deg, ${G}, ${GD})`,
        color: disabled ? "#bbb" : "#fff", fontSize: 15, fontWeight: 700,
        cursor: disabled ? "not-allowed" : "pointer",
        fontFamily: "Montserrat, sans-serif", transition: "all 0.2s",
        boxShadow: disabled ? "none" : `0 6px 20px ${G}44`,
      }}
    >{label}</button>
  );
}
