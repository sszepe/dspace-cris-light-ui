import React from "react";

const HEADER: React.CSSProperties = {
  width: "100%",
  padding: "12px 16px",
  border: "none",
  background: "transparent",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  cursor: "pointer",
  fontWeight: 700,
  color: "#243447",
};

export function BNFacetSection({
  title,
  children,
  defaultOpen = true,
}: {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = React.useState(defaultOpen);

  return (
    <div
      style={{
        border: "1px solid #cfd8e3",
        borderRadius: 8,
        background: "#dfe8f0",
      }}
    >
      <button type="button" style={HEADER} onClick={() => setOpen((v) => !v)}>
        <span>{title}</span>
        <span>{open ? "-" : "+"}</span>
      </button>
      {open && <div style={{ padding: "0 16px 16px" }}>{children}</div>}
    </div>
  );
}
