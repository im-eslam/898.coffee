import { createContext, use, type ReactNode } from "react";
import { useMenu, type MenuApi } from "./use-menu";

const MenuDraftContext = createContext<MenuApi | null>(null);

export function MenuDraftProvider({ children }: { children: ReactNode }) {
  const menu = useMenu();
  return <MenuDraftContext value={menu}>{children}</MenuDraftContext>;
}

export function useDraft(): MenuApi {
  const menu = use(MenuDraftContext);
  if (!menu) throw new Error("useDraft must be used inside MenuDraftProvider");
  return menu;
}

/** Same as useDraft, but the draft is guaranteed to be loaded. */
export function useLoadedDraft() {
  const menu = useDraft();
  if (!menu.draft) throw new Error("The menu draft is not loaded yet");
  return { ...menu, draft: menu.draft };
}
