import { Button } from "react-aria-components";
import { useStrings } from "@/shared/i18n";
import { Icon } from "@/shared/icons";
import { useDraft } from "../context";
import { fill, strings } from "../strings";
import { ui } from "../ui";

const styles = {
  root: "flex items-center justify-between gap-3 rounded-xl border border-slate-200 bg-slate-50 p-3 text-small text-slate-700",
} as const;

export function PairingNotice() {
  const s = useStrings(strings);
  const { removedPairings, dismissPairingNotice } = useDraft();

  if (removedPairings === 0) return null;

  return (
    <div role="status" className={styles.root}>
      <p>
        {removedPairings === 1
          ? s.pairings.removedOne
          : fill(s.pairings.removedMany, { count: removedPairings })}
      </p>
      <Button
        className={ui.iconButton}
        aria-label={s.common.cancel}
        onPress={dismissPairingNotice}
      >
        <Icon name="close" className="size-4" />
      </Button>
    </div>
  );
}
