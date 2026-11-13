import { lazy } from "react";
import { ROUTES } from "@/shared/router";
import type { IconName } from "@/shared/icons";

const ReviewsPage = lazy(() =>
  import("./tabs/reviews").then((m) => ({ default: m.ReviewsPage }))
);
const SettingsPage = lazy(() =>
  import("./tabs/settings").then((m) => ({ default: m.SettingsPage }))
);
const MenuPage = lazy(() =>
  import("./tabs/menu").then((m) => ({ default: m.MenuPage }))
);

export const TABS = [
  { key: "reviews", href: ROUTES.dashboardReviews, page: ReviewsPage },
  { key: "settings", href: ROUTES.dashboardSettings, page: SettingsPage },
  { key: "menu", href: ROUTES.dashboardMenu, page: MenuPage },
] as const;

export type TabKey = (typeof TABS)[number]["key"];
export type NavTab = Pick<(typeof TABS)[number], "key" | "href">;

export const NAV_ICONS: Record<TabKey, IconName> = {
  reviews: "star",
  settings: "settings",
  menu: "cup",
};

export const DEFAULT_TAB = TABS[0];

export function findTab(path: string) {
  return TABS.find((tab) => tab.href === path);
}
