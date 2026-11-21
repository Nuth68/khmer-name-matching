export type SortDirection = "ascending" | "descending";

export interface SortDescriptor {
  column?: string | number;
  direction?: SortDirection;
}
