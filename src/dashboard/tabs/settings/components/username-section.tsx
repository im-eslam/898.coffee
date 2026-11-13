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

export interface UsernameSectionStrings {
  title: string;
  description: string;
  usernameLabel: string;
  usernameRules: string;
  currentPasswordLabel: string;
  save: string;
  saved: string;
  show: string;
  hide: string;
  saving: string;
  problems: Partial<Record<FieldProblem, string>>;
}

interface UsernameSectionProps {
  values: { username: string; currentPassword: string };
  problems: Problems<"username" | "currentPassword">;
  errorMessage?: string;
  success: boolean;
  pending: boolean;
  showPassword: boolean;
  updateField: (field: "username" | "currentPassword", value: string) => void;
  toggleShowPassword: () => void;
  submit: (event: FormEvent<HTMLFormElement>) => void;
  strings: UsernameSectionStrings;
}

function problemMessage(
  strings: UsernameSectionStrings,
  problem: FieldProblem | undefined
): string | undefined {
  return problem ? strings.problems[problem] : undefined;
}

export function UsernameSection({
  values,
  problems,
  errorMessage,
  success,
  pending,
  showPassword,
  updateField,
  toggleShowPassword,
  submit,
  strings,
}: UsernameSectionProps) {
  return (
    <section aria-labelledby="settings-username" className={styles.card}>
      <h2 id="settings-username" className={styles.title}>
        {strings.title}
      </h2>
      <p className={styles.description}>{strings.description}</p>

      <form onSubmit={submit} noValidate className={styles.form}>
        {errorMessage && <ErrorBanner message={errorMessage} />}
        {success && <SuccessBanner message={strings.saved} />}

        <TextField
          name="username"
          label={strings.usernameLabel}
          value={values.username}
          onChange={(value) => updateField("username", value)}
          autoComplete="username"
          description={strings.usernameRules}
          isRequired
          isDisabled={pending}
          validationBehavior="aria"
          isInvalid={!!problems.username}
          errorMessage={problemMessage(strings, problems.username)}
        />

        <TextField
          name="currentPassword"
          label={strings.currentPasswordLabel}
          value={values.currentPassword}
          onChange={(value) => updateField("currentPassword", value)}
          type={showPassword ? "text" : "password"}
          autoComplete="current-password"
          isRequired
          isDisabled={pending}
          validationBehavior="aria"
          isInvalid={!!problems.currentPassword}
          errorMessage={problemMessage(strings, problems.currentPassword)}
          trailing={
            <RevealToggle
              revealed={showPassword}
              disabled={pending}
              onPress={toggleShowPassword}
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
