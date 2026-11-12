import { useCallback, useState } from "react";
import type { Pairing, Product } from "../types/menu";
import type { SheetSelection, MenuPanel } from "../types/flow";

export function useMenuFlow() {
  const [panel, setPanel] = useState<MenuPanel>(null);
  const [productSheet, setProductSheet] =
    useState<SheetSelection<Product> | null>(null);
  const [pairingSheet, setPairingSheet] =
    useState<SheetSelection<Pairing> | null>(null);

  const close = useCallback(() => {
    setPanel(null);
  }, []);

  const openSearch = useCallback(() => {
    setPanel("search");
  }, []);

  const openCategories = useCallback(() => {
    setPanel("categories");
  }, []);

  const openProduct = useCallback((product: Product) => {
    setProductSheet((current) => ({
      item: product,
      key: (current?.key ?? 0) + 1,
    }));
    setPanel("product");
  }, []);

  const openPairing = useCallback((pairing: Pairing) => {
    setPairingSheet((current) => ({
      item: pairing,
      key: (current?.key ?? 0) + 1,
    }));
    setPanel("pairing");
  }, []);

  return {
    panel,
    productSheet,
    pairingSheet,
    close,
    openSearch,
    openCategories,
    openProduct,
    openPairing,
  };
}
