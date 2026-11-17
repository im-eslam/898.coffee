import type { Localized } from "@/shared/i18n";
import type {
  DraftAddOn,
  DraftCategory,
  DraftOption,
  DraftPairing,
  DraftPricing,
  DraftProduct,
  MenuDraft,
  NewPairingInput,
} from "../types/draft";
import type { ProductOption } from "../types/ui";

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
    baristaWay: [],
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

export interface ProductEntry {
  product: DraftProduct;
  categoryUid: string;
}

export function productMap(draft: MenuDraft): Map<string, ProductEntry> {
  const map = new Map<string, ProductEntry>();
  for (const category of draft.categories) {
    for (const product of category.products) {
      if (product.id)
        map.set(product.id, { product, categoryUid: category.uid });
    }
  }
  return map;
}

export function allProducts(draft: MenuDraft): DraftProduct[] {
  return draft.categories.flatMap((category) => category.products);
}

export function addOnUsage(draft: MenuDraft, addOnId: string): number {
  if (!addOnId) return 0;
  return allProducts(draft).filter(
    (product) =>
      product.addOns.includes(addOnId) || product.baristaWay.includes(addOnId)
  ).length;
}

export function imageOptions(draft: MenuDraft): string[] {
  const images = new Set<string>();
  for (const product of allProducts(draft)) {
    if (product.image) images.add(product.image);
  }
  if (draft.popup.image) images.add(draft.popup.image);
  return [...images].sort((a, b) => a.localeCompare(b));
}

export function sizeLabel(product: DraftProduct, currency: string): string {
  const prices = product.pricing.options.map((option) => option.price);
  if (prices.length === 0) return "";
  const min = Math.min(...prices);
  const max = Math.max(...prices);
  return min === max ? `${min} ${currency}` : `${min}–${max} ${currency}`;
}

export function referenceable(draft: MenuDraft) {
  return allProducts(draft).filter((product) => product.id !== "");
}

export function productOptions(
  draft: MenuDraft,
  fallback: string
): ProductOption[] {
  return referenceable(draft).map((product) => ({
    id: product.id,
    label: localizedLabel(product.name, fallback),
    search: `${product.name.en} ${product.name.ar}`,
    price:
      product.pricing.options[0]?.final ??
      product.pricing.options[0]?.price ??
      0,
  }));
}

export function pairingDefaultPrice(
  draft: MenuDraft,
  items: readonly string[]
): number {
  const byId = new Map(
    productOptions(draft, "").map((product) => [product.id, product])
  );
  return items.reduce((total, id) => total + (byId.get(id)?.price ?? 0), 0);
}

export function localizedLabel(name: Localized<string>, fallback: string) {
  return name.en.trim() || name.ar.trim() || fallback;
}

export function slugId(text: string, fallback = "size"): string {
  const slug = text
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 40);
  return slug || fallback;
}

export function withSizeIds(pricing: DraftPricing): DraftPricing {
  if (pricing.type !== "sizes") return pricing;
  const taken = new Set(
    pricing.options.map((o) => o.id).filter((id) => id !== "")
  );
  const options = pricing.options.map((option) => {
    if (option.id !== "") return option;
    const base = slugId(option.name?.en ?? "");
    let id = base;
    for (let n = 2; taken.has(id); n += 1) id = `${base}-${n}`;
    taken.add(id);
    return { ...option, id };
  });
  return { ...pricing, options };
}

export function removeProductFrom(
  draft: MenuDraft,
  productUid: string
): { draft: MenuDraft; removedPairings: number } {
  const target = allProducts(draft).find(
    (product) => product.uid === productUid
  );
  if (!target) return { draft, removedPairings: 0 };

  const id = target.id;
  const without = (ids: string[]) =>
    id ? ids.filter((value) => value !== id) : ids;
  const pairings = id
    ? draft.pairings.filter((pairing) => !pairing.items.includes(id))
    : draft.pairings;

  return {
    removedPairings: draft.pairings.length - pairings.length,
    draft: {
      ...draft,
      categories: draft.categories.map((category) => ({
        ...category,
        products: category.products
          .filter((product) => product.uid !== productUid)
          .map((product) => ({
            ...product,
            oftenOrderedWith: without(product.oftenOrderedWith),
          })),
      })),
      signatures: without(draft.signatures),
      pairings,
    },
  };
}

export function categoryPath(draft: MenuDraft, uid: string): string {
  const index = draft.categories.findIndex((category) => category.uid === uid);
  return index === -1 ? "" : `categories[${index}]`;
}

export function productPath(draft: MenuDraft, uid: string): string {
  for (let ci = 0; ci < draft.categories.length; ci += 1) {
    const pi = draft!.categories[ci]!.products.findIndex((p) => p.uid === uid);
    if (pi !== -1) return `categories[${ci}].products[${pi}]`;
  }
  return "";
}

export function addOnPath(draft: MenuDraft, uid: string): string {
  const index = draft.addOns.findIndex((addOn) => addOn.uid === uid);
  return index === -1 ? "" : `addOns[${index}]`;
}

export function pairingPath(draft: MenuDraft, uid: string): string {
  const index = draft.pairings.findIndex((pairing) => pairing.uid === uid);
  return index === -1 ? "" : `pairings[${index}]`;
}

export function switchPricingType(
  pricing: DraftPricing,
  type: DraftPricing["type"]
): DraftPricing {
  if (type === pricing.type) return pricing;
  if (type === "single") {
    const first = pricing.options[0] ?? emptyOption(false);
    return { type, options: [{ ...first, name: null }] };
  }
  const first = pricing.options[0] ?? emptyOption(true);
  return withSizeIds({
    type,
    options: [
      { ...first, name: first.name ?? { en: "", ar: "" } },
      emptyOption(true),
    ],
  });
}

export type PairingProblem =
  | "unknownProduct"
  | "sameProduct"
  | "duplicatePair"
  | "invalidPrice"
  | "discountTooHigh";

export function finalPrice(price: number, discount: number): number {
  return price - discount;
}

export function createPairing({
  items,
  price,
  discount,
}: NewPairingInput): DraftPairing {
  return {
    uid: newUid(),
    id: "",
    items: [...items],
    pricing: { price, discount, final: finalPrice(price, discount) },
  };
}

function samePair(a: readonly string[], b: readonly string[]): boolean {
  return a.length === 2 && b.length === 2 && a.every((id) => b.includes(id));
}

export function pairingProblems(
  input: NewPairingInput,
  knownIds: ReadonlySet<string>,
  existing: readonly DraftPairing[]
): PairingProblem[] {
  const [first, second] = input.items;
  const problems: PairingProblem[] = [];

  if (!knownIds.has(first) || !knownIds.has(second)) {
    problems.push("unknownProduct");
  } else if (first === second) {
    problems.push("sameProduct");
  } else if (existing.some((pairing) => samePair(pairing.items, input.items))) {
    problems.push("duplicatePair");
  }

  if (!(input.price > 0)) problems.push("invalidPrice");
  if (input.discount > input.price) problems.push("discountTooHigh");

  return problems;
}
