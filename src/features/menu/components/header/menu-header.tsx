import mark from "@/assets/mark.svg";
import { Button } from "react-aria-components";
import { useStrings } from "@/shared/i18n";
import { Icon } from "@/shared/icons";
import { Link, ROUTES } from "@/shared/router";
import { strings } from "@/features/menu/strings";
import {
  CategoryNavigation,
  type NavSection,
} from "../navigation/category-navigation";
import { LanguageToggle } from "./language-toggle";

interface MenuHeaderProps {
  sections: NavSection[];
  activeId: string;
  onSelect: (id: string) => void;
  onSearch: () => void;
  onCategories: () => void;
}

const styles = {
  header: "sticky top-0 z-30 border-b border-arctic bg-cream",
  topRow:
    "mx-auto flex h-14 w-full max-w-5xl items-center gap-1 ps-2 pe-2 md:ps-4 md:pe-4",
  iconButton:
    "flex size-12 shrink-0 items-center justify-center rounded-full outline-none transition-colors duration-interactive ease-smooth data-hovered:bg-sand/40 data-pressed:bg-sand/60 data-focus-visible:ring-2 data-focus-visible:ring-brand motion-reduce:transition-none",
  icon: "size-6",
  backIconFlip: "flex scale-x-[-1]",
  logo: "h-7 w-auto",
  spacer: "flex-1",
  pillRow: "mx-auto flex h-12 w-full max-w-5xl items-center",
  menuSlot: "shrink-0 ps-1 md:ps-3",
} as const;

export function MenuHeader({
  sections,
  activeId,
  onSelect,
  onSearch,
  onCategories,
}: MenuHeaderProps) {
  const t = useStrings(strings);

  return (
    <header className={styles.header}>
      <div className={styles.topRow}>
        <Link href={ROUTES.landing} className={styles.iconButton}>
          <span className="sr-only">{t.common.back}</span>
          <span aria-hidden="true" className={styles.backIconFlip}>
            <Icon name="arrow" className={styles.icon} />
          </span>
        </Link>

        <img src={mark} alt="" className={styles.logo} />

        <div className={styles.spacer} />

        <Button
          aria-label={t.header.searchLabel}
          onPress={onSearch}
          className={styles.iconButton}
        >
          <Icon name="search" className={styles.icon} />
        </Button>

        <LanguageToggle />
      </div>

      <div className={styles.pillRow}>
        <div className={styles.menuSlot}>
          <Button
            aria-label={t.header.categoriesLabel}
            onPress={onCategories}
            className={styles.iconButton}
          >
            <Icon name="menu" className={styles.icon} />
          </Button>
        </div>

        <CategoryNavigation
          sections={sections}
          activeId={activeId}
          onSelect={onSelect}
        />
      </div>
    </header>
  );
}
