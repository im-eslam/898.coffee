import {
  Button,
  DropZone,
  FileTrigger,
  type DropZoneProps,
} from "react-aria-components";

const focusRing =
  "outline-none data-[focus-visible]:outline-2 data-[focus-visible]:outline-offset-2 data-[focus-visible]:outline-brand";
const styles = {
  field: "flex flex-col gap-2",
  label: "text-small font-medium text-slate-800",
  dropzone:
    "flex flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed border-slate-300 bg-slate-50/60 p-6 text-center transition-colors data-[drop-target]:border-brand data-[drop-target]:bg-brand/5",
  previewCard:
    "flex flex-col gap-3 rounded-xl border border-slate-200 bg-slate-50/70 p-3 sm:flex-row sm:items-center sm:justify-between",
  previewMedia: "flex min-w-0 items-center gap-3",
  thumbnail:
    "size-16 shrink-0 rounded-lg border border-slate-200 bg-white object-cover",
  fileMeta: "flex min-w-0 flex-col",
  fileName: "truncate text-small font-medium text-slate-800",
  fileHint: "text-xs text-slate-500",
  actions: "flex shrink-0 items-center gap-2",
  primaryBtn: `inline-flex h-9 cursor-pointer items-center justify-center rounded-lg border border-slate-300 bg-white px-3.5 text-small font-semibold text-slate-700 transition-colors data-[hovered]:border-brand data-[hovered]:text-brand data-[disabled]:cursor-not-allowed data-[disabled]:opacity-60 ${focusRing}`,
  dangerBtn: `inline-flex h-9 cursor-pointer items-center justify-center rounded-lg px-3 text-small font-medium text-error transition-colors data-[hovered]:bg-red-50 data-[disabled]:cursor-not-allowed data-[disabled]:opacity-60 ${focusRing}`,
  hint: "text-small text-slate-500",
  error: "text-small font-medium text-error",
} as const;

export interface PopupImageFieldLabels {
  label: string;
  chooseImage: string;
  uploading: string;
  uploadHint: string;
  remove: string;
}

export interface PopupImageFieldProps {
  image: string | null;
  isUploading: boolean;
  errors: string[];
  labels: PopupImageFieldLabels;
  onUpload: (file: File) => void;
  onRemove: () => void;
}

export function PopupImageField({
  image,
  isUploading,
  errors,
  labels,
  onUpload,
  onRemove,
}: PopupImageFieldProps) {
  function handleSelect(files: FileList | null) {
    const file = files?.[0];
    if (file) onUpload(file);
  }

  const previewUrl =
    image && (image.startsWith("/") || /^(https?:)?\/\//.test(image))
      ? image
      : image
        ? `${import.meta.env.BASE_URL}menu/popup/${image}`
        : null;

  const handleDrop: NonNullable<DropZoneProps["onDrop"]> = async (e) => {
    const fileItem = e.items.find(
      (item) => item.kind === "file" && item.type === "image/webp"
    );
    if (!fileItem || fileItem.kind !== "file") return;
    const file = await fileItem.getFile();
    onUpload(file);
  };

  const fileTrigger = (
    <FileTrigger
      acceptedFileTypes={["image/webp"]}
      allowsMultiple={false}
      onSelect={handleSelect}
    >
      <Button className={styles.primaryBtn} isDisabled={isUploading}>
        {isUploading ? labels.uploading : labels.chooseImage}
      </Button>
    </FileTrigger>
  );

  return (
    <div className={styles.field}>
      <span className={styles.label}>{labels.label}</span>

      {image ? (
        <div className={styles.previewCard}>
          <div className={styles.previewMedia}>
            <img
              src={previewUrl ?? image}
              alt=""
              className={styles.thumbnail}
              loading="lazy"
            />
            <div className={styles.fileMeta}>
              <span className={styles.fileName} dir="ltr">
                {image.split("/").pop() ?? image}
              </span>
              <span className={styles.fileHint}>{labels.uploadHint}</span>
            </div>
          </div>

          <div className={styles.actions}>
            {fileTrigger}
            <Button
              className={styles.dangerBtn}
              isDisabled={isUploading}
              onPress={onRemove}
            >
              {labels.remove}
            </Button>
          </div>
        </div>
      ) : (
        <DropZone
          className={styles.dropzone}
          getDropOperation={(types) =>
            types.has("image/webp") ? "copy" : "cancel"
          }
          onDrop={(e) => void handleDrop(e)}
        >
          {fileTrigger}
          <span className={styles.hint}>{labels.uploadHint}</span>
        </DropZone>
      )}

      {errors.length > 0 ? (
        <p className={styles.error} role="alert">
          {errors.join(" ")}
        </p>
      ) : null}
    </div>
  );
}
