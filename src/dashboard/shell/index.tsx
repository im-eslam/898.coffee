import { useState, type ReactNode } from "react";
import { useStrings } from "@/shared/i18n";
import { ScrollToTop } from "@/shared/router";
import type { NavTab, TabKey } from "../routes";
import { BottomNav } from "./components/bottom-nav";
import { MobileHeader } from "./components/mobile-header";
import { PageBoundary } from "./components/page-boundary";
import { SideNav } from "./components/side-nav";
import { strings } from "./strings";

interface ShellProps {
  tabs: readonly NavTab[];
  activeKey: TabKey;
  onLogout: () => Promise<void>;
  children: ReactNode;
}

const styles = {
  layout:
    "flex min-h-dvh flex-col bg-slate-100 md:h-dvh md:flex-row md:gap-3 md:p-3",
  main: "min-w-0 flex-1 md:overflow-y-auto",
  content: "mx-auto w-full max-w-4xl px-4 pt-6 pb-28 md:px-6 md:pt-2 md:pb-8",
  title: "mb-6 text-title font-bold text-slate-900",
} as const;

export function Shell({ tabs, activeKey, onLogout, children }: ShellProps) {
  const s = useStrings(strings);
  const [loggingOut, setLoggingOut] = useState(false);

  async function signOut() {
    setLoggingOut(true);
    try {
      await onLogout();
    } finally {
      setLoggingOut(false);
    }
  }

  return (
    <div className={styles.layout}>
      <ScrollToTop />

      <MobileHeader pending={loggingOut} onLogout={signOut} />

      <SideNav
        tabs={tabs}
        activeKey={activeKey}
        pending={loggingOut}
        onLogout={signOut}
      />

      <main className={styles.main}>
        <div className={styles.content}>
          <h1 className={styles.title}>{s.tabs[activeKey]}</h1>
          <PageBoundary key={activeKey}>{children}</PageBoundary>
        </div>
      </main>

      <BottomNav tabs={tabs} activeKey={activeKey} />
    </div>
  );
}
