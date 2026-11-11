import { useStrings } from "@/shared/i18n";
import type { ProductRef } from "@/features/menu/types/menu-models";
import { strings } from "@/features/menu/strings";
import { OftenOrderedCard } from "./often-ordered-card";

interface OftenOrderedProductsProps {
  products: ProductRef[];
  currency: string;
  onOpenProduct: (productId: string) => void;
}

const styles = {
  root: "flex flex-col gap-2",
  title: "text-body font-bold text-charcoal",
  rail: "no-scrollbar flex gap-2 overflow-x-auto pb-1",
} as const;

export function OftenOrderedProducts({
  products,
  currency,
  onOpenProduct,
}: OftenOrderedProductsProps) {
  const t = useStrings(strings);

  if (products.length === 0) return null;

  return (
    <section aria-label={t.product.oftenOrderedWith} className={styles.root}>
      <h3 className={styles.title}>{t.product.oftenOrderedWith}</h3>
      <div className={styles.rail}>
        {products.map((product) => (
          <OftenOrderedCard
            key={product.id}
            product={product}
            currency={currency}
            onPress={() => onOpenProduct(product.id)}
          />
        ))}
      </div>
    </section>
  );
}
