import {
  ApiError,
  requestJsonWithHeaders,
  type JsonResponse,
} from "@/shared/api";
import { withSession } from "../../../api";
import type { MenuDraft, MenuIssue } from "../types/draft";
import type { MenuSnapshot } from "./menu-definition";
import { MenuDraftParser } from "./menu-parser";

export type { MenuSnapshot };

const MENU_ENDPOINT = "/menu";
const ADMIN_MENU_ENDPOINT = "/admin/menu";

function toSnapshot({
  data,
  headers,
}: JsonResponse<Record<string, unknown>>): MenuSnapshot {
  const etag = headers.get("ETag");
  if (!etag) {
    throw new ApiError(
      200,
      "INVALID_RESPONSE",
      "The server did not send an ETag"
    );
  }

  return {
    menu: MenuDraftParser.parse(data),
    etag,
    warnings: MenuDraftParser.parseIssues(data.warnings),
  };
}

export async function loadMenu(): Promise<MenuSnapshot> {
  const response = await requestJsonWithHeaders<Record<string, unknown>>(
    MENU_ENDPOINT,
    {
      method: "GET",
      cache: "no-store",
      headers: { Accept: "application/json" },
    }
  );
  return toSnapshot(response);
}

export function saveMenu(
  draft: MenuDraft,
  etag: string
): Promise<MenuSnapshot> {
  return withSession(async () => {
    const response = await requestJsonWithHeaders<Record<string, unknown>>(
      ADMIN_MENU_ENDPOINT,
      {
        method: "PUT",
        cache: "no-store",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "If-Match": etag,
        },
        body: JSON.stringify(MenuDraftParser.toWire(draft)),
      }
    );
    return toSnapshot(response);
  });
}

export function getMenuIssues(cause: unknown): MenuIssue[] {
  if (!(cause instanceof ApiError)) return [];
  const body = cause.body;
  if (typeof body !== "object" || body === null || Array.isArray(body)) {
    return [];
  }
  return MenuDraftParser.parseIssues((body as Record<string, unknown>).issues);
}
