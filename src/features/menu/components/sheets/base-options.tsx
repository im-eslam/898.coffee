import {
  Checkbox,
  CheckboxGroup,
  Label,
  Radio,
  RadioGroup,
  ToggleButton,
} from "react-aria-components";
import type { Locale } from "@/shared/i18n";
import { Icon } from "@/shared/icons";
import type { Product } from "../../types/menu-models";
import { Badge } from "../ui/badge";
import { Img } from "../ui/img";
import { Price } from "../ui/price";

interface ProductOptionsStrings {
  size: string;
  baristaWay: string;
  baristaSub: string;
  addOns: string;
}

interface ProductOptionsProps {
  product: Product;
  strings: ProductOptionsStrings;
  locale: Locale;
  formatMoney: (value: number, plus?: boolean) => string;
  selectedOptionId: string | null;
  selectedAddOnIds: string[];
  onSelectOption: (optionId: string) => void;
  onSelectAddOns: (addOnIds: string[]) => void;
  showProduct?: boolean;
  isDisabled?: boolean;
}

const styles = {
  root: "flex flex-col gap-4",
  productHeader: "flex items-center gap-3",
  productImage: "size-12 shrink-0 rounded-md",
  productName: "min-w-0 flex-1 text-body font-semibold text-balance",
  grayscale: "grayscale",

  group: "flex flex-col gap-2",
  groupLabel: "text-body font-bold",
  sizes: "grid auto-cols-fr grid-flow-col gap-2",
  size: "flex min-h-12 flex-col items-center justify-center rounded-full border border-sand px-2 py-1 text-center outline-none data-hovered:bg-mist data-selected:border-brand data-selected:bg-brand data-selected:text-white data-disabled:opacity-50 data-focus-visible:outline-2 data-focus-visible:outline-offset-2 data-focus-visible:outline-brand",
  sizeName: "text-small font-medium",
  sizePrice: "text-caption tabular-nums",
  oldPrice: "me-1 line-through opacity-70",

  barista:
    "group flex min-h-14 w-full items-center gap-3 rounded-lg bg-arctic px-4 py-2 text-start outline-none data-selected:bg-sand data-selected:ring-2 data-selected:ring-inset data-selected:ring-brand data-disabled:opacity-50 data-focus-visible:outline-2 data-focus-visible:outline-brand",
  baristaIcon: "size-6 shrink-0",
  baristaText: "flex min-w-0 flex-1 flex-col",
  baristaTitle: "text-small font-bold",
  baristaSub: "text-caption font-medium",

  addOnsLabel: "pb-2 text-body font-bold",
  addOn:
    "group flex min-h-14 w-full items-center gap-4 border-b border-mist py-2 text-start outline-none data-hovered:bg-mist/60 data-disabled:opacity-50 data-focus-visible:outline-2 data-focus-visible:outline-brand",
  addOnBox:
    "flex size-6 shrink-0 items-center justify-center rounded-sm border-2 border-navy group-data-selected:border-brand group-data-selected:bg-brand group-data-selected:text-white",
  addOnName:
    "min-w-0 flex-1 text-body font-medium group-data-selected:font-semibold",
  addOnPrice: "shrink-0 text-end",

  tick: "size-4 scale-50 opacity-0 transition-[opacity,transform] duration-150 group-data-selected:scale-100 group-data-selected:opacity-100 motion-reduce:transition-none",
} as const;

export function BaseOptions({
  product,
  strings: s,
  locale,
  formatMoney,
  selectedOptionId,
  selectedAddOnIds,
  onSelectOption,
  onSelectAddOns,
  showProduct,
  isDisabled,
}: ProductOptionsProps) {
  const sizes = product.pricing.type === "sizes" ? product.pricing.options : [];
  const baristaIds = product.baristaWay.map((addOn) => addOn.id);

  const hasSizes = sizes.length > 0;
  const hasBarista = baristaIds.length > 0;
  const hasAddOns = product.addOns.length > 0;

  if (!hasSizes && !hasBarista && !hasAddOns) return null;

  const name = product.name[locale];
  const isOutOfStock = product.availability === "out_of_stock";
  const baristaOn = baristaIds.every((id) => selectedAddOnIds.includes(id));

  function setBarista(on: boolean) {
    const others = selectedAddOnIds.filter((id) => !baristaIds.includes(id));
    onSelectAddOns(on ? [...others, ...baristaIds] : others);
  }

  function setAddOns(addOnIds: string[]) {
    const barista = selectedAddOnIds.filter((id) => baristaIds.includes(id));
    onSelectAddOns([...addOnIds, ...barista]);
  }

  return (
    <section aria-label={name} className={styles.root}>
      {showProduct && (
        <div className={styles.productHeader}>
          <Img
            image={product.image}
            className={`${styles.productImage} ${
              isOutOfStock ? styles.grayscale : ""
            }`}
          />
          <h3 className={styles.productName}>{name}</h3>
          {isOutOfStock && <Badge kind="outOfStock" compact />}
        </div>
      )}

      {hasSizes && (
        <RadioGroup
          value={selectedOptionId ?? undefined}
          onChange={onSelectOption}
          orientation="horizontal"
          isDisabled={isDisabled}
          className={styles.group}
        >
          <Label className={styles.groupLabel}>{s.size}</Label>
          <div className={styles.sizes}>
            {sizes.map((option) => (
              <Radio key={option.id} value={option.id} className={styles.size}>
                <span className={styles.sizeName}>{option.name?.[locale]}</span>
                <span className={styles.sizePrice}>
                  {option.discount > 0 && (
                    <span className={styles.oldPrice}>
                      {Math.round(option.price)}
                    </span>
                  )}
                  {formatMoney(option.final)}
                </span>
              </Radio>
            ))}
          </div>
        </RadioGroup>
      )}

      {hasBarista && (
        <ToggleButton
          isSelected={baristaOn}
          onChange={setBarista}
          isDisabled={isDisabled}
          className={styles.barista}
        >
          <Icon name="sparkle" className={styles.baristaIcon} />
          <span className={styles.baristaText}>
            <span className={styles.baristaTitle}>{s.baristaWay}</span>
            <span className={styles.baristaSub}>{s.baristaSub}</span>
          </span>
          <span aria-hidden="true" className={styles.addOnBox}>
            <Icon name="check" className={styles.tick} />
          </span>
        </ToggleButton>
      )}

      {hasAddOns && (
        <CheckboxGroup
          value={selectedAddOnIds}
          onChange={setAddOns}
          isDisabled={isDisabled}
        >
          <Label className={styles.addOnsLabel}>{s.addOns}</Label>
          {product.addOns.map((addOn) => (
            <Checkbox key={addOn.id} value={addOn.id} className={styles.addOn}>
              <span aria-hidden="true" className={styles.addOnBox}>
                <Icon name="check" className={styles.tick} />
              </span>
              <span className={styles.addOnName}>{addOn.name[locale]}</span>
              <span className={styles.addOnPrice}>
                <Price
                  value={addOn.price}
                  formatMoney={formatMoney}
                  plus
                  size="small"
                />
              </span>
            </Checkbox>
          ))}
        </CheckboxGroup>
      )}
    </section>
  );
}
