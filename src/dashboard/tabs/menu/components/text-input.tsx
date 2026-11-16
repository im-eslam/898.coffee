import { useState } from "react";
import {
  FieldError,
  Input,
  Label,
  Text,
  TextArea,
  TextField,
} from "react-aria-components";
import { useStrings } from "@/shared/i18n";
import { strings } from "../strings";

const focusRing =
  "outline-none data-[focus-visible]:outline-2 data-[focus-visible]:outline-offset-2 data-[focus-visible]:outline-brand";

const styles = {
  root: "flex flex-col gap-1.5",
  label: "text-small font-medium text-slate-700",
  hint: "text-small text-slate-500",
  error: "text-small text-error",
  input: `h-11 w-full rounded-lg border border-slate-300 bg-white px-3 text-body text-slate-900 outline-none placeholder:text-slate-400 data-[focused]:border-brand data-[focused]:ring-2 data-[focused]:ring-brand/20 data-[invalid]:border-error data-[disabled]:bg-slate-50 data-[disabled]:text-slate-500 ${focusRing}`,
  textarea: `min-h-28 w-full resize-y rounded-lg border border-slate-300 bg-white px-3 py-2 text-body text-slate-900 outline-none placeholder:text-slate-400 data-[focused]:border-brand data-[focused]:ring-2 data-[focused]:ring-brand/20 data-[invalid]:border-error ${focusRing}`,
} as const;

interface TextInputProps {
  label: string;
  value: string;
  onCommit: (value: string) => void;
  required?: boolean;
  multiline?: boolean;
  rtl?: boolean;
  placeholder?: string;
  hint?: string;
  errors?: string[];
  rows?: number;
  hideLabel?: boolean;
}

export function TextInput({
  label,
  value,
  onCommit,
  required,
  multiline,
  rtl,
  placeholder,
  hint,
  errors = [],
  rows,
  hideLabel,
}: TextInputProps) {
  const s = useStrings(strings);
  const [touched, setTouched] = useState(false);
  const missing = required && touched && value.trim() === "";
  const messages = missing ? [s.common.required, ...errors] : errors;
  const dir = rtl ? "rtl" : undefined;

  return (
    <TextField
      key={value}
      className={styles.root}
      defaultValue={value}
      isInvalid={messages.length > 0}
      isRequired={required}
      validationBehavior="aria"
      onBlur={(event) => {
        setTouched(true);
        const next = (event.target as HTMLInputElement).value;
        if (next !== value) onCommit(next);
      }}
    >
      <Label className={hideLabel ? "sr-only" : styles.label}>{label}</Label>
      {multiline ? (
        <TextArea
          className={styles.textarea}
          dir={dir}
          placeholder={placeholder}
          rows={rows ?? 5}
        />
      ) : (
        <Input className={styles.input} dir={dir} placeholder={placeholder} />
      )}
      {hint ? (
        <Text slot="description" className={styles.hint}>
          {hint}
        </Text>
      ) : null}
      <FieldError className={styles.error}>{messages.join(" ")}</FieldError>
    </TextField>
  );
}
