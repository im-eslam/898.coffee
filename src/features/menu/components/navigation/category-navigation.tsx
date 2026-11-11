import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { Button } from "react-aria-components";
import { useLocale, useStrings } from "@/shared/i18n";
import { strings } from "@/features/menu/strings";

export interface NavSection {
  id: string;
  label: string;
}

interface CategoryNavigationProps {
  sections: NavSection[];
  activeId: string;
  onSelect: (id: string) => void;
}

const styles = {
  nav: "relative h-12 min-w-0 flex-1",
  rail: "no-scrollbar relative flex h-12 touch-pan-x items-center gap-1 overflow-x-auto overscroll-x-contain px-4 [-webkit-overflow-scrolling:touch] [contain:layout_paint]",
  highlight:
    "absolute top-1 left-0 h-10 rounded-full bg-brand will-change-transform",
  highlightSlides:
    "transition-[transform,width] duration-300 ease-smooth",
  pill: "group relative z-10 flex h-12 shrink-0 items-center rounded-full outline-none data-focus-visible:ring-2 data-focus-visible:ring-brand",
  pillBody:
    "grid h-10 place-items-center whitespace-nowrap rounded-full px-4 text-small",
  pillSizer: "invisible col-start-1 row-start-1 font-semibold",
  pillLabel:
    "col-start-1 row-start-1 transition-colors duration-300 ease-smooth",
  pillLabelActive: "font-semibold text-white",
  pillLabelIdle: "font-medium text-charcoal/65",
  fade: "pointer-events-none absolute inset-y-0 w-4 from-cream to-transparent transition-opacity duration-200",
  fadeStart: "start-0 bg-linear-to-r rtl:bg-linear-to-l",
  fadeEnd: "end-0 bg-linear-to-l rtl:bg-linear-to-r",
} as const;

function findPill(rail: HTMLElement | null, id: string) {
  return rail?.querySelector<HTMLElement>(`[data-pill-id="${id}"]`) ?? null;
}

export function CategoryNavigation({
  sections,
  activeId,
  onSelect,
}: CategoryNavigationProps) {
  const t = useStrings(strings);
  const locale = useLocale();
  const rail = useRef<HTMLDivElement>(null);
  const [highlight, setHighlight] = useState<{ x: number; width: number } | null>(
    null,
  );
  const [highlightCanSlide, setHighlightCanSlide] = useState(false);
  const [moreAhead, setMoreAhead] = useState(true);

  const dragging = useRef(false);
  const scrollFrame = useRef(0);

  const measureHighlight = useCallback(() => {
    const pill = findPill(rail.current, activeId);
    if (!pill) return;
    const next = { x: pill.offsetLeft, width: pill.offsetWidth };
    setHighlight((prev) =>
      prev && prev.x === next.x && prev.width === next.width ? prev : next,
    );
  }, [activeId]);

  const lastLocale = useRef(locale);
  useLayoutEffect(() => {
    if (lastLocale.current !== locale) {
      lastLocale.current = locale;
      setHighlightCanSlide(false);
    }
    measureHighlight();
  }, [measureHighlight, locale]);

  useEffect(() => {
    const element = rail.current;
    if (!element) return;
    const frameRef = { current: 0 };
    const observer = new ResizeObserver(() => {
      cancelAnimationFrame(frameRef.current);
      frameRef.current = requestAnimationFrame(measureHighlight);
    });
    observer.observe(element);
    element.querySelectorAll("button").forEach((pill) => observer.observe(pill));
    document.fonts?.ready.then(measureHighlight);
    return () => {
      cancelAnimationFrame(frameRef.current);
      observer.disconnect();
    };
  }, [measureHighlight, locale]);

  useEffect(() => {
    if (!highlight || highlightCanSlide) return;
    const frame = requestAnimationFrame(() => setHighlightCanSlide(true));
    return () => cancelAnimationFrame(frame);
  }, [highlight, highlightCanSlide]);

  const centeredFor = useRef<string | null>(null);
  useEffect(() => {
    const element = rail.current;
    const pill = findPill(element, activeId);
    if (!element || !pill) return;
    const instant = centeredFor.current !== locale;
    centeredFor.current = locale;
    if (dragging.current) return;
    const railBox = element.getBoundingClientRect();
    const pillBox = pill.getBoundingClientRect();
    const offset =
      pillBox.left + pillBox.width / 2 - (railBox.left + railBox.width / 2);
    element.scrollBy({ left: offset, behavior: instant ? "auto" : "smooth" });
  }, [activeId, locale]);

  const updateMoreAhead = useCallback(() => {
    const element = rail.current;
    if (!element) return;
    const next =
      Math.abs(element.scrollLeft) + element.clientWidth < element.scrollWidth - 4;
    setMoreAhead((prev) => (prev === next ? prev : next));
  }, []);

  useEffect(() => {
    const element = rail.current;
    if (!element) return;
    const onScroll = () => {
      if (scrollFrame.current) return;
      scrollFrame.current = requestAnimationFrame(() => {
        scrollFrame.current = 0;
        updateMoreAhead();
      });
    };
    const onDown = () => {
      dragging.current = true;
    };
    const onUp = () => {
      dragging.current = false;
    };
    element.addEventListener("scroll", onScroll, { passive: true });
    element.addEventListener("touchstart", onDown, { passive: true });
    element.addEventListener("touchend", onUp, { passive: true });
    element.addEventListener("touchcancel", onUp, { passive: true });
    updateMoreAhead();
    return () => {
      cancelAnimationFrame(scrollFrame.current);
      scrollFrame.current = 0;
      element.removeEventListener("scroll", onScroll);
      element.removeEventListener("touchstart", onDown);
      element.removeEventListener("touchend", onUp);
      element.removeEventListener("touchcancel", onUp);
    };
  }, [locale, updateMoreAhead]);

  return (
    <nav aria-label={t.nav.categoriesTitle} className={styles.nav}>
      <div ref={rail} className={styles.rail}>
        <span
          aria-hidden="true"
          className={[styles.highlight, highlightCanSlide && styles.highlightSlides]
            .filter(Boolean)
            .join(" ")}
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
              data-pill-id={section.id}
              aria-current={active ? "true" : undefined}
              onPress={() => onSelect(section.id)}
              className={styles.pill}
            >
              <span className={styles.pillBody}>
                <span aria-hidden="true" className={styles.pillSizer}>
                  {section.label}
                </span>
                <span
                  className={[
                    styles.pillLabel,
                    active ? styles.pillLabelActive : styles.pillLabelIdle,
                  ].join(" ")}
                >
                  {section.label}
                </span>
              </span>
            </Button>
          );
        })}
      </div>
      <span aria-hidden="true" className={[styles.fade, styles.fadeStart, "opacity-100"].join(" ")} />
      <span
        aria-hidden="true"
        className={[styles.fade, styles.fadeEnd, moreAhead ? "opacity-100" : "opacity-0"].join(" ")}
      />
    </nav>
  );
}
