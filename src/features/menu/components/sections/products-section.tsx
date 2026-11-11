import { useState } from "react";
import type { Locale } from "@/shared/i18n";
import type { Category, Product } from "../../types/menu-models";
import { getCategorySectionId } from "../../util/section-ids";
import { Heading } from "../ui/heading";
import { MenuButton } from "../ui/menu-button";
import { ProductCard } from "./product-card";

const FIRST_VISIBLE = 4;
const STAGGER_STEPS = 6;
const STAGGER_MS = 40;

interface ProductsSectionStrings {
  showAll: (name: string, count: number) => string;
}

interface ProductsSectionProps {
  category: Category;
  locale: Locale;
  strings: ProductsSectionStrings;
  formatMoney: (value: number, plus?: boolean) => string;
  onOpen: (product: Product) => void;
  className?: string;
}

const styles = {
  section: "scroll-mt-26 py-6",
  inner: "mx-auto flex w-full max-w-5xl flex-col gap-4 px-4 md:px-6",
  grid: "grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3",
  showAll: "md:col-span-full md:mx-auto md:w-auto md:min-w-72",
  reveal: "animate-reveal-in motion-reduce:animate-none",
} as const;

export function ProductsSection({
  category,
  locale,
  strings: s,
  formatMoney,
  onOpen,
  className,
}: ProductsSectionProps) {
  const [showAll, setShowAll] = useState(false);

  const name = category.name[locale];
  const firstProducts = category.products.slice(0, FIRST_VISIBLE);
  const otherProducts = category.products.slice(FIRST_VISIBLE);

  return (
    <section
      id={getCategorySectionId(category.id)}
      dir={locale === "ar" ? "rtl" : "ltr"}
      aria-label={name}
      className={`${styles.section} ${className ?? ""}`}
    >
      <div className={styles.inner}>
        <Heading>{name}</Heading>

        <div className={styles.grid}>
          {firstProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              locale={locale}
              formatMoney={formatMoney}
              onOpen={onOpen}
            />
          ))}

          {showAll &&
            otherProducts.map((product, index) => (
              <div
                key={product.id}
                className={styles.reveal}
                style={{
                  animationDelay: `${
                    Math.min(index, STAGGER_STEPS) * STAGGER_MS
                  }ms`,
                }}
              >
                <ProductCard
                  product={product}
                  locale={locale}
                  formatMoney={formatMoney}
                  onOpen={onOpen}
                />
              </div>
            ))}

          {!showAll && otherProducts.length > 0 && (
            <MenuButton
              variant="secondary"
              width="full"
              onPress={() => setShowAll(true)}
              className={styles.showAll}
            >
              {s.showAll(name, category.products.length)}
            </MenuButton>
          )}
        </div>
      </div>
    </section>
  );
}
