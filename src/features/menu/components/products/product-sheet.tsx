import { useLocale, useStrings } from "@/shared/i18n";
import type { Product } from "@/features/menu/types/menu-models";
import { strings } from "@/features/menu/strings";
import { Badge } from "../ui/badge";
import { BottomSheet } from "../ui/bottom-sheet";
import { MenuImage } from "../ui/menu-image";
import { Price } from "../ui/price";
import { OftenOrderedProducts } from "./often-ordered-products";

interface ProductSheetProps {
  product: Product;
  currency: string;
  isOpen: boolean;
  onClose: () => void;
  onOpenProduct: (productId: string) => void;
}

const styles = {
  content: "flex flex-col gap-6",
  hero: "relative",
  heroImage: "aspect-square w-full rounded-lg",
  heroImageUnavailable: "grayscale",
  heroBadge: "absolute end-2 top-2",
  intro: "flex flex-col items-start gap-2",
  title: "text-title font-bold text-balance",
  description: "text-small font-medium text-pretty text-taupe",
  price: "flex items-baseline gap-1",
  fromLabel: "text-caption text-taupe",
} as const;

export function ProductSheet({
  product,
  currency,
  isOpen,
  onClose,
  onOpenProduct,
}: ProductSheetProps) {
  const t = useStrings(strings);
  const locale = useLocale();

  const inStock = product.availability === "in_stock";
  const name = product.name[locale];
  const description = product.description[locale];
  const firstPrice = product.pricing.options[0];
  const displayPrice = firstPrice
    ? product.pricing.type === "sizes"
      ? product.pricing.options.reduce(
          (lowest, option) => (option.final < lowest.final ? option : lowest),
          firstPrice
        )
      : firstPrice
    : null;

  return (
    <BottomSheet
      isOpen={isOpen}
      title={name}
      description={description || name}
      closeLabel={t.common.close}
      onClose={onClose}
    >
      <div className={styles.content}>
        <div className={styles.hero}>
          <MenuImage
            src={product.image}
            alt={name}
            priority
            className={[
              styles.heroImage,
              !inStock && styles.heroImageUnavailable,
            ]
              .filter(Boolean)
              .join(" ")}
          />
          {!inStock && (
            <span className={styles.heroBadge}>
              <Badge kind="out_of_stock" label={t.badge.outOfStock} />
            </span>
          )}
        </div>

        <div className={styles.intro}>
          {inStock && product.badge && (
            <Badge
              kind={product.badge}
              label={product.badge === "new" ? t.badge.new : t.badge.top}
            />
          )}
          <h2 className={styles.title}>{name}</h2>
          {description && <p className={styles.description}>{description}</p>}
          {displayPrice && (
            <div className={styles.price}>
              {product.pricing.type === "sizes" && (
                <span className={styles.fromLabel}>{t.price.from}</span>
              )}
              <Price
                value={displayPrice.final}
                currency={currency}
                locale={locale}
                regularValue={
                  displayPrice.price > displayPrice.final
                    ? displayPrice.price
                    : undefined
                }
              />
            </div>
          )}
        </div>

        <OftenOrderedProducts
          products={product.oftenOrderedWith}
          currency={currency}
          onOpenProduct={onOpenProduct}
        />
      </div>
    </BottomSheet>
  );
}
