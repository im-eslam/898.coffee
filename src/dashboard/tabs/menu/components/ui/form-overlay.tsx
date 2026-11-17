import type { ReactNode } from "react";
import { Button, Dialog, Modal, ModalOverlay } from "react-aria-components";
import { Drawer as VaulDrawer } from "vaul";
import { Icon } from "@/shared/icons";
import { useIsDesktop } from "../../hooks/components/use-is-desktop";

const focusRing =
  "outline-none data-[focus-visible]:outline-2 data-[focus-visible]:outline-offset-2 data-[focus-visible]:outline-brand";

const styles = {
  overlay:
    "fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4",
  modal:
    "max-h-[85dvh] w-full max-w-3xl overflow-y-auto rounded-2xl bg-white p-6 shadow-xl outline-none",
  dialog: "relative flex flex-col outline-none",
  modalClose: `absolute end-0 top-0 inline-flex size-11 items-center justify-center rounded-lg text-slate-500 transition-colors data-[hovered]:bg-slate-100 ${focusRing}`,

  sheetOverlay:
    "fixed inset-0 z-50 bg-slate-900/40 transition-opacity duration-200 data-[state=open]:opacity-100 data-[state=closed]:opacity-0 data-[state=closed]:!pointer-events-none motion-reduce:transition-none",
  sheet:
    "fixed inset-x-0 bottom-0 z-50 mx-auto flex max-h-[88dvh] w-full max-w-lg flex-col overflow-clip rounded-t-2xl bg-white text-slate-900 shadow-xl outline-none data-[state=closed]:!pointer-events-none md:rounded-2xl",
  handleRow:
    "relative z-0 flex h-8 w-full shrink-0 items-center justify-center",
  handle:
    "cursor-grab touch-none rounded-full !bg-slate-300 [&_[data-vaul-handle-hitarea]]:!h-20 [&_[data-vaul-handle-hitarea]]:!w-999 active:cursor-grabbing",
  sheetBody:
    "relative flex min-h-0 flex-1 flex-col overflow-y-auto overscroll-contain px-6 pt-4 pb-[max(2rem,env(safe-area-inset-bottom))] sm:px-8",
  sheetClose: `absolute end-3 top-3 z-10 inline-flex size-9 items-center justify-center rounded-full bg-white/80 text-slate-500 data-[hovered]:bg-slate-100 ${focusRing}`,
  srOnly: "sr-only",
} as const;

export interface FormOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  /** Accessible name of the dialog. Also shown to screen readers in the sheet. */
  title: string;
  /** Accessible description, used by the sheet. */
  description: string;
  closeLabel: string;
  children: ReactNode;
}

/**
 * A form that opens as a centered modal on desktop and a bottom sheet on
 * mobile. The breakpoint matches the rest of the menu (1024px).
 */
export function FormOverlay({
  isOpen,
  onClose,
  title,
  description,
  closeLabel,
  children,
}: FormOverlayProps) {
  const isDesktop = useIsDesktop();

  if (isDesktop) {
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
          <Dialog aria-label={title} className={styles.dialog}>
            <Button
              onPress={onClose}
              aria-label={closeLabel}
              className={styles.modalClose}
            >
              <Icon name="close" className="size-5" />
            </Button>
            {children}
          </Dialog>
        </Modal>
      </ModalOverlay>
    );
  }

  return (
    <VaulDrawer.Root
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
      shouldScaleBackground={false}
      handleOnly={true}
      repositionInputs={false}
    >
      <VaulDrawer.Portal>
        <VaulDrawer.Overlay className={styles.sheetOverlay} />
        <VaulDrawer.Content className={styles.sheet}>
          <div className={styles.handleRow}>
            <VaulDrawer.Handle className={styles.handle} />
          </div>
          <VaulDrawer.Title className={styles.srOnly}>{title}</VaulDrawer.Title>
          <VaulDrawer.Description className={styles.srOnly}>
            {description}
          </VaulDrawer.Description>
          <div className={styles.sheetBody}>
            <Button
              onPress={onClose}
              aria-label={closeLabel}
              className={styles.sheetClose}
            >
              <Icon name="close" className="size-4" />
            </Button>
            {children}
          </div>
        </VaulDrawer.Content>
      </VaulDrawer.Portal>
    </VaulDrawer.Root>
  );
}
