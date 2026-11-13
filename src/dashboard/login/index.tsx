import { Button } from "react-aria-components";
import mark from "@/assets/mark.svg";
import { useStrings } from "@/shared/i18n";
import type { AdminUser } from "../models";
import { TextField } from "./components/field";
import { strings } from "./strings";
import { useLogin } from "./use-login";

interface LoginScreenProps {
  onSignedIn: (user: AdminUser) => void;
}

const styles = {
  page: "flex min-h-dvh flex-col items-center justify-center bg-slate-50 px-4 pt-[max(2.5rem,env(safe-area-inset-top))] pb-[max(2.5rem,env(safe-area-inset-bottom))]",
  logo: "h-20 w-auto",
  card: "mt-6 w-full max-w-sm rounded-2xl border border-slate-200 bg-white p-6 sm:max-w-md sm:p-8",
  title: "text-center text-title font-bold text-slate-900",
  description: "mt-1 text-center text-small text-slate-500",
  form: "mt-6 flex flex-col gap-5",
  banner:
    "rounded-lg border border-error/20 bg-error/5 px-3 py-2.5 text-small text-error",
  toggle:
    "h-8 rounded-md px-2 text-small font-semibold text-brand transition-colors data-hovered:bg-slate-100 data-pressed:bg-slate-200 disabled:opacity-60",
  submit:
    "inline-flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-brand text-body font-semibold text-white transition-colors data-hovered:bg-navy data-pressed:bg-navy data-disabled:opacity-70",
  spinner:
    "size-4 animate-spin rounded-full border-2 border-white/40 border-t-white",
} as const;

export function LoginScreen({ onSignedIn }: LoginScreenProps) {
  const s = useStrings(strings);
  const form = useLogin(onSignedIn);

  return (
    <main className={styles.page}>
      <img
        src={mark}
        alt=""
        decoding="async"
        draggable={false}
        className={styles.logo}
      />

      <div className={styles.card}>
        <h1 className={styles.title}>{s.title}</h1>
        <p className={styles.description}>{s.description}</p>

        <form onSubmit={form.submit} noValidate className={styles.form}>
          {form.error && (
            <p role="alert" className={styles.banner}>
              {s.errors[form.error]}
            </p>
          )}

          <TextField
            name="username"
            label={s.username}
            value={form.values.username}
            onChange={(value) => form.updateField("username", value)}
            autoComplete="username"
            isRequired
            isDisabled={form.pending}
            validationBehavior="aria"
            isInvalid={form.missing.username}
            errorMessage={s.missingUsername}
          />

          <TextField
            name="password"
            label={s.password}
            value={form.values.password}
            onChange={(value) => form.updateField("password", value)}
            type={form.showPassword ? "text" : "password"}
            autoComplete="current-password"
            isRequired
            isDisabled={form.pending}
            validationBehavior="aria"
            isInvalid={form.missing.password}
            errorMessage={s.missingPassword}
            trailing={
              <Button
                type="button"
                isDisabled={form.pending}
                onPress={form.toggleShowPassword}
                className={styles.toggle}
              >
                {form.showPassword ? s.hide : s.show}
              </Button>
            }
          />

          <Button
            type="submit"
            isPending={form.pending}
            className={styles.submit}
          >
            {({ isPending }) => (
              <>
                {isPending && (
                  <span className={styles.spinner} aria-hidden="true" />
                )}
                {isPending ? s.submitting : s.submit}
              </>
            )}
          </Button>
        </form>
      </div>
    </main>
  );
}
