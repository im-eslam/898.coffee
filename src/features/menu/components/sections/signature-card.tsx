import { Button } from "react-aria-components";
import type { Locale } from "@/shared/i18n";
import type { Product } from "../../types/menu-models";
import { Badge } from "../ui/badge";
import { Chevron } from "../ui/chevron";
import { Img } from "../ui/img";
import { Price } from "../ui/price";

interface SignatureCardProps {
  product: Product;
  locale: Locale;
  formatMoney: (value: number, plus?: boolean) => string;
  onOpen: (product: Product) => void;
  priority?: boolean;
  className?: string;
}

const styles = {
  root: "relative flex shrink-0 flex-col gap-3 rounded-lg bg-white/70 p-3 ring-1 ring-sand/60 sm:p-4",
  frame: "relative",
  image: "aspect-square w-full rounded-md",
  grayscale: "grayscale",
  badge: "absolute end-2 bottom-2",
  text: "flex min-w-0 flex-col gap-1",
  name: "line-clamp-2 text-heading font-bold text-balance text-charcoal",
  description: "line-clamp-2 text-caption font-medium text-pretty text-navy/65",
  bottom: "mt-auto flex items-center gap-2 pt-1",
  unavailable: "opacity-60",
  chevron: "ms-auto",
  action:
    "absolute inset-0 z-10 rounded-lg outline-none data-focus-visible:outline-2 data-focus-visible:outline-offset-2 data-focus-visible:outline-brand",
} as const;

export function SignatureCard({
  product,
  locale,
  formatMoney,
  onOpen,
  priority,
  className,
}: SignatureCardProps) {
  const name = product.name[locale];
  const description = product.description[locale];
  const inStock = product.availability === "in_stock";
  const badge = inStock ? product.badge : "outOfStock";
  const price = product.pricing.options[0];

  return (
    <div data-carousel-card className={`${styles.root} ${className ?? ""}`}>
      <div className={styles.frame}>
        <Img
          image={product.image}
          priority={priority}
          className={`${styles.image} ${inStock ? "" : styles.grayscale}`}
        />
        {badge && (
          <div className={styles.badge}>
            <Badge kind={badge} />
          </div>
        )}
      </div>

      <div className={styles.text}>
        <span className={styles.name}>{name}</span>
        {description && (
          <span className={styles.description}>{description}</span>
        )}
      </div>

      <div className={`${styles.bottom} ${inStock ? "" : styles.unavailable}`}>
        {price && (
          <Price
            value={price.final}
            regular={price.price}
            formatMoney={formatMoney}
            size="body"
          />
        )}

        <span className={styles.chevron}>
          <Chevron />
        </span>
      </div>

      <Button
        type="button"
        aria-label={name}
        onPress={() => onOpen(product)}
        className={styles.action}
      />
    </div>
  );
}
