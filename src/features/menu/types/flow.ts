export type MenuPanel = "search" | "categories" | "product" | "pairing" | null;

export interface SheetSelection<T> {
  item: T;
  key: number;
}

export interface NavSection {
  id: string;
  label: string;
}
