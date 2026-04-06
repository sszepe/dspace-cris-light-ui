import React from "react";
import { routes } from "../navigation/hash";
import { useAuth } from "../auth/AuthContext";
import type { NavTab } from "../profiles/profile-config";

type SubNavItem = { label: string; route: string; key: string; active?: boolean };
type Props = {
  activeRoute?: string;
  subNav?: SubNavItem[];
  onLogout?: () => void;
  /**
   * Whether to show the Quicklinks tab. Only used as a fallback when navTabs
   * is not provided (i.e. no profile is active yet).
   */
  showQuicklinks?: boolean;
  /**
   * Tab list from the active profile. When provided, these are rendered
   * directly — showQuicklinks and BASE_TABS are ignored.
   */
  navTabs?: NavTab[];
};

// Fallback tabs — used only when no profile navTabs are provided
const BASE_TABS: NavTab[] = [
  { label: "Dashboard",   route: routes.dashboard,   key: "dashboard" },
  { label: "Communities", route: routes.communities, key: "communities" },
  { label: "Workspace",   route: routes.workspace,   key: "workspace" },
  { label: "Search",      route: routes.search,      key: "search" },
];

const QUICKLINKS_TAB: NavTab = {
  label: "Quicklinks",
  route: routes.quicklinks,
  key: "quicklinks",
};

function initialsFromName(name?: string | null) {
  const parts = (name || "").trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "U";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0] ?? ""}${parts[1][0] ?? ""}`.toUpperCase();
}

function UserMenu({
  onLogout,
  active,
}: {
  onLogout?: () => void;
  active: boolean;
}) {
  const { username, eperson, isAdmin } = useAuth();
  const [open, setOpen] = React.useState(false);
  const ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node))
        setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const displayName = username || eperson?.name || "User";
  const email = eperson?.email || eperson?.name || "—";
  const initials = initialsFromName(displayName);

  const linkStyle: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    gap: 8,
    padding: "9px 14px",
    fontSize: 13,
    color: "#374151",
    textDecoration: "none",
    cursor: "pointer",
    background: "none",
    border: "none",
    width: "100%",
    textAlign: "left",
  };

  return (
    <div
      ref={ref}
      style={{ position: "relative", display: "flex", alignItems: "center" }}
    >
      <button
        onClick={() => setOpen((v) => !v)}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 7,
          background: "none",
          border: "none",
          cursor: "pointer",
          padding: "4px 8px",
          borderRadius: 6,
          outline: "none",
        }}
      >
        <div
          style={{
            width: 28,
            height: 28,
            borderRadius: "50%",
            background: "linear-gradient(135deg, #6366f1, #2563eb)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 12,
            fontWeight: 700,
            color: "#fff",
            flexShrink: 0,
            border: active ? "2px solid #fff" : "2px solid transparent",
          }}
        >
          {initials}
        </div>
        <span
          style={{
            fontSize: 13,
            fontWeight: 500,
            color: "#1b1b1b",
            maxWidth: 180,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {email}
        </span>
        <span style={{ fontSize: 10, color: "#4a5568" }}>▾</span>
      </button>

      {open && (
        <div
          style={{
            position: "absolute",
            top: "calc(100% + 6px)",
            right: 0,
            background: "#fff",
            border: "1px solid #e5e7eb",
            borderRadius: 8,
            boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
            minWidth: 220,
            zIndex: 1000,
            overflow: "hidden",
          }}
        >
          {/* User info */}
          <div style={{ padding: "12px 14px", borderBottom: "1px solid #f3f4f6" }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: "#111827", marginBottom: 1 }}>
              {displayName}
            </div>
            <div style={{ fontSize: 12, color: "#6b7280" }}>{email}</div>
            {isAdmin && (
              <div
                style={{
                  marginTop: 4,
                  fontSize: 11,
                  display: "inline-block",
                  padding: "1px 6px",
                  borderRadius: 999,
                  background: "#eef2ff",
                  color: "#4338ca",
                  fontWeight: 500,
                }}
              >
                Administrator
              </div>
            )}
          </div>

          {/* Menu items */}
          <a
            href={routes.profile}
            onClick={() => setOpen(false)}
            style={linkStyle as React.CSSProperties}
          >
            <span>👤</span> My Profile
          </a>

          {isAdmin && (
            <a
              href={routes.adminSettings}
              onClick={() => setOpen(false)}
              style={linkStyle as React.CSSProperties}
            >
              <span>⚙️</span> Admin Settings
            </a>
          )}

          {isAdmin && (
            <a
              href={routes.formBuilder}
              onClick={() => setOpen(false)}
              style={linkStyle as React.CSSProperties}
            >
              <span>🗂</span> Form Builder
            </a>
          )}

          <div style={{ height: 1, background: "#f3f4f6" }} />

          {onLogout && (
            <button
              onClick={() => {
                setOpen(false);
                onLogout();
              }}
              style={{
                ...(linkStyle as React.CSSProperties),
                color: "#dc2626",
              }}
            >
              <span>↩</span> Sign out
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export default function Nav({ activeRoute, subNav, onLogout, showQuicklinks, navTabs }: Props) {
  // If the profile provides navTabs, use them directly.
  // Otherwise fall back to the hardcoded BASE_TABS + quicklinks toggle.
  const tabs: NavTab[] = navTabs
    ? navTabs
    : showQuicklinks
      ? [BASE_TABS[0], BASE_TABS[1], QUICKLINKS_TAB, BASE_TABS[2], BASE_TABS[3]]
      : BASE_TABS;

  const isAdminRoute =
    activeRoute === "profile" ||
    activeRoute === "adminClusters" ||
    activeRoute === "adminSettings" ||
    activeRoute === "formBuilder";

  return (
    <nav className="multilevel-nav">
      <div className="nav-top">
        <div className="nav-top-items">
          {tabs.map((tab) => (
            <a
              key={tab.key}
              href={tab.route}
              className={
                "nav-top-tab" +
                (activeRoute === tab.key ? " nav-top-tab--active" : "")
              }
            >
              {tab.label}
            </a>
          ))}
        </div>
        <UserMenu onLogout={onLogout} active={isAdminRoute} />
      </div>

      {subNav && subNav.length > 0 && (
        <div className="nav-sub">
          {subNav.map((item) => (
            <a
              key={item.key}
              href={item.route}
              className={
                "nav-sub-item" + (item.active ? " nav-sub-item--active" : "")
              }
            >
              {item.label}
            </a>
          ))}
        </div>
      )}
    </nav>
  );
}
