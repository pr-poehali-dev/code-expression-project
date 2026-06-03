import { useEffect } from "react";
import { useLkAuth } from "@/contexts/LkAuthContext";
import LkLogin from "@/pages/lk/LkLogin";
import RepDashboard from "./RepDashboard";

const ACCENT = "hsl(185,85%,32%)";

export default function RepPage() {
  const { user, loading } = useLkAuth();

  useEffect(() => {
    document.title = "Кабинет представителя — Про Диалог";
  }, []);

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#f8f8f6", fontFamily: "Montserrat, sans-serif" }}>
        <div style={{ width: 36, height: 36, border: "3px solid #eee", borderTopColor: ACCENT, borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (!user) return <LkLogin />;

  if (!user.is_representative && !user.is_admin) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#f8f8f6", fontFamily: "Montserrat, sans-serif", padding: 24 }}>
        <div style={{ textAlign: "center", maxWidth: 360 }}>
          <div style={{ fontSize: 40, marginBottom: 16 }}>🔒</div>
          <div style={{ fontSize: 18, fontWeight: 700, color: "#1a1a1a", marginBottom: 8 }}>Доступ закрыт</div>
          <div style={{ fontSize: 14, color: "#888" }}>Этот раздел доступен только представителям Про Диалог. Обратитесь к администратору.</div>
        </div>
      </div>
    );
  }

  return <RepDashboard />;
}