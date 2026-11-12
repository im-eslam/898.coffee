import { Button } from "react-aria-components";
import type { Locale } from "@/shared/i18n";
import type { Product } from "../../types/menu-models";
import { Badge } from "../ui/badge";
import { Chevron } from "../ui/chevron";
import { Img } from "../ui/img";
import { Price } from "../ui/price";

interface ProductCardProps {
  product: Product;
  locale: Locale;
  formatMoney: (value: number, plus?: boolean) => string;
  onOpen: (product: Product) => void;
}

const styles = {
  root: "relative flex h-full w-full gap-3 rounded-lg bg-paper p-3 ring-1 ring-sand/40 transition-transform duration-(--duration-interactive) ease-smooth has-[[data-pressed]]:scale-[0.96] motion-reduce:transition-none",
  image: "size-24 shrink-0 rounded-md",
  grayscale: "grayscale",
  content: "flex min-w-0 flex-1 flex-col gap-0.5",
  name: "line-clamp-2 text-body font-semibold text-balance text-charcoal",
  description: "line-clamp-2 text-caption font-medium text-navy/65",
  bottom: "mt-auto flex items-center justify-between gap-2 pt-1",
  unavailable: "opacity-60",
  chevron: "-my-1 ms-auto",
  badge: "absolute -top-2.5 end-4",
  action:
    "absolute inset-0 z-10 rounded-lg outline-none data-focus-visible:outline-2 data-focus-visible:-outline-offset-2 data-focus-visible:outline-brand",
} as const;

export function ProductCard({
  product,
  locale,
  formatMoney,
  onOpen,
}: ProductCardProps) {
  const name = product.name[locale];
  const description = product.description[locale];
  const inStock = product.availability === "in_stock";
  const badge = inStock ? product.badge : "outOfStock";
  const price = product.pricing.options[0];

  return (
    <div className={styles.root}>
      <Img
        image={product.image}
        className={`${styles.image} ${inStock ? "" : styles.grayscale}`}
      />

      <div className={styles.content}>
        <span className={styles.name}>{name}</span>

        {description && (
          <span className={styles.description}>{description}</span>
        )}

        <div className={styles.bottom}>
          {price && (
            <span className={inStock ? undefined : styles.unavailable}>
              <Price
                value={price.final}
                regular={price.price}
                formatMoney={formatMoney}
                size="small"
              />
            </span>
          )}

          <span className={styles.chevron}>
            <Chevron size="s" />
          </span>
        </div>
      </div>

      {badge && (
        <div className={styles.badge}>
          <Badge kind={badge} compact />
        </div>
      )}

      <Button
        type="button"
        aria-label={name}
        onPress={() => onOpen(product)}
        className={styles.action}
      />
    </div>
  );
}
