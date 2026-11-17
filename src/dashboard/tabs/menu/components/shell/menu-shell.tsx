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
import { useMenuContext } from "../../hooks/use-menu-context";
import { allProducts } from "../../util/draft";
import { DEFAULT_MENU_TAB, MENU_TABS, type MenuTabKey } from "../../types/ui";
import { AddOnsTab } from "../tabs/addons";
import { CategoriesTab } from "../tabs/categories";
import { PairingsTab } from "../tabs/pairings";
import { PopupTab } from "../tabs/popup";
import { ProductsTab } from "../tabs/products";
import { SignaturesTab } from "../tabs/signatures";
import { MenuLoadError, MenuLoading } from "../states/menu-states";
import { StateCard } from "../states/state-card";
import { focusRing, heading, primaryButton, stateText } from "../ui/styles";
import { ConflictModal } from "./conflict-modal";
import { IssueSummary } from "./issue-summary";
import { LeaveGuard } from "./leave-guard";
import { SaveBar } from "./save-bar";
import { SessionModal } from "./session-modal";
import { strings } from "../../strings";

const styles = {
  tabList:
    "flex gap-1 overflow-x-auto border-b border-slate-200 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
  tab: `flex min-h-11 shrink-0 cursor-pointer items-center gap-2 border-b-2 border-transparent px-4 text-small font-semibold text-slate-600 transition-colors data-[hovered]:text-slate-900 data-[selected]:border-brand data-[selected]:text-brand ${focusRing}`,
  count:
    "rounded-full bg-slate-100 px-2 py-0.5 text-small font-medium text-slate-700",
  panel: "outline-none pt-5",
} as const;

/** The URL keeps the open tab so a reload returns to it. */
function readTab(): MenuTabKey {
  const value = new URLSearchParams(window.location.search).get("menu");
  return MENU_TABS.find((tab) => tab === value) ?? DEFAULT_MENU_TAB;
}

function writeTab(tab: MenuTabKey) {
  const url = new URL(window.location.href);
  url.searchParams.set("menu", tab);
  window.history.replaceState(window.history.state, "", url);
}

/** Shell: status, tab navigation, and the tab panels. Holds no menu state of its own. */
export function MenuShell() {
  const s = useStrings(strings);
  const { draft, status, retryLoad } = useMenuContext();
  const { loadState } = status;
  const [tab, setTab] = useState<MenuTabKey>(readTab);

  const select = (key: Key) => {
    const next = MENU_TABS.find((item) => item === key);
    if (!next) return;
    setTab(next);
    writeTab(next);
  };

  if (loadState === "loading" || (loadState === "ready" && !draft)) {
    return <MenuLoading />;
  }
  if (loadState === "error" || !draft) {
    return <MenuLoadError onRetry={retryLoad} />;
  }

  const counts: Partial<Record<MenuTabKey, number>> = {
    products: allProducts(draft).length,
    categories: draft.categories.length,
    addons: draft.addOns.length,
    signatures: draft.signatures.length,
    pairings: draft.pairings.length,
  };

  const panels: Record<MenuTabKey, ReactNode> = {
    products:
      draft.categories.length === 0 ? (
        <StateCard>
          <h2 className={heading}>{s.page.emptyTitle}</h2>
          <p className={stateText}>{s.page.emptyText}</p>
          <Button
            className={primaryButton}
            onPress={() => select("categories")}
          >
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
          <TabPanel key={key} id={key} className={styles.panel}>
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
