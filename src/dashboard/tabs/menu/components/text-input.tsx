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
import { ui } from "../ui";

const styles = {
  root: "flex flex-col gap-1.5",
  hint: "text-small text-slate-500",
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
      <Label className={hideLabel ? "sr-only" : ui.label}>{label}</Label>
      {multiline ? (
        <TextArea
          className={ui.textarea}
          dir={dir}
          placeholder={placeholder}
          rows={rows ?? 5}
        />
      ) : (
        <Input className={ui.input} dir={dir} placeholder={placeholder} />
      )}
      {hint ? (
        <Text slot="description" className={styles.hint}>
          {hint}
        </Text>
      ) : null}
      <FieldError className={ui.error}>{messages.join(" ")}</FieldError>
    </TextField>
  );
}
