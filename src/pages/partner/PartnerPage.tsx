import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "@/lib/helmet";
import Icon from "@/components/ui/icon";
import { partnerRequest, partnerSession } from "./api";
import { DARK, GRAY, LINE, TEAL, TEAL_DARK } from "./data";
import { Spinner } from "./ui";
import PartnerAuth from "./PartnerAuth";
import PartnerHome, { MeData } from "./PartnerHome";
import PartnerProfile from "./PartnerProfile";
import PartnerPromo from "./PartnerPromo";
import PartnerFaq from "./PartnerFaq";
import { OffersList, OfferForm } from "./PartnerOffers";

const NAV = [
  { id: "home", icon: "LayoutDashboard", label: "Главная" },
  { id: "offers", icon: "FileText", label: "Предложения" },
  { id: "promo", icon: "Megaphone", label: "Продвижение" },
  { id: "profile", icon: "UserRound", label: "Профиль" },
  { id: "faq", icon: "CircleHelp", label: "Вопросы" },
];

export default function PartnerPage() {
  const [me, setMe] = useState<MeData | null>(null);
  const [auth, setAuth] = useState<"loading" | "in" | "out">("loading");
  const [view, setView] = useState("home");
  const [offerId, setOfferId] = useState<number | undefined>();

  const [viewMode] = useState(() => {
    const v = new URLSearchParams(window.location.search).get("view");
    if (v) {
      partnerSession.setView(v);
      window.history.replaceState(null, "", window.location.pathname);
    }
    return partnerSession.isView();
  });

  const load = useCallback(async () => {
    if (!partnerSession.get()) { setAuth("out"); return; }
    try { setMe(await partnerRequest<MeData>("me")); setAuth("in"); }
    catch (e) { if ((e as { status?: number }).status === 401) { partnerSession.clear(); setAuth("out"); } }
  }, []);
  useEffect(() => { load(); }, [load]);

  const go = (t: string, id?: number) => {
    setOfferId(id);
    setView(t === "offer-edit" || t === "offer-new" ? t : t);
    window.scrollTo({ top: 0 });
    if (t === "home" || t === "offers") load();
  };

  const logout = async () => {
    if (viewMode) { partnerSession.clearView(); window.close(); setMe(null); setAuth("out"); return; }
    await partnerRequest("logout", { method: "POST", body: {} }).catch(() => {});
    partnerSession.clear(); setMe(null); setAuth("out");
  };

  const head = <Helmet><title>Партнерский кабинет | Промт Диалог</title><meta name="robots" content="noindex, nofollow" /></Helmet>;
  if (auth === "loading") return <>{head}<Spinner /></>;
  if (auth === "out") return <>{head}<PartnerAuth onDone={() => { setAuth("loading"); load(); }} /></>;
  if (!me) return <Spinner />;

  const active = view.startsWith("offer") ? "offers" : view;
  return (
    <div style={{ minHeight: "100vh", background: "#F8FAFC", fontFamily: "Inter, sans-serif", color: DARK }}>
      {head}
      <header style={{ background: DARK, color: "#fff", padding: "14px 20px", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
        <Link to="/" style={{ color: "#fff", textDecoration: "none", fontFamily: "'Cormorant Garamond', serif", fontSize: 22 }}>
          Промт Диалог <span style={{ color: TEAL, fontSize: 13, fontFamily: "Inter, sans-serif", marginLeft: 8, letterSpacing: 1, textTransform: "uppercase" }}>Партнеры</span>
        </Link>
        <div style={{ display: "flex", alignItems: "center", gap: 14, fontSize: 13.5 }}>
          <span style={{ color: "rgba(255,255,255,0.7)" }}>{me.partner.business_name}</span>
          <button onClick={logout} style={{ background: "none", border: "1px solid rgba(255,255,255,0.25)", color: "#fff", borderRadius: 8, padding: "7px 14px", cursor: "pointer", fontSize: 13 }}>{viewMode ? "Закрыть" : "Выйти"}</button>
        </div>
      </header>
      {viewMode && (
        <div style={{ background: "#FEF3C7", borderBottom: "1px solid #FDE68A", color: "#78350F", padding: "10px 20px", fontSize: 13.5, fontWeight: 600, display: "flex", alignItems: "center", gap: 8 }}>
          <Icon name="Eye" size={16} />Режим просмотра: вы видите кабинет глазами партнера, изменения недоступны.
        </div>
      )}
      <nav style={{ background: "#fff", borderBottom: `1px solid ${LINE}`, padding: "0 12px", display: "flex", gap: 4, overflowX: "auto" }}>
        {NAV.map(n => (
          <button key={n.id} onClick={() => go(n.id)} style={{
            display: "flex", alignItems: "center", gap: 7, padding: "14px 14px", background: "none", border: "none", whiteSpace: "nowrap",
            borderBottom: `3px solid ${active === n.id ? TEAL_DARK : "transparent"}`, color: active === n.id ? DARK : GRAY,
            fontWeight: active === n.id ? 700 : 500, fontSize: 14, cursor: "pointer", fontFamily: "inherit",
          }}><Icon name={n.icon} size={16} />{n.label}</button>
        ))}
      </nav>
      {viewMode && <style>{`.partner-view input, .partner-view textarea, .partner-view select { pointer-events: none; background: #F8FAFC !important; }`}</style>}
      <main className={viewMode ? "partner-view" : undefined} style={{ maxWidth: 980, margin: "0 auto", padding: "24px 16px 60px" }}>
        {view === "home" && <PartnerHome me={me} go={go} />}
        {view === "offers" && <OffersList go={go} />}
        {view === "offer-new" && <OfferForm go={go} />}
        {view === "offer-edit" && <OfferForm key={offerId} id={offerId} go={go} />}
        {view === "promo" && <PartnerPromo me={me} reload={load} />}
        {view === "profile" && <PartnerProfile me={me} reload={load} />}
        {view === "faq" && <PartnerFaq />}
      </main>
    </div>
  );
}
