import { useCallback } from "react";
import type { Localized } from "@/shared/i18n";
import { addOnPath, emptyAddOn } from "../util/draft";
import type { DraftAddOn } from "../types/draft";
import type { MenuStore } from "../types/store";

export interface NewAddOnInput {
  name: Localized<string>;
  price: number;
}

export function useMenuAddOns({ draft, update }: MenuStore) {
  const add = useCallback(
    (input: NewAddOnInput): boolean => {
      const en = input.name.en.trim();
      const ar = input.name.ar.trim();
      if (en === "" || ar === "") return false;
      if (!Number.isFinite(input.price) || input.price < 0) return false;
      update((current) => ({
        ...current,
        addOns: [
          ...current.addOns,
          { ...emptyAddOn(), name: { en, ar }, price: input.price },
        ],
      }));
      return true;
    },
    [update]
  );

  const edit = useCallback(
    (uid: string, change: (addOn: DraftAddOn) => DraftAddOn) =>
      update(
        (current) => ({
          ...current,
          addOns: current.addOns.map((item) =>
            item.uid === uid ? change(item) : item
          ),
        }),
        draft ? addOnPath(draft, uid) : undefined
      ),
    [draft, update]
  );

  const remove = useCallback(
    (uid: string): boolean => {
      const target = draft?.addOns.find((item) => item.uid === uid);
      if (!target) return false;
      const id = target.id;
      update((current) => ({
        ...current,
        addOns: current.addOns.filter((item) => item.uid !== uid),
        categories:
          id === ""
            ? current.categories
            : current.categories.map((category) => ({
                ...category,
                products: category.products.map((product) => ({
                  ...product,
                  addOns: product.addOns.filter((ref) => ref !== id),
                  baristaWay: product.baristaWay.filter((ref) => ref !== id),
                })),
              })),
      }));
      return true;
    },
    [draft, update]
  );

  return { add, update: edit, remove };
}

export type AddOnsApi = ReturnType<typeof useMenuAddOns>;
