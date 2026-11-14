import { ApiError } from "@/shared/api";
import { API_CONFIG } from "@/shared/api/data";
import { withSession } from "../../api";
import { fromWire, parseIssues, toWire } from "./lib/wire";
import type { MenuDraft, MenuIssue } from "./types";

const MENU_ENDPOINT = "/menu";
const ADMIN_MENU_ENDPOINT = "/admin/menu";

export interface MenuSnapshot {
  menu: MenuDraft;
  etag: string;
  warnings: MenuIssue[];
}

interface Response200 {
  body: Record<string, unknown>;
  etag: string | null;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

/*
 * The shared request helpers only return the JSON body. The menu needs the
 * ETag response header and must bypass the HTTP cache (the public GET is
 * cacheable, which would hand back a stale ETag), so it makes its own request.
 * Failures use the same ApiError shape as @/shared/api, with the parsed body
 * kept on `cause` so callers can read `issues`.
 */
async function send(path: string, init: RequestInit): Promise<Response200> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), API_CONFIG.timeoutMs);

  try {
    let response: Response;
    try {
      response = await fetch(`${API_CONFIG.baseUrl}${path}`, {
        ...init,
        signal: controller.signal,
      });
    } catch (cause) {
      if (controller.signal.aborted) {
        throw new ApiError(408, "TIMEOUT", "Request timed out", cause);
      }
      throw new ApiError(0, "NETWORK_ERROR", "Network error occurred", cause);
    }

    let body: unknown = null;
    try {
      body = await response.json();
    } catch (cause) {
      if (response.ok) {
        throw new ApiError(
          response.status,
          "INVALID_RESPONSE",
          "Unable to decode JSON response",
          cause
        );
      }
    }

    if (!response.ok) {
      const fields = isRecord(body) ? body : {};
      throw new ApiError(
        response.status,
        typeof fields.code === "string" && fields.code
          ? fields.code
          : "UNKNOWN_ERROR",
        typeof fields.error === "string" && fields.error
          ? fields.error
          : `HTTP Error ${response.status}`,
        body
      );
    }

    if (!isRecord(body)) {
      throw new ApiError(
        response.status,
        "INVALID_RESPONSE",
        "The server sent an unexpected response"
      );
    }

    return { body, etag: response.headers.get("ETag") };
  } finally {
    clearTimeout(timeoutId);
  }
}

function toSnapshot({ body, etag }: Response200): MenuSnapshot {
  if (!etag) {
    throw new ApiError(
      200,
      "INVALID_RESPONSE",
      "The server did not send an ETag"
    );
  }
  return {
    menu: fromWire(body),
    etag,
    warnings: parseIssues(body.warnings),
  };
}

export async function loadMenu(): Promise<MenuSnapshot> {
  const response = await send(MENU_ENDPOINT, {
    method: "GET",
    cache: "no-store",
    headers: { Accept: "application/json" },
  });
  return toSnapshot(response);
}

export async function saveMenu(
  draft: MenuDraft,
  etag: string
): Promise<MenuSnapshot> {
  const response = await withSession(() =>
    send(ADMIN_MENU_ENDPOINT, {
      method: "PUT",
      cache: "no-store",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "If-Match": etag,
      },
      body: JSON.stringify(toWire(draft)),
    })
  );
  return toSnapshot(response);
}

export function getIssues(cause: unknown): MenuIssue[] {
  if (!(cause instanceof ApiError) || !isRecord(cause.cause)) return [];
  return parseIssues(cause.cause.issues);
}
