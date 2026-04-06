import React from "react";
import { Layout, AppLayout } from "./components/layout";
import { Dashboard } from "./pages/dashboard";
import { LoginPage } from "./pages/login";
import { CommunitiesPage } from "./pages/communities";
import { WorkspaceListPage } from "./pages/workspace-list";
import { ItemListPage } from "./pages/item-list";
import { ItemDetailPage } from "./pages/item-detail";
import { SearchPage } from "./pages/search-page";
import { ProfilePage } from "./pages/profile-page";
import { AdminClustersPage } from "./pages/admin-clusters";
import { AdminSettingsPage } from "./pages/admin-settings";
import { QuicklinksPage } from "./pages/quicklinks-page";
import { AuthProvider, useAuth } from "./auth/AuthContext";
import { FormBuilderPage } from "./pages/form-builder";
import { parseHash, routes, type Route } from "./navigation/hash";
import {
  isQuicklinksEnabled,
  isQuicklinksAdminOnly,
  getQuicklinksConfigSource,
  fetchSiteSettings,
} from "./config/quicklinks-config";
import {
  isCommunitiesCreationEnabled,
  isCommunitiesRoleManagementEnabled,
  isCollectionsCreationEnabled,
  getCommunitiesConfigSource,
} from "./config/communities-config";

import "./styles/theme.css";
import "./styles/multilevel-nav.css";
import "./styles/nav-additions.css";
import "./styles/app-shell.css";
import "./styles/dashboard.css";
import "./styles/login.css";
import "./styles/error-banner.css";
import {
  isEndUserAgreementEnabled,
  hasAcceptedAgreement,
  EndUserAgreementModal,
} from "./components/end-user-agreement-modal";


const WORKSPACE_SUBNAV = [
  { key: "mine", label: "My Submissions", route: routes.workspaceMine },
  { key: "others", label: "Submissions by Others", route: routes.workspaceOthers },
];

