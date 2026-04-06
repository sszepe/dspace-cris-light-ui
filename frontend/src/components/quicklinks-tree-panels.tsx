/**
 * quicklinks-tree-panels.tsx
 *
 * Two lazily-loaded tree panels that slot into the Quicklinks right column:
 *
 *   ArchivalResourceTreePanel
 *     - Roots: fonds-level items (f.ara.isad.level=fonds)
 *       plus items with no ara.isad.level (ungrouped)
 *     - Children: items where mdwrepo.archivalresource.parent={uuid}
 *     - Level + item-type filter chips mirror the sidebar facets
 *     - Clicking a node opens the item detail page
 *
 *   ConceptSchemeTreePanel
 *     - Roots: ConceptScheme items (from the results already fetched by the
 *       parent page, passed in as `schemes`)
 *     - Children per scheme: Concepts where skos.inScheme={uuid}
 *     - Clicking a concept opens the item detail page
 *     - Clicking a scheme name filters the results list to that scheme
 */

import React from "react";
import { apiFetch } from "../auth/client";
import { routes } from "../navigation/hash";

// ── Shared API helpers ────────────────────────────────────────────────────────

type SlimItem = {
  uuid: string;
  name: string;
  dcType: string | null;
  level: string | null;
  itemType: string | null;
  childCount?: number;        // estimated from DSpace search; -1 = unknown
};

/** Build a raw query-string (bypassing URLSearchParams encoding issues). */
function qs(params: Record<string, string | string[]>): string {
  const parts: string[] = [];
  for (const [k, v] of Object.entries(params)) {
    if (Array.isArray(v)) v.forEach((val) => parts.push(`${encodeURIComponent(k)}=${encodeURIComponent(val)}`));
    else parts.push(`${encodeURIComponent(k)}=${encodeURIComponent(v)}`);
  }
  return parts.join("&");
}

async function discoverItems(
  extraFilters: string,          // raw pre-encoded filter segments
  size = 50,
): Promise<SlimItem[]> {
  const base = qs({ sort: "dc.title,ASC", page: "0", size: String(size), projection: "preventMetadataSecurity" });
  const data = await apiFetch<any>(`/api/discover/search/objects?${base}&${extraFilters}`);
  const objects: any[] = data?._embedded?.searchResult?._embedded?.objects ?? [];
  return objects.map((o) => {
    const item = o?._embedded?.indexableObject;
    if (!item?.uuid) return null;
    const meta = item.metadata ?? {};
    return {
      uuid:      item.uuid,
      name:      item.name ?? meta["dc.title"]?.[0]?.value ?? "(untitled)",
      dcType:    meta["dc.type"]?.[0]?.value ?? null,
      level:     meta["ara.isad.level"]?.[0]?.value ?? null,
      itemType:  meta["ara.item.type"]?.[0]?.value ?? null,
      childCount: -1,
    } as SlimItem;
  }).filter(Boolean) as SlimItem[];
}

// ─────────────────────────────────────────────────────────────────────────────
// ArchivalResourceTreePanel
// ─────────────────────────────────────────────────────────────────────────────

// ISAD(G) level order for visual hierarchy
const LEVEL_ORDER = ["fonds", "subfonds", "series", "subseries", "file", "item"];

function levelColor(level: string | null): string {
  switch (level) {
    case "fonds":     return "#7c3aed";
    case "subfonds":  return "#6366f1";
    case "series":    return "#2563eb";
    case "subseries": return "#0891b2";
    case "file":      return "#059669";
    case "item":      return "#d97706";
    default:          return "#6b7280";
  }
}

type AraChildState = {
  loading: boolean;
  loaded: boolean;
  items: SlimItem[];
  error: string | null;
};

