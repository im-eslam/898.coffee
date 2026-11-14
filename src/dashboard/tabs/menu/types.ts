import type { Localized } from "@/shared/i18n";
import type {
  Availability,
  BadgeKind,
  PairingPricing,
  Popup,
} from "@/features/menu/types/menu";

/*
 * The shared `Menu` type is the storefront's resolved view (objects instead of
 * ids, broken references already dropped). The admin needs the wire shape with
 * ids intact so broken references stay visible until the admin saves.
 * `uid` is a client-only key: new entries all have `id: ""` until the server
 * assigns one.
 */

export interface DraftAddOn {
  uid: string;
  id: string;
  name: Localized<string>;
  price: number;
}

export interface DraftOption {
  uid: string;
  id: string;
  name: Localized<string> | null;
  price: number;
  discount: number;
  final: number;
}

export interface DraftPricing {
  type: "single" | "sizes";
  options: DraftOption[];
}

export interface DraftProduct {
  uid: string;
  id: string;
  name: Localized<string>;
  description: Localized<string>;
  image: string | null;
  availability: Availability;
  badge: BadgeKind | null;
  addOns: string[];
  baristaWay: string[] | null;
  oftenOrderedWith: string[];
  pricing: DraftPricing;
}

export interface DraftCategory {
  uid: string;
  id: string;
  name: Localized<string>;
  products: DraftProduct[];
}

export interface DraftPairing {
  uid: string;
  id: string;
  items: string[];
  pricing: PairingPricing;
}

export interface MenuDraft {
  updatedAt: string;
  currency: string;
  badges: BadgeKind[];
  addOns: DraftAddOn[];
  categories: DraftCategory[];
  signatures: string[];
  pairings: DraftPairing[];
  popup: Popup;
}

export interface MenuIssue {
  path: string;
  code: string;
  message: string;
}

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

export const MAX_SIZES = 10;
export const MIN_SIZES = 2;
