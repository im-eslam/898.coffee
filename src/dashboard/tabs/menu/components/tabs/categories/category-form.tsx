import { useState } from "react";
import { Button } from "react-aria-components";
import { useStrings, type Localized } from "@/shared/i18n";
import { strings } from "../../../strings";
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

interface CategoryFormProps {
  onSubmit: (name: Localized<string>) => void;
  onCancel: () => void;
}

export function CategoryForm({ onSubmit, onCancel }: CategoryFormProps) {
  const s = useStrings(strings);
  const [en, setEn] = useState("");
  const [ar, setAr] = useState("");
  const [attempted, setAttempted] = useState(false);

  const enErrors = attempted && en.trim() === "" ? [s.common.required] : [];
  const arErors = attempted && ar.trim() === "" ? [s.common.required] : [];

  const submit = () => {
    setAttempted(true);
    const name = { en: en.trim(), ar: ar.trim() };
    if (name.en !== "" && name.ar !== "") onSubmit(name);
  };

  return (
    <div className={styles.root}>
      <div className={styles.head}>
        <h2 className={styles.title}>{s.categories.addTitle}</h2>
        <p className={styles.text}>{s.categories.addText}</p>
      </div>

      <div className={styles.fields}>
        <TextInput
          required
          label={s.categories.nameEn}
          value={en}
          onChange={setEn}
          errors={enErrors}
        />
        <TextInput
          required
          rtl
          label={s.categories.nameAr}
          value={ar}
          onChange={setAr}
          errors={arErors}
        />
      </div>

      <div className={styles.actions}>
        <Button className={styles.cancel} onPress={onCancel}>
          {s.common.cancel}
        </Button>
        <Button className={primaryButton} onPress={submit}>
          {s.categories.addConfirm}
        </Button>
      </div>
    </div>
  );
}
