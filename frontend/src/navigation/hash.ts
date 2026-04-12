export type Route =
  | { name: "dashboard" }
  | { name: "communities" }
  | { name: "workspace"; sub: "mine" | "others" }
  | { name: "search"; query?: string }
  | { name: "profile" }
  | { name: "adminClusters" }
  | { name: "adminSettings" }
  | { name: "adminCollectionMapping" }
  | { name: "formBuilder"; process?: string }
  | { name: "quicklinks"; preset?: string }
  | { name: "collection"; collectionId: string }
  | { name: "item"; uuid: string }
  | { name: "workspaceitem"; wsId: number }
  | { name: "login" };

export function parseHash(): Route {
  const h = (window.location.hash || "#/dashboard").replace(/^#/, "");
  const parts = h.split("/").filter(Boolean);

  if (parts.length === 0) return { name: "dashboard" };

  switch (parts[0]) {
    case "login":
      return { name: "login" };

    case "dashboard":
      return { name: "dashboard" };

    case "communities":
      return { name: "communities" };

    case "workspace": {
      const sub = parts[1];
      if (sub === "others") return { name: "workspace", sub: "others" };
      return { name: "workspace", sub: "mine" };
    }

    case "item":
      if (parts[1]) return { name: "item", uuid: parts[1] };
      return { name: "workspace", sub: "mine" };

    case "workspaceitem": {
      const wsId = parts[1] ? parseInt(parts[1], 10) : NaN;
      if (!Number.isNaN(wsId)) return { name: "workspaceitem", wsId };
      return { name: "workspace", sub: "mine" };
    }

    case "quicklinks": {
      const preset = parts[1] ? decodeURIComponent(parts[1]) : undefined;
      return { name: "quicklinks", preset };
    }

    case "profile":
      return { name: "profile" };

    case "admin":
      if (parts[1] === "clusters")            return { name: "adminClusters" };
      if (parts[1] === "settings")            return { name: "adminSettings" };
      if (parts[1] === "collection-mapping")  return { name: "adminCollectionMapping" };
      if (parts[1] === "form-builder") {
        return { name: "formBuilder", process: parts[2] ? decodeURIComponent(parts[2]) : undefined };
      }
      return { name: "dashboard" };

    case "search": {
      const raw = parts.slice(1).join("/");
      const query = raw ? decodeURIComponent(raw) : undefined;
      return { name: "search", query };
    }

    case "collection":
      if (parts[1]) return { name: "collection", collectionId: parts[1] };
      return { name: "communities" };

    default:
      return { name: "dashboard" };
  }
}

export const routes = {
  dashboard: "#/dashboard",
  communities: "#/communities",
  workspace: "#/workspace/mine",
  workspaceMine: "#/workspace/mine",
  workspaceOthers: "#/workspace/others",
  search: "#/search",
  profile: "#/profile",
  quicklinks: "#/quicklinks",
  quicklinksPreset: (preset: string) => `#/quicklinks/${encodeURIComponent(preset)}`,
  adminClusters: "#/admin/clusters",
  adminSettings: "#/admin/settings",
  adminCollectionMapping: "#/admin/collection-mapping",
  formBuilder: "#/admin/form-builder",
  formBuilderProcess: (process: string) => `#/admin/form-builder/${encodeURIComponent(process)}`,
  login: "#/login",
  searchQuery: (q: string) => `#/search/${encodeURIComponent(q)}`,
  collection: (id: string) => `#/collection/${id}`,
  item: (uuid: string) => `#/item/${uuid}`,
  workspaceitem: (wsId: number) => `#/workspaceitem/${wsId}`,
};
