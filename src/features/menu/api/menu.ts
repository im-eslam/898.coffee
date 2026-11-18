import { ApiError, requestJsonWithHeaders } from "@/shared/api";
import type { RawMenuResponse } from "@/shared/menu";

const MENU_ENDPOINT = "/menu";

export type MenuError = "server" | "timeout" | "network" | "unknown";

export async function fetchMenu(): Promise<RawMenuResponse> {
  try {
    const { data } = await requestJsonWithHeaders<RawMenuResponse>(
      MENU_ENDPOINT,
      {
        method: "GET",
        cache: "no-store",
        headers: { Accept: "application/json" },
      }
    );
    return data;
  } catch (cause) {
    if (getMenuError(cause) === "unknown") throw cause;
    const { data } = await requestJsonWithHeaders<RawMenuResponse>(
      MENU_ENDPOINT,
      {
        method: "GET",
        cache: "no-store",
        headers: { Accept: "application/json" },
      }
    );
    return data;
  }
}

export function getMenuError(cause: unknown): MenuError {
  if (!(cause instanceof ApiError)) return "unknown";
  if (cause.code === "TIMEOUT") return "timeout";
  if (cause.code === "NETWORK_ERROR") return "network";
  if (cause.status >= 500 || cause.code === "INTERNAL_ERROR") return "server";
  return "unknown";
}
