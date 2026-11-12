import { memo } from "react";
import type { ReactNode } from "react";
import {
  Button,
  Dialog,
  Input,
  Label,
  Modal,
  ModalOverlay,
  SearchField,
} from "react-aria-components";
import type { Locale } from "@/shared/i18n";
import { Icon } from "@/shared/icons";
import { useSearch } from "../../hooks/components/use-search";
import type { Category, Menu, Pairing, Product } from "../../types/menu";
import { resolveImageUrl } from "../../util/image";
import {
  getProductPrice,
  isPairingAvailable,
  isProductAvailable,
} from "../../util/pricing";
import { Badge } from "../ui/badge";
import { Img } from "../ui/img";
import { MenuButton } from "../ui/menu-button";
import { Price } from "../ui/price";

export interface SearchOverlayStrings {
  label: string;
  placeholder: string;
  clear: string;
  close: string;
  prompt: string;
  noMatch: (query: string) => string;
  itemsCount: (count: number) => string;
  groupCategories: string;
  groupOffers: string;
  groupItems: string;
}

export interface SearchOverlayProps {
  menu: Menu;
  locale: Locale;
  strings: SearchOverlayStrings;
  formatMoney: (value: number, plus?: boolean) => string;
  isOpen: boolean;
  onClose: () => void;
  onPickCategory: (categoryId: string) => void;
  onPickPairing: (pairing: Pairing) => void;
  onPickProduct: (product: Product) => void;
}

type SearchPanelProps = Omit<SearchOverlayProps, "isOpen">;

const styles = {
  overlay:
    "fixed inset-0 z-50 flex justify-center overscroll-none md:items-start md:p-6 md:pt-[8dvh] data-entering:animate-fade-in data-exiting:animate-fade-out motion-reduce:animate-none",
  scrim: "pointer-events-none absolute inset-0 bg-scrim",
  modal:
    "relative z-10 flex h-full w-full max-w-120 flex-col overflow-hidden bg-white outline-none data-entering:animate-fade-in data-exiting:animate-fade-out motion-reduce:animate-none md:h-[min(40rem,80dvh)] md:max-w-140 md:rounded-lg md:shadow-sheet",
  dialog: "flex min-h-0 flex-1 flex-col outline-none",

  topBar:
    "flex items-center gap-1 border-b border-arctic ps-4 pe-2 md:ps-6 md:pe-4",
  field: "group relative my-2 flex h-12 min-w-0 flex-1 items-center",
  fieldLabel: "sr-only",
  fieldIcon: "pointer-events-none absolute start-4 size-5",
  input:
    "h-12 w-full appearance-none rounded-full border border-arctic bg-mist ps-12 pe-11 text-body outline-none transition-colors duration-150 placeholder:text-navy/55 focus:bg-white data-focus-visible:border-navy [&::-webkit-search-cancel-button]:hidden",
  clear:
    "absolute end-1 flex size-10 items-center justify-center rounded-full outline-none group-data-empty:hidden data-hovered:bg-mist data-pressed:bg-arctic data-focus-visible:outline-2 data-focus-visible:outline-brand",
  clearIcon: "size-4",

  liveRegion: "sr-only",
  results: "min-h-0 flex-1 overflow-y-auto overscroll-contain pb-6",
  message:
    "flex flex-col items-center gap-3 px-6 py-12 text-center text-small font-medium text-pretty text-navy/65",
  messageIcon: "size-8",
  groupHeading: "px-4 py-2 text-caption font-semibold text-navy/65",

  rowWrap: "border-b-[0.5px] border-sand/30",
  row: "flex w-full items-center gap-3 px-4 text-start outline-none data-hovered:bg-mist/60 data-pressed:bg-mist data-focus-visible:-outline-offset-2 data-focus-visible:outline-2 data-focus-visible:outline-brand",
  rowCategory: "min-h-12",
  rowRich: "min-h-18 py-2",
  rowName: "min-w-0 flex-1 text-body font-medium text-balance",
  rowCount: "shrink-0 text-caption font-medium tabular-nums text-navy/65",

  pairThumbs: "flex shrink-0 gap-1",
  pairThumb: "size-8 rounded-md",

  productThumb: "size-12 shrink-0 rounded-md",
  productText: "flex min-w-0 flex-1 flex-col items-start",
  productName: "text-body font-medium text-balance",
  productDescription: "line-clamp-1 text-caption font-medium text-navy/65",

  unavailable: "opacity-60",
  grayscale: "grayscale",
} as const;

export function SearchOverlay({
  isOpen,
  onClose,
  ...panel
}: SearchOverlayProps) {
  return (
    <ModalOverlay
      isOpen={isOpen}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
      isDismissable
      className={styles.overlay}
    >
      <div aria-hidden="true" className={styles.scrim} />
      <Modal className={styles.modal}>
        <Dialog aria-labelledby="search-dialog-title" className={styles.dialog}>
          <h2 id="search-dialog-title" className="sr-only">
            {panel.strings.label}
          </h2>
          <SearchPanel onClose={onClose} {...panel} />
        </Dialog>
      </Modal>
    </ModalOverlay>
  );
}

