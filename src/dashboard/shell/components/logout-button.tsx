import { Button } from "react-aria-components";
import { useStrings } from "@/shared/i18n";
import { Icon } from "@/shared/icons";
import { strings } from "../strings";

const styles = {
  block:
    "flex h-11 w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 text-small font-semibold text-slate-700 transition-colors data-hovered:bg-slate-100 data-pressed:bg-slate-200 data-disabled:opacity-60",
  compact:
    "flex h-9 items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 text-small font-semibold text-slate-700 transition-colors data-hovered:bg-slate-50 data-pressed:bg-slate-100 data-disabled:opacity-60",
} as const;

interface LogoutButtonProps {
  pending: boolean;
  onPress: () => void;
  variant: "block" | "compact";
}

export function LogoutButton({ pending, onPress, variant }: LogoutButtonProps) {
  const s = useStrings(strings);

  return (
    <Button isPending={pending} onPress={onPress} className={styles[variant]}>
      <Icon name="exit" size={18} />
      {pending ? s.account.loggingOut : s.account.logout}
    </Button>
  );
}
