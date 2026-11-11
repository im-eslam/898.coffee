import type { ReactNode } from "react";
import { Button } from "react-aria-components";
import { useLocale, useStrings } from "@/shared/i18n";
import { Icon } from "@/shared/icons";
import type {
  Category,
  Pairing,
  Pricing,
  Product,
} from "@/features/menu/types/menu-models";
import { strings } from "@/features/menu/strings";
import { Badge } from "../ui/badge";
import { MenuImage } from "../ui/menu-image";
import { Price } from "../ui/price";

interface SearchResultsProps {
  query: string;
  currency: string;
  categories: Category[];
  pairings: Pairing[];
  products: Product[];
  onPickCategory: (categoryId: string) => void;
  onPickPairing: (pairing: Pairing) => void;
  onPickProduct: (product: Product) => void;
}

interface ResolvedPrice {
  final: number;
  regular: number | null;
}

function resolveProductPrice(pricing: Pricing): ResolvedPrice | null {
  if (pricing.options.length === 0) return null;
  const opt =
    pricing.type === "single"
      ? pricing.options[0]!
      : pricing.options.reduce((best, cur) =>
          cur.final < best.final ? cur : best
        );
  return {
    final: opt.final,
    regular: opt.price > opt.final ? opt.price : null,
  };
}

const styles = {
  message:
    "flex flex-col items-center gap-3 px-6 py-12 text-center text-small font-medium text-pretty text-taupe",
  messageIcon: "size-8",
  groupHeading: "px-4 py-2 text-caption font-semibold text-taupe",
  rowWrap: "border-b border-sand/40",
  row: "flex w-full items-center gap-3 px-4 text-start outline-none transition-colors duration-interactive ease-smooth data-hovered:bg-sand/30 data-pressed:bg-sand/50 data-focus-visible:ring-2 data-focus-visible:-outline-offset-2 data-focus-visible:ring-brand motion-reduce:transition-none",
  rowCategory: "min-h-12",
  rowRich: "min-h-18 py-2",
  rowName: "min-w-0 flex-1 text-body font-medium text-balance",
  rowCount: "shrink-0 text-caption font-medium tabular-nums text-taupe",
  pairThumbs: "flex shrink-0 gap-1",
  pairThumb: "size-8 rounded-md",
  productThumb: "size-12 shrink-0 rounded-md",
  productThumbUnavailable: "grayscale",
  productText: "flex min-w-0 flex-1 flex-col items-start",
  productName: "text-body font-medium text-balance",
  productDescription: "line-clamp-1 text-caption text-taupe",
  unavailable: "opacity-60",
} as const;

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
      <Button onPress={onPress} className={[styles.row, className].join(" ")}>
        {children}
      </Button>
    </div>
  );
}

export function SearchResults({
  query,
  currency,
  categories,
  pairings,
  products,
  onPickCategory,
  onPickPairing,
  onPickProduct,
}: SearchResultsProps) {
  const t = useStrings(strings);
  const locale = useLocale();
  const total = categories.length + pairings.length + products.length;

  if (!query) {
    return (
      <div className={styles.message}>
        <Icon name="search" className={styles.messageIcon} />
        <p>{t.search.prompt}</p>
      </div>
    );
  }

  if (total === 0) {
    return (
      <div className={styles.message}>
        <Icon name="search" className={styles.messageIcon} />
        <p>{t.search.noMatch(query)}</p>
      </div>
    );
  }

  return (
    <>
      <p className="sr-only" aria-live="polite">
        {total === 1 ? t.search.resultsCountOne : t.search.resultsCount(total)}
      </p>

      {categories.length > 0 && (
        <section aria-label={t.search.groupCategories}>
          <h2 className={styles.groupHeading}>{t.search.groupCategories}</h2>
          {categories.map((category) => (
            <ResultRow
              key={category.id}
              onPress={() => onPickCategory(category.id)}
              className={styles.rowCategory}
            >
              <span className={styles.rowName}>{category.name[locale]}</span>
              <span className={styles.rowCount}>
                {category.products.length}
              </span>
            </ResultRow>
          ))}
        </section>
      )}

      {pairings.length > 0 && (
        <section aria-label={t.search.groupPairings}>
          <h2 className={styles.groupHeading}>{t.search.groupPairings}</h2>
          {pairings.map((pairing) => (
            <ResultRow
              key={pairing.id}
              onPress={() => onPickPairing(pairing)}
              className={styles.rowRich}
            >
              <span className={styles.pairThumbs}>
                {pairing.items.map((product) => (
                  <MenuImage
                    key={product.id}
                    src={product.image}
                    className={styles.pairThumb}
                  />
                ))}
              </span>
              <span className={styles.rowName}>
                {pairing.items
                  .map((product) => product.name[locale])
                  .join(" + ")}
              </span>
              <Price
                locale={locale}
                value={pairing.pricing.final}
                currency={currency}
                size="small"
              />
            </ResultRow>
          ))}
        </section>
      )}

      {products.length > 0 && (
        <section aria-label={t.search.groupProducts}>
          <h2 className={styles.groupHeading}>{t.search.groupProducts}</h2>
          {products.map((product) => {
            const inStock = product.availability === "in_stock";
            const description = product.description[locale];
            const displayPrice = resolveProductPrice(product.pricing);
            return (
              <ResultRow
                key={product.id}
                onPress={() => onPickProduct(product)}
                className={styles.rowRich}
              >
                <MenuImage
                  src={product.image}
                  className={[
                    styles.productThumb,
                    !inStock && styles.productThumbUnavailable,
                  ]
                    .filter(Boolean)
                    .join(" ")}
                />
                <span className={styles.productText}>
                  <span className={styles.productName}>
                    {product.name[locale]}
                  </span>
                  {description && (
                    <span className={styles.productDescription}>
                      {description}
                    </span>
                  )}
                  {!inStock && (
                    <Badge
                      kind="out_of_stock"
                      label={t.badge.outOfStock}
                      compact
                    />
                  )}
                </span>
                {displayPrice && (
                  <span className={inStock ? undefined : styles.unavailable}>
                    <Price
                      locale={locale}
                      value={displayPrice.final}
                      currency={currency}
                      regularValue={displayPrice.regular}
                    />
                  </span>
                )}
              </ResultRow>
            );
          })}
        </section>
      )}
    </>
  );
}
