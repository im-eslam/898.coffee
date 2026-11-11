import { useEffect, useState } from "react";
import { fetchMenu, getMenuError } from "../api/menu";
import { MenuParser } from "../api/menu-parser";
import type { Menu } from "../types/menu-models";

export type MenuState =
  | { status: "loading" }
  | { status: "error"; isNetworkError: boolean }
  | { status: "ready"; menu: Menu };

export type MenuResult = MenuState & {
  retry: () => void;
};

let pendingMenuRequest: Promise<Menu> | null = null;

function loadMenu(): Promise<Menu> {
  if (!pendingMenuRequest) {
    pendingMenuRequest = fetchMenu()
      .then((response) => MenuParser.parse(response))
      .finally(() => {
        pendingMenuRequest = null;
      });
  }

  return pendingMenuRequest;
}

export function useData(): MenuResult {
  const [state, setState] = useState<MenuState>({
    status: "loading",
  });

  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let isActive = true;

    loadMenu()
      .then((menu) => {
        if (isActive) {
          setState({
            status: "ready",
            menu,
          });
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
