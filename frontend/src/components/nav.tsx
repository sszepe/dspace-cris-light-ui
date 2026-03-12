import React from "react";
import { routes } from "../navigation/hash";
import type { EPerson } from "../auth/client";

type TopTab = {
  label: string;
  route: string;
  key: string;
};

type SubNavItem = {
  label: string;
  route: string;
  key: string;
  active?: boolean;
};

type Props = {
  activeRoute?: string;
  subNav?: SubNavItem[];
  onLogout?: () => void;
  eperson?: EPerson | null;
};

const TOP_TABS: TopTab[] = [
  { label: "Dashboard", route: routes.dashboard, key: "dashboard" },
  { label: "Communities", route: routes.communities, key: "communities" },
  { label: "Workspace", route: routes.workspace, key: "workspace" },
  { label: "Search", route: routes.search, key: "search" },
];

function UserMenu({
  eperson,
  onLogout,
  active,
}: {
  eperson?: EPerson | null;
  onLogout?: () => void;
  active: boolean;
}) {
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

  const displayName = eperson?.name ?? eperson?.email ?? "Account";
  const initial = displayName[0]?.toUpperCase() ?? "?";

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
        onMouseEnter={(e) =>
          (e.currentTarget.style.background = "rgba(255,255,255,0.12)")
        }
        onMouseLeave={(e) => (e.currentTarget.style.background = "none")}
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
          {initial}
        </div>
        <span
          style={{
            fontSize: 13,
            fontWeight: 500,
            color: "#e5e7eb",
            maxWidth: 140,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {eperson?.email ?? "Account"}
        </span>
        <span style={{ fontSize: 10, color: "#9ca3af" }}>▾</span>
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
            minWidth: 200,
            zIndex: 100,
            overflow: "hidden",
          }}
        >
          <div
            style={{ padding: "12px 14px", borderBottom: "1px solid #f3f4f6" }}
          >
            <div
              style={{
                fontSize: 13,
                fontWeight: 600,
                color: "#111827",
                marginBottom: 1,
              }}
            >
              {displayName}
            </div>
            {eperson?.email && eperson.email !== displayName && (
              <div style={{ fontSize: 12, color: "#6b7280" }}>
                {eperson.email}
              </div>
            )}
          </div>
          <a
            href={routes.profile}
            onClick={() => setOpen(false)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              padding: "9px 14px",
              fontSize: 13,
              color: "#374151",
              textDecoration: "none",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "#f9fafb")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "")}
          >
            <span>👤</span> My Profile
          </a>
          <div style={{ height: 1, background: "#f3f4f6" }} />
          {onLogout && (
            <button
              onClick={() => {
                setOpen(false);
                onLogout();
              }}
              style={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                gap: 8,
                padding: "9px 14px",
                fontSize: 13,
                color: "#dc2626",
                background: "none",
                border: "none",
                cursor: "pointer",
                textAlign: "left",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.background = "#fff1f0")
              }
              onMouseLeave={(e) => (e.currentTarget.style.background = "")}
            >
              <span>↩</span> Sign out
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export default function Nav({ activeRoute, subNav, onLogout, eperson }: Props) {
  return (
    <nav className="multilevel-nav">
      <div className="nav-top">
        <div className="nav-top-items">
          {TOP_TABS.map((tab) => (
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
        <UserMenu
          eperson={eperson}
          onLogout={onLogout}
          active={activeRoute === "profile"}
        />
      </div>
      {subNav && subNav.length > 0 && (
        <div className="nav-sub">
          {subNav.map((item) => (
            <a key={item.key} href={item.route} className="nav-sub-item">
              {item.label}
            </a>
          ))}
        </div>
      )}
    </nav>
  );
}
