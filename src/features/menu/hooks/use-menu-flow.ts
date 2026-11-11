import { useCallback, useState } from "react";
import type { Pairing, Product } from "../types/menu-models";

type MenuPanel =
  | { type: "search" }
  | { type: "categories" }
  | { type: "product"; product: Product }
  | { type: "pairing"; pairing: Pairing }
  | null;

export function useMenuFlow() {
  const [panel, setPanel] = useState<MenuPanel>(null);

  const close = useCallback(() => {
    setPanel(null);
  }, []);

  const openSearch = useCallback(() => {
    setPanel({ type: "search" });
  }, []);

  const openCategories = useCallback(() => {
    setPanel({ type: "categories" });
  }, []);

  const openProduct = useCallback((product: Product) => {
    setPanel({
      type: "product",
      product,
    });
  }, []);

  const openPairing = useCallback((pairing: Pairing) => {
    setPanel({
      type: "pairing",
      pairing,
    });
  }, []);

  return {
    panel,
    close,
    openSearch,
    openCategories,
    openProduct,
    openPairing,
  };
}
