import { useState } from "react";
import { Button } from "react-aria-components";
import { useStrings } from "@/shared/i18n";
import { Icon } from "@/shared/icons";
import { useLoadedMenu } from "../../../hooks/use-menu-context";
import type { NewAddOnInput } from "../../../hooks/use-menu-addons";
import type { DraftAddOn } from "../../../types/draft";
import { addOnUsage, localizedLabel } from "../../../util/draft";
import { strings, fill } from "../../../strings";
import { ConfirmModal } from "../../ui/confirm-modal";
import { FormOverlay } from "../../ui/form-overlay";
import { NumberInput } from "../../ui/number-input";
import { primaryButton } from "../../ui/styles";
import { TextInput } from "../../ui/text-input";
import { AddOnForm } from "./addon-form";

const focusRing =
  "outline-none data-[focus-visible]:outline-2 data-[focus-visible]:outline-offset-2 data-[focus-visible]:outline-brand";

const styles = {
  root: "flex flex-col gap-6",
  toolbar: "flex items-center justify-between gap-3",
  heading: "text-heading font-semibold text-slate-900",
  iconButton: `inline-flex size-11 shrink-0 items-center justify-center rounded-lg text-slate-600 transition-colors data-[hovered]:bg-slate-100 ${focusRing}`,
  scroll: "overflow-x-auto rounded-2xl border border-slate-200 bg-white p-0",
  table: "w-full min-w-[32rem] border-collapse text-start",
  th: "px-4 py-3 text-start text-small font-medium text-slate-500",
  td: "px-4 py-3 align-top",
  row: "border-t border-slate-200",
  empty: "p-6 text-center text-small text-slate-500",
} as const;

export function AddOnsTab() {
  const s = useStrings(strings);
  const menu = useLoadedMenu();
  const { draft, issuesAt } = menu;
  const fallbackName = s.addons.unnamed;

  const [addOpen, setAddOpen] = useState(false);
  const [addSession, setAddSession] = useState(0);
  const [removingUid, setRemovingUid] = useState<string | null>(null);

  const removing = draft.addOns.find((item) => item.uid === removingUid);
  const removingName = removing
    ? localizedLabel(removing.name, fallbackName)
    : "";
  const removingUsage = removing ? addOnUsage(draft, removing.id) : 0;
  const removingText =
    removingUsage === 0
      ? s.addons.removeText
      : removingUsage === 1
        ? s.addons.removeUsedOne
        : fill(s.addons.removeUsedMany, { count: removingUsage });

  const patch = (uid: string, change: (addOn: DraftAddOn) => DraftAddOn) =>
    menu.addOns.update(uid, change);

  const messages = (path: string) =>
    issuesAt(path).map((issue) => issue.message);

  const submitAdd = (input: NewAddOnInput) => {
    if (menu.addOns.add(input)) setAddOpen(false);
  };

  const confirmRemove = () => {
    if (removingUid !== null) menu.addOns.remove(removingUid);
    setRemovingUid(null);
  };

  return (
    <div className={styles.root}>
      <div className={styles.toolbar}>
        <h2 className={styles.heading}>{s.addons.tableLabel}</h2>
        <Button
          className={primaryButton}
          onPress={() => {
            setAddSession((count) => count + 1);
            setAddOpen(true);
          }}
        >
          <Icon name="plus" className="size-4" />
          {s.addons.add}
        </Button>
      </div>

      <div className={styles.scroll}>
        {draft.addOns.length === 0 ? (
          <p className={styles.empty}>{s.addons.empty}</p>
        ) : (
          <table className={styles.table} aria-label={s.addons.tableLabel}>
            <thead>
              <tr>
                <th scope="col" className={styles.th}>
                  {s.addons.nameEn}
                </th>
                <th scope="col" className={styles.th}>
                  {s.addons.nameAr}
                </th>
                <th
                  scope="col"
                  className={styles.th}
                >{`${s.addons.price} (${draft.currency})`}</th>
                <th scope="col" className={styles.th}>
                  <span className="sr-only">{s.addons.actions}</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {draft.addOns.map((addOn, index) => {
                const path = `addOns[${index}]`;
                const name = localizedLabel(addOn.name, fallbackName);
                return (
                  <tr key={addOn.uid} className={styles.row}>
                    <td className={styles.td}>
                      <TextInput
                        hideLabel
                        required
                        label={s.addons.nameEn}
                        value={addOn.name.en}
                        errors={messages(`${path}.name`)}
                        onCommit={(en) =>
                          patch(addOn.uid, (item) => ({
                            ...item,
                            name: { ...item.name, en },
                          }))
                        }
                      />
                    </td>
                    <td className={styles.td}>
                      <TextInput
                        hideLabel
                        required
                        rtl
                        label={s.addons.nameAr}
                        value={addOn.name.ar}
                        onCommit={(ar) =>
                          patch(addOn.uid, (item) => ({
                            ...item,
                            name: { ...item.name, ar },
                          }))
                        }
                      />
                    </td>
                    <td className={styles.td}>
                      <NumberInput
                        hideLabel
                        label={s.addons.price}
                        value={addOn.price}
                        errors={messages(`${path}.price`)}
                        onCommit={(price) =>
                          patch(addOn.uid, (item) => ({ ...item, price }))
                        }
                      />
                    </td>
                    <td className={styles.td}>
                      <Button
                        className={styles.iconButton}
                        aria-label={`${s.addons.remove}: ${name}`}
                        onPress={() => setRemovingUid(addOn.uid)}
                      >
                        <Icon name="trash" className="size-5" />
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      <FormOverlay
        isOpen={addOpen}
        onClose={() => setAddOpen(false)}
        title={s.addons.addTitle}
        description={s.addons.addText}
        closeLabel={s.addons.closeAdd}
      >
        <AddOnForm
          key={addSession}
          onSubmit={submitAdd}
          onCancel={() => setAddOpen(false)}
        />
      </FormOverlay>

      <ConfirmModal
        isOpen={removing !== undefined}
        title={fill(s.addons.removeTitle, { name: removingName })}
        text={removingText}
        confirmLabel={s.addons.removeConfirm}
        cancelLabel={s.common.cancel}
        destructive
        onConfirm={confirmRemove}
        onCancel={() => setRemovingUid(null)}
      />
    </div>
  );
}
