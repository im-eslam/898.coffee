import { Switch } from "react-aria-components";
import { useStrings } from "@/shared/i18n";
import { ImagePicker } from "../../components/image-picker";
import { NumberInput } from "../../components/number-input";
import { useLoadedDraft } from "../../context";
import { imageOptions } from "../../lib/selectors";
import { fill, strings } from "../../strings";
import { ui } from "../../ui";

const styles = {
  root: "grid gap-6 lg:grid-cols-2",
  card: `${ui.card} flex flex-col gap-5`,
  switch: `group inline-flex min-h-11 items-center gap-3 text-body font-medium text-slate-900 ${ui.focusRing}`,
  track:
    "relative h-6 w-11 shrink-0 rounded-full bg-slate-300 transition-colors group-data-[selected]:bg-brand",
  thumb:
    "absolute top-0.5 left-0.5 size-5 rounded-full bg-white shadow transition-transform group-data-[selected]:translate-x-5 rtl:group-data-[selected]:-translate-x-5",
  previewBody: "flex flex-col gap-2 text-small text-slate-700",
  mono: "font-mono text-slate-900",
} as const;

export function PopupTab() {
  const s = useStrings(strings);
  const { draft, update, issuesAt } = useLoadedDraft();
  const { popup } = draft;

  const messages = (path: string) =>
    issuesAt(path).map((issue) => issue.message);

  return (
    <div className={styles.root}>
      <section className={styles.card} aria-label={s.tabs.popup}>
        <Switch
          className={styles.switch}
          isSelected={popup.enabled}
          onChange={(enabled) =>
            update(
              (current) => ({
                ...current,
                popup: { ...current.popup, enabled },
              }),
              "popup"
            )
          }
        >
          <span className={styles.track} aria-hidden="true">
            <span className={styles.thumb} />
          </span>
          {s.popup.show}
        </Switch>

        <ImagePicker
          label={s.popup.image}
          placeholder={s.popup.imagePlaceholder}
          value={popup.image}
          options={imageOptions(draft)}
          errors={messages("popup.image")}
          onCommit={(image) =>
            update(
              (current) => ({
                ...current,
                popup: { ...current.popup, image },
              }),
              "popup.image"
            )
          }
        />

        <NumberInput
          label={s.popup.delay}
          value={popup.delaySeconds}
          errors={messages("popup.delaySeconds")}
          onCommit={(delaySeconds) =>
            update(
              (current) => ({
                ...current,
                popup: { ...current.popup, delaySeconds },
              }),
              "popup.delaySeconds"
            )
          }
        />
      </section>

      <section className={ui.card} aria-labelledby="popup-preview">
        <h2 id="popup-preview" className={ui.heading}>
          {s.popup.previewTitle}
        </h2>
        <div className={`${styles.previewBody} mt-3`}>
          {popup.enabled ? (
            <>
              <p>
                {fill(s.popup.previewImage, {
                  value: popup.image ?? s.popup.noImage,
                })}
              </p>
              <p>
                {fill(s.popup.previewDelay, { value: popup.delaySeconds })}
              </p>
            </>
          ) : (
            <p>{s.popup.previewOff}</p>
          )}
        </div>
      </section>
    </div>
  );
}
