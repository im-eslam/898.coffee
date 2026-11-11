import { useEffect, useRef, useState } from "react";
import { useStrings } from "@/shared/i18n";
import type { Product } from "@/features/menu/types/menu-models";
import { strings } from "@/features/menu/strings";
import { SectionHeading } from "../ui/section-heading";
import { SignatureCard } from "./signature-card";

interface SignaturesSectionProps {
  products: Product[];
  currency: string;
  onOpenProduct: (product: Product) => void;
}

const styles = {
  section: "scroll-mt-28 py-6",
  inner: "mx-auto flex w-full max-w-5xl flex-col gap-4",
  head: "px-4 md:px-6",
  rail: "no-scrollbar flex snap-x snap-mandatory gap-4 overflow-x-auto overscroll-x-contain px-4 pb-1 scroll-ps-4 md:grid md:snap-none md:grid-cols-3 md:gap-4 md:overflow-visible md:px-6 lg:grid-cols-4",
  card: "w-[72%] min-w-64 max-w-96 shrink-0 snap-start md:w-auto md:min-w-0 md:max-w-none",
  dots: "flex justify-center gap-2 md:hidden",
  dot: "size-2 rounded-full transition-colors duration-200 ease-out",
  dotActive: "bg-brand",
  dotIdle: "bg-arctic",
} as const;

export function SignaturesSection({
  products,
  currency,
  onOpenProduct,
}: SignaturesSectionProps) {
  const t = useStrings(strings);
  const rail = useRef<HTMLDivElement>(null);
  const frame = useRef(0);
  const [index, setIndex] = useState(0);

  function onScroll() {
    if (frame.current) return;
    frame.current = requestAnimationFrame(() => {
      frame.current = 0;
      const element = rail.current;
      const card = element?.querySelector<HTMLElement>("[data-signature-card]");
      if (!element || !card) return;
      const gap = parseFloat(getComputedStyle(element).columnGap) || 16;
      const step = card.offsetWidth + gap;
      setIndex(
        Math.min(
          products.length - 1,
          Math.max(0, Math.round(Math.abs(element.scrollLeft) / step))
        )
      );
    });
  }

  useEffect(() => () => cancelAnimationFrame(frame.current), []);

  return (
    <section
      id="signatures"
      aria-label={t.sections.signatures.title}
      className={styles.section}
    >
      <div className={styles.inner}>
        <div className={styles.head}>
          <SectionHeading
            title={t.sections.signatures.title}
            subtitle={t.sections.signatures.subtitle}
          />
        </div>

        <div ref={rail} onScroll={onScroll} className={styles.rail}>
          {products.map((product, i) => (
            <div key={product.id} data-signature-card className={styles.card}>
              <SignatureCard
                product={product}
                currency={currency}
                priority={i === 0}
                onPress={() => onOpenProduct(product)}
              />
            </div>
          ))}
        </div>

        <div className={styles.dots} aria-hidden="true">
          {products.map((product, i) => (
            <span
              key={product.id}
              className={[
                styles.dot,
                i === index ? styles.dotActive : styles.dotIdle,
              ].join(" ")}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
