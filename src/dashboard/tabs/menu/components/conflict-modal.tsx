import { useState } from "react";
import {
  Button,
  Dialog,
  Heading,
  Modal,
  ModalOverlay,
} from "react-aria-components";
import { useStrings } from "@/shared/i18n";
import { useDraft } from "../hooks/use-draft-context";
import { strings } from "../strings";

const focusRing =
  "outline-none data-[focus-visible]:outline-2 data-[focus-visible]:outline-offset-2 data-[focus-visible]:outline-brand";

const styles = {
  overlay:
    "fixed inset-0 z-50 flex items-end justify-center bg-slate-900/50 p-4 sm:items-center data-[entering]:animate-in data-[entering]:fade-in",
  modal:
    "w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-xl outline-none",
  dialog: "flex flex-col gap-5 outline-none",
  heading: "text-heading font-semibold text-slate-900",
  text: "text-body text-slate-600",
  actions: "flex flex-col-reverse gap-3 sm:flex-row sm:justify-end",
  button: `inline-flex h-11 items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-4 text-small font-semibold text-slate-700 transition-colors data-[hovered]:bg-slate-50 data-[disabled]:cursor-not-allowed data-[disabled]:opacity-50 ${focusRing}`,
  primary: `inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-brand px-5 text-small font-semibold text-white transition-colors data-[hovered]:bg-navy data-[disabled]:cursor-not-allowed data-[disabled]:opacity-60 ${focusRing}`,
  danger: `inline-flex h-11 items-center justify-center gap-2 rounded-lg border border-error/40 bg-white px-4 text-small font-semibold text-error transition-colors data-[hovered]:bg-error/5 data-[disabled]:cursor-not-allowed data-[disabled]:opacity-50 ${focusRing}`,
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
      className={styles.overlay}
    >
      <Modal className={styles.modal}>
        <Dialog role="alertdialog" className={styles.dialog}>
          <Heading slot="title" className={styles.heading}>
            {confirming ? s.conflict.confirmTitle : s.conflict.title}
          </Heading>
          <p className={styles.text}>
            {confirming ? s.conflict.confirmText : s.conflict.text}
          </p>
          {confirming ? (
            <div className={styles.actions}>
              <Button
                className={styles.button}
                isDisabled={isReloading}
                onPress={() => setConfirming(false)}
              >
                {s.conflict.back}
              </Button>
              <Button
                className={styles.danger}
                isDisabled={isReloading}
                onPress={() => void reload()}
              >
                {s.conflict.confirm}
              </Button>
            </div>
          ) : (
            <div className={styles.actions}>
              <Button
                className={styles.button}
                isDisabled={isReloading}
                onPress={() => void keepMine()}
              >
                {s.conflict.keepCopy}
              </Button>
              <Button
                className={styles.primary}
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
