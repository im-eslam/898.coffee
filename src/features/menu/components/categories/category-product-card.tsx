import { Button } from "react-aria-components";
import { useLocale, useStrings } from "@/shared/i18n";
import type { Product, Pricing } from "@/features/menu/types/menu-models";
import { strings } from "@/features/menu/strings";
import { Badge } from "../ui/badge";
import { Chevron } from "../ui/chevron";
import { MenuImage } from "../ui/menu-image";
import { Price } from "../ui/price";

interface CategoryProductCardProps {
  product: Product;
  currency: string;
  onPress: () => void;
  className?: string;
}

interface ResolvedPrice {
  final: number;
  regular: number | null;
  isFrom: boolean;
}

function resolveProductPrice(pricing: Pricing): ResolvedPrice | null {
  if (pricing.options.length === 0) return null;

  if (pricing.type === "single") {
    const opt = pricing.options[0]!;
    return {
      final: opt.final,
      regular: opt.price > opt.final ? opt.price : null,
      isFrom: false,
    };
  }

  const opt = pricing.options.reduce((best, cur) =>
    cur.final < best.final ? cur : best
  );
  return {
    final: opt.final,
    regular: opt.price > opt.final ? opt.price : null,
    isFrom: true,
  };
}

const styles = {
  root: [
    "group relative flex w-full gap-3 rounded-md border border-arctic bg-white p-3 text-start",
    "outline-none transition duration-interactive ease-smooth",
    "data-hovered:border-navy/20 data-hovered:bg-cream/60",
    "data-pressed:scale-[0.98]",
    "data-focus-visible:ring-2 data-focus-visible:ring-brand data-focus-visible:ring-offset-1",
    "motion-reduce:transition-none",
  ].join(" "),
  image: "size-24 shrink-0 rounded-md",
  imageUnavailable: "grayscale",
  content: "flex min-w-0 flex-1 flex-col gap-0.5",
  name: "line-clamp-2 text-body font-semibold text-balance",
  description: "line-clamp-2 text-caption text-taupe/80 text-pretty",
  bottom: "mt-auto flex items-center justify-between gap-2 pt-1",
  priceGroup: "inline-flex items-baseline gap-1",
  fromLabel: "text-caption text-taupe",
  priceUnavailable: "opacity-60",
  chevronWrap: "-my-1",
  badge: "absolute -top-2.5 end-4",
} as const;

export function CategoryProductCard({
  product,
  currency,
  onPress,
  className,
}: CategoryProductCardProps) {
  const locale = useLocale();
  const t = useStrings(strings);

  const inStock = product.availability === "in_stock";
  const displayPrice = resolveProductPrice(product.pricing);
  const description = product.description[locale];

  const badgeKind = inStock
    ? (product.badge ?? null)
    : ("out_of_stock" as const);

  const badgeLabel =
    badgeKind === "new"
      ? t.badge.new
      : badgeKind === "top"
        ? t.badge.top
        : badgeKind === "out_of_stock"
          ? t.badge.outOfStock
          : null;

  return (
    <Button
      onPress={onPress}
      className={[styles.root, className].filter(Boolean).join(" ")}
    >
      <MenuImage
        src={product.image}
        alt={product.name[locale]}
        className={[styles.image, !inStock && styles.imageUnavailable]
          .filter(Boolean)
          .join(" ")}
      />

      <span className={styles.content}>
        <span className={styles.name}>{product.name[locale]}</span>

        {description && (
          <span className={styles.description}>{description}</span>
        )}

        <span className={styles.bottom}>
          {displayPrice !== null ? (
            <span
              className={[
                styles.priceGroup,
                !inStock && styles.priceUnavailable,
              ]
                .filter(Boolean)
                .join(" ")}
            >
              {displayPrice.isFrom && (
                <span className={styles.fromLabel}>{t.price.from}</span>
              )}
              <Price
                locale={locale}
                value={displayPrice.final}
                currency={currency}
                regularValue={displayPrice.regular}
              />
            </span>
          ) : (
            <span />
          )}

          <span className={styles.chevronWrap}>
            <Chevron size="sm" />
          </span>
        </span>
      </span>

      {badgeKind !== null && badgeLabel !== null && (
        <span className={styles.badge}>
          <Badge kind={badgeKind} label={badgeLabel} compact />
        </span>
      )}
    </Button>
  );
}
