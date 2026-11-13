import { useState, type FormEvent } from "react";
import toast from "react-hot-toast";
import { ApiError } from "@/shared/api";
import { useStrings, type Locale } from "@/shared/i18n";
import { reportError } from "@/shared/logging";
import { useSession } from "../../auth-session";
import { updateLanguage, updatePassword, updateUsername } from "./api";
import { config, errorMessage } from "./strings";

type Pending = "language" | "username" | "password" | null;
type PasswordField = "current" | "next" | "confirm";

const EMPTY_PASSWORDS = { current: "", next: "", confirm: "" };

export function useSettings() {
  const m = useStrings(config.messages);
  const { updateUser } = useSession();
  const { user } = useSession();

  const [pending, setPending] = useState<Pending>(null);
  const [username, setUsername] = useState(user.username);
  const [usernamePassword, setUsernamePassword] = useState("");
  const [passwords, setPasswords] = useState(EMPTY_PASSWORDS);

  function changePassword(field: PasswordField, value: string) {
    setPasswords((current) => ({ ...current, [field]: value }));
  }

  async function run(
    key: Exclude<Pending, null>,
    operation: string,
    request: () => Promise<void>,
    successText: string
  ) {
    setPending(key);
    try {
      await request();
      toast.success(successText);
    } catch (cause: unknown) {
      reportError(cause, { feature: "dashboard", operation });
      toast.error(
        errorMessage(m, cause instanceof ApiError ? cause.code : undefined)
      );
    } finally {
      setPending(null);
    }
  }

  function changeLanguage(language: Locale) {
    return run(
      "language",
      "settings language",
      async () => {
        const res = await updateLanguage(language);
        updateUser(res.user);
      },
      m.saved.language
    );
  }

  async function submitUsername(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    await run(
      "username",
      "settings username",
      async () => {
        const res = await updateUsername(username, usernamePassword);
        updateUser(res.user);
        setUsername(res.user.username);
        setUsernamePassword("");
      },
      m.saved.username
    );
  }

  async function submitPassword(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (passwords.next !== passwords.confirm) {
      toast.error(m.mismatch);
      return;
    }
    await run(
      "password",
      "settings password",
      async () => {
        await updatePassword(passwords.current, passwords.next);
        setPasswords(EMPTY_PASSWORDS);
      },
      m.saved.password
    );
  }

  return {
    pending,
    busy: pending !== null,
    username,
    setUsername,
    usernamePassword,
    setUsernamePassword,
    passwords,
    changePassword,
    changeLanguage,
    submitUsername,
    submitPassword,
  };
}
