import React from "react";
import { apiFetch } from "../auth/client";
import {
  type Community,
  type Collection,
  metaFirst,
  stripHtml,
  hrefToPath,
} from "../api/dspace";

// ── Local view model ──────────────────────────────────────────────────────────

interface TreeNode {
  id: string;
  name: string;
  handle: string | null;
  description?: string;
  type: "community" | "collection";
  childCount: number;
  subcommunitiesHref: string;
  collectionsHref: string;
}

function communityToNode(c: Community): TreeNode {
  const subCount = c._embedded?.subcommunities?.page?.totalElements ?? 0;
  const colCount = c._embedded?.collections?.page?.totalElements ?? 0;
  return {
    id: c.id,
    name: c.name ?? c.id,
    handle: c.handle,
    description:
      stripHtml(metaFirst(c.metadata, "dc.description")) || undefined,
    type: "community",
    childCount: subCount + colCount,
    subcommunitiesHref: (c._links.subcommunities as { href: string }).href,
    collectionsHref: (c._links.collections as { href: string }).href,
  };
}

function collectionToNode(col: Collection): TreeNode {
  return {
    id: col.id,
    name: col.name ?? col.id,
    handle: col.handle,
    type: "collection",
    childCount: 0,
    subcommunitiesHref: "",
    collectionsHref: "",
  };
}

// ── API ───────────────────────────────────────────────────────────────────────

async function fetchTopCommunities(): Promise<TreeNode[]> {
  const data = await apiFetch<any>(
    "/api/core/communities/search/top" +
      "?page=0&size=50&sort=dc.title,ASC" +
      "&embed=subcommunities&embed.size=subcommunities=1" +
      "&embed=collections&embed.size=collections=1",
  );
  const communities: Community[] = data?._embedded?.communities ?? [];
  return communities.map(communityToNode);
}

async function fetchChildren(node: TreeNode): Promise<TreeNode[]> {
  const [subRes, colRes] = await Promise.all([
    node.subcommunitiesHref
      ? apiFetch<any>(
          hrefToPath(node.subcommunitiesHref) + "?page=0&size=100",
        ).catch(() => null)
      : Promise.resolve(null),
    node.collectionsHref
      ? apiFetch<any>(
          hrefToPath(node.collectionsHref) + "?page=0&size=100",
        ).catch(() => null)
      : Promise.resolve(null),
  ]);

  const subs: TreeNode[] = (subRes?._embedded?.subcommunities ?? []).map(
    communityToNode,
  );
  const cols: TreeNode[] = (colRes?._embedded?.collections ?? []).map(
    collectionToNode,
  );
  return [...subs, ...cols];
}

// ── Components ────────────────────────────────────────────────────────────────

type ExpandState = Record<string, boolean>;
type LoadingState = Record<string, boolean>;
type Cache = Record<string, TreeNode[]>;

