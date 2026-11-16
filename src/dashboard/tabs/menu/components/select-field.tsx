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

const focusRing =
  "outline-none data-[focus-visible]:outline-2 data-[focus-visible]:outline-offset-2 data-[focus-visible]:outline-brand";

const styles = {
  root: "flex min-w-0 flex-col gap-1.5",
  label: "text-small font-medium text-slate-700",
  error: "text-small text-error",
  trigger: `h-11 w-full rounded-lg border border-slate-300 bg-white px-3 text-body text-slate-900 outline-none data-[focused]:border-brand data-[focused]:ring-2 data-[focused]:ring-brand/20 data-[invalid]:border-error data-[disabled]:bg-slate-50 data-[disabled]:text-slate-500 flex items-center justify-between gap-2 text-start data-[focus-visible]:border-brand data-[focus-visible]:ring-2 data-[focus-visible]:ring-brand/20 ${focusRing}`,
  value: "truncate data-[placeholder]:text-slate-400",
  chevron: "size-4 shrink-0 text-slate-500",
  popover:
    "max-h-72 w-(--trigger-width) overflow-auto rounded-lg border border-slate-200 bg-white p-1 shadow-lg",
  option:
    "flex cursor-pointer items-center rounded-md px-3 py-2 text-body text-slate-900 outline-none data-[focused]:bg-brand/10 data-[disabled]:opacity-50",
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
      <Label className={hideLabel ? "sr-only" : styles.label}>{label}</Label>
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
      <FieldError className={styles.error}>{errors.join(" ")}</FieldError>
      <Popover className={styles.popover}>
        <ListBox className="outline-none" items={options}>
          {(option) => (
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
    </Select>
  );
}
