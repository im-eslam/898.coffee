export type SaveStatus = "idle" | "saving" | "saved" | "error";

export const MENU_TABS = [
  "products",
  "categories",
  "addons",
  "signatures",
  "pairings",
  "popup",
  "general",
] as const;

export type MenuTabKey = (typeof MENU_TABS)[number];

export const DEFAULT_MENU_TAB: MenuTabKey = "products";
