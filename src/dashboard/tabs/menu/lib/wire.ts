import type { Localized } from "@/shared/i18n";
import type { Availability, BadgeKind } from "@/features/menu/types/menu";
import type {
  DraftAddOn,
  DraftCategory,
  DraftOption,
  DraftPairing,
  DraftPricing,
  DraftProduct,
  MenuDraft,
  MenuIssue,
} from "../types";
import { newUid } from "./factories";

type Dict = Record<string, unknown>;

function isDict(value: unknown): value is Dict {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function str(value: unknown, fallback = ""): string {
  return typeof value === "string" ? value : fallback;
}

function num(value: unknown, fallback = 0): number {
  return typeof value === "number" && Number.isFinite(value)
    ? value
    : fallback;
}

function list(value: unknown): unknown[] {
  return Array.isArray(value) ? value : [];
}

function strList(value: unknown): string[] {
  return list(value).filter((v): v is string => typeof v === "string");
}

function localized(value: unknown): Localized<string> {
  const source = isDict(value) ? value : {};
  return { en: str(source.en), ar: str(source.ar) };
}

function option(value: unknown): DraftOption {
  const source = isDict(value) ? value : {};
  return {
    uid: newUid(),
    id: str(source.id),
    name: isDict(source.name) ? localized(source.name) : null,
    price: num(source.price),
    discount: num(source.discount),
    final: num(source.final, num(source.price) - num(source.discount)),
  };
}

function pricing(value: unknown): DraftPricing {
  const source = isDict(value) ? value : {};
  const options = list(source.options).map(option);
  const type = source.type === "sizes" ? "sizes" : "single";
  return {
    type,
    options:
      options.length > 0
        ? options
        : [{ ...option({}), name: type === "sizes" ? { en: "", ar: "" } : null }],
  };
}

function product(value: unknown): DraftProduct {
  const source = isDict(value) ? value : {};
  const badge = source.badge;
  const availability: Availability =
    source.availability === "out_of_stock" ? "out_of_stock" : "in_stock";
  return {
    uid: newUid(),
    id: str(source.id),
    name: localized(source.name),
    description: localized(source.description),
    image: typeof source.image === "string" ? source.image : null,
    availability,
    badge: badge === "new" || badge === "top" ? badge : null,
    addOns: strList(source.addOns),
    baristaWay: Array.isArray(source.baristaWay)
      ? strList(source.baristaWay)
      : null,
    oftenOrderedWith: strList(source.oftenOrderedWith),
    pricing: pricing(source.pricing),
  };
}

function category(value: unknown): DraftCategory {
  const source = isDict(value) ? value : {};
  return {
    uid: newUid(),
    id: str(source.id),
    name: localized(source.name),
    products: list(source.products).map(product),
  };
}

function addOnList(value: unknown): DraftAddOn[] {
  if (Array.isArray(value)) {
    return value.map((entry) => {
      const source = isDict(entry) ? entry : {};
      return {
        uid: newUid(),
        id: str(source.id),
        name: localized(source.name),
        price: num(source.price),
      };
    });
  }
  if (!isDict(value)) return [];
  return Object.entries(value).map(([id, entry]) => {
    const source = isDict(entry) ? entry : {};
    return {
      uid: newUid(),
      id,
      name: localized(source.name),
      price: num(source.price),
    };
  });
}

function pairing(value: unknown): DraftPairing {
  const source = isDict(value) ? value : {};
  const prices = isDict(source.pricing) ? source.pricing : {};
  const priceValue = num(prices.price);
  const discountValue = num(prices.discount);
  return {
    uid: newUid(),
    id: str(source.id),
    items: strList(source.items),
    pricing: {
      price: priceValue,
      discount: discountValue,
      final: num(prices.final, priceValue - discountValue),
    },
  };
}

export function fromWire(raw: unknown): MenuDraft {
  const source = isDict(raw) ? raw : {};
  const popup = isDict(source.popup) ? source.popup : {};
  const badges = strList(source.badges).filter(
    (b): b is BadgeKind => b === "new" || b === "top"
  );

  return {
    updatedAt: str(source.updatedAt),
    currency: str(source.currency, "EGP"),
    badges: badges.length > 0 ? badges : ["top", "new"],
    addOns: addOnList(source.addOns),
    categories: list(source.categories).map(category),
    signatures: strList(source.signatures),
    pairings: list(source.pairings).map(pairing),
    popup: {
      enabled: popup.enabled === true,
      image: typeof popup.image === "string" ? popup.image : null,
      delaySeconds: num(popup.delaySeconds, 1),
    },
  };
}

function wireOption({ uid: _uid, ...rest }: DraftOption) {
  return rest;
}

function wireProduct({ uid: _uid, pricing: prices, ...rest }: DraftProduct) {
  return {
    ...rest,
    pricing: { type: prices.type, options: prices.options.map(wireOption) },
  };
}

export function toWire(draft: MenuDraft) {
  return {
    updatedAt: draft.updatedAt,
    currency: draft.currency,
    badges: draft.badges,
    addOns: draft.addOns.map(({ uid: _uid, ...rest }) => rest),
    categories: draft.categories.map(({ uid: _uid, products, ...rest }) => ({
      ...rest,
      products: products.map(wireProduct),
    })),
    signatures: draft.signatures,
    pairings: draft.pairings.map(({ uid: _uid, ...rest }) => rest),
    popup: draft.popup,
  };
}

export function parseIssues(value: unknown): MenuIssue[] {
  return list(value).flatMap((entry) => {
    if (!isDict(entry)) return [];
    return [
      {
        path: str(entry.path),
        code: str(entry.code),
        message: str(entry.message),
      },
    ];
  });
}
