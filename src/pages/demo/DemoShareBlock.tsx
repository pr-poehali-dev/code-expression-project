import { Link } from "react-router-dom";
import Icon from "@/components/ui/icon";

const ACCENT = "hsl(185,85%,32%)";

export default function DemoShareBlock() {
  return (
    <div style={{
      background: `linear-gradient(135deg, hsla(185,85%,32%,0.06), hsla(185,85%,32%,0.02))`,
      border: `1px solid hsla(185,85%,32%,0.18)`,
      borderRadius: 16, padding: "22px 24px",
      display: "flex", flexDirection: "column", gap: 14,
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{
          width: 36, height: 36, borderRadius: 10,
          background: `hsla(185,85%,32%,0.12)`,
          display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
        }}>
          <Icon name="Sparkles" size={17} style={{ color: ACCENT }} />
        </div>
        <div>
          <div style={{ fontSize: 13, fontWeight: 700, color: "#1a1a1a" }}>Это демо-версия</div>
          <div style={{ fontSize: 12, color: "#888", marginTop: 1 }}>Войдите в личный кабинет для полного доступа</div>
        </div>
      </div>
      <Link to="/cabinet" style={{
        display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 7,
        padding: "11px 20px", borderRadius: 10, textDecoration: "none",
        background: `linear-gradient(135deg, ${ACCENT}, hsl(185,85%,24%))`,
        color: "#fff", fontSize: 13, fontWeight: 600,
        fontFamily: "Montserrat, sans-serif",
      }}>
        <Icon name="LogIn" size={14} />
        Войти и сохранить результат
      </Link>
    </div>
  );
}
