import type { Localized } from "@/shared/i18n";

const en = {
  loading: "Loading…",
  sessionError: "We couldn't check your sign-in. Check your connection and try again.",
  retry: "Try again",
};

const ar: typeof en = {
  loading: "جارٍ التحميل…",
  sessionError: "تعذر التحقق من تسجيل دخولك. تحقق من اتصالك وحاول مرة أخرى.",
  retry: "حاول مرة أخرى",
};

export const strings: Localized<typeof en> = { en, ar };
