import type { Locale } from "@/shared/i18n";
import { useCarousel } from "../../hooks/components/use-carousel";
import type { Product } from "../../types/menu-models";
import { Heading } from "../ui/heading";
import { SignatureCard } from "./signature-card";

interface SignaturesSectionStrings {
  title: string;
  sub?: string;
}

interface SignaturesSectionProps {
  products: Product[];
  locale: Locale;
  strings: SignaturesSectionStrings;
  formatMoney: (value: number, plus?: boolean) => string;
  onOpen: (product: Product) => void;
  className?: string;
}

const styles = {
  section: "scroll-mt-26 rounded-b-sheet bg-navy py-8",
  inner: "mx-auto flex w-full max-w-5xl flex-col gap-4",
  head: "px-4 md:px-6",
  rail: "no-scrollbar flex snap-x snap-mandatory gap-4 overflow-x-auto overscroll-x-contain px-4 pt-px pb-1 scroll-ps-4 md:grid md:snap-none md:grid-cols-3 md:overflow-visible md:px-6 md:pt-0 lg:grid-cols-4",
  card: "w-[72%] min-w-64 max-w-96 snap-start md:w-auto md:min-w-0 md:max-w-none",
  dots: "flex justify-center gap-2 md:hidden",
  dot: "size-2 rounded-full transition-colors duration-(--duration-interactive) ease-smooth motion-reduce:transition-none",
  dotActive: "bg-honey",
  dotIdle: "bg-cream/30",
} as const;

export function SignaturesSection({
  products,
  locale,
  strings: s,
  formatMoney,
  onOpen,
  className,
}: SignaturesSectionProps) {
  const direction = locale === "ar" ? "rtl" : "ltr";

  const { railRef, activeIndex } = useCarousel({
    contentKey: JSON.stringify(products.map((product) => product.id)),
    direction,
  });

  return (
    <section
      id="signatures"
      dir={direction}
      aria-label={s.title}
      className={`${styles.section} ${className ?? ""}`}
    >
      <div className={styles.inner}>
        <div className={styles.head}>
          <Heading
            className="[&>h2]:text-cream [&>p]:text-cream/75"
            sub={s.sub}
          >
            {s.title}
          </Heading>
        </div>

        <div ref={railRef} className={styles.rail}>
          {products.map((product, index) => (
            <SignatureCard
              key={product.id}
              product={product}
              locale={locale}
              formatMoney={formatMoney}
              onOpen={onOpen}
              priority={index === 0}
              className={styles.card}
            />
          ))}
        </div>

        {products.length > 1 && (
          <div aria-hidden="true" className={styles.dots}>
            {products.map((product, index) => (
              <span
                key={product.id}
                className={`${styles.dot} ${
                  index === activeIndex ? styles.dotActive : styles.dotIdle
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
