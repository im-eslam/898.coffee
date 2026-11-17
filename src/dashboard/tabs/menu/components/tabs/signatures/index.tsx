import { useState } from "react";
import { Button, GridList, GridListItem } from "react-aria-components";
import { useStrings } from "@/shared/i18n";
import { Icon } from "@/shared/icons";
import { useReorder } from "../../../hooks/components/use-reorder";
import { useLoadedMenu } from "../../../hooks/use-menu-context";
import {
  localizedLabel,
  productMap,
  productOptions,
} from "../../../util/draft";
import { strings } from "../../../strings";
import { ConfirmModal } from "../../ui/confirm-modal";
import { FormOverlay } from "../../ui/form-overlay";
import { primaryButton } from "../../ui/styles";
import { SignatureForm } from "./signature-form";

const focusRing =
  "outline-none data-[focus-visible]:outline-2 data-[focus-visible]:outline-offset-2 data-[focus-visible]:outline-brand";

const styles = {
  root: "flex flex-col gap-6",
  toolbar: "flex items-center justify-between gap-3",
  heading: "text-heading font-semibold text-slate-900",
  list: "flex flex-col gap-2 outline-none",
  row: `flex min-h-14 items-center gap-2 rounded-xl border border-slate-200 bg-white px-2 data-[dragging]:opacity-50 ${focusRing}`,
  dragHandle: `inline-flex size-11 shrink-0 cursor-grab items-center justify-center rounded-lg text-slate-400 data-[hovered]:bg-slate-100 active:cursor-grabbing ${focusRing}`,
  iconButton: `inline-flex size-11 shrink-0 items-center justify-center rounded-lg text-slate-600 transition-colors data-[hovered]:bg-slate-100 data-[disabled]:cursor-not-allowed data-[disabled]:opacity-40 ${focusRing}`,
  name: "min-w-0 flex-1 truncate text-body text-slate-900",
  broken: "text-error",
  empty:
    "rounded-xl border border-dashed border-slate-300 p-6 text-center text-small text-slate-500",
} as const;

export function SignaturesTab() {
  const s = useStrings(strings);
  const menu = useLoadedMenu();
  const { draft } = menu;
  const map = productMap(draft);

  const [addOpen, setAddOpen] = useState(false);
  const [addSession, setAddSession] = useState(0);
  const [removingId, setRemovingId] = useState<string | null>(null);

  const { dragAndDropHooks } = useReorder((keys, target, position) =>
    menu.signatures.move(keys, target, position)
  );

  const labelFor = (id: string) => {
    const entry = map.get(id);
    return entry
      ? localizedLabel(entry.product.name, s.products.unnamed)
      : s.pairings.missingProduct;
  };

  const available = productOptions(draft, s.products.unnamed).filter(
    (option) => !draft.signatures.includes(option.id)
  );

  const items = draft.signatures.map((id) => ({ id }));
  const removingLabel = removingId ? labelFor(removingId) : "";

  const openAdd = () => {
    setAddSession((count) => count + 1);
    setAddOpen(true);
  };

  const submitAdd = (productId: string) => {
    menu.signatures.add(productId);
    setAddOpen(false);
  };

  const confirmRemove = () => {
    if (removingId !== null) menu.signatures.remove(removingId);
    setRemovingId(null);
  };

  return (
    <div className={styles.root}>
      <div className={styles.toolbar}>
        <h2 className={styles.heading}>{s.signatures.listLabel}</h2>
        <Button
          className={primaryButton}
          isDisabled={available.length === 0}
          onPress={openAdd}
        >
          <Icon name="plus" className="size-4" />
          {s.signatures.add}
        </Button>
      </div>

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
          const label = labelFor(item.id);
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
                onPress={() => setRemovingId(item.id)}
              >
                <Icon name="trash" className="size-5" />
              </Button>
            </GridListItem>
          );
        }}
      </GridList>

      <FormOverlay
        isOpen={addOpen}
        onClose={() => setAddOpen(false)}
        title={s.signatures.addTitle}
        description={s.signatures.addText}
        closeLabel={s.signatures.closeAdd}
      >
        <SignatureForm
          key={addSession}
          options={available}
          onSubmit={submitAdd}
          onCancel={() => setAddOpen(false)}
        />
      </FormOverlay>

      <ConfirmModal
        isOpen={removingId !== null}
        title={s.signatures.removeTitle.replace("{name}", removingLabel)}
        text={s.signatures.removeText}
        confirmLabel={s.signatures.removeConfirm}
        cancelLabel={s.common.cancel}
        destructive
        onConfirm={confirmRemove}
        onCancel={() => setRemovingId(null)}
      />
    </div>
  );
}
