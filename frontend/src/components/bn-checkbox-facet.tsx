export function BNCheckboxFacet({
  label,
  count,
  checked,
  onChange,
}: {
  label: string;
  count: number;
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <label
      style={{
        display: "flex",
        gap: 8,
        alignItems: "flex-start",
        cursor: "pointer",
        marginBottom: 6,
      }}
    >
      <input type="checkbox" checked={checked} onChange={onChange} />
      <span style={{ fontSize: 14, lineHeight: 1.35 }}>
        {label} <span style={{ color: "#667085" }}>({count})</span>
      </span>
    </label>
  );
}
