import { useDeferredValue, useEffect, useState } from "react";
import {
  Button,
  Dialog,
  Input,
  Label,
  Modal,
  ModalOverlay,
  SearchField,
} from "react-aria-components";
import { useLocale, useStrings } from "@/shared/i18n";
import { Icon } from "@/shared/icons";
import type { Menu, Pairing, Product } from "@/features/menu/types/menu-models";
import { strings } from "@/features/menu/strings";
import { SearchResults } from "./search-results";

interface SearchOverlayProps {
  menu: Menu;
  isOpen: boolean;
  onClose: () => void;
  onPickCategory: (categoryId: string) => void;
  onPickPairing: (pairing: Pairing) => void;
  onPickProduct: (product: Product) => void;
}

const styles = {
  overlay:
    "fixed inset-0 z-50 flex justify-center overscroll-none bg-scrim md:items-start md:p-6 md:pt-[8dvh] data-entering:animate-scrim-in data-exiting:animate-scrim-out",
  modal:
    "relative flex h-full w-full max-w-120 flex-col overflow-hidden bg-cream outline-none md:h-[min(40rem,80dvh)] md:max-w-140 md:rounded-lg md:shadow-sheet",
  dialog: "flex min-h-0 flex-1 flex-col outline-none",

  topBar: "flex items-center gap-1 border-b border-arctic ps-4 pe-2",
  field: "group relative my-2 flex h-12 min-w-0 flex-1 items-center",
  fieldIcon: "pointer-events-none absolute start-4 size-5 text-taupe",
  input:
    "h-12 w-full appearance-none rounded-full border border-arctic bg-white ps-12 pe-11 text-body outline-none transition-colors duration-interactive ease-smooth placeholder:text-taupe focus:bg-white data-focus-visible:border-brand [&::-webkit-search-cancel-button]:hidden motion-reduce:transition-none",
  clear:
    "absolute end-1 flex size-10 items-center justify-center rounded-full outline-none group-data-empty:hidden transition-colors duration-interactive ease-smooth data-hovered:bg-sand/40 data-pressed:bg-sand/60 data-focus-visible:ring-2 data-focus-visible:ring-brand motion-reduce:transition-none",
  closeButton:
    "flex size-12 items-center justify-center rounded-full outline-none transition-colors duration-interactive ease-smooth data-hovered:bg-sand/40 data-pressed:bg-sand/60 data-focus-visible:ring-2 data-focus-visible:ring-brand motion-reduce:transition-none",
  results: "min-h-0 flex-1 overflow-y-auto overscroll-contain pb-6",
} as const;

function useLockPageScroll(locked: boolean) {
  useEffect(() => {
    if (!locked) return;
    const { body } = document;
    const previous = {
      overflow: body.style.overflow,
      overscroll: body.style.overscrollBehavior,
    };
    body.style.overflow = "hidden";
    body.style.overscrollBehavior = "none";
    return () => {
      body.style.overflow = previous.overflow;
      body.style.overscrollBehavior = previous.overscroll;
    };
  }, [locked]);
}

export function SearchOverlay({
  menu,
  isOpen,
  onClose,
  onPickCategory,
  onPickPairing,
  onPickProduct,
}: SearchOverlayProps) {
  const t = useStrings(strings);
  const locale = useLocale();
  const [query, setQuery] = useState("");
  useLockPageScroll(isOpen);

  const deferredQuery = useDeferredValue(query);
  const text = deferredQuery.trim().toLocaleLowerCase();
  const matches = (value: string) => value.toLocaleLowerCase().includes(text);

  const categories = text
    ? menu.categories.filter((category) => matches(category.name[locale]))
    : [];
  const pairings = text
    ? menu.pairings.filter((pairing) =>
        pairing.items.some((product) => matches(product.name[locale]))
      )
    : [];
  const products = text
    ? menu.categories
        .flatMap((category) => category.products)
        .filter(
          (product) =>
            matches(product.name[locale]) ||
            matches(product.description[locale])
        )
    : [];

  return (
    <ModalOverlay
      isOpen={isOpen}
      onOpenChange={(open) => !open && onClose()}
      isDismissable
      className={styles.overlay}
    >
      <Modal className={styles.modal}>
        <Dialog aria-label={t.header.searchLabel} className={styles.dialog}>
          <div className={styles.topBar}>
            <SearchField
              autoFocus
              value={query}
              onChange={setQuery}
              className={styles.field}
            >
              <Label className="sr-only">{t.header.searchLabel}</Label>
              <Icon name="search" className={styles.fieldIcon} />
              <Input
                placeholder={t.search.placeholder}
                className={styles.input}
              />
              <Button className={styles.clear}>
                <Icon name="close" size={16} />
              </Button>
            </SearchField>
            <Button
              aria-label={t.common.close}
              onPress={onClose}
              className={styles.closeButton}
            >
              <Icon name="close" className="size-6" />
            </Button>
          </div>

          <div className={styles.results}>
            <SearchResults
              query={deferredQuery.trim()}
              currency={menu.currency}
              categories={categories}
              pairings={pairings}
              products={products}
              onPickCategory={onPickCategory}
              onPickPairing={onPickPairing}
              onPickProduct={onPickProduct}
            />
          </div>
        </Dialog>
      </Modal>
    </ModalOverlay>
  );
}
