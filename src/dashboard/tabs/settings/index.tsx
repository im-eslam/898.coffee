import { useStrings } from "@/shared/i18n";
import { LanguageSection } from "./components/language-section";
import { PasswordSection } from "./components/password-section";
import { UsernameSection } from "./components/username-section";
import { failureMessage, strings } from "./strings";
import { useSettings } from "./hooks/use-settings";

export function SettingsPage() {
  const s = useStrings(strings);
  const { language, username, password } = useSettings();

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-6">
      <LanguageSection
        {...language}
        errorMessage={
          language.error ? failureMessage(s, language.error) : undefined
        }
        strings={{
          title: s.languageTitle,
          description: s.languageDescription,
          label: s.languageLabel,
          english: s.english,
          arabic: s.arabic,
          save: s.saveLanguage,
          saved: s.languageSaved,
          saving: s.saving,
        }}
      />

      <UsernameSection
        {...username}
        errorMessage={
          username.error ? failureMessage(s, username.error) : undefined
        }
        strings={{
          title: s.usernameTitle,
          description: s.usernameDescription,
          usernameLabel: s.usernameLabel,
          usernameRules: s.usernameRules,
          currentPasswordLabel: s.currentPasswordLabel,
          save: s.saveUsername,
          saved: s.usernameSaved,
          show: s.show,
          hide: s.hide,
          saving: s.saving,
          problems: {
            usernameMissing: s.problems.usernameMissing,
            usernameLength: s.problems.usernameLength,
            usernamePattern: s.problems.usernamePattern,
            usernameUnchanged: s.problems.usernameUnchanged,
            currentMissing: s.problems.currentMissing,
            currentTooLong: s.problems.currentTooLong,
          },
        }}
      />

      <PasswordSection
        {...password}
        errorMessage={
          password.error ? failureMessage(s, password.error) : undefined
        }
        strings={{
          title: s.passwordTitle,
          description: s.passwordDescription,
          currentPasswordLabel: s.currentPasswordLabel,
          newPasswordLabel: s.newPasswordLabel,
          newPasswordRules: s.newPasswordRules,
          confirmPasswordLabel: s.confirmPasswordLabel,
          save: s.savePassword,
          saved: s.passwordSaved,
          show: s.show,
          hide: s.hide,
          saving: s.saving,
          problems: {
            currentMissing: s.problems.currentMissing,
            currentTooLong: s.problems.currentTooLong,
            newMissing: s.problems.newMissing,
            newLength: s.problems.newLength,
            newSameAsCurrent: s.problems.newSameAsCurrent,
            newSameAsUsername: s.problems.newSameAsUsername,
            confirmMissing: s.problems.confirmMissing,
            confirmMismatch: s.problems.confirmMismatch,
          },
        }}
      />
    </div>
  );
}
