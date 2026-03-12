import { Button } from "./button";

export function SearchBar({
  value,
  onChange,
  onSearch,
  placeholder = "Search…",
}: {
  value: string;
  onChange: (v: string) => void;
  onSearch: () => void;
  placeholder?: string;
}) {
  return (
    <div className="searchbar">
      <input
        className="input"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
      />
      <Button onClick={onSearch}>Search</Button>
    </div>
  );
}