function ArchivalTreeNode({
  item,
  depth,
  levelFilter,
  typeFilter,
  onOpen,
}: {
  item: SlimItem;
  depth: number;
  levelFilter: string[];
  typeFilter: string[];
  onOpen: (uuid: string) => void;
}) {
  const [expanded, setExpanded] = React.useState(false);
  const [childState, setChildState] = React.useState<AraChildState>({
    loading: false, loaded: false, items: [], error: null,
  });

  async function loadChildren() {
    if (childState.loaded || childState.loading) return;
    setChildState((s) => ({ ...s, loading: true, error: null }));
    try {
      // Children: items where parent = this uuid
      const parentFilter = `f.mdwrepo.archivalresource.parent=${encodeURIComponent(item.uuid + ",equals")}`;
      const entityFilter = "f.entityType=ArchivalResource%2Cequals";
      const children = await discoverItems(`${entityFilter}&${parentFilter}`, 100);
      setChildState({ loading: false, loaded: true, items: children, error: null });
    } catch (e: any) {
      setChildState({ loading: false, loaded: false, items: [], error: e?.message ?? "Error" });
    }
  }

  function toggle() {
    if (!expanded) loadChildren();
    setExpanded((v) => !v);
  }

  // Apply level / type filters to children
  const visibleChildren = childState.items.filter((c) => {
    if (levelFilter.length > 0 && c.level && !levelFilter.includes(c.level)) return false;
    if (typeFilter.length > 0 && c.itemType && !typeFilter.includes(c.itemType)) return false;
    return true;
  });

  const indent = depth * 18;
  const lc = levelColor(item.level);

  return (
    <>
      <div
        className="ql-tree-row"
        style={{ paddingLeft: indent + 8 }}
        onClick={(e) => { e.stopPropagation(); onOpen(item.uuid); }}
      >
        {/* Expand toggle */}
        <button
          type="button"
          className="ql-tree-toggle"
          onClick={(e) => { e.stopPropagation(); toggle(); }}
          title={expanded ? "Collapse" : "Expand children"}
        >
          {childState.loading ? "⋯" : expanded ? "▾" : "▸"}
        </button>

        {/* Level badge */}
        {item.level && (
          <span className="ql-tree-badge" style={{ background: lc + "18", color: lc, borderColor: lc + "40" }}>
            {item.level}
          </span>
        )}

        {/* Item type badge */}
        {item.itemType && (
          <span className="ql-tree-badge ql-tree-badge--type">
            {item.itemType}
          </span>
        )}

        {/* Name */}
        <span className="ql-tree-name">{item.name}</span>
      </div>

      {/* Children */}
      {expanded && childState.loaded && visibleChildren.map((child) => (
        <ArchivalTreeNode
          key={child.uuid}
          item={child}
          depth={depth + 1}
          levelFilter={levelFilter}
          typeFilter={typeFilter}
          onOpen={onOpen}
        />
      ))}

      {expanded && childState.loaded && visibleChildren.length === 0 && (
        <div className="ql-tree-empty" style={{ paddingLeft: indent + 44 }}>
          No children{levelFilter.length || typeFilter.length ? " matching current filters" : ""}.
        </div>
      )}

      {expanded && childState.error && (
        <div className="ql-tree-error" style={{ paddingLeft: indent + 44 }}>
          {childState.error}
        </div>
      )}
    </>
  );
}

