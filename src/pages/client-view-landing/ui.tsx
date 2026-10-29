import { Link } from "@/lib/router-compat";
import Icon from "@/components/ui/icon";

export const TEAL = "#2DD4BF";
export const TEAL2 = "#14B8A6";
export const DARK = "#0F172A";
export const GRAY = "#64748B";
export const SERIF = "'Cormorant Garamond', serif";

export function openClientView() {
  try { sessionStorage.setItem("lk_tab", "clientview"); } catch { /* ignore */ }
}

export function Eyebrow({ children, light = false }: { children: React.ReactNode; light?: boolean }) {
  return (
    <div style={{ fontSize: 12, fontWeight: 600, color: light ? "#0E9F8F" : TEAL, textTransform: "uppercase", letterSpacing: "2.5px", marginBottom: 18 }}>
      {children}
    </div>
  );
}

export function H2({ children, dark = true }: { children: React.ReactNode; dark?: boolean }) {
  return (
    <h2 style={{ fontFamily: SERIF, fontSize: "clamp(30px,4.2vw,50px)", fontWeight: 500, color: dark ? DARK : "#fff", margin: "0 0 16px", letterSpacing: "-0.5px", lineHeight: 1.1 }}>
      {children}
    </h2>
  );
}

export function CtaButton({ children = "Попробовать инструмент", big = false }: { children?: React.ReactNode; big?: boolean }) {
  return (
    <Link to="/cabinet" onClick={openClientView} className="cvl-cta" style={{
      display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 10,
      padding: big ? "18px 40px" : "16px 34px", borderRadius: 2, fontSize: big ? 17 : 16, fontWeight: 700,
      background: `linear-gradient(135deg,${TEAL},${TEAL2})`, color: DARK, textDecoration: "none",
      boxShadow: "0 8px 32px rgba(45,212,191,0.3)",
    }}>
      {children} <Icon name="ArrowRight" size={17} />
    </Link>
  );
}

export const wrap: React.CSSProperties = { maxWidth: 1180, margin: "0 auto", width: "100%" };
