import { useRef, useState, type FormEvent } from "react";
import { useSession } from "../../../auth-session";
import { toFailure, updateUsername } from "../api";
import type { FieldProblem, Problems, SettingsFailure } from "../models";
import {
  focusFirstInvalid,
  validateCurrentPassword,
  validateUsername,
} from "../validation";

type Field = "username" | "currentPassword";

interface UsernameState {
  values: Record<Field, string>;
  problems: Problems<Field>;
  error: SettingsFailure | null;
  success: boolean;
  pending: boolean;
  showPassword: boolean;
}

export function useUsername() {
  const { user, updateUser } = useSession();

  const [state, setState] = useState<UsernameState>({
    values: { username: user.username, currentPassword: "" },
    problems: {},
    error: null,
    success: false,
    pending: false,
    showPassword: false,
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

  function toggleShowPassword() {
    setState((s) => ({ ...s, showPassword: !s.showPassword }));
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (inFlight.current) return;

    const trimmed = state.values.username.trim().toLowerCase();
    const usernameProblem = validateUsername(trimmed, user.username);
    const passwordProblem = validateCurrentPassword(state.values.currentPassword);

    const next: Problems<Field> = {};
    if (usernameProblem) next.username = usernameProblem;
    if (passwordProblem) next.currentPassword = passwordProblem;

    setState((s) => ({ ...s, problems: next, error: null, success: false }));

    if (usernameProblem || passwordProblem) {
      focusFirstInvalid(event.currentTarget);
      return;
    }

    inFlight.current = true;
    setState((s) => ({ ...s, pending: true }));
    try {
      const response = await updateUsername({
        username: trimmed,
        current_password: state.values.currentPassword,
      });
      updateUser(response.user);
      setState((s) => ({
        ...s,
        values: { username: response.user.username, currentPassword: "" },
        success: true,
      }));
    } catch (cause) {
      setState((s) => ({ ...s, error: toFailure(cause, "settings username") }));
    } finally {
      inFlight.current = false;
      setState((s) => ({ ...s, pending: false }));
    }
  }

  return { ...state, updateField, toggleShowPassword, submit };
}
