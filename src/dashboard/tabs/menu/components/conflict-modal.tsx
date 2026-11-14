import { useState } from "react";
import {
  Button,
  Dialog,
  Heading,
  Modal,
  ModalOverlay,
} from "react-aria-components";
import { useStrings } from "@/shared/i18n";
import { useDraft } from "../context";
import { strings } from "../strings";
import { ui } from "../ui";

const styles = {
  dialog: "flex flex-col gap-5 outline-none",
  text: "text-body text-slate-600",
  actions: "flex flex-col-reverse gap-3 sm:flex-row sm:justify-end",
} as const;

export function ConflictModal() {
  const s = useStrings(strings);
  const { conflict, isReloading, reload, keepMine, dismissConflict } =
    useDraft();
  const [confirming, setConfirming] = useState(false);

  function close() {
    setConfirming(false);
    dismissConflict();
  }

  return (
    <ModalOverlay
      isOpen={conflict}
      isDismissable={!isReloading}
      onOpenChange={(open) => {
        if (!open) close();
      }}
      className={ui.overlay}
    >
      <Modal className={ui.modal}>
        <Dialog role="alertdialog" className={styles.dialog}>
          <Heading slot="title" className={ui.heading}>
            {confirming ? s.conflict.confirmTitle : s.conflict.title}
          </Heading>
          <p className={styles.text}>
            {confirming ? s.conflict.confirmText : s.conflict.text}
          </p>
          {confirming ? (
            <div className={styles.actions}>
              <Button
                className={ui.button}
                isDisabled={isReloading}
                onPress={() => setConfirming(false)}
              >
                {s.conflict.back}
              </Button>
              <Button
                className={ui.danger}
                isDisabled={isReloading}
                onPress={() => void reload()}
              >
                {s.conflict.confirm}
              </Button>
            </div>
          ) : (
            <div className={styles.actions}>
              <Button
                className={ui.button}
                isDisabled={isReloading}
                onPress={() => void keepMine()}
              >
                {s.conflict.keepCopy}
              </Button>
              <Button
                className={ui.primary}
                isDisabled={isReloading}
                onPress={() => setConfirming(true)}
              >
                {s.conflict.reloadLatest}
              </Button>
            </div>
          )}
        </Dialog>
      </Modal>
    </ModalOverlay>
  );
}
