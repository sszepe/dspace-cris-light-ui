/**
 * community-admin-modal.tsx
 *
 * Permission management panel for a community's admin group.
 *
 * Sections:
 *   1. Admin group status — shows whether the group exists; button to create it
 *   2. Current member groups — lists all subgroups currently in the admin group
 *      with individual remove buttons
 *   3. Add group — searchable picker (isNotMemberOf) with paginated results
 *
 * All mutations call community-admin-api.ts; the panel reloads relevant sections
 * after each operation so the UI stays in sync.
 */

import React from "react";
import {
  Button,
  ErrorBox,
  ModalShell,
  inputStyle,
} from "./modal-shared";
import {
  getCommunityAdminGroup,
  createCommunityAdminGroup,
  listAdminGroupSubgroups,
  searchAddableGroups,
  addSubgroupToAdminGroup,
  removeSubgroupFromAdminGroup,
  type AdminGroup,
  type GroupMember,
} from "../api/community-admin-api";

// ── Sub-components ────────────────────────────────────────────────────────────

/** Pill showing the group name with an optional type tag */
function GroupPill({
  member,
  onRemove,
  removing,
}: {
  member: GroupMember;
  onRemove: () => void;
  removing: boolean;
}) {
  const isCommunity = member.linkedObjectType === "community";
  const isCollection = member.linkedObjectType === "collection";

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 8,
        padding: "8px 12px",
        border: "1px solid #e5e7eb",
        borderRadius: 8,
        background: "#fafafa",
      }}
    >
      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            fontSize: 13,
            fontWeight: 600,
            color: "#111827",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {member.name}
        </div>
        {(member.linkedObjectName || member.description) && (
          <div
            style={{
              fontSize: 11,
              color: "#6b7280",
              marginTop: 2,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {[
              member.linkedObjectName,
              member.description || undefined,
            ]
              .filter(Boolean)
              .join(" · ")}
          </div>
        )}
      </div>

      {/* Type tag */}
      {(isCommunity || isCollection) && (
        <span
          style={{
            fontSize: 10,
            fontWeight: 700,
            padding: "1px 6px",
            borderRadius: 3,
            textTransform: "uppercase",
            letterSpacing: "0.05em",
            whiteSpace: "nowrap",
            flexShrink: 0,
            background: isCollection ? "#e8f4fd" : "#eef2ff",
            color: isCollection ? "#1a6fa8" : "#4338ca",
          }}
        >
          {isCollection ? "Collection" : "Community"}
        </span>
      )}
      {member.permanent && (
        <span
          style={{
            fontSize: 10,
            fontWeight: 700,
            padding: "1px 6px",
            borderRadius: 3,
            textTransform: "uppercase",
            letterSpacing: "0.05em",
            whiteSpace: "nowrap",
            flexShrink: 0,
            background: "#f3f4f6",
            color: "#6b7280",
          }}
        >
          Permanent
        </span>
      )}

      <button
        type="button"
        onClick={onRemove}
        disabled={removing}
        title="Remove from admin group"
        style={{
          padding: "3px 8px",
          borderRadius: 6,
          border: "1px solid #fecaca",
          background: removing ? "#f3f4f6" : "#fff7f7",
          color: removing ? "#9ca3af" : "#dc2626",
          cursor: removing ? "not-allowed" : "pointer",
          fontSize: 12,
          fontWeight: 600,
          flexShrink: 0,
        }}
      >
        {removing ? "…" : "Remove"}
      </button>
    </div>
  );
}

/** Single result row in the "add group" search */
function AddGroupRow({
  member,
  onAdd,
  adding,
}: {
  member: GroupMember;
  onAdd: () => void;
  adding: boolean;
}) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 8,
        padding: "8px 12px",
        borderBottom: "1px solid #f3f4f6",
      }}
    >
      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            fontSize: 13,
            fontWeight: 500,
            color: "#111827",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {member.name}
        </div>
        {(member.linkedObjectName || member.description) && (
          <div style={{ fontSize: 11, color: "#6b7280", marginTop: 1 }}>
            {[member.linkedObjectName, member.description || undefined]
              .filter(Boolean)
              .join(" · ")}
          </div>
        )}
      </div>
      <button
        type="button"
        onClick={onAdd}
        disabled={adding}
        style={{
          padding: "4px 10px",
          borderRadius: 6,
          border: "1px solid #c7d2fe",
          background: adding ? "#f3f4f6" : "#eef2ff",
          color: adding ? "#9ca3af" : "#4338ca",
          cursor: adding ? "not-allowed" : "pointer",
          fontSize: 12,
          fontWeight: 600,
          flexShrink: 0,
          whiteSpace: "nowrap",
        }}
      >
        {adding ? "Adding…" : "+ Add"}
      </button>
    </div>
  );
}

