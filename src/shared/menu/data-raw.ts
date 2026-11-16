import type { Localized } from "@/shared/i18n";
import type {
  Availability,
  BadgeKind,
  PairingPricing,
  Popup,
  PriceOption,
  Pricing,
} from "./data-config";

export interface RawAddOn {
  name: Localized<string>;
  price: number;
}

export type RawPriceOption = PriceOption;

export type RawPricing = Pricing;

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
  pricing: PairingPricing;
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
  popup: Popup;
}
