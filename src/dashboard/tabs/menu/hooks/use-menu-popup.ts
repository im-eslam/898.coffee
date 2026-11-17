import { useCallback, useState } from "react";
import toast from "react-hot-toast";
import { useStrings } from "@/shared/i18n";
import { reportError } from "@/shared/logging";
import { uploadPopupImage } from "../api/menu";
import { strings } from "../strings";
import type { MenuStore } from "../types/store";

export function useMenuPopup({ update }: MenuStore) {
  const s = useStrings(strings);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState(false);

  const setEnabled = useCallback(
    (enabled: boolean) =>
      update(
        (current) => ({ ...current, popup: { ...current.popup, enabled } }),
        "popup"
      ),
    [update]
  );

  const setImage = useCallback(
    (image: string | null) =>
      update(
        (current) => ({ ...current, popup: { ...current.popup, image } }),
        "popup.image"
      ),
    [update]
  );

  const setDelay = useCallback(
    (delaySeconds: number) =>
      update(
        (current) => ({
          ...current,
          popup: { ...current.popup, delaySeconds },
        }),
        "popup.delaySeconds"
      ),
    [update]
  );

  const uploadImage = useCallback(
    async (file: File) => {
      setUploadError(false);
      setIsUploading(true);
      try {
        const image = await uploadPopupImage(file);
        setImage(image);
      } catch (cause: unknown) {
        reportError(cause, {
          feature: "dashboard",
          operation: "popup image upload",
        });
        setUploadError(true);
        toast.error(s.popup.uploadFailed);
      } finally {
        setIsUploading(false);
      }
    },
    [s.popup.uploadFailed, setImage]
  );

  return {
    setEnabled,
    setImage,
    setDelay,
    uploadImage,
    isUploading,
    uploadError,
  };
}

export type PopupApi = ReturnType<typeof useMenuPopup>;