function SearchPanel({
  menu,
  locale,
  strings: s,
  formatMoney,
  onClose,
  onPickCategory,
  onPickPairing,
  onPickProduct,
}: SearchPanelProps) {
  const { query, setQuery, appliedQuery, hasQuery, results, total } = useSearch(
    menu,
    locale
  );

  return (
    <>
      <div className={styles.topBar}>
        <SearchField
          autoFocus
          value={query}
          onChange={setQuery}
          className={styles.field}
        >
          <Label className={styles.fieldLabel}>{s.label}</Label>
          <Icon name="search" className={styles.fieldIcon} />
          <Input placeholder={s.placeholder} className={styles.input} />
          <Button className={styles.clear}>
            <Icon name="close" className={styles.clearIcon} />
            <span className="sr-only">{s.clear}</span>
          </Button>
        </SearchField>

        <MenuButton variant="close" onPress={onClose} />
      </div>

      <p aria-live="polite" className={styles.liveRegion}>
        {hasQuery ? s.itemsCount(total) : ""}
      </p>

      <div className={styles.results}>
        {!hasQuery && (
          <div className={styles.message}>
            <Icon name="search" className={styles.messageIcon} />
            <p>{s.prompt}</p>
          </div>
        )}

        {hasQuery && total === 0 && (
          <div className={styles.message}>
            <Icon name="search" className={styles.messageIcon} />
            <p>{s.noMatch(appliedQuery)}</p>
          </div>
        )}

        {results.categories.length > 0 && (
          <section aria-labelledby="search-categories-heading">
            <h2 id="search-categories-heading" className={styles.groupHeading}>
              {s.groupCategories}
            </h2>
            {results.categories.map((category) => (
              <CategoryRow
                key={category.id}
                category={category}
                locale={locale}
                onPickCategory={onPickCategory}
              />
            ))}
          </section>
        )}

        {results.pairings.length > 0 && (
          <section aria-labelledby="search-offers-heading">
            <h2 id="search-offers-heading" className={styles.groupHeading}>
              {s.groupOffers}
            </h2>
            {results.pairings.map((pairing) => (
              <PairingRow
                key={pairing.id}
                pairing={pairing}
                locale={locale}
                formatMoney={formatMoney}
                onPickPairing={onPickPairing}
              />
            ))}
          </section>
        )}

        {results.products.length > 0 && (
          <section aria-labelledby="search-items-heading">
            <h2 id="search-items-heading" className={styles.groupHeading}>
              {s.groupItems}
            </h2>
            {results.products.map((product) => (
              <ProductRow
                key={product.id}
                product={product}
                locale={locale}
                formatMoney={formatMoney}
                onPickProduct={onPickProduct}
              />
            ))}
          </section>
        )}
      </div>
    </>
  );
}

function ResultRow({
  onPress,
  className,
  children,
}: {
  onPress: () => void;
  className: string;
  children: ReactNode;
}) {
  return (
    <div className={styles.rowWrap}>
      <Button
        type="button"
        onPress={onPress}
        className={`${styles.row} ${className}`}
      >
        {children}
      </Button>
    </div>
  );
}

const CategoryRow = memo(function CategoryRow({
  category,
  locale,
  onPickCategory,
}: {
  category: Category;
  locale: Locale;
  onPickCategory: (categoryId: string) => void;
}) {
  return (
    <ResultRow
      onPress={() => onPickCategory(category.id)}
      className={styles.rowCategory}
    >
      <span className={styles.rowName}>{category.name[locale]}</span>
      <span className={styles.rowCount}>{category.products.length}</span>
    </ResultRow>
  );
});

const PairingRow = memo(function PairingRow({
  pairing,
  locale,
  formatMoney,
  onPickPairing,
}: {
  pairing: Pairing;
  locale: Locale;
  formatMoney: (value: number, plus?: boolean) => string;
  onPickPairing: (pairing: Pairing) => void;
}) {
  const available = isPairingAvailable(pairing);

  return (
    <ResultRow
      onPress={() => onPickPairing(pairing)}
      className={styles.rowRich}
    >
      <span className={styles.pairThumbs}>
        {pairing.items.map((product) => (
          <Img
            key={product.id}
            src={resolveImageUrl(product.image, "thumb")}
            className={`${styles.pairThumb} ${
              available ? "" : styles.grayscale
            }`}
          />
        ))}
      </span>

      <span className={styles.rowName}>
        {pairing.items.map((product) => product.name[locale]).join(" + ")}
      </span>

      <span className={available ? undefined : styles.unavailable}>
        <Price
          value={pairing.pricing.final}
          regular={pairing.pricing.price}
          formatMoney={formatMoney}
          size="small"
        />
      </span>
    </ResultRow>
  );
});

const ProductRow = memo(function ProductRow({
  product,
  locale,
  formatMoney,
  onPickProduct,
}: {
  product: Product;
  locale: Locale;
  formatMoney: (value: number, plus?: boolean) => string;
  onPickProduct: (product: Product) => void;
}) {
  const inStock = isProductAvailable(product);
  const description = product.description[locale];
  const { current, regular } = getProductPrice(product.pricing);

  return (
    <ResultRow
      onPress={() => onPickProduct(product)}
      className={styles.rowRich}
    >
      <Img
        src={resolveImageUrl(product.image, "thumb")}
        className={`${styles.productThumb} ${inStock ? "" : styles.grayscale}`}
      />

      <span className={styles.productText}>
        <span className={styles.productName}>{product.name[locale]}</span>
        {description && (
          <span className={styles.productDescription}>{description}</span>
        )}
        {!inStock && <Badge kind="outOfStock" compact />}
      </span>

      {product.pricing.options.length > 0 && (
        <span className={inStock ? undefined : styles.unavailable}>
          <Price
            value={current}
            regular={regular}
            formatMoney={formatMoney}
            size="small"
          />
        </span>
      )}
    </ResultRow>
  );
});
