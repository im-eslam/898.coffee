import type { Locale } from "@/shared/i18n";
import type { AdminUser } from "../../models";

export interface UserResponse {
  ok: true;
  user: AdminUser;
}

export interface OkResponse {
  ok: true;
}

export interface LanguageRequest {
  language: Locale;
}

export interface UsernameRequest {
  username: string;
  current_password: string;
}

export interface PasswordRequest {
  current_password: string;
  new_password: string;
}

export type SettingsErrorCode =
  | "invalid_language"
  | "invalid_username"
  | "unchanged"
  | "wrong_password"
  | "username_taken"
  | "weak_password"
  | "same_password"
  | "too_many_attempts";

const KNOWN_CODES: Record<SettingsErrorCode, true> = {
  invalid_language: true,
  invalid_username: true,
  unchanged: true,
  wrong_password: true,
  username_taken: true,
  weak_password: true,
  same_password: true,
  too_many_attempts: true,
};

export function isSettingsErrorCode(value: unknown): value is SettingsErrorCode {
  return typeof value === "string" && Object.prototype.hasOwnProperty.call(KNOWN_CODES, value);
}

export type FieldProblem =
  | "usernameMissing"
  | "usernameLength"
  | "usernamePattern"
  | "usernameUnchanged"
  | "currentMissing"
  | "currentTooLong"
  | "newMissing"
  | "newLength"
  | "newSameAsCurrent"
  | "newSameAsUsername"
  | "confirmMissing"
  | "confirmMismatch";

export type Problems<Field extends string> = Partial<Record<Field, FieldProblem>>;

export type SettingsFailure =
  | { kind: "network" }
  | { kind: "generic" }
  | { kind: "code"; code: SettingsErrorCode; retryAfter?: number };
