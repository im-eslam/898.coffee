import type { AddOn, RawCategory, RawMenuResponse, RawPairing, RawPriceOption, RawPricing, RawProduct } from "@/shared/menu";

export type WithUid<T> = T & { uid: string };

export type DraftAddOn = WithUid<AddOn>;

export type DraftOption = WithUid<RawPriceOption>;

export interface DraftPricing extends Omit<RawPricing, "options"> {
  options: DraftOption[];
}

export interface DraftProduct extends Omit<RawProduct, "pricing" | "baristaWay"> {
  uid: string;
  baristaWay: string[];
  pricing: DraftPricing;
}

export interface DraftCategory extends Omit<RawCategory, "products"> {
  uid: string;
  products: DraftProduct[];
}

export type DraftPairing = WithUid<RawPairing>;

export interface MenuDraft extends Omit<
  RawMenuResponse,
  "ok" | "addOns" | "categories" | "pairings"
> {
  addOns: DraftAddOn[];
  categories: DraftCategory[];
  pairings: DraftPairing[];
}

export interface MenuIssue {
  path: string;
  code: string;
  message: string;
}

export const MIN_SIZES = 2;
export const MAX_SIZES = 10;
