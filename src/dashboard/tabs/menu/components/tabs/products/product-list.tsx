import { Button, GridList, GridListItem, SearchField, Input, Label } from "react-aria-components";
import { useStrings } from "@/shared/i18n";
import { Icon } from "@/shared/icons";
import { useLoadedMenu } from "../../../hooks/use-menu-context";
import { useReorder } from "../../../hooks/components/use-reorder";
import { localizedLabel, sizeLabel } from "../../../util/draft";
import type { DraftCategory, DraftProduct } from "../../../types/draft";
import { strings, fill } from "../../../strings";

const focusRing =
  "outline-none data-[focus-visible]:outline-2 data-[focus-visible]:outline-offset-2 data-[focus-visible]:outline-brand";

const styles = {
  root: "flex flex-col gap-5",
  search: "flex flex-col gap-1.5",
  input:
    "h-11 w-full rounded-lg border border-slate-300 bg-white px-3 text-body text-slate-900 outline-none placeholder:text-slate-400 data-[focused]:border-brand data-[focused]:ring-2 data-[focused]:ring-brand/20",
  searchWrap: "relative",
  clear: "absolute inset-y-0 end-0 flex w-11 items-center justify-center text-slate-500 outline-none data-[focus-visible]:outline-2 data-[focus-visible]:outline-brand [[data-empty]_&]:hidden",
  section: "flex flex-col gap-2",
  sectionHead: "flex items-center justify-between gap-2",
  sectionTitle: "text-body font-semibold text-slate-900",
  button: `inline-flex h-11 items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-4 text-small font-semibold text-slate-700 transition-colors data-[hovered]:bg-slate-50 data-[disabled]:cursor-not-allowed data-[disabled]:opacity-50 ${focusRing}`,
  dragHandle: `inline-flex size-11 shrink-0 cursor-grab items-center justify-center rounded-lg text-slate-400 data-[hovered]:bg-slate-100 active:cursor-grabbing ${focusRing}`,
  list: "flex flex-col gap-2 outline-none",
  row: `flex min-h-14 cursor-pointer items-center gap-2 rounded-xl border border-slate-200 bg-white px-2 py-1 outline-none data-[hovered]:bg-slate-50 data-[dragging]:opacity-50 data-[focus-visible]:outline-2 data-[focus-visible]:outline-offset-2 data-[focus-visible]:outline-brand`,
  rowSelected: "border-brand bg-brand/5",
  rowBody: "flex min-w-0 flex-1 flex-col gap-1 py-1",
  name: "truncate text-body font-medium text-slate-900",
  meta: "flex flex-wrap items-center gap-2 text-small text-slate-500",
  chip: "rounded-full bg-slate-100 px-2 py-0.5 text-small font-medium text-slate-700",
  chipOut: "bg-error/10 text-error",
  chipBadge: "bg-brand/10 text-brand",
  empty: "rounded-xl border border-dashed border-slate-300 p-4 text-center text-small text-slate-500",
} as const;

interface ProductListProps {
  search: string;
  onSearch: (value: string) => void;
  selectedUid: string | null;
  onSelect: (uid: string) => void;
}

export function ProductList({
  search,
  onSearch,
  selectedUid,
  onSelect,
}: ProductListProps) {
  const s = useStrings(strings);
  const { draft } = useLoadedMenu();
  const needle = search.trim().toLowerCase();

  const matches = (product: DraftProduct) =>
    needle === "" ||
    product.name.en.toLowerCase().includes(needle) ||
    product.name.ar.toLowerCase().includes(needle);

  const visible = draft.categories.filter(
    (category) => needle === "" || category.products.some(matches)
  );

  return (
    <div className={styles.root}>
      <SearchField
        className={styles.search}
        value={search}
        onChange={onSearch}
      >
        <Label className="sr-only">{s.products.searchLabel}</Label>
        <div className={styles.searchWrap}>
          <Input className={styles.input} placeholder={s.products.searchPlaceholder} />
          <Button className={styles.clear} aria-label={s.products.clearSearch}>
            <Icon name="close" className="size-4" />
          </Button>
        </div>
      </SearchField>

      {visible.length === 0 ? (
        <p className={styles.empty}>{s.products.noMatches}</p>
      ) : (
        visible.map((category) => (
          <CategorySection
            key={category.uid}
            category={category}
            filter={matches}
            selectedUid={selectedUid}
            onSelect={onSelect}
          />
        ))
      )}
    </div>
  );
}

interface CategorySectionProps {
  category: DraftCategory;
  filter: (product: DraftProduct) => boolean;
  selectedUid: string | null;
  onSelect: (uid: string) => void;
}

function CategorySection({
  category,
  filter,
  selectedUid,
  onSelect,
}: CategorySectionProps) {
  const s = useStrings(strings);
  const menu = useLoadedMenu();
  const { draft } = menu;

  const { dragAndDropHooks } = useReorder((keys, target, position) =>
    menu.products.move(category.uid, keys, target, position)
  );

  const title = localizedLabel(category.name, s.products.uncategorized);
  const headingId = `products-${category.uid}`;
  const products = category.products.filter(filter);

  const addProduct = () => onSelect(menu.products.add(category.uid));

  return (
    <section className={styles.section} aria-labelledby={headingId}>
      <div className={styles.sectionHead}>
        <h3 id={headingId} className={styles.sectionTitle}>
          {title}
        </h3>
        <Button className={styles.button} onPress={addProduct}>
          <Icon name="plus" className="size-4" />
          {s.products.addProduct}
        </Button>
      </div>
      <GridList
        aria-label={fill(s.products.listLabel, { category: title })}
        className={styles.list}
        items={products.map((product) => ({ ...product, id: product.uid }))}
        dragAndDropHooks={dragAndDropHooks}
        onAction={(key) => onSelect(String(key))}
        renderEmptyState={() => (
          <p className={styles.empty}>{s.common.noProducts}</p>
        )}
      >
        {(product) => {
          const name = localizedLabel(product.name, s.products.unnamed);
          return (
            <GridListItem
              id={product.uid}
              textValue={name}
              className={`${styles.row} ${product.uid === selectedUid ? styles.rowSelected : ""}`}
            >
              <Button
                slot="drag"
                className={styles.dragHandle}
                aria-label={s.common.dragHandle}
              >
                <Icon name="menu" className="size-5" />
              </Button>
              <div className={styles.rowBody}>
                <span className={styles.name}>{name}</span>
                <span className={styles.meta}>
                  <span>{sizeLabel(product, draft.currency)}</span>
                  <span
                    className={`${styles.chip} ${product.availability === "out_of_stock" ? styles.chipOut : ""}`}
                  >
                    {product.availability === "in_stock"
                      ? s.products.inStock
                      : s.products.outOfStock}
                  </span>
                  {product.badge ? (
                    <span className={`${styles.chip} ${styles.chipBadge}`}>
                      {product.badge === "new"
                        ? s.products.badgeNew
                        : s.products.badgeTop}
                    </span>
                  ) : null}
                </span>
              </div>
            </GridListItem>
          );
        }}
      </GridList>
    </section>
  );
}
