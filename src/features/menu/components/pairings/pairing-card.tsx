import { Fragment } from "react";
import { Button } from "react-aria-components";
import { useLocale } from "@/shared/i18n";
import type { Pairing } from "@/features/menu/types/menu-models";
import { Chevron } from "../ui/chevron";
import { MenuImage } from "../ui/menu-image";
import { Price } from "../ui/price";

interface PairingCardProps {
  pairing: Pairing;
  currency: string;
  onPress: () => void;
  className?: string;
}

const styles = {
  root: [
    "group flex h-full w-full flex-col gap-2 rounded-md border border-arctic bg-white p-2 text-start",
    "outline-none transition duration-interactive ease-smooth",
    "data-hovered:border-navy/20 data-hovered:bg-cream/60",
    "data-pressed:scale-[0.98]",
    "data-focus-visible:ring-2 data-focus-visible:ring-brand data-focus-visible:ring-offset-1",
    "motion-reduce:transition-none",
  ].join(" "),

  // Image composition row
  pictures: "flex w-full items-center gap-1",
  picture: "aspect-square flex-1 min-w-0 rounded-md",
  pictureUnavailable: "grayscale",

  // Decorative plus between images — text, not an icon
  plusCircle: [
    "flex shrink-0 size-7 items-center justify-center rounded-full",
    "border-2 border-white bg-brand text-white text-small font-bold",
    "shadow-sm",
  ].join(" "),

  // Product names stacked
  names: "flex min-w-0 flex-col px-2 text-small font-semibold",
  nameRow: "truncate",
  nameSeparator: "text-taupe/70 me-1",

  // Bottom row: price + chevron
  bottom: "mt-auto flex items-center gap-2 px-2 pb-1 pt-1",
  bottomUnavailable: "opacity-60",
  chevronWrap: "ms-auto",

  // Empty state when no items are present
  emptyFrame: "flex aspect-[2/1] w-full items-center justify-center rounded-md bg-sand/30 text-taupe/50 text-caption",
} as const;

export function PairingCard({
  pairing,
  currency,
  onPress,
  className,
}: PairingCardProps) {
  const locale = useLocale();

  const { items, pricing } = pairing;
  const hasItems = items.length > 0;

  // A pairing is visually unavailable when any included product is out of stock.
  const anyUnavailable = items.some(
    (item) => item.availability === "out_of_stock",
  );
  const hasDiscount = pricing.price > pricing.final;

  return (
    <Button
      onPress={onPress}
      className={[styles.root, className].filter(Boolean).join(" ")}
    >
      {/* Image composition */}
      {hasItems ? (
        <span className={styles.pictures}>
          {items.map((item, i) => (
            <Fragment key={item.id}>
              {i > 0 && (
                // Decorative separator — hidden from AT since names convey the relationship
                <span aria-hidden="true" className={styles.plusCircle}>
                  +
                </span>
              )}
              <MenuImage
                src={item.image}
                alt={item.name[locale]}
                className={[
                  styles.picture,
                  item.availability === "out_of_stock" &&
                    styles.pictureUnavailable,
                ]
                  .filter(Boolean)
                  .join(" ")}
              />
            </Fragment>
          ))}
        </span>
      ) : (
        <span className={styles.emptyFrame} aria-hidden="true" />
      )}

      {/* Product names */}
      {hasItems && (
        <span className={styles.names}>
          {items.map((item, i) => (
            <span key={item.id} className={styles.nameRow}>
              {i > 0 && (
                <span aria-hidden="true" className={styles.nameSeparator}>
                  +{" "}
                </span>
              )}
              {item.name[locale]}
            </span>
          ))}
        </span>
      )}

      {/* Price row */}
      <span
        className={[
          styles.bottom,
          anyUnavailable && styles.bottomUnavailable,
        ]
          .filter(Boolean)
          .join(" ")}
      >
        <Price
          locale={locale}
          value={pricing.final}
          currency={currency}
          regularValue={hasDiscount ? pricing.price : undefined}
          size="small"
        />
        <span className={styles.chevronWrap}>
          <Chevron size="sm" />
        </span>
      </span>
    </Button>
  );
}