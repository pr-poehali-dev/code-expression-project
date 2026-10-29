// Заглушка, которую сервер отдаёт для страниц кабинета (ssr: false): тот же
// спиннер, что показывался при загрузке раньше, и подпись для скринридеров.
export default function ClientOnlyFallback({ label }: { label: string }) {
  return (
    <div data-page-fallback="" style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#fff" }}>
      <span className="sr-only">{label}</span>
      <div style={{ width: 36, height: 36, border: "3px solid #e2e8f0", borderTopColor: "#2DD4BF", borderRadius: "50%", animation: "spin 0.7s linear infinite" }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
