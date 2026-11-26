import React, { createContext, useContext } from "react";
import { ArrowDown, ArrowUp } from "lucide-react";
import type { SortDescriptor } from "../../../types/react-aria-components";

// Context for sorting
interface TableContextValue {
  sortDescriptor?: SortDescriptor;
  onSortChange?: (descriptor: SortDescriptor) => void;
}

const TableContext = createContext<TableContextValue>({});

// ==========================================
// TableCard Components
// ==========================================
export interface TableCardRootProps {
  children: React.ReactNode;
  className?: string;
}

export const TableCardRoot: React.FC<TableCardRootProps> = ({ children, className = "" }) => {
  return (
    <div
      className={`relative w-full overflow-hidden rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm ${className}`}
    >
      {children}
    </div>
  );
};

export interface TableCardHeaderProps {
  title: string;
  description?: string;
  contentTrailing?: React.ReactNode;
  className?: string;
}

export const TableCardHeader: React.FC<TableCardHeaderProps> = ({
  title,
  description,
  contentTrailing,
  className = "",
}) => {
  return (
    <div
      className={`relative px-4 py-5 md:px-6 border-b border-slate-200 dark:border-slate-800 ${className}`}
    >
      <div className="pr-12 md:pr-14">
        <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">{title}</h3>
        {description && (
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{description}</p>
        )}
      </div>
      {contentTrailing}
    </div>
  );
};

export const TableCard = {
  Root: TableCardRoot,
  Header: TableCardHeader,
};

// ==========================================
// Table Components
// ==========================================
export interface TableProps {
  children: React.ReactNode;
  "aria-label"?: string;
  selectionMode?: "none" | "single" | "multiple";
  sortDescriptor?: SortDescriptor;
  onSortChange?: (descriptor: SortDescriptor) => void;
  className?: string;
}

export const TableRoot: React.FC<TableProps> = ({
  children,
  sortDescriptor,
  onSortChange,
  className = "",
  ...props
}) => {
  return (
    <TableContext.Provider value={{ sortDescriptor, onSortChange }}>
      <div className="w-full overflow-x-auto">
        <table className={`w-full text-left border-collapse ${className}`} {...props}>
          {children}
        </table>
      </div>
    </TableContext.Provider>
  );
};

export interface TableHeaderProps {
  children: React.ReactNode;
  className?: string;
}

export const TableHeader: React.FC<TableHeaderProps> = ({ children, className = "" }) => {
  return (
    <thead
      className={`border-b border-slate-200 dark:border-slate-800 text-xs font-medium text-slate-500 dark:text-slate-400 ${className}`}
    >
      <tr>{children}</tr>
    </thead>
  );
};

export interface TableHeadProps {
  id?: string;
  label?: React.ReactNode;
  isRowHeader?: boolean;
  allowsSorting?: boolean;
  className?: string;
  children?: React.ReactNode;
}

export const TableHead: React.FC<TableHeadProps> = ({
  id,
  label,
  allowsSorting = false,
  className = "",
  children,
}) => {
  const { sortDescriptor, onSortChange } = useContext(TableContext);

  const isSorted = id && sortDescriptor?.column === id;
  const isAsc = isSorted && sortDescriptor?.direction === "ascending";

  const handleClick = () => {
    if (!allowsSorting || !id || !onSortChange) return;
    onSortChange({
      column: id,
      direction: isSorted && isAsc ? "descending" : "ascending",
    });
  };

  return (
    <th
      scope="col"
      className={`px-4 py-3 md:px-6 select-none ${allowsSorting ? "cursor-pointer hover:text-slate-900 dark:hover:text-slate-100" : ""} ${className}`}
      onClick={handleClick}
    >
      <div className="flex items-center gap-1.5">
        <span>{label ?? children}</span>
        {allowsSorting && id && (
          <span className="inline-flex text-slate-400">
            {isSorted ? (
              isAsc ? (
                <ArrowUp size={14} />
              ) : (
                <ArrowDown size={14} />
              )
            ) : (
              <span className="w-3.5 h-3.5 inline-block opacity-0 group-hover:opacity-100" />
            )}
          </span>
        )}
      </div>
    </th>
  );
};

export interface TableBodyProps<T = any> {
  items?: T[];
  children: React.ReactNode | ((item: T) => React.ReactNode);
  className?: string;
}

export function TableBody<T = any>({ items, children, className = "" }: TableBodyProps<T>) {
  if (items && typeof children === "function") {
    return (
      <tbody className={`divide-y divide-slate-200 dark:divide-slate-800 text-sm ${className}`}>
        {items.map((item, index) => children(item))}
      </tbody>
    );
  }

  return (
    <tbody className={`divide-y divide-slate-200 dark:divide-slate-800 text-sm ${className}`}>
      {children as React.ReactNode}
    </tbody>
  );
}

export interface TableRowProps {
  id?: string | number;
  children: React.ReactNode;
  className?: string;
}

export const TableRow: React.FC<TableRowProps> = ({ children, className = "" }) => {
  return (
    <tr
      className={`transition-colors hover:bg-slate-50/70 dark:hover:bg-slate-800/40 ${className}`}
    >
      {children}
    </tr>
  );
};

export interface TableCellProps {
  children?: React.ReactNode;
  className?: string;
}

export const TableCell: React.FC<TableCellProps> = ({ children, className = "" }) => {
  return <td className={`px-4 py-4 md:px-6 align-middle ${className}`}>{children}</td>;
};

export const Table = Object.assign(TableRoot, {
  Header: TableHeader,
  Head: TableHead,
  Body: TableBody,
  Row: TableRow,
  Cell: TableCell,
});

export default Table;
