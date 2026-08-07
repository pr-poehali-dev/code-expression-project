import { useLkAuth } from "@/contexts/LkAuthContext";
import Icon from "@/components/ui/icon";
import {
  Tab, NAV_ITEMS, SALON_REQUIRED, TEAL_BRIGHT, ACCENT,
} from "./LkDashboardTypes";
import { usePodelamUnseen, useBlogUnseen, useRequestsCount, EnergyBadge } from "./LkSidebarShared";
import { markBlogSeen } from "./blogNotice";
import { InstallButtonMobile } from "./LkPwaInstall";

// ── Мобильный хедер ────────────────────────────────────────────────────────────
interface MobileHeaderProps {
  hasSalonId: boolean;
  onNav: (t: string) => void;
  onLogout: () => void;
}

export function LkMobileHeader({ hasSalonId, onNav, onLogout }: MobileHeaderProps) {
  return (
    <header className="lk-mobile-header">
      <a href="https://promtdialog.ru/" target="_blank" rel="noopener noreferrer" style={{ display: "flex", alignItems: "center", gap: 8, textDecoration: "none" }}>
        <div style={{ width: 30, height: 30, borderRadius: 8, background: `linear-gradient(135deg,${TEAL_BRIGHT},#14B8A6)`, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Icon name="MessageSquare" size={15} style={{ color: "#0F172A" }} />
        </div>
        <div style={{ fontSize: 13, fontWeight: 700, color: "#fff" }}>Промт Диалог</div>
      </a>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        {hasSalonId && <EnergyBadge onNav={onNav} />}
        <InstallButtonMobile />
        <button onClick={onLogout} style={{ display: "flex", alignItems: "center", gap: 5, background: "none", border: "1.5px solid rgba(255,255,255,0.15)", borderRadius: 8, color: "rgba(255,255,255,0.6)", fontSize: 12, cursor: "pointer", padding: "5px 10px", fontFamily: "Montserrat, sans-serif" }}>
          <Icon name="LogOut" size={12} />
          Выйти
        </button>
      </div>
    </header>
  );
}

// ── Мобильный боттомбар + шторка «Ещё» ────────────────────────────────────────
interface BottomBarProps {
  tab: Tab;
  hasSalon: boolean;
  mobileNav: typeof NAV_ITEMS;
  moreItems: typeof NAV_ITEMS;
  moreOpen: boolean;
  setMoreOpen: (v: boolean | ((p: boolean) => boolean)) => void;
  onNav: (t: string) => void;
}

export function LkBottomBar({ tab, hasSalon, mobileNav, moreItems, moreOpen, setMoreOpen, onNav }: BottomBarProps) {
  const { user } = useLkAuth();
  const role = user?.is_admin ? "owner" : (user?.role || "body_specialist");
  const requestsCount = useRequestsCount(role);
  const podelamUnseen = usePodelamUnseen();
  const [blogUnseen, blogLatestDate] = useBlogUnseen();

  return (
    <>
      <nav className="lk-bottombar">
        {mobileNav.map(item => {
          const locked = !hasSalon && role !== "solo_master" && SALON_REQUIRED.includes(item.id);
          const showBadge = item.id === "employees" && requestsCount > 0;
          const showPodelamDot = item.id === "home" && podelamUnseen && !locked;
          const showBlogDot = item.id === "blog" && blogUnseen;
          const itemStyle = {
            flex: 1, display: "flex", flexDirection: "column" as const, alignItems: "center",
            justifyContent: "center", gap: 3, border: "none", background: "none",
            color: locked ? "rgba(255,255,255,0.2)" : tab === item.id ? TEAL_BRIGHT : "rgba(255,255,255,0.5)",
            fontSize: 9, fontWeight: tab === item.id ? 700 : 500,
            cursor: "pointer", fontFamily: "Montserrat, sans-serif", padding: "7px 2px",
            position: "relative" as const, textDecoration: "none",
          };
          const content = (
            <>
              <div style={{ position: "relative" }}>
                <Icon name={item.icon} size={20} />
                {showBadge && (
                  <span style={{ position: "absolute", top: -4, right: -6, fontSize: 9, fontWeight: 700, background: "hsl(0,80%,60%)", color: "#fff", borderRadius: 8, padding: "1px 5px", minWidth: 14, textAlign: "center", lineHeight: "14px" }}>
                    {requestsCount}
                  </span>
                )}
                {(showPodelamDot || showBlogDot) && (
                  <span style={{ position: "absolute", top: -2, right: -3, width: 7, height: 7, borderRadius: "50%", background: "hsl(0,80%,60%)", border: "1.5px solid #0F172A" }} />
                )}
              </div>
              {locked && <Icon name="Lock" size={9} style={{ position: "absolute", top: 5, right: "calc(50% - 14px)", color: "rgba(255,255,255,0.3)" }} />}
              {item.label}
            </>
          );
          if (item.external) {
            return (
              <a key={item.id} href={item.external} style={itemStyle}
                onClick={() => { if (item.id === "blog") markBlogSeen(blogLatestDate); }}
              >
                {content}
              </a>
            );
          }
          return (
            <button key={item.id} onClick={() => onNav(item.id)} style={itemStyle}>
              {content}
            </button>
          );
        })}
        {moreItems.length > 0 && (
          <button onClick={() => setMoreOpen(p => !p)} style={{
            flex: 1, display: "flex", flexDirection: "column", alignItems: "center",
            justifyContent: "center", gap: 3, border: "none", background: "none",
            color: moreOpen ? TEAL_BRIGHT : "rgba(255,255,255,0.5)",
            fontSize: 9, fontWeight: moreOpen ? 700 : 500,
            cursor: "pointer", fontFamily: "Montserrat, sans-serif", padding: "7px 2px",
          }}>
            <Icon name="MoreHorizontal" size={20} />
            Ещё
          </button>
        )}
      </nav>

      {/* Шторка «Ещё» */}
      {moreOpen && (
        <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 200 }} onClick={() => setMoreOpen(false)}>
          <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.35)" }} />
          <div onClick={e => e.stopPropagation()} style={{ position: "absolute", bottom: 0, left: 0, right: 0, background: "#fff", borderRadius: "20px 20px 0 0", padding: "8px 0 calc(72px + env(safe-area-inset-bottom,0px))", boxShadow: "0 -4px 24px rgba(0,0,0,0.12)" }}>
            <div style={{ width: 36, height: 4, borderRadius: 2, background: "#e0e0e0", margin: "0 auto 16px" }} />
            {moreItems.map(item => {
              const locked = !hasSalon && role !== "solo_master" && SALON_REQUIRED.includes(item.id);
              const showBadge = item.id === "employees" && requestsCount > 0;
              const showBlogDotMore = item.id === "blog" && blogUnseen;
              const itemStyle = {
                width: "100%", display: "flex", alignItems: "center", gap: 14,
                padding: "14px 24px", border: "none", background: tab === item.id ? `hsla(185,85%,32%,0.06)` : "none",
                cursor: "pointer", fontFamily: "Montserrat, sans-serif", textAlign: "left" as const,
                opacity: locked ? 0.5 : 1, textDecoration: "none",
              };
              const content = (
                <>
                  <div style={{ width: 36, height: 36, borderRadius: 10, background: tab === item.id ? `hsla(185,85%,32%,0.1)` : "#f5f5f2", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, position: "relative" }}>
                    <Icon name={locked ? "Lock" : item.icon} size={18} style={{ color: tab === item.id ? ACCENT : "#888" }} />
                    {showBadge && <span style={{ position: "absolute", top: -4, right: -4, fontSize: 9, fontWeight: 700, background: "hsl(0,80%,60%)", color: "#fff", borderRadius: 8, padding: "1px 5px", minWidth: 14, textAlign: "center", lineHeight: "14px" }}>{requestsCount}</span>}
                    {showBlogDotMore && <span style={{ position: "absolute", top: -2, right: -2, width: 8, height: 8, borderRadius: "50%", background: "hsl(0,80%,60%)", border: "1.5px solid #fff" }} />}
                  </div>
                  <span style={{ fontSize: 14, fontWeight: tab === item.id ? 700 : 500, color: tab === item.id ? ACCENT : "#1a1a1a" }}>{item.label}</span>
                  {!locked && showBadge && <span style={{ fontSize: 11, fontWeight: 700, background: "hsl(0,80%,60%)", color: "#fff", borderRadius: 6, padding: "2px 8px", marginLeft: "auto" }}>{requestsCount} запроса</span>}
                  {!locked && showBlogDotMore && <span style={{ fontSize: 11, fontWeight: 700, color: "hsl(0,80%,55%)", marginLeft: "auto" }}>Новое</span>}
                  {locked && <span style={{ fontSize: 11, color: "#bbb", marginLeft: "auto" }}>Нужен салон</span>}
                </>
              );
              if (item.external) {
                return (
                  <a key={item.id} href={item.external} style={itemStyle}
                    onClick={() => { if (item.id === "blog") markBlogSeen(blogLatestDate); }}
                  >
                    {content}
                  </a>
                );
              }
              return (
                <button key={item.id} onClick={() => onNav(item.id)} style={itemStyle}>
                  {content}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </>
  );
}