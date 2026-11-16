import type { Localized } from "@/shared/i18n";
import type {
  Availability,
  BadgeKind,
  PriceOption,
  Pricing,
  PricingType,
} from "./data-config";
import type { AddOn, Category, Pairing, Product, ProductRef } from "./data-models";
import type {
  RawAddOn,
  RawCategory,
  RawPairing,
  RawPriceOption,
  RawPricing,
  RawProduct,
} from "./data-raw";

export type Dict = Record<string, unknown>;

export function isDict(value: unknown): value is Dict {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export function asString(value: unknown, fallback = ""): string {
  return typeof value === "string" ? value : fallback;
}

export function asNumber(value: unknown, fallback = 0): number {
  return typeof value === "number" && Number.isFinite(value) ? value : fallback;
}

export function asList(value: unknown): unknown[] {
  return Array.isArray(value) ? value : [];
}

export function asStringList(value: unknown): string[] {
  return asList(value).filter((v): v is string => typeof v === "string");
}

export function asLocalized(value: unknown): Localized<string> {
  const source = isDict(value) ? value : {};
  return { en: asString(source.en), ar: asString(source.ar) };
}

export function asAvailability(value: unknown): Availability {
  return value === "out_of_stock" ? "out_of_stock" : "in_stock";
}

export function asBadgeKind(value: unknown): BadgeKind | null {
  return value === "new" || value === "top" ? value : null;
}

export function asPricingType(value: unknown): PricingType {
  return value === "sizes" ? "sizes" : "single";
}

export class AddOnParser {
  static parse(id: string, raw: RawAddOn): AddOn {
    return { id, name: raw.name, price: raw.price };
  }

  static parseMap(raw: Record<string, RawAddOn>): Record<string, AddOn> {
    const map: Record<string, AddOn> = {};
    for (const [id, addon] of Object.entries(raw)) {
      map[id] = AddOnParser.parse(id, addon);
    }
    return map;
  }
}

export class PricingParser {
  static parseOption(raw: RawPriceOption): PriceOption {
    return {
      id: raw.id,
      name: raw.name,
      price: raw.price,
      discount: raw.discount,
      final: raw.final,
    };
  }

  static parse(raw: RawPricing): Pricing {
    return {
      type: raw.type,
      options: raw.options.map(PricingParser.parseOption),
    };
  }
}

export class ProductParser {
  static parse(raw: RawProduct, addOnMap: Record<string, AddOn>): Product {
    const resolveAddOns = (ids: string[] | null): AddOn[] =>
      (ids ?? [])
        .map((id) => addOnMap[id])
        .filter((a): a is AddOn => a !== undefined);

    return {
      id: raw.id,
      name: raw.name,
      description: raw.description,
      image: raw.image,
      availability: raw.availability,
      badge: raw.badge,
      pricing: PricingParser.parse(raw.pricing),
      addOns: resolveAddOns(raw.addOns),
      baristaWay: resolveAddOns(raw.baristaWay),
      oftenOrderedWith: [],
    };
  }

  static toRef(product: Product): ProductRef {
    return {
      id: product.id,
      name: product.name,
      image: product.image,
      availability: product.availability,
      badge: product.badge,
      pricing: product.pricing,
    };
  }
}

export class CategoryParser {
  static parse(raw: RawCategory, addOnMap: Record<string, AddOn>): Category {
    return {
      id: raw.id,
      name: raw.name,
      products: raw.products.map((product) =>
        ProductParser.parse(product, addOnMap)
      ),
    };
  }
}

export class PairingParser {
  static parse(raw: RawPairing, productMap: Record<string, Product>): Pairing {
    return {
      id: raw.id,
      items: raw.items
        .map((id) => productMap[id])
        .filter((p): p is Product => p !== undefined),
      pricing: raw.pricing,
    };
  }
}
