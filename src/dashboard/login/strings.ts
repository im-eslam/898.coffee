import type { Localized } from "@/shared/i18n";
import type { AuthError } from "../models";

const en = {
  title: "Sign in",
  description: "Enter your admin credentials to continue.",
  username: "Username",
  password: "Password",
  show: "Show",
  hide: "Hide",
  submit: "Sign in",
  submitting: "Signing in…",
  missingUsername: "Enter your username.",
  missingPassword: "Enter your password.",
  errors: {
    unauthorized: "Incorrect username or password.",
    rate_limited: "Too many attempts. Wait a few minutes and try again.",
    network: "Can't reach the server. Check your connection and try again.",
    forbidden: "Something went wrong. Please try again.",
    server: "Something went wrong. Please try again.",
    unknown: "Something went wrong. Please try again.",
  } satisfies Record<AuthError, string>,
};

const ar: typeof en = {
  title: "تسجيل الدخول",
  description: "أدخل بيانات حساب المسؤول للمتابعة.",
  username: "اسم المستخدم",
  password: "كلمة المرور",
  show: "إظهار",
  hide: "إخفاء",
  submit: "تسجيل الدخول",
  submitting: "جارٍ تسجيل الدخول…",
  missingUsername: "أدخل اسم المستخدم.",
  missingPassword: "أدخل كلمة المرور.",
  errors: {
    unauthorized: "اسم المستخدم أو كلمة المرور غير صحيحة.",
    rate_limited: "محاولات كثيرة. انتظر بضع دقائق ثم حاول مرة أخرى.",
    network: "تعذر الوصول إلى الخادم. تحقق من اتصالك وحاول مرة أخرى.",
    forbidden: "حدث خطأ. يرجى المحاولة مرة أخرى.",
    server: "حدث خطأ. يرجى المحاولة مرة أخرى.",
    unknown: "حدث خطأ. يرجى المحاولة مرة أخرى.",
  },
};

export const strings: Localized<typeof en> = { en, ar };
