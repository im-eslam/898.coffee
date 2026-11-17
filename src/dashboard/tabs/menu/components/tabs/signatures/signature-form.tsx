import { useState } from "react";
import { Button } from "react-aria-components";
import { useStrings } from "@/shared/i18n";
import type { ProductOption } from "../../../types/ui";
import { strings } from "../../../strings";
import { ProductCombobox } from "../../ui/product-combobox";
import { primaryButton } from "../../ui/styles";

const focusRing =
  "outline-none data-[focus-visible]:outline-2 data-[focus-visible]:outline-offset-2 data-[focus-visible]:outline-brand";

const styles = {
  root: "flex flex-col gap-6",
  head: "flex flex-col gap-1 pe-12",
  title: "text-heading font-semibold text-slate-900",
  text: "text-small text-slate-500",
  empty:
    "rounded-xl border border-dashed border-slate-300 p-4 text-center text-small text-slate-500",
  actions: "flex flex-col-reverse gap-3 sm:flex-row sm:justify-end",
  cancel: `inline-flex h-11 items-center justify-center rounded-lg border border-slate-300 bg-white px-5 text-small font-semibold text-slate-700 transition-colors data-[hovered]:bg-slate-50 data-[disabled]:opacity-60 ${focusRing}`,
} as const;

interface SignatureFormProps {
  options: ProductOption[];
  onSubmit: (productId: string) => void;
  onCancel: () => void;
}

export function SignatureForm({
  options,
  onSubmit,
  onCancel,
}: SignatureFormProps) {
  const s = useStrings(strings);
  const [productId, setProductId] = useState("");
  const canSubmit = options.some((option) => option.id === productId);

  return (
    <div className={styles.root}>
      <div className={styles.head}>
        <h2 className={styles.title}>{s.signatures.addTitle}</h2>
        <p className={styles.text}>{s.signatures.addText}</p>
      </div>

      {options.length === 0 ? (
        <p className={styles.empty}>{s.signatures.noneLeft}</p>
      ) : (
        <ProductCombobox
          label={s.signatures.pick}
          placeholder={s.signatures.addPlaceholder}
          options={options}
          value={productId}
          onChange={setProductId}
        />
      )}

      <div className={styles.actions}>
        <Button className={styles.cancel} onPress={onCancel}>
          {s.common.cancel}
        </Button>
        <Button
          className={primaryButton}
          isDisabled={!canSubmit}
          onPress={() => {
            if (canSubmit) onSubmit(productId);
          }}
        >
          {s.signatures.addConfirm}
        </Button>
      </div>
    </div>
  );
}
