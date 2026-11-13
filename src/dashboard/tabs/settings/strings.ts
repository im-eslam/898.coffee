import type { Localized } from "@/shared/i18n";

export const config = {
  messages: {
    en: {
      unknown: "Something went wrong. Please try again.",
      mismatch: "The new passwords don't match.",
      saved: {
        language: "Language updated",
        username: "Username updated",
        password: "Password updated",
      },
      errors: {
        invalid_username:
          "That username isn't allowed. Check the rules and try again.",
        unchanged: "This is already your username.",
        username_taken: "That username is already taken.",
        wrong_password: "Your current password is incorrect.",
        weak_password: "Your new password doesn't meet the rules.",
        same_password:
          "Your new password must be different from your current password.",
        too_many_attempts:
          "Too many attempts. Wait a few minutes and try again.",
      },
    },
    ar: {
      unknown: "حدث خطأ. حاول مرة أخرى.",
      mismatch: "كلمتا المرور الجديدتان غير متطابقتين.",
      saved: {
        language: "تم تحديث اللغة",
        username: "تم تحديث اسم المستخدم",
        password: "تم تحديث كلمة المرور",
      },
      errors: {
        invalid_username: "اسم المستخدم غير مسموح. راجع الشروط وحاول مرة أخرى.",
        unchanged: "هذا هو اسم المستخدم الحالي لديك.",
        username_taken: "اسم المستخدم هذا مستخدم بالفعل.",
        wrong_password: "كلمة المرور الحالية غير صحيحة.",
        weak_password: "كلمة المرور الجديدة لا تستوفي الشروط.",
        same_password: "يجب أن تختلف كلمة المرور الجديدة عن الحالية.",
        too_many_attempts: "محاولات كثيرة. انتظر بضع دقائق ثم حاول مرة أخرى.",
      },
    },
  },
};

type Messages = (typeof config.messages)["en"];

export function errorMessage(m: Messages, code?: string): string {
  return code && code in m.errors
    ? m.errors[code as keyof Messages["errors"]]
    : m.unknown;
}

const en = {
  common: {
    save: "Save",
    saving: "Saving…",
  },
  language: {
    title: "Language",
    label: "Dashboard language",
    english: "English",
    arabic: "Arabic",
  },
  username: {
    title: "Username",
    label: "Username",
    currentPassword: "Current password",
  },
  password: {
    title: "Password",
    note: "Changing your password signs out your other sessions.",
    current: "Current password",
    new: "New password",
    confirm: "Confirm new password",
  },
};

const ar: typeof en = {
  common: {
    save: "حفظ",
    saving: "جارٍ الحفظ…",
  },
  language: {
    title: "اللغة",
    label: "لغة اللوحة",
    english: "English",
    arabic: "العربية",
  },
  username: {
    title: "اسم المستخدم",
    label: "اسم المستخدم",
    currentPassword: "كلمة المرور الحالية",
  },
  password: {
    title: "كلمة المرور",
    note: "تغيير كلمة المرور يسجل خروج جلساتك الأخرى.",
    current: "كلمة المرور الحالية",
    new: "كلمة المرور الجديدة",
    confirm: "تأكيد كلمة المرور الجديدة",
  },
};

export const strings: Localized<typeof en> = { en, ar };
