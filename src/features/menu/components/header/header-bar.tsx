import { Button } from "react-aria-components";
import mark from "@/assets/mark.svg";
import { Icon } from "@/shared/icons";
import { Link } from "@/shared/router";
import type { AppRoute } from "@/shared/router";

interface HeaderBarStrings {
  back: string;
  search: string;
  languageName: string;
  languageLang: string;
}

interface HeaderBarProps {
  strings: HeaderBarStrings;
  backHref: AppRoute;
  onSearch: () => void;
  onLanguageChange: () => void;
  className?: string;
}

const styles = {
  row: "mx-auto flex h-14 w-full max-w-5xl items-center gap-1 ps-4 pe-2 md:ps-6 md:pe-4",
  back: "-ms-3 flex size-12 shrink-0 items-center justify-center rounded-full text-charcoal transition-colors duration-(--duration-interactive) ease-smooth hover:bg-sand/40 active:bg-sand/60 motion-reduce:transition-none",
  backIcon: "size-5 rotate-180 rtl:rotate-0",
  brand: "flex min-w-0 items-center",
  logo: "h-7 w-auto",
  spacer: "flex-1",
  search:
    "flex size-12 shrink-0 items-center justify-center rounded-full text-charcoal transition-colors duration-(--duration-interactive) ease-smooth data-hovered:bg-sand/40 data-pressed:bg-sand/60 motion-reduce:transition-none",
  icon: "size-5",
  language: "group flex h-12 shrink-0 items-center justify-center rounded-full",
  languageSurface:
    "flex h-10 min-w-12 items-center justify-center rounded-full border border-sand bg-white/60 px-3.5 text-small font-bold text-charcoal transition-[transform,background-color,border-color] duration-(--duration-interactive) ease-smooth group-data-hovered:border-taupe group-data-hovered:bg-white group-data-pressed:scale-[0.97] motion-reduce:transition-none",
} as const;

export function HeaderBar({
  strings: s,
  backHref,
  onSearch,
  onLanguageChange,
  className,
}: HeaderBarProps) {
  return (
    <div className={`${styles.row} ${className ?? ""}`}>
      <Link href={backHref} className={styles.back}>
        <Icon name="arrow" className={styles.backIcon} />
        <span className="sr-only">{s.back}</span>
      </Link>

      <div className={styles.brand}>
        <img
          src={mark}
          alt=""
          decoding="async"
          draggable={false}
          className={styles.logo}
        />
      </div>

      <div className={styles.spacer} />

      <Button
        type="button"
        aria-label={s.search}
        onPress={onSearch}
        className={styles.search}
      >
        <Icon name="search" className={styles.icon} />
      </Button>

      <Button
        type="button"
        onPress={onLanguageChange}
        className={styles.language}
      >
        <span lang={s.languageLang} className={styles.languageSurface}>
          {s.languageName}
        </span>
      </Button>
    </div>
  );
}
