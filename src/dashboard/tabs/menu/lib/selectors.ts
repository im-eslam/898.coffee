import type { DraftProduct, MenuDraft } from "../types/draft";

export interface ProductEntry {
  product: DraftProduct;
  categoryUid: string;
}

export function productMap(draft: MenuDraft): Map<string, ProductEntry> {
  const map = new Map<string, ProductEntry>();
  for (const category of draft.categories) {
    for (const product of category.products) {
      if (product.id) map.set(product.id, { product, categoryUid: category.uid });
    }
  }
  return map;
}

export function allProducts(draft: MenuDraft): DraftProduct[] {
  return draft.categories.flatMap((category) => category.products);
}

export function addOnUsage(draft: MenuDraft, addOnId: string): number {
  if (!addOnId) return 0;
  return allProducts(draft).filter((product) =>
    product.addOns.includes(addOnId)
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
