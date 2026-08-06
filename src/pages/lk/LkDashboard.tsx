import { useState, useCallback, useEffect } from "react";
import { useLkAuth } from "@/contexts/LkAuthContext";
import LkTests from "./LkTests";
import LkBodyMap from "./LkBodyMap";
import LkAdmin from "./LkAdmin";
import LkSalonProfile from "./LkSalonProfile";
import LkAiTools from "./LkAiTools";
import LkTeam from "./LkTeam";
import LkEnergy from "./LkEnergy";
import LkProfile from "./LkProfile";
import LkSupport from "./LkSupport";
import LkAcademy from "./LkAcademy";
import LkMemberAcademy from "./LkMemberAcademy";
import LkClientMsg from "./LkClientMsg";
import LkMarketing from "./LkMarketing";
import { PodelamTab } from "./LkPodelam";
import LkChampionship from "./LkChampionship";
import { LkSidebar, LkMobileHeader, LkBottomBar, PodelamReminderBanner } from "./LkDashboardSidebar";
import { isFittingTrial } from "@/lib/fittingTrial";
import {
  Tab, BG, NAV_ITEMS, MOBILE_PRIMARY, SALON_REQUIRED,
  getAllowedTabs,
} from "./LkDashboardTypes";

export default function LkDashboard() {
  const { user, logout } = useLkAuth();
  const role       = user?.is_admin ? "owner" : (user?.role || "body_specialist");
  const hasSalon   = !!user?.salon_id;
  const allowedTabs = getAllowedTabs(role, !!user?.is_admin);
  const fittingTrial = isFittingTrial();

  const getInitialTab = (): Tab => {
    if (role === "owner" && !hasSalon) return "salon";
    if (fittingTrial && allowedTabs.includes("marketing")) return "marketing";
    const saved = sessionStorage.getItem("lk_tab") as Tab | null;
    const needsSalon: Tab[] = role === "solo_master" ? [] : ["ai", "shop", "employees"];
    if (saved && allowedTabs.includes(saved)) {
      if (needsSalon.includes(saved) && !hasSalon) return "salon";
      return saved;
    }
    // «ПоДелам» — навигатор дохода, стартовая точка для всех ролей
    return "home";
  };

  const [tab, setTab]           = useState<Tab>(getInitialTab);
  const [moreOpen, setMoreOpen] = useState(false);
  const [marketingTool, setMarketingTool] = useState<string | undefined>(fittingTrial ? "photo-fitting" : undefined);

  // Фикс для Chrome/Android: браузерная строка занимает место и скрывает bottom nav
  useEffect(() => {
    const setVh = () => {
      document.documentElement.style.setProperty("--vh", `${window.innerHeight * 0.01}px`);
    };
    setVh();
    window.addEventListener("resize", setVh);
    return () => window.removeEventListener("resize", setVh);
  }, []);

  const handleTabChange = useCallback((t: string) => {
    // Поддержка составных команд вида "marketing:seo"
    const [base, tool] = t.split(":") as [Tab, string?];
    if (!allowedTabs.includes(base)) return;
    if (!hasSalon && role !== "solo_master" && SALON_REQUIRED.includes(base)) {
      setMoreOpen(false);
      sessionStorage.setItem("lk_tab", "salon");
      setTab("salon");
      return;
    }
    if (tool) setMarketingTool(tool);
    else setMarketingTool(undefined);
    setMoreOpen(false);
    sessionStorage.setItem("lk_tab", base);
    setTab(base);
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [allowedTabs, hasSalon, role]);

  const visibleNav    = NAV_ITEMS.filter(n => allowedTabs.includes(n.id));
  const mobilePrimary = (MOBILE_PRIMARY[role] || MOBILE_PRIMARY["body_specialist"])
    .filter(id => allowedTabs.includes(id));
  const moreItems  = visibleNav.filter(n => !mobilePrimary.includes(n.id));
  const mobileNav  = NAV_ITEMS.filter(n => mobilePrimary.includes(n.id));

  return (
    <div style={{ minHeight: "100vh", background: BG, fontFamily: "Montserrat, sans-serif" }} className="lk-root">

      <LkSidebar
        tab={tab}
        hasSalon={hasSalon}
        role={role}
        onNav={handleTabChange}
        onLogout={logout}
      />

      <LkMobileHeader
        hasSalonId={!!user?.salon_id}
        onNav={handleTabChange}
        onLogout={logout}
      />

      {tab !== "home" && <PodelamReminderBanner onNav={handleTabChange} />}

      <main className="lk-main">
        {tab === "home"      && <PodelamTab onNav={handleTabChange} />}
        {tab === "tools"     && <LkTests onNavigate={handleTabChange} />}
        {tab === "academy"   && (
          role === "owner" ? <LkAcademy onNavigate={handleTabChange} />
          : role === "solo_master" ? <LkAcademy onNavigate={handleTabChange} excludeCategories={["owner", "admin"]} />
          : <LkMemberAcademy onNavigate={handleTabChange} />
        )}
        {tab === "ai"        && <LkAiTools />}
        {tab === "clientmsg"  && <LkClientMsg />}
        {tab === "marketing"  && <LkMarketing initialTool={marketingTool} />}
        {tab === "shop"       && <LkEnergy />}
        {tab === "employees" && <LkTeam />}
        {tab === "purchases" && <LkEnergy />}
        {tab === "salon"     && <LkSalonProfile onSaved={() => handleTabChange("home")} onGoToSeo={() => handleTabChange("marketing")} />}
        {tab === "profile"   && <LkProfile />}
        {tab === "support"   && <LkSupport />}
        {tab === "body"      && <LkBodyMap />}
        {tab === "championship" && <LkChampionship />}
        {user?.is_admin && tab === "admin" && <LkAdmin />}
      </main>

      <LkBottomBar
        tab={tab}
        hasSalon={hasSalon}
        mobileNav={mobileNav}
        moreItems={moreItems}
        moreOpen={moreOpen}
        setMoreOpen={setMoreOpen}
        onNav={handleTabChange}
      />

      <style>{`
        .lk-root { display: flex; }
        .lk-sidebar { width: 248px; background: radial-gradient(120% 80% at 30% 0%, #112B3C 0%, #0F172A 55%, #060B16 100%); border-right: 1px solid rgba(255,255,255,0.06); display: flex; flex-direction: column; position: fixed; top: 0; left: 0; height: 100vh; z-index: 100; padding: 24px 0 0; }
        .lk-main { margin-left: 248px; flex: 1; padding: 40px 44px; min-height: 100vh; }
        .lk-mobile-header { display: none; }
        .lk-bottombar { display: none; }
        @media (max-width: 768px) {
          .lk-root { flex-direction: column; }
          .lk-sidebar { display: none; }
          .lk-mobile-header { display: flex; align-items: center; justify-content: space-between; position: fixed; top: 0; left: 0; right: 0; height: 52px; background: #0F172A; border-bottom: 1px solid rgba(255,255,255,0.06); padding: 0 16px; z-index: 100; }
          .lk-main { margin-left: 0; padding: 66px 16px 90px; }
          .lk-bottombar { display: flex; position: fixed; bottom: 0; left: 0; right: 0; background: #0F172A; border-top: 1px solid rgba(255,255,255,0.06); z-index: 9999; padding-bottom: max(env(safe-area-inset-bottom, 0px), 4px); min-height: 56px; transform: translate3d(0,0,0); -webkit-transform: translate3d(0,0,0); will-change: transform; }
          @supports (height: 100dvh) { .lk-root { min-height: 100dvh; } }
        }
      `}</style>
    </div>
  );
}