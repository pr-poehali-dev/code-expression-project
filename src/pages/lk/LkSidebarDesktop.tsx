import { useLkAuth } from "@/contexts/LkAuthContext";
import Icon from "@/components/ui/icon";
import {
  Tab, NAV_ITEMS, ROLE_TABS, SALON_REQUIRED, getRoleLabel, TEAL_BRIGHT, ACCENT,
} from "./LkDashboardTypes";
import { usePodelamUnseen, useBlogUnseen, useRequestsCount, EnergyBadge } from "./LkSidebarShared";
import { markBlogSeen } from "./blogNotice";
import { InstallButtonSidebar } from "./LkPwaInstall";

// ── Боковой сайдбар ────────────────────────────────────────────────────────────
interface SidebarProps {
  tab: Tab;
  hasSalon: boolean;
  role: string;
  onNav: (t: string) => void;
  onLogout: () => void;
}

export function LkSidebar({ tab, hasSalon, role, onNav, onLogout }: SidebarProps) {
  const { user } = useLkAuth();
  const requestsCount = useRequestsCount(role);
  const podelamUnseen = usePodelamUnseen();
  const [blogUnseen, blogLatestDate] = useBlogUnseen();
  const allowedNav = NAV_ITEMS.filter(n => {
    const allowed: Tab[] = user?.is_admin
      ? [...(ROLE_TABS["owner"] as Tab[]), "admin" as Tab]
      : (ROLE_TABS[role] || ROLE_TABS["body_specialist"]);
    return allowed.includes(n.id);
  });

  return (
    <aside className="lk-sidebar">
      {/* Логотип */}
      <div style={{ padding: "0 24px 20px", borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
        <a href="https://promtdialog.ru/" target="_blank" rel="noopener noreferrer" style={{ display: "flex", alignItems: "center", gap: 12, textDecoration: "none" }}>
          <div style={{ width: 38, height: 38, borderRadius: 10, background: `linear-gradient(135deg,${TEAL_BRIGHT},#14B8A6)`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, boxShadow: "0 4px 16px rgba(45,212,191,0.3)" }}>
            <Icon name="MessageSquare" size={18} style={{ color: "#0F172A" }} />
          </div>
          <div>
            <div style={{ fontSize: 14, fontWeight: 700, color: "#fff", lineHeight: 1.2 }}>Про Диалог</div>
            <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", letterSpacing: 0.5 }}>Личный кабинет</div>
          </div>
        </a>
      </div>

      {/* Профиль салона */}
      {user?.salon && (
        <div
          onClick={() => onNav("salon")}
          style={{ margin: "12px 12px 0", padding: "10px 12px", borderRadius: 10, background: tab === "salon" ? "rgba(45,212,191,0.12)" : "rgba(255,255,255,0.04)", cursor: "pointer", display: "flex", alignItems: "center", gap: 10, border: `1px solid ${tab === "salon" ? "rgba(45,212,191,0.3)" : "rgba(255,255,255,0.08)"}` }}
        >
          {user.salon.logo_url
            ? <img src={user.salon.logo_url} alt="" style={{ width: 28, height: 28, borderRadius: 7, objectFit: "cover" }} />
            : <div style={{ width: 28, height: 28, borderRadius: 7, background: "rgba(45,212,191,0.15)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Icon name="Building2" size={14} style={{ color: TEAL_BRIGHT }} />
              </div>
          }
          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: "#fff", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{user.salon.name}</div>
            <div style={{ fontSize: 10, color: "rgba(255,255,255,0.4)" }}>{getRoleLabel(role, user?.specialization)}</div>
          </div>
        </div>
      )}

      {/* Навигация */}
      <nav style={{ flex: 1, padding: "10px 12px", overflowY: "auto" }}>
        {allowedNav.map(item => {
          const locked = !hasSalon && role !== "solo_master" && SALON_REQUIRED.includes(item.id);
          const active = tab === item.id;
          const highlight = !!item.highlight && !active;
          const itemStyle = {
            width: "100%", display: "flex", alignItems: "center", gap: 11,
            padding: "10px 12px", borderRadius: 10,
            border: active ? "1px solid rgba(45,212,191,0.25)" : highlight ? "1px solid rgba(45,212,191,0.2)" : "1px solid transparent",
            background: active ? "rgba(45,212,191,0.12)" : highlight ? "rgba(45,212,191,0.06)" : "transparent",
            color: locked ? "rgba(255,255,255,0.25)" : active || highlight ? TEAL_BRIGHT : "rgba(255,255,255,0.6)",
            fontSize: 13, fontWeight: active || highlight ? 700 : 500,
            cursor: "pointer", fontFamily: "Montserrat, sans-serif",
            marginBottom: 2, transition: "all 0.15s", textAlign: "left" as const,
            opacity: locked ? 0.7 : 1, textDecoration: "none",
          };
          const showBlogDot = item.id === "blog" && blogUnseen;
          const content = (
            <>
              <span style={{ position: "relative", display: "inline-flex" }}>
                <Icon name={item.icon} size={17} />
                {((item.id === "home" && podelamUnseen && !locked) || showBlogDot) && (
                  <span style={{ position: "absolute", top: -2, right: -2, width: 8, height: 8, borderRadius: "50%", background: "hsl(0,80%,60%)", border: "1.5px solid #0F172A" }} />
                )}
              </span>
              <span style={{ flex: 1 }}>{item.label}</span>
              {locked
                ? <Icon name="Lock" size={12} style={{ color: "rgba(255,255,255,0.25)" }} />
                : item.id === "employees" && requestsCount > 0
                  ? <span style={{ fontSize: 10, fontWeight: 700, background: "hsl(0,80%,60%)", color: "#fff", borderRadius: 10, padding: "1px 7px", minWidth: 18, textAlign: "center" }}>{requestsCount}</span>
                  : item.id === "home" && podelamUnseen
                    ? <span style={{ fontSize: 9, fontWeight: 700, color: "hsl(0,80%,65%)" }}>Новое</span>
                    : showBlogDot
                      ? <span style={{ fontSize: 9, fontWeight: 700, color: "hsl(0,80%,65%)" }}>Новое</span>
                      : null
              }
            </>
          );
          if (item.external) {
            return (
              <a key={item.id} href={item.external} style={itemStyle}
                onClick={() => { if (item.id === "blog") markBlogSeen(blogLatestDate); }}
                onMouseEnter={e => (e.currentTarget as HTMLAnchorElement).style.background = "rgba(255,255,255,0.05)"}
                onMouseLeave={e => (e.currentTarget as HTMLAnchorElement).style.background = "transparent"}
              >
                {content}
              </a>
            );
          }
          return (
            <button key={item.id} onClick={() => onNav(item.id)} style={itemStyle}
            onMouseEnter={e => { if (!active && !locked) (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.05)"; }}
            onMouseLeave={e => { if (!active) (e.currentTarget as HTMLButtonElement).style.background = highlight ? "rgba(45,212,191,0.06)" : "transparent"; }}
            >
              {content}
            </button>
          );
        })}
      </nav>

      {/* Баланс энергии + кнопка установки */}
      <div style={{ padding: "0 12px 10px", display: "flex", flexDirection: "column", gap: 8 }}>
        {user?.salon_id && <EnergyBadge onNav={onNav} sidebar />}
        <InstallButtonSidebar />
      </div>

      {/* Пользователь */}
      <div style={{ padding: "14px 24px", borderTop: "1px solid rgba(255,255,255,0.07)" }}>
        <div style={{ fontSize: 12, fontWeight: 600, color: "#fff", marginBottom: 1 }}>{user?.full_name || user?.username}</div>
        <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", marginBottom: 8 }}>{user?.email}</div>
        {user?.access_expires_at && (() => {
          const daysLeft = Math.ceil((new Date(user.access_expires_at).getTime() - Date.now()) / 86400000);
          const expired  = daysLeft <= 0;
          return (
            <div style={{ fontSize: 11, fontWeight: 600, marginBottom: 8, padding: "5px 9px", borderRadius: 7, background: expired ? "#fff0f0" : daysLeft <= 30 ? "hsl(40,100%,95%)" : "hsl(185,85%,95%)", color: expired ? "#e55" : daysLeft <= 30 ? "hsl(40,85%,40%)" : ACCENT, display: "flex", alignItems: "center", gap: 5 }}>
              <Icon name={expired ? "AlertCircle" : "Clock"} size={11} />
              {expired ? "Доступ истёк" : daysLeft === 1 ? "Последний день" : `Доступ: ${daysLeft} дн.`}
            </div>
          );
        })()}
        <button onClick={onLogout} style={{ display: "flex", alignItems: "center", gap: 7, background: "none", border: "none", color: "rgba(255,255,255,0.4)", fontSize: 12, cursor: "pointer", padding: 0, fontFamily: "Montserrat, sans-serif" }}>
          <Icon name="LogOut" size={13} />
          Выйти
        </button>
      </div>
    </aside>
  );
}