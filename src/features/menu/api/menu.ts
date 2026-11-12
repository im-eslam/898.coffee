import { ApiError, getJson } from "@/shared/api";
import type { RawMenuResponse } from "./menu-definition";

const MENU_ENDPOINT = "/menu";

export type MenuError = "server" | "timeout" | "network" | "unknown";

export async function fetchMenu(): Promise<RawMenuResponse> {
  try {
    return await getJson<RawMenuResponse>(MENU_ENDPOINT);
  } catch (cause) {
    if (getMenuError(cause) === "unknown") throw cause;
    return getJson<RawMenuResponse>(MENU_ENDPOINT);
  }
}

export function getMenuError(cause: unknown): MenuError {
  if (!(cause instanceof ApiError)) return "unknown";
  if (cause.code === "TIMEOUT") return "timeout";
  if (cause.code === "NETWORK_ERROR") return "network";
  if (cause.status >= 500 || cause.code === "INTERNAL_ERROR") return "server";
  return "unknown";
}
