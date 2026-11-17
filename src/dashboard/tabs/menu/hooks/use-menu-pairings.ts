import { useCallback } from "react";
import {
  createPairing,
  finalPrice,
  pairingPath,
  pairingDefaultPrice,
  pairingProblems,
  referenceable,
} from "../util/draft";
import type { DraftPairing, NewPairingInput } from "../types/draft";
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

  const add = useCallback(
    (input: NewPairingInput): boolean => {
      if (!draft) return false;
      const known = new Set(referenceable(draft).map((product) => product.id));
      if (pairingProblems(input, known, draft.pairings).length > 0)
        return false;
      update((current) => ({
        ...current,
        pairings: [...current.pairings, createPairing(input)],
      }));
      return true;
    },
    [draft, update]
  );

  const setItem = useCallback(
    (uid: string, slot: 0 | 1, productId: string): boolean => {
      if (!draft) return false;
      const target = draft.pairings.find((item) => item.uid === uid);
      if (!target || target.items[1 - slot] === productId) return false;
      edit(uid, (pairing) => {
        const items = [...pairing.items];
        items[slot] = productId;
        const oldPrice = pairingDefaultPrice(draft, pairing.items);
        const nextPrice =
          pairing.pricing.price === oldPrice
            ? pairingDefaultPrice(draft, items)
            : pairing.pricing.price;
        return {
          ...pairing,
          items,
          pricing: {
            price: nextPrice,
            discount: pairing.pricing.discount,
            final: finalPrice(nextPrice, pairing.pricing.discount),
          },
        };
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
          final: finalPrice(price, pairing.pricing.discount),
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
          final: finalPrice(pairing.pricing.price, discount),
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
