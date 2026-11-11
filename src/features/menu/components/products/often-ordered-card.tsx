import { Button } from "react-aria-components";
import { useLocale, useStrings } from "@/shared/i18n";
import type { ProductRef, Pricing } from "@/features/menu/types/menu-models";
import { strings } from "@/features/menu/strings";
import { Badge } from "../ui/badge";
import { Chevron } from "../ui/chevron";
import { MenuImage } from "../ui/menu-image";
import { Price } from "../ui/price";

interface OftenOrderedCardProps {
  product: ProductRef;
  currency: string;
  onPress: () => void;
}

interface ResolvedPrice {
  final: number;
  regular: number | null;
}

// Local pricing helper — same logic used by the product and signature cards.
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
  root: "flex w-28 shrink-0 flex-col gap-1 rounded-md border border-arctic bg-white p-2 text-start outline-none transition duration-interactive ease-smooth data-hovered:border-navy/20 data-pressed:scale-[0.98] data-focus-visible:ring-2 data-focus-visible:ring-brand motion-reduce:transition-none",
  imageFrame: "relative",
  image: "h-16 w-full rounded-md",
  imageUnavailable: "grayscale",
  badge: "absolute end-1 top-1",
  name: "line-clamp-2 min-h-[2lh] text-caption font-medium text-balance",
  footer: "flex items-center justify-between gap-1",
  footerUnavailable: "opacity-60",
} as const;

export function OftenOrderedCard({
  product,
  currency,
  onPress,
}: OftenOrderedCardProps) {
  const t = useStrings(strings);
  const locale = useLocale();
  const inStock = product.availability === "in_stock";
  const displayPrice = resolveProductPrice(product.pricing);

  return (
    <Button
      aria-label={t.product.a11yOpen(product.name[locale])}
      onPress={onPress}
      className={styles.root}
    >
      <span className={styles.imageFrame}>
        <MenuImage
          src={product.image}
          alt=""
          className={[styles.image, !inStock && styles.imageUnavailable]
            .filter(Boolean)
            .join(" ")}
        />
        {!inStock && (
          <span className={styles.badge}>
            <Badge kind="out_of_stock" label={t.badge.outOfStock} compact />
          </span>
        )}
      </span>

      <span className={styles.name}>{product.name[locale]}</span>

      <span
        className={[styles.footer, !inStock && styles.footerUnavailable]
          .filter(Boolean)
          .join(" ")}
      >
        {displayPrice && (
          <Price
            locale={locale}
            value={displayPrice.final}
            currency={currency}
            regularValue={displayPrice.regular}
            size="caption"
          />
        )}
        <Chevron size="sm" />
      </span>
    </Button>
  );
}
