import { Button } from "react-aria-components";
import { useLocale, useStrings } from "@/shared/i18n";
import type { Category } from "@/features/menu/types/menu-models";
import { strings } from "@/features/menu/strings";
import { BottomSheet } from "../ui/bottom-sheet";

interface CategoryPickerSheetProps {
  isOpen: boolean;
  categories: Category[];
  activeId: string;
  onClose: () => void;
  onPick: (categoryId: string) => void;
}

const styles = {
  list: "flex flex-col gap-1",
  item: "flex min-h-12 w-full items-center justify-between gap-3 rounded-md px-3 py-2 text-start outline-none transition duration-interactive ease-smooth data-focus-visible:ring-2 data-focus-visible:ring-brand data-hovered:bg-sand/40 data-pressed:bg-sand/60 motion-reduce:transition-none",
  itemActive: "bg-arctic",
  name: "min-w-0 text-body text-balance",
  nameActive: "font-semibold",
  nameIdle: "font-medium",
  count: "shrink-0 text-caption font-medium tabular-nums text-taupe",
} as const;

export function CategoryPickerSheet({
  isOpen,
  categories,
  activeId,
  onClose,
  onPick,
}: CategoryPickerSheetProps) {
  const t = useStrings(strings);
  const locale = useLocale();

  return (
    <BottomSheet
      isOpen={isOpen}
      title={t.nav.categoriesTitle}
      description={t.nav.categoriesTitle}
      closeLabel={t.common.close}
      onClose={onClose}
    >
      <div className={styles.list}>
        {categories.map((category) => {
          const active = category.id === activeId;
          return (
            <Button
              key={category.id}
              aria-current={active ? "true" : undefined}
              onPress={() => onPick(category.id)}
              className={[styles.item, active && styles.itemActive]
                .filter(Boolean)
                .join(" ")}
            >
              <span
                className={[styles.name, active ? styles.nameActive : styles.nameIdle].join(
                  " ",
                )}
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
