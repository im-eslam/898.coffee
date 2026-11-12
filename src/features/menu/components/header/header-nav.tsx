import { useLayoutEffect, useRef } from "react";
import {
  Button,
  SelectionIndicator,
  SharedElementTransition,
  Tab,
  TabList,
  Tabs,
} from "react-aria-components";
import { Icon } from "@/shared/icons";
import type { NavSection } from "../../hooks/use-menu-navigation";

interface HeaderNavStrings {
  categories: string;
}

interface HeaderNavProps {
  strings: HeaderNavStrings;
  sections: NavSection[];
  activeId: string;
  direction: "ltr" | "rtl";
  onSelect: (id: string) => void;
  onCategories: () => void;
  className?: string;
}

const styles = {
  row: "mx-auto flex h-12 w-full max-w-5xl items-center",
  menuSlot: "shrink-0 ps-1 md:ps-3",
  categories:
    "flex size-12 shrink-0 items-center justify-center rounded-full text-charcoal transition-colors duration-(--duration-interactive) ease-smooth data-hovered:bg-sand/40 data-pressed:bg-sand/60",
  icon: "size-5",
  nav: "relative h-12 min-w-0 flex-1",
  tabs: "flex h-full w-full items-center",
  tabList:
    "no-scrollbar relative flex h-12 w-full touch-pan-x items-center gap-1 overflow-x-auto overscroll-x-contain px-4 [mask-image:linear-gradient(to_right,transparent,black_16px,black_calc(100%-16px),transparent)]",
  tab: "group relative flex h-10 shrink-0 cursor-pointer items-center justify-center rounded-full px-4 text-small outline-none text-taupe data-hovered:text-charcoal data-selected:text-cream",
  tabText: "relative z-10 font-medium group-data-selected:font-semibold",
  indicator:
    "absolute inset-0 z-0 rounded-full bg-charcoal transition-[translate,width] duration-300 ease-smooth",
} as const;

function animateScrollLeft(el: HTMLElement, to: number, duration: number) {
  const from = el.scrollLeft;
  const start = performance.now();
  let frame = 0;

  function step(now: number) {
    const t = Math.min(1, (now - start) / duration);
    el.scrollLeft = from + (to - from) * (1 - Math.pow(1 - t, 3));
    if (t < 1) frame = requestAnimationFrame(step);
  }

  frame = requestAnimationFrame(step);
  return () => cancelAnimationFrame(frame);
}

export function HeaderNav({
  strings: s,
  sections,
  activeId,
  direction,
  onSelect,
  onCategories,
  className,
}: HeaderNavProps) {
  const tabListRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const list = tabListRef.current;
    const tab = list?.querySelector<HTMLElement>(
      `[data-key="${CSS.escape(activeId)}"]`
    );
    if (!list || !tab) return;

    const listBox = list.getBoundingClientRect();
    const tabBox = tab.getBoundingClientRect();
    const offset =
      tabBox.left + tabBox.width / 2 - (listBox.left + listBox.width / 2);

    const stop = animateScrollLeft(list, list.scrollLeft + offset, 300);

    // if the user touches the bar, let them take over
    list.addEventListener("touchstart", stop, { passive: true, once: true });

    return () => {
      stop();
      list.removeEventListener("touchstart", stop);
    };
  }, [activeId]);

  return (
    <div dir={direction} className={`${styles.row} ${className ?? ""}`}>
      <div className={styles.menuSlot}>
        <Button
          type="button"
          aria-label={s.categories}
          onPress={onCategories}
          className={styles.categories}
        >
          <Icon name="menu" className={styles.icon} />
        </Button>
      </div>

      <nav className={styles.nav}>
        <SharedElementTransition>
          <Tabs
            selectedKey={activeId}
            onSelectionChange={(key) => onSelect(key as string)}
            className={styles.tabs}
          >
            <TabList
              ref={tabListRef}
              aria-label={s.categories}
              className={styles.tabList}
            >
              {sections.map((section) => (
                <Tab key={section.id} id={section.id} className={styles.tab}>
                  <span className={styles.tabText}>{section.label}</span>
                  <SelectionIndicator className={styles.indicator} />
                </Tab>
              ))}
            </TabList>
          </Tabs>
        </SharedElementTransition>
      </nav>
    </div>
  );
}
