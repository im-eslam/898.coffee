import { useCallback, useEffect, useRef, useState } from "react";
import type { NavSection } from "../types/flow";

const DEFAULT_HEADER_HEIGHT = 104;
const SECTION_GAP = 16;

export function useMenuNavigation(sections: NavSection[]) {
  const headerRef = useRef<HTMLElement>(null);
  const pinnedRef = useRef(false);
  const pinTimeoutRef = useRef<number | null>(null);
  const frameRef = useRef<number | null>(null);

  const [activeId, setActiveId] = useState(sections[0]?.id ?? "");

  const getOffset = useCallback(() => {
    const height =
      headerRef.current?.getBoundingClientRect().height ??
      DEFAULT_HEADER_HEIGHT;

    return height + SECTION_GAP;
  }, []);

  useEffect(() => {
    function updateActiveSection() {
      if (pinnedRef.current) return;

      const elements = sections
        .map((section) => document.getElementById(section.id))
        .filter((el): el is HTMLElement => el !== null);

      if (elements.length === 0) {
        setActiveId("");
        return;
      }

      const offset = getOffset();
      let nextId = elements[0]?.id ?? "";

      for (const el of elements) {
        if (el.getBoundingClientRect().top <= offset + 2) {
          nextId = el.id;
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

    function scheduleUpdate() {
      if (frameRef.current !== null) return;
      frameRef.current = requestAnimationFrame(() => {
        frameRef.current = null;
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

    window.addEventListener("scroll", scheduleUpdate, { passive: true });
    window.addEventListener("resize", scheduleUpdate);
    window.addEventListener("scrollend", handleScrollEnd);

    const observer = new ResizeObserver(scheduleUpdate);
    observer.observe(document.body);

    return () => {
      if (frameRef.current !== null) {
        cancelAnimationFrame(frameRef.current);
        frameRef.current = null;
      }
      if (pinTimeoutRef.current !== null) {
        window.clearTimeout(pinTimeoutRef.current);
        pinTimeoutRef.current = null;
      }
      observer.disconnect();
      window.removeEventListener("scroll", scheduleUpdate);
      window.removeEventListener("resize", scheduleUpdate);
      window.removeEventListener("scrollend", handleScrollEnd);
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

      window.scrollTo({ top, behavior: "smooth" });
    },
    [getOffset]
  );

  return {
    headerRef,
    activeId,
    selectSection,
  };
}
