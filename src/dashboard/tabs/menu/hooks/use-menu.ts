import { useCallback, useMemo, useState } from "react";
import { useStrings } from "@/shared/i18n";
import type { MenuSnapshot } from "../api/menu";
import { MenuDraftParser } from "../api/menu-parser";
import type { MenuDraft, MenuIssue } from "../types/draft";
import type { IssueScope, MenuRecipe, MenuStore } from "../types/store";
import { useMenuData } from "./use-data";
import { useMenuAddOns } from "./use-menu-addons";
import { useMenuCategories } from "./use-menu-categories";
import { useMenuPairings } from "./use-menu-pairings";
import { useMenuPopup } from "./use-menu-popup";
import { useMenuProducts } from "./use-menu-products";
import { useMenuSignatures } from "./use-menu-signatures";
import toast from "react-hot-toast";
import { strings, fill } from "../strings";

function serialize(draft: MenuDraft): string {
  return JSON.stringify(MenuDraftParser.toWire(draft));
}

export function useMenu() {
  const s = useStrings(strings);

  const [draft, setDraft] = useState<MenuDraft | null>(null);
  const [baseline, setBaseline] = useState("");
  const [issues, setIssues] = useState<MenuIssue[]>([]);
  const [removedPairings, setRemovedPairings] = useState(0);

  const adopt = useCallback((snapshot: MenuSnapshot) => {
    setDraft(snapshot.menu);
    setBaseline(serialize(snapshot.menu));
    setIssues([]);
    setRemovedPairings(0);
  }, []);

  const data = useMenuData(adopt);
  const { reload: reloadData, persist, markSaveError } = data;

  const isDirty = useMemo(
    () => draft !== null && serialize(draft) !== baseline,
    [draft, baseline]
  );

  const update = useCallback((recipe: MenuRecipe, scope?: IssueScope) => {
    setDraft((current) => (current ? recipe(current) : current));
    if (scope === true) {
      setIssues([]);
    } else if (scope) {
      setIssues((current) =>
        current.filter((issue) => !issue.path.startsWith(scope))
      );
    }
  }, []);

  const reportRemovedPairings = useCallback((count: number) => {
    if (count > 0) setRemovedPairings((current) => current + count);
  }, []);

  const store: MenuStore = useMemo(
    () => ({ draft, update, reportRemovedPairings }),
    [draft, update, reportRemovedPairings]
  );

  const products = useMenuProducts(store);
  const categories = useMenuCategories(store);
  const addOns = useMenuAddOns(store);
  const signatures = useMenuSignatures(store);
  const pairings = useMenuPairings(store);
  const popup = useMenuPopup(store);

  const dismissPairingNotice = useCallback(() => setRemovedPairings(0), []);

  const issuesAt = useCallback(
    (path: string) => issues.filter((issue) => issue.path === path),
    [issues]
  );

  const reload = useCallback(async () => {
    const ok = await reloadData();
    if (!ok) toast.error(s.toast.reloadFailed);
  }, [reloadData, s.toast.reloadFailed]);

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

  const save = useCallback(async () => {
    if (!draft) return;

    if (draft.popup.enabled && !draft.popup.image) {
      setIssues([
        {
          path: "popup.image",
          code: "required",
          message: s.popup.imageRequired,
        },
      ]);
      markSaveError();
      toast.error(s.toast.popupImage);
      return;
    }

    const sent = serialize(draft);
    setIssues([]);
    const result = await persist(draft);

    if (result.ok) {
      setDraft((current) =>
        current && serialize(current) === sent ? result.snapshot.menu : current
      );
      setBaseline(serialize(result.snapshot.menu));
      const count = result.snapshot.warnings.length;
      toast.success(
        count === 0
          ? s.toast.saved
          : count === 1
            ? s.toast.savedWithWarning
            : fill(s.toast.savedWithWarnings, { count })
      );
      return;
    }

    switch (result.kind) {
      case "invalid":
        setIssues(result.issues);
        toast.error(s.toast.invalid);
        break;
      case "network":
        toast.error(s.toast.network);
        break;
      case "tooLarge":
        toast.error(s.toast.tooLarge);
        break;
      case "rateLimited":
        toast.error(s.toast.rateLimited);
        break;
      case "error":
        toast.error(s.toast.saveFailed);
        break;
      default:
        break;
    }
  }, [draft, persist, markSaveError, s]);

  return {
    draft,
    status: {
      loadState: data.loadState,
      isDirty,
      isSaving: data.isSaving,
      isReloading: data.isReloading,
      saveStatus: data.saveStatus,
      savedAt: data.savedAt,
      warnings: data.warnings,
      conflict: data.conflict,
      sessionExpired: data.sessionExpired,
      issues,
      removedPairings,
    },
    issuesAt,
    retryLoad: data.retryLoad,
    save,
    reload,
    keepMine,
    dismissConflict: data.dismissConflict,
    dismissPairingNotice,
    products,
    categories,
    addOns,
    signatures,
    pairings,
    popup,
  };
}

export type MenuApi = ReturnType<typeof useMenu>;
