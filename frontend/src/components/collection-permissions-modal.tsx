/**
 * collection-permissions-modal.tsx
 *
 * Permission management panel for a DSpace collection.
 *
 * Tabs / sections:
 *   1. Built-in groups — four tabs for adminGroup, submittersGroup,
 *      itemReadGroup, bitstreamReadGroup.  Each shows current subgroup
 *      members and an add-group search.  Groups are created on first use.
 *   2. Additional policies — lists TYPE_SUBMISSION resource policies with
 *      add / delete.  Allows choosing a group, action, optional name and
 *      optional date range.
 *
 * Only TYPE_SUBMISSION resource policies are created/shown (as per spec).
 * Action types available: READ, WRITE, REMOVE, ADMIN, DELETE,
 *   DEFAULT_ITEM_READ, DEFAULT_BITSTREAM_READ.
 */

import React from "react";
import {
  Button,
  ErrorBox,
  ModalShell,
  inputStyle,
} from "./modal-shared";
import {
  getCollectionGroup,
  createCollectionGroup,
  listGroupSubgroups,
  searchAddableGroupsForGroup,
  addSubgroupToGroup,
  removeSubgroupFromGroup,
  getCollectionResourcePolicies,
  createResourcePolicy,
  deleteResourcePolicy,
  searchGroups,
  type CollectionGroup,
  type GroupMember,
  type ResourcePolicy,
  type SearchableGroup,
} from "../api/collection-api";

// ── Constants ─────────────────────────────────────────────────────────────────

type BuiltInTab = "adminGroup" | "submittersGroup" | "itemReadGroup" | "bitstreamReadGroup";

const BUILT_IN_TABS: { key: BuiltInTab; label: string; note?: string }[] = [
  { key: "adminGroup", label: "Admins" },
  { key: "submittersGroup", label: "Submitters" },
  { key: "itemReadGroup", label: "Item read", note: "Replaces Anonymous read on items" },
  { key: "bitstreamReadGroup", label: "Bitstream read", note: "Replaces Anonymous read on bitstreams" },
];

const POLICY_ACTIONS = [
  "READ", "WRITE", "REMOVE", "ADMIN", "DELETE",
  "DEFAULT_ITEM_READ", "DEFAULT_BITSTREAM_READ",
];

// ── Sub-components ────────────────────────────────────────────────────────────

function GroupPill({
  member, onRemove, removing,
}: { member: GroupMember; onRemove: () => void; removing: boolean }) {
  const isColl = member.linkedObjectType === "collection";
  const isCom = member.linkedObjectType === "community";
  return (
    <div style={{
      display: "flex", alignItems: "center", gap: 8,
      padding: "8px 12px", border: "1px solid #e5e7eb",
      borderRadius: 8, background: "#fafafa",
    }}>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          fontSize: 13, fontWeight: 600, color: "#111827",
          overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
        }}>
          {member.name}
        </div>
        {(member.linkedObjectName || member.description) && (
          <div style={{ fontSize: 11, color: "#6b7280", marginTop: 2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {[member.linkedObjectName, member.description || undefined].filter(Boolean).join(" · ")}
          </div>
        )}
      </div>
      {(isColl || isCom) && (
        <span style={{
          fontSize: 10, fontWeight: 700, padding: "1px 6px", borderRadius: 3,
          textTransform: "uppercase", letterSpacing: "0.05em", whiteSpace: "nowrap", flexShrink: 0,
          background: isColl ? "#e8f4fd" : "#eef2ff", color: isColl ? "#1a6fa8" : "#4338ca",
        }}>
          {isColl ? "Collection" : "Community"}
        </span>
      )}
      {member.permanent && (
        <span style={{
          fontSize: 10, fontWeight: 700, padding: "1px 6px", borderRadius: 3,
          textTransform: "uppercase", letterSpacing: "0.05em", whiteSpace: "nowrap", flexShrink: 0,
          background: "#f3f4f6", color: "#6b7280",
        }}>Permanent</span>
      )}
      <button
        type="button" onClick={onRemove} disabled={removing}
        style={{
          padding: "3px 8px", borderRadius: 6,
          border: "1px solid #fecaca",
          background: removing ? "#f3f4f6" : "#fff7f7",
          color: removing ? "#9ca3af" : "#dc2626",
          cursor: removing ? "not-allowed" : "pointer",
          fontSize: 12, fontWeight: 600, flexShrink: 0,
        }}
      >
        {removing ? "…" : "Remove"}
      </button>
    </div>
  );
}

