import {
  Button,
  FieldError,
  Label,
  ListBox,
  ListBoxItem,
  Popover,
  Select,
  SelectValue,
} from "react-aria-components";
import { ui } from "../ui";

const styles = {
  root: "flex min-w-0 flex-col gap-1.5",
  trigger: `${ui.input} flex items-center justify-between gap-2 text-start data-[focus-visible]:border-brand data-[focus-visible]:ring-2 data-[focus-visible]:ring-brand/20`,
  value: "truncate data-[placeholder]:text-slate-400",
  chevron: "size-4 shrink-0 text-slate-500",
} as const;

export interface SelectOption {
  id: string;
  label: string;
}

interface SelectFieldProps {
  label: string;
  options: SelectOption[];
  value: string | null;
  onChange: (id: string) => void;
  placeholder?: string;
  hideLabel?: boolean;
  errors?: string[];
}

export function SelectField({
  label,
  options,
  value,
  onChange,
  placeholder,
  hideLabel,
  errors = [],
}: SelectFieldProps) {
  return (
    <Select
      className={styles.root}
      selectedKey={value}
      placeholder={placeholder}
      isInvalid={errors.length > 0}
      validationBehavior="aria"
      onSelectionChange={(key) => {
        if (key !== null) onChange(String(key));
      }}
    >
      <Label className={hideLabel ? "sr-only" : ui.label}>{label}</Label>
      <Button className={styles.trigger}>
        <SelectValue className={styles.value} />
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
          className={styles.chevron}
        >
          <path d="M6 9l6 6 6-6" />
        </svg>
      </Button>
      <FieldError className={ui.error}>{errors.join(" ")}</FieldError>
      <Popover className={ui.popover}>
        <ListBox className="outline-none" items={options}>
          {(option) => (
            <ListBoxItem
              id={option.id}
              textValue={option.label}
              className={ui.option}
            >
              {option.label}
            </ListBoxItem>
          )}
        </ListBox>
      </Popover>
    </Select>
  );
}
