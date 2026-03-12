import { Button } from "./button";

export type Chip = { key: string; label: string };

export function StatusChips({
  chips,
  active,
  onChange,
}: {
  chips: Chip[];
  active: string;
  onChange: (key: string) => void;
}) {
  return (
    <div className="chips">
      {chips.map((c) => (
        <Button
          key={c.key}
          disabled={active === c.key}
          onClick={() => onChange(c.key)}
        >
          {c.label}
        </Button>
      ))}
    </div>
  );
}
