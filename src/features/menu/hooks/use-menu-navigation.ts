import { useCallback, useEffect, useRef, useState } from "react";

export interface NavSection {
  id: string;
  label: string;
}

const DEFAULT_HEADER_HEIGHT = 104;
const SECTION_GAP = 16;

export function useMenuNavigation(sections: NavSection[]) {
  const headerRef = useRef<HTMLElement>(null);

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

    function scheduleUpdate() {
      if (frame) return;

      frame = requestAnimationFrame(() => {
        frame = 0;
        updateActiveSection();
      });
    }

    updateActiveSection();

    window.addEventListener("scroll", scheduleUpdate, {
      passive: true,
    });

    window.addEventListener("resize", scheduleUpdate);

    const observer = new ResizeObserver(scheduleUpdate);
    observer.observe(document.body);

    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();

      window.removeEventListener("scroll", scheduleUpdate);
      window.removeEventListener("resize", scheduleUpdate);
    };
  }, [sections, getOffset]);

  const selectSection = useCallback(
    (id: string) => {
      const section = document.getElementById(id);
      if (!section) return;

      setActiveId(id);

      window.scrollTo({
        top: Math.max(
          0,
          window.scrollY + section.getBoundingClientRect().top - getOffset()
        ),
        behavior: "instant",
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
