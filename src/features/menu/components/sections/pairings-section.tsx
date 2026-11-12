import type { Locale } from "@/shared/i18n";
import { useCarousel } from "../../hooks/components/use-carousel";
import type { Pairing } from "../../types/menu-models";
import { Heading } from "../ui/heading";
import { PairingCard } from "./pairing-card";

interface PairingsSectionStrings {
  title: string;
  sub?: string;
  savings: (amount: string) => string;
}

interface PairingsSectionProps {
  pairings: Pairing[];
  locale: Locale;
  strings: PairingsSectionStrings;
  formatMoney: (value: number, plus?: boolean) => string;
  onOpen: (pairing: Pairing) => void;
  className?: string;
}

const styles = {
  section: "scroll-mt-26 pt-6 pb-5",
  inner: "mx-auto flex w-full max-w-5xl flex-col gap-4",
  head: "px-4 md:px-6",
  rail: "no-scrollbar flex snap-x snap-mandatory gap-3 overflow-x-auto overscroll-x-contain px-4 pt-px pb-1 scroll-ps-4 md:grid md:snap-none md:grid-cols-2 md:overflow-visible md:px-6 md:pt-0 lg:grid-cols-3",
  card: "w-[80%] min-w-72 snap-start md:w-auto md:min-w-0",
  dots: "flex justify-center gap-2 md:hidden",
  dot: "size-2 rounded-full transition-colors duration-(--duration-interactive) ease-smooth motion-reduce:transition-none",
  dotActive: "bg-brand",
  dotIdle: "bg-arctic",
} as const;

export function PairingsSection({
  pairings,
  locale,
  strings: s,
  formatMoney,
  onOpen,
  className,
}: PairingsSectionProps) {
  const direction = locale === "ar" ? "rtl" : "ltr";

  const { railRef, activeIndex } = useCarousel({
    contentKey: JSON.stringify(pairings.map((pairing) => pairing.id)),
    direction,
  });

  return (
    <section
      id="pairings"
      dir={direction}
      aria-label={s.title}
      className={`${styles.section} ${className ?? ""}`}
    >
      <div className={styles.inner}>
        <div className={styles.head}>
          <Heading sub={s.sub}>{s.title}</Heading>
        </div>

        <div ref={railRef} className={styles.rail}>
          {pairings.map((pairing) => (
            <PairingCard
              key={pairing.id}
              pairing={pairing}
              locale={locale}
              formatMoney={formatMoney}
              savingsLabel={s.savings}
              onOpen={onOpen}
              className={styles.card}
            />
          ))}
        </div>

        {pairings.length > 1 && (
          <div aria-hidden="true" className={styles.dots}>
            {pairings.map((pairing, index) => (
              <span
                key={pairing.id}
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
