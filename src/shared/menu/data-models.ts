import type { Localized } from "@/shared/i18n";
import type {
  Availability,
  BadgeKind,
  PairingPricing,
  Popup,
  Pricing,
} from "./data-config";

export interface AddOn {
  id: string;
  name: Localized<string>;
  price: number;
}

export interface ProductRef {
  id: string;
  name: Localized<string>;
  image: string | null;
  availability: Availability;
  badge: BadgeKind | null;
  pricing: Pricing;
}

export interface Product extends ProductRef {
  description: Localized<string>;
  addOns: AddOn[];
  baristaWay: AddOn[];
  oftenOrderedWith: ProductRef[];
}

export interface Category {
  id: string;
  name: Localized<string>;
  products: Product[];
}

export interface Pairing {
  id: string;
  items: Product[];
  pricing: PairingPricing;
}

export interface Menu {
  updatedAt: string;
  currency: string;
  badges: BadgeKind[];
  categories: Category[];
  signatures: Product[];
  pairings: Pairing[];
  popup: Popup;
  productMap: Record<string, Product>;
  addOnMap: Record<string, AddOn>;
}
