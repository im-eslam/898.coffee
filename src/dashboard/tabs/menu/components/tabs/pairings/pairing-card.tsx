import { Button } from "react-aria-components";
import { useStrings } from "@/shared/i18n";
import { Icon } from "@/shared/icons";
import type { DraftPairing } from "../../../types/draft";
import type { ProductOption } from "../../../types/ui";
import { finalPrice } from "../../../util/draft";
import { strings } from "../../../strings";
import { NumberInput } from "../../ui/number-input";
import { ProductCombobox } from "../../ui/product-combobox";

const focusRing =
  "outline-none data-[focus-visible]:outline-2 data-[focus-visible]:outline-offset-2 data-[focus-visible]:outline-brand";

const styles = {
  card: "flex flex-col gap-5 rounded-2xl border border-slate-200 bg-white p-5 sm:p-6",
  header: "flex items-center justify-between gap-3",
  title: "min-w-0 truncate text-body font-semibold text-slate-900",
  remove: `inline-flex size-11 shrink-0 items-center justify-center rounded-lg text-slate-500 transition-colors data-[hovered]:bg-error/5 data-[hovered]:text-error ${focusRing}`,
  products: "grid gap-4 sm:grid-cols-2",
  pricing: "grid items-end gap-4 sm:grid-cols-3",
  finalWrap: "flex flex-col gap-1.5",
  finalLabel: "text-small font-medium text-slate-700",
  finalValue:
    "flex h-11 items-center rounded-lg bg-slate-50 px-3 text-body font-semibold text-slate-900",
} as const;

export interface PairingCardErrors {
  items: string[];
  price: string[];
  discount: string[];
}

interface PairingCardProps {
  pairing: DraftPairing;
  name: string;
  options: ProductOption[];
  currency: string;
  errors: PairingCardErrors;
  onSetItem: (slot: 0 | 1, productId: string) => void;
  onSetPrice: (price: number) => void;
  onSetDiscount: (discount: number) => void;
  onRemove: () => void;
}

export function PairingCard({
  pairing,
  name,
  options,
  currency,
  errors,
  onSetItem,
  onSetPrice,
  onSetDiscount,
  onRemove,
}: PairingCardProps) {
  const s = useStrings(strings);
  const [first = "", second = ""] = pairing.items;
  const { price, discount } = pairing.pricing;

  const slotOptions = (current: string, other: string): ProductOption[] => {
    const list = options.filter((option) => option.id !== other);
    if (current !== "" && !options.some((option) => option.id === current)) {
      list.push({
        id: current,
        label: s.pairings.missingProduct,
        search: "",
        price: 0,
      });
    }
    return list;
  };

  const priceErrors = [
    ...errors.price,
    ...(price > 0 ? [] : [s.pairings.invalidPrice]),
  ];
  const discountErrors = [
    ...errors.discount,
    ...(discount > price ? [s.pairings.discountTooHigh] : []),
  ];

  return (
    <section className={styles.card} aria-label={name}>
      <div className={styles.header}>
        <h3 className={styles.title}>{name}</h3>
        <Button
          className={styles.remove}
          aria-label={`${s.pairings.remove}: ${name}`}
          onPress={onRemove}
        >
          <Icon name="trash" className="size-5" />
        </Button>
      </div>

      <div className={styles.products}>
        <ProductCombobox
          label={s.pairings.productA}
          placeholder={s.pairings.pickPlaceholder}
          options={slotOptions(first, second)}
          value={first}
          errors={errors.items}
          onChange={(id) => onSetItem(0, id)}
        />
        <ProductCombobox
          label={s.pairings.productB}
          placeholder={s.pairings.pickPlaceholder}
          options={slotOptions(second, first)}
          value={second}
          onChange={(id) => onSetItem(1, id)}
        />
      </div>

      <div className={styles.pricing}>
        <NumberInput
          label={s.pairings.price}
          value={price}
          errors={priceErrors}
          onCommit={onSetPrice}
        />
        <NumberInput
          label={s.pairings.discount}
          value={discount}
          errors={discountErrors}
          onCommit={onSetDiscount}
        />
        <div className={styles.finalWrap}>
          <span className={styles.finalLabel}>{s.common.final}</span>
          <p className={styles.finalValue}>
            {`${finalPrice(price, discount)} ${currency}`}
          </p>
        </div>
      </div>
    </section>
  );
}
