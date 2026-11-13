import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { ApiError } from "@/shared/api";
import { useStrings } from "@/shared/i18n";
import { reportError } from "@/shared/logging";
import { deleteReviews } from "../api";
import { config, errorMessage } from "../strings";

export const MAX_DELETE_BATCH = 100;

interface Options {
  visibleIds: number[];
  onDeleted: (ids: number[]) => void;
}

export function useReviewSelection({ visibleIds, onDeleted }: Options) {
  const m = useStrings(config.messages);

  const [selected, setSelected] = useState<number[]>([]);
  const [confirmIds, setConfirmIds] = useState<number[] | null>(null);
  const [deleting, setDeleting] = useState(false);

  const visibleKey = visibleIds.join(",");

  useEffect(() => {
    const visible = new Set(
      visibleKey === "" ? [] : visibleKey.split(",").map(Number)
    );
    setSelected((current) => current.filter((id) => visible.has(id)));
  }, [visibleKey]);

  const allVisibleSelected =
    visibleIds.length > 0 && visibleIds.every((id) => selected.includes(id));
  const someVisibleSelected = visibleIds.some((id) => selected.includes(id));

  function toggleOne(id: number) {
    setSelected((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id]
    );
  }

  function toggleAllVisible() {
    setSelected((current) =>
      allVisibleSelected
        ? current.filter((id) => !visibleIds.includes(id))
        : [...new Set([...current, ...visibleIds])]
    );
  }

  function clearSelection() {
    setSelected([]);
  }

  async function deleteIds(ids: number[]): Promise<boolean> {
    if (ids.length === 0 || ids.length > MAX_DELETE_BATCH) return false;
    setDeleting(true);
    try {
      await deleteReviews(ids);
      toast.success(m.deleted);
      setSelected((current) => current.filter((id) => !ids.includes(id)));
      onDeleted(ids);
      return true;
    } catch (cause: unknown) {
      reportError(cause, { feature: "dashboard", operation: "reviews delete" });
      toast.error(
        errorMessage(m, cause instanceof ApiError ? cause.code : undefined)
      );
      return false;
    } finally {
      setDeleting(false);
    }
  }

  function askBulkDelete(ids: number[]) {
    if (ids.length === 0) return;
    if (ids.length > MAX_DELETE_BATCH) {
      toast.error(m.limit);
      return;
    }
    setConfirmIds(ids);
  }

  async function confirmBulkDelete() {
    if (!confirmIds) return;
    const ok = await deleteIds(confirmIds);
    if (ok) setConfirmIds(null);
  }

  function cancelBulkDelete() {
    if (!deleting) setConfirmIds(null);
  }

  return {
    selected,
    selectedCount: selected.length,
    toggleOne,
    toggleAllVisible,
    allVisibleSelected,
    someVisibleSelected,
    clearSelection,
    deleteIds,
    askBulkDelete,
    confirmIds,
    confirmBulkDelete,
    cancelBulkDelete,
    deleting,
  };
}
