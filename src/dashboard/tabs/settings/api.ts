import { postJson } from "@/shared/api";
import type { Locale } from "@/shared/i18n";
import { withSession } from "../../api";
import type { AdminUser } from "../../models";

const SETTINGS_API = "/admin/settings";

interface UserResponse {
  ok: true;
  user: AdminUser;
}

export function updateLanguage(language: Locale): Promise<UserResponse> {
  return withSession(() =>
    postJson<UserResponse>(`${SETTINGS_API}/language`, { language })
  );
}

export function updateUsername(
  username: string,
  current_password: string
): Promise<UserResponse> {
  return withSession(() =>
    postJson<UserResponse>(`${SETTINGS_API}/username`, {
      username,
      current_password,
    })
  );
}

export function updatePassword(
  current_password: string,
  new_password: string
): Promise<{ ok: true }> {
  return withSession(() =>
    postJson<{ ok: true }>(`${SETTINGS_API}/password`, {
      current_password,
      new_password,
    })
  );
}
