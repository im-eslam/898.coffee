import type { ReactNode } from "react";
import { useStrings } from "@/shared/i18n";
import { ScrollToTop } from "@/shared/router";
import type { NavTab, TabKey } from "../routes";
import { BottomNav } from "./components/bottom-nav";
import { MobileHeader } from "./components/mobile-header";
import { PageBoundary } from "./components/page-boundary";
import { SideNav } from "./components/side-nav";
import { strings } from "./strings";
import { useShell } from "./use-shell";

interface ShellProps {
  tabs: readonly NavTab[];
  activeKey: TabKey;
  onLogout: () => Promise<void>;
  children: ReactNode;
}

export function Shell({ tabs, activeKey, onLogout, children }: ShellProps) {
  const s = useStrings(strings);
  const { loggingOut, signOut } = useShell(onLogout);

  return (
    <div className="flex min-h-dvh flex-col bg-slate-100 md:h-dvh md:flex-row md:gap-3 md:p-3">
      <ScrollToTop />

      <MobileHeader pending={loggingOut} onLogout={signOut} />

      <SideNav
        tabs={tabs}
        activeKey={activeKey}
        pending={loggingOut}
        onLogout={signOut}
      />

      <main className="min-w-0 flex-1 md:overflow-y-auto">
        <div className="mx-auto w-full max-w-4xl px-4 pt-6 pb-28 md:px-6 md:pt-2 md:pb-8">
          <h1 className="mb-6 text-title font-bold text-slate-900">
            {s.tabs[activeKey]}
          </h1>
          <PageBoundary key={activeKey}>{children}</PageBoundary>
        </div>
      </main>

      <BottomNav tabs={tabs} activeKey={activeKey} />
    </div>
  );
}
