import { useState } from "react";
import {
  setLocale,
  useLocale,
  useStrings,
  type Localized,
} from "@/shared/i18n";
import { PairingsSection } from "./components/sections/pairings-section";
import { ProductsSection } from "./components/sections/products-section";
import { SignaturesSection } from "./components/sections/signatures-section";
import { ErrorState } from "./components/states/error-state";
import { LoadingState } from "./components/states/loading-state";
import { MenuButton } from "./components/ui/menu-button";
import { createMoneyFormatter } from "./components/ui/price-formatter";
import { useData } from "./hooks/use-data";
import { config } from "./strings";
import type { Pairing, Product } from "./types/menu-models";

interface PreviewStrings {
  title: string;
  language: string;
  loading: {
    title: string;
    description: string;
  };
  networkError: {
    title: string;
    description: string;
    retry: string;
  };
  otherError: {
    title: string;
    description: string;
    retry: string;
  };
  emptySignatures: string;
  emptyPairings: string;
  emptyCategories: string;
  selectedProduct: string;
  selectedPairing: string;
  savings: (amount: string) => string;
  showAll: (name: string, count: number) => string;
}

const previewStrings: Localized<PreviewStrings> = {
  en: {
    title: "Menu sections preview",
    language: "العربية",
    loading: {
      title: "Loading menu",
      description: "Please wait while the menu loads.",
    },
    networkError: {
      title: "Unable to connect",
      description: "Check your connection and try again.",
      retry: "Try again",
    },
    otherError: {
      title: "Unable to load the menu",
      description: "Please try again.",
      retry: "Try again",
    },
    emptySignatures: "There are no signature products.",
    emptyPairings: "There are no pairings.",
    emptyCategories: "There are no product categories.",
    selectedProduct: "Selected product:",
    selectedPairing: "Selected pairing:",
    savings: (amount) => `Save ${amount}`,
    showAll: (name, count) => `Show all ${name} (${count})`,
  },
  ar: {
    title: "معاينة أقسام القائمة",
    language: "English",
    loading: {
      title: "جارٍ تحميل القائمة",
      description: "يرجى الانتظار حتى يتم تحميل القائمة.",
    },
    networkError: {
      title: "تعذّر الاتصال",
      description: "تحقق من اتصالك وحاول مرة أخرى.",
      retry: "حاول مرة أخرى",
    },
    otherError: {
      title: "تعذّر تحميل القائمة",
      description: "يرجى المحاولة مرة أخرى.",
      retry: "حاول مرة أخرى",
    },
    emptySignatures: "لا توجد منتجات مميزة.",
    emptyPairings: "لا توجد توليفات.",
    emptyCategories: "لا توجد فئات منتجات.",
    selectedProduct: "المنتج المحدد:",
    selectedPairing: "التوليفة المحددة:",
    savings: (amount) => `وفّر ${amount}`,
    showAll: (name, count) => `عرض جميع منتجات ${name} (${count})`,
  },
};

type PreviewSelection =
  | { type: "product"; product: Product }
  | { type: "pairing"; pairing: Pairing }
  | null;

const styles = {
  page: "min-h-dvh",
  toolbar:
    "mx-auto flex w-full max-w-5xl items-center justify-between gap-4 px-4 py-4 md:px-6",
  title: "text-heading font-bold text-charcoal",
  message: "mx-auto w-full max-w-5xl px-4 py-6 text-body text-charcoal md:px-6",
  selection:
    "mx-auto w-full max-w-5xl px-4 py-6 text-body text-charcoal md:px-6",
  selectedLabel: "font-semibold",
} as const;

export function MenuPage() {
  const result = useData();
  const locale = useLocale();
  const s = useStrings(previewStrings);
  const sections = useStrings(config.sections);

  const [selection, setSelection] = useState<PreviewSelection>(null);

  const currency = result.status === "ready" ? result.menu.currency : "";

  const formatMoney = createMoneyFormatter(locale, currency);

  function toggleLanguage() {
    setLocale(locale === "en" ? "ar" : "en");
  }

  function openProduct(product: Product) {
    setSelection({ type: "product", product });
  }

  function openPairing(pairing: Pairing) {
    setSelection({ type: "pairing", pairing });
  }

  function retry() {
    setSelection(null);
    result.retry();
  }

  return (
    <main dir={locale === "ar" ? "rtl" : "ltr"} className={styles.page}>
      <div className={styles.toolbar}>
        <h1 className={styles.title}>{s.title}</h1>

        <MenuButton variant="secondary" onPress={toggleLanguage}>
          <span lang={locale === "en" ? "ar" : "en"}>{s.language}</span>
        </MenuButton>
      </div>

      {result.status === "loading" && <LoadingState strings={s.loading} />}

      {result.status === "error" && (
        <ErrorState
          strings={result.isNetworkError ? s.networkError : s.otherError}
          onRetry={retry}
        />
      )}

      {result.status === "ready" && (
        <>
          <div
            role="status"
            aria-live="polite"
            aria-atomic="true"
            className={styles.selection}
          >
            {selection?.type === "product" && (
              <p>
                <span className={styles.selectedLabel}>
                  {s.selectedProduct}
                </span>{" "}
                {selection.product.name[locale]}
              </p>
            )}

            {selection?.type === "pairing" && (
              <p>
                <span className={styles.selectedLabel}>
                  {s.selectedPairing}
                </span>{" "}
                {selection.pairing.items
                  .map((product) => product.name[locale])
                  .join(" + ")}
              </p>
            )}
          </div>

          {result.menu.signatures.length > 0 ? (
            <SignaturesSection
              products={result.menu.signatures}
              locale={locale}
              strings={{
                title: sections.signatures.label,
              }}
              formatMoney={formatMoney}
              onOpen={openProduct}
            />
          ) : (
            <p className={styles.message}>{s.emptySignatures}</p>
          )}

          {result.menu.pairings.length > 0 ? (
            <PairingsSection
              pairings={result.menu.pairings}
              locale={locale}
              strings={{
                title: sections.pairings.label,
                savings: s.savings,
              }}
              formatMoney={formatMoney}
              onOpen={openPairing}
            />
          ) : (
            <p className={styles.message}>{s.emptyPairings}</p>
          )}

          {result.menu.categories.length > 0 ? (
            result.menu.categories.map((category) => (
              <ProductsSection
                key={category.id}
                category={category}
                locale={locale}
                strings={{
                  showAll: s.showAll,
                }}
                formatMoney={formatMoney}
                onOpen={openProduct}
              />
            ))
          ) : (
            <p className={styles.message}>{s.emptyCategories}</p>
          )}
        </>
      )}
    </main>
  );
}
