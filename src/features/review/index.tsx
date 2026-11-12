import type { ChangeEvent } from "react";
import { Button } from "react-aria-components";
import { useStrings } from "@/shared/i18n";
import * as C from "./components/";
import { useReview, NOTE_LIMITS } from "./hooks/use-review";
import { strings } from "./strings";

const styles = {
  choices: "flex flex-col gap-3 pb-4 animate-reveal-in",
  form: "flex flex-col gap-5 pb-2 animate-reveal-in",
  error:
    "text-small rounded-md border border-error/30 bg-error/10 px-4 py-3 font-bold text-error",
  submit:
    "text-small mt-2 min-h-12 rounded-full bg-brand px-6 text-center font-bold text-white outline-none transition duration-interactive ease-smooth data-focus-visible:ring-2 data-focus-visible:ring-brand data-focus-visible:ring-offset-2 data-hovered:bg-brand/90 [@media(hover:hover)_and_(pointer:fine)]:data-pressed:scale-[0.98] data-disabled:opacity-50 data-disabled:transition-none motion-reduce:transition-none",
  honeypot: "sr-only",
};

export function ReviewPage() {
  const s = useStrings(strings);
  const review = useReview();

  return (
    <C.ReviewShell
      strings={{
        closeLabel: s.common.close,
        title: review.step === "note" ? s.choices.note.title : s.drawer.title,
        description: s.drawer.description,
      }}
      isOpen={review.isOpen}
      onClose={review.close}
    >
      {review.step === "choices" && (
        <section className={styles.choices}>
          <C.ChoiceCard
            strings={{
              icon: "star",
              title: s.choices.google.title,
              hint: s.choices.google.hint,
            }}
            onPress={review.openGoogleReview}
          />

          <C.ChoiceCard
            strings={{
              icon: "chat",
              title: s.choices.note.title,
              hint: s.choices.note.hint,
            }}
            onPress={review.chooseNote}
          />
        </section>
      )}

      {review.step === "note" && (
        <form noValidate className={styles.form} onSubmit={review.submit}>
          <C.NoteField
            strings={{
              label: s.form.fields.message.label,
              hint: review.showTooShort
                ? s.form.fields.message.tooShort
                : undefined,
            }}
            kind="textarea"
            value={review.values.message}
            onChange={(value) => review.changeField("message", value)}
            maxLength={NOTE_LIMITS.message}
            required
          />
          <C.NoteField
            strings={{ label: s.form.fields.name.label }}
            kind="input"
            value={review.values.name}
            onChange={(value) => review.changeField("name", value)}
            maxLength={NOTE_LIMITS.name}
            autoComplete="name"
          />
          <C.NoteField
            strings={{ label: s.form.fields.contact.label }}
            kind="input"
            value={review.values.contact}
            onChange={(value) => review.changeField("contact", value)}
            maxLength={NOTE_LIMITS.contact}
          />
          <input
            type="text"
            name="website"
            value={review.values.website}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              review.changeField("website", e.currentTarget.value)
            }
            tabIndex={-1}
            autoComplete="off"
            aria-hidden="true"
            className={styles.honeypot}
          />
          {review.error && (
            <p role="alert" className={styles.error}>
              {s.form.errors[review.error]}
            </p>
          )}
          <Button
            type="submit"
            isDisabled={!review.isValid || review.sending}
            className={styles.submit}
          >
            {review.sending ? s.form.actions.sending : s.form.actions.send}
          </Button>
        </form>
      )}

      {review.step === "success" && (
        <C.SuccessScreen
          strings={{
            message: s.success.message,
            closeLabel: s.common.close,
          }}
          onClose={review.close}
        />
      )}
    </C.ReviewShell>
  );
}
