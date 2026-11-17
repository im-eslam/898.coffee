import { useMemo, useState } from "react";
import { Button } from "react-aria-components";
import { useStrings } from "@/shared/i18n";
import type { DraftPairing, NewPairingInput } from "../../../types/draft";
import type { ProductOption } from "../../../types/ui";
import {
  finalPrice,
  pairingProblems,
  type PairingProblem,
} from "../../../util/draft";
import { strings } from "../../../strings";
import { NumberInput } from "../../ui/number-input";
import { ProductCombobox } from "../../ui/product-combobox";

const focusRing =
  "outline-none data-[focus-visible]:outline-2 data-[focus-visible]:outline-offset-2 data-[focus-visible]:outline-brand";
const styles = {
  root: "flex flex-col gap-6",
  head: "flex flex-col gap-1 pe-12",
  title: "text-heading font-semibold text-slate-900",
  text: "text-small text-slate-500",
  products: "grid gap-4 sm:grid-cols-2",
  pricing: "grid items-end gap-4 sm:grid-cols-3",
  finalWrap: "flex flex-col gap-1.5",
  finalLabel: "text-small font-medium text-slate-700",
  finalValue:
    "flex h-11 items-center rounded-lg bg-slate-50 px-3 text-body font-semibold text-slate-900",
  errors: "flex flex-col gap-1 text-small text-error",
  actions: "flex flex-col-reverse gap-3 sm:flex-row sm:justify-end",
  cancel: `inline-flex h-11 items-center justify-center rounded-lg border border-slate-300 bg-white px-5 text-small font-semibold text-slate-700 transition-colors data-[hovered]:bg-slate-50 data-[disabled]:opacity-60 ${focusRing}`,
  submit: `inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-brand px-5 text-small font-semibold text-white transition-colors data-[hovered]:bg-navy data-[disabled]:cursor-not-allowed data-[disabled]:opacity-60 ${focusRing}`,
} as const;

interface PairingFormProps {
  products: ProductOption[];
  existing: readonly DraftPairing[];
  currency: string;
  onSubmit: (input: NewPairingInput) => void;
  onCancel: () => void;
}

export function PairingForm({
  products,
  existing,
  currency,
  onSubmit,
  onCancel,
}: PairingFormProps) {
  const s = useStrings(strings);
  const [first, setFirst] = useState("");
  const [second, setSecond] = useState("");
  const [price, setPrice] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [priceTouched, setPriceTouched] = useState(false);

  const knownIds = useMemo(
    () => new Set(products.map((product) => product.id)),
    [products]
  );

  const defaultPrice = (firstId: string, secondId: string) =>
    products.reduce(
      (total, product) =>
        product.id === firstId || product.id === secondId
          ? total + product.price
          : total,
      0
    );

  const selectFirst = (id: string) => {
    setFirst(id);
    if (!priceTouched) setPrice(defaultPrice(id, second));
  };

  const selectSecond = (id: string) => {
    setSecond(id);
    if (!priceTouched) setPrice(defaultPrice(first, id));
  };

  const commitPrice = (value: number) => {
    setPriceTouched(true);
    setPrice(value);
  };

  const input: NewPairingInput = { items: [first, second], price, discount };
  const ready = first !== "" && second !== "";
  const problems = ready ? pairingProblems(input, knownIds, existing) : [];
  const canSubmit = ready && problems.length === 0;

  const text: Record<PairingProblem, string> = {
    unknownProduct: s.pairings.unknownProduct,
    sameProduct: s.pairings.sameProduct,
    duplicatePair: s.pairings.duplicatePair,
    invalidPrice: s.pairings.invalidPrice,
    discountTooHigh: s.pairings.discountTooHigh,
  };

  const priceErrors = problems.includes("invalidPrice")
    ? [text.invalidPrice]
    : [];
  const discountErrors = problems.includes("discountTooHigh")
    ? [text.discountTooHigh]
    : [];
  const generalErrors = problems
    .filter(
      (problem) => problem !== "invalidPrice" && problem !== "discountTooHigh"
    )
    .map((problem) => text[problem]);

  return (
    <div className={styles.root}>
      <div className={styles.head}>
        <h2 className={styles.title}>{s.pairings.addTitle}</h2>
        <p className={styles.text}>{s.pairings.addText}</p>
      </div>

      <div className={styles.products}>
        <ProductCombobox
          label={s.pairings.productA}
          placeholder={s.pairings.pickPlaceholder}
          options={products.filter((product) => product.id !== second)}
          value={first}
          onChange={selectFirst}
        />
        <ProductCombobox
          label={s.pairings.productB}
          placeholder={s.pairings.pickPlaceholder}
          options={products.filter((product) => product.id !== first)}
          value={second}
          onChange={selectSecond}
        />
      </div>

      <div className={styles.pricing}>
        <NumberInput
          label={s.pairings.price}
          value={price}
          errors={priceErrors}
          onCommit={commitPrice}
        />
        <NumberInput
          label={s.pairings.discount}
          value={discount}
          errors={discountErrors}
          onCommit={setDiscount}
        />
        <div className={styles.finalWrap}>
          <span className={styles.finalLabel}>{s.common.final}</span>
          <p className={styles.finalValue}>
            {`${finalPrice(price, discount)} ${currency}`}
          </p>
        </div>
      </div>

      {generalErrors.length > 0 && (
        <div role="alert" className={styles.errors}>
          {generalErrors.map((message) => (
            <p key={message}>{message}</p>
          ))}
        </div>
      )}

      <div className={styles.actions}>
        <Button className={styles.cancel} onPress={onCancel}>
          {s.common.cancel}
        </Button>
        <Button
          className={styles.submit}
          isDisabled={!canSubmit}
          onPress={() => {
            if (canSubmit) onSubmit(input);
          }}
        >
          {s.pairings.add}
        </Button>
      </div>
    </div>
  );
}
