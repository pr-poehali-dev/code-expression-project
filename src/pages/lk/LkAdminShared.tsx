export const ACCENT = "hsl(185,85%,32%)";

export interface User {
  id: number;
  username: string;
  email: string;
  full_name: string;
  is_admin: boolean;
  is_active: boolean;
  created_at: string;
  notes: string;
}

export interface BodyZone {
  id: number;
  slug: string;
  name: string;
  description: string;
  diagnosis: string;
  video_url: string;
  sort_order: number;
  techniques: Technique[];
}

export interface Technique {
  id: number;
  zone_id: number;
  title: string;
  description: string;
  video_url: string;
  sort_order: number;
}

export function Spinner() {
  return (
    <div style={{ display: "flex", justifyContent: "center", padding: 60 }}>
      <div style={{ width: 28, height: 28, border: "3px solid #eee", borderTopColor: ACCENT, borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

export const labelStyle: React.CSSProperties = {
  fontSize: 12, fontWeight: 600, color: "#666", display: "block", marginBottom: 5,
};

export const inputStyle: React.CSSProperties = {
  width: "100%", padding: "10px 12px", borderRadius: 8,
  border: "1.5px solid #e8e8e4", fontSize: 14, outline: "none",
  fontFamily: "Montserrat, sans-serif", boxSizing: "border-box",
  resize: "none",
};

export const actionBtn = (color: string): React.CSSProperties => ({
  display: "inline-flex", alignItems: "center", gap: 6,
  padding: "9px 18px", borderRadius: 10, border: "none",
  background: color, color: "#fff",
  fontSize: 13, fontWeight: 600, cursor: "pointer",
  fontFamily: "Montserrat, sans-serif",
  whiteSpace: "nowrap",
});

export const iconBtn: React.CSSProperties = {
  width: 34, height: 34, borderRadius: 9, border: "1.5px solid #e8e8e4",
  background: "#fafafa", cursor: "pointer", display: "flex",
  alignItems: "center", justifyContent: "center", color: "#888",
  flexShrink: 0,
};
