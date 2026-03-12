import React from "react";
import { Header } from "./header";
import { Footer } from "./footer";
import Nav from "./nav";
import type { EPerson } from "../auth/client";

type Props = {
  children: React.ReactNode;
  activeRoute?: string;
  onLogout?: () => void;
  eperson?: EPerson | null;
  /** Pass sub-nav items when a section has secondary navigation */
  subNav?: { label: string; route: string; key: string; active?: boolean }[];
};

/**
 * AppLayout — full-page shell: header → nav → main → footer.
 * Used for all authenticated pages.
 */
export function AppLayout({ children, activeRoute, onLogout, subNav, eperson }: Props) {
  return (
    <div className="app-shell">
      <Header />
      <Nav
        activeRoute={activeRoute}
        subNav={subNav}
        onLogout={onLogout}
        eperson={eperson}
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