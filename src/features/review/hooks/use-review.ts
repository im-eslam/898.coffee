import { useReviewFlow } from "./use-review-flow";
import { useReviewNote } from "./use-review-note";

export { NOTE_LIMITS } from "./use-review-note";

export function useReview() {
  const flow = useReviewFlow();
  const note = useReviewNote();

  const close = () => {
    note.reset();
    flow.close();
  };

  const submit = (event?: React.FormEvent) => {
    note.submit(event, flow.complete);
  };

  return {
    isOpen: flow.isOpen,
    step: flow.step,
    values: note.values,
    sending: note.sending,
    error: note.error,
    isValid: note.isValid,
    showTooShort: note.showTooShort,

    changeField: note.changeField,
    chooseNote: flow.chooseNote,
    openGoogleReview: flow.openGoogleReview,
    close,
    submit,
  };
}
