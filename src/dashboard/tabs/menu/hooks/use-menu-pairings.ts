import { useCallback } from "react";
import { emptyPairing, pairingPath, referenceable } from "../util/draft";
import type { DraftPairing } from "../types/draft";
import type { MenuStore } from "../types/store";

export function useMenuPairings({ draft, update }: MenuStore) {
  const edit = useCallback(
    (uid: string, change: (pairing: DraftPairing) => DraftPairing) =>
      update(
        (current) => ({
          ...current,
          pairings: current.pairings.map((item) =>
            item.uid === uid ? change(item) : item
          ),
        }),
        draft ? pairingPath(draft, uid) : undefined
      ),
    [draft, update]
  );

  const add = useCallback((): boolean => {
    if (!draft) return false;
    const [first, second] = referenceable(draft);
    if (!first || !second) return false;
    const pairing = emptyPairing([first.id, second.id]);
    update((current) => ({
      ...current,
      pairings: [...current.pairings, pairing],
    }));
    return true;
  }, [draft, update]);

  const setItem = useCallback(
    (uid: string, slot: 0 | 1, productId: string): boolean => {
      const target = draft?.pairings.find((item) => item.uid === uid);
      if (!target || target.items[1 - slot] === productId) return false;
      edit(uid, (pairing) => {
        const items = [...pairing.items];
        items[slot] = productId;
        return { ...pairing, items };
      });
      return true;
    },
    [draft, edit]
  );

  const setPrice = useCallback(
    (uid: string, price: number) =>
      edit(uid, (pairing) => ({
        ...pairing,
        pricing: {
          price,
          discount: pairing.pricing.discount,
          final: price - pairing.pricing.discount,
        },
      })),
    [edit]
  );

  const setDiscount = useCallback(
    (uid: string, discount: number) =>
      edit(uid, (pairing) => ({
        ...pairing,
        pricing: {
          price: pairing.pricing.price,
          discount,
          final: pairing.pricing.price - discount,
        },
      })),
    [edit]
  );

  const remove = useCallback(
    (uid: string) =>
      update((current) => ({
        ...current,
        pairings: current.pairings.filter((item) => item.uid !== uid),
      })),
    [update]
  );

  return { add, update: edit, setItem, setPrice, setDiscount, remove };
}

export type PairingsApi = ReturnType<typeof useMenuPairings>;
