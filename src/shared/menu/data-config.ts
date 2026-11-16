import type { Localized } from "@/shared/i18n";

export const AVAILABILITY = ["in_stock", "out_of_stock"] as const;
export type Availability = (typeof AVAILABILITY)[number];

export const BADGE_KINDS = ["new", "top"] as const;
export type BadgeKind = (typeof BADGE_KINDS)[number];

export const PRICING_TYPES = ["single", "sizes"] as const;
export type PricingType = (typeof PRICING_TYPES)[number];

export interface PriceOption {
  id: string;
  name: Localized<string> | null;
  price: number;
  discount: number;
  final: number;
}

export interface Pricing {
  type: PricingType;
  options: PriceOption[];
}

export interface PairingPricing {
  price: number;
  discount: number;
  final: number;
}

export interface Popup {
  enabled: boolean;
  image: string | null;
  delaySeconds: number;
}
