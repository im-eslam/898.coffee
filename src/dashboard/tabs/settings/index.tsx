import { Button, Label, Radio, RadioGroup } from "react-aria-components";
import { useLocale, useStrings, type Locale } from "@/shared/i18n";
import { TextField } from "../../login/components/field";
import { strings } from "./strings";
import { useSettings } from "./use-settings";

const styles = {
  page: "mx-auto flex w-full flex-col gap-6",
  card: "rounded-2xl border border-slate-200 bg-white p-6",
  title: "text-heading font-semibold text-slate-900",
  note: "mt-1 text-small text-slate-500",
  fields: "mt-5 flex flex-col gap-4",
  label: "text-small font-medium text-slate-700",
  radio:
    "flex cursor-pointer items-center gap-3 rounded-lg border border-slate-300 px-4 py-3 text-body text-slate-900 data-[selected]:border-brand data-[selected]:bg-brand/5 data-[disabled]:opacity-60",
  dot: "size-4 shrink-0 rounded-full border",
  dotOn: "border-[5px] border-brand",
  dotOff: "border-slate-400",
  submit:
    "inline-flex h-11 items-center justify-center self-start rounded-lg bg-brand px-5 text-small font-semibold text-white transition-colors data-[hovered]:bg-navy data-[disabled]:opacity-70",
} as const;

const LOCALES: Locale[] = ["en", "ar"];

export function SettingsPage() {
  const s = useStrings(strings);
  const locale = useLocale();
  const {
    pending,
    busy,
    username,
    setUsername,
    usernamePassword,
    setUsernamePassword,
    passwords,
    changePassword,
    changeLanguage,
    submitUsername,
    submitPassword,
  } = useSettings();

  return (
    <div className={styles.page}>
      <section className={styles.card}>
        <h2 className={styles.title}>{s.language.title}</h2>
        <RadioGroup
          value={locale}
          onChange={(value) => changeLanguage(value as Locale)}
          isDisabled={busy}
          className={styles.fields}
        >
          <Label className={styles.label}>{s.language.label}</Label>
          {LOCALES.map((code) => (
            <Radio key={code} value={code} className={styles.radio}>
              {({ isSelected }) => (
                <>
                  <span
                    className={`${styles.dot} ${
                      isSelected ? styles.dotOn : styles.dotOff
                    }`}
                  />
                  {code === "en" ? s.language.english : s.language.arabic}
                </>
              )}
            </Radio>
          ))}
        </RadioGroup>
      </section>

      <form className={styles.card} onSubmit={submitUsername}>
        <h2 className={styles.title}>{s.username.title}</h2>
        <div className={styles.fields}>
          <TextField
            name="username"
            label={s.username.label}
            value={username}
            onChange={setUsername}
            autoComplete="username"
            isRequired
            isDisabled={busy}
          />
          <TextField
            name="current_password"
            label={s.username.currentPassword}
            type="password"
            value={usernamePassword}
            onChange={setUsernamePassword}
            autoComplete="current-password"
            isRequired
            isDisabled={busy}
          />
          <Button type="submit" isDisabled={busy} className={styles.submit}>
            {pending === "username" ? s.common.saving : s.common.save}
          </Button>
        </div>
      </form>

      <form className={styles.card} onSubmit={submitPassword}>
        <h2 className={styles.title}>{s.password.title}</h2>
        <p className={styles.note}>{s.password.note}</p>
        <div className={styles.fields}>
          <TextField
            name="current_password"
            label={s.password.current}
            type="password"
            value={passwords.current}
            onChange={(v) => changePassword("current", v)}
            autoComplete="current-password"
            isRequired
            isDisabled={busy}
          />
          <TextField
            name="new_password"
            label={s.password.new}
            type="password"
            value={passwords.next}
            onChange={(v) => changePassword("next", v)}
            autoComplete="new-password"
            isRequired
            isDisabled={busy}
          />
          <TextField
            name="confirm_password"
            label={s.password.confirm}
            type="password"
            value={passwords.confirm}
            onChange={(v) => changePassword("confirm", v)}
            autoComplete="new-password"
            isRequired
            isDisabled={busy}
          />
          <Button type="submit" isDisabled={busy} className={styles.submit}>
            {pending === "password" ? s.common.saving : s.common.save}
          </Button>
        </div>
      </form>
    </div>
  );
}