// ── Props ─────────────────────────────────────────────────────────────────────

type Props = {
  open: boolean;
  communityId: string;
  communityName: string;
  onClose: () => void;
};

// ── Component ─────────────────────────────────────────────────────────────────

export default function CommunityAdminModal({
  open,
  communityId,
  communityName,
  onClose,
}: Props) {
  // ── Admin group state ───────────────────────────────────────────────────────
  const [adminGroup, setAdminGroup] = React.useState<AdminGroup | null>(null);
  const [groupLoading, setGroupLoading] = React.useState(true);
  const [groupError, setGroupError] = React.useState<string | null>(null);
  const [creating, setCreating] = React.useState(false);
  const [newGroupDesc, setNewGroupDesc] = React.useState("");

  // ── Current subgroups ───────────────────────────────────────────────────────
  const [subgroups, setSubgroups] = React.useState<GroupMember[]>([]);
  const [subgroupsLoading, setSubgroupsLoading] = React.useState(false);
  const [removingId, setRemovingId] = React.useState<string | null>(null);

  // ── Add group search ────────────────────────────────────────────────────────
  const [searchQuery, setSearchQuery] = React.useState("");
  const [searchResults, setSearchResults] = React.useState<GroupMember[]>([]);
  const [searchLoading, setSearchLoading] = React.useState(false);
  const [searchPage, setSearchPage] = React.useState(0);
  const [searchTotalPages, setSearchTotalPages] = React.useState(0);
  const [searchTotalElements, setSearchTotalElements] = React.useState(0);
  const [addingId, setAddingId] = React.useState<string | null>(null);

  const searchTimerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  // ── Load admin group on open ────────────────────────────────────────────────
  React.useEffect(() => {
    if (!open) return;
    setGroupError(null);
    setNewGroupDesc("");
    setSearchQuery("");
    setSearchResults([]);
    setSearchPage(0);
    loadAdminGroup();
  }, [open, communityId]);

  const loadAdminGroup = async () => {
    setGroupLoading(true);
    try {
      const group = await getCommunityAdminGroup(communityId);
      setAdminGroup(group);
      if (group) {
        await loadSubgroups(group.id);
      }
    } catch (e: any) {
      setGroupError(e?.message ?? "Failed to load admin group.");
    } finally {
      setGroupLoading(false);
    }
  };

  const loadSubgroups = async (groupId: string) => {
    setSubgroupsLoading(true);
    try {
      const subs = await listAdminGroupSubgroups(groupId);
      setSubgroups(subs);
    } catch {
      setSubgroups([]);
    } finally {
      setSubgroupsLoading(false);
    }
  };

  // ── Create admin group ──────────────────────────────────────────────────────
  const handleCreate = async () => {
    setCreating(true);
    setGroupError(null);
    try {
      const group = await createCommunityAdminGroup(communityId, newGroupDesc);
      setAdminGroup(group);
      setSubgroups([]);
    } catch (e: any) {
      setGroupError(e?.message ?? "Failed to create admin group.");
    } finally {
      setCreating(false);
    }
  };

  // ── Remove subgroup ─────────────────────────────────────────────────────────
  const handleRemove = async (member: GroupMember) => {
    if (!adminGroup) return;
    setRemovingId(member.id);
    try {
      await removeSubgroupFromAdminGroup(adminGroup.id, member.id);
      setSubgroups((prev) => prev.filter((m) => m.id !== member.id));
      // Refresh search results so the removed group reappears as addable
      if (searchQuery.trim() || searchResults.length > 0) {
        void runSearch(searchQuery, 0, adminGroup.id);
      }
    } catch (e: any) {
      setGroupError(e?.message ?? "Failed to remove group.");
    } finally {
      setRemovingId(null);
    }
  };

  // ── Search addable groups ───────────────────────────────────────────────────
  const runSearch = async (
    q: string,
    page: number,
    groupId?: string,
  ) => {
    const gid = groupId ?? adminGroup?.id;
    if (!gid) return;
    setSearchLoading(true);
    try {
      const { members, totalElements, totalPages } = await searchAddableGroups(
        gid,
        q,
        page,
        10,
      );
      setSearchResults(members);
      setSearchTotalElements(totalElements);
      setSearchTotalPages(totalPages);
      setSearchPage(page);
    } catch {
      setSearchResults([]);
    } finally {
      setSearchLoading(false);
    }
  };

  const handleSearchInput = (q: string) => {
    setSearchQuery(q);
    if (searchTimerRef.current) clearTimeout(searchTimerRef.current);
    searchTimerRef.current = setTimeout(() => {
      void runSearch(q, 0);
    }, 250);
  };

  // ── Add subgroup ────────────────────────────────────────────────────────────
  const handleAdd = async (member: GroupMember) => {
    if (!adminGroup || !member.selfHref) return;
    setAddingId(member.id);
    try {
      await addSubgroupToAdminGroup(adminGroup.id, member.selfHref);
      // Move from search results to subgroups
      setSubgroups((prev) => [...prev, member]);
      setSearchResults((prev) => prev.filter((m) => m.id !== member.id));
      setSearchTotalElements((n) => Math.max(0, n - 1));
    } catch (e: any) {
      setGroupError(e?.message ?? "Failed to add group.");
    } finally {
      setAddingId(null);
    }
  };

  if (!open) return null;

  // ── Render ──────────────────────────────────────────────────────────────────
  return (
    <ModalShell
      title="Community admin group"
      subtitle={`Manage admin permissions for "${communityName}"`}
      onClose={onClose}
      width={700}
      footer={<Button onClick={onClose}>Close</Button>}
    >
      {groupLoading && (
        <div style={{ color: "#9ca3af", fontSize: 13 }}>
          Loading admin group…
        </div>
      )}

      {groupError && <ErrorBox message={groupError} />}

      {!groupLoading && !adminGroup && (
        /* ── No admin group yet ── */
        <div
          style={{
            border: "1px solid #e5e7eb",
            borderRadius: 10,
            padding: 16,
            background: "#fafafa",
            display: "grid",
            gap: 12,
          }}
        >
          <div>
            <div style={{ fontWeight: 700, fontSize: 14, color: "#374151" }}>
              No admin group
            </div>
            <div style={{ fontSize: 13, color: "#6b7280", marginTop: 4 }}>
              This community has no admin group yet. Create one to manage
              which groups have admin rights over this community.
            </div>
          </div>
          <div style={{ display: "flex", gap: 10, alignItems: "end" }}>
            <div style={{ flex: 1 }}>
              <div
                style={{
                  fontSize: 12,
                  color: "#6b7280",
                  marginBottom: 5,
                }}
              >
                Group description (optional)
              </div>
              <input
                style={inputStyle}
                value={newGroupDesc}
                onChange={(e) => setNewGroupDesc(e.target.value)}
                placeholder={`${communityName} community-admin group`}
                onKeyDown={(e) => {
                  if (e.key === "Enter") void handleCreate();
                }}
              />
            </div>
            <Button
              kind="primary"
              disabled={creating}
              onClick={() => void handleCreate()}
            >
              {creating ? "Creating…" : "Create admin group"}
            </Button>
          </div>
        </div>
      )}

      {!groupLoading && adminGroup && (
        <>
          {/* ── Group info banner ── */}
          <div
            style={{
              padding: "10px 14px",
              background: "#f0fdf4",
              border: "1px solid #bbf7d0",
              borderRadius: 8,
              display: "flex",
              alignItems: "center",
              gap: 10,
              flexWrap: "wrap",
            }}
          >
            <span style={{ fontSize: 13, fontWeight: 700, color: "#166534" }}>
              ✓ Admin group active
            </span>
            <code
              style={{
                fontSize: 11,
                color: "#6b7280",
                background: "#f3f4f6",
                padding: "1px 6px",
                borderRadius: 4,
              }}
            >
              {adminGroup.name}
            </code>
            {adminGroup.description && (
              <span style={{ fontSize: 12, color: "#6b7280" }}>
                {adminGroup.description}
              </span>
            )}
          </div>

          {/* ── Current members ── */}
          <div>
            <div
              style={{
                fontSize: 13,
                fontWeight: 700,
                color: "#374151",
                marginBottom: 8,
                display: "flex",
                alignItems: "center",
                gap: 8,
              }}
            >
              Member groups
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 500,
                  padding: "1px 7px",
                  borderRadius: 999,
                  background: "#f3f4f6",
                  color: "#6b7280",
                }}
              >
                {subgroups.length}
              </span>
            </div>

            {subgroupsLoading && (
              <div style={{ color: "#9ca3af", fontSize: 13 }}>
                Loading members…
              </div>
            )}

            {!subgroupsLoading && subgroups.length === 0 && (
              <div
                style={{
                  fontSize: 13,
                  color: "#9ca3af",
                  padding: "12px 14px",
                  border: "1px solid #e5e7eb",
                  borderRadius: 8,
                  background: "#fafafa",
                }}
              >
                No groups are currently members of this admin group. Use the
                search below to add groups.
              </div>
            )}

            {!subgroupsLoading && subgroups.length > 0 && (
              <div style={{ display: "grid", gap: 6 }}>
                {subgroups.map((m) => (
                  <GroupPill
                    key={m.id}
                    member={m}
                    onRemove={() => void handleRemove(m)}
                    removing={removingId === m.id}
                  />
                ))}
              </div>
            )}
          </div>

          {/* ── Add group ── */}
          <div>
            <div
              style={{
                fontSize: 13,
                fontWeight: 700,
                color: "#374151",
                marginBottom: 8,
              }}
            >
              Add group
            </div>

            <div style={{ display: "flex", gap: 8, marginBottom: 10 }}>
              <input
                style={{ ...inputStyle, flex: 1 }}
                placeholder="Search groups by name…"
                value={searchQuery}
                onChange={(e) => handleSearchInput(e.target.value)}
              />
              <Button
                onClick={() => void runSearch(searchQuery, 0)}
                disabled={searchLoading}
              >
                {searchLoading ? "…" : "Search"}
              </Button>
            </div>

            {searchResults.length > 0 && (
              <div
                style={{
                  border: "1px solid #e5e7eb",
                  borderRadius: 8,
                  overflow: "hidden",
                  background: "#fff",
                }}
              >
                {searchResults.map((m) => (
                  <AddGroupRow
                    key={m.id}
                    member={m}
                    onAdd={() => void handleAdd(m)}
                    adding={addingId === m.id}
                  />
                ))}

                {/* Pagination */}
                {searchTotalPages > 1 && (
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      padding: "8px 12px",
                      borderTop: "1px solid #f3f4f6",
                      fontSize: 12,
                      color: "#6b7280",
                    }}
                  >
                    <button
                      type="button"
                      onClick={() =>
                        void runSearch(searchQuery, searchPage - 1)
                      }
                      disabled={searchPage <= 0 || searchLoading}
                      style={{
                        padding: "4px 10px",
                        border: "1px solid #d1d5db",
                        borderRadius: 6,
                        background: "#fff",
                        cursor:
                          searchPage <= 0 ? "not-allowed" : "pointer",
                        opacity: searchPage <= 0 ? 0.5 : 1,
                        fontSize: 12,
                      }}
                    >
                      ← Prev
                    </button>
                    <span>
                      Page {searchPage + 1} / {searchTotalPages} ·{" "}
                      {searchTotalElements.toLocaleString()} groups
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        void runSearch(searchQuery, searchPage + 1)
                      }
                      disabled={
                        searchPage >= searchTotalPages - 1 || searchLoading
                      }
                      style={{
                        padding: "4px 10px",
                        border: "1px solid #d1d5db",
                        borderRadius: 6,
                        background: "#fff",
                        cursor:
                          searchPage >= searchTotalPages - 1
                            ? "not-allowed"
                            : "pointer",
                        opacity:
                          searchPage >= searchTotalPages - 1 ? 0.5 : 1,
                        fontSize: 12,
                      }}
                    >
                      Next →
                    </button>
                  </div>
                )}
              </div>
            )}

            {!searchLoading &&
              searchQuery.trim() &&
              searchResults.length === 0 && (
                <div style={{ fontSize: 13, color: "#9ca3af" }}>
                  No groups found for "{searchQuery}" that are not already
                  members.
                </div>
              )}

            {!searchQuery.trim() && searchResults.length === 0 && (
              <div style={{ fontSize: 12, color: "#9ca3af" }}>
                Type a group name above to search. The search only returns
                groups not already in this admin group.
              </div>
            )}
          </div>
        </>
      )}
    </ModalShell>
  );
}
