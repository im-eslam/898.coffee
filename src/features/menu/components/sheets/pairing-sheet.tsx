import { useState } from "react";
import type { Locale } from "@/shared/i18n";
import type { Pairing } from "../../types/menu-models";
import { getPairingTotal, isPairingAvailable } from "../../util/pricing";
import { BaseOptions } from "./Base-options";
import { Badge } from "../ui/badge";
import { Img } from "../ui/img";
import { MenuButton } from "../ui/menu-button";
import { Price } from "../ui/price";
import { BottomSheet } from "./bottom-sheet";

interface PairingSheetStrings {
  itemDescription: string;
  outOfStock: string;
  saveChip: (amount: string) => string;
  size: string;
  baristaWay: string;
  baristaSub: string;
  addOns: string;
}

interface PairingSheetProps {
  pairing: Pairing;
  strings: PairingSheetStrings;
  locale: Locale;
  formatMoney: (value: number, plus?: boolean) => string;
  isOpen: boolean;
  onClose: () => void;
}

const styles = {
  content: "flex flex-col gap-6",
  pictures: "flex gap-2",
  picture: "aspect-square flex-1 rounded-lg",
  grayscale: "grayscale",
  intro: "flex flex-col items-start gap-2",
} as const;

export function PairingSheet({
  pairing,
  strings: s,
  locale,
  formatMoney,
  isOpen,
  onClose,
}: PairingSheetProps) {
  const [selectedOptionIds, setSelectedOptionIds] = useState<(string | null)[]>(
    pairing.items.map((product) => product.pricing.options[0]?.id ?? null)
  );
  const [selectedAddOnIds, setSelectedAddOnIds] = useState<string[][]>(
    pairing.items.map(() => [])
  );

  const title = pairing.items
    .map((product) => product.name[locale])
    .join(" + ");
  const available = isPairingAvailable(pairing);
  const hasSavings = pairing.pricing.discount > 0;
  const total = getPairingTotal(pairing, selectedOptionIds, selectedAddOnIds);

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

  const footer = available ? (
    <Price variant="bar" value={total} formatMoney={formatMoney} />
  ) : (
    <MenuButton variant="primary" isDisabled>
      {s.outOfStock}
    </MenuButton>
  );

  return (
    <BottomSheet
      isOpen={isOpen}
      onClose={onClose}
      footer={footer}
      strings={{
        title,
        description: s.itemDescription,
      }}
    >
      <div className={styles.content}>
        <div className={styles.pictures}>
          {pairing.items.map((product) => (
            <Img
              key={product.id}
              image={product.image}
              alt={product.name[locale]}
              className={`${styles.picture} ${
                product.availability === "out_of_stock" ? styles.grayscale : ""
              }`}
            />
          ))}
        </div>

        {(!available || hasSavings) && (
          <div className={styles.intro}>
            {!available && <Badge kind="outOfStock" />}
            {available && hasSavings && (
              <Badge kind="savings">
                {s.saveChip(formatMoney(pairing.pricing.discount))}
              </Badge>
            )}
          </div>
        )}

        {pairing.items.map((product, index) => (
          <BaseOptions
            key={product.id}
            product={product}
            strings={s}
            locale={locale}
            formatMoney={formatMoney}
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
