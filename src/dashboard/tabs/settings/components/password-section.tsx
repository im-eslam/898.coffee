import type { FormEvent } from "react";
import { TextField } from "../../../login/components/field";
import type { FieldProblem, Problems } from "../models";
import {
  ErrorBanner,
  RevealToggle,
  styles,
  SubmitButton,
  SuccessBanner,
} from "./ui";

export interface PasswordSectionStrings {
  title: string;
  description: string;
  currentPasswordLabel: string;
  newPasswordLabel: string;
  newPasswordRules: string;
  confirmPasswordLabel: string;
  save: string;
  saved: string;
  show: string;
  hide: string;
  saving: string;
  problems: Partial<Record<FieldProblem, string>>;
}

interface PasswordSectionProps {
  values: {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
  };
  problems: Problems<"currentPassword" | "newPassword" | "confirmPassword">;
  errorMessage?: string;
  success: boolean;
  pending: boolean;
  revealed: Record<
    "currentPassword" | "newPassword" | "confirmPassword",
    boolean
  >;
  updateField: (
    field: "currentPassword" | "newPassword" | "confirmPassword",
    value: string
  ) => void;
  toggleRevealed: (
    field: "currentPassword" | "newPassword" | "confirmPassword"
  ) => void;
  submit: (event: FormEvent<HTMLFormElement>) => void;
  strings: PasswordSectionStrings;
}

function problemMessage(
  strings: PasswordSectionStrings,
  problem: FieldProblem | undefined
): string | undefined {
  return problem ? strings.problems[problem] : undefined;
}

export function PasswordSection({
  values,
  problems,
  errorMessage,
  success,
  pending,
  revealed,
  updateField,
  toggleRevealed,
  submit,
  strings,
}: PasswordSectionProps) {
  return (
    <section aria-labelledby="settings-password" className={styles.card}>
      <h2 id="settings-password" className={styles.title}>
        {strings.title}
      </h2>
      <p className={styles.description}>{strings.description}</p>

      <form onSubmit={submit} noValidate className={styles.form}>
        {errorMessage && <ErrorBanner message={errorMessage} />}
        {success && <SuccessBanner message={strings.saved} />}

        <TextField
          name="currentPassword"
          label={strings.currentPasswordLabel}
          value={values.currentPassword}
          onChange={(value) => updateField("currentPassword", value)}
          type={revealed.currentPassword ? "text" : "password"}
          autoComplete="current-password"
          isRequired
          isDisabled={pending}
          validationBehavior="aria"
          isInvalid={!!problems.currentPassword}
          errorMessage={problemMessage(strings, problems.currentPassword)}
          trailing={
            <RevealToggle
              revealed={revealed.currentPassword}
              disabled={pending}
              onPress={() => toggleRevealed("currentPassword")}
              strings={{ show: strings.show, hide: strings.hide }}
            />
          }
        />

        <TextField
          name="newPassword"
          label={strings.newPasswordLabel}
          value={values.newPassword}
          onChange={(value) => updateField("newPassword", value)}
          type={revealed.newPassword ? "text" : "password"}
          autoComplete="new-password"
          description={strings.newPasswordRules}
          isRequired
          isDisabled={pending}
          validationBehavior="aria"
          isInvalid={!!problems.newPassword}
          errorMessage={problemMessage(strings, problems.newPassword)}
          trailing={
            <RevealToggle
              revealed={revealed.newPassword}
              disabled={pending}
              onPress={() => toggleRevealed("newPassword")}
              strings={{ show: strings.show, hide: strings.hide }}
            />
          }
        />

        <TextField
          name="confirmPassword"
          label={strings.confirmPasswordLabel}
          value={values.confirmPassword}
          onChange={(value) => updateField("confirmPassword", value)}
          type={revealed.confirmPassword ? "text" : "password"}
          autoComplete="new-password"
          isRequired
          isDisabled={pending}
          validationBehavior="aria"
          isInvalid={!!problems.confirmPassword}
          errorMessage={problemMessage(strings, problems.confirmPassword)}
          trailing={
            <RevealToggle
              revealed={revealed.confirmPassword}
              disabled={pending}
              onPress={() => toggleRevealed("confirmPassword")}
              strings={{ show: strings.show, hide: strings.hide }}
            />
          }
        />

        <SubmitButton
          pending={pending}
          label={strings.save}
          strings={{ saving: strings.saving }}
        />
      </form>
    </section>
  );
}
