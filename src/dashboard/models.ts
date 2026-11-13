import type { Locale } from "@/shared/i18n";

export interface AdminUser {
  username: string;
  language: Locale;
}

export type AuthError =
  | "unauthorized"
  | "rate_limited"
  | "forbidden"
  | "network"
  | "server"
  | "unknown";

export type Session =
  | { status: "checking" }
  | { status: "error" }
  | { status: "signed-out" }
  | { status: "signed-in"; user: AdminUser };
