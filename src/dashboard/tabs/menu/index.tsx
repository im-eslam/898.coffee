import { useState, type ReactNode } from "react";
import {
  Button,
  Tab,
  TabList,
  TabPanel,
  Tabs,
  type Key,
} from "react-aria-components";
import { useStrings } from "@/shared/i18n";
import { ConflictModal } from "./components/conflict-modal";
import { IssueSummary } from "./components/issue-summary";
import { LeaveGuard } from "./components/leave-guard";
import { SaveBar } from "./components/save-bar";
import { SessionModal } from "./components/session-modal";
import { MenuDraftProvider, useDraft } from "./hooks/use-draft-context";
import { allProducts } from "./lib/selectors";
import { strings } from "./strings";
import { AddOnsTab } from "./tabs/addons";
import { CategoriesTab } from "./tabs/categories";
import { GeneralTab } from "./tabs/general";
import { PairingsTab } from "./tabs/pairings";
import { PopupTab } from "./tabs/popup";
import { ProductsTab } from "./tabs/products";
import { SignaturesTab } from "./tabs/signatures";
import { DEFAULT_MENU_TAB, MENU_TABS, type MenuTabKey } from "./types/ui";

const focusRing =
  "outline-none data-[focus-visible]:outline-2 data-[focus-visible]:outline-offset-2 data-[focus-visible]:outline-brand";

const styles = {
  page: "flex w-full flex-col gap-5",
  tabList:
    "flex gap-1 overflow-x-auto border-b border-slate-200 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
  tab: `flex min-h-11 shrink-0 cursor-pointer items-center gap-2 border-b-2 border-transparent px-4 text-small font-semibold text-slate-600 transition-colors data-[hovered]:text-slate-900 data-[selected]:border-brand data-[selected]:text-brand ${focusRing}`,
  count:
    "rounded-full bg-slate-100 px-2 py-0.5 text-small font-medium text-slate-700",
  panel: "outline-none",
  card: "rounded-2xl border border-slate-200 bg-white p-6",
  heading: "text-heading font-semibold text-slate-900",
  primary: `inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-brand px-5 text-small font-semibold text-white transition-colors data-[hovered]:bg-navy data-[disabled]:cursor-not-allowed data-[disabled]:opacity-60 ${focusRing}`,
  stateText: "text-body text-slate-600",
} as const;

const stateCardClass = `${styles.card} flex flex-col items-center gap-4 py-12 text-center`;

function readTab(): MenuTabKey {
  const value = new URLSearchParams(window.location.search).get("menu");
  return MENU_TABS.find((tab) => tab === value) ?? DEFAULT_MENU_TAB;
}

function writeTab(tab: MenuTabKey) {
  const url = new URL(window.location.href);
  url.searchParams.set("menu", tab);
  window.history.replaceState(window.history.state, "", url);
}

function StateCard({ children }: { children: ReactNode }) {
  return <div className={stateCardClass}>{children}</div>;
}

function MenuContent() {
  const s = useStrings(strings);
  const { draft, loadState, retryLoad } = useDraft();
  const [tab, setTab] = useState<MenuTabKey>(readTab);

  const select = (key: Key) => {
    const next = MENU_TABS.find((item) => item === key);
    if (!next) return;
    setTab(next);
    writeTab(next);
  };

  if (loadState === "loading" || (loadState === "ready" && !draft)) {
    return (
      <StateCard>
        <p role="status" className={styles.stateText}>
          {s.page.loading}
        </p>
      </StateCard>
    );
  }

  if (loadState === "error" || !draft) {
    return (
      <StateCard>
        <p role="alert" className={styles.stateText}>
          {s.page.loadFailed}
        </p>
        <Button className={styles.primary} onPress={retryLoad}>
          {s.page.retry}
        </Button>
      </StateCard>
    );
  }

  const counts: Partial<Record<MenuTabKey, number>> = {
    products: allProducts(draft).length,
    categories: draft.categories.length,
    addons: draft.addOns.length,
    signatures: draft.signatures.length,
    pairings: draft.pairings.length,
  };

  const needsCategory = draft.categories.length === 0;

  const panels: Record<MenuTabKey, ReactNode> = {
    products: needsCategory ? (
      <StateCard>
        <h2 className={styles.heading}>{s.page.emptyTitle}</h2>
        <p className={styles.stateText}>{s.page.emptyText}</p>
        <Button className={styles.primary} onPress={() => select("categories")}>
          {s.page.emptyAction}
        </Button>
      </StateCard>
    ) : (
      <ProductsTab />
    ),
    categories: <CategoriesTab />,
    addons: <AddOnsTab />,
    signatures: <SignaturesTab />,
    pairings: <PairingsTab />,
    popup: <PopupTab />,
    general: <GeneralTab />,
  };

  return (
    <>
      <SaveBar />
      <IssueSummary />
      <Tabs selectedKey={tab} onSelectionChange={select}>
        <TabList className={styles.tabList} aria-label={s.page.tabs}>
          {MENU_TABS.map((key) => (
            <Tab key={key} id={key} className={styles.tab}>
              {s.tabs[key]}
              {counts[key] !== undefined ? (
                <span className={styles.count}>{counts[key]}</span>
              ) : null}
            </Tab>
          ))}
        </TabList>
        {MENU_TABS.map((key) => (
          <TabPanel key={key} id={key} className={`${styles.panel} pt-5`}>
            {panels[key]}
          </TabPanel>
        ))}
      </Tabs>
      <ConflictModal />
      <SessionModal />
      <LeaveGuard />
    </>
  );
}

export function MenuPage() {
  return (
    <MenuDraftProvider>
      <div className={styles.page}>
        <MenuContent />
      </div>
    </MenuDraftProvider>
  );
}
