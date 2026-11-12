import { useCallback, useEffect, useRef, useState } from "react";

export interface NavSection {
  id: string;
  label: string;
}

const DEFAULT_HEADER_HEIGHT = 104;
const SECTION_GAP = 16;

export function useMenuNavigation(sections: NavSection[]) {
  const headerRef = useRef<HTMLElement>(null);
  const pinnedRef = useRef(false);
  const pinTimeoutRef = useRef<number | null>(null);

  const [activeId, setActiveId] = useState(sections[0]?.id ?? "");

  const getOffset = useCallback(() => {
    const height =
      headerRef.current?.getBoundingClientRect().height ??
      DEFAULT_HEADER_HEIGHT;

    return height + SECTION_GAP;
  }, []);

  useEffect(() => {
    let frame = 0;

    function updateActiveSection() {
      if (pinnedRef.current) return;
      const elements = sections
        .map((section) => document.getElementById(section.id))
        .filter((element): element is HTMLElement => element !== null);

      if (elements.length === 0) {
        setActiveId("");
        return;
      }

      const offset = getOffset();
      let nextId = elements[0]?.id ?? "";

      for (const element of elements) {
        if (element.getBoundingClientRect().top <= offset + 2) {
          nextId = element.id;
        }
      }

      const page = document.documentElement;
      const canScroll = page.scrollHeight > window.innerHeight + 2;
      const atBottom =
        window.scrollY + window.innerHeight >= page.scrollHeight - 2;

      if (canScroll && atBottom) {
        nextId = elements[elements.length - 1]?.id ?? nextId;
      }

      setActiveId((current) => (current === nextId ? current : nextId));
    }

    function release(event: Event) {
      if (headerRef.current?.contains(event.target as Node)) return;
      pinnedRef.current = false;
      if (pinTimeoutRef.current !== null) {
        window.clearTimeout(pinTimeoutRef.current);
        pinTimeoutRef.current = null;
      }
    }

    window.addEventListener("wheel", release, { passive: true });
    window.addEventListener("touchmove", release, { passive: true });
    window.addEventListener("keydown", release);

    function scheduleUpdate() {
      if (frame) return;

      frame = requestAnimationFrame(() => {
        frame = 0;
        updateActiveSection();
      });
    }

    function handleScrollEnd() {
      pinnedRef.current = false;
      if (pinTimeoutRef.current !== null) {
        window.clearTimeout(pinTimeoutRef.current);
        pinTimeoutRef.current = null;
      }
      scheduleUpdate();
    }

    updateActiveSection();

    window.addEventListener("scroll", scheduleUpdate, {
      passive: true,
    });

    window.addEventListener("resize", scheduleUpdate);
    window.addEventListener("scrollend", handleScrollEnd);

    const observer = new ResizeObserver(scheduleUpdate);
    observer.observe(document.body);

    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();

      window.removeEventListener("scroll", scheduleUpdate);
      window.removeEventListener("resize", scheduleUpdate);
      window.removeEventListener("scrollend", handleScrollEnd);

      window.removeEventListener("wheel", release);
      window.removeEventListener("touchmove", release);
      window.removeEventListener("keydown", release);
      if (pinTimeoutRef.current !== null) {
        window.clearTimeout(pinTimeoutRef.current);
      }
    };
  }, [sections, getOffset]);

  const selectSection = useCallback(
    (id: string) => {
      const section = document.getElementById(id);
      if (!section) return;

      const top = Math.max(
        0,
        window.scrollY + section.getBoundingClientRect().top - getOffset()
      );

      setActiveId(id);

      if (Math.abs(window.scrollY - top) <= 1) {
        pinnedRef.current = false;
        return;
      }

      pinnedRef.current = true;
      if (pinTimeoutRef.current !== null) {
        window.clearTimeout(pinTimeoutRef.current);
      }
      pinTimeoutRef.current = window.setTimeout(() => {
        pinnedRef.current = false;
        pinTimeoutRef.current = null;
      }, 2000);

      window.scrollTo({
        top,
        behavior: "smooth",
      });
    },
    [getOffset]
  );

  return {
    headerRef,
    activeId,
    selectSection,
  };
}
