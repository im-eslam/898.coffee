import type { FormEvent } from "react";
import { Label, Radio, RadioGroup } from "react-aria-components";
import type { Locale } from "@/shared/i18n";
import { ErrorBanner, styles, SubmitButton, SuccessBanner } from "./ui";

export interface LanguageSectionStrings {
  title: string;
  description: string;
  label: string;
  english: string;
  arabic: string;
  save: string;
  saved: string;
  saving: string;
}

interface LanguageSectionProps {
  language: Locale;
  errorMessage?: string;
  success: boolean;
  pending: boolean;
  updateField: (value: Locale) => void;
  submit: (event: FormEvent<HTMLFormElement>) => void;
  strings: LanguageSectionStrings;
}

export function LanguageSection({
  language,
  errorMessage,
  success,
  pending,
  updateField,
  submit,
  strings,
}: LanguageSectionProps) {
  const options = [
    { value: "en", label: strings.english },
    { value: "ar", label: strings.arabic },
  ] as const;

  return (
    <section aria-labelledby="settings-language" className={styles.card}>
      <h2 id="settings-language" className={styles.title}>
        {strings.title}
      </h2>
      <p className={styles.description}>{strings.description}</p>

      <form onSubmit={submit} noValidate className={styles.form}>
        {errorMessage && <ErrorBanner message={errorMessage} />}
        {success && <SuccessBanner message={strings.saved} />}

        <RadioGroup
          value={language}
          onChange={(value) => updateField(value === "ar" ? "ar" : "en")}
          isDisabled={pending}
          className="flex flex-col gap-2"
        >
          <Label className="text-small font-medium text-slate-700">
            {strings.label}
          </Label>
          {options.map((option) => (
            <Radio
              key={option.value}
              value={option.value}
              className="flex min-h-11 cursor-pointer items-center gap-3 rounded-lg border border-slate-300 bg-white px-3 text-body text-slate-900 transition-colors data-disabled:opacity-60 data-focus-visible:ring-4 data-focus-visible:ring-brand/15 data-selected:border-brand data-selected:bg-brand/5"
            >
              {({ isSelected }) => (
                <>
                  <span
                    aria-hidden="true"
                    className={
                      isSelected
                        ? "size-4 shrink-0 rounded-full border-[5px] border-brand"
                        : "size-4 shrink-0 rounded-full border-2 border-slate-400"
                    }
                  />
                  {option.label}
                </>
              )}
            </Radio>
          ))}
        </RadioGroup>

        <SubmitButton
          pending={pending}
          label={strings.save}
          strings={{ saving: strings.saving }}
        />
      </form>
    </section>
  );
}
