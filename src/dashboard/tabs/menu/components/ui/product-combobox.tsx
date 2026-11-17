import { useState } from "react";
import {
  ComboBox,
  FieldError,
  Input,
  Label,
  ListBox,
  ListBoxItem,
  Popover,
} from "react-aria-components";
import { useStrings } from "@/shared/i18n";
import { strings } from "../../strings";
import type { ProductOption } from "../../types/ui";

const focusRing =
  "outline-none data-[focus-visible]:outline-2 data-[focus-visible]:outline-offset-2 data-[focus-visible]:outline-brand";
const styles = {
  root: "flex min-w-0 flex-col gap-1.5",
  label: "text-small font-medium text-slate-700",
  error: "text-small text-error",
  input: `h-11 w-full rounded-lg border border-slate-300 bg-white px-3 text-body text-slate-900 outline-none placeholder:text-slate-400 data-[focused]:border-brand data-[focused]:ring-2 data-[focused]:ring-brand/20 data-[invalid]:border-error ${focusRing}`,
  popover:
    "max-h-72 w-(--trigger-width) overflow-auto rounded-lg border border-slate-200 bg-white p-1 shadow-lg",
  option:
    "flex cursor-pointer items-center rounded-md px-3 py-2 text-body text-slate-900 outline-none data-[focused]:bg-brand/10 data-[selected]:font-semibold data-[disabled]:opacity-50",
  empty: "px-3 py-2 text-small text-slate-500",
} as const;

export interface ProductComboboxProps {
  label: string;
  options: ProductOption[];
  value: string;
  onChange: (id: string) => void;
  placeholder?: string;
  hideLabel?: boolean;
  errors?: string[];
}

export function ProductCombobox({
  label,
  options,
  value,
  onChange,
  placeholder,
  hideLabel,
  errors = [],
}: ProductComboboxProps) {
  const s = useStrings(strings);
  const [query, setQuery] = useState<string | null>(null);
  const selected = options.find((option) => option.id === value);
  const needle = (query ?? "").trim().toLowerCase();
  const items =
    needle === ""
      ? options
      : options.filter((option) =>
          `${option.label} ${option.search}`.toLowerCase().includes(needle)
        );

  return (
    <ComboBox
      className={styles.root}
      items={items}
      selectedKey={selected ? selected.id : null}
      inputValue={query ?? selected?.label ?? ""}
      onInputChange={setQuery}
      onOpenChange={(open) => {
        if (open) setQuery(null);
      }}
      menuTrigger="focus"
      isInvalid={errors.length > 0}
      validationBehavior="aria"
      onSelectionChange={(key) => {
        if (key === null) return;
        onChange(String(key));
        setQuery(null);
      }}
    >
      <Label className={hideLabel ? "sr-only" : styles.label}>{label}</Label>
      <Input className={styles.input} placeholder={placeholder} />
      <Popover className={styles.popover}>
        <ListBox
          className="outline-none"
          renderEmptyState={() => (
            <p className={styles.empty}>{s.products.noMatches}</p>
          )}
        >
          {(option: ProductOption) => (
            <ListBoxItem
              id={option.id}
              textValue={option.label}
              className={styles.option}
            >
              {option.label}
            </ListBoxItem>
          )}
        </ListBox>
      </Popover>
      <FieldError className={styles.error}>{errors.join(" ")}</FieldError>
    </ComboBox>
  );
}
