import { useState, useEffect } from "react";

export default function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem("cookie_accepted")) setVisible(true);
  }, []);

  function accept() {
    localStorage.setItem("cookie_accepted", "1");
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div style={{
      position: "fixed", bottom: 24, left: "50%", transform: "translateX(-50%)",
      zIndex: 9998, width: "calc(100vw - 32px)", maxWidth: 560,
      background: "rgba(8,14,28,0.94)", backdropFilter: "blur(16px)",
      border: "1px solid rgba(45,212,191,0.18)",
      borderRadius: 4, boxShadow: "0 16px 48px rgba(0,0,0,0.4)",
      padding: "16px 20px", display: "flex", alignItems: "center", gap: 16,
      fontFamily: "Inter, sans-serif",
    }}>
      <p style={{ margin: 0, fontSize: 13, color: "rgba(255,255,255,0.6)", flex: 1, lineHeight: 1.6, fontWeight: 300 }}>
        Мы используем cookies.{" "}
        <a href="/privacy" style={{ color: "#2DD4BF", textDecoration: "none", fontWeight: 500 }}>
          Политика конфиденциальности
        </a>
      </p>
      <button onClick={accept} style={{
        background: "linear-gradient(135deg,#2DD4BF,#14B8A6)",
        color: "#0F172A", border: "none", borderRadius: 2,
        padding: "9px 22px", fontSize: 13, fontWeight: 600,
        cursor: "pointer", whiteSpace: "nowrap", flexShrink: 0,
        fontFamily: "Inter, sans-serif", letterSpacing: "0.2px",
      }}>
        Принять
      </button>
    </div>
  );
}