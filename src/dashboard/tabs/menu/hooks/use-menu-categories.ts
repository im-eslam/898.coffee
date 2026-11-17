import { useCallback } from "react";
import type { Key } from "react-aria-components";
import { categoryPath, emptyCategory } from "../util/draft";
import { moveItems } from "../util/reorder";
import type { DraftCategory } from "../types/draft";
import type { MenuStore } from "../types/store";

type Position = "before" | "after" | "on";

export function useMenuCategories({ draft, update }: MenuStore) {
  const add = useCallback((): string => {
    const category = emptyCategory();
    update((current) => ({
      ...current,
      categories: [...current.categories, category],
    }));
    return category.uid;
  }, [update]);

  const edit = useCallback(
    (uid: string, change: (category: DraftCategory) => DraftCategory) =>
      update(
        (current) => ({
          ...current,
          categories: current.categories.map((item) =>
            item.uid === uid ? change(item) : item
          ),
        }),
        draft ? categoryPath(draft, uid) : undefined
      ),
    [draft, update]
  );

  const move = useCallback(
    (keys: Set<Key>, target: Key, position: Position) =>
      update((current) => ({
        ...current,
        categories: moveItems(current.categories, keys, target, position),
      })),
    [update]
  );

  const remove = useCallback(
    (uid: string): boolean => {
      const target = draft?.categories.find((item) => item.uid === uid);
      if (!target || target.products.length > 0) return false;
      update((current) => ({
        ...current,
        categories: current.categories.filter((item) => item.uid !== uid),
      }));
      return true;
    },
    [draft, update]
  );

  const removeAndMove = useCallback(
    (uid: string, targetUid: string) => {
      if (uid === targetUid) return;
      update((current) => {
        const source = current.categories.find((item) => item.uid === uid);
        if (!source) return current;
        return {
          ...current,
          categories: current.categories
            .filter((item) => item.uid !== uid)
            .map((item) =>
              item.uid === targetUid
                ? { ...item, products: [...item.products, ...source.products] }
                : item
            ),
        };
      });
    },
    [update]
  );

  return { add, update: edit, move, remove, removeAndMove };
}

export type CategoriesApi = ReturnType<typeof useMenuCategories>;
