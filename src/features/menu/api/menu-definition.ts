import type { Localized } from "@/shared/i18n";
import type { Availability, BadgeKind } from "../types/menu";

export interface RawAddOn {
  name: Localized<string>;
  price: number;
}

export interface RawPriceOption {
  id: string;
  name: Localized<string> | null;
  price: number;
  discount: number;
  final: number;
}

export interface RawPricing {
  type: "single" | "sizes";
  options: RawPriceOption[];
}

export interface RawProduct {
  id: string;
  name: Localized<string>;
  description: Localized<string>;
  image: string | null;
  availability: Availability;
  badge: BadgeKind | null;
  addOns: string[];
  baristaWay: string[] | null;
  oftenOrderedWith: string[];
  pricing: RawPricing;
}

export interface RawCategory {
  id: string;
  name: Localized<string>;
  products: RawProduct[];
}

export interface RawPairing {
  id: string;
  items: string[];
  pricing: { price: number; discount: number; final: number };
}

export interface RawMenuResponse {
  ok: true;
  updatedAt: string;
  currency: string;
  badges: BadgeKind[];
  addOns: Record<string, RawAddOn>;
  categories: RawCategory[];
  signatures: string[];
  pairings: RawPairing[];
  popup: { enabled: boolean; image: string | null; delaySeconds: number };
}
