import type {
  DraftAddOn,
  DraftCategory,
  DraftOption,
  DraftPairing,
  DraftProduct,
} from "../types";

let sequence = 0;

export function newUid(): string {
  sequence += 1;
  return `draft-${sequence}`;
}

export function emptyOption(named: boolean): DraftOption {
  return {
    uid: newUid(),
    id: "",
    name: named ? { en: "", ar: "" } : null,
    price: 0,
    discount: 0,
    final: 0,
  };
}

export function emptyProduct(): DraftProduct {
  return {
    uid: newUid(),
    id: "",
    name: { en: "", ar: "" },
    description: { en: "", ar: "" },
    image: null,
    availability: "in_stock",
    badge: null,
    addOns: [],
    baristaWay: null,
    oftenOrderedWith: [],
    pricing: { type: "single", options: [emptyOption(false)] },
  };
}

export function emptyCategory(): DraftCategory {
  return {
    uid: newUid(),
    id: "",
    name: { en: "", ar: "" },
    products: [],
  };
}

export function emptyAddOn(): DraftAddOn {
  return { uid: newUid(), id: "", name: { en: "", ar: "" }, price: 0 };
}

export function emptyPairing(items: [string, string]): DraftPairing {
  return {
    uid: newUid(),
    id: "",
    items,
    pricing: { price: 1, discount: 0, final: 1 },
  };
}
