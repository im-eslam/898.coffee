export const ROUTES = {
  landing: "/",
  menu: "/menu",
  review: "/review",
  dashboard: "/admin",
  dashboardLogin: "/admin/login",
  dashboardReviews: "/admin/reviews",
  dashboardSettings: "/admin/settings",
  dashboardMenu: "/admin/menu",
} as const;

export type AppRoute = (typeof ROUTES)[keyof typeof ROUTES];
