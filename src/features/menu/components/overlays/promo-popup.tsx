import { useEffect, useState } from "react";
import { Dialog, Modal, ModalOverlay } from "react-aria-components";
import type { Popup } from "../../types/menu-models";
import { MenuButton } from "../ui/menu-button";

interface Props {
  popup: Popup;
  busy: boolean;
}

const styles = {
  overlay:
    "fixed inset-0 z-50 flex items-center justify-center bg-scrim p-4 data-entering:animate-scrim-in data-exiting:animate-scrim-out motion-reduce:animate-none",
  modal:
    "relative outline-none data-entering:animate-reveal-in data-exiting:animate-reveal-out motion-reduce:animate-none",
  dialog: "outline-none",
  image:
    "block h-auto max-h-[80dvh] w-auto max-w-[min(28rem,calc(100vw-2rem))] rounded-lg bg-white object-contain",
  close: "absolute end-1 top-1 z-10",
} as const;

export function PromoPopup({ popup, busy }: Props) {
  const { enabled, image, delaySeconds } = popup;

  const delayMs =
    Math.max(0, Number.isFinite(delaySeconds) ? delaySeconds : 0) * 1000;

  const configKey = JSON.stringify([enabled, image, delayMs]);

  const [readyKey, setReadyKey] = useState<string | null>(null);
  const [dismissedKey, setDismissedKey] = useState<string | null>(null);

  const isReady = readyKey === configKey;
  const isDismissed = dismissedKey === configKey;

  const isOpen = enabled && Boolean(image) && isReady && !isDismissed && !busy;

  useEffect(() => {
    if (!enabled || !image) return;

    let active = true;
    let imageLoaded = false;
    let delayElapsed = false;
    let timerId: number | undefined;

    const imageLoader = new Image();

    function markReady() {
      if (!active || !imageLoaded || !delayElapsed) return;

      active = false;
      setReadyKey(configKey);
    }

    function handleImageLoad() {
      imageLoaded = true;
      markReady();
    }

    function handleImageError() {
      active = false;

      if (timerId !== undefined) {
        window.clearTimeout(timerId);
      }
    }

    imageLoader.onload = handleImageLoad;
    imageLoader.onerror = handleImageError;

    timerId = window.setTimeout(() => {
      delayElapsed = true;
      markReady();
    }, delayMs);

    imageLoader.src = image;

    if (imageLoader.complete) {
      if (imageLoader.naturalWidth > 0) {
        handleImageLoad();
      } else {
        handleImageError();
      }
    }

    return () => {
      active = false;

      if (timerId !== undefined) {
        window.clearTimeout(timerId);
      }

      imageLoader.onload = null;
      imageLoader.onerror = null;
    };
  }, [enabled, image, delayMs, configKey]);

  function handleOpenChange(open: boolean) {
    if (!open) {
      setDismissedKey(configKey);
    }
  }

  if (!enabled || !image) return null;

  return (
    <ModalOverlay
      isOpen={isOpen}
      onOpenChange={handleOpenChange}
      isDismissable
      className={styles.overlay}
    >
      <Modal className={styles.modal}>
        <Dialog className={styles.dialog}>
          <img
            src={image}
            alt=""
            draggable={false}
            decoding="async"
            className={styles.image}
          />

          <MenuButton
            variant="close"
            size="s"
            onPress={() => handleOpenChange(false)}
            className={styles.close}
          />
        </Dialog>
      </Modal>
    </ModalOverlay>
  );
}
