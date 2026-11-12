import { useMemo } from "react";
import { Button } from "react-aria-components";
import { Icon } from "@/shared/icons";
import { useHeaderNav } from "../../hooks/components/use-header-nav";
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
    "flex size-12 shrink-0 items-center justify-center rounded-full text-charcoal transition-colors duration-(--duration-interactive) ease-smooth data-hovered:bg-sand/40 data-pressed:bg-sand/60 motion-reduce:transition-none",
  icon: "size-5",
  nav: "relative h-12 min-w-0 flex-1",
  rail: "no-scrollbar relative flex h-12 touch-pan-x items-center gap-1 overflow-x-auto overscroll-x-contain px-4",
  highlight:
    "pointer-events-none absolute top-1 left-0 h-10 rounded-full bg-charcoal",
  highlightAnimation:
    "transition-[transform,width] duration-250 ease-smooth motion-reduce:transition-none",
  pill: "group relative z-10 flex h-12 shrink-0 items-center rounded-full",
  pillBody:
    "grid h-10 place-items-center rounded-full px-4 text-small whitespace-nowrap",
  pillSizer: "invisible col-start-1 row-start-1 font-semibold",
  pillLabel:
    "col-start-1 row-start-1 transition-colors duration-250 ease-smooth motion-reduce:transition-none",
  labelActive: "font-semibold text-cream",
  labelIdle: "font-medium text-taupe group-data-hovered:text-charcoal",
  fade: "pointer-events-none absolute inset-y-0 z-20 w-4 from-cream to-transparent transition-opacity duration-(--duration-interactive) ease-smooth motion-reduce:transition-none",
  fadeStart: "start-0 bg-linear-to-r rtl:bg-linear-to-l",
  fadeEnd: "end-0 bg-linear-to-l rtl:bg-linear-to-r",
  fadeVisible: "opacity-100",
  fadeHidden: "opacity-0",
} as const;

export function HeaderNav({
  strings: s,
  sections,
  activeId,
  direction,
  onSelect,
  onCategories,
  className,
}: HeaderNavProps) {
  const contentKey = useMemo(() => JSON.stringify(sections), [sections]);

  const { railRef, highlight, canAnimate, edges } = useHeaderNav({
    activeId,
    contentKey,
    direction,
  });

  const highlightClassName = [
    styles.highlight,
    canAnimate && styles.highlightAnimation,
  ]
    .filter(Boolean)
    .join(" ");

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
        <div ref={railRef} className={styles.rail}>
          <span
            className={highlightClassName}
            style={{
              width: highlight?.width ?? 0,
              transform: `translateX(${highlight?.x ?? 0}px)`,
              opacity: highlight ? 1 : 0,
            }}
          />

          {sections.map((section) => {
            const active = section.id === activeId;

            return (
              <Button
                key={section.id}
                type="button"
                data-nav-id={section.id}
                onPress={() => onSelect(section.id)}
                className={styles.pill}
              >
                <span className={styles.pillBody}>
                  <span className={styles.pillSizer}>{section.label}</span>

                  <span
                    className={`${styles.pillLabel} ${
                      active ? styles.labelActive : styles.labelIdle
                    }`}
                  >
                    {section.label}
                  </span>
                </span>
              </Button>
            );
          })}
        </div>

        <div
          className={`${styles.fade} ${styles.fadeStart} ${
            edges.start ? styles.fadeVisible : styles.fadeHidden
          }`}
        />

        <div
          className={`${styles.fade} ${styles.fadeEnd} ${
            edges.end ? styles.fadeVisible : styles.fadeHidden
          }`}
        />
      </nav>
    </div>
  );
}
