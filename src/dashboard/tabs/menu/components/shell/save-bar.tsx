import { useState } from "react";
import { Button, Toolbar } from "react-aria-components";
import { useStrings } from "@/shared/i18n";
import { useMenuContext } from "../../hooks/use-menu-context";
import { ConfirmModal } from "../ui/confirm-modal";
import { strings, fill } from "../../strings";

const focusRing =
  "outline-none data-[focus-visible]:outline-2 data-[focus-visible]:outline-offset-2 data-[focus-visible]:outline-brand";

const styles = {
  bar: "sticky top-0 z-20 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3",
  status: "text-small font-medium",
  statusClean: "text-slate-500",
  statusDirty: "text-slate-900",
  statusError: "text-error",
  actions: "flex items-center gap-2",
  button: `inline-flex h-11 items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-4 text-small font-semibold text-slate-700 transition-colors data-[hovered]:bg-slate-50 data-[disabled]:cursor-not-allowed data-[disabled]:opacity-50 ${focusRing}`,
  primary: `inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-brand px-5 text-small font-semibold text-white transition-colors data-[hovered]:bg-navy data-[disabled]:cursor-not-allowed data-[disabled]:opacity-60 ${focusRing}`,
  spinner:
    "size-4 animate-spin rounded-full border-2 border-white/40 border-t-white motion-reduce:animate-none",
} as const;

function formatTime(date: Date): string {
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

export function SaveBar() {
  const s = useStrings(strings);
  const { status, save, reload } = useMenuContext();
  const { isDirty, isSaving, isReloading, saveStatus, savedAt } = status;
  const [confirming, setConfirming] = useState(false);

  let statusText = s.saveBar.clean;
  let statusClass: string = styles.statusClean;
  if (isSaving) {
    statusText = s.saveBar.saving;
    statusClass = styles.statusDirty;
  } else if (saveStatus === "error") {
    statusText = s.saveBar.failed;
    statusClass = styles.statusError;
  } else if (isDirty) {
    statusText = s.saveBar.dirty;
    statusClass = styles.statusDirty;
  } else if (savedAt) {
    statusText = fill(s.saveBar.savedAt, { time: formatTime(savedAt) });
  }

  const canSave = (isDirty || saveStatus === "error") && !isSaving;

  function requestReload() {
    if (isDirty) setConfirming(true);
    else void reload();
  }

  return (
    <>
      <Toolbar aria-label={s.saveBar.label} className={styles.bar}>
        <p role="status" className={`${styles.status} ${statusClass}`}>
          {statusText}
        </p>
        <div className={styles.actions}>
          <Button
            className={styles.button}
            isDisabled={isSaving || isReloading}
            onPress={requestReload}
          >
            {isReloading ? s.saveBar.reloading : s.saveBar.reload}
          </Button>
          <Button
            className={styles.primary}
            isDisabled={!canSave}
            onPress={() => void save()}
          >
            {isSaving ? <span className={styles.spinner} aria-hidden /> : null}
            {isSaving ? s.saveBar.saving : s.saveBar.save}
          </Button>
        </div>
      </Toolbar>
      <ConfirmModal
        isOpen={confirming}
        title={s.saveBar.reloadTitle}
        text={s.saveBar.reloadText}
        confirmLabel={s.saveBar.reloadConfirm}
        cancelLabel={s.saveBar.keepEditing}
        destructive
        onCancel={() => setConfirming(false)}
        onConfirm={() => {
          setConfirming(false);
          void reload();
        }}
      />
    </>
  );
}
