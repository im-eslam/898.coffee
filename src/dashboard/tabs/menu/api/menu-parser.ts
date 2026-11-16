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
} from "../types/draft";
import type {
  MenuWirePayload,
  WirePriceOption,
  WireProduct,
} from "./menu-definition";
import { newUid } from "../lib/factories";

type Dict = Record<string, unknown>;

function isDict(value: unknown): value is Dict {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function str(value: unknown, fallback = ""): string {
  return typeof value === "string" ? value : fallback;
}

function num(value: unknown, fallback = 0): number {
  return typeof value === "number" && Number.isFinite(value) ? value : fallback;
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

class OptionParser {
  static parse(value: unknown): DraftOption {
    const source = isDict(value) ? value : {};
    const price = num(source.price);
    const discount = num(source.discount);

    return {
      uid: newUid(),
      id: str(source.id),
      name: isDict(source.name) ? localized(source.name) : null,
      price,
      discount,
      final: num(source.final, price - discount),
    };
  }

  static toWire({ uid: _uid, ...rest }: DraftOption): WirePriceOption {
    return rest;
  }
}

class PricingParser {
  static parse(value: unknown): DraftPricing {
    const source = isDict(value) ? value : {};
    const options = list(source.options).map(OptionParser.parse);
    const type = source.type === "sizes" ? "sizes" : "single";

    return {
      type,
      options:
        options.length > 0
          ? options
          : [
              {
                ...OptionParser.parse({}),
                name: type === "sizes" ? { en: "", ar: "" } : null,
              },
            ],
    };
  }
}

class ProductParser {
  static parse(value: unknown): DraftProduct {
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
      pricing: PricingParser.parse(source.pricing),
    };
  }

  static toWire({ uid: _uid, pricing, ...rest }: DraftProduct): WireProduct {
    return {
      ...rest,
      pricing: {
        type: pricing.type,
        options: pricing.options.map(OptionParser.toWire),
      },
    };
  }
}

class CategoryParser {
  static parse(value: unknown): DraftCategory {
    const source = isDict(value) ? value : {};
    return {
      uid: newUid(),
      id: str(source.id),
      name: localized(source.name),
      products: list(source.products).map(ProductParser.parse),
    };
  }
}

class AddOnParser {
  static parseList(value: unknown): DraftAddOn[] {
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
}

class PairingParser {
  static parse(value: unknown): DraftPairing {
    const source = isDict(value) ? value : {};
    const prices = isDict(source.pricing) ? source.pricing : {};
    const price = num(prices.price);
    const discount = num(prices.discount);

    return {
      uid: newUid(),
      id: str(source.id),
      items: strList(source.items),
      pricing: {
        price,
        discount,
        final: num(prices.final, price - discount),
      },
    };
  }
}

export class MenuDraftParser {
  static parse(raw: unknown): MenuDraft {
    const source = isDict(raw) ? raw : {};
    const popup = isDict(source.popup) ? source.popup : {};
    const badges = strList(source.badges).filter(
      (b): b is BadgeKind => b === "new" || b === "top"
    );

    return {
      updatedAt: str(source.updatedAt),
      currency: str(source.currency, "EGP"),
      badges: badges.length > 0 ? badges : ["top", "new"],
      addOns: AddOnParser.parseList(source.addOns),
      categories: list(source.categories).map(CategoryParser.parse),
      signatures: strList(source.signatures),
      pairings: list(source.pairings).map(PairingParser.parse),
      popup: {
        enabled: popup.enabled === true,
        image: typeof popup.image === "string" ? popup.image : null,
        delaySeconds: num(popup.delaySeconds, 1),
      },
    };
  }

  static toWire(draft: MenuDraft): MenuWirePayload {
    return {
      updatedAt: draft.updatedAt,
      currency: draft.currency,
      badges: draft.badges,
      addOns: draft.addOns.map(({ uid: _uid, ...rest }) => rest),
      categories: draft.categories.map(({ uid: _uid, products, ...rest }) => ({
        ...rest,
        products: products.map(ProductParser.toWire),
      })),
      signatures: draft.signatures,
      pairings: draft.pairings.map(({ uid: _uid, ...rest }) => rest),
      popup: draft.popup,
    };
  }

  static parseIssues(value: unknown): MenuIssue[] {
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
}
