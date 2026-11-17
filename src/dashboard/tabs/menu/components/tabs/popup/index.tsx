import { useStrings } from "@/shared/i18n";
import { useLoadedMenu } from "../../../hooks/use-menu-context";
import { strings } from "../../../strings";
import { NumberInput } from "../../ui/number-input";
import { PopupImageField } from "./popup-image-field";
import { PopupToggleHeader } from "./popup-toggle-header";

const styles = {
  card: "flex flex-col divide-y divide-slate-100 rounded-2xl border border-slate-200 bg-white",
  body: "flex flex-col gap-6 p-6 transition-opacity duration-200",
  bodyMuted: "opacity-60",
} as const;

export function PopupTab() {
  const s = useStrings(strings);
  const { draft, popup: popupApi, issuesAt } = useLoadedMenu();
  const { popup } = draft;

  const messages = (path: string) =>
    issuesAt(path).map((issue) => issue.message);

  const imageErrors = [
    ...messages("popup.image"),
    ...(popupApi.uploadError ? [s.popup.uploadFailed] : []),
  ];

  return (
    <div>
      <section className={styles.card} aria-label={s.tabs.popup}>
        <PopupToggleHeader
          title={s.popup.show}
          subtitle={s.popup.imageRequired}
          isEnabled={popup.enabled}
          onToggle={popupApi.setEnabled}
        />

        <div
          className={`${styles.body} ${!popup.enabled ? styles.bodyMuted : ""}`}
        >
          <PopupImageField
            image={popup.image}
            isUploading={popupApi.isUploading}
            errors={imageErrors}
            labels={{
              label: s.popup.image,
              chooseImage: s.popup.chooseImage,
              uploading: s.popup.uploading,
              uploadHint: s.popup.uploadHint,
              remove: s.common.remove,
            }}
            onUpload={(file) => void popupApi.uploadImage(file)}
            onRemove={() => popupApi.setImage(null)}
          />

          <NumberInput
            label={s.popup.delay}
            value={popup.delaySeconds}
            errors={messages("popup.delaySeconds")}
            onCommit={popupApi.setDelay}
          />
        </div>
      </section>
    </div>
  );
}
