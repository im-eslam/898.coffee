import { FieldError, Input, Label, NumberField } from "react-aria-components";

const focusRing =
  "outline-none data-[focus-visible]:outline-2 data-[focus-visible]:outline-offset-2 data-[focus-visible]:outline-brand";
const styles = {
  root: "flex flex-col gap-1.5",
  label: "text-small font-medium text-slate-700",
  error: "text-small text-error",
  input: `h-11 w-full rounded-lg border border-slate-300 bg-white px-3 text-body text-slate-900 outline-none placeholder:text-slate-400 data-[focused]:border-brand data-[focused]:ring-2 data-[focused]:ring-brand/20 data-[invalid]:border-error data-[disabled]:bg-slate-50 data-[disabled]:text-slate-500 ${focusRing}`,
} as const;

interface NumberInputProps {
  label: string;
  value: number;
  onCommit: (value: number) => void;
  min?: number;
  errors?: string[];
  hideLabel?: boolean;
}

export function NumberInput({
  label,
  value,
  onCommit,
  min = 0,
  errors = [],
  hideLabel,
}: NumberInputProps) {
  return (
    <NumberField
      className={styles.root}
      value={value}
      minValue={min}
      isWheelDisabled
      isInvalid={errors.length > 0}
      validationBehavior="aria"
      formatOptions={{ useGrouping: false, maximumFractionDigits: 2 }}
      onChange={(next) => {
        if (!Number.isNaN(next) && next !== value) onCommit(next);
      }}
    >
      <Label className={hideLabel ? "sr-only" : styles.label}>{label}</Label>
      <Input className={styles.input} inputMode="decimal" />
      <FieldError className={styles.error}>{errors.join(" ")}</FieldError>
    </NumberField>
  );
}
