import { useEffect, type ChangeEvent } from "react";
import { Button } from "react-aria-components";
import { useStrings } from "@/shared/i18n";
import { ChoiceCard } from "./components/ui/choice-card";
import { NoteField } from "./components/ui/note-field";
import { ReviewShell } from "./components/review-shell";
import { SuccessScreen } from "./components/success-screen";
import { useReviewFlow } from "./hooks/use-review-flow";
import { useReviewNote, NOTE_LIMITS } from "./hooks/use-review-note";
import { strings } from "./strings";

const styles = {
  choices: "flex flex-col gap-3 pb-4 animate-reveal-in",
  form: "flex flex-col gap-5 pb-2 animate-reveal-in",
  error:
    "text-small rounded-md border border-error/30 bg-error/10 px-4 py-3 font-bold text-error",
  submit:
    "text-small mt-2 min-h-12 rounded-full bg-brand px-6 text-center font-bold text-white outline-none transition duration-interactive ease-smooth data-focus-visible:ring-2 data-focus-visible:ring-brand data-focus-visible:ring-offset-2 data-hovered:bg-brand/90 data-pressed:scale-[0.98] data-disabled:opacity-50 data-disabled:transition-none motion-reduce:transition-none",
  honeypot: "sr-only",
};

export function ReviewPage() {
  const s = useStrings(strings);
  const flow = useReviewFlow();
  const note = useReviewNote();

  useEffect(() => {
    if (!flow.isOpen) {
      note.reset();
    }
  }, [flow.isOpen, note]);

  return (
    <ReviewShell
      strings={{
        closeLabel: s.common.close,
        title: flow.step === "note" ? s.choices.note.title : s.drawer.title,
        description: s.drawer.description,
      }}
      isOpen={flow.isOpen}
      onClose={flow.close}
    >
      {flow.step === "choices" && (
        <section className={styles.choices}>
          <ChoiceCard
            strings={{
              icon: "star",
              title: s.choices.google.title,
              hint: s.choices.google.hint,
            }}
            onPress={flow.openGoogleReview}
          />

          <ChoiceCard
            strings={{
              icon: "chat",
              title: s.choices.note.title,
              hint: s.choices.note.hint,
            }}
            onPress={flow.chooseNote}
          />
        </section>
      )}

      {flow.step === "note" && (
        <form
          noValidate
          className={styles.form}
          onSubmit={(e) => note.submit(e, flow.complete)}
        >
          {" "}
          <NoteField
            strings={{
              label: s.form.fields.message.label,
              hint: note.showTooShort
                ? s.form.fields.message.tooShort
                : undefined,
            }}
            kind="textarea"
            value={note.values.message}
            onChange={(value) => note.changeField("message", value)}
            maxLength={NOTE_LIMITS.message}
            required
          />
          <NoteField
            strings={{ label: s.form.fields.name.label }}
            kind="input"
            value={note.values.name}
            onChange={(value) => note.changeField("name", value)}
            maxLength={NOTE_LIMITS.name}
            autoComplete="name"
          />
          <NoteField
            strings={{ label: s.form.fields.contact.label }}
            kind="input"
            value={note.values.contact}
            onChange={(value) => note.changeField("contact", value)}
            maxLength={NOTE_LIMITS.contact}
          />
          <input
            type="text"
            name="website"
            value={note.values.website}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              note.changeField("website", e.currentTarget.value)
            }
            tabIndex={-1}
            autoComplete="off"
            aria-hidden="true"
            className={styles.honeypot}
          />
          {note.error && (
            <p role="alert" className={styles.error}>
              {s.form.errors[note.error]}
            </p>
          )}
          <Button
            type="submit"
            isDisabled={!note.isValid || note.sending}
            className={styles.submit}
          >
            {note.sending ? s.form.actions.sending : s.form.actions.send}
          </Button>
        </form>
      )}

      {flow.step === "success" && (
        <SuccessScreen
          strings={{
            message: s.success.message,
            closeLabel: s.common.close,
          }}
          onClose={flow.close}
        />
      )}
    </ReviewShell>
  );
}
