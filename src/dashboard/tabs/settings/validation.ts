import type { FieldProblem } from "./models";

const USERNAME_MIN = 3;
const USERNAME_MAX = 50;
const USERNAME_CHARACTERS = /^[a-z0-9._-]+$/;
const PASSWORD_MIN_BYTES = 10;
const PASSWORD_MAX_BYTES = 72;

function byteLength(value: string): number {
  return new TextEncoder().encode(value).length;
}

export function validateUsername(
  username: string,
  current: string
): FieldProblem | null {
  if (username === "") return "usernameMissing";
  if (username.length < USERNAME_MIN || username.length > USERNAME_MAX)
    return "usernameLength";
  if (!USERNAME_CHARACTERS.test(username)) return "usernamePattern";
  if (username === current) return "usernameUnchanged";
  return null;
}

export function validateCurrentPassword(value: string): FieldProblem | null {
  if (value === "") return "currentMissing";
  if (byteLength(value) > PASSWORD_MAX_BYTES) return "currentTooLong";
  return null;
}

export function validateNewPassword(
  value: string,
  current: string,
  username: string
): FieldProblem | null {
  if (value === "") return "newMissing";
  const bytes = byteLength(value);
  if (bytes < PASSWORD_MIN_BYTES || bytes > PASSWORD_MAX_BYTES)
    return "newLength";
  if (value === current) return "newSameAsCurrent";
  if (value.toLowerCase() === username.toLowerCase())
    return "newSameAsUsername";
  return null;
}

export function validateConfirm(
  value: string,
  newPassword: string
): FieldProblem | null {
  if (value === "") return "confirmMissing";
  if (value !== newPassword) return "confirmMismatch";
  return null;
}

export function focusFirstInvalid(form: HTMLFormElement): void {
  window.setTimeout(() => {
    form.querySelector<HTMLInputElement>('input[aria-invalid="true"]')?.focus();
  }, 0);
}
