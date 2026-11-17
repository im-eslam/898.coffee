import { useCallback } from "react";
import { addOnPath, addOnUsage, emptyAddOn } from "../util/draft";
import type { DraftAddOn } from "../types/draft";
import type { MenuStore } from "../types/store";

export function useMenuAddOns({ draft, update }: MenuStore) {
  const add = useCallback((): string => {
    const addOn = emptyAddOn();
    update((current) => ({ ...current, addOns: [...current.addOns, addOn] }));
    return addOn.uid;
  }, [update]);

  const edit = useCallback(
    (uid: string, change: (addOn: DraftAddOn) => DraftAddOn) =>
      update(
        (current) => ({
          ...current,
          addOns: current.addOns.map((item) => (item.uid === uid ? change(item) : item)),
        }),
        draft ? addOnPath(draft, uid) : undefined
      ),
    [draft, update]
  );

  const remove = useCallback(
    (uid: string): boolean => {
      const target = draft?.addOns.find((item) => item.uid === uid);
      if (!target || (draft && addOnUsage(draft, target.id) > 0)) return false;
      update((current) => ({
        ...current,
        addOns: current.addOns.filter((item) => item.uid !== uid),
      }));
      return true;
    },
    [draft, update]
  );

  return { add, update: edit, remove };
}

export type AddOnsApi = ReturnType<typeof useMenuAddOns>;
