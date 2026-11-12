import { Button } from "react-aria-components";
import type { Locale } from "@/shared/i18n";
import { Icon } from "@/shared/icons";
import type { Pairing } from "../../types/menu-models";
import { Badge } from "../ui/badge";
import { Chevron } from "../ui/chevron";
import { Img } from "../ui/img";
import { Price } from "../ui/price";

interface PairingCardProps {
  pairing: Pairing;
  locale: Locale;
  formatMoney: (value: number, plus?: boolean) => string;
  savingsLabel: (amount: string) => string;
  onOpen: (pairing: Pairing) => void;
  className?: string;
}

const styles = {
  root: "relative flex shrink-0 flex-col gap-2 rounded-lg bg-white/70 p-2 ring-1 ring-sand/60",
  pictures: "relative flex aspect-2/1 w-full gap-1",
  picture: "min-w-0 flex-1 rounded-md",
  grayscale: "grayscale",
  plus: "absolute inset-0 m-auto flex size-8 items-center justify-center rounded-full border-2 border-white bg-brand text-white",
  plusIcon: "size-4",
  savings: "absolute end-2 top-2",
  names:
    "flex min-w-0 flex-col px-2 text-small font-semibold text-balance text-charcoal",
  bottom: "mt-auto flex items-center gap-2 px-2 pt-1 pb-2",
  unavailable: "opacity-60",
  chevron: "ms-auto",
  action:
    "absolute inset-0 z-10 rounded-lg outline-none data-focus-visible:outline-2 data-focus-visible:-outline-offset-2 data-focus-visible:outline-brand",
} as const;

export function PairingCard({
  pairing,
  locale,
  formatMoney,
  savingsLabel,
  onOpen,
  className,
}: PairingCardProps) {
  const { final, price, discount } = pairing.pricing;
  const hasSavings = discount > 0;

  const available = pairing.items.every(
    (product) => product.availability === "in_stock"
  );

  const name = pairing.items.map((product) => product.name[locale]).join(" + ");

  return (
    <div data-carousel-card className={`${styles.root} ${className ?? ""}`}>
      <div className={styles.pictures}>
        {pairing.items.map((product) => (
          <Img
            key={product.id}
            image={product.image}
            className={`${styles.picture} ${
              product.availability === "out_of_stock" ? styles.grayscale : ""
            }`}
          />
        ))}

        {pairing.items.length > 1 && (
          <span aria-hidden="true" className={styles.plus}>
            <Icon name="plus" className={styles.plusIcon} />
          </span>
        )}

        {hasSavings && available && (
          <div className={styles.savings}>
            <Badge kind="savings" compact outlined>
              {savingsLabel(formatMoney(discount))}
            </Badge>
          </div>
        )}
      </div>

      <div className={styles.names}>
        {pairing.items.map((product, index) => (
          <span key={product.id}>
            {index > 0 && "+ "}
            {product.name[locale]}
          </span>
        ))}
      </div>

      <div
        className={`${styles.bottom} ${available ? "" : styles.unavailable}`}
      >
        <Price
          value={final}
          regular={hasSavings ? price : undefined}
          formatMoney={formatMoney}
          size="small"
        />

        <span className={styles.chevron}>
          <Chevron size="s" />
        </span>
      </div>

      <Button
        type="button"
        aria-label={name}
        onPress={() => onOpen(pairing)}
        className={styles.action}
      />
    </div>
  );
}
