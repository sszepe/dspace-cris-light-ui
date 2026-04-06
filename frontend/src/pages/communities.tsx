import React from "react";
import { apiFetch } from "../auth/client";
import {
  type Community,
  type Collection,
  metaFirst,
  stripHtml,
  hrefToPath,
} from "../api/dspace";
// import { useAuth } from "../auth/AuthContext";
import CommunityCreateModal from "../components/community-create-modal";
import CommunityAdminModal from "../components/community-admin-modal";
import CollectionCreateModal from "../components/collection-create-modal";
import CollectionPermissionsModal from "../components/collection-permissions-modal";
import type { CommunityOption } from "../api/community-api";

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
  onAddSubcommunity,
  onManageAdmins,
  onAddCollection,
  onManageCollectionPermissions,
}: {
  node: TreeNode;
  depth: number;
  expanded: boolean;
  loading: boolean;
  onToggle: () => void;
  onOpenCollection?: (id: string) => void;
  onAddSubcommunity?: (node: TreeNode) => void;
  onManageAdmins?: (node: TreeNode) => void;
  onAddCollection?: (node: TreeNode) => void;
  onManageCollectionPermissions?: (node: TreeNode) => void;
}) {
  const [hovered, setHovered] = React.useState(false);
  const isColl = node.type === "collection";

  return (
    <div
      style={{
        display: "flex",
        alignItems: "flex-start",
        gap: 8,
        padding: "5px 10px",
        cursor: "default",
        background: hovered ? "#f5f7fa" : undefined,
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div style={{ minWidth: depth * 22, flexShrink: 0 }} />

      {/* Expand toggle */}
      <button
        onClick={isColl ? undefined : onToggle}
        disabled={isColl}
        style={{
          width: 20, height: 20, border: "none", background: "none",
          padding: 0, flexShrink: 0,
          cursor: isColl ? "default" : "pointer",
          color: isColl ? "#ccc" : "#444", fontSize: 12,
          display: "flex", alignItems: "center", justifyContent: "center",
          marginTop: 2,
        }}
      >
        {isColl ? "·" : loading ? "⋯" : expanded ? "▾" : "▸"}
      </button>

      {/* Label row */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 7, flexWrap: "wrap" }}>
          <span style={{
            fontSize: 10, fontWeight: 600, padding: "1px 6px", borderRadius: 3,
            textTransform: "uppercase", letterSpacing: "0.05em", whiteSpace: "nowrap",
            flexShrink: 0,
            background: isColl ? "#e8f4fd" : "#eef2ff",
            color: isColl ? "#1a6fa8" : "#4338ca",
          }}>
            {isColl ? "Collection" : "Community"}
          </span>

          {isColl && onOpenCollection ? (
            <button
              onClick={() => onOpenCollection(node.id)}
              style={{
                background: "none", border: "none", padding: 0,
                cursor: "pointer", fontSize: 13, fontWeight: 400,
                color: "#2563eb", textDecoration: "underline",
                textAlign: "left", overflow: "hidden",
                textOverflow: "ellipsis", whiteSpace: "nowrap",
              }}
              title={node.name}
            >
              {node.name}
            </button>
          ) : (
            <span style={{
              fontSize: 13, fontWeight: isColl ? 400 : 500, color: "#1a1a2e",
              overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
            }}>
              {node.name}
            </span>
          )}

          {!isColl && node.childCount > 0 && (
            <span style={{ fontSize: 11, color: "#999", whiteSpace: "nowrap" }}>
              ({node.childCount})
            </span>
          )}

          {/* Hover action buttons — admin only */}
          {hovered && (onAddSubcommunity || onManageAdmins || onAddCollection || onManageCollectionPermissions) && (
            <div style={{ marginLeft: "auto", display: "flex", gap: 6, flexShrink: 0 }}>
              {/* Community-only actions */}
              {!isColl && onAddSubcommunity && (
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); onAddSubcommunity(node); }}
                  title={`Add subcommunity under "${node.name}"`}
                  style={{
                    padding: "2px 8px", fontSize: 11, fontWeight: 600,
                    borderRadius: 5, border: "1px solid #c7d2fe",
                    background: "#eef2ff", color: "#4338ca",
                    cursor: "pointer", whiteSpace: "nowrap",
                  }}
                >
                  + subcommunity
                </button>
              )}
              {!isColl && onAddCollection && (
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); onAddCollection(node); }}
                  title={`Add collection under "${node.name}"`}
                  style={{
                    padding: "2px 8px", fontSize: 11, fontWeight: 600,
                    borderRadius: 5, border: "1px solid #bae6fd",
                    background: "#e0f2fe", color: "#0369a1",
                    cursor: "pointer", whiteSpace: "nowrap",
                  }}
                >
                  + collection
                </button>
              )}
              {!isColl && onManageAdmins && (
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); onManageAdmins(node); }}
                  title={`Manage admin group for "${node.name}"`}
                  style={{
                    padding: "2px 8px", fontSize: 11, fontWeight: 600,
                    borderRadius: 5, border: "1px solid #d1d5db",
                    background: "#f9fafb", color: "#374151",
                    cursor: "pointer", whiteSpace: "nowrap",
                  }}
                >
                  👥 Admins
                </button>
              )}
              {/* Collection-only actions */}
              {isColl && onManageCollectionPermissions && (
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); onManageCollectionPermissions(node); }}
                  title={`Manage permissions for "${node.name}"`}
                  style={{
                    padding: "2px 8px", fontSize: 11, fontWeight: 600,
                    borderRadius: 5, border: "1px solid #d1d5db",
                    background: "#f9fafb", color: "#374151",
                    cursor: "pointer", whiteSpace: "nowrap",
                  }}
                >
                  🔐 Permissions
                </button>
              )}
            </div>
          )}
        </div>

        {node.description && (
          <div style={{
            fontSize: 11, color: "#777", marginTop: 1,
            overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
          }}>
            {node.description}
          </div>
        )}
      </div>
    </div>
  );
}

