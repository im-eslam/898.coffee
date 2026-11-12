import { useMemo } from "react";
import { setLocale, useLocale, useStrings } from "@/shared/i18n";
import { config } from "../strings";
import type { Menu } from "../types/menu";
import type { NavSection } from "../types/flow";
import { getCategorySectionId } from "../util/section-ids";
import { useMenuFlow } from "./use-menu-flow";
import { useMenuNavigation } from "./use-menu-navigation";

export function useMenu(menu: Menu) {
  const locale = useLocale();
  const predefinedSections = useStrings(config.sections);

  const sections = useMemo<NavSection[]>(() => {
    const result: NavSection[] = [];
    if (menu.signatures.length > 0) {
      result.push(predefinedSections.signatures);
    }
    if (menu.pairings.length > 0) {
      result.push(predefinedSections.pairings);
    }
    result.push(
      ...menu.categories.map((category) => ({
        id: getCategorySectionId(category.id),
        label: category.name[locale],
      }))
    );

    return result;
  }, [menu, locale, predefinedSections]);

  const flow = useMenuFlow();
  const navigation = useMenuNavigation(sections);

  function selectSection(id: string) {
    flow.close();
    navigation.selectSection(id);
  }

  function openProductById(id: string) {
    const product = menu.productMap[id];
    if (product) {
      flow.openProduct(product);
    }
  }

  function toggleLanguage() {
    setLocale(locale === "en" ? "ar" : "en");
  }

  return {
    locale,
    predefinedSections,
    sections,
    activeId: navigation.activeId,
    headerRef: navigation.headerRef,
    panel: flow.panel,
    productSheet: flow.productSheet,
    pairingSheet: flow.pairingSheet,

    selectSection,
    toggleLanguage,
    openProductById,
    openProduct: flow.openProduct,
    openPairing: flow.openPairing,
    openSearch: flow.openSearch,
    openCategories: flow.openCategories,
    close: flow.close,
  };
}
