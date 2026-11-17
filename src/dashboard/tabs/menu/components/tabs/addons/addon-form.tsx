import { useState } from "react";
import { Button } from "react-aria-components";
import { useStrings, type Localized } from "@/shared/i18n";
import { strings } from "../../../strings";
import { NumberInput } from "../../ui/number-input";
import { TextInput } from "../../ui/text-input";
import { primaryButton } from "../../ui/styles";

const focusRing =
  "outline-none data-[focus-visible]:outline-2 data-[focus-visible]:outline-offset-2 data-[focus-visible]:outline-brand";

const styles = {
  root: "flex flex-col gap-6",
  head: "flex flex-col gap-1 pe-12",
  title: "text-heading font-semibold text-slate-900",
  text: "text-small text-slate-500",
  fields: "flex flex-col gap-4",
  actions: "flex flex-col-reverse gap-3 sm:flex-row sm:justify-end",
  cancel: `inline-flex h-11 items-center justify-center rounded-lg border border-slate-300 bg-white px-5 text-small font-semibold text-slate-700 transition-colors data-[hovered]:bg-slate-50 ${focusRing}`,
} as const;

interface AddOnFormProps {
  onSubmit: (input: { name: Localized<string>; price: number }) => void;
  onCancel: () => void;
}

export function AddOnForm({ onSubmit, onCancel }: AddOnFormProps) {
  const s = useStrings(strings);
  const [en, setEn] = useState("");
  const [ar, setAr] = useState("");
  const [price, setPrice] = useState(0);
  // Blank-field errors appear only after the first submit attempt.
  const [attempted, setAttempted] = useState(false);

  const enErrors = attempted && en.trim() === "" ? [s.common.required] : [];
  const arErrors = attempted && ar.trim() === "" ? [s.common.required] : [];

  const submit = () => {
    setAttempted(true);
    const name = { en: en.trim(), ar: ar.trim() };
    if (name.en !== "" && name.ar !== "") onSubmit({ name, price });
  };

  return (
    <div className={styles.root}>
      <div className={styles.head}>
        <h2 className={styles.title}>{s.addons.addTitle}</h2>
        <p className={styles.text}>{s.addons.addText}</p>
      </div>

      <div className={styles.fields}>
        <TextInput
          required
          label={s.addons.nameEn}
          value={en}
          onChange={setEn}
          errors={enErrors}
        />
        <TextInput
          required
          rtl
          label={s.addons.nameAr}
          value={ar}
          onChange={setAr}
          errors={arErrors}
        />
        <NumberInput label={s.addons.price} value={price} onCommit={setPrice} />
      </div>

      <div className={styles.actions}>
        <Button className={styles.cancel} onPress={onCancel}>
          {s.common.cancel}
        </Button>
        <Button className={primaryButton} onPress={submit}>
          {s.addons.addConfirm}
        </Button>
      </div>
    </div>
  );
}
