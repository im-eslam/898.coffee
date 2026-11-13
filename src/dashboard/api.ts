import { ApiError, getJson, postJson } from "@/shared/api";
import type { AdminUser, AuthError } from "./models";

interface UserResponse {
  ok: true;
  user: AdminUser;
}

const sessionEvents = new EventTarget();
const EXPIRED = "expired";

export async function me(): Promise<AdminUser> {
  const response = await getJson<UserResponse>("/admin/me");
  return response.user;
}

export async function login(
  username: string,
  password: string
): Promise<AdminUser> {
  const response = await postJson<UserResponse>("/admin/login", {
    username,
    password,
  });
  return response.user;
}

export async function logout(): Promise<void> {
  await postJson<{ ok: true }>("/admin/logout", {});
}

export async function withSession<T>(request: () => Promise<T>): Promise<T> {
  try {
    return await request();
  } catch (cause) {
    if (getAuthError(cause) === "unauthorized") {
      sessionEvents.dispatchEvent(new Event(EXPIRED));
    }
    throw cause;
  }
}

export function getAuthError(cause: unknown): AuthError {
  if (!(cause instanceof ApiError)) return "unknown";
  if (cause.code === "NETWORK_ERROR" || cause.code === "TIMEOUT") {
    return "network";
  }
  switch (cause.status) {
    case 401:
      return "unauthorized";
    case 403:
      return "forbidden";
    case 429:
      return "rate_limited";
    default:
      return cause.status >= 500 ? "server" : "unknown";
  }
}

export function onSessionExpired(listener: () => void): () => void {
  sessionEvents.addEventListener(EXPIRED, listener);
  return () => sessionEvents.removeEventListener(EXPIRED, listener);
}
