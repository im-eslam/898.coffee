import { useState } from "react";
import {
  Button,
  ComboBox,
  DropZone,
  FileTrigger,
  Input,
  Label,
  ListBox,
  ListBoxItem,
  Popover,
  type DropZoneProps,
} from "react-aria-components";

const focusRing =
  "outline-none data-[focus-visible]:outline-2 data-[focus-visible]:outline-offset-2 data-[focus-visible]:outline-brand";

const styles = {
  field: "flex flex-col gap-3",
  label: "text-small font-medium text-slate-700",
  dropzone:
    "flex flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed border-slate-300 bg-slate-50/60 p-6 text-center transition-colors data-[drop-target]:border-brand data-[drop-target]:bg-brand/5",
  previewCard:
    "flex flex-col gap-3 rounded-xl border border-slate-200 bg-slate-50/70 p-3 sm:flex-row sm:items-center sm:justify-between",
  previewMedia: "flex min-w-0 items-center gap-3",
  thumb:
    "flex size-16 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-slate-200 bg-white",
  thumbImg: "size-full object-cover",
  thumbPlaceholder: "text-xs font-medium text-slate-500",
  fileMeta: "flex min-w-0 flex-col",
  fileName: "truncate text-small font-medium text-slate-800",
  fileHint: "text-xs text-slate-500",
  actions: "flex shrink-0 items-center gap-2",
  primaryBtn: `inline-flex h-9 cursor-pointer items-center justify-center rounded-lg border border-slate-300 bg-white px-3.5 text-small font-semibold text-slate-700 transition-colors data-[hovered]:border-brand data-[hovered]:text-brand data-[disabled]:cursor-not-allowed data-[disabled]:opacity-60 ${focusRing}`,
  dangerBtn: `inline-flex h-9 cursor-pointer items-center justify-center rounded-lg px-3 text-small font-medium text-error transition-colors data-[hovered]:bg-error/5 data-[disabled]:cursor-not-allowed data-[disabled]:opacity-60 ${focusRing}`,
  hint: "text-small text-slate-500",
  error: "text-small font-medium text-error",
  pick: "flex flex-col gap-1.5",
  pickInput:
    "h-11 w-full rounded-lg border border-slate-300 bg-white px-3 text-body text-slate-900 outline-none placeholder:text-slate-400 data-[focused]:border-brand data-[focused]:ring-2 data-[focused]:ring-brand/20",
  popover:
    "max-h-72 w-(--trigger-width) overflow-auto rounded-lg border border-slate-200 bg-white p-1 shadow-lg",
  option:
    "flex cursor-pointer items-center rounded-md px-3 py-2 text-body text-slate-900 outline-none data-[focused]:bg-brand/10",
  noMatches: "px-3 py-2 text-small text-slate-500",
} as const;

export interface ProductImageLabels {
  chooseImage: string;
  uploading: string;
  uploadHint: string;
  remove: string;
  pickExisting: string;
  searchImages: string;
  noImages: string;
}

export interface ProductImageFieldProps {
  label: string;
  value: string | null;
  /** Images already used by other products or the popup. */
  options: string[];
  isUploading: boolean;
  errors: string[];
  labels: ProductImageLabels;
  onUpload: (file: File) => void;
  onPick: (image: string) => void;
  onRemove: () => void;
}

/** Only absolute URLs and root paths can be previewed. Bare filenames show a placeholder. */
function isPreviewable(value: string): boolean {
  return /^(https?:)?\/\//.test(value) || value.startsWith("/");
}

export function ProductImageField({
  label,
  value,
  options,
  isUploading,
  errors,
  labels,
  onUpload,
  onPick,
  onRemove,
}: ProductImageFieldProps) {
  const [text, setText] = useState("");
  const items = options.map((id) => ({ id }));
  const fileName = value ? (value.split("/").pop() ?? value) : "";

  function handleSelect(files: FileList | null) {
    const file = files?.[0];
    if (file) onUpload(file);
  }

  const handleDrop: NonNullable<DropZoneProps["onDrop"]> = async (event) => {
    const item = event.items.find(
      (entry) => entry.kind === "file" && entry.type === "image/webp"
    );
    if (!item || item.kind !== "file") return;
    onUpload(await item.getFile());
  };

  const trigger = (className: string, text: string) => (
    <FileTrigger
      acceptedFileTypes={["image/webp"]}
      allowsMultiple={false}
      onSelect={handleSelect}
    >
      <Button className={className} isDisabled={isUploading}>
        {isUploading ? labels.uploading : text}
      </Button>
    </FileTrigger>
  );

  return (
    <div className={styles.field}>
      <span className={styles.label}>{label}</span>

      {value ? (
        <div className={styles.previewCard}>
          <div className={styles.previewMedia}>
            <div className={styles.thumb}>
              {isPreviewable(value) ? (
                <img
                  src={value}
                  alt=""
                  className={styles.thumbImg}
                  loading="lazy"
                />
              ) : (
                <span className={styles.thumbPlaceholder}>WEBP</span>
              )}
            </div>
            <div className={styles.fileMeta}>
              <span className={styles.fileName} dir="ltr">
                {fileName}
              </span>
              <span className={styles.fileHint}>{labels.uploadHint}</span>
            </div>
          </div>
          <div className={styles.actions}>
            {trigger(styles.primaryBtn, labels.chooseImage)}
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
          onDrop={(event) => void handleDrop(event)}
        >
          {trigger(styles.primaryBtn, labels.chooseImage)}
          <span className={styles.hint}>{labels.uploadHint}</span>
        </DropZone>
      )}

      <ComboBox
        className={styles.pick}
        items={items}
        selectedKey={null}
        inputValue={text}
        onInputChange={setText}
        menuTrigger="focus"
        onSelectionChange={(key) => {
          if (typeof key === "string") {
            onPick(key);
            setText("");
          }
        }}
      >
        <Label className={styles.label}>{labels.pickExisting}</Label>
        <Input
          className={styles.pickInput}
          placeholder={labels.searchImages}
          dir="ltr"
        />
        <Popover className={styles.popover}>
          <ListBox
            className="outline-none"
            renderEmptyState={() => (
              <p className={styles.noMatches}>{labels.noImages}</p>
            )}
          >
            {(item: { id: string }) => (
              <ListBoxItem
                id={item.id}
                textValue={item.id}
                className={styles.option}
              >
                <span dir="ltr">{item.id}</span>
              </ListBoxItem>
            )}
          </ListBox>
        </Popover>
      </ComboBox>

      {errors.length > 0 ? (
        <p className={styles.error} role="alert">
          {errors.join(" ")}
        </p>
      ) : null}
    </div>
  );
}
