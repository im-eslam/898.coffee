import type { ReactNode } from "react";
import {
  TextField as AriaTextField,
  Input,
  Label,
  FieldError,
  type TextFieldProps as AriaTextFieldProps,
  type ValidationResult,
} from "react-aria-components";

interface TextFieldProps extends AriaTextFieldProps {
  label: string;
  errorMessage?: string | ((validation: ValidationResult) => string);
  trailing?: ReactNode;
}

const styles = {
  wrap: "flex flex-col gap-1.5",
  label: "text-small font-medium text-slate-700",
  inputContainer: "relative",
  input:
    "h-12 w-full rounded-lg border border-slate-300 bg-white px-3 text-body text-slate-900 outline-none transition-colors placeholder:text-slate-400 focus:border-brand focus:ring-4 focus:ring-brand/15 disabled:bg-slate-50 disabled:text-slate-500 data-invalid:border-error data-invalid:focus:ring-error/15",
  inputWithTrailing: "pe-16",
  trailing: "absolute inset-y-0 end-2 flex items-center",
  error: "text-small text-error",
} as const;

export function TextField({
  label,
  errorMessage,
  trailing,
  ...props
}: TextFieldProps) {
  const inputClass = [styles.input, trailing ? styles.inputWithTrailing : ""]
    .filter(Boolean)
    .join(" ");

  return (
    <AriaTextField {...props} className={styles.wrap}>
      <Label className={styles.label}>{label}</Label>
      <div className={styles.inputContainer}>
        <Input className={inputClass} />
        {trailing && <div className={styles.trailing}>{trailing}</div>}
      </div>
      <FieldError className={styles.error}>{errorMessage}</FieldError>
    </AriaTextField>
  );
}
