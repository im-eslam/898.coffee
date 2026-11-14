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
import { ui } from "../ui";

const styles = {
  root: "flex flex-col gap-1.5",
  hint: "text-small text-slate-500",
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
      <Label className={ui.label}>{label}</Label>
      <Input
        className={ui.input}
        placeholder={placeholder ?? s.editor.imagePlaceholder}
        dir="ltr"
      />
      {hint ? (
        <Text slot="description" className={styles.hint}>
          {hint}
        </Text>
      ) : null}
      <FieldError className={ui.error}>{errors.join(" ")}</FieldError>
      <Popover className={ui.popover}>
        <ListBox className="outline-none" renderEmptyState={() => null}>
          {(item: { id: string }) => (
            <ListBoxItem id={item.id} textValue={item.id} className={ui.option}>
              {item.id}
            </ListBoxItem>
          )}
        </ListBox>
      </Popover>
    </ComboBox>
  );
}
