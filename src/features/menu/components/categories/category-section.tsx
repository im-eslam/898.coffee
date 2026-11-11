import { useState } from "react";
import { Button } from "react-aria-components";
import { useLocale, useStrings } from "@/shared/i18n";
import type { Category, Product } from "@/features/menu/types/menu-models";
import { strings } from "@/features/menu/strings";
import { SectionHeading } from "../ui/section-heading";
import { CategoryProductCard } from "./category-product-card";

const FIRST_VISIBLE = 4;

interface CategorySectionProps {
  category: Category;
  currency: string;
  onOpenProduct: (product: Product) => void;
}

const styles = {
  section: "scroll-mt-28 py-6",
  inner: "mx-auto flex w-full max-w-5xl flex-col gap-4 px-4 md:px-6",
  grid: "grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3",
  showAll:
    "flex h-12 w-full items-center justify-center rounded-full border border-arctic px-4 text-small font-semibold text-charcoal outline-none transition duration-interactive ease-smooth data-hovered:bg-white data-pressed:bg-cream data-focus-visible:ring-2 data-focus-visible:ring-brand md:col-span-full md:mx-auto md:w-auto md:min-w-72 motion-reduce:transition-none",
} as const;

export function CategorySection({
  category,
  currency,
  onOpenProduct,
}: CategorySectionProps) {
  const locale = useLocale();
  const t = useStrings(strings);
  const [showAll, setShowAll] = useState(false);

  const name = category.name[locale];
  const visibleProducts = showAll
    ? category.products
    : category.products.slice(0, FIRST_VISIBLE);
  const hasMore = category.products.length > FIRST_VISIBLE;

  return (
    <section id={category.id} aria-label={name} className={styles.section}>
      <div className={styles.inner}>
        <SectionHeading title={name} />

        <div className={styles.grid}>
          {visibleProducts.map((product) => (
            <CategoryProductCard
              key={product.id}
              product={product}
              currency={currency}
              onPress={() => onOpenProduct(product)}
            />
          ))}

          {!showAll && hasMore && (
            <Button onPress={() => setShowAll(true)} className={styles.showAll}>
              {t.sections.showAll(name, category.products.length)}
            </Button>
          )}
        </div>
      </div>
    </section>
  );
}
    