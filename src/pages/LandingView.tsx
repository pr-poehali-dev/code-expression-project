import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const LANDING_API_URL = "https://functions.poehali.dev/b5f86006-d448-4c34-96b8-3fba0295cb14";

interface LandingData {
  id: string;
  title: string;
  html: string;
  blocks: { id: string; label: string; html: string }[];
  style: Record<string, string>;
}

export default function LandingView() {
  const { id } = useParams<{ id: string }>();
  const [data, setData] = useState<LandingData | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) return;
    fetch(`${LANDING_API_URL}?public=${id}`)
      .then((r) => r.json())
      .then((d) => {
        if (d.error) { setError(d.error); return; }
        setData(d);
      })
      .catch(() => setError("Не удалось загрузить лендинг"));
  }, [id]);

  useEffect(() => {
    if (data?.title) document.title = data.title;
  }, [data]);

  if (error) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "sans-serif", color: "#64748b" }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>🚀</div>
          <div style={{ fontSize: 18, fontWeight: 600, marginBottom: 8 }}>Лендинг не найден</div>
          <div style={{ fontSize: 14 }}>{error}</div>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ width: 36, height: 36, border: "3px solid #e2e8f0", borderTopColor: "#2DD4BF", borderRadius: "50%", animation: "spin 0.7s linear infinite" }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  const fullHtml = data.blocks && data.blocks.length > 0
    ? data.blocks.map((b) => b.html).join("\n")
    : data.html || "";

  return (
    <div dangerouslySetInnerHTML={{ __html: fullHtml }} />
  );
}
