import { Button, Dialog, Modal, ModalOverlay } from "react-aria-components";
import { useStrings } from "@/shared/i18n";
import { Icon } from "@/shared/icons";
import type { DraftPairing, NewPairingInput } from "../../../types/draft";
import type { ProductOption } from "../../../types/ui";
import { strings } from "../../../strings";
import { PairingForm } from "./pairing-form";

const focusRing =
  "outline-none data-[focus-visible]:outline-2 data-[focus-visible]:outline-offset-2 data-[focus-visible]:outline-brand";
const styles = {
  overlay:
    "fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4",
  modal:
    "max-h-[85dvh] w-[calc(100%-2rem)] max-w-3xl overflow-y-auto rounded-2xl bg-white p-6 shadow-xl outline-none sm:p-8",
  dialog: "relative flex flex-col outline-none",
  close: `absolute end-0 top-0 inline-flex size-11 items-center justify-center rounded-lg text-slate-500 transition-colors data-[hovered]:bg-slate-100 ${focusRing}`,
} as const;

export interface PairingProps {
  isOpen: boolean;
  resetKey: number;
  products: ProductOption[];
  existing: readonly DraftPairing[];
  currency: string;
  onClose: () => void;
  onSubmit: (input: NewPairingInput) => void;
}

export function PairingModal({
  isOpen,
  resetKey,
  products,
  existing,
  currency,
  onClose,
  onSubmit,
}: PairingProps) {
  const s = useStrings(strings);

  return (
    <ModalOverlay
      isOpen={isOpen}
      isDismissable
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
      className={styles.overlay}
    >
      <Modal className={styles.modal}>
        <Dialog aria-label={s.pairings.addTitle} className={styles.dialog}>
          <Button
            onPress={onClose}
            aria-label={s.pairings.closeAdd}
            className={styles.close}
          >
            <Icon name="close" className="size-5" />
          </Button>
          <PairingForm
            key={resetKey}
            products={products}
            existing={existing}
            currency={currency}
            onSubmit={onSubmit}
            onCancel={onClose}
          />
        </Dialog>
      </Modal>
    </ModalOverlay>
  );
}
