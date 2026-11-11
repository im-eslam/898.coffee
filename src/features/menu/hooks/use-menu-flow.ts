import { useState } from "react";
import { useLocale, useStrings } from "@/shared/i18n";
import { strings } from "../strings";
import type { Menu, Pairing, Product } from "../types/menu-models";
import { useScrollSpy } from "./use-scroll-spy";

export type OpenPanel = "product" | "pairing" | "categories" | "search" | null;

export interface NavSection {
  id: string;
  label: string;
}

export function useMenuFlow(menu: Menu) {
  const locale = useLocale();
  const t = useStrings(strings);

  const [panel, setPanel] = useState<OpenPanel>(null);
  const [productSheet, setProductSheet] = useState<{
    id: number;
    product: Product;
  } | null>(null);
  const [pairingSheet, setPairingSheet] = useState<{
    id: number;
    pairing: Pairing;
  } | null>(null);

  const sections: NavSection[] = [
    ...(menu.signatures.length > 0
      ? [{ id: "signatures", label: t.signaturesPill }]
      : []),
    ...(menu.pairings.length > 0
      ? [{ id: "pairings", label: t.pairingsPill }]
      : []),
    ...menu.categories.map((category) => ({
      id: category.id,
      label: category.name[locale],
    })),
  ];
  const { activeId, scrollTo } = useScrollSpy(
    sections.map((section) => section.id)
  );

  function closePanel() {
    setPanel(null);
  }

  function openProduct(product: Product) {
    setProductSheet({ id: Date.now(), product });
    setPanel("product");
  }

  function openProductById(productId: string) {
    const product = menu.productMap[productId];
    if (product) openProduct(product);
  }

  function openPairing(pairing: Pairing) {
    setPairingSheet({ id: Date.now(), pairing });
    setPanel("pairing");
  }

  function goToSection(id: string) {
    closePanel();
    window.setTimeout(() => scrollTo(id), 0);
  }

  return {
    sections,
    activeId,
    panel,
    productSheet,
    pairingSheet,
    closePanel,
    openProduct,
    openProductById,
    openPairing,
    goToSection,
    scrollTo,
    setPanel,
  };
}
