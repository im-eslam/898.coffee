import { Button } from "react-aria-components";
import { useLocale, useStrings } from "@/shared/i18n";
import { strings } from "../../strings";
import type { Category } from "../../types/menu-models";
import { cx, focusRingInset, SheetTitle } from "../ui";
import { BottomSheet } from "./bottom-sheet";

interface Props {
  isOpen: boolean;
  categories: Category[];
  activeId: string;
  onClose: () => void;
  onPick: (categoryId: string) => void;
}

const styles = {
  title: "flex min-h-12 items-center px-4",
  list: "flex flex-col gap-1 px-4 pt-4",
  item: cx(
    "flex min-h-12 w-full items-center justify-between gap-3 rounded-md px-3 py-2 text-start",
    focusRingInset
  ),
  itemActive: "bg-arctic",
  itemIdle: "data-hovered:bg-mist/60 data-pressed:bg-mist",
  name: "min-w-0 text-body text-balance",
  nameActive: "font-semibold",
  nameIdle: "font-medium",
  count: "shrink-0 text-caption font-medium tabular-nums text-navy/65",
} as const;

export function CategorySheet({
  isOpen,
  categories,
  activeId,
  onClose,
  onPick,
}: Props) {
  const t = useStrings(strings);
  const locale = useLocale();

  return (
    <BottomSheet isOpen={isOpen} label={t.categoriesTitle} onClose={onClose}>
      <div className={styles.title}>
        <SheetTitle>{t.categoriesTitle}</SheetTitle>
      </div>
      <div className={styles.list}>
        {categories.map((category) => {
          const active = category.id === activeId;
          return (
            <Button
              key={category.id}
              aria-current={active ? "true" : undefined}
              onPress={() => onPick(category.id)}
              className={cx(
                styles.item,
                active ? styles.itemActive : styles.itemIdle
              )}
            >
              <span
                className={cx(
                  styles.name,
                  active ? styles.nameActive : styles.nameIdle
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
