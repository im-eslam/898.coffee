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

const styles = {
  aside:
    "hidden w-64 shrink-0 flex-col rounded-2xl border border-slate-200 bg-white p-4 md:flex",
  brandWrap: "px-2 pt-2 pb-6",
  nav: "flex flex-1 flex-col gap-1",
} as const;

export function SideNav({ tabs, activeKey, pending, onLogout }: SideNavProps) {
  const s = useStrings(strings);

  return (
    <aside className={styles.aside}>
      <div className={styles.brandWrap}>
        <Brand />
      </div>

      <nav aria-label={s.nav} className={styles.nav}>
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
