import { useEffect, useState } from "react";
import Icon from "@/components/ui/icon";
import func2url from "../../../backend/func2url.json";

const URL_ = (func2url as Record<string, string>)["partner-api"] || "";
const sid = () => localStorage.getItem("lk_session") || "";

async function call(action: string) {
  const res = await fetch(`${URL_}?action=${action}`, { headers: { "X-Session-Id": sid() } });
  return res.json().catch(() => ({}));
}

export default function LkPartnerLink({ compact = false }: { compact?: boolean }) {
  const [isPartner, setIsPartner] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!URL_ || !sid()) return;
    call("lk_is_partner").then(d => setIsPartner(!!d.is_partner)).catch(() => {});
  }, []);

  if (!isPartner) return null;

  const open = async () => {
    setBusy(true);
    const d = await call("open_partner");
    setBusy(false);
    if (d.session) {
      localStorage.setItem("partner_session", d.session);
      window.location.href = "/partner";
    }
  };

  if (compact) {
    return (
      <button onClick={open} disabled={busy} style={{ display: "flex", alignItems: "center", gap: 5, background: "none", border: "1.5px solid rgba(45,212,191,0.4)", borderRadius: 8, color: "#2DD4BF", fontSize: 12, cursor: "pointer", padding: "5px 10px", fontFamily: "Montserrat, sans-serif" }}>
        <Icon name="Handshake" size={12} />
        Партнерам
      </button>
    );
  }
  return (
    <button onClick={open} disabled={busy} style={{ display: "flex", alignItems: "center", gap: 7, width: "100%", marginBottom: 10, padding: "8px 10px", borderRadius: 8, background: "rgba(45,212,191,0.1)", border: "1px solid rgba(45,212,191,0.3)", color: "#2DD4BF", fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "Montserrat, sans-serif" }}>
      <Icon name="Handshake" size={13} />
      Партнерский кабинет
    </button>
  );
}
