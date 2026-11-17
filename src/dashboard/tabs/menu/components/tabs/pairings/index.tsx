import { Button } from "react-aria-components";
import { useStrings } from "@/shared/i18n";
import { Icon } from "@/shared/icons";
import { NumberInput } from "../../ui/number-input";
import { SelectField, type SelectOption } from "../../ui/select-field";
import { useLoadedMenu } from "../../../hooks/use-menu-context";
import { localizedLabel, productMap, referenceable } from "../../../util/draft";
import type { DraftPairing } from "../../../types/draft";
import { PairingNotice } from "./pairing-notice";
import { strings, fill } from "../../../strings";

const focusRing =
  "outline-none data-[focus-visible]:outline-2 data-[focus-visible]:outline-offset-2 data-[focus-visible]:outline-brand";

const styles = {
  root: "flex flex-col gap-6",
  toolbar: "flex items-center justify-between gap-3",
  heading: "text-heading font-semibold text-slate-900",
  primary: `inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-brand px-5 text-small font-semibold text-white transition-colors data-[hovered]:bg-navy data-[disabled]:cursor-not-allowed data-[disabled]:opacity-60 ${focusRing}`,
  danger: `inline-flex h-11 items-center justify-center gap-2 rounded-lg border border-error/40 bg-white px-4 text-small font-semibold text-error transition-colors data-[hovered]:bg-error/5 data-[disabled]:cursor-not-allowed data-[disabled]:opacity-50 ${focusRing}`,
  list: "flex flex-col gap-4",
  card: "flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-6",
  products: "grid gap-4 sm:grid-cols-2",
  pricing: "grid items-end gap-4 sm:grid-cols-3",
  final: "flex h-11 items-center text-body font-semibold text-slate-900",
  footer: "flex justify-end",
  empty: "rounded-xl border border-dashed border-slate-300 p-6 text-center text-small text-slate-500",
} as const;

export function PairingsTab() {
  const s = useStrings(strings);
  const menu = useLoadedMenu();
  const { draft, issuesAt } = menu;
  const map = productMap(draft);
  const products = referenceable(draft);

  const baseOptions: SelectOption[] = products.map((product) => ({
    id: product.id,
    label: localizedLabel(product.name, s.products.unnamed),
  }));

  const optionsFor = (current: string): SelectOption[] =>
    map.has(current) || current === ""
      ? baseOptions
      : [...baseOptions, { id: current, label: s.pairings.missingProduct }];

  const messages = (path: string) =>
    issuesAt(path).map((issue) => issue.message);

  return (
    <div className={styles.root}>
      <PairingNotice />
      <div className={styles.toolbar}>
        <h2 className={styles.heading}>{s.pairings.listLabel}</h2>
        <Button
          className={styles.primary}
          isDisabled={products.length < 2}
          onPress={() => menu.pairings.add()}
        >
          <Icon name="plus" className="size-4" />
          {s.pairings.add}
        </Button>
      </div>

      {draft.pairings.length === 0 ? (
        <p className={styles.empty}>{s.pairings.empty}</p>
      ) : (
        <ul className={styles.list} aria-label={s.pairings.listLabel}>
          {draft.pairings.map((pairing, index) => {
            const path = `pairings[${index}]`;
            const a = pairing.items[0] ?? "";
            const b = pairing.items[1] ?? "";
            const pairName = fill(s.pairings.pairLabel, {
              a: map.get(a) ? localizedLabel(map.get(a)!.product.name, s.products.unnamed) : s.pairings.missingProduct,
              b: map.get(b) ? localizedLabel(map.get(b)!.product.name, s.products.unnamed) : s.pairings.missingProduct,
            });
            return (
              <li key={pairing.uid}>
                <section className={styles.card} aria-label={pairName}>
                  <div className={styles.products}>
                    <SelectField
                      label={s.pairings.productA}
                      options={optionsFor(a)}
                      value={a}
                      errors={messages(`${path}.items`)}
                      onChange={(id) => menu.pairings.setItem(pairing.uid, 0, id)}
                    />
                    <SelectField
                      label={s.pairings.productB}
                      options={optionsFor(b)}
                      value={b}
                      onChange={(id) => menu.pairings.setItem(pairing.uid, 1, id)}
                    />
                  </div>
                  <div className={styles.pricing}>
                    <NumberInput
                      label={s.pairings.price}
                      value={pairing.pricing.price}
                      errors={messages(`${path}.pricing.price`)}
                      onCommit={(value) => menu.pairings.setPrice(pairing.uid, value)}
                    />
                    <NumberInput
                      label={s.pairings.discount}
                      value={pairing.pricing.discount}
                      errors={messages(`${path}.pricing.discount`)}
                      onCommit={(value) => menu.pairings.setDiscount(pairing.uid, value)}
                    />
                    <p className={styles.final}>
                      {fill(s.pairings.final, {
                        value: `${pairing.pricing.final} ${draft.currency}`,
                      })}
                    </p>
                  </div>
                  <div className={styles.footer}>
                    <Button
                      className={styles.danger}
                      onPress={() =>
                        menu.pairings.remove(pairing.uid)
                      }
                    >
                      <Icon name="trash" className="size-4" />
                      {s.pairings.remove}
                    </Button>
                  </div>
                </section>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
