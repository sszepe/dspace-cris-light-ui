import React from "react";
import { Header } from "./header";
import { Footer } from "./footer";
import Nav from "./nav";
import type { NavTab } from "../profiles/profile-config";

type AppLayoutProps = {
  children: React.ReactNode;
  activeRoute?: string;
  onLogout?: () => void;
  subNav?: { label: string; route: string; key: string; active?: boolean }[];
  /**
   * Whether the Quicklinks tab should be shown.
   * Kept for backwards-compat; ignored when navTabs is provided since the
   * profile controls tab visibility directly via navTabs.
   */
  showQuicklinks?: boolean;
  /**
   * Top-level nav tabs from the active profile.
   * When provided, Nav renders these instead of its hardcoded BASE_TABS.
   */
  navTabs?: NavTab[];
  /** App title from the active profile, displayed in the Header. */
  appName?: string;
};

/**
 * AppLayout — full-page shell: header → nav → main → footer.
 * Used for all authenticated pages.
 */
export function AppLayout({
  children,
  activeRoute,
  onLogout,
  subNav,
  showQuicklinks,
  navTabs,
  appName,
}: AppLayoutProps) {
  return (
    <div className="app-shell">
      <Header appName={appName} />
      <Nav
        activeRoute={activeRoute}
        subNav={subNav}
        onLogout={onLogout}
        showQuicklinks={showQuicklinks}
        navTabs={navTabs}
      />
      <main className="app-main">{children}</main>
      <Footer />
    </div>
  );
}

/**
 * Legacy bare layout (no nav) — standalone use.
 */
export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="app-shell">
      <div className="app-container">
        <Header />
        <main className="app-main">{children}</main>
        <Footer />
      </div>
    </div>
  );
}
