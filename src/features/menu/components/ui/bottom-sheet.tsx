import type { ReactNode } from "react";
import { Drawer as VaulDrawer } from "vaul";
import { Button } from "react-aria-components";
import { Icon } from "@/shared/icons";

interface BottomSheetProps {
  isOpen: boolean;
  title: string;
  description: string;
  closeLabel: string;
  onClose: () => void;
  children: ReactNode;
}

const styles = {
  overlay:
    "fixed inset-0 z-50 bg-scrim backdrop-blur-[2px] transition-opacity duration-interactive ease-smooth data-[state=open]:opacity-100 data-[state=closed]:opacity-0 motion-reduce:transition-none",
  content:
    "fixed inset-x-0 bottom-0 z-50 mx-auto mt-24 flex max-h-[90dvh] w-full max-w-md flex-col rounded-t-sheet border-t border-sand/50 bg-cream text-charcoal outline-none shadow-sheet",
  handleContainer:
    "relative z-0 flex h-10 w-full shrink-0 items-center justify-center",
  handlePill:
    "cursor-grab touch-none rounded-full !bg-charcoal/60 [&_[data-vaul-handle-hitarea]]:!h-50 [&_[data-vaul-handle-hitarea]]:!w-999 hover:!bg-charcoal/70 active:cursor-grabbing active:!bg-charcoal/80",
  closeButton:
    "group absolute end-4 top-1 z-10 inline-flex h-10 w-10 items-center justify-center rounded-full outline-none transition-transform duration-interactive ease-smooth active:scale-95 motion-reduce:transition-none",
  closeVisual:
    "flex size-8 items-center justify-center rounded-full bg-white text-brand ring-1 ring-black/5 transition-colors duration-interactive ease-smooth group-hover:bg-arctic motion-reduce:transition-none",
  body: "min-h-0 flex-1 overflow-y-auto overscroll-contain px-6 pb-6",
  header: "mb-5",
  title: "text-title font-bold text-charcoal",
  description: "sr-only",
} as const;

export function BottomSheet({
  isOpen,
  title,
  description,
  closeLabel,
  onClose,
  children,
}: BottomSheetProps) {
  return (
    <VaulDrawer.Root
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
      shouldScaleBackground={false}
      handleOnly
      repositionInputs={false}
    >
      <VaulDrawer.Portal>
        <VaulDrawer.Overlay className={styles.overlay} />

        <VaulDrawer.Content className={styles.content}>
          <Button
            aria-label={closeLabel}
            onPress={onClose}
            className={styles.closeButton}
          >
            <span className={styles.closeVisual}>
              <Icon name="close" size={20} />
            </span>
          </Button>

          <div className={styles.handleContainer}>
            <VaulDrawer.Handle className={styles.handlePill} />
          </div>

          <div className={styles.body}>
            <div className={styles.header}>
              <VaulDrawer.Title className={styles.title}>
                {title}
              </VaulDrawer.Title>
              <VaulDrawer.Description className={styles.description}>
                {description}
              </VaulDrawer.Description>
            </div>

            {children}
          </div>
        </VaulDrawer.Content>
      </VaulDrawer.Portal>
    </VaulDrawer.Root>
  );
}
