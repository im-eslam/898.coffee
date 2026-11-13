import { useStrings } from "@/shared/i18n";
import type { NavTab, TabKey } from "../../routes";
import { strings } from "../strings";
import { NavItem } from "./nav-item";

interface BottomNavProps {
  tabs: readonly NavTab[];
  activeKey: TabKey;
}

export function BottomNav({ tabs, activeKey }: BottomNavProps) {
  const s = useStrings(strings);

  return (
    <nav
      aria-label={s.nav}
      className="fixed inset-x-3 bottom-[calc(0.75rem+env(safe-area-inset-bottom))] z-20 flex gap-1 rounded-2xl border border-slate-200 bg-white p-1.5 md:hidden"
    >
      {tabs.map((tab) => (
        <NavItem
          key={tab.key}
          tab={tab}
          active={tab.key === activeKey}
          variant="bottom"
        />
      ))}
    </nav>
  );
}
