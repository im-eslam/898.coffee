import { useStrings } from "@/shared/i18n";
import type { NavTab, TabKey } from "../../routes";
import { strings } from "../strings";
import { Brand } from "./brand";
import { LogoutButton } from "./logout-button";
import { NavItem } from "./nav-item";

interface SideNavProps {
  tabs: readonly NavTab[];
  activeKey: TabKey;
  pending: boolean;
  onLogout: () => void;
}

export function SideNav({ tabs, activeKey, pending, onLogout }: SideNavProps) {
  const s = useStrings(strings);

  return (
    <aside className="hidden w-64 shrink-0 flex-col rounded-2xl border border-slate-200 bg-white p-4 shadow-sm md:flex">
      <div className="px-2 pt-2 pb-6">
        <Brand />
      </div>

      <nav aria-label={s.nav} className="flex flex-1 flex-col gap-1">
        {tabs.map((tab) => (
          <NavItem
            key={tab.key}
            tab={tab}
            active={tab.key === activeKey}
            variant="side"
          />
        ))}
      </nav>

      <LogoutButton pending={pending} onPress={onLogout} variant="block" />
    </aside>
  );
}
