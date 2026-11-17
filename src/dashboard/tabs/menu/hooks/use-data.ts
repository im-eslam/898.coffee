import { useCallback, useEffect, useRef, useState } from "react";
import { ApiError } from "@/shared/api";
import { reportError } from "@/shared/logging";
import { onSessionExpired } from "../../../api";
import { getMenuIssues, loadMenu, saveMenu, type MenuSnapshot } from "../api/menu";
import type { MenuDraft, MenuIssue } from "../types/draft";

export type LoadState = "loading" | "ready" | "error";
export type SaveStatus = "idle" | "saving" | "saved" | "error";

export type SaveFailure =
  | { kind: "invalid"; issues: MenuIssue[] }
  | { kind: "conflict" } 
  | { kind: "session" }
  | { kind: "busy" } 
  | { kind: "network" }
  | { kind: "tooLarge" }
  | { kind: "rateLimited" }
  | { kind: "error" };

export type PersistResult =
  | { ok: true; snapshot: MenuSnapshot }
  | ({ ok: false } & SaveFailure);

export const MENU_CHANGED_EVENT = "menu:changed";

const FEATURE = "dashboard";

const EXPECTED: ReadonlySet<SaveFailure["kind"]> = new Set([
  "invalid",
  "conflict",
  "session",
  "busy",
]);

function classify(cause: unknown): SaveFailure {
  if (cause instanceof ApiError) {
    if (cause.status === 412) return { kind: "conflict" };
    if (cause.status === 401) return { kind: "session" };
    const issues = getMenuIssues(cause);
    if (cause.code === "INVALID_MENU" || issues.length > 0) {
      return { kind: "invalid", issues };
    }
    if (cause.status === 413) return { kind: "tooLarge" };
    if (cause.status === 429) return { kind: "rateLimited" };
    if (cause.code === "NETWORK_ERROR" || cause.code === "TIMEOUT") {
      return { kind: "network" };
    }
  }
  return { kind: "error" };
}

export function useMenuData(onLoaded: (snapshot: MenuSnapshot) => void) {
  const [loadState, setLoadState] = useState<LoadState>("loading");
  const [attempt, setAttempt] = useState(0);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>("idle");
  const [savedAt, setSavedAt] = useState<Date | null>(null);
  const [warnings, setWarnings] = useState<MenuIssue[]>([]);
  const [conflict, setConflict] = useState(false);
  const [sessionExpired, setSessionExpired] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isReloading, setIsReloading] = useState(false);

  const etagRef = useRef<string | null>(null);
  const busyRef = useRef(false);

  const track = useCallback((snapshot: MenuSnapshot) => {
    etagRef.current = snapshot.etag;
    setWarnings(snapshot.warnings);
    setConflict(false);
  }, []);

  useEffect(() => {
    let active = true;
    loadMenu()
      .then((snapshot) => {
        if (!active) return;
        track(snapshot);
        onLoaded(snapshot);
        setLoadState("ready");
      })
      .catch((cause: unknown) => {
        if (!active) return;
        reportError(cause, { feature: FEATURE, operation: "menu load" });
        setLoadState("error");
      });
    return () => {
      active = false;
    };
  }, [attempt, track, onLoaded]);

  useEffect(() => onSessionExpired(() => setSessionExpired(true)), []);

  const retryLoad = useCallback(() => {
    setLoadState("loading");
    setAttempt((current) => current + 1);
  }, []);

  const reload = useCallback(async (): Promise<boolean> => {
    setIsReloading(true);
    try {
      const snapshot = await loadMenu();
      track(snapshot);
      onLoaded(snapshot);
      setSaveStatus("idle");
      return true;
    } catch (cause: unknown) {
      reportError(cause, { feature: FEATURE, operation: "menu reload" });
      return false;
    } finally {
      setIsReloading(false);
    }
  }, [onLoaded, track]);

  const persist = useCallback(
    async (draft: MenuDraft): Promise<PersistResult> => {
      if (busyRef.current) return { ok: false, kind: "busy" };
      const etag = etagRef.current;
      if (etag === null) return { ok: false, kind: "error" };

      busyRef.current = true;
      setIsSaving(true);
      setSaveStatus("saving");
      try {
        const snapshot = await saveMenu(draft, etag);
        track(snapshot);
        setSaveStatus("saved");
        setSavedAt(new Date());
        window.dispatchEvent(new Event(MENU_CHANGED_EVENT));
        return { ok: true, snapshot };
      } catch (cause: unknown) {
        setSaveStatus("error");
        const failure = classify(cause);
        if (failure.kind === "conflict") setConflict(true);
        if (!EXPECTED.has(failure.kind)) {
          reportError(cause, { feature: FEATURE, operation: "menu save" });
        }
        return { ok: false, ...failure };
      } finally {
        busyRef.current = false;
        setIsSaving(false);
      }
    },
    [track]
  );

  const markSaveError = useCallback(() => setSaveStatus("error"), []);
  const dismissConflict = useCallback(() => setConflict(false), []);

  return {
    loadState,
    retryLoad,
    isSaving,
    isReloading,
    saveStatus,
    savedAt,
    warnings,
    conflict,
    sessionExpired,
    reload,
    persist,
    markSaveError,
    dismissConflict,
  };
}

export type MenuDataState = ReturnType<typeof useMenuData>;
