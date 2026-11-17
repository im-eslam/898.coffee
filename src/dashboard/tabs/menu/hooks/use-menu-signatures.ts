import { useCallback } from "react";
import type { Key } from "react-aria-components";
import { moveStrings } from "../util/reorder";
import type { MenuStore } from "../types/store";

type Position = "before" | "after" | "on";

export function useMenuSignatures({ draft, update }: MenuStore) {
  const add = useCallback(
    (productId: string) => {
      if (!productId || draft?.signatures.includes(productId)) return;
      update((current) => ({
        ...current,
        signatures: [...current.signatures, productId],
      }));
    },
    [draft, update]
  );

  const remove = useCallback(
    (productId: string) =>
      update((current) => ({
        ...current,
        signatures: current.signatures.filter((id) => id !== productId),
      })),
    [update]
  );

  const move = useCallback(
    (keys: Set<Key>, target: Key, position: Position) =>
      update((current) => ({
        ...current,
        signatures: moveStrings(current.signatures, keys, target, position),
      })),
    [update]
  );

  return { add, remove, move };
}

export type SignaturesApi = ReturnType<typeof useMenuSignatures>;
