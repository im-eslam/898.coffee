import { useState } from "react";
import {
  ComboBox,
  FieldError,
  Input,
  Label,
  ListBox,
  ListBoxItem,
  Popover,
  Text,
} from "react-aria-components";
import { useStrings } from "@/shared/i18n";
import { strings } from "../strings";

const styles = {
  root: "flex flex-col gap-1.5",
  label: "text-small font-medium text-slate-700",
  error: "text-small text-error",
  hint: "text-small text-slate-500",
  input:
    "h-11 w-full rounded-lg border border-slate-300 bg-white px-3 text-body text-slate-900 outline-none placeholder:text-slate-400 data-[focused]:border-brand data-[focused]:ring-2 data-[focused]:ring-brand/20 data-[invalid]:border-error data-[disabled]:bg-slate-50 data-[disabled]:text-slate-500",
  popover:
    "max-h-72 w-(--trigger-width) overflow-auto rounded-lg border border-slate-200 bg-white p-1 shadow-lg",
  option:
    "flex cursor-pointer items-center rounded-md px-3 py-2 text-body text-slate-900 outline-none data-[focused]:bg-brand/10 data-[disabled]:opacity-50",
} as const;

interface ImagePickerProps {
  label: string;
  value: string | null;
  options: string[];
  onCommit: (value: string | null) => void;
  placeholder?: string;
  hint?: string;
  errors?: string[];
}

export function ImagePicker({ value, ...rest }: ImagePickerProps) {
  return <ImageCombo key={value ?? ""} value={value} {...rest} />;
}

function ImageCombo({
  label,
  value,
  options,
  onCommit,
  placeholder,
  hint,
  errors = [],
}: ImagePickerProps) {
  const s = useStrings(strings);
  const [text, setText] = useState(value ?? "");
  const needle = text.trim().toLowerCase();
  const filtered = options
    .filter((option) => option.toLowerCase().includes(needle))
    .map((option) => ({ id: option }));

  function commit(next: string) {
    const trimmed = next.trim();
    const result = trimmed === "" ? null : trimmed;
    if (result !== value) onCommit(result);
  }

  return (
    <ComboBox
      className={styles.root}
      allowsCustomValue
      items={filtered}
      inputValue={text}
      onInputChange={setText}
      selectedKey={null}
      menuTrigger="focus"
      isInvalid={errors.length > 0}
      validationBehavior="aria"
      onSelectionChange={(key) => {
        if (typeof key === "string") {
          setText(key);
          commit(key);
        }
      }}
      onBlur={() => commit(text)}
    >
      <Label className={styles.label}>{label}</Label>
      <Input
        className={styles.input}
        placeholder={placeholder ?? s.editor.imagePlaceholder}
        dir="ltr"
      />
      {hint ? (
        <Text slot="description" className={styles.hint}>
          {hint}
        </Text>
      ) : null}
      <FieldError className={styles.error}>{errors.join(" ")}</FieldError>
      <Popover className={styles.popover}>
        <ListBox className="outline-none" renderEmptyState={() => null}>
          {(item: { id: string }) => (
            <ListBoxItem id={item.id} textValue={item.id} className={styles.option}>
              {item.id}
            </ListBoxItem>
          )}
        </ListBox>
      </Popover>
    </ComboBox>
  );
}
