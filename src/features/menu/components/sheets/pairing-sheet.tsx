import { useState } from "react";
import { useLocale, useStrings } from "@/shared/i18n";
import { getSelectedOption, strings, sumAddOns, useMoney } from "../../strings";
import type { Pairing } from "../../types/menu-models";
import { ProductOptions } from "../product-options";
import { Badge, Chip, cx, Img, PriceBar, PrimaryButton } from "../ui";
import { BottomSheet } from "./bottom-sheet";

interface Props {
  pairing: Pairing;
  isOpen: boolean;
  onClose: () => void;
}

const styles = {
  content: "flex flex-col gap-6",
  pictures: "flex gap-2 px-4",
  picture: "aspect-square flex-1 rounded-lg",
  grayscale: "grayscale",
  intro: "flex flex-col items-start gap-2 px-4",
  title: "text-title font-bold text-balance",
} as const;

export function PairingSheet({ pairing, isOpen, onClose }: Props) {
  const t = useStrings(strings);
  const locale = useLocale();
  const money = useMoney();

  // One selected size and one set of add-ons per product in the pairing.
  const [selectedOptionIds, setSelectedOptionIds] = useState<(string | null)[]>(
    pairing.items.map((product) => product.pricing.options[0]?.id ?? null)
  );
  const [selectedAddOnIds, setSelectedAddOnIds] = useState<string[][]>(
    pairing.items.map(() => [])
  );

  const title = pairing.items.map((product) => product.name[locale]).join(" + ");
  const available = pairing.items.every(
    (product) => product.availability === "in_stock"
  );

  // The pairing price is the combined deal; sizes and add-ons are charged on top.
  const upgradeTotal = pairing.items.reduce((sum, product, i) => {
    const selected = getSelectedOption(product.pricing, selectedOptionIds[i]);
    const base = product.pricing.options[0]?.final ?? 0;
    return sum + ((selected?.final ?? 0) - base);
  }, 0);
  const addOnsTotal = pairing.items.reduce(
    (sum, product, i) => sum + sumAddOns(product, selectedAddOnIds[i] ?? []),
    0
  );
  const total = pairing.pricing.final + upgradeTotal + addOnsTotal;

  function selectOption(index: number, optionId: string) {
    setSelectedOptionIds((current) =>
      current.map((id, i) => (i === index ? optionId : id))
    );
  }

  function selectAddOns(index: number, addOnIds: string[]) {
    setSelectedAddOnIds((current) =>
      current.map((ids, i) => (i === index ? addOnIds : ids))
    );
  }

  // View-only: the footer just shows the price.
  const footer = available ? (
    <PriceBar total={total} />
  ) : (
    <PrimaryButton isDisabled>{t.outOfStock}</PrimaryButton>
  );

  return (
    <BottomSheet isOpen={isOpen} label={title} onClose={onClose} footer={footer}>
      <div className={styles.content}>
        <div className={styles.pictures}>
          {pairing.items.map((product) => (
            <Img
              key={product.id}
              image={product.image}
              alt={product.name[locale]}
              className={cx(
                styles.picture,
                product.availability === "out_of_stock" && styles.grayscale
              )}
            />
          ))}
        </div>

        <div className={styles.intro}>
          {!available && <Badge kind="outOfStock" />}
          {available && pairing.pricing.discount > 0 && (
            <Chip kind="savings">{t.saveChip(money(pairing.pricing.discount))}</Chip>
          )}
          <h2 data-sheet-title className={styles.title}>
            {title}
          </h2>
        </div>

        {pairing.items.map((product, index) => (
          <ProductOptions
            key={product.id}
            product={product}
            selectedOptionId={selectedOptionIds[index] ?? null}
            selectedAddOnIds={selectedAddOnIds[index] ?? []}
            onSelectOption={(optionId) => selectOption(index, optionId)}
            onSelectAddOns={(addOnIds) => selectAddOns(index, addOnIds)}
            showProduct
            isDisabled={!available}
          />
        ))}
      </div>
    </BottomSheet>
  );
}
