import type { Localized } from "@/shared/i18n";
import type { FieldProblem, SettingsErrorCode, SettingsFailure } from "./models";

const en = {
  languageTitle: "Language",
  languageDescription: "Choose the language for this dashboard. It changes as soon as you save.",
  languageLabel: "Dashboard language",
  english: "English",
  arabic: "Arabic",
  saveLanguage: "Save language",
  languageSaved: "Language updated.",

  usernameTitle: "Username",
  usernameDescription: "You use your username to sign in.",
  usernameLabel: "New username",
  usernameRules: "3 to 50 characters: lowercase letters, digits, dots, underscores or hyphens.",
  saveUsername: "Save username",
  usernameSaved: "Username updated.",

  passwordTitle: "Password",
  passwordDescription: "Changing your password signs out your other sessions. You stay signed in here.",
  currentPasswordLabel: "Current password",
  newPasswordLabel: "New password",
  newPasswordRules: "10 to 72 bytes. Arabic letters take more bytes than English letters.",
  confirmPasswordLabel: "Confirm new password",
  savePassword: "Save password",
  passwordSaved: "Password updated. Your other sessions have been signed out.",

  show: "Show",
  hide: "Hide",
  saving: "Saving…",
  network: "Can't reach the server. Check your connection and try again.",
  generic: "Something went wrong. Please try again.",
  waitHint: "Try again in {seconds} seconds.",

  problems: {
    usernameMissing: "Enter a new username.",
    usernameLength: "Username must be 3 to 50 characters.",
    usernamePattern: "Use only lowercase letters, digits, dots, underscores or hyphens.",
    usernameUnchanged: "This is already your username.",
    currentMissing: "Enter your current password.",
    currentTooLong: "Current password must be 72 bytes or less.",
    newMissing: "Enter a new password.",
    newLength: "New password must be 10 to 72 bytes.",
    newSameAsCurrent: "New password must be different from your current password.",
    newSameAsUsername: "New password can't be the same as your username.",
    confirmMissing: "Confirm your new password.",
    confirmMismatch: "The new passwords don't match.",
  } satisfies Record<FieldProblem, string>,

  errors: {
    invalid_language: "Choose English or Arabic.",
    invalid_username: "That username isn't allowed. Check the rules and try again.",
    unchanged: "This is already your username.",
    wrong_password: "Your current password is incorrect.",
    username_taken: "That username is already taken.",
    weak_password: "Your new password doesn't meet the rules.",
    same_password: "Your new password must be different from your current password.",
    too_many_attempts: "Too many attempts. Wait a few minutes and try again.",
  } satisfies Record<SettingsErrorCode, string>,
};

const ar: typeof en = {
  languageTitle: "اللغة",
  languageDescription: "اختر لغة هذه اللوحة. يتم التغيير فور الحفظ.",
  languageLabel: "لغة اللوحة",
  english: "English",
  arabic: "العربية",
  saveLanguage: "حفظ اللغة",
  languageSaved: "تم تحديث اللغة.",

  usernameTitle: "اسم المستخدم",
  usernameDescription: "تستخدم اسم المستخدم لتسجيل الدخول.",
  usernameLabel: "اسم المستخدم الجديد",
  usernameRules: "من 3 إلى 50 حرفاً: أحرف إنجليزية صغيرة أو أرقام أو نقطة أو شرطة سفلية أو شرطة.",
  saveUsername: "حفظ اسم المستخدم",
  usernameSaved: "تم تحديث اسم المستخدم.",

  passwordTitle: "كلمة المرور",
  passwordDescription: "عند تغيير كلمة المرور، يتم تسجيل خروج جلساتك الأخرى. ستبقى مسجلاً الدخول هنا.",
  currentPasswordLabel: "كلمة المرور الحالية",
  newPasswordLabel: "كلمة المرور الجديدة",
  newPasswordRules: "من 10 إلى 72 بايت. تأخذ الحروف العربية بايتات أكثر من الحروف الإنجليزية.",
  confirmPasswordLabel: "تأكيد كلمة المرور الجديدة",
  savePassword: "حفظ كلمة المرور",
  passwordSaved: "تم تحديث كلمة المرور. تم تسجيل خروج جلساتك الأخرى.",

  show: "إظهار",
  hide: "إخفاء",
  saving: "جارٍ الحفظ…",
  network: "تعذر الوصول إلى الخادم. تحقق من اتصالك وحاول مرة أخرى.",
  generic: "حدث خطأ. يرجى المحاولة مرة أخرى.",
  waitHint: "حاول مرة أخرى بعد {seconds} ثانية.",

  problems: {
    usernameMissing: "أدخل اسم مستخدم جديداً.",
    usernameLength: "يجب أن يكون اسم المستخدم من 3 إلى 50 حرفاً.",
    usernamePattern: "استخدم أحرفاً إنجليزية صغيرة أو أرقاماً أو نقطة أو شرطة سفلية أو شرطة فقط.",
    usernameUnchanged: "هذا هو اسم المستخدم الحالي لديك.",
    currentMissing: "أدخل كلمة المرور الحالية.",
    currentTooLong: "يجب ألا تتجاوز كلمة المرور الحالية 72 بايت.",
    newMissing: "أدخل كلمة مرور جديدة.",
    newLength: "يجب أن تكون كلمة المرور الجديدة من 10 إلى 72 بايت.",
    newSameAsCurrent: "يجب أن تختلف كلمة المرور الجديدة عن الحالية.",
    newSameAsUsername: "لا يمكن أن تكون كلمة المرور الجديدة مطابقة لاسم المستخدم.",
    confirmMissing: "أكد كلمة المرور الجديدة.",
    confirmMismatch: "كلمتا المرور الجديدتان غير متطابقتين.",
  },

  errors: {
    invalid_language: "اختر الإنجليزية أو العربية.",
    invalid_username: "اسم المستخدم غير مسموح. راجع الشروط وحاول مرة أخرى.",
    unchanged: "هذا هو اسم المستخدم الحالي لديك.",
    wrong_password: "كلمة المرور الحالية غير صحيحة.",
    username_taken: "اسم المستخدم هذا مستخدم بالفعل.",
    weak_password: "كلمة المرور الجديدة لا تستوفي الشروط.",
    same_password: "يجب أن تختلف كلمة المرور الجديدة عن الحالية.",
    too_many_attempts: "محاولات كثيرة. انتظر بضع دقائق ثم حاول مرة أخرى.",
  },
};

export type SettingsStrings = typeof en;

export const strings: Localized<typeof en> = { en, ar };

export function failureMessage(s: SettingsStrings, failure: SettingsFailure): string {
  if (failure.kind === "network") return s.network;
  if (failure.kind === "generic") return s.generic;

  const message = s.errors[failure.code];
  if (failure.retryAfter === undefined) return message;
  return `${message} ${s.waitHint.replace("{seconds}", String(failure.retryAfter))}`;
}
