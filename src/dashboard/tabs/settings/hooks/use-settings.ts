import { useLanguage } from "./use-settings-language";
import { usePassword } from "./use-settings-password";
import { useUsername } from "./use-settings-username";

export function useSettings() {
  const language = useLanguage();
  const username = useUsername();
  const password = usePassword();
  return { language, username, password };
}
