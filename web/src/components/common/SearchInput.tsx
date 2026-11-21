import { useRef } from "react";
import { Search, X } from "lucide-react";

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  autoFocus?: boolean;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  size?: "sm" | "md" | "lg";
}

export default function SearchInput({
  value,
  onChange,
  placeholder = "Search what you need…",
  className = "",
  autoFocus = false,
  onKeyDown,
  size = "md",
}: SearchInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleClear = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onChange("");
    inputRef.current?.focus();
  };

  return (
    <div className={`app-search-box size-${size} ${value ? "has-value" : ""} ${className}`}>
      <Search size={size === "lg" ? 20 : 16} className="app-search-icon" />
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        autoFocus={autoFocus}
        onKeyDown={onKeyDown}
        className="app-search-input"
      />
      {value ? (
        <button
          type="button"
          onClick={handleClear}
          className="app-search-clear"
          aria-label="Clear search"
          title="Reset search"
        >
          <X size={12} strokeWidth={2.8} />
        </button>
      ) : null}
    </div>
  );
}
