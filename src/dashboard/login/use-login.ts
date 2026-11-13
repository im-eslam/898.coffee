import { useState, type FormEvent } from "react";
import { reportError } from "@/shared/logging";
import { getAuthError, login } from "../api";
import type { AdminUser, AuthError } from "../models";

export interface LoginValues {
  username: string;
  password: string;
}

type Field = keyof LoginValues;

const emptyValues: LoginValues = { username: "", password: "" };
const noMissing: Record<Field, boolean> = { username: false, password: false };

export function useLogin(onSignedIn: (user: AdminUser) => void) {
  const [values, setValues] = useState<LoginValues>(emptyValues);
  const [missing, setMissing] = useState(noMissing);
  const [error, setError] = useState<AuthError | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [pending, setPending] = useState(false);

  function updateField(field: Field, value: string) {
    setValues((current) => ({ ...current, [field]: value }));
    setMissing((current) => ({ ...current, [field]: false }));
    setError(null);
  }

  function toggleShowPassword() {
    setShowPassword((current) => !current);
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const username = values.username.trim();
    const password = values.password;

    const nextMissing = {
      username: username === "",
      password: password === "",
    };
    setMissing(nextMissing);
    setError(null);

    if (nextMissing.username || nextMissing.password) return;

    setPending(true);
    try {
      onSignedIn(await login(username, password));
    } catch (cause) {
      const failure = getAuthError(cause);
      if (
        failure === "server" ||
        failure === "forbidden" ||
        failure === "unknown"
      ) {
        reportError(cause, { feature: "dashboard", operation: "login" });
      }
      setError(failure);
    } finally {
      setPending(false);
    }
  }

  return {
    values,
    missing,
    error,
    showPassword,
    pending,
    updateField,
    toggleShowPassword,
    submit,
  };
}
