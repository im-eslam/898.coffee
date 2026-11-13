import { Button } from "react-aria-components";
import { Drawer as VaulDrawer } from "vaul";
import { useStrings } from "@/shared/i18n";
import { Icon } from "@/shared/icons";
import type { Review } from "../api";
import { strings } from "../strings";
import { ReviewDetailBody } from "./review-details";

const styles = {
  overlay:
    "fixed inset-0 z-50 bg-slate-900/40 transition-opacity duration-200 data-[state=open]:opacity-100 data-[state=closed]:opacity-0 data-[state=closed]:!pointer-events-none motion-reduce:transition-none",
  content:
    "fixed inset-x-0 bottom-0 z-50 mx-auto flex max-h-[88dvh] w-full max-w-lg flex-col overflow-clip rounded-t-2xl bg-white text-slate-900 shadow-xl outline-none data-[state=closed]:!pointer-events-none md:rounded-2xl",
  handleRow:
    "relative z-0 flex h-8 w-full shrink-0 items-center justify-center",
  handle:
    "cursor-grab touch-none rounded-full !bg-slate-300 [&_[data-vaul-handle-hitarea]]:!h-20 [&_[data-vaul-handle-hitarea]]:!w-999 active:cursor-grabbing",
  body: "flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto overscroll-contain px-6 pt-4 pb-[max(2rem,env(safe-area-inset-bottom))] sm:px-8",
  topRow: "absolute end-3 top-3 z-10 flex justify-end",
  close:
    "inline-flex size-9 items-center justify-center rounded-full bg-white/80 text-slate-500 data-[hovered]:bg-slate-100",
  srOnly: "sr-only",
} as const;

interface ReviewSheetProps {
  review: Review | null;
  isOpen: boolean;
  resetKey: number;
  deleting: boolean;
  onClose: () => void;
  onDelete: (review: Review) => Promise<boolean>;
}

export function ReviewSheet({
  review,
  isOpen,
  resetKey,
  deleting,
  onClose,
  onDelete,
}: ReviewSheetProps) {
  const s = useStrings(strings);

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
          <div className={styles.handleRow}>
            <VaulDrawer.Handle className={styles.handle} />
          </div>
          <VaulDrawer.Title className={styles.srOnly}>
            {s.dialog.title}
          </VaulDrawer.Title>
          <VaulDrawer.Description className={styles.srOnly}>
            {s.dialog.description}
          </VaulDrawer.Description>

          <div className={styles.body}>
            <div className={styles.topRow}>
              <Button
                onPress={onClose}
                aria-label={s.dialog.close}
                className={styles.close}
              >
                <Icon name="close" size={18} />
              </Button>
            </div>

            {review && (
              <ReviewDetailBody
                key={resetKey}
                review={review}
                deleting={deleting}
                onDelete={onDelete}
              />
            )}
          </div>
        </VaulDrawer.Content>
      </VaulDrawer.Portal>
    </VaulDrawer.Root>
  );
}
