import { Button } from "react-aria-components";
import { useStrings } from "@/shared/i18n";
import { Icon } from "@/shared/icons";
import { useMenuContext } from "../../../hooks/use-menu-context";
import { strings, fill } from "../../../strings";

const focusRing =
  "outline-none data-[focus-visible]:outline-2 data-[focus-visible]:outline-offset-2 data-[focus-visible]:outline-brand";

const styles = {
  root: "flex items-center justify-between gap-3 rounded-xl border border-slate-200 bg-slate-50 p-3 text-small text-slate-700",
  iconButton: `inline-flex size-11 shrink-0 items-center justify-center rounded-lg text-slate-600 transition-colors data-[hovered]:bg-slate-100 data-[disabled]:cursor-not-allowed data-[disabled]:opacity-40 ${focusRing}`,
} as const;

export function PairingNotice() {
  const s = useStrings(strings);
  const { status, dismissPairingNotice } = useMenuContext();
  const { removedPairings } = status;

  if (removedPairings === 0) return null;

  return (
    <div role="status" className={styles.root}>
      <p>
        {removedPairings === 1
          ? s.pairings.removedOne
          : fill(s.pairings.removedMany, { count: removedPairings })}
      </p>
      <Button
        className={styles.iconButton}
        aria-label={s.common.cancel}
        onPress={dismissPairingNotice}
      >
        <Icon name="close" className="size-4" />
      </Button>
    </div>
  );
}
