import { useEffect, useRef, useState } from "react";
import { Button, Dialog, Modal, ModalOverlay } from "react-aria-components";
import { useStrings } from "@/shared/i18n";
import { Icon } from "@/shared/icons";
import type { Popup } from "@/features/menu/types/menu-models";
import { strings } from "@/features/menu/strings";

interface PromoPopupProps {
  popup: Popup;
  suppressed: boolean;
}

const styles = {
  overlay:
    "fixed inset-0 z-50 flex items-center justify-center bg-scrim p-4 data-entering:animate-scrim-in data-exiting:animate-scrim-out",
  modal: "relative outline-none data-entering:animate-reveal-in",
  dialog: "outline-none",
  image:
    "block h-auto max-h-[80dvh] w-auto max-w-[min(28rem,calc(100vw-2rem))] rounded-lg bg-white object-contain",
  close:
    "group absolute end-1 top-1 flex size-10 items-center justify-center rounded-full outline-none transition-transform duration-interactive ease-smooth active:scale-95 motion-reduce:transition-none",
  closeVisual:
    "flex size-8 items-center justify-center rounded-full bg-white text-brand ring-1 ring-black/5 transition-colors duration-interactive ease-smooth group-hover:bg-arctic motion-reduce:transition-none",
} as const;

export function PromoPopup({ popup, suppressed }: PromoPopupProps) {
  const t = useStrings(strings);
  const { enabled, image, delaySeconds } = popup;
  const [isOpen, setIsOpen] = useState(false);

  const suppressedRef = useRef(suppressed);
  useEffect(() => {
    suppressedRef.current = suppressed;
  }, [suppressed]);

  useEffect(() => {
    if (!enabled || !image) return;
    const cancelledRef = { current: false };
    const timerRef = { current: 0 };

    const loaded = new Promise<boolean>((resolve) => {
      const picture = new Image();
      picture.crossOrigin = "anonymous";
      picture.onload = () => resolve(true);
      picture.onerror = () => resolve(false);
      picture.src = image;
    });
    const waited = new Promise<void>((resolve) => {
      timerRef.current = window.setTimeout(resolve, delaySeconds * 1000);
    });

    void Promise.all([loaded, waited]).then(([ok]) => {
      if (!cancelledRef.current && ok && !suppressedRef.current)
        setIsOpen(true);
    });

    return () => {
      cancelledRef.current = true;
      window.clearTimeout(timerRef.current);
    };
  }, [enabled, image, delaySeconds]);

  if (!enabled || !image) return null;

  return (
    <ModalOverlay
      isOpen={isOpen}
      onOpenChange={setIsOpen}
      isDismissable
      className={styles.overlay}
    >
      <Modal className={styles.modal}>
        <Dialog aria-label={t.promo.alt} className={styles.dialog}>
          <img
            src={image}
            alt={t.promo.alt}
            draggable={false}
            className={styles.image}
          />
          <Button
            aria-label={t.common.close}
            onPress={() => setIsOpen(false)}
            className={styles.close}
          >
            <span className={styles.closeVisual}>
              <Icon name="close" size={18} />
            </span>
          </Button>
        </Dialog>
      </Modal>
    </ModalOverlay>
  );
}