function TreeRow({
  node,
  depth,
  expanded,
  loading,
  onToggle,
  onOpenCollection,
}: {
  node: TreeNode;
  depth: number;
  expanded: boolean;
  loading: boolean;
  onToggle: () => void;
  onOpenCollection?: (id: string) => void;
}) {
  const isColl = node.type === "collection";

  return (
    <div
      style={{
        display: "flex",
        alignItems: "flex-start",
        gap: 8,
        padding: "5px 10px",
        cursor: "default",
      }}
      onMouseEnter={(e) =>
        ((e.currentTarget as HTMLDivElement).style.background = "#f5f7fa")
      }
      onMouseLeave={(e) =>
        ((e.currentTarget as HTMLDivElement).style.background = "")
      }
    >
      <div style={{ minWidth: depth * 22, flexShrink: 0 }} />

      <button
        onClick={isColl ? undefined : onToggle}
        disabled={isColl}
        style={{
          width: 20,
          height: 20,
          border: "none",
          background: "none",
          padding: 0,
          flexShrink: 0,
          cursor: isColl ? "default" : "pointer",
          color: isColl ? "#ccc" : "#444",
          fontSize: 12,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginTop: 2,
        }}
      >
        {isColl ? "·" : loading ? "⋯" : expanded ? "▾" : "▸"}
      </button>

      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 7,
            flexWrap: "wrap",
          }}
        >
          <span
            style={{
              fontSize: 10,
              fontWeight: 600,
              padding: "1px 6px",
              borderRadius: 3,
              textTransform: "uppercase",
              letterSpacing: "0.05em",
              whiteSpace: "nowrap",
              flexShrink: 0,
              background: isColl ? "#e8f4fd" : "#eef2ff",
              color: isColl ? "#1a6fa8" : "#4338ca",
            }}
          >
            {isColl ? "Collection" : "Community"}
          </span>

          {isColl && onOpenCollection ? (
            <button
              onClick={() => onOpenCollection(node.id)}
              style={{
                background: "none",
                border: "none",
                padding: 0,
                cursor: "pointer",
                fontSize: 13,
                fontWeight: 400,
                color: "#2563eb",
                textDecoration: "underline",
                textAlign: "left",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
              title={node.name}
            >
              {node.name}
            </button>
          ) : (
            <span
              style={{
                fontSize: 13,
                fontWeight: isColl ? 400 : 500,
                color: "#1a1a2e",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {node.name}
            </span>
          )}

          {!isColl && node.childCount > 0 && (
            <span style={{ fontSize: 11, color: "#999", whiteSpace: "nowrap" }}>
              ({node.childCount})
            </span>
          )}
        </div>
        {node.description && (
          <div
            style={{
              fontSize: 11,
              color: "#777",
              marginTop: 1,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {node.description}
          </div>
        )}
      </div>
    </div>
  );
}

function Tree({
  nodes,
  depth,
  expanded,
  loadingSet,
  cache,
  onToggle,
  onOpenCollection,
}: {
  nodes: TreeNode[];
  depth: number;
  expanded: ExpandState;
  loadingSet: LoadingState;
  cache: Cache;
  onToggle: (node: TreeNode) => void;
  onOpenCollection?: (id: string) => void;
}) {
  return (
    <>
      {nodes.map((node) => (
        <React.Fragment key={node.id}>
          <TreeRow
            node={node}
            depth={depth}
            expanded={!!expanded[node.id]}
            loading={!!loadingSet[node.id]}
            onToggle={() => onToggle(node)}
            onOpenCollection={onOpenCollection}
          />
          {expanded[node.id] && cache[node.id] && (
            <Tree
              nodes={cache[node.id]}
              depth={depth + 1}
              expanded={expanded}
              loadingSet={loadingSet}
              cache={cache}
              onToggle={onToggle}
              onOpenCollection={onOpenCollection}
            />
          )}
        </React.Fragment>
      ))}
    </>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

type Props = {
  onOpenCollection?: (collectionId: string) => void;
};

export function CommunitiesPage({ onOpenCollection }: Props) {
  const [roots, setRoots] = React.useState<TreeNode[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [expanded, setExpanded] = React.useState<ExpandState>({});
  const [loadingSet, setLS] = React.useState<LoadingState>({});
  const [cache, setCache] = React.useState<Cache>({});

  React.useEffect(() => {
    fetchTopCommunities()
      .then(setRoots)
      .catch((e) => setError(e?.message ?? String(e)))
      .finally(() => setLoading(false));
  }, []);

  const toggle = React.useCallback(
    async (node: TreeNode) => {
      if (expanded[node.id]) {
        setExpanded((s) => ({ ...s, [node.id]: false }));
        return;
      }
      if (cache[node.id]) {
        setExpanded((s) => ({ ...s, [node.id]: true }));
        return;
      }
      setLS((s) => ({ ...s, [node.id]: true }));
      try {
        const children = await fetchChildren(node);
        setCache((s) => ({ ...s, [node.id]: children }));
        setExpanded((s) => ({ ...s, [node.id]: true }));
      } catch (e) {
        console.error("failed to load children:", e);
      } finally {
        setLS((s) => ({ ...s, [node.id]: false }));
      }
    },
    [expanded, cache],
  );

  return (
    <div style={{ padding: "20px 24px", maxWidth: 900 }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          marginBottom: 20,
        }}
      >
        <h2
          style={{ margin: 0, fontSize: 20, fontWeight: 600, color: "#1a1a2e" }}
        >
          Communities
        </h2>
        {loading && (
          <span style={{ fontSize: 13, color: "#888" }}>Loading…</span>
        )}
        {!loading && !error && roots.length > 0 && (
          <span
            style={{
              fontSize: 12,
              color: "#888",
              background: "#f1f3f5",
              borderRadius: 10,
              padding: "2px 8px",
            }}
          >
            {roots.length} top-level
          </span>
        )}
      </div>

      {error && (
        <div
          style={{
            padding: "10px 14px",
            background: "#fff1f0",
            border: "1px solid #ffa39e",
            borderRadius: 6,
            color: "#cf1322",
            fontSize: 13,
          }}
        >
          {error}
        </div>
      )}

      {!loading && !error && roots.length === 0 && (
        <p style={{ color: "#888", fontSize: 14 }}>No communities found.</p>
      )}

      {roots.length > 0 && (
        <div
          style={{
            border: "1px solid #e5e7eb",
            borderRadius: 8,
            background: "#fff",
            overflow: "hidden",
          }}
        >
          <Tree
            nodes={roots}
            depth={0}
            expanded={expanded}
            loadingSet={loadingSet}
            cache={cache}
            onToggle={toggle}
            onOpenCollection={onOpenCollection}
          />
        </div>
      )}
    </div>
  );
}
