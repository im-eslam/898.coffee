import type { Localized } from "@/shared/i18n";
import type {
  Availability,
  BadgeKind,
  PairingPricing,
  Popup,
} from "@/features/menu/types/menu";
import type { MenuDraft, MenuIssue } from "../types/draft";

export interface WireAddOn {
  id: string;
  name: Localized<string>;
  price: number;
}

export interface WirePriceOption {
  id: string;
  name: Localized<string> | null;
  price: number;
  discount: number;
  final: number;
}

export interface WirePricing {
  type: "single" | "sizes";
  options: WirePriceOption[];
}

export interface WireProduct {
  id: string;
  name: Localized<string>;
  description: Localized<string>;
  image: string | null;
  availability: Availability;
  badge: BadgeKind | null;
  addOns: string[];
  baristaWay: string[] | null;
  oftenOrderedWith: string[];
  pricing: WirePricing;
}

export interface WireCategory {
  id: string;
  name: Localized<string>;
  products: WireProduct[];
}

export interface WirePairing {
  id: string;
  items: string[];
  pricing: PairingPricing;
}

export interface MenuWirePayload {
  updatedAt: string;
  currency: string;
  badges: BadgeKind[];
  addOns: WireAddOn[];
  categories: WireCategory[];
  signatures: string[];
  pairings: WirePairing[];
  popup: Popup;
}

export interface MenuSnapshot {
  menu: MenuDraft;
  etag: string;
  warnings: MenuIssue[];
}
