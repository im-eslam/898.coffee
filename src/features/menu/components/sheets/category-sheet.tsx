import { Button } from "react-aria-components";
import type { Locale } from "@/shared/i18n";
import type { Category } from "../../types/menu";
import { BottomSheet } from "./bottom-sheet";

interface CategorySheetStrings {
  close: string;
  categories: string;
  categoriesDescription: string;
}

interface CategorySheetProps {
  strings: CategorySheetStrings;
  locale: Locale;
  isOpen: boolean;
  categories: Category[];
  activeId: string;
  onClose: () => void;
  onPick: (categoryId: string) => void;
}

const styles = {
  list: "flex flex-col gap-1",
  item: "flex min-h-12 w-full items-center justify-between gap-3 rounded-md px-3 py-2 text-start outline-none data-focus-visible:-outline-offset-2 data-focus-visible:outline-2 data-focus-visible:outline-brand data-hovered:bg-mist/60 data-pressed:bg-mist",
  itemActive: "bg-arctic",
  name: "min-w-0 text-body text-balance",
  nameActive: "font-semibold",
  nameIdle: "font-medium",
  count: "shrink-0 text-caption font-medium tabular-nums text-navy/65",
} as const;

export function CategorySheet({
  strings: s,
  locale,
  isOpen,
  categories,
  activeId,
  onClose,
  onPick,
}: CategorySheetProps) {
  return (
    <BottomSheet
      isOpen={isOpen}
      onClose={onClose}
      strings={{
        title: s.categories,
        description: s.categoriesDescription,
      }}
    >
      <div className={styles.list}>
        {categories.map((category) => {
          const active = category.id === activeId;

          return (
            <Button
              key={category.id}
              type="button"
              aria-current={active ? "true" : undefined}
              onPress={() => onPick(category.id)}
              className={`${styles.item} ${active ? styles.itemActive : ""}`}
            >
              <span
                className={`${styles.name} ${
                  active ? styles.nameActive : styles.nameIdle
                }`}
              >
                {category.name[locale]}
              </span>
              <span className={styles.count}>{category.products.length}</span>
            </Button>
          );
        })}
      </div>
    </BottomSheet>
  );
}
