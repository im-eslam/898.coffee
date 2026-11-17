import { useState } from "react";
import {
  Button,
  Dialog,
  GridList,
  GridListItem,
  Heading,
  Modal,
  ModalOverlay,
} from "react-aria-components";
import { useStrings } from "@/shared/i18n";
import { Icon } from "@/shared/icons";
import { SelectField } from "../../ui/select-field";
import { TextInput } from "../../ui/text-input";
import { useLoadedMenu } from "../../../hooks/use-menu-context";
import { useReorder } from "../../../hooks/components/use-reorder";
import { localizedLabel } from "../../../util/draft";
import type { DraftCategory } from "../../../types/draft";
import { strings, fill } from "../../../strings";

const focusRing =
  "outline-none data-[focus-visible]:outline-2 data-[focus-visible]:outline-offset-2 data-[focus-visible]:outline-brand";

const styles = {
  root: "flex flex-col gap-6",
  toolbar: "flex items-center justify-between gap-3",
  heading: "text-heading font-semibold text-slate-900",
  sub: "text-small text-slate-500",
  error: "text-small text-error",
  primary: `inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-brand px-5 text-small font-semibold text-white transition-colors data-[hovered]:bg-navy data-[disabled]:cursor-not-allowed data-[disabled]:opacity-60 ${focusRing}`,
  button: `inline-flex h-11 items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-4 text-small font-semibold text-slate-700 transition-colors data-[hovered]:bg-slate-50 data-[disabled]:cursor-not-allowed data-[disabled]:opacity-50 ${focusRing}`,
  danger: `inline-flex h-11 items-center justify-center gap-2 rounded-lg border border-error/40 bg-white px-4 text-small font-semibold text-error transition-colors data-[hovered]:bg-error/5 data-[disabled]:cursor-not-allowed data-[disabled]:opacity-50 ${focusRing}`,
  iconButton: `inline-flex size-11 shrink-0 items-center justify-center rounded-lg text-slate-600 transition-colors data-[hovered]:bg-slate-100 data-[disabled]:cursor-not-allowed data-[disabled]:opacity-40 ${focusRing}`,
  dragHandle: `inline-flex size-11 shrink-0 cursor-grab items-center justify-center rounded-lg text-slate-400 data-[hovered]:bg-slate-100 active:cursor-grabbing ${focusRing}`,
  overlay:
    "fixed inset-0 z-50 flex items-end justify-center bg-slate-900/50 p-4 sm:items-center data-[entering]:animate-in data-[entering]:fade-in",
  modal:
    "w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-xl outline-none",
  list: "flex flex-col gap-3 outline-none",
  row: `flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-3 data-[dragging]:opacity-50 sm:flex-row sm:items-start ${focusRing}`,
  fields: "grid min-w-0 flex-1 gap-3 sm:grid-cols-2",
  meta: "flex items-center justify-between gap-2 sm:h-11 sm:justify-end sm:pt-6",
  count: "text-small text-slate-500",
  dialog: "flex flex-col gap-4 outline-none",
  actions: "flex justify-end gap-3",
} as const;

