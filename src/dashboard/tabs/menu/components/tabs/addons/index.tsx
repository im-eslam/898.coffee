import { Button } from "react-aria-components";
import { useStrings } from "@/shared/i18n";
import { Icon } from "@/shared/icons";
import { NumberInput } from "../../ui/number-input";
import { TextInput } from "../../ui/text-input";
import { useLoadedMenu } from "../../../hooks/use-menu-context";
import { addOnUsage } from "../../../util/draft";
import type { DraftAddOn } from "../../../types/draft";
import { strings, fill } from "../../../strings";

const focusRing =
  "outline-none data-[focus-visible]:outline-2 data-[focus-visible]:outline-offset-2 data-[focus-visible]:outline-brand";

const styles = {
  root: "flex flex-col gap-6",
  toolbar: "flex items-center justify-between gap-3",
  heading: "text-heading font-semibold text-slate-900",
  primary: `inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-brand px-5 text-small font-semibold text-white transition-colors data-[hovered]:bg-navy data-[disabled]:cursor-not-allowed data-[disabled]:opacity-60 ${focusRing}`,
  iconButton: `inline-flex size-11 shrink-0 items-center justify-center rounded-lg text-slate-600 transition-colors data-[hovered]:bg-slate-100 data-[disabled]:cursor-not-allowed data-[disabled]:opacity-40 ${focusRing}`,
  scroll: "overflow-x-auto rounded-2xl border border-slate-200 bg-white p-0",
  table: "w-full min-w-176 border-collapse text-start",
  th: "px-4 py-3 text-start text-small font-medium text-slate-500",
  td: "px-4 py-3 align-top",
  row: "border-t border-slate-200",
  usage: "text-small text-slate-600",
  blocked: "mt-1 block text-small text-slate-500",
  empty: "p-6 text-center text-small text-slate-500",
} as const;

export function AddOnsTab() {
  const s = useStrings(strings);
  const menu = useLoadedMenu();
  const { draft, issuesAt } = menu;

  const patch = (index: number, change: (addOn: DraftAddOn) => DraftAddOn) => {
    const addOn = draft.addOns[index];
    if (addOn) menu.addOns.update(addOn.uid, change);
  };

  const messages = (path: string) =>
    issuesAt(path).map((issue) => issue.message);

  return (
    <div className={styles.root}>
      <div className={styles.toolbar}>
        <h2 className={styles.heading}>{s.addons.tableLabel}</h2>
        <Button className={styles.primary} onPress={() => menu.addOns.add()}>
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
                  {s.addons.usedBy}
                </th>
                <th scope="col" className={styles.th}>
                  <span className="sr-only">{s.addons.actions}</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {draft.addOns.map((addOn, index) => {
                const usage = addOnUsage(draft, addOn.id);
                const path = `addOns[${index}]`;
                const nameErrors = messages(`${path}.name`);
                const blockedText =
                  usage === 1
                    ? s.addons.blockedOne
                    : fill(s.addons.blocked, { count: usage });
                return (
                  <tr key={addOn.uid} className={styles.row}>
                    <td className={styles.td}>
                      <TextInput
                        hideLabel
                        required
                        label={s.addons.nameEn}
                        value={addOn.name.en}
                        errors={nameErrors}
                        onCommit={(en) =>
                          patch(index, (item) => ({
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
                          patch(index, (item) => ({
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
                          patch(index, (item) => ({ ...item, price }))
                        }
                      />
                    </td>
                    <td className={`${styles.td} ${styles.usage}`}>
                      <span className="flex h-11 items-center">{usage}</span>
                    </td>
                    <td className={styles.td}>
                      <Button
                        className={styles.iconButton}
                        isDisabled={usage > 0}
                        aria-label={s.addons.remove}
                        onPress={() => menu.addOns.remove(addOn.uid)}
                      >
                        <Icon name="trash" className="size-5" />
                      </Button>
                      {usage > 0 ? (
                        <span className={styles.blocked}>{blockedText}</span>
                      ) : null}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
