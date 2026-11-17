import { useState } from "react";
import { Button } from "react-aria-components";
import { useStrings } from "@/shared/i18n";
import { Icon } from "@/shared/icons";
import { useIsDesktop } from "../../../hooks/components/use-is-desktop";
import { useLoadedMenu } from "../../../hooks/use-menu-context";
import type { NewPairingInput } from "../../../types/draft";
import { productOptions } from "../../../util/draft";
import { strings, fill } from "../../../strings";
import { ConfirmModal } from "../../ui/confirm-modal";
import { PairingModal } from "./pairing-modal";
import { PairingSheet } from "./pairing-sheet";
import { PairingCard, type PairingCardErrors } from "./pairing-card";
import { PairingNotice } from "./pairing-notice";

const focusRing =
  "outline-none data-[focus-visible]:outline-2 data-[focus-visible]:outline-offset-2 data-[focus-visible]:outline-brand";

const styles = {
  root: "flex flex-col gap-6",
  toolbar: "flex items-center justify-between gap-3",
  heading: "text-heading font-semibold text-slate-900",
  primary: `inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-brand px-5 text-small font-semibold text-white transition-colors data-[hovered]:bg-navy data-[disabled]:cursor-not-allowed data-[disabled]:opacity-60 ${focusRing}`,
  list: "flex flex-col gap-4",
  empty:
    "rounded-xl border border-dashed border-slate-300 p-6 text-center text-small text-slate-500",
} as const;

export function PairingsTab() {
  const s = useStrings(strings);
  const menu = useLoadedMenu();
  const { draft, issuesAt } = menu;
  const isDesktop = useIsDesktop();
  const options = productOptions(draft, s.products.unnamed);

  const [addOpen, setAddOpen] = useState(false);
  // Bumped on every open so the add form starts blank.
  const [addSession, setAddSession] = useState(0);
  const [removingUid, setRemovingUid] = useState<string | null>(null);

  const labelFor = (id: string) =>
    options.find((option) => option.id === id)?.label ??
    s.pairings.missingProduct;

  const pairName = (items: readonly string[]) =>
    fill(s.pairings.pairLabel, {
      a: labelFor(items[0] ?? ""),
      b: labelFor(items[1] ?? ""),
    });

  const messages = (path: string) =>
    issuesAt(path).map((issue) => issue.message);

  const errorsAt = (index: number): PairingCardErrors => {
    const path = `pairings[${index}]`;
    return {
      items: messages(`${path}.items`),
      price: messages(`${path}.pricing.price`),
      discount: messages(`${path}.pricing.discount`),
    };
  };

  const removing = draft.pairings.find(
    (pairing) => pairing.uid === removingUid
  );

  const openAdd = () => {
    setAddSession((count) => count + 1);
    setAddOpen(true);
  };

  const submitAdd = (input: NewPairingInput) => {
    if (menu.pairings.add(input)) setAddOpen(false);
  };

  const confirmRemove = () => {
    if (removingUid !== null) menu.pairings.remove(removingUid);
    setRemovingUid(null);
  };

  const addProps = {
    isOpen: addOpen,
    resetKey: addSession,
    products: options,
    existing: draft.pairings,
    currency: draft.currency,
    onClose: () => setAddOpen(false),
    onSubmit: submitAdd,
  };

  return (
    <div className={styles.root}>
      <PairingNotice />
      <div className={styles.toolbar}>
        <h2 className={styles.heading}>{s.pairings.listLabel}</h2>
        <Button
          className={styles.primary}
          isDisabled={options.length < 2}
          onPress={openAdd}
        >
          <Icon name="plus" className="size-4" />
          {s.pairings.add}
        </Button>
      </div>

      {draft.pairings.length === 0 ? (
        <p className={styles.empty}>{s.pairings.empty}</p>
      ) : (
        <ul className={styles.list} aria-label={s.pairings.listLabel}>
          {draft.pairings.map((pairing, index) => (
            <li key={pairing.uid}>
              <PairingCard
                pairing={pairing}
                name={pairName(pairing.items)}
                options={options}
                currency={draft.currency}
                errors={errorsAt(index)}
                onSetItem={(slot, id) =>
                  menu.pairings.setItem(pairing.uid, slot, id)
                }
                onSetPrice={(price) =>
                  menu.pairings.setPrice(pairing.uid, price)
                }
                onSetDiscount={(discount) =>
                  menu.pairings.setDiscount(pairing.uid, discount)
                }
                onRemove={() => setRemovingUid(pairing.uid)}
              />
            </li>
          ))}
        </ul>
      )}

      {isDesktop ? (
        <PairingModal {...addProps} />
      ) : (
        <PairingSheet {...addProps} />
      )}

      <ConfirmModal
        isOpen={removing !== undefined}
        title={fill(s.pairings.removeTitle, {
          name: removing ? pairName(removing.items) : "",
        })}
        text={s.pairings.removeText}
        confirmLabel={s.pairings.removeConfirm}
        cancelLabel={s.common.cancel}
        destructive
        onConfirm={confirmRemove}
        onCancel={() => setRemovingUid(null)}
      />
    </div>
  );
}
