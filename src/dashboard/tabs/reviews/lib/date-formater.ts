import type { Locale } from "@/shared/i18n";

export function formatCreatedAt(createdAt: string, locale: Locale): string {
  const date = new Date(createdAt.replace(" ", "T"));
  if (Number.isNaN(date.getTime())) return createdAt;
  return new Intl.DateTimeFormat(locale === "ar" ? "ar-EG" : "en-GB", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}
