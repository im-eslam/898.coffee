import { Button } from "react-aria-components";
import { useLocale, useStrings } from "@/shared/i18n";
import type { Product, Pricing } from "@/features/menu/types/menu-models";
import { strings } from "@/features/menu/strings";
import { Badge } from "../ui/badge";
import { Chevron } from "../ui/chevron";
import { MenuImage } from "../ui/menu-image";
import { Price } from "../ui/price";

interface SignatureCardProps {
  product: Product;
  currency: string;
  onPress: () => void;
  priority?: boolean;
  className?: string;
}

// Local pricing helper — same logic as CategoryProductCard, kept local per spec.
interface ResolvedPrice {
  final: number;
  regular: number | null;
  isFrom: boolean;
}

function resolveProductPrice(pricing: Pricing): ResolvedPrice | null {
  if (pricing.options.length === 0) return null;

  if (pricing.type === "single") {
    // Length is guaranteed > 0 by the guard above
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const opt = pricing.options[0]!;
    return {
      final: opt.final,
      regular: opt.price > opt.final ? opt.price : null,
      isFrom: false,
    };
  }

  // sizes: use the option with the lowest final price
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
    "group flex h-full w-full flex-col gap-3 rounded-md border border-arctic bg-white p-3 text-start",
    "outline-none transition duration-interactive ease-smooth",
    "data-hovered:border-navy/20 data-hovered:bg-cream/60",
    "data-pressed:scale-[0.98]",
    "data-focus-visible:ring-2 data-focus-visible:ring-brand data-focus-visible:ring-offset-1",
    "motion-reduce:transition-none",
  ].join(" "),
  imageFrame: "relative block",
  image: "aspect-square w-full rounded-md",
  imageUnavailable: "grayscale",
  badgeOverlay: "absolute end-2 bottom-2",
  text: "flex min-w-0 flex-col gap-1",
  name: "line-clamp-2 text-heading font-bold text-balance",
  description: "line-clamp-2 text-caption text-pretty text-taupe/80",
  bottom: "mt-auto flex items-center justify-between gap-2 pt-1",
  priceGroup: "inline-flex items-baseline gap-1",
  fromLabel: "text-caption text-taupe",
  bottomUnavailable: "opacity-60",
} as const;

export function SignatureCard({
  product,
  currency,
  onPress,
  priority = false,
  className,
}: SignatureCardProps) {
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
      <span className={styles.imageFrame}>
        <MenuImage
          src={product.image}
          alt={product.name[locale]}
          priority={priority}
          className={[styles.image, !inStock && styles.imageUnavailable]
            .filter(Boolean)
            .join(" ")}
        />
        {badgeKind !== null && badgeLabel !== null && (
          <span className={styles.badgeOverlay}>
            <Badge kind={badgeKind} label={badgeLabel} />
          </span>
        )}
      </span>

      <span className={styles.text}>
        <span className={styles.name}>{product.name[locale]}</span>
        {description && (
          <span className={styles.description}>{description}</span>
        )}
      </span>

      <span
        className={[styles.bottom, !inStock && styles.bottomUnavailable]
          .filter(Boolean)
          .join(" ")}
      >
        {displayPrice !== null ? (
          <span className={styles.priceGroup}>
            {displayPrice.isFrom && (
              <span className={styles.fromLabel}>{t.price.from}</span>
            )}
            <Price
              locale={locale}
              value={displayPrice.final}
              currency={currency}
              regularValue={displayPrice.regular}
              size="body"
            />
          </span>
        ) : (
          <span />
        )}
        <Chevron size="md" />
      </span>
    </Button>
  );
}
