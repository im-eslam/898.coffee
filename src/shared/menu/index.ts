import {
  AddOnParser,
  CategoryParser,
  PairingParser,
  ProductParser,
} from "./engine";
import type { Menu, Product } from "./data-models";
import type { RawMenuResponse } from "./data-raw";

export {
  AVAILABILITY,
  BADGE_KINDS,
  PRICING_TYPES,
  type Availability,
  type BadgeKind,
  type PairingPricing,
  type Popup,
  type PriceOption,
  type Pricing,
  type PricingType,
} from "./data-config";
export type {
  AddOn,
  Category,
  Menu,
  Pairing,
  Product,
  ProductRef,
} from "./data-models";
export type {
  RawAddOn,
  RawCategory,
  RawMenuResponse,
  RawPairing,
  RawPriceOption,
  RawPricing,
  RawProduct,
} from "./data-raw";

export {
  asAvailability,
  asBadgeKind,
  asList,
  asLocalized,
  asNumber,
  asPricingType,
  asString,
  asStringList,
  isDict,
  type Dict,
} from "./engine";

export class MenuParser {
  static parse(raw: RawMenuResponse): Menu {
    const addOnMap = AddOnParser.parseMap(raw.addOns);

    const categories = raw.categories.map((cat) =>
      CategoryParser.parse(cat, addOnMap)
    );

    const productMap: Record<string, Product> = {};
    for (const cat of categories) {
      for (const product of cat.products) {
        productMap[product.id] = product;
      }
    }

    for (const cat of raw.categories) {
      for (const rawProduct of cat.products) {
        const product = productMap[rawProduct.id];
        if (!product) continue;
        product.oftenOrderedWith = rawProduct.oftenOrderedWith
          .map((id) => productMap[id])
          .filter((p): p is Product => p !== undefined)
          .map(ProductParser.toRef);
      }
    }

    return {
      updatedAt: raw.updatedAt,
      currency: raw.currency,
      badges: raw.badges,
      categories,
      signatures: raw.signatures
        .map((id) => productMap[id])
        .filter((p): p is Product => p !== undefined),
      pairings: raw.pairings.map((p) => PairingParser.parse(p, productMap)),
      popup: raw.popup,
      productMap,
      addOnMap,
    };
  }
}