export function CategoriesTab() {
  const s = useStrings(strings);
  const menu = useLoadedMenu();
  const { draft, issuesAt } = menu;
  const [removingUid, setRemovingUid] = useState<string | null>(null);
  const [targetUid, setTargetUid] = useState<string | null>(null);

  const removing = draft.categories.find((item) => item.uid === removingUid);
  const others = draft.categories.filter((item) => item.uid !== removingUid);

  const { dragAndDropHooks } = useReorder((keys, target, position) =>
    menu.categories.move(keys, target, position)
  );

  const patch = (
    index: number,
    change: (category: DraftCategory) => DraftCategory
  ) => {
    const category = draft.categories[index];
    if (category) menu.categories.update(category.uid, change);
  };

  const removeWithoutProducts = (uid: string) => menu.categories.remove(uid);

  const requestRemove = (category: DraftCategory) => {
    if (category.products.length === 0) {
      removeWithoutProducts(category.uid);
      return;
    }
    setTargetUid(null);
    setRemovingUid(category.uid);
  };

  const confirmMove = () => {
    if (!removing || !targetUid) return;
    menu.categories.removeAndMove(removing.uid, targetUid);
    setRemovingUid(null);
  };

  const closeModal = () => setRemovingUid(null);
  const fallbackName = s.categories.unnamed;
  const removingName = removing
    ? localizedLabel(removing.name, fallbackName)
    : "";

  return (
    <div className={styles.root}>
      <div className={styles.toolbar}>
        <h2 className={styles.heading}>{s.categories.listLabel}</h2>
        <Button
          className={styles.primary}
          onPress={() => menu.categories.add()}
        >
          <Icon name="plus" className="size-4" />
          {s.categories.add}
        </Button>
      </div>

      <GridList
        aria-label={s.categories.listLabel}
        className={styles.list}
        items={draft.categories.map((category) => ({
          ...category,
          id: category.uid,
        }))}
        dragAndDropHooks={dragAndDropHooks}
      >
        {(category) => {
          const index = draft.categories.findIndex(
            (item) => item.uid === category.uid
          );
          const nameErrors = issuesAt(`categories[${index}].name`).map(
            (issue) => issue.message
          );
          const count = category.products.length;
          return (
            <GridListItem
              id={category.uid}
              textValue={localizedLabel(category.name, fallbackName)}
              className={styles.row}
            >
              <Button
                slot="drag"
                className={styles.dragHandle}
                aria-label={s.common.dragHandle}
              >
                <Icon name="menu" className="size-5" />
              </Button>
              <div className={styles.fields}>
                <TextInput
                  required
                  label={s.categories.nameEn}
                  value={category.name.en}
                  errors={nameErrors}
                  onCommit={(en) =>
                    patch(index, (item) => ({
                      ...item,
                      name: { ...item.name, en },
                    }))
                  }
                />
                <TextInput
                  required
                  rtl
                  label={s.categories.nameAr}
                  value={category.name.ar}
                  onCommit={(ar) =>
                    patch(index, (item) => ({
                      ...item,
                      name: { ...item.name, ar },
                    }))
                  }
                />
              </div>
              <div className={styles.meta}>
                <span className={styles.count}>
                  {count === 1
                    ? s.categories.oneProduct
                    : fill(s.categories.products, { count })}
                </span>
                <Button
                  className={styles.iconButton}
                  aria-label={`${s.categories.remove}: ${localizedLabel(category.name, fallbackName)}`}
                  onPress={() => requestRemove(category)}
                >
                  <Icon name="trash" className="size-5" />
                </Button>
              </div>
            </GridListItem>
          );
        }}
      </GridList>

      <ModalOverlay
        className={styles.overlay}
        isOpen={removing !== undefined}
        onOpenChange={(open) => {
          if (!open) closeModal();
        }}
        isDismissable
      >
        <Modal className={styles.modal}>
          <Dialog className={styles.dialog}>
            <Heading slot="title" className={styles.heading}>
              {fill(s.categories.removeTitle, { name: removingName })}
            </Heading>
            <p className={styles.sub}>{s.categories.removeText}</p>
            {others.length === 0 ? (
              <p className={styles.error}>{s.categories.noOther}</p>
            ) : (
              <SelectField
                label={s.categories.moveTo}
                value={targetUid}
                options={others.map((item) => ({
                  id: item.uid,
                  label: localizedLabel(item.name, fallbackName),
                }))}
                onChange={setTargetUid}
              />
            )}
            <div className={styles.actions}>
              <Button className={styles.button} onPress={closeModal}>
                {s.common.cancel}
              </Button>
              <Button
                className={styles.danger}
                isDisabled={!targetUid}
                onPress={confirmMove}
              >
                {s.categories.moveAndRemove}
              </Button>
            </div>
          </Dialog>
        </Modal>
      </ModalOverlay>
    </div>
  );
}
