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
import { SelectField } from "../../components/select-field";
import { TextInput } from "../../components/text-input";
import { useLoadedDraft } from "../../context";
import { useReorder } from "../../hooks/use-reorder";
import { emptyCategory } from "../../lib/factories";
import { localizedLabel } from "../../lib/labels";
import { moveItems } from "../../lib/reorder";
import { fill, strings } from "../../strings";
import { ui } from "../../ui";
import type { DraftCategory } from "../../types";

const styles = {
  root: "flex flex-col gap-6",
  toolbar: "flex items-center justify-between gap-3",
  list: "flex flex-col gap-3 outline-none",
  row: `flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-3 data-[dragging]:opacity-50 sm:flex-row sm:items-start ${ui.focusRing}`,
  fields: "grid min-w-0 flex-1 gap-3 sm:grid-cols-2",
  meta: "flex items-center justify-between gap-2 sm:h-11 sm:justify-end sm:pt-6",
  count: "text-small text-slate-500",
  dialog: "flex flex-col gap-4 outline-none",
  actions: "flex justify-end gap-3",
} as const;

export function CategoriesTab() {
  const s = useStrings(strings);
  const { draft, update, issuesAt } = useLoadedDraft();
  const [removingUid, setRemovingUid] = useState<string | null>(null);
  const [targetUid, setTargetUid] = useState<string | null>(null);

  const removing = draft.categories.find((item) => item.uid === removingUid);
  const others = draft.categories.filter((item) => item.uid !== removingUid);

  const { dragAndDropHooks } = useReorder((keys, target, position) =>
    update((current) => ({
      ...current,
      categories: moveItems(current.categories, keys, target, position),
    }))
  );

  const patch = (index: number, change: (category: DraftCategory) => DraftCategory) =>
    update(
      (current) => ({
        ...current,
        categories: current.categories.map((category, position) =>
          position === index ? change(category) : category
        ),
      }),
      `categories[${index}].name`
    );

  const removeWithoutProducts = (uid: string) =>
    update((current) => ({
      ...current,
      categories: current.categories.filter((item) => item.uid !== uid),
    }));

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
    update((current) => ({
      ...current,
      categories: current.categories
        .filter((item) => item.uid !== removing.uid)
        .map((item) =>
          item.uid === targetUid
            ? { ...item, products: [...item.products, ...removing.products] }
            : item
        ),
    }));
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
        <h2 className={ui.heading}>{s.categories.listLabel}</h2>
        <Button
          className={ui.primary}
          onPress={() =>
            update((current) => ({
              ...current,
              categories: [...current.categories, emptyCategory()],
            }))
          }
        >
          <Icon name="plus" className="size-4" />
          {s.categories.add}
        </Button>
      </div>

      <GridList
        aria-label={s.categories.listLabel}
        className={styles.list}
        items={draft.categories.map((category) => ({ ...category, id: category.uid }))}
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
                className={ui.dragHandle}
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
                  className={ui.iconButton}
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
        className={ui.overlay}
        isOpen={removing !== undefined}
        onOpenChange={(open) => {
          if (!open) closeModal();
        }}
        isDismissable
      >
        <Modal className={ui.modal}>
          <Dialog className={styles.dialog}>
            <Heading slot="title" className={ui.heading}>
              {fill(s.categories.removeTitle, { name: removingName })}
            </Heading>
            <p className={ui.sub}>{s.categories.removeText}</p>
            {others.length === 0 ? (
              <p className={ui.error}>{s.categories.noOther}</p>
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
              <Button className={ui.button} onPress={closeModal}>
                {s.common.cancel}
              </Button>
              <Button
                className={ui.danger}
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