function AddGroupRow({ member, onAdd, adding }: { member: GroupMember; onAdd: () => void; adding: boolean }) {
  return (
    <div style={{
      display: "flex", alignItems: "center", gap: 8,
      padding: "8px 12px", borderBottom: "1px solid #f3f4f6",
    }}>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 13, fontWeight: 500, color: "#111827", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
          {member.name}
        </div>
        {(member.linkedObjectName || member.description) && (
          <div style={{ fontSize: 11, color: "#6b7280", marginTop: 1 }}>
            {[member.linkedObjectName, member.description || undefined].filter(Boolean).join(" · ")}
          </div>
        )}
      </div>
      <button
        type="button" onClick={onAdd} disabled={adding}
        style={{
          padding: "4px 10px", borderRadius: 6,
          border: "1px solid #c7d2fe",
          background: adding ? "#f3f4f6" : "#eef2ff",
          color: adding ? "#9ca3af" : "#4338ca",
          cursor: adding ? "not-allowed" : "pointer",
          fontSize: 12, fontWeight: 600, flexShrink: 0, whiteSpace: "nowrap",
        }}
      >
        {adding ? "Adding…" : "+ Add"}
      </button>
    </div>
  );
}

// ── Built-in group section ────────────────────────────────────────────────────

function BuiltInGroupSection({
  collectionId, collectionName, endpoint, label, note,
}: {
  collectionId: string;
  collectionName: string;
  endpoint: BuiltInTab;
  label: string;
  note?: string;
}) {
  const [group, setGroup] = React.useState<CollectionGroup | null>(null);
  const [groupLoading, setGroupLoading] = React.useState(true);
  const [groupError, setGroupError] = React.useState<string | null>(null);
  const [creating, setCreating] = React.useState(false);
  const [newGroupDesc, setNewGroupDesc] = React.useState("");

  const [subgroups, setSubgroups] = React.useState<GroupMember[]>([]);
  const [subgroupsLoading, setSubgroupsLoading] = React.useState(false);
  const [removingId, setRemovingId] = React.useState<string | null>(null);

  const [searchQuery, setSearchQuery] = React.useState("");
  const [searchResults, setSearchResults] = React.useState<GroupMember[]>([]);
  const [searchLoading, setSearchLoading] = React.useState(false);
  const [searchPage, setSearchPage] = React.useState(0);
  const [searchTotalPages, setSearchTotalPages] = React.useState(0);
  const [searchTotalElements, setSearchTotalElements] = React.useState(0);
  const [addingId, setAddingId] = React.useState<string | null>(null);
  const searchTimerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  const loadGroup = React.useCallback(async () => {
    setGroupLoading(true);
    setGroupError(null);
    try {
      const g = await getCollectionGroup(collectionId, endpoint);
      setGroup(g);
      if (g) {
        setSubgroupsLoading(true);
        const subs = await listGroupSubgroups(g.id).catch(() => []);
        setSubgroups(subs);
        setSubgroupsLoading(false);
      }
    } catch (e: any) {
      setGroupError(e?.message ?? String(e));
    } finally {
      setGroupLoading(false);
    }
  }, [collectionId, endpoint]);

  React.useEffect(() => { void loadGroup(); }, [loadGroup]);

  const handleCreate = async () => {
    setCreating(true);
    setGroupError(null);
    try {
      const g = await createCollectionGroup(collectionId, endpoint, newGroupDesc || `${collectionName} ${label.toLowerCase()} group`);
      setGroup(g);
      setSubgroups([]);
    } catch (e: any) {
      setGroupError(e?.message ?? String(e));
    } finally {
      setCreating(false);
    }
  };

  const runSearch = async (q: string, page: number) => {
    if (!group) return;
    setSearchLoading(true);
    setSearchPage(page);
    try {
      const res = await searchAddableGroupsForGroup(group.id, q, page);
      setSearchResults(res.members);
      setSearchTotalPages(res.totalPages);
      setSearchTotalElements(res.totalElements);
    } catch {
      setSearchResults([]);
    } finally {
      setSearchLoading(false);
    }
  };

  const handleSearchInput = (v: string) => {
    setSearchQuery(v);
    if (searchTimerRef.current) clearTimeout(searchTimerRef.current);
    searchTimerRef.current = setTimeout(() => void runSearch(v, 0), 350);
  };

  const handleAdd = async (m: GroupMember) => {
    if (!group || !m.selfHref) return;
    setAddingId(m.id);
    try {
      await addSubgroupToGroup(group.id, m.selfHref);
      const subs = await listGroupSubgroups(group.id);
      setSubgroups(subs);
      setSearchResults((prev) => prev.filter((r) => r.id !== m.id));
    } catch (e: any) {
      setGroupError(e?.message ?? "Failed to add group.");
    } finally {
      setAddingId(null);
    }
  };

  const handleRemove = async (m: GroupMember) => {
    if (!group) return;
    setRemovingId(m.id);
    try {
      await removeSubgroupFromGroup(group.id, m.id);
      setSubgroups((prev) => prev.filter((s) => s.id !== m.id));
    } catch (e: any) {
      setGroupError(e?.message ?? "Failed to remove group.");
    } finally {
      setRemovingId(null);
    }
  };

  return (
    <div style={{ display: "grid", gap: 16 }}>
      {note && (
        <div style={{ fontSize: 12, color: "#6b7280", background: "#f8fafc", padding: "7px 12px", borderRadius: 6, border: "1px solid #e2e8f0" }}>
          ℹ️ {note}
        </div>
      )}

      {groupError && <ErrorBox message={groupError} />}
      {groupLoading && <div style={{ color: "#9ca3af", fontSize: 13 }}>Loading…</div>}

      {!groupLoading && !group && (
        <div style={{ border: "1px solid #e5e7eb", borderRadius: 10, padding: 16, background: "#fafafa", display: "grid", gap: 12 }}>
          <div>
            <div style={{ fontWeight: 700, fontSize: 14, color: "#374151" }}>No {label.toLowerCase()} group</div>
            <div style={{ fontSize: 13, color: "#6b7280", marginTop: 4 }}>
              This collection has no {label.toLowerCase()} group yet. Create one to manage access.
            </div>
          </div>
          <div style={{ display: "flex", gap: 10, alignItems: "end" }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 12, color: "#6b7280", marginBottom: 5 }}>Group description (optional)</div>
              <input
                style={inputStyle}
                value={newGroupDesc}
                onChange={(e) => setNewGroupDesc(e.target.value)}
                placeholder={`${collectionName} ${label.toLowerCase()} group`}
                onKeyDown={(e) => { if (e.key === "Enter") void handleCreate(); }}
              />
            </div>
            <Button kind="primary" disabled={creating} onClick={() => void handleCreate()}>
              {creating ? "Creating…" : `Create ${label.toLowerCase()} group`}
            </Button>
          </div>
        </div>
      )}

      {!groupLoading && group && (
        <>
          {/* Group info banner */}
          <div style={{
            padding: "10px 14px", background: "#f0fdf4", border: "1px solid #bbf7d0",
            borderRadius: 8, display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap",
          }}>
            <span style={{ fontSize: 13, fontWeight: 700, color: "#166534" }}>✓ Group active</span>
            <code style={{ fontSize: 11, color: "#6b7280", background: "#f3f4f6", padding: "1px 6px", borderRadius: 4 }}>
              {group.name}
            </code>
            {group.description && <span style={{ fontSize: 12, color: "#6b7280" }}>{group.description}</span>}
          </div>

          {/* Current members */}
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, color: "#374151", marginBottom: 8, display: "flex", alignItems: "center", gap: 8 }}>
              Member groups
              <span style={{ fontSize: 11, fontWeight: 500, padding: "1px 7px", borderRadius: 999, background: "#f3f4f6", color: "#6b7280" }}>
                {subgroups.length}
              </span>
            </div>
            {subgroupsLoading && <div style={{ color: "#9ca3af", fontSize: 13 }}>Loading members…</div>}
            {!subgroupsLoading && subgroups.length === 0 && (
              <div style={{ fontSize: 13, color: "#9ca3af", padding: "12px 14px", border: "1px solid #e5e7eb", borderRadius: 8, background: "#fafafa" }}>
                No groups are currently members. Use the search below to add groups.
              </div>
            )}
            {!subgroupsLoading && subgroups.length > 0 && (
              <div style={{ display: "grid", gap: 6 }}>
                {subgroups.map((m) => (
                  <GroupPill key={m.id} member={m} onRemove={() => void handleRemove(m)} removing={removingId === m.id} />
                ))}
              </div>
            )}
          </div>

          {/* Add group */}
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, color: "#374151", marginBottom: 8 }}>Add group</div>
            <div style={{ display: "flex", gap: 8, marginBottom: 10 }}>
              <input
                style={{ ...inputStyle, flex: 1 }}
                placeholder="Search groups by name…"
                value={searchQuery}
                onChange={(e) => handleSearchInput(e.target.value)}
              />
              <Button onClick={() => void runSearch(searchQuery, 0)} disabled={searchLoading}>
                {searchLoading ? "…" : "Search"}
              </Button>
            </div>

            {searchResults.length > 0 && (
              <div style={{ border: "1px solid #e5e7eb", borderRadius: 8, overflow: "hidden", background: "#fff" }}>
                {searchResults.map((m) => (
                  <AddGroupRow key={m.id} member={m} onAdd={() => void handleAdd(m)} adding={addingId === m.id} />
                ))}
                {searchTotalPages > 1 && (
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 12px", borderTop: "1px solid #f3f4f6", fontSize: 12, color: "#6b7280" }}>
                    <button type="button" onClick={() => void runSearch(searchQuery, searchPage - 1)} disabled={searchPage <= 0 || searchLoading}
                      style={{ padding: "4px 10px", border: "1px solid #d1d5db", borderRadius: 6, background: "#fff", cursor: searchPage <= 0 ? "not-allowed" : "pointer", opacity: searchPage <= 0 ? 0.5 : 1, fontSize: 12 }}>
                      ← Prev
                    </button>
                    <span>Page {searchPage + 1} / {searchTotalPages} · {searchTotalElements.toLocaleString()} groups</span>
                    <button type="button" onClick={() => void runSearch(searchQuery, searchPage + 1)} disabled={searchPage >= searchTotalPages - 1 || searchLoading}
                      style={{ padding: "4px 10px", border: "1px solid #d1d5db", borderRadius: 6, background: "#fff", cursor: searchPage >= searchTotalPages - 1 ? "not-allowed" : "pointer", opacity: searchPage >= searchTotalPages - 1 ? 0.5 : 1, fontSize: 12 }}>
                      Next →
                    </button>
                  </div>
                )}
              </div>
            )}
            {!searchLoading && searchQuery.trim() && searchResults.length === 0 && (
              <div style={{ fontSize: 13, color: "#9ca3af" }}>No groups found for "{searchQuery}" not already in this group.</div>
            )}
            {!searchQuery.trim() && searchResults.length === 0 && (
              <div style={{ fontSize: 12, color: "#9ca3af" }}>Type a group name above to search.</div>
            )}
          </div>
        </>
      )}
    </div>
  );
}

