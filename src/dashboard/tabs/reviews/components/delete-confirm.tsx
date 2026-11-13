import {
  Button,
  Dialog,
  Heading,
  Modal,
  ModalOverlay,
} from "react-aria-components";
import { useStrings } from "@/shared/i18n";
import { fill, strings } from "../strings";

const styles = {
  overlay:
    "fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4",
  modal: "w-full max-w-md rounded-2xl bg-white p-6 outline-none",
  dialog: "flex flex-col gap-5 outline-none",
  title: "text-heading font-semibold text-slate-900",
  description: "text-body text-slate-600",
  actions: "flex flex-col-reverse gap-3 sm:flex-row sm:justify-end",
  cancel:
    "inline-flex h-11 items-center justify-center rounded-lg border border-slate-300 px-5 text-small font-semibold text-slate-700 data-[hovered]:bg-slate-50 data-[disabled]:opacity-60",
  confirm:
    "inline-flex h-11 items-center justify-center rounded-lg bg-error px-5 text-small font-semibold text-white data-[hovered]:opacity-90 data-[disabled]:opacity-60",
} as const;

interface DeleteConfirmProps {
  count: number;
  isOpen: boolean;
  deleting: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

export function DeleteConfirm({
  count,
  isOpen,
  deleting,
  onCancel,
  onConfirm,
}: DeleteConfirmProps) {
  const s = useStrings(strings);
  const title =
    count === 1
      ? s.dialog.confirmTitle
      : fill(s.dialog.confirmTitleMany, { count });

  return (
    <ModalOverlay
      isOpen={isOpen}
      isDismissable={!deleting}
      onOpenChange={(open) => {
        if (!open) onCancel();
      }}
      className={styles.overlay}
    >
      <Modal className={styles.modal}>
        <Dialog role="alertdialog" className={styles.dialog}>
          <Heading slot="title" className={styles.title}>
            {title}
          </Heading>
          <p className={styles.description}>{s.dialog.confirmText}</p>
          <div className={styles.actions}>
            <Button
              onPress={onCancel}
              isDisabled={deleting}
              className={styles.cancel}
            >
              {s.dialog.cancel}
            </Button>
            <Button
              onPress={onConfirm}
              isDisabled={deleting}
              className={styles.confirm}
            >
              {deleting ? s.dialog.deleting : s.dialog.confirmButton}
            </Button>
          </div>
        </Dialog>
      </Modal>
    </ModalOverlay>
  );
}
