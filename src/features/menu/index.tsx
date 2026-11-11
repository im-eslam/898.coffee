import * as C from "./components";
import { useMenu } from "./hooks/use-menu";
import { useMenuFlow } from "./hooks/use-menu-flow";
import type { Menu } from "./types/menu-models";

const styles = {
  page: "min-h-dvh bg-cream",
  main: "divide-y-8 divide-sand/30",
} as const;

export function MenuPage() {
  const menu = useMenu();

  if (menu.status === "loading") return <C.MenuLoadingState />;
  if (menu.status === "error") {
    return <C.MenuErrorState error={menu.error} onRetry={menu.retry} />;
  }

  return <MenuContent menu={menu.data} />;
}

function MenuContent({ menu }: { menu: Menu }) {
  const flow = useMenuFlow(menu);

  return (
    <div className={styles.page}>
      <C.MenuHeader
        sections={flow.sections}
        activeId={flow.activeId}
        onSelect={flow.scrollTo}
        onSearch={flow.openSearch}
        onCategories={flow.openCategories}
      />

      <main className={styles.main}>
        {menu.signatures.length > 0 && (
          <C.SignaturesSection
            products={menu.signatures}
            currency={menu.currency}
            onOpenProduct={flow.openProduct}
          />
        )}

        {menu.pairings.length > 0 && (
          <C.PairingsSection
            pairings={menu.pairings}
            currency={menu.currency}
            onOpenPairing={flow.openPairing}
          />
        )}

        {menu.categories.map((category) => (
          <C.CategorySection
            key={category.id}
            category={category}
            currency={menu.currency}
            onOpenProduct={flow.openProduct}
          />
        ))}
      </main>

      {flow.activeProduct && (
        <C.ProductSheet
          key={flow.activeProduct.id}
          product={flow.activeProduct.product}
          currency={menu.currency}
          isOpen={flow.panel === "product"}
          onClose={flow.close}
          onOpenProduct={flow.openProductById}
        />
      )}

      {flow.activePairing && (
        <C.PairingSheet
          key={flow.activePairing.id}
          pairing={flow.activePairing.pairing}
          currency={menu.currency}
          isOpen={flow.panel === "pairing"}
          onClose={flow.close}
        />
      )}

      <C.CategoryPickerSheet
        isOpen={flow.panel === "categories"}
        categories={menu.categories}
        activeId={flow.activeId}
        onClose={flow.close}
        onPick={flow.goToSection}
      />

      <C.SearchOverlay
        menu={menu}
        isOpen={flow.panel === "search"}
        onClose={flow.close}
        onPickCategory={flow.goToSection}
        onPickPairing={flow.openPairing}
        onPickProduct={flow.openProduct}
      />

      <C.PromoPopup popup={menu.popup} suppressed={flow.panel !== null} />
    </div>
  );
}
