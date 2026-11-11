import { useState } from "react";
import { useLocale, useStrings } from "@/shared/i18n";
import { strings } from "../strings";
import type { Menu, Pairing, Product } from "../types/menu-models";
import type { NavSection } from "../components/navigation/category-navigation";
import { useScrollSpy } from "../components/navigation/use-scroll-spy";

type Panel = "product" | "pairing" | "categories" | "search" | null;

export function useMenuFlow(menu: Menu) {
  const locale = useLocale();
  const t = useStrings(strings);

  const [panel, setPanel] = useState<Panel>(null);
  const [activeProduct, setActiveProduct] = useState<{
    id: number;
    product: Product;
  } | null>(null);
  const [activePairing, setActivePairing] = useState<{
    id: number;
    pairing: Pairing;
  } | null>(null);

  const sections: NavSection[] = [
    ...(menu.signatures.length > 0
      ? [{ id: "signatures", label: t.nav.signaturesLabel }]
      : []),
    ...(menu.pairings.length > 0
      ? [{ id: "pairings", label: t.nav.pairingsLabel }]
      : []),
    ...menu.categories.map((category) => ({
      id: category.id,
      label: category.name[locale],
    })),
  ];
  const { activeId, scrollTo } = useScrollSpy(
    sections.map((section) => section.id)
  );

  function close() {
    setPanel(null);
  }

  function openProduct(product: Product) {
    setActiveProduct({ id: Date.now(), product });
    setPanel("product");
  }

  function openProductById(productId: string) {
    const product = menu.productMap[productId];
    if (product) openProduct(product);
  }

  function openPairing(pairing: Pairing) {
    setActivePairing({ id: Date.now(), pairing });
    setPanel("pairing");
  }

  function openCategories() {
    setPanel("categories");
  }

  function openSearch() {
    setPanel("search");
  }

  function goToSection(id: string) {
    close();
    window.setTimeout(() => scrollTo(id), 0);
  }

  return {
    sections,
    activeId,
    panel,
    activeProduct,
    activePairing,
    close,
    openProduct,
    openProductById,
    openPairing,
    openCategories,
    openSearch,
    goToSection,
    scrollTo,
  };
}
