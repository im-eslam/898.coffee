import { Button, Dialog, Modal, ModalOverlay } from "react-aria-components";
import { useStrings } from "@/shared/i18n";
import { Icon } from "@/shared/icons";
import type { Review } from "../api";
import { strings } from "../strings";
import { ReviewDetailBody } from "./review-details";

const styles = {
  overlay:
    "fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4",
  modal:
    "w-full max-w-2xl max-h-[85dvh] overflow-y-auto rounded-2xl bg-white p-4 shadow-xl outline-none",
  dialog: "relative flex flex-col gap-4 outline-none",
  close:
    "absolute end-3 top-3 z-10 inline-flex size-9 items-center justify-center rounded-full bg-white/80 text-slate-500 outline-none data-[hovered]:bg-white data-[focus-visible]:ring-4 data-[focus-visible]:ring-brand/15",
} as const;

interface ReviewDialogProps {
  review: Review | null;
  isOpen: boolean;
  resetKey: number;
  deleting: boolean;
  onClose: () => void;
  onDelete: (review: Review) => Promise<boolean>;
}

export function ReviewDialog({
  review,
  isOpen,
  resetKey,
  deleting,
  onClose,
  onDelete,
}: ReviewDialogProps) {
  const s = useStrings(strings);

  return (
    <ModalOverlay
      isOpen={isOpen}
      isDismissable={!deleting}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
      className={styles.overlay}
    >
      <Modal className={styles.modal}>
        <Dialog aria-label={s.dialog.title} className={styles.dialog}>
          <Button
            onPress={onClose}
            aria-label={s.dialog.close}
            className={styles.close}
          >
            <Icon name="close" size={18} />
          </Button>

          {review && (
            <ReviewDetailBody
              key={resetKey}
              review={review}
              deleting={deleting}
              onDelete={onDelete}
            />
          )}
        </Dialog>
      </Modal>
    </ModalOverlay>
  );
}