// ── Additional resource policies section ──────────────────────────────────────

function ResourcePoliciesSection({ collectionId }: { collectionId: string }) {
  const [policies, setPolicies] = React.useState<ResourcePolicy[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [deletingId, setDeletingId] = React.useState<number | null>(null);

  // Add-policy form state
  const [showForm, setShowForm] = React.useState(false);
  const [policyName, setPolicyName] = React.useState("");
  const [policyAction, setPolicyAction] = React.useState("READ");
  const [policyStartDate, setPolicyStartDate] = React.useState("");
  const [policyEndDate, setPolicyEndDate] = React.useState("");

  // Group search for the add form
  const [groupQuery, setGroupQuery] = React.useState("");
  const [groupResults, setGroupResults] = React.useState<SearchableGroup[]>([]);
  const [groupLoading, setGroupLoading] = React.useState(false);
  const [selectedGroup, setSelectedGroup] = React.useState<SearchableGroup | null>(null);
  const [saving, setSaving] = React.useState(false);
  const groupTimerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  const loadPolicies = React.useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const p = await getCollectionResourcePolicies(collectionId);
      setPolicies(p);
    } catch (e: any) {
      setError(e?.message ?? String(e));
    } finally {
      setLoading(false);
    }
  }, [collectionId]);

  React.useEffect(() => { void loadPolicies(); }, [loadPolicies]);

  const handleDelete = async (policy: ResourcePolicy) => {
    setDeletingId(policy.id);
    try {
      await deleteResourcePolicy(policy.id);
      setPolicies((prev) => prev.filter((p) => p.id !== policy.id));
    } catch (e: any) {
      setError(e?.message ?? "Failed to delete policy.");
    } finally {
      setDeletingId(null);
    }
  };

  const searchGroupsDebounced = (q: string) => {
    setGroupQuery(q);
    setSelectedGroup(null);
    if (groupTimerRef.current) clearTimeout(groupTimerRef.current);
    if (!q.trim()) { setGroupResults([]); return; }
    groupTimerRef.current = setTimeout(async () => {
      setGroupLoading(true);
      try {
        const res = await searchGroups(q);
        setGroupResults(res.groups);
      } catch {
        setGroupResults([]);
      } finally {
        setGroupLoading(false);
      }
    }, 300);
  };

  const resetForm = () => {
    setPolicyName("");
    setPolicyAction("READ");
    setPolicyStartDate("");
    setPolicyEndDate("");
    setGroupQuery("");
    setGroupResults([]);
    setSelectedGroup(null);
    setShowForm(false);
  };

  const handleSavePolicy = async () => {
    if (!selectedGroup) { setError("Select a group for the policy."); return; }
    setSaving(true);
    setError(null);
    try {
      await createResourcePolicy(collectionId, selectedGroup.id, {
        name: policyName.trim() || undefined,
        action: policyAction,
        startDate: policyStartDate ? `${policyStartDate}T00:00:00Z` : null,
        endDate: policyEndDate ? `${policyEndDate}T00:00:00Z` : null,
      });
      await loadPolicies();
      resetForm();
    } catch (e: any) {
      setError(e?.message ?? "Failed to create policy.");
    } finally {
      setSaving(false);
    }
  };

  const actionColor = (action: string) => {
    if (action === "READ" || action === "DEFAULT_ITEM_READ" || action === "DEFAULT_BITSTREAM_READ") return { bg: "#f0fdf4", color: "#166534", border: "#bbf7d0" };
    if (action === "WRITE") return { bg: "#eff6ff", color: "#1d4ed8", border: "#bfdbfe" };
    if (action === "ADMIN") return { bg: "#fef3c7", color: "#92400e", border: "#fde68a" };
    if (action === "DELETE" || action === "REMOVE") return { bg: "#fff1f0", color: "#cf1322", border: "#ffa39e" };
    return { bg: "#f3f4f6", color: "#374151", border: "#d1d5db" };
  };

  return (
    <div style={{ display: "grid", gap: 16 }}>
      <div style={{ fontSize: 12, color: "#6b7280", background: "#f8fafc", padding: "7px 12px", borderRadius: 6, border: "1px solid #e2e8f0" }}>
        ℹ️ Only <strong>TYPE_SUBMISSION</strong> resource policies are shown and managed here.
      </div>

      {error && <ErrorBox message={error} />}
      {loading && <div style={{ color: "#9ca3af", fontSize: 13 }}>Loading policies…</div>}

      {!loading && policies.length === 0 && (
        <div style={{ fontSize: 13, color: "#9ca3af", padding: "12px 14px", border: "1px solid #e5e7eb", borderRadius: 8, background: "#fafafa" }}>
          No TYPE_SUBMISSION resource policies found.
        </div>
      )}

      {!loading && policies.length > 0 && (
        <div style={{ display: "grid", gap: 6 }}>
          {policies.map((p) => {
            const c = actionColor(p.action);
            return (
              <div key={p.id} style={{
                display: "flex", alignItems: "flex-start", gap: 10,
                padding: "10px 12px", border: "1px solid #e5e7eb",
                borderRadius: 8, background: "#fafafa",
              }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", marginBottom: 4 }}>
                    <span style={{
                      fontSize: 11, fontWeight: 700, padding: "2px 7px", borderRadius: 4,
                      background: c.bg, color: c.color, border: `1px solid ${c.border}`,
                      textTransform: "uppercase", letterSpacing: "0.05em",
                    }}>
                      {p.action}
                    </span>
                    {p.name && <span style={{ fontSize: 13, fontWeight: 600, color: "#1a1a2e" }}>{p.name}</span>}
                    {p.groupName && (
                      <span style={{ fontSize: 12, color: "#6b7280" }}>→ {p.groupName}</span>
                    )}
                  </div>
                  {(p.startDate || p.endDate) && (
                    <div style={{ fontSize: 11, color: "#9ca3af" }}>
                      {p.startDate ? `From ${p.startDate.slice(0, 10)}` : ""}
                      {p.startDate && p.endDate ? " → " : ""}
                      {p.endDate ? `Until ${p.endDate.slice(0, 10)}` : ""}
                    </div>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => void handleDelete(p)}
                  disabled={deletingId === p.id}
                  style={{
                    padding: "3px 8px", borderRadius: 6, border: "1px solid #fecaca",
                    background: deletingId === p.id ? "#f3f4f6" : "#fff7f7",
                    color: deletingId === p.id ? "#9ca3af" : "#dc2626",
                    cursor: deletingId === p.id ? "not-allowed" : "pointer",
                    fontSize: 12, fontWeight: 600, flexShrink: 0,
                  }}
                >
                  {deletingId === p.id ? "…" : "Delete"}
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* Add policy */}
      {!showForm ? (
        <div>
          <Button onClick={() => setShowForm(true)}>+ Add policy</Button>
        </div>
      ) : (
        <div style={{ border: "1px solid #e5e7eb", borderRadius: 10, padding: 16, background: "#fafafa", display: "grid", gap: 12 }}>
          <div style={{ fontWeight: 700, fontSize: 13, color: "#374151" }}>New TYPE_SUBMISSION policy</div>

          {/* Group search */}
          <div>
            <div style={{ fontSize: 12, color: "#6b7280", marginBottom: 5 }}>Group <span style={{ color: "#ef4444" }}>*</span></div>
            {selectedGroup ? (
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ fontSize: 13, fontWeight: 600, color: "#1a1a2e", flex: 1, background: "#eff6ff", padding: "7px 10px", borderRadius: 6, border: "1px solid #bfdbfe" }}>
                  {selectedGroup.name}
                </span>
                <button type="button" onClick={() => setSelectedGroup(null)}
                  style={{ fontSize: 12, color: "#6b7280", background: "none", border: "none", cursor: "pointer" }}>
                  ✕ Change
                </button>
              </div>
            ) : (
              <div style={{ position: "relative" }}>
                <input
                  style={{ ...inputStyle, width: "100%" }}
                  placeholder="Search groups…"
                  value={groupQuery}
                  onChange={(e) => searchGroupsDebounced(e.target.value)}
                />
                {(groupLoading || groupResults.length > 0) && (
                  <div style={{
                    position: "absolute", top: "100%", left: 0, right: 0, zIndex: 50,
                    background: "#fff", border: "1px solid #e5e7eb", borderRadius: 8,
                    boxShadow: "0 4px 12px rgba(0,0,0,0.08)", marginTop: 2, maxHeight: 200, overflowY: "auto",
                  }}>
                    {groupLoading && <div style={{ padding: "10px 12px", fontSize: 12, color: "#9ca3af" }}>Searching…</div>}
                    {!groupLoading && groupResults.map((g) => (
                      <button key={g.id} type="button"
                        onClick={() => { setSelectedGroup(g); setGroupQuery(g.name); setGroupResults([]); }}
                        style={{
                          width: "100%", textAlign: "left", background: "none", border: "none",
                          padding: "9px 12px", fontSize: 13, cursor: "pointer", color: "#111827",
                          borderBottom: "1px solid #f3f4f6",
                        }}>
                        {g.name}
                      </button>
                    ))}
                    {!groupLoading && groupResults.length === 0 && groupQuery.trim() && (
                      <div style={{ padding: "10px 12px", fontSize: 12, color: "#9ca3af" }}>No groups found.</div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Action */}
          <div>
            <div style={{ fontSize: 12, color: "#6b7280", marginBottom: 5 }}>Action</div>
            <select
              value={policyAction}
              onChange={(e) => setPolicyAction(e.target.value)}
              style={{ ...inputStyle, cursor: "pointer" }}
            >
              {POLICY_ACTIONS.map((a) => <option key={a} value={a}>{a}</option>)}
            </select>
          </div>

          {/* Name */}
          <div>
            <div style={{ fontSize: 12, color: "#6b7280", marginBottom: 5 }}>Policy name (optional)</div>
            <input style={inputStyle} value={policyName} onChange={(e) => setPolicyName(e.target.value)} placeholder="e.g. data stewards read" />
          </div>

          {/* Date range */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div>
              <div style={{ fontSize: 12, color: "#6b7280", marginBottom: 5 }}>Start date (optional)</div>
              <input type="date" style={inputStyle} value={policyStartDate} onChange={(e) => setPolicyStartDate(e.target.value)} />
            </div>
            <div>
              <div style={{ fontSize: 12, color: "#6b7280", marginBottom: 5 }}>End date (optional)</div>
              <input type="date" style={inputStyle} value={policyEndDate} onChange={(e) => setPolicyEndDate(e.target.value)} />
            </div>
          </div>

          <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
            <Button onClick={resetForm} disabled={saving}>Cancel</Button>
            <Button kind="primary" disabled={saving || !selectedGroup} onClick={() => void handleSavePolicy()}>
              {saving ? "Saving…" : "Add policy"}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Main modal ────────────────────────────────────────────────────────────────

type MainTab = BuiltInTab | "policies";

type Props = {
  open: boolean;
  collectionId: string;
  collectionName: string;
  onClose: () => void;
};

export default function CollectionPermissionsModal({
  open, collectionId, collectionName, onClose,
}: Props) {
  const [activeTab, setActiveTab] = React.useState<MainTab>("adminGroup");

  React.useEffect(() => {
    if (open) setActiveTab("adminGroup");
  }, [open]);

  if (!open) return null;

  const allTabs: { key: MainTab; label: string }[] = [
    ...BUILT_IN_TABS,
    { key: "policies", label: "Policies" },
  ];

  const activeCfg = BUILT_IN_TABS.find((t) => t.key === activeTab);

  return (
    <ModalShell
      title="Collection permissions"
      subtitle={`Manage permission groups and resource policies for "${collectionName}"`}
      onClose={onClose}
      width={740}
      footer={<Button onClick={onClose}>Close</Button>}
    >
      {/* Tab bar */}
      <div style={{ display: "flex", gap: 4, borderBottom: "1px solid #e5e7eb", marginBottom: 16, flexWrap: "wrap" }}>
        {allTabs.map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => setActiveTab(tab.key)}
            style={{
              padding: "7px 14px", fontSize: 13, fontWeight: activeTab === tab.key ? 700 : 500,
              border: "none", borderBottom: activeTab === tab.key ? "2px solid #2563eb" : "2px solid transparent",
              background: "none", color: activeTab === tab.key ? "#1d4ed8" : "#6b7280",
              cursor: "pointer", marginBottom: -1, whiteSpace: "nowrap",
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {activeTab !== "policies" && activeCfg && (
        <BuiltInGroupSection
          key={`${collectionId}-${activeTab}`}
          collectionId={collectionId}
          collectionName={collectionName}
          endpoint={activeTab as BuiltInTab}
          label={activeCfg.label}
          note={activeCfg.note}
        />
      )}

      {activeTab === "policies" && (
        <ResourcePoliciesSection key={`${collectionId}-policies`} collectionId={collectionId} />
      )}
    </ModalShell>
  );
}
