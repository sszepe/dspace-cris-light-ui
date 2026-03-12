// Generic tree node – covers DSpace communities and collections.
export interface TreeNode {
  id: string;
  name: string;
  handle?: string | null;
  type: "community" | "collection";
  childCount?: number;
}

export function TreeRow({
  node,
  depth,
  expanded,
  selected,
  onToggle,
  onSelect,
  loading,
}: {
  node: TreeNode;
  depth: number;
  expanded: boolean;
  selected: boolean;
  onToggle: () => void;
  onSelect: () => void;
  loading?: boolean;
}) {
  const hasKids =
    node.type === "community" &&
    (node.childCount == null || node.childCount > 0);

  const isCollection = node.type === "collection";

  return (
    <div
      style={{
        display: "flex",
        alignItems: "flex-start",
        gap: 8,
        padding: "6px 10px",
        borderRadius: 6,
        background: selected ? "#f0f4ff" : "transparent",
        cursor: "default",
        transition: "background 0.12s",
      }}
    >
      {/* indent */}
      <div style={{ minWidth: depth * 20, flexShrink: 0 }} />

      {/* toggle button */}
      <button
        disabled={!hasKids}
        onClick={hasKids ? onToggle : undefined}
        title={!hasKids ? "No children" : expanded ? "Collapse" : "Expand"}
        style={{
          width: 22,
          height: 22,
          flexShrink: 0,
          border: "none",
          background: "none",
          cursor: hasKids ? "pointer" : "default",
          color: hasKids ? "#555" : "#ccc",
          fontSize: 13,
          padding: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginTop: 1,
        }}
      >
        {loading ? "⋯" : hasKids ? (expanded ? "▾" : "▸") : "·"}
      </button>

      {/* label */}
      <div
        onClick={onSelect}
        style={{ cursor: "pointer", flex: 1, minWidth: 0 }}
        title={node.handle ?? node.name}
      >
        <div
          style={{
            display: "flex",
            gap: 8,
            alignItems: "center",
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
              background: isCollection ? "#e8f4fd" : "#eef2ff",
              color: isCollection ? "#1a6fa8" : "#4338ca",
              whiteSpace: "nowrap",
            }}
          >
            {isCollection ? "Collection" : "Community"}
          </span>

          {node.handle && (
            <code style={{ fontSize: 11, color: "#888" }}>{node.handle}</code>
          )}
        </div>

        <div
          style={{
            fontSize: 13,
            fontWeight: isCollection ? 400 : 500,
            color: "#1a1a2e",
            marginTop: 2,
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {node.name}
        </div>

        {node.childCount != null && node.childCount > 0 && (
          <div style={{ fontSize: 12, color: "#888" }}>
            {node.childCount} {node.childCount === 1 ? "child" : "children"}
          </div>
        )}
      </div>
    </div>
  );
}
