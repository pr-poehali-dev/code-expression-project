import { useLkAuth } from "@/contexts/LkAuthContext";
import LkLogin from "./LkLogin";
import LkDashboard from "./LkDashboard";

export default function LkPage() {
  const { user, loading } = useLkAuth();

  if (loading) {
    return (
      <div style={{
        minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center",
        background: "#f8f8f6", fontFamily: "Montserrat, sans-serif",
      }}>
        <div style={{
          width: 36, height: 36,
          border: "3px solid #eee",
          borderTopColor: "hsl(185,85%,32%)",
          borderRadius: "50%",
          animation: "spin 0.8s linear infinite",
        }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return user ? <LkDashboard /> : <LkLogin />;
}
