import { useMemo } from "react";
import { useStrings } from "@/shared/i18n";
import { ROUTES } from "@/shared/router";
import { HeaderBar } from "./components/header/header-bar";
import { HeaderNav } from "./components/header/header-nav";
import { PromoPopup } from "./components/overlays/promo-popup";
import { SearchOverlay } from "./components/overlays/search-overlay";
import { PairingsSection } from "./components/sections/pairings-section";
import { ProductsSection } from "./components/sections/products-section";
import { SignaturesSection } from "./components/sections/signatures-section";
import { CategorySheet } from "./components/sheets/category-sheet";
import { PairingSheet } from "./components/sheets/pairing-sheet";
import { ProductSheet } from "./components/sheets/product-sheet";
import { ErrorState } from "./components/states/error-state";
import { LoadingState } from "./components/states/loading-state";
import { useData } from "./hooks/use-data";
import { useMenu } from "./hooks/use-menu";
import { strings } from "./strings";
import type { Menu } from "./types/menu-models";
import { createMoneyFormatter } from "./util/pricing";
import { getCategorySectionId } from "./util/section-ids";

const styles = {
  page: "relative isolate min-h-dvh pb-8",
  header: "sticky top-0 z-40 bg-cream/90 backdrop-blur",
  main: "flex flex-col",
  srOnly: "sr-only",
} as const;

export function MenuPage() {
  const data = useData();
  const s = useStrings(strings);

  if (data.status === "loading") {
    return (
      <main>
        <LoadingState
          strings={{
            title: s.loading.title,
            description: s.loading.description,
          }}
        />
      </main>
    );
  }

  if (data.status === "error") {
    return (
      <main>
        <ErrorState
          strings={{
            title: data.isNetworkError
              ? s.errors.network.title
              : s.errors.generic.title,
            description: data.isNetworkError
              ? s.errors.network.description
              : s.errors.generic.description,
            retry: data.isNetworkError
              ? s.errors.network.retry
              : s.errors.generic.retry,
          }}
          onRetry={data.retry}
        />
      </main>
    );
  }

  return <MenuReady menu={data.menu} />;
}

function MenuReady({ menu }: { menu: Menu }) {
  const s = useStrings(strings);
  const state = useMenu(menu);
  const { locale, panel, activeId } = state;

  const direction = locale === "ar" ? "rtl" : "ltr";

  const formatMoney = useMemo(
    () => createMoneyFormatter(locale, menu.currency),
    [locale, menu.currency]
  );

  const activeCategoryId =
    menu.categories.find(
      (category) => getCategorySectionId(category.id) === activeId
    )?.id ?? "";

  function pickCategory(categoryId: string) {
    state.selectSection(getCategorySectionId(categoryId));
  }

  return (
    <div className={styles.page}>
      <header ref={state.headerRef} className={styles.header}>
        <HeaderBar
          strings={{
            back: s.header.back,
            search: s.header.search,
            languageName: s.header.language.name,
            languageLang: s.header.language.lang,
          }}
          backHref={ROUTES.landing}
          onSearch={state.openSearch}
          onLanguageChange={state.toggleLanguage}
        />

        <HeaderNav
          strings={{ categories: s.header.categories }}
          sections={state.sections}
          activeId={activeId}
          direction={direction}
          onSelect={state.selectSection}
          onCategories={state.openCategories}
        />
      </header>

      <main className={styles.main}>
        <h1 className={styles.srOnly}>{s.page.title}</h1>

        {menu.signatures.length > 0 && (
          <SignaturesSection
            products={menu.signatures}
            locale={locale}
            strings={{
              title: state.predefinedSections.signatures.label,
              sub: s.signatures.sub,
            }}
            formatMoney={formatMoney}
            onOpen={state.openProduct}
          />
        )}

        {menu.pairings.length > 0 && (
          <PairingsSection
            pairings={menu.pairings}
            locale={locale}
            strings={{
              title: state.predefinedSections.pairings.label,
              sub: s.pairings.sub,
              savings: s.pairings.savings,
            }}
            formatMoney={formatMoney}
            onOpen={state.openPairing}
          />
        )}

        {menu.categories.map((category) => (
          <ProductsSection
            key={category.id}
            category={category}
            locale={locale}
            strings={{ showAll: s.products.showAll }}
            formatMoney={formatMoney}
            onOpen={state.openProduct}
          />
        ))}
      </main>

      <SearchOverlay
        menu={menu}
        locale={locale}
        strings={{
          label: s.search.label,
          placeholder: s.search.placeholder,
          clear: s.search.clear,
          close: s.search.close,
          prompt: s.search.prompt,
          noMatch: s.search.noMatch,
          itemsCount: s.search.itemsCount,
          groupCategories: s.search.groupCategories,
          groupOffers: s.search.groupOffers,
          groupItems: s.search.groupItems,
        }}
        formatMoney={formatMoney}
        isOpen={panel === "search"}
        onClose={state.close}
        onPickCategory={pickCategory}
        onPickPairing={state.openPairing}
        onPickProduct={state.openProduct}
      />

      <CategorySheet
        strings={{
          close: s.sheets.close,
          categories: s.sheets.categories,
          categoriesDescription: s.sheets.categoriesDescription,
        }}
        locale={locale}
        isOpen={panel === "categories"}
        categories={menu.categories}
        activeId={activeCategoryId}
        onClose={state.close}
        onPick={pickCategory}
      />

      {state.productSheet && (
        <ProductSheet
          key={state.productSheet.key}
          product={state.productSheet.item}
          strings={{
            itemDescription: s.sheets.itemDescription,
            outOfStock: s.sheets.outOfStock,
            oftenOrdered: s.sheets.oftenOrdered,
            openItem: s.sheets.openItem,
            size: s.sheets.size,
            baristaWay: s.sheets.baristaWay,
            baristaSub: s.sheets.baristaSub,
            addOns: s.sheets.addOns,
          }}
          locale={locale}
          formatMoney={formatMoney}
          isOpen={panel === "product"}
          onClose={state.close}
          onOpenProduct={state.openProductById}
        />
      )}

      {state.pairingSheet && (
        <PairingSheet
          key={state.pairingSheet.key}
          pairing={state.pairingSheet.item}
          strings={{
            itemDescription: s.sheets.itemDescription,
            outOfStock: s.sheets.outOfStock,
            saveChip: s.sheets.saveChip,
            size: s.sheets.size,
            baristaWay: s.sheets.baristaWay,
            baristaSub: s.sheets.baristaSub,
            addOns: s.sheets.addOns,
          }}
          locale={locale}
          formatMoney={formatMoney}
          isOpen={panel === "pairing"}
          onClose={state.close}
        />
      )}

      <PromoPopup popup={menu.popup} busy={panel !== null} />
    </div>
  );
}