export function ArchivalResourceTreePanel({
  effectiveFilters,
  query,
  onOpen,
}: {
  effectiveFilters: Record<string, string[]>;
  query: string;
  onOpen: (uuid: string) => void;
}) {
  const [roots, setRoots] = React.useState<SlimItem[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [loaded, setLoaded] = React.useState(false);

  // Active level/type filters from the sidebar
  const levelFilter = effectiveFilters["ara.isad.level"] ?? [];
  const typeFilter  = effectiveFilters["ara.item.type"]  ?? [];

  // Determine which DSpace levels to fetch as roots:
  // If user has selected specific levels, show items of those levels that have no parent.
  // Otherwise show fonds (and any items without a parent/level).
  const rootLevels = levelFilter.length > 0
    ? levelFilter
    : ["fonds"];

  const filtersKey = JSON.stringify({ rootLevels, query });

  React.useEffect(() => {
    let alive = true;
    setLoading(true);
    setError(null);
    setLoaded(false);
    setRoots([]);

    (async () => {
      try {
        const entityFilter = "f.entityType=ArchivalResource%2Cequals";
        let allRoots: SlimItem[] = [];

        if (rootLevels.length === 1) {
          const levelParam = `f.ara.isad.level=${encodeURIComponent(rootLevels[0] + ",equals")}`;
          const q = query.trim() ? `&query=${encodeURIComponent(query.trim())}` : "";
          allRoots = await discoverItems(`${entityFilter}&${levelParam}${q}`, 100);
        } else {
          // Multiple levels — fetch each and merge
          const results = await Promise.all(
            rootLevels.map((lvl) => {
              const levelParam = `f.ara.isad.level=${encodeURIComponent(lvl + ",equals")}`;
              const q = query.trim() ? `&query=${encodeURIComponent(query.trim())}` : "";
              return discoverItems(`${entityFilter}&${levelParam}${q}`, 100);
            }),
          );
          allRoots = results.flat();
        }

        // Sort by ISAD level then name
        allRoots.sort((a, b) => {
          const la = LEVEL_ORDER.indexOf(a.level ?? "");
          const lb = LEVEL_ORDER.indexOf(b.level ?? "");
          if (la !== lb) return la - lb;
          return (a.name ?? "").localeCompare(b.name ?? "");
        });

        if (alive) { setRoots(allRoots); setLoaded(true); }
      } catch (e: any) {
        if (alive) setError(e?.message ?? "Failed to load archival tree");
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => { alive = false; };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filtersKey]);

  return (
    <div className="ql-tree-panel">
      {/* Active filter pills */}
      {(levelFilter.length > 0 || typeFilter.length > 0) && (
        <div className="ql-tree-filter-bar">
          <span className="ql-tree-filter-label">Filtered:</span>
          {levelFilter.map((l) => (
            <span key={l} className="ql-tree-filter-chip ql-tree-filter-chip--level">{l}</span>
          ))}
          {typeFilter.map((t) => (
            <span key={t} className="ql-tree-filter-chip ql-tree-filter-chip--type">{t}</span>
          ))}
        </div>
      )}

      {loading && <div className="ql-tree-status">Loading archival tree…</div>}
      {error   && <div className="ql-tree-error-banner">{error}</div>}

      {loaded && roots.length === 0 && (
        <div className="ql-tree-status">
          No {rootLevels.join(" / ")} items found{query ? ` for "${query}"` : ""}.
        </div>
      )}

      {loaded && roots.length > 0 && (
        <div className="ql-tree-body">
          {roots.map((r) => (
            <ArchivalTreeNode
              key={r.uuid}
              item={r}
              depth={0}
              levelFilter={[]}    // children are not further filtered by level at render time
              typeFilter={typeFilter}
              onOpen={onOpen}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ConceptSchemeTreePanel
// ─────────────────────────────────────────────────────────────────────────────

type ConceptChildState = {
  loading: boolean;
  loaded: boolean;
  concepts: SlimItem[];
  error: string | null;
};

function ConceptSchemeNode({
  scheme,
  onOpenConcept,
  onFilterByScheme,
}: {
  scheme: SlimItem;
  onOpenConcept: (uuid: string) => void;
  onFilterByScheme: (schemeName: string) => void;
}) {
  const [expanded, setExpanded] = React.useState(false);
  const [state, setState] = React.useState<ConceptChildState>({
    loading: false, loaded: false, concepts: [], error: null,
  });

  async function loadConcepts() {
    if (state.loaded || state.loading) return;
    setState((s) => ({ ...s, loading: true, error: null }));
    try {
      // Concepts where skos.inScheme = this scheme's name/UUID
      const schemeFilter = `f.entityType=Concept%2Cequals&f.skos.inScheme=${encodeURIComponent(scheme.name + ",equals")}`;
      const concepts = await discoverItems(schemeFilter, 200);
      // Sort by broader hierarchy: top-level concepts first (skos.broader is empty)
      setState({ loading: false, loaded: true, concepts, error: null });
    } catch (e: any) {
      setState({ loading: false, loaded: false, concepts: [], error: e?.message ?? "Error" });
    }
  }

  function toggle() {
    if (!expanded) loadConcepts();
    setExpanded((v) => !v);
  }

  return (
    <>
      {/* Scheme row */}
      <div className="ql-tree-row ql-tree-row--scheme">
        <button type="button" className="ql-tree-toggle" onClick={toggle}>
          {state.loading ? "⋯" : expanded ? "▾" : "▸"}
        </button>
        <span className="ql-tree-badge" style={{ background: "#f0fdf4", color: "#15803d", borderColor: "#bbf7d0" }}>
          scheme
        </span>
        <span
          className="ql-tree-name ql-tree-name--scheme"
          onClick={() => onFilterByScheme(scheme.name)}
          title="Click to filter results by this scheme"
        >
          {scheme.name}
        </span>
        <a
          href={routes.item(scheme.uuid)}
          className="ql-tree-link"
          onClick={(e) => e.stopPropagation()}
          title="Open scheme detail"
        >
          ↗
        </a>
      </div>

      {/* Concepts */}
      {expanded && state.loaded && state.concepts.length === 0 && (
        <div className="ql-tree-empty" style={{ paddingLeft: 44 }}>No concepts in this scheme.</div>
      )}

      {expanded && state.loaded && state.concepts.map((c) => (
        <ConceptNode
          key={c.uuid}
          concept={c}
          allConcepts={state.concepts}
          depth={1}
          onOpen={onOpenConcept}
        />
      ))}

      {expanded && state.error && (
        <div className="ql-tree-error" style={{ paddingLeft: 44 }}>{state.error}</div>
      )}
    </>
  );
}

/**
 * A concept node. Renders its name + dc.type badge.
 * Narrower/broader hierarchy is flattened here (DSpace Discover doesn't give us
 * the tree in one call); we render a flat indented list sorted by dc.title.
 */
function ConceptNode({
  concept,
  allConcepts: _allConcepts,
  depth,
  onOpen,
}: {
  concept: SlimItem;
  allConcepts: SlimItem[];
  depth: number;
  onOpen: (uuid: string) => void;
}) {
  const indent = depth * 18;
  return (
    <div
      className="ql-tree-row ql-tree-row--concept"
      style={{ paddingLeft: indent + 8 }}
      onClick={() => onOpen(concept.uuid)}
    >
      <span className="ql-tree-dot">·</span>
      {concept.dcType && (
        <span className="ql-tree-badge ql-tree-badge--type">{concept.dcType}</span>
      )}
      <span className="ql-tree-name">{concept.name}</span>
    </div>
  );
}

export function ConceptSchemeTreePanel({
  schemes,
  schemesLoading,
  onOpenItem,
  onFilterByScheme,
}: {
  /** ConceptScheme rows from the parent's search results */
  schemes: Array<{ uuid: string; name: string }>;
  schemesLoading: boolean;
  onOpenItem: (uuid: string) => void;
  onFilterByScheme: (schemeName: string) => void;
}) {
  return (
    <div className="ql-tree-panel">
      {schemesLoading && <div className="ql-tree-status">Loading schemes…</div>}

      {!schemesLoading && schemes.length === 0 && (
        <div className="ql-tree-status">No concept schemes found.</div>
      )}

      {schemes.length > 0 && (
        <div className="ql-tree-body">
          {schemes.map((s) => (
            <ConceptSchemeNode
              key={s.uuid}
              scheme={{ uuid: s.uuid, name: s.name, dcType: null, level: null, itemType: null }}
              onOpenConcept={onOpenItem}
              onFilterByScheme={onFilterByScheme}
            />
          ))}
        </div>
      )}
    </div>
  );
}