function Tree({
  nodes, depth, expanded, loadingSet, cache,
  onToggle, onOpenCollection, onAddSubcommunity, onManageAdmins,
  onAddCollection, onManageCollectionPermissions,
}: {
  nodes: TreeNode[];
  depth: number;
  expanded: ExpandState;
  loadingSet: LoadingState;
  cache: Cache;
  onToggle: (node: TreeNode) => void;
  onOpenCollection?: (id: string) => void;
  onAddSubcommunity?: (node: TreeNode) => void;
  onManageAdmins?: (node: TreeNode) => void;
  onAddCollection?: (node: TreeNode) => void;
  onManageCollectionPermissions?: (node: TreeNode) => void;
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
            onAddSubcommunity={onAddSubcommunity}
            onManageAdmins={onManageAdmins}
            onAddCollection={onAddCollection}
            onManageCollectionPermissions={onManageCollectionPermissions}
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
              onAddSubcommunity={onAddSubcommunity}
              onManageAdmins={onManageAdmins}
              onAddCollection={onAddCollection}
              onManageCollectionPermissions={onManageCollectionPermissions}
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
  /** Whether the current user may create top-level communities and subcommunities. */
  canCreateCommunities?: boolean;
  /** Whether the current user may create collections under communities. */
  canCreateCollections?: boolean;
  /** Whether the current user may open the community role management modal. */
  canManageRoles?: boolean;
};

export function CommunitiesPage({
  onOpenCollection,
  canCreateCommunities = false,
  canCreateCollections = false,
  canManageRoles = false,
}: Props) {
  // const { isAdmin } = useAuth();

  const [roots, setRoots] = React.useState<TreeNode[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [expanded, setExpanded] = React.useState<ExpandState>({});
  const [loadingSet, setLS] = React.useState<LoadingState>({});
  const [cache, setCache] = React.useState<Cache>({});

  // ── Create modal state ──────────────────────────────────────────────────────
  const [createOpen, setCreateOpen] = React.useState(false);
  const [createParent, setCreateParent] = React.useState<CommunityOption | null>(null);

  // ── Admin group modal state ─────────────────────────────────────────────────
  const [adminModalOpen, setAdminModalOpen] = React.useState(false);
  const [adminTarget, setAdminTarget] = React.useState<{ id: string; name: string } | null>(null);

  // ── Collection create modal state ───────────────────────────────────────────
  const [collectionCreateOpen, setCollectionCreateOpen] = React.useState(false);
  const [collectionCreateParent, setCollectionCreateParent] = React.useState<{ id: string; name: string } | null>(null);

  // ── Collection permissions modal state ──────────────────────────────────────
  const [collectionPermissionsOpen, setCollectionPermissionsOpen] = React.useState(false);
  const [collectionPermissionsTarget, setCollectionPermissionsTarget] = React.useState<{ id: string; name: string } | null>(null);

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

  // Open admin group modal for a community node
  const handleManageAdmins = React.useCallback((node: TreeNode) => {
    setAdminTarget({ id: node.id, name: node.name });
    setAdminModalOpen(true);
  }, []);

  // Open the create community modal with a pre-selected parent from a tree node
  const handleAddSubcommunity = React.useCallback((node: TreeNode) => {
    setCreateParent({ id: node.id, label: node.name, handle: node.handle ?? null });
    setCreateOpen(true);
  }, []);

  // Open the collection create modal for a community node
  const handleAddCollection = React.useCallback((node: TreeNode) => {
    setCollectionCreateParent({ id: node.id, name: node.name });
    setCollectionCreateOpen(true);
  }, []);

  // Open the collection permissions modal for a collection node
  const handleManageCollectionPermissions = React.useCallback((node: TreeNode) => {
    setCollectionPermissionsTarget({ id: node.id, name: node.name });
    setCollectionPermissionsOpen(true);
  }, []);

  // Open create modal for a top-level community
  const handleCreateTop = () => {
    setCreateParent(null);
    setCreateOpen(true);
  };

  // After a community is created, invalidate the tree so it refreshes
  const handleCreated = React.useCallback(
    (created: { id: string; name: string; isTop: boolean; parentId?: string }) => {
      if (created.isTop) {
        // Reload top-level communities
        setLoading(true);
        fetchTopCommunities()
          .then(setRoots)
          .catch((e) => setError(e?.message ?? String(e)))
          .finally(() => setLoading(false));
      } else if (created.parentId) {
        // Invalidate the parent's child cache so it reloads on next expand
        setCache((s) => {
          const next = { ...s };
          delete next[created.parentId!];
          return next;
        });
        // If the parent was already expanded, close it so the user re-expands to see the new child
        setExpanded((s) => ({ ...s, [created.parentId!]: false }));
      }
    },
    [],
  );

  // After a collection is created, invalidate the parent community's child cache
  const handleCollectionCreated = React.useCallback(
    (created: { id: string; name: string; parentId: string }) => {
      setCache((s) => {
        const next = { ...s };
        delete next[created.parentId];
        return next;
      });
      setExpanded((s) => ({ ...s, [created.parentId]: false }));
    },
    [],
  );

  return (
    <div style={{ padding: "20px 24px", maxWidth: 900 }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20, flexWrap: "wrap" }}>
        <h2 style={{ margin: 0, fontSize: 20, fontWeight: 600, color: "#1a1a2e" }}>
          Communities
        </h2>
        {loading && <span style={{ fontSize: 13, color: "#888" }}>Loading…</span>}
        {!loading && !error && roots.length > 0 && (
          <span style={{
            fontSize: 12, color: "#888", background: "#f1f3f5",
            borderRadius: 10, padding: "2px 8px",
          }}>
            {roots.length} top-level
          </span>
        )}

        {/* Create button — only when feature flag + admin role allow it */}
        {canCreateCommunities && (
          <button
            type="button"
            onClick={handleCreateTop}
            style={{
              marginLeft: "auto",
              padding: "7px 14px",
              borderRadius: 8,
              border: "1px solid #4338ca",
              background: "#eef2ff",
              color: "#4338ca",
              fontWeight: 700,
              fontSize: 13,
              cursor: "pointer",
            }}
          >
            + Create community
          </button>
        )}
      </div>

      {error && (
        <div style={{
          padding: "10px 14px", background: "#fff1f0",
          border: "1px solid #ffa39e", borderRadius: 6,
          color: "#cf1322", fontSize: 13,
        }}>
          {error}
        </div>
      )}

      {!loading && !error && roots.length === 0 && (
        <p style={{ color: "#888", fontSize: 14 }}>No communities found.</p>
      )}

      {roots.length > 0 && (
        <div style={{
          border: "1px solid #e5e7eb", borderRadius: 8,
          background: "#fff", overflow: "hidden",
        }}>
          <Tree
            nodes={roots}
            depth={0}
            expanded={expanded}
            loadingSet={loadingSet}
            cache={cache}
            onToggle={toggle}
            onOpenCollection={onOpenCollection}
            onAddSubcommunity={canCreateCommunities ? handleAddSubcommunity : undefined}
            onManageAdmins={canManageRoles ? handleManageAdmins : undefined}
            onAddCollection={canCreateCollections ? handleAddCollection : undefined}
            onManageCollectionPermissions={canManageRoles ? handleManageCollectionPermissions : undefined}
          />
        </div>
      )}

      {/* Create community modal */}
      <CommunityCreateModal
        open={createOpen}
        defaultParent={createParent}
        onClose={() => setCreateOpen(false)}
        onCreated={handleCreated}
      />

      {/* Admin group management modal */}
      {adminTarget && (
        <CommunityAdminModal
          open={adminModalOpen}
          communityId={adminTarget.id}
          communityName={adminTarget.name}
          onClose={() => setAdminModalOpen(false)}
        />
      )}

      {/* Collection create modal */}
      {collectionCreateParent && (
        <CollectionCreateModal
          open={collectionCreateOpen}
          parentCommunityId={collectionCreateParent.id}
          parentCommunityName={collectionCreateParent.name}
          onClose={() => setCollectionCreateOpen(false)}
          onCreated={handleCollectionCreated}
        />
      )}

      {/* Collection permissions modal */}
      {collectionPermissionsTarget && (
        <CollectionPermissionsModal
          open={collectionPermissionsOpen}
          collectionId={collectionPermissionsTarget.id}
          collectionName={collectionPermissionsTarget.name}
          onClose={() => setCollectionPermissionsOpen(false)}
        />
      )}
    </div>
  );
}
