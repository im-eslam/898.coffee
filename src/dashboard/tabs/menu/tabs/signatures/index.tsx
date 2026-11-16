import { useState } from "react";
import {
  Button,
  ComboBox,
  GridList,
  GridListItem,
  Input,
  Label,
  ListBox,
  ListBoxItem,
  Popover,
} from "react-aria-components";
import { useStrings } from "@/shared/i18n";
import { Icon } from "@/shared/icons";
import { useLoadedDraft } from "../../hooks/use-draft-context";
import { useReorder } from "../../hooks/use-reorder";
import { localizedLabel } from "../../lib/labels";
import { moveStrings } from "../../lib/reorder";
import { productMap, referenceable } from "../../lib/selectors";
import { strings } from "../../strings";

const focusRing =
  "outline-none data-[focus-visible]:outline-2 data-[focus-visible]:outline-offset-2 data-[focus-visible]:outline-brand";

const styles = {
  root: "flex flex-col gap-6",
  card: "flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-6",
  heading: "text-heading font-semibold text-slate-900",
  label: "text-small font-medium text-slate-700",
  input:
    "h-11 w-full rounded-lg border border-slate-300 bg-white px-3 text-body text-slate-900 outline-none placeholder:text-slate-400 data-[focused]:border-brand data-[focused]:ring-2 data-[focused]:ring-brand/20",
  popover:
    "max-h-72 w-(--trigger-width) overflow-auto rounded-lg border border-slate-200 bg-white p-1 shadow-lg",
  option:
    "flex cursor-pointer items-center rounded-md px-3 py-2 text-body text-slate-900 outline-none data-[focused]:bg-brand/10 data-[disabled]:opacity-50",
  dragHandle: `inline-flex size-11 shrink-0 cursor-grab items-center justify-center rounded-lg text-slate-400 data-[hovered]:bg-slate-100 active:cursor-grabbing ${focusRing}`,
  iconButton: `inline-flex size-11 shrink-0 items-center justify-center rounded-lg text-slate-600 transition-colors data-[hovered]:bg-slate-100 data-[disabled]:cursor-not-allowed data-[disabled]:opacity-40 ${focusRing}`,
  list: "flex flex-col gap-2 outline-none",
  row: `flex min-h-14 items-center gap-2 rounded-xl border border-slate-200 bg-white px-2 data-[dragging]:opacity-50 ${focusRing}`,
  name: "min-w-0 flex-1 truncate text-body text-slate-900",
  broken: "text-error",
  empty: "rounded-xl border border-dashed border-slate-300 p-6 text-center text-small text-slate-500",
  field: "flex flex-col gap-1.5",
} as const;

export function SignaturesTab() {
  const s = useStrings(strings);
  const { draft, update } = useLoadedDraft();
  const [text, setText] = useState("");
  const map = productMap(draft);

  const { dragAndDropHooks } = useReorder((keys, target, position) =>
    update((current) => ({
      ...current,
      signatures: moveStrings(current.signatures, keys, target, position),
    }))
  );

  const available = referenceable(draft)
    .filter((product) => !draft.signatures.includes(product.id))
    .map((product) => ({
      id: product.id,
      label: localizedLabel(product.name, s.products.unnamed),
    }));

  const items = draft.signatures.map((id) => ({ id }));

  return (
    <div className={styles.root}>
      <section className={styles.card} aria-labelledby="signatures-heading">
        <h2 id="signatures-heading" className={styles.heading}>
          {s.tabs.signatures}
        </h2>

        <ComboBox
          className={styles.field}
          items={available}
          selectedKey={null}
          inputValue={text}
          onInputChange={setText}
          menuTrigger="focus"
          onSelectionChange={(key) => {
            if (typeof key === "string") {
              update((current) => ({
                ...current,
                signatures: [...current.signatures, key],
              }));
              setText("");
            }
          }}
        >
          <Label className={styles.label}>{s.signatures.add}</Label>
          <Input className={styles.input} placeholder={s.signatures.addPlaceholder} />
          <Popover className={styles.popover}>
            <ListBox className="outline-none">
              {(option: { id: string; label: string }) => (
                <ListBoxItem
                  id={option.id}
                  textValue={option.label}
                  className={styles.option}
                >
                  {option.label}
                </ListBoxItem>
              )}
            </ListBox>
          </Popover>
        </ComboBox>

        <GridList
          aria-label={s.signatures.listLabel}
          className={styles.list}
          items={items}
          dragAndDropHooks={dragAndDropHooks}
          renderEmptyState={() => (
            <p className={styles.empty}>{s.signatures.empty}</p>
          )}
        >
          {(item) => {
            const entry = map.get(item.id);
            const label = entry
              ? localizedLabel(entry.product.name, s.products.unnamed)
              : s.pairings.missingProduct;
            return (
              <GridListItem id={item.id} textValue={label} className={styles.row}>
                <Button
                  slot="drag"
                  className={styles.dragHandle}
                  aria-label={s.common.dragHandle}
                >
                  <Icon name="menu" className="size-5" />
                </Button>
                <span className={`${styles.name} ${entry ? "" : styles.broken}`}>
                  {label}
                  {entry ? "" : ` — ${s.common.willBeRemoved}`}
                </span>
                <Button
                  className={styles.iconButton}
                  aria-label={`${s.signatures.remove}: ${label}`}
                  onPress={() =>
                    update((current) => ({
                      ...current,
                      signatures: current.signatures.filter(
                        (id) => id !== item.id
                      ),
                    }))
                  }
                >
                  <Icon name="trash" className="size-5" />
                </Button>
              </GridListItem>
            );
          }}
        </GridList>
      </section>
    </div>
  );
}
