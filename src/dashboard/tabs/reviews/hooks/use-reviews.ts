import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { ApiError } from "@/shared/api";
import { useStrings } from "@/shared/i18n";
import { reportError } from "@/shared/logging";
import { listReviews, type Review } from "../api";
import { config, errorMessage } from "../strings";

const PAGE_SIZE = 20;
const SEARCH_DEBOUNCE_MS = 300;

interface ListState {
  items: Review[];
  total: number;
  totalPages: number;
  page: number;
}

const EMPTY_LIST: ListState = { items: [], total: 0, totalPages: 1, page: 1 };

export function useReviews() {
  const m = useStrings(config.messages);

  const [page, setPage] = useState(1);
  const [q, setQ] = useState("");
  const [debouncedQ, setDebouncedQ] = useState("");
  const [list, setList] = useState<ListState>(EMPTY_LIST);
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);
  const requestId = useRef(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQ(q.trim());
      setPage(1);
    }, SEARCH_DEBOUNCE_MS);
    return () => clearTimeout(timer);
  }, [q]);

  useEffect(() => {
    const id = ++requestId.current;
    setLoading(true);

    listReviews({ page, perPage: PAGE_SIZE, q: debouncedQ })
      .then((res) => {
        if (id !== requestId.current) return;
        setFailed(false);
        setList({
          items: res.items,
          total: res.total,
          totalPages: res.total_pages,
          page: res.page,
        });
        if (res.page !== page) setPage(res.page);
      })
      .catch((cause: unknown) => {
        if (id !== requestId.current) return;
        setFailed(true);
        reportError(cause, { feature: "dashboard", operation: "reviews load" });
        toast.error(
          errorMessage(m, cause instanceof ApiError ? cause.code : undefined)
        );
      })
      .finally(() => {
        if (id === requestId.current) setLoading(false);
      });
  }, [page, debouncedQ, reloadKey, m]);

  return {
    items: list.items,
    total: list.total,
    totalPages: list.totalPages,
    page: list.page,
    loading,
    failed,
    q,
    setQ,
    setPage,
    refresh: () => setReloadKey((key) => key + 1),
  };
}
