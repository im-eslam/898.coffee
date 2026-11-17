import { createContext, use, type ReactNode } from "react";
import type { MenuDraft } from "../types/draft";
import { useMenu, type MenuApi } from "./use-menu";

const MenuContext = createContext<MenuApi | null>(null);

export function MenuProvider({ children }: { children: ReactNode }) {
  const menu = useMenu();
  return <MenuContext value={menu}>{children}</MenuContext>;
}

export function useMenuContext(): MenuApi {
  const menu = use(MenuContext);
  if (!menu) throw new Error("useMenuContext must be used inside MenuProvider");
  return menu;
}

export type LoadedMenuApi = MenuApi & { draft: MenuDraft };

export function useLoadedMenu(): LoadedMenuApi {
  const menu = useMenuContext();
  if (!menu.draft) throw new Error("The menu draft is not loaded yet");
  return { ...menu, draft: menu.draft };
}
