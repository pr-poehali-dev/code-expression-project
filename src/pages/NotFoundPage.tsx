import { useLocation } from "react-router-dom";
import { useEffect } from "react";

const ACCENT = "hsl(185, 85%, 32%)";
const ACCENT_DARK = "hsl(185, 85%, 26%)";
const ACCENT_SHADOW = "hsla(185, 85%, 32%, 0.3)";

const NotFoundPage = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div style={{
      minHeight: "100vh",
      background: "#f8f8f6",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: "Montserrat, sans-serif",
      padding: "24px",
    }}>
      <div style={{ textAlign: "center", maxWidth: 480 }}>
        <div style={{
          fontSize: 120,
          fontFamily: "Cormorant, serif",
          fontWeight: 700,
          lineHeight: 1,
          color: ACCENT,
          marginBottom: 16,
          letterSpacing: "-4px",
        }}>
          404
        </div>
        <h1 style={{
          fontSize: 26,
          fontWeight: 700,
          color: "#1a1a1a",
          marginBottom: 12,
          lineHeight: 1.3,
        }}>
          Страница не найдена
        </h1>
        <p style={{
          fontSize: 16,
          color: "#666",
          marginBottom: 36,
          lineHeight: 1.6,
        }}>
          Возможно, она была перемещена или удалена. Проверьте ссылку или вернитесь на главную.
        </p>
        <a
          href="/"
          style={{
            display: "inline-block",
            background: ACCENT,
            color: "#fff",
            padding: "13px 36px",
            borderRadius: 10,
            fontWeight: 600,
            fontSize: 15,
            textDecoration: "none",
            boxShadow: `0 4px 16px ${ACCENT_SHADOW}`,
            transition: "all 0.25s ease",
          }}
          onMouseEnter={e => {
            (e.currentTarget as HTMLAnchorElement).style.background = ACCENT_DARK;
            (e.currentTarget as HTMLAnchorElement).style.transform = "translateY(-2px)";
            (e.currentTarget as HTMLAnchorElement).style.boxShadow = `0 6px 20px ${ACCENT_SHADOW}`;
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLAnchorElement).style.background = ACCENT;
            (e.currentTarget as HTMLAnchorElement).style.transform = "translateY(0)";
            (e.currentTarget as HTMLAnchorElement).style.boxShadow = `0 4px 16px ${ACCENT_SHADOW}`;
          }}
        >
          Вернуться на главную
        </a>
      </div>
    </div>
  );
};

export default NotFoundPage;
