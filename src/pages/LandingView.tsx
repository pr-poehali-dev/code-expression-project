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
  const [blobUrl, setBlobUrl] = useState("");

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

  useEffect(() => {
    if (!data) return;

    const blocksHtml = data.blocks && data.blocks.length > 0
      ? data.blocks.map((b) => b.html).join("\n")
      : data.html || "";

    const fullDoc = data.html && data.html.includes("<!DOCTYPE")
      ? data.html
      : `<!DOCTYPE html>
<html lang="ru">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1.0"/>
<title>${data.title}</title>
</head>
<body style="margin:0;padding:0;">${blocksHtml}</body>
</html>`;

    const blob = new Blob([fullDoc], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    setBlobUrl(url);
    return () => URL.revokeObjectURL(url);
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

  if (!blobUrl) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ width: 36, height: 36, border: "3px solid #e2e8f0", borderTopColor: "#2DD4BF", borderRadius: "50%", animation: "spin 0.7s linear infinite" }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return (
    <iframe
      src={blobUrl}
      style={{ width: "100%", height: "100vh", border: "none", display: "block" }}
      title={data?.title}
    />
  );
}
