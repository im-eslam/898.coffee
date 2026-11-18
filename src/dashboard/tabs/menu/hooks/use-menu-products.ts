import { useCallback } from "react";
import type { Key } from "react-aria-components";
import {
  productPath,
  removeProductFrom,
  switchPricingType,
  withSizeIds,
} from "../util/draft";
import { moveItems } from "../util/reorder";
import type { DraftPricing, DraftProduct, MenuDraft } from "../types/draft";
import type { MenuStore } from "../types/store";

type ProductChange = (product: DraftProduct) => DraftProduct;
type Position = "before" | "after" | "on";

function mapProduct(
  draft: MenuDraft,
  uid: string,
  change: ProductChange
): MenuDraft {
  return {
    ...draft,
    categories: draft.categories.map((category) => ({
      ...category,
      products: category.products.map((item) =>
        item.uid === uid ? change(item) : item
      ),
    })),
  };
}

export function useMenuProducts({
  draft,
  update,
  reportRemovedPairings,
}: MenuStore) {
  const change = useCallback(
    (uid: string, edit: ProductChange) =>
      update(
        (current) => mapProduct(current, uid, edit),
        draft ? productPath(draft, uid) : undefined
      ),
    [draft, update]
  );

  /** Appends a finished product to a category. The dialog checks it before calling this. */
  const create = useCallback(
    (categoryUid: string, product: DraftProduct) =>
      update((current) => ({
        ...current,
        categories: current.categories.map((category) =>
          category.uid === categoryUid
            ? { ...category, products: [...category.products, product] }
            : category
        ),
      })),
    [update]
  );

  /** Replaces a saved product with the edited copy from the dialog. */
  const replace = useCallback(
    (uid: string, product: DraftProduct) =>
      change(uid, () => ({ ...product, uid })),
    [change]
  );

  const setPricing = useCallback(
    (uid: string, pricing: DraftPricing) =>
      change(uid, (item) => ({ ...item, pricing: withSizeIds(pricing) })),
    [change]
  );

  const setPricingType = useCallback(
    (uid: string, type: DraftPricing["type"]) =>
      change(uid, (item) => ({
        ...item,
        pricing: switchPricingType(item.pricing, type),
      })),
    [change]
  );

  const move = useCallback(
    (categoryUid: string, keys: Set<Key>, target: Key, position: Position) =>
      update((current) => ({
        ...current,
        categories: current.categories.map((category) =>
          category.uid === categoryUid
            ? {
                ...category,
                products: moveItems(category.products, keys, target, position),
              }
            : category
        ),
      })),
    [update]
  );

  const remove = useCallback(
    (uid: string) => {
      if (!draft) return;
      const { removedPairings } = removeProductFrom(draft, uid);
      update((current) => removeProductFrom(current, uid).draft, true);
      reportRemovedPairings(removedPairings);
    },
    [draft, update, reportRemovedPairings]
  );

  return {
    create,
    replace,
    update: change,
    setPricing,
    setPricingType,
    move,
    remove,
  };
}

export type ProductsApi = ReturnType<typeof useMenuProducts>;
