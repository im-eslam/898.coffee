import {
  ApiError,
  requestJsonWithHeaders,
  type JsonResponse,
} from "@/shared/api";
import { isDict } from "@/shared/menu";
import { ADMIN_API, withSession } from "../../../api";
import type { MenuDraft, MenuIssue } from "../types/draft";
import { MenuDraftParser } from "./menu-parser";

const PUBLIC_MENU_API = "/menu";
const ADMIN_MENU_API = `${ADMIN_API}/menu`;

export interface MenuSnapshot {
  menu: MenuDraft;
  etag: string;
  warnings: MenuIssue[];
}

interface PopupImageResponse {
  ok: true;
  image: string;
}

function toSnapshot({
  data,
  headers,
}: JsonResponse<Record<string, unknown>>): MenuSnapshot {
  const etag = headers.get("ETag");
  if (!etag) {
    throw new ApiError(
      502,
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
    PUBLIC_MENU_API,
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
      ADMIN_MENU_API,
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
    if (!response.headers.get("ETag")) return loadMenu();
    return toSnapshot(response);
  });
}

export function uploadPopupImage(file: File): Promise<string> {
  return withSession(async () => {
    const body = new FormData();
    body.append("image", file);
    const response = await requestJsonWithHeaders<PopupImageResponse>(
      `${ADMIN_MENU_API}/popup-image`,
      {
        method: "POST",
        cache: "no-store",
        headers: { Accept: "application/json" },
        body,
      }
    );
    return response.data.image;
  });
}

export function getMenuIssues(cause: unknown): MenuIssue[] {
  if (!(cause instanceof ApiError) || !isDict(cause.body)) return [];
  return MenuDraftParser.parseIssues(cause.body.issues);
}
