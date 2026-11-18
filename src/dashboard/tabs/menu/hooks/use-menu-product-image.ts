import { useCallback, useState } from "react";
import toast from "react-hot-toast";
import { useStrings } from "@/shared/i18n";
import { reportError } from "@/shared/logging";
import { uploadProductImage } from "../api/menu";
import { strings } from "../strings";

/**
 * Uploads a product image and hands the stored image path to `onUploaded`.
 * The product itself is not changed until the dialog is saved.
 */
export function useProductImageUpload(onUploaded: (image: string) => void) {
  const s = useStrings(strings);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState(false);

  const upload = useCallback(
    async (file: File) => {
      setUploadError(false);
      setIsUploading(true);
      try {
        const image = await uploadProductImage(file);
        onUploaded(image);
      } catch (cause: unknown) {
        reportError(cause, {
          feature: "dashboard",
          operation: "product image upload",
        });
        setUploadError(true);
        toast.error(s.popup.uploadFailed);
      } finally {
        setIsUploading(false);
      }
    },
    [onUploaded, s.popup.uploadFailed]
  );

  return { upload, isUploading, uploadError };
}
