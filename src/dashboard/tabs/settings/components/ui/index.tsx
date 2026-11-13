import { Button } from "react-aria-components";

// eslint-disable-next-line react-refresh/only-export-components
export const styles = {
  card: "rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8",
  title: "text-heading font-semibold text-slate-900",
  description: "mt-1 text-small text-slate-500",
  form: "mt-6 flex flex-col gap-5",
  error:
    "rounded-lg border border-error/20 bg-error/5 px-3 py-2.5 text-small text-error",
  success:
    "rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2.5 text-small text-emerald-700",
  submit:
    "inline-flex h-11 items-center justify-center gap-2 self-start rounded-lg bg-brand px-5 text-small font-semibold text-white transition-colors data-hovered:bg-navy data-pressed:bg-navy data-disabled:opacity-70",
  spinner:
    "size-4 animate-spin rounded-full border-2 border-white/40 border-t-white",
  toggle:
    "h-11 rounded-md px-3 text-small font-semibold text-brand transition-colors data-hovered:bg-slate-100 data-pressed:bg-slate-200 disabled:opacity-60",
} as const;

export interface SubmitButtonStrings {
  saving: string;
}

interface SubmitButtonProps {
  pending: boolean;
  label: string;
  strings: SubmitButtonStrings;
}

export function SubmitButton({ pending, label, strings }: SubmitButtonProps) {
  return (
    <Button type="submit" isPending={pending} className={styles.submit}>
      {({ isPending }) => (
        <>
          {isPending && <span className={styles.spinner} aria-hidden="true" />}
          {isPending ? strings.saving : label}
        </>
      )}
    </Button>
  );
}

export interface RevealToggleStrings {
  show: string;
  hide: string;
}

interface RevealToggleProps {
  revealed: boolean;
  disabled: boolean;
  onPress: () => void;
  strings: RevealToggleStrings;
}

export function RevealToggle({
  revealed,
  disabled,
  onPress,
  strings,
}: RevealToggleProps) {
  return (
    <Button
      type="button"
      isDisabled={disabled}
      onPress={onPress}
      className={styles.toggle}
    >
      {revealed ? strings.hide : strings.show}
    </Button>
  );
}

export function ErrorBanner({ message }: { message: string }) {
  return (
    <p role="alert" className={styles.error}>
      {message}
    </p>
  );
}

export function SuccessBanner({ message }: { message: string }) {
  return (
    <p role="status" className={styles.success}>
      {message}
    </p>
  );
}
