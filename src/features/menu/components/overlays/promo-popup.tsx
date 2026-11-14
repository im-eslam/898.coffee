import { useEffect, useState } from "react";
import { Dialog, Modal, ModalOverlay } from "react-aria-components";
import type { Popup } from "../../types/menu";
import { resolvePopupImageUrl } from "../../util/image";
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
  const imageUrl = resolvePopupImageUrl(image);

  const delayMs =
    Math.max(0, Number.isFinite(delaySeconds) ? delaySeconds : 0) * 1000;

  const configKey = JSON.stringify([enabled, imageUrl, delayMs]);

  const [readyKey, setReadyKey] = useState<string | null>(null);
  const [dismissedKey, setDismissedKey] = useState<string | null>(null);

  const isReady = readyKey === configKey;
  const isDismissed = dismissedKey === configKey;

  const isOpen =
    enabled && Boolean(imageUrl) && isReady && !isDismissed && !busy;

  useEffect(() => {
    if (!enabled || !imageUrl) return;

    const controller = new AbortController();
    const { signal } = controller;

    const imagePromise = new Promise<void>((resolve, reject) => {
      const imageLoader = new Image();

      signal.addEventListener(
        "abort",
        () => {
          imageLoader.onload = null;
          imageLoader.onerror = null;
        },
        { once: true }
      );

      imageLoader.onload = () => resolve();
      imageLoader.onerror = () =>
        reject(new Error("Failed to load popup image"));
      imageLoader.src = imageUrl;

      if (imageLoader.complete) {
        if (imageLoader.naturalWidth > 0) {
          resolve();
        } else {
          reject(new Error("Failed to load popup image"));
        }
      }
    });

    const delayPromise = new Promise<void>((resolve) => {
      const timerId = window.setTimeout(resolve, delayMs);

      signal.addEventListener("abort", () => window.clearTimeout(timerId), {
        once: true,
      });
    });

    Promise.all([imagePromise, delayPromise])
      .then(() => {
        if (!signal.aborted) {
          setReadyKey(configKey);
        }
      })
      .catch(() => {
        controller.abort();
      });

    return () => {
      controller.abort();
    };
  }, [enabled, imageUrl, delayMs, configKey]);

  function handleOpenChange(open: boolean) {
    if (!open) {
      setDismissedKey(configKey);
    }
  }

  if (!enabled || !imageUrl) return null;

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
            src={imageUrl}
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
