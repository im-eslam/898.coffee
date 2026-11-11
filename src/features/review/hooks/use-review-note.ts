import { useCallback, useState } from "react";
import { reportError } from "@/shared/logging";
import {
  getReviewError,
  submitReview,
  type ReviewError,
  type ReviewPayload,
} from "../api/review";

export const NOTE_LIMITS = {
  minMessage: 3,
  message: 1000,
  name: 80,
  contact: 120,
} as const;

type ReviewField = keyof ReviewPayload;

const EMPTY_NOTE: ReviewPayload = {
  message: "",
  name: "",
  contact: "",
  website: "",
};

export function useReviewNote() {
  const [values, setValues] = useState<ReviewPayload>(EMPTY_NOTE);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<ReviewError | null>(null);

  const messageLength = values.message.trim().length;
  const isValid = messageLength >= NOTE_LIMITS.minMessage;

  const changeField = useCallback((field: ReviewField, value: string) => {
    setValues((current) => ({ ...current, [field]: value }));
    setError(null);
  }, []);

  const reset = useCallback(() => {
    setValues(EMPTY_NOTE);
    setError(null);
    setSending(false);
  }, []);

  const submit = useCallback(
    async (event?: React.FormEvent, onSuccess?: () => void): Promise<void> => {
      if (event) event.preventDefault();

      if (!isValid || sending) return;

      const payload: ReviewPayload = {
        ...values,
        message: values.message.trim(),
        name: values.name.trim(),
        contact: values.contact.trim(),
      };

      setSending(true);
      setError(null);

      try {
        await submitReview(payload);
        if (onSuccess) onSuccess();
      } catch (cause: unknown) {
        reportError(cause, {
          feature: "review",
          operation: "submit",
        });

        setError(getReviewError(cause));
      } finally {
        setSending(false);
      }
    },
    [isValid, values, sending]
  );

  return {
    values,
    sending,
    error,
    isValid,
    showTooShort: messageLength > 0 && !isValid,
    changeField,
    reset,
    submit,
  };
}
