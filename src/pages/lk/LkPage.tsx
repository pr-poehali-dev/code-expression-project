import { useLkAuth } from "@/contexts/LkAuthContext";
import LkLogin from "./LkLogin";
import LkDashboard from "./LkDashboard";
import LkEmailVerify from "./LkEmailVerify";

export default function LkPage() {
  const { user, loading, needsEmailVerify, pendingEmail, markEmailVerified } = useLkAuth();

  // Токен подтверждения из URL (?verify=TOKEN)
  const verifyToken = new URLSearchParams(window.location.search).get("verify");

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

  // Переход по ссылке из письма — показываем экран верификации
  if (verifyToken) {
    return (
      <LkEmailVerify
        email={user?.email || pendingEmail || ""}
        verifyToken={verifyToken}
        onVerified={() => {
          markEmailVerified();
          // Убираем ?verify= из URL без перезагрузки
          window.history.replaceState({}, "", "/cabinet");
        }}
      />
    );
  }

  // Только что зарегистрировался — ждём подтверждения
  if (user && needsEmailVerify) {
    return (
      <LkEmailVerify
        email={pendingEmail || user.email}
        onVerified={markEmailVerified}
      />
    );
  }

  return user ? <LkDashboard /> : <LkLogin />;
}