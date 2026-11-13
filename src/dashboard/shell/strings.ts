import type { Localized } from "@/shared/i18n";

const en = {
  appName: "Admin",
  nav: "Main navigation",
  account: {
    logout: "Log out",
    loggingOut: "Logging out…",
  },
  tabs: {
    reviews: "Reviews",
    settings: "Settings",
    menu: "Menu",
  },
  page: {
    loading: "Loading…",
    error: "This page couldn't load.",
    retry: "Try again",
  },
};

const ar: typeof en = {
  appName: "تحكم",
  nav: "التنقل الرئيسي",
  account: {
    logout: "تسجيل الخروج",
    loggingOut: "جارٍ تسجيل الخروج…",
  },
  tabs: {
    reviews: "التقييمات",
    settings: "الإعدادات",
    menu: "القائمة",
  },
  page: {
    loading: "جارٍ التحميل…",
    error: "تعذر تحميل هذه الصفحة.",
    retry: "حاول مرة أخرى",
  },
};

export const strings: Localized<typeof en> = { en, ar };
