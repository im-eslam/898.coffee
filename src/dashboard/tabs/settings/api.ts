import { ApiError, postJson } from "@/shared/api";
import { reportError } from "@/shared/logging";
import { getAuthError, withSession } from "../../api";
import {
  isSettingsErrorCode,
  type LanguageRequest,
  type OkResponse,
  type PasswordRequest,
  type SettingsFailure,
  type UserResponse,
  type UsernameRequest,
} from "./models";

export function updateLanguage(body: LanguageRequest): Promise<UserResponse> {
  return withSession(() =>
    postJson<UserResponse>("/admin/settings/language", { ...body })
  );
}

export function updateUsername(body: UsernameRequest): Promise<UserResponse> {
  return withSession(() =>
    postJson<UserResponse>("/admin/settings/username", { ...body })
  );
}

export function updatePassword(body: PasswordRequest): Promise<OkResponse> {
  return withSession(() =>
    postJson<OkResponse>("/admin/settings/password", { ...body })
  );
}

export function toFailure(cause: unknown, operation: string): SettingsFailure {
  const auth = getAuthError(cause);

  if (auth === "network") return { kind: "network" };

  if (auth === "rate_limited") {
    const retryAfter =
      cause instanceof ApiError &&
      "retryAfter" in cause &&
      typeof cause.retryAfter === "number"
        ? cause.retryAfter
        : undefined;
    return { kind: "code", code: "too_many_attempts", retryAfter };
  }

  if (cause instanceof ApiError && isSettingsErrorCode(cause.code)) {
    return { kind: "code", code: cause.code };
  }

  // Log unexpected failures (server errors, 403s, truly unknown) so we have a trail.
  reportError(cause, { feature: "dashboard", operation });
  return { kind: "generic" };
}
