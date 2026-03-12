import React from "react";
import { Layout, AppLayout } from "./components/layout";
import { Dashboard } from "./pages/dashboard";
import { CommunitiesPage } from "./pages/communities";
import { WorkspaceListPage } from "./pages/workspace-list";
import { ItemListPage } from "./pages/item-list";
import { ItemDetailPage } from "./pages/item-detail";
import { SearchPage } from "./pages/search-page";
import { ProfilePage } from "./pages/profile-page";
import { LoginPage } from "./pages/login";
import { AuthProvider, useAuth } from "./auth/AuthContext";
import { parseHash, routes, type Route } from "./navigation/hash";

const WORKSPACE_SUBNAV = [
  { key: "mine", label: "My Submissions", route: routes.workspaceMine },
  {
    key: "others",
    label: "Submissions by Others",
    route: routes.workspaceOthers,
  },
];

function AppInner() {
  const { isAuthenticated, isLoading, login, logout, eperson } = useAuth();
  const [route, setRoute] = React.useState<Route>(() => parseHash());

  React.useEffect(() => {
    const onHash = () => setRoute(parseHash());
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  const handleLogout = React.useCallback(async () => {
    await logout();
    window.location.hash = routes.login;
  }, [logout]);

  const goItem = (uuid: string) => {
    window.location.hash = routes.item(uuid);
  };
  const goCollection = (id: string) => {
    window.location.hash = routes.collection(id);
  };
  const goBack = () => {
    window.history.back();
  };

  if (isLoading) {
    return (
      <div className="app-loading">
        <span>Loading...</span>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Layout><LoginPage onLogin={login} /></Layout>;
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
          : route.name === "profile"
            ? "profile"
            : route.name;

  // Sub-nav only shown on workspace-related views
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
      eperson={eperson}
    >
      {route.name === "dashboard" && <Dashboard />}
      {route.name === "communities" && (
        <CommunitiesPage onOpenCollection={goCollection} />
      )}
      {route.name === "collection" && (
        <ItemListPage
          collectionId={route.collectionId}
          onOpenItem={goItem}
          onBack={goBack}
        />
      )}
      {route.name === "workspace" && (
        <WorkspaceListPage sub={route.sub} onOpenItem={goItem} />
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
      {route.name === "profile" && <ProfilePage />}
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
