import { useRef, useState, type FormEvent } from "react";
import { useSession } from "../../../auth-session";
import { toFailure, updatePassword } from "../api";
import type { FieldProblem, Problems, SettingsFailure } from "../models";
import {
  focusFirstInvalid,
  validateConfirm,
  validateCurrentPassword,
  validateNewPassword,
} from "../validation";

type Field = "currentPassword" | "newPassword" | "confirmPassword";

interface PasswordState {
  values: Record<Field, string>;
  problems: Problems<Field>;
  error: SettingsFailure | null;
  success: boolean;
  pending: boolean;
  revealed: Record<Field, boolean>;
}

const emptyValues: Record<Field, string> = {
  currentPassword: "",
  newPassword: "",
  confirmPassword: "",
};

const allHidden: Record<Field, boolean> = {
  currentPassword: false,
  newPassword: false,
  confirmPassword: false,
};

export function usePassword() {
  const { user } = useSession();

  const [state, setState] = useState<PasswordState>({
    values: { ...emptyValues },
    problems: {},
    error: null,
    success: false,
    pending: false,
    revealed: { ...allHidden },
  });

  const inFlight = useRef(false);

  function updateField(field: Field, value: string) {
    setState((s) => ({
      ...s,
      values: { ...s.values, [field]: value },
      problems: { ...s.problems, [field]: undefined as FieldProblem | undefined },
      error: null,
      success: false,
    }));
  }

  function toggleRevealed(field: Field) {
    setState((s) => ({
      ...s,
      revealed: { ...s.revealed, [field]: !s.revealed[field] },
    }));
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (inFlight.current) return;

    const { currentPassword, newPassword, confirmPassword } = state.values;
    const currentProblem = validateCurrentPassword(currentPassword);
    const newProblem = validateNewPassword(newPassword, currentPassword, user.username);
    const confirmProblem = validateConfirm(confirmPassword, newPassword);

    const next: Problems<Field> = {};
    if (currentProblem) next.currentPassword = currentProblem;
    if (newProblem) next.newPassword = newProblem;
    if (confirmProblem) next.confirmPassword = confirmProblem;

    setState((s) => ({ ...s, problems: next, error: null, success: false }));

    if (currentProblem || newProblem || confirmProblem) {
      focusFirstInvalid(event.currentTarget);
      return;
    }

    inFlight.current = true;
    setState((s) => ({ ...s, pending: true }));
    try {
      await updatePassword({ current_password: currentPassword, new_password: newPassword });
      setState((s) => ({ ...s, values: { ...emptyValues }, success: true }));
    } catch (cause) {
      setState((s) => ({ ...s, error: toFailure(cause, "settings password") }));
    } finally {
      inFlight.current = false;
      setState((s) => ({ ...s, pending: false }));
    }
  }

  return { ...state, updateField, toggleRevealed, submit };
}
