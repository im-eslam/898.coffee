import type { Localized } from "@/shared/i18n";

export function localizedLabel(name: Localized<string>, fallback: string) {
  return name.en.trim() || name.ar.trim() || fallback;
}
