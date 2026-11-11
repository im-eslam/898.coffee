import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { Button } from "react-aria-components";
import mark from "@/assets/mark.svg";
import { setLocale, useLocale, useStrings } from "@/shared/i18n";
import { Icon, type IconName } from "@/shared/icons";
import { Link, ROUTES } from "@/shared/router";
import type { NavSection } from "../hooks/use-menu-flow";
import { strings } from "../strings";
import { cx, focusRing, pageWidth } from "./ui";

interface Props {
  sections: NavSection[];
  activeId: string;
  onSelect: (id: string) => void;
  onSearch: () => void;
  onCategories: () => void;
}

// Language names are always shown in their own script, whatever the UI language.
const LANGUAGE_LABELS = { en: "EN", ar: "ع" } as const;

const styles = {
  header: "sticky top-0 z-30 border-b border-arctic bg-white",
  topRow: cx(
    pageWidth,
    "flex h-14 items-center gap-1 ps-4 pe-2 md:ps-6 md:pe-4"
  ),
  brand: "flex min-w-0 items-center gap-2",
  logo: "h-7 w-auto",
  spacer: "flex-1",
  pillRow: cx(pageWidth, "flex h-12 items-center"),
  menuSlot: "shrink-0 ps-1 md:ps-3",
  nav: "relative h-12 min-w-0 flex-1",
  // touch-pan-x: browser starts horizontal scrolling immediately (no gesture-detection delay)
  // contain: keeps the sliding highlight from invalidating layout outside the rail
  rail: "no-scrollbar relative flex h-12 touch-pan-x items-center gap-1 overflow-x-auto overscroll-x-contain px-4 [-webkit-overflow-scrolling:touch] [contain:layout_paint]",
  highlight:
    "absolute top-1 left-0 h-10 rounded-full bg-brand will-change-transform",
  highlightSlides:
    "transition-[transform,width] duration-250 ease-smooth",
  pill: cx(
    "group relative z-10 flex h-12 shrink-0 items-center rounded-full",
    focusRing
  ),
  // No press-scale animation: it made pills twitch when a drag started on touch.
  pillBody:
    "grid h-10 place-items-center whitespace-nowrap rounded-full px-4 text-small",
  pillSizer: "invisible col-start-1 row-start-1 font-semibold",
  pillLabel:
    "col-start-1 row-start-1 transition-colors duration-250 ease-smooth",
  pillLabelActive: "font-semibold text-white",
  pillLabelIdle: "font-medium text-navy/65",
  fade: "pointer-events-none absolute inset-y-0 w-4 from-white to-transparent transition-opacity duration-200",
  fadeStart: "start-0 bg-linear-to-r rtl:bg-linear-to-l",
  fadeEnd: "end-0 bg-linear-to-l rtl:bg-linear-to-r",
  fadeVisible: "opacity-100",
  fadeHidden: "opacity-0",
  iconButton: cx(
    "flex size-12 shrink-0 items-center justify-center rounded-full data-hovered:bg-mist data-pressed:bg-mist",
    focusRing
  ),
  backLink:
    "-ms-3 flex size-12 shrink-0 items-center justify-center rounded-full outline-none hover:bg-mist active:bg-mist focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-current",
  backFlip: "flex scale-x-[-1]",
  icon: "size-6",
  srOnly: "sr-only",
  language: cx("group flex h-12 shrink-0 items-center rounded-full", focusRing),
  languageBody:
    "flex h-10 items-center gap-1 rounded-full bg-brand px-3.5 text-small text-white transition-colors group-data-hovered:bg-navy",
  languageOn: "font-bold",
  languageOff: "font-medium text-white/70",
  languageDivider: "text-white/50",
} as const;

function IconButton({
  icon,
  label,
  onPress,
}: {
  icon: IconName;
  label: string;
  onPress: () => void;
}) {
  return (
    <Button aria-label={label} onPress={onPress} className={styles.iconButton}>
      <Icon name={icon} className={styles.icon} />
    </Button>
  );
}

function LanguageButton() {
  const locale = useLocale();
  const t = useStrings(strings);
  return (
    <Button
      aria-label={t.a11yLanguage}
      onPress={() => setLocale(locale === "en" ? "ar" : "en")}
      className={styles.language}
    >
      <span dir="ltr" className={styles.languageBody}>
        <span
          lang="en"
          className={locale === "en" ? styles.languageOn : styles.languageOff}
        >
          {LANGUAGE_LABELS.en}
        </span>
        <span aria-hidden="true" className={styles.languageDivider}>
          |
        </span>
        <span
          lang="ar"
          className={locale === "ar" ? styles.languageOn : styles.languageOff}
        >
          {LANGUAGE_LABELS.ar}
        </span>
      </span>
    </Button>
  );
}

