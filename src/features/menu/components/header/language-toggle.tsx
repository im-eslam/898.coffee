import { Button } from "react-aria-components";
import { setLocale, useLocale } from "@/shared/i18n";

interface LanguageToggleProps {
  className?: string;
}

const styles = {
  button:
    "group flex size-12 shrink-0 items-center justify-center rounded-full outline-none data-focus-visible:ring-2 data-focus-visible:ring-brand",
  surface:
    "flex h-9 items-center gap-1 rounded-full border border-navy/20 bg-transparent px-3 text-small font-bold text-navy transition-colors duration-interactive ease-smooth group-data-hovered:bg-navy/5 group-data-pressed:scale-95 motion-reduce:transition-none",
  on: "text-brand",
  off: "text-navy/45",
  divider: "text-navy/30",
} as const;

export function LanguageToggle({ className }: LanguageToggleProps) {
  const locale = useLocale();

  return (
    <Button
      onPress={() => setLocale(locale === "en" ? "ar" : "en")}
      className={[styles.button, className].filter(Boolean).join(" ")}
    >
      <span dir="ltr" className={styles.surface}>
        <span lang="en" className={locale === "en" ? styles.on : styles.off}>
          EN
        </span>
        <span aria-hidden="true" className={styles.divider}>
          |
        </span>
        <span lang="ar" className={locale === "ar" ? styles.on : styles.off}>
          ع
        </span>
      </span>
    </Button>
  );
}
