import { useRef, useState, type FormEvent } from "react";
import type { Locale } from "@/shared/i18n";
import { useSession } from "../../../auth-session";
import { toFailure, updateLanguage } from "../api";
import type { SettingsFailure } from "../models";

interface LanguageState {
  language: Locale;
  error: SettingsFailure | null;
  success: boolean;
  pending: boolean;
}

export function useLanguage() {
  const { user, updateUser } = useSession();

  const [state, setState] = useState<LanguageState>({
    language: user.language,
    error: null,
    success: false,
    pending: false,
  });

  const inFlight = useRef(false);

  function updateField(value: Locale) {
    setState((s) => ({ ...s, language: value, error: null, success: false }));
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (inFlight.current || state.language === user.language) return;

    inFlight.current = true;
    setState((s) => ({ ...s, pending: true, error: null, success: false }));
    try {
      const response = await updateLanguage({ language: state.language });
      updateUser(response.user);
      setState((s) => ({ ...s, success: true }));
    } catch (cause) {
      setState((s) => ({ ...s, error: toFailure(cause, "settings language") }));
    } finally {
      inFlight.current = false;
      setState((s) => ({ ...s, pending: false }));
    }
  }

  return { ...state, updateField, submit };
}
