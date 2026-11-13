import { useStrings } from "@/shared/i18n";
import { Icon } from "@/shared/icons";
import { Link, type AppRoute } from "@/shared/router";
import { NAV_ICONS, type NavTab } from "../../routes";
import { strings } from "../strings";

const styles = {
  side: "flex h-12 items-center gap-3 rounded-xl px-3 text-body font-medium text-slate-600 transition-colors hover:bg-slate-100 aria-[current=page]:bg-brand/10 aria-[current=page]:font-semibold aria-[current=page]:text-brand",
  bottom:
    "flex h-14 flex-1 flex-col items-center justify-center gap-1 rounded-xl text-xs font-medium text-slate-500 transition-colors hover:bg-slate-50 aria-[current=page]:bg-brand/10 aria-[current=page]:font-semibold aria-[current=page]:text-brand",
} as const;

interface NavItemProps {
  tab: NavTab;
  active: boolean;
  variant: "side" | "bottom";
}

export function NavItem({ tab, active, variant }: NavItemProps) {
  const s = useStrings(strings);
  const isSide = variant === "side";

  return (
    <Link
      href={tab.href as AppRoute}
      className={styles[variant]}
      aria-current={active ? "page" : undefined}
    >
      <Icon name={NAV_ICONS[tab.key]} size={isSide ? 20 : 22} />
      <span>{s.tabs[tab.key]}</span>
    </Link>
  );
}