function EdgeFade({
  edge,
  visible = true,
}: {
  edge: "start" | "end";
  visible?: boolean;
}) {
  return (
    <div
      aria-hidden="true"
      className={cx(
        styles.fade,
        edge === "start" ? styles.fadeStart : styles.fadeEnd,
        visible ? styles.fadeVisible : styles.fadeHidden
      )}
    />
  );
}

function findPill(rail: HTMLElement | null, id: string) {
  return rail?.querySelector<HTMLElement>(`[data-pill-id="${id}"]`) ?? null;
}

export function Header({
  sections,
  activeId,
  onSelect,
  onSearch,
  onCategories,
}: Props) {
  const t = useStrings(strings);
  const locale = useLocale();
  const rail = useRef<HTMLDivElement>(null);
  const [highlight, setHighlight] = useState<{
    x: number;
    width: number;
  } | null>(null);
  const [highlightCanSlide, setHighlightCanSlide] = useState(false);
  const [moreAhead, setMoreAhead] = useState(true);

  // True while the user's finger is on the rail, so auto-centering never fights it.
  const dragging = useRef(false);
  const scrollFrame = useRef(0);

  const measureHighlight = useCallback(() => {
    const pill = findPill(rail.current, activeId);
    if (!pill) return;
    const next = { x: pill.offsetLeft, width: pill.offsetWidth };
    setHighlight((prev) =>
      prev && prev.x === next.x && prev.width === next.width ? prev : next
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
    let frame = 0;
    const observer = new ResizeObserver(() => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(measureHighlight);
    });
    observer.observe(element);
    element
      .querySelectorAll("button")
      .forEach((pill) => observer.observe(pill));
    document.fonts?.ready.then(measureHighlight);
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
    };
  }, [measureHighlight, locale]);

  useEffect(() => {
    if (!highlight || highlightCanSlide) return;
    const frame = requestAnimationFrame(() => setHighlightCanSlide(true));
    return () => cancelAnimationFrame(frame);
  }, [highlight, highlightCanSlide]);

  // Center the active pill. Smooth for normal changes, instant on first
  // render / language switch, and skipped entirely while the user is dragging.
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
    element.scrollBy({
      left: offset,
      behavior: instant ? "auto" : "smooth",
    });
  }, [activeId, locale]);

  const updateMoreAhead = useCallback(() => {
    const element = rail.current;
    if (!element) return;
    const next =
      Math.abs(element.scrollLeft) + element.clientWidth <
      element.scrollWidth - 4;
    setMoreAhead((prev) => (prev === next ? prev : next));
  }, []);

  // Passive, rAF-throttled scroll listener: at most one cheap layout read per frame.
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
    <header className={styles.header}>
      <div className={styles.topRow}>
        <Link href={ROUTES.landing} className={styles.backLink}>
          <span className={styles.srOnly}>{t.a11yBackHome}</span>
          <span aria-hidden="true" className={styles.backFlip}>
            <Icon name="arrow" className={styles.icon} />
          </span>
        </Link>
        <div className={styles.brand}>
          <img src={mark} alt={t.brandName} className={styles.logo} />
        </div>
        <div className={styles.spacer} />
        <IconButton icon="search" label={t.a11ySearch} onPress={onSearch} />
        <LanguageButton />
      </div>

      <div className={styles.pillRow}>
        <div className={styles.menuSlot}>
          <IconButton
            icon="menu"
            label={t.a11yCategories}
            onPress={onCategories}
          />
        </div>
        <nav aria-label={t.categoriesTitle} className={styles.nav}>
          <div ref={rail} className={styles.rail}>
            <span
              aria-hidden="true"
              className={cx(
                styles.highlight,
                highlightCanSlide && styles.highlightSlides
              )}
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
                      className={cx(
                        styles.pillLabel,
                        active ? styles.pillLabelActive : styles.pillLabelIdle
                      )}
                    >
                      {section.label}
                    </span>
                  </span>
                </Button>
              );
            })}
          </div>
          <EdgeFade edge="start" />
          <EdgeFade edge="end" visible={moreAhead} />
        </nav>
      </div>
    </header>
  );
}
