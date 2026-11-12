import type {
  AddOn,
  Category,
  Menu,
  Pairing,
  Popup,
  Pricing,
  PriceOption,
  Product,
  ProductRef,
} from "../types/menu";
import type {
  RawAddOn,
  RawCategory,
  RawMenuResponse,
  RawPairing,
  RawPriceOption,
  RawPricing,
  RawProduct,
} from "./menu-definition";

class AddOnParser {
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

class PricingParser {
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

class ProductParser {
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

class CategoryParser {
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

class PairingParser {
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

    const popup: Popup = raw.popup;

    return {
      updatedAt: raw.updatedAt,
      currency: raw.currency,
      badges: raw.badges,
      categories,
      signatures: raw.signatures
        .map((id) => productMap[id])
        .filter((p): p is Product => p !== undefined),
      pairings: raw.pairings.map((p) => PairingParser.parse(p, productMap)),
      popup,
      productMap,
      addOnMap,
    };
  }
}
