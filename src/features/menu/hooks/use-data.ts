import { useEffect, useState } from "react";
import { reportError } from "@/shared/logging";
import { MenuParser, type Menu } from "@/shared/menu";
import { fetchMenu, getMenuError } from "../api/menu";

export type MenuState =
  | { status: "loading" }
  | { status: "error"; isNetworkError: boolean }
  | { status: "ready"; menu: Menu };

export type MenuResult = MenuState & {
  retry: () => void;
};

let pendingMenuRequest: Promise<Menu> | null = null;
let cachedMenu: Menu | null = null;

function clearMenuCache(): void {
  cachedMenu = null;
  pendingMenuRequest = null;
}

if (typeof window !== "undefined") {
  window.addEventListener("menu:changed", clearMenuCache);
}

export function loadMenu(): Promise<Menu> {
  if (cachedMenu) return Promise.resolve(cachedMenu);
  if (!pendingMenuRequest) {
    pendingMenuRequest = fetchMenu()
      .then((response) => {
        cachedMenu = MenuParser.parse(response);
        return cachedMenu;
      })
      .catch((cause: unknown) => {
        reportError(cause, { feature: "menu", operation: "load" });
        throw cause;
      })
      .finally(() => {
        pendingMenuRequest = null;
      });
  }
  return pendingMenuRequest;
}

export function prefetchMenu(): void {
  loadMenu().catch(() => undefined);
}

export function useData(): MenuResult {
  const [state, setState] = useState<MenuState>(() =>
    cachedMenu ? { status: "ready", menu: cachedMenu } : { status: "loading" }
  );

  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    const refreshMenu = () => {
      clearMenuCache();
      setState({ status: "loading" });
      setAttempt((current) => current + 1);
    };

    const refreshWhenVisible = () => {
      if (document.visibilityState === "visible") refreshMenu();
    };

    window.addEventListener("menu:changed", refreshMenu);
    window.addEventListener("focus", refreshMenu);
    document.addEventListener("visibilitychange", refreshWhenVisible);

    return () => {
      window.removeEventListener("menu:changed", refreshMenu);
      window.removeEventListener("focus", refreshMenu);
      document.removeEventListener("visibilitychange", refreshWhenVisible);
    };
  }, []);

  useEffect(() => {
    if (cachedMenu) return;

    let isActive = true;

    loadMenu()
      .then((menu) => {
        if (isActive) {
          setState({ status: "ready", menu });
        }
      })
      .catch((cause: unknown) => {
        if (!isActive) return;
        const error = getMenuError(cause);
        setState({
          status: "error",
          isNetworkError: error === "network" || error === "timeout",
        });
      });

    return () => {
      isActive = false;
    };
  }, [attempt]);

  function retry() {
    setState({ status: "loading" });
    setAttempt((current) => current + 1);
  }

  return {
    ...state,
    retry,
  };
}
