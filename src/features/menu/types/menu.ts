import type { Localized } from "@/shared/i18n";

export type Availability = "in_stock" | "out_of_stock";

export type BadgeKind = "new" | "top";

export interface AddOn {
  id: string;
  name: Localized<string>;
  price: number;
}

export interface PriceOption {
  id: string;
  name: Localized<string> | null;
  price: number;
  discount: number;
  final: number;
}

export interface Pricing {
  type: "single" | "sizes";
  options: PriceOption[];
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

export interface PairingPricing {
  price: number;
  discount: number;
  final: number;
}

export interface Pairing {
  id: string;
  items: Product[];
  pricing: PairingPricing;
}

export interface Popup {
  enabled: boolean;
  image: string | null;
  delaySeconds: number;
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
