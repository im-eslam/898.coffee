import type { ReactNode } from "react";
import { Drawer as VaulDrawer } from "vaul";
import { Button } from "react-aria-components";
import { Icon } from "@/shared/icons";

interface ReviewShellStrings {
  closeLabel: string;
  title: string;
  description: string;
}

interface ReviewShellProps {
  strings: ReviewShellStrings;
  isOpen: boolean;
  onClose: () => void;
  footer?: ReactNode;
  children: ReactNode;
}

const styles = {
  overlay:
    "fixed inset-0 z-50 bg-scrim transition-opacity duration-(--duration-interactive) ease-smooth data-[state=open]:opacity-100 data-[state=closed]:!pointer-events-none data-[state=closed]:opacity-0 motion-reduce:transition-none",
  content:
    "fixed inset-x-0 bottom-0 z-50 mx-auto flex max-h-[88dvh] w-full max-w-120 flex-col overflow-clip rounded-t-sheet border-t border-sand/50 bg-cream text-charcoal outline-none data-[state=closed]:!pointer-events-none md:max-w-140",
  closeButton:
    "group absolute end-2 top-1 z-10 inline-flex size-10 items-center justify-center rounded-full outline-none transition-transform duration-(--duration-interactive) ease-smooth [@media(hover:hover)_and_(pointer:fine)]:active:scale-95 motion-reduce:transition-none",
  closeVisual:
    "flex size-8 items-center justify-center rounded-full bg-white text-brand ring-1 ring-black/5 transition-colors duration-(--duration-interactive) ease-smooth group-hover:bg-arctic motion-reduce:transition-none",
  handleRow:
    "relative z-0 flex h-11 w-full shrink-0 items-center justify-center",
  handle:
    "cursor-grab touch-none rounded-full !bg-charcoal/60 [&_[data-vaul-handle-hitarea]]:!h-20 [&_[data-vaul-handle-hitarea]]:!w-999 hover:!bg-charcoal/70 active:cursor-grabbing active:!bg-charcoal/80",
  body: "flex min-h-0 flex-1 flex-col overflow-y-auto overscroll-contain px-4 pb-6 md:px-6",
  header: "mb-5 pe-12",
  title: "text-title font-bold text-balance text-charcoal",
  description: "sr-only",
  footer:
    "shrink-0 border-t-[0.5px] border-sand/40 bg-cream px-4 pt-3 pb-[max(1rem,env(safe-area-inset-bottom))] md:px-6",
} as const;

export function ReviewShell({
  strings: s,
  isOpen,
  onClose,
  footer,
  children,
}: ReviewShellProps) {
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
        <VaulDrawer.Overlay className={styles.overlay} />

        <VaulDrawer.Content className={styles.content}>
          <Button
            aria-label={s.closeLabel}
            onPress={onClose}
            className={styles.closeButton}
          >
            <span className={styles.closeVisual}>
              <Icon name="close" size={20} />
            </span>
          </Button>

          <div className={styles.handleRow}>
            <VaulDrawer.Handle className={styles.handle} />
          </div>

          <div className={styles.body}>
            <div className={styles.header}>
              <VaulDrawer.Title className={styles.title}>
                {s.title}
              </VaulDrawer.Title>
              <VaulDrawer.Description className={styles.description}>
                {s.description}
              </VaulDrawer.Description>
            </div>

            {children}
          </div>

          {footer && <div className={styles.footer}>{footer}</div>}
        </VaulDrawer.Content>
      </VaulDrawer.Portal>
    </VaulDrawer.Root>
  );
}