function AppInner() {
  const { isAuthenticated, isLoading, isAdmin, login, logout, eperson, epersonId } = useAuth();
  const [route, setRoute] = React.useState<Route>(() => parseHash());

  // ── End-user agreement gate ──────────────────────────────────────────────
  const [touAccepted, setTouAccepted] = React.useState(false);

  // Recheck whenever eperson loads/changes
  React.useEffect(() => {
    if (!isEndUserAgreementEnabled()) {
      setTouAccepted(true);
      return;
    }
    if (!isAuthenticated || !eperson) {
      setTouAccepted(false);
      return;
    }
    setTouAccepted(hasAcceptedAgreement(eperson.metadata));
  }, [isAuthenticated, eperson]);

  // ── Runtime Quicklinks toggle (django mode only) ───────────────────────────
  const [runtimeQuicklinks, setRuntimeQuicklinks] = React.useState(true);

  // ── Runtime Communities flags (django mode only) ──────────────────────────
  const [runtimeCommunitiesCreation,       setRuntimeCommunitiesCreation]       = React.useState(true);
  const [runtimeCommunitiesRoleManagement, setRuntimeCommunitiesRoleManagement] = React.useState(true);
  const [runtimeCollectionsCreation,       setRuntimeCollectionsCreation]       = React.useState(true);

  React.useEffect(() => {
    if (!isAuthenticated) return;
    // Both Quicklinks and Communities flags come from the same SiteSettings
    // endpoint. Fetch once when either source is django mode.
    const needsDjango =
      getQuicklinksConfigSource() === "django" ||
      getCommunitiesConfigSource() === "django";
    if (!needsDjango) return;

    fetchSiteSettings()
      .then((s) => {
        setRuntimeQuicklinks(s.quicklinks_enabled);
        setRuntimeCommunitiesCreation(s.communities_creation_enabled);
        setRuntimeCommunitiesRoleManagement(s.communities_role_management_enabled);
        setRuntimeCollectionsCreation(s.collections_creation_enabled);
      })
      .catch(() => {}); // fail open — keeps defaults (true) on error
  }, [isAuthenticated]);

  React.useEffect(() => {
    const onHash = () => setRoute(parseHash());
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  // After login completes the hash is still #/login — nothing renders because
  // no route.name branch matches "login" in the authenticated layout.
  // Redirect to dashboard so the content area is populated immediately.
  React.useEffect(() => {
    if (isAuthenticated && route.name === "login") {
      window.location.hash = routes.dashboard;
    }
  }, [isAuthenticated, route.name]);

  const handleLogout = React.useCallback(async () => {
    await logout();
    window.location.hash = routes.login;
  }, [logout]);

  const goItem = (uuid: string) => {
    window.location.hash = routes.item(uuid);
  };
  const goWorkspaceItem = (wsId: number) => {
    window.location.hash = routes.workspaceitem(wsId);
  };
  const goCollection = (id: string) => {
    window.location.hash = routes.collection(id);
  };
  const goBack = () => {
    window.history.back();
  };

  // Three gates must all pass for quicklinks:
  //   1. VITE_QUICKLINKS_ENABLED=true          (build-time, env)
  //   2. role check via VITE_QUICKLINKS_ADMIN_ONLY (build-time, env)
  //   3. SiteSettings.quicklinks_enabled=true  (runtime, django mode only)
  const quicklinksAccessible =
    isQuicklinksEnabled() &&
    runtimeQuicklinks &&
    (!isQuicklinksAdminOnly() || isAdmin);

  // Two-gate check for each communities feature:
  //   1. .env build-time flag
  //   2. SiteSettings DB field (runtime, django mode only)
  // Both are admin-only regardless — non-admins never see the controls.
  const canCreateCommunities =
    isAdmin &&
    isCommunitiesCreationEnabled() &&
    runtimeCommunitiesCreation;

  const canManageCommunityRoles =
    isAdmin &&
    isCommunitiesRoleManagementEnabled() &&
    runtimeCommunitiesRoleManagement;

  const canCreateCollections =
    isAdmin &&
    isCollectionsCreationEnabled() &&
    runtimeCollectionsCreation;

  if (isLoading) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "100vh",
          color: "#888",
        }}
      >
        Loading…
      </div>
    );
  }

  // Show ToU modal if feature enabled and user hasn't accepted yet
  if (isEndUserAgreementEnabled() && isAuthenticated && !touAccepted && epersonId) {
    return (
      <EndUserAgreementModal
        epersonId={epersonId}
        onAccepted={() => setTouAccepted(true)}
      />
    );
  }

  if (!isAuthenticated) {
    return (
      <Layout>
        <LoginPage onLogin={login} />
      </Layout>
    );
  }

  const activeTab =
    route.name === "collection" || route.name === "communities"
      ? "communities"
      : route.name === "item" ||
          route.name === "workspace" ||
          route.name === "workspaceitem"
        ? "workspace"
        : route.name === "search"
          ? "search"
          : route.name === "quicklinks"
            ? "quicklinks"
            : route.name === "profile" || route.name === "adminClusters" || route.name === "adminSettings"
              ? route.name
              : route.name; // "dashboard"

  const subNav =
    activeTab === "workspace"
      ? WORKSPACE_SUBNAV.map((item) => ({
          ...item,
          active: route.name === "workspace" && route.sub === item.key,
        }))
      : undefined;

  return (
    <AppLayout
      activeRoute={activeTab}
      onLogout={handleLogout}
      subNav={subNav}
      showQuicklinks={quicklinksAccessible}
    >
      {route.name === "dashboard" && <Dashboard />}

      {route.name === "communities" && (
        <CommunitiesPage
          onOpenCollection={goCollection}
          canCreateCommunities={canCreateCommunities}
          canCreateCollections={canCreateCollections}
          canManageRoles={canManageCommunityRoles}
        />
      )}

      {route.name === "collection" && (
        <ItemListPage
          collectionId={route.collectionId}
          onOpenItem={goItem}
          onBack={goBack}
        />
      )}

      {route.name === "workspace" && (
        <WorkspaceListPage
          sub={route.sub}
          onOpenItem={goItem}
          onOpenWorkspaceItem={goWorkspaceItem}
        />
      )}

      {route.name === "item" && (
        <ItemDetailPage mode="item" uuid={route.uuid} onBack={goBack} />
      )}

      {route.name === "workspaceitem" && (
        <ItemDetailPage mode="workspace" wsId={route.wsId} onBack={goBack} />
      )}

      {route.name === "search" && (
        <SearchPage onOpenItem={goItem} initialQuery={route.query ?? ""} />
      )}

      {route.name === "quicklinks" && quicklinksAccessible && (
        <QuicklinksPage
          initialPreset={route.preset}
          onOpenItem={goItem}
          onOpenWorkspaceItem={goWorkspaceItem}
        />
      )}

      {route.name === "quicklinks" && !quicklinksAccessible && (
        <Dashboard />
      )}

      {route.name === "profile" && <ProfilePage />}

      {route.name === "formBuilder" && <FormBuilderPage initialProcess={(route as any).process} />}
      {route.name === "adminClusters" && <AdminClustersPage />}

      {route.name === "adminSettings" && (
        <AdminSettingsPage
          onQuicklinksToggle={(enabled) => setRuntimeQuicklinks(enabled)}
          onCommunitiesCreationToggle={(enabled) => setRuntimeCommunitiesCreation(enabled)}
          onCommunitiesRoleManagementToggle={(enabled) => setRuntimeCommunitiesRoleManagement(enabled)}
          onCollectionsCreationToggle={(enabled) => setRuntimeCollectionsCreation(enabled)}
        />
      )}
    </AppLayout>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppInner />
    </AuthProvider>
  );
}
