import { Button } from "react-aria-components";
import { useStrings } from "@/shared/i18n";
import { Icon } from "@/shared/icons";
import { NumberInput } from "../../components/number-input";
import { TextInput } from "../../components/text-input";
import { useLoadedDraft } from "../../context";
import { emptyAddOn } from "../../lib/factories";
import { addOnUsage } from "../../lib/selectors";
import { fill, strings } from "../../strings";
import { ui } from "../../ui";
import type { DraftAddOn } from "../../types";

const styles = {
  root: "flex flex-col gap-6",
  toolbar: "flex items-center justify-between gap-3",
  scroll: `${ui.card} overflow-x-auto p-0`,
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
  const { draft, update, issuesAt } = useLoadedDraft();

  const patch = (index: number, change: (addOn: DraftAddOn) => DraftAddOn) =>
    update(
      (current) => ({
        ...current,
        addOns: current.addOns.map((addOn, position) =>
          position === index ? change(addOn) : addOn
        ),
      }),
      `addOns[${index}]`
    );

  const messages = (path: string) =>
    issuesAt(path).map((issue) => issue.message);

  return (
    <div className={styles.root}>
      <div className={styles.toolbar}>
        <h2 className={ui.heading}>{s.addons.tableLabel}</h2>
        <Button
          className={ui.primary}
          onPress={() =>
            update((current) => ({
              ...current,
              addOns: [...current.addOns, emptyAddOn()],
            }))
          }
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
                <th scope="col" className={styles.th}>{s.addons.nameEn}</th>
                <th scope="col" className={styles.th}>{s.addons.nameAr}</th>
                <th scope="col" className={styles.th}>{`${s.addons.price} (${draft.currency})`}</th>
                <th scope="col" className={styles.th}>{s.addons.usedBy}</th>
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
                        className={ui.iconButton}
                        isDisabled={usage > 0}
                        aria-label={s.addons.remove}
                        onPress={() =>
                          update((current) => ({
                            ...current,
                            addOns: current.addOns.filter(
                              (item) => item.uid !== addOn.uid
                            ),
                          }))
                        }
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
