import {
  FieldError,
  Input,
  Label,
  NumberField,
} from "react-aria-components";
import { ui } from "../ui";

const styles = {
  root: "flex flex-col gap-1.5",
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
      <Label className={hideLabel ? "sr-only" : ui.label}>{label}</Label>
      <Input className={ui.input} inputMode="decimal" />
      <FieldError className={ui.error}>{errors.join(" ")}</FieldError>
    </NumberField>
  );
}
