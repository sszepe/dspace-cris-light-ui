export type Route =
  | { name: "dashboard" }
  | { name: "communities" }
  | { name: "workspace"; sub: "mine" | "others" }
  | { name: "search"; query?: string }
  | { name: "profile" }
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
    case "communities":
      return { name: "communities" };
    case "item":
      if (parts[1]) return { name: "item", uuid: parts[1] };
      return { name: "workspace", sub: "mine" };
    case "workspaceitem": {
      const wsId = parts[1] ? parseInt(parts[1], 10) : NaN;
      if (!isNaN(wsId)) return { name: "workspaceitem", wsId };
      return { name: "workspace", sub: "mine" };
    }
    case "profile":
      return { name: "profile" };
    case "search": {
      // Optional query encoded in the fragment: #/search/my+query
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
  login: "#/login",
  searchQuery: (q: string) => `#/search/${encodeURIComponent(q)}`,
  collection: (id: string) => `#/collection/${id}`,
  item:           (uuid: string) => `#/item/${uuid}`,
  workspaceitem:  (wsId: number) => `#/workspaceitem/${wsId}`,
};
