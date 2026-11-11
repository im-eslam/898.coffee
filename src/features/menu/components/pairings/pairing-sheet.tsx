import { useLocale, useStrings } from "@/shared/i18n";
import type { Pairing } from "@/features/menu/types/menu-models";
import { strings } from "@/features/menu/strings";
import { Badge } from "../ui/badge";
import { BottomSheet } from "../ui/bottom-sheet";
import { MenuImage } from "../ui/menu-image";
import { Price } from "../ui/price";

interface PairingSheetProps {
  pairing: Pairing;
  currency: string;
  isOpen: boolean;
  onClose: () => void;
}

const styles = {
  content: "flex flex-col gap-6",
  pictures: "flex gap-2",
  picture: "aspect-square flex-1 rounded-lg",
  pictureUnavailable: "grayscale",
  intro: "flex flex-col items-start gap-2",
  title: "text-title font-bold text-balance",
  item: "flex flex-col gap-4 border-t border-sand/50 pt-5 first:border-t-0 first:pt-0",
  itemHeader: "flex items-center gap-3",
  itemImage: "size-12 shrink-0 rounded-md",
  itemImageUnavailable: "grayscale",
  itemName: "min-w-0 flex-1 text-body font-semibold text-balance",
} as const;

export function PairingSheet({
  pairing,
  currency,
  isOpen,
  onClose,
}: PairingSheetProps) {
  const t = useStrings(strings);
  const locale = useLocale();

  const title = pairing.items
    .map((product) => product.name[locale])
    .join(" + ");
  const available = pairing.items.every(
    (product) => product.availability === "in_stock"
  );
  const hasDiscount = pairing.pricing.price > pairing.pricing.final;

  return (
    <BottomSheet
      isOpen={isOpen}
      title={title}
      description={title}
      closeLabel={t.common.close}
      onClose={onClose}
    >
      <div className={styles.content}>
        <div className={styles.pictures}>
          {pairing.items.map((product) => (
            <MenuImage
              key={product.id}
              src={product.image}
              alt={product.name[locale]}
              className={[
                styles.picture,
                product.availability === "out_of_stock" &&
                  styles.pictureUnavailable,
              ]
                .filter(Boolean)
                .join(" ")}
            />
          ))}
        </div>

        <div className={styles.intro}>
          {!available && (
            <Badge kind="out_of_stock" label={t.badge.outOfStock} />
          )}
          {available && hasDiscount && (
            <Badge
              kind="new"
              label={t.pairing.save(
                new Intl.NumberFormat(locale, {
                  style: "currency",
                  currency,
                  maximumFractionDigits: 0,
                }).format(pairing.pricing.price - pairing.pricing.final)
              )}
            />
          )}
          <h2 className={styles.title}>{title}</h2>
          <Price
            value={pairing.pricing.final}
            currency={currency}
            locale={locale}
            regularValue={hasDiscount ? pairing.pricing.price : undefined}
          />
        </div>

        {pairing.items.map((product) => (
          <div key={product.id} className={styles.item}>
            <div className={styles.itemHeader}>
              <MenuImage
                src={product.image}
                alt=""
                className={[
                  styles.itemImage,
                  product.availability === "out_of_stock" &&
                    styles.itemImageUnavailable,
                ]
                  .filter(Boolean)
                  .join(" ")}
              />
              <h3 className={styles.itemName}>{product.name[locale]}</h3>
              {product.availability === "out_of_stock" && (
                <Badge kind="out_of_stock" label={t.badge.outOfStock} compact />
              )}
            </div>
          </div>
        ))}
      </div>
    </BottomSheet>
  );
}
