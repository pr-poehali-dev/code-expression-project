import { useState, useEffect } from "react";

const ACCENT = "hsl(185, 85%, 32%)";

export default function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const accepted = localStorage.getItem("cookie_accepted");
    if (!accepted) setVisible(true);
  }, []);

  function accept() {
    localStorage.setItem("cookie_accepted", "1");
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div style={{
      position: "fixed",
      bottom: 24,
      left: "50%",
      transform: "translateX(-50%)",
      zIndex: 9999,
      background: "#fff",
      border: "1px solid #e5e7eb",
      borderRadius: 12,
      boxShadow: "0 4px 24px rgba(0,0,0,0.10)",
      padding: "16px 24px",
      display: "flex",
      alignItems: "center",
      gap: 20,
      maxWidth: 600,
      width: "calc(100vw - 32px)",
    }}>
      <p style={{ margin: 0, fontSize: 14, color: "#444", flex: 1, lineHeight: 1.5 }}>
        Мы используем cookies для улучшения работы сайта. Продолжая использование сайта, вы соглашаетесь с нашей{" "}
        <a href="/privacy" style={{ color: ACCENT, textDecoration: "underline" }}>политикой конфиденциальности</a>.
      </p>
      <button
        onClick={accept}
        style={{
          background: ACCENT,
          color: "#fff",
          border: "none",
          borderRadius: 8,
          padding: "8px 20px",
          fontSize: 14,
          fontWeight: 600,
          cursor: "pointer",
          whiteSpace: "nowrap",
          flexShrink: 0,
        }}
      >
        Понятно
      </button>
    </div>
  );
}
