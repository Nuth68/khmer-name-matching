import React, { useState, useRef, useEffect } from "react";
import { MoreVertical } from "lucide-react";

export interface DropdownIconSimpleProps {
  className?: string;
  onEdit?: () => void;
  onDelete?: () => void;
  onCopy?: () => void;
}

export const DropdownIconSimple: React.FC<DropdownIconSimpleProps> = ({
  className = "",
  onEdit,
  onDelete,
  onCopy,
}) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    if (open) {
      document.addEventListener("mousedown", handleOutside);
      return () => document.removeEventListener("mousedown", handleOutside);
    }
  }, [open]);

  return (
    <div className={`relative inline-flex items-center ${className}`} ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="w-8 h-8 inline-flex items-center justify-center rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        aria-label="Actions"
        aria-expanded={open}
      >
        <MoreVertical size={18} />
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-1 w-36 py-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg shadow-lg z-50 animate-in fade-in zoom-in-95">
          <button
            type="button"
            className="w-full text-left px-3 py-1.5 text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
            onClick={() => {
              setOpen(false);
              onEdit?.();
            }}
          >
            Edit
          </button>
          <button
            type="button"
            className="w-full text-left px-3 py-1.5 text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
            onClick={() => {
              setOpen(false);
              onCopy?.();
            }}
          >
            Copy link
          </button>
          <div className="h-px bg-slate-100 dark:bg-slate-800 my-1" />
          <button
            type="button"
            className="w-full text-left px-3 py-1.5 text-xs text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30"
            onClick={() => {
              setOpen(false);
              onDelete?.();
            }}
          >
            Delete
          </button>
        </div>
      )}
    </div>
  );
};

export default DropdownIconSimple;
