import {
  Button,
  Dialog,
  Heading,
  Modal,
  ModalOverlay,
} from "react-aria-components";
import { ui } from "../ui";

const styles = {
  dialog: "flex flex-col gap-5 outline-none",
  text: "text-body text-slate-600",
  actions: "flex flex-col-reverse gap-3 sm:flex-row sm:justify-end",
} as const;

interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  text: string;
  confirmLabel: string;
  cancelLabel: string;
  destructive?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmModal({
  isOpen,
  title,
  text,
  confirmLabel,
  cancelLabel,
  destructive,
  onConfirm,
  onCancel,
}: ConfirmModalProps) {
  return (
    <ModalOverlay
      isOpen={isOpen}
      isDismissable
      onOpenChange={(open) => {
        if (!open) onCancel();
      }}
      className={ui.overlay}
    >
      <Modal className={ui.modal}>
        <Dialog role="alertdialog" className={styles.dialog}>
          <Heading slot="title" className={ui.heading}>
            {title}
          </Heading>
          <p className={styles.text}>{text}</p>
          <div className={styles.actions}>
            <Button onPress={onCancel} className={ui.button}>
              {cancelLabel}
            </Button>
            <Button
              onPress={onConfirm}
              className={destructive ? ui.danger : ui.primary}
            >
              {confirmLabel}
            </Button>
          </div>
        </Dialog>
      </Modal>
    </ModalOverlay>
  );
}
