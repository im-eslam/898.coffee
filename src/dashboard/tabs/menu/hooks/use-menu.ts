import { useCallback, useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { ApiError } from "@/shared/api";
import { useStrings } from "@/shared/i18n";
import { getIssues, loadMenu, saveMenu, type MenuSnapshot } from "../api/api";
import { MenuDraftParser } from "../api/menu-parser";
import { fill, strings } from "../strings";
import type { MenuDraft, MenuIssue } from "../types/draft";
import type { SaveStatus } from "../types/ui";

type LoadState = "loading" | "ready" | "error";

function serialize(draft: MenuDraft): string {
  return JSON.stringify(MenuDraftParser.toWire(draft));
}

export function useMenu() {
  const s = useStrings(strings);
  const [draft, setDraft] = useState<MenuDraft | null>(null);
  const [baseline, setBaseline] = useState("");
  const [etag, setEtag] = useState("");
  const [loadState, setLoadState] = useState<LoadState>("loading");
  const [reloading, setReloading] = useState(false);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>("idle");
  const [savedAt, setSavedAt] = useState<Date | null>(null);
  const [warnings, setWarnings] = useState<MenuIssue[]>([]);
  const [issues, setIssues] = useState<MenuIssue[]>([]);
  const [conflict, setConflict] = useState(false);
  const [sessionExpired, setSessionExpired] = useState(false);
  const [removedPairings, setRemovedPairings] = useState(0);

  const adopt = useCallback((snapshot: MenuSnapshot) => {
    setDraft(snapshot.menu);
    setBaseline(serialize(snapshot.menu));
    setEtag(snapshot.etag);
    setIssues([]);
    setRemovedPairings(0);
  }, []);

  useEffect(() => {
    let cancelled = false;
    loadMenu()
      .then((snapshot) => {
        if (cancelled) return;
        adopt(snapshot);
        setLoadState("ready");
      })
      .catch(() => {
        if (!cancelled) setLoadState("error");
      });
    return () => {
      cancelled = true;
    };
  }, [adopt]);

  const isDirty = useMemo(
    () => draft !== null && serialize(draft) !== baseline,
    [draft, baseline]
  );

  const retryLoad = useCallback(() => {
    setLoadState("loading");
    loadMenu()
      .then((snapshot) => {
        adopt(snapshot);
        setLoadState("ready");
      })
      .catch(() => setLoadState("error"));
  }, [adopt]);

  const reload = useCallback(async () => {
    setReloading(true);
    try {
      const snapshot = await loadMenu();
      adopt(snapshot);
      setSaveStatus("idle");
      setConflict(false);
    } catch {
      toast.error(s.toast.reloadFailed);
    } finally {
      setReloading(false);
    }
  }, [adopt, s.toast.reloadFailed]);

  const keepMine = useCallback(async () => {
    if (!draft) return;
    try {
      await navigator.clipboard.writeText(
        JSON.stringify(MenuDraftParser.toWire(draft), null, 2)
      );
      toast.success(s.toast.copied);
    } catch {
      toast.error(s.toast.copyFailed);
      return;
    }
    await reload();
  }, [draft, reload, s.toast.copied, s.toast.copyFailed]);

  const dismissConflict = useCallback(() => setConflict(false), []);

  const update = useCallback(
    (recipe: (current: MenuDraft) => MenuDraft, clear?: string | true) => {
      setDraft((current) => (current ? recipe(current) : current));
      if (clear === true) {
        setIssues([]);
      } else if (clear) {
        setIssues((current) =>
          current.filter((issue) => !issue.path.startsWith(clear))
        );
      }
    },
    []
  );

  const removeProduct = useCallback((productUid: string) => {
    setDraft((current) => {
      if (!current) return current;
      let productId = "";
      const categories = current.categories.map((category) => ({
        ...category,
        products: category.products.filter((product) => {
          if (product.uid !== productUid) return true;
          productId = product.id;
          return false;
        }),
      }));
      const pairings = productId
        ? current.pairings.filter(
            (pairing) => !pairing.items.includes(productId)
          )
        : current.pairings;
      const removed = current.pairings.length - pairings.length;
      if (removed > 0) setRemovedPairings((count) => count + removed);
      return { ...current, categories, pairings };
    });
    setIssues([]);
  }, []);

  const dismissPairingNotice = useCallback(() => setRemovedPairings(0), []);

  const save = useCallback(async () => {
    if (!draft || saveStatus === "saving") return;

    if (draft.popup.enabled && !draft.popup.image) {
      setIssues([
        {
          path: "popup.image",
          code: "required",
          message: s.popup.imageRequired,
        },
      ]);
      setSaveStatus("error");
      toast.error(s.toast.popupImage);
      return;
    }

    setSaveStatus("saving");
    setIssues([]);
    try {
      const snapshot = await saveMenu(draft, etag);
      adopt(snapshot);
      setWarnings(snapshot.warnings);
      setSavedAt(new Date());
      setSaveStatus("saved");
      const count = snapshot.warnings.length;
      toast.success(
        count === 0
          ? s.toast.saved
          : count === 1
            ? s.toast.savedWithWarning
            : fill(s.toast.savedWithWarnings, { count })
      );
    } catch (cause) {
      setSaveStatus("error");
      if (cause instanceof ApiError && cause.status === 412) {
        setConflict(true);
      } else if (cause instanceof ApiError && cause.status === 401) {
        setSessionExpired(true);
      } else if (cause instanceof ApiError && cause.code === "INVALID_MENU") {
        setIssues(getIssues(cause));
        toast.error(s.toast.invalid);
      } else {
        toast.error(s.toast.saveFailed);
      }
    }
  }, [adopt, draft, etag, s, saveStatus]);

  const issuesAt = useCallback(
    (path: string) => issues.filter((issue) => issue.path === path),
    [issues]
  );

  return {
    draft,
    loadState,
    retryLoad,
    isDirty,
    isSaving: saveStatus === "saving",
    isReloading: reloading,
    saveStatus,
    savedAt,
    warnings,
    issues,
    issuesAt,
    conflict,
    sessionExpired,
    removedPairings,
    dismissPairingNotice,
    update,
    removeProduct,
    save,
    reload,
    keepMine,
    dismissConflict,
  };
}

export type MenuApi = ReturnType<typeof useMenu>;
