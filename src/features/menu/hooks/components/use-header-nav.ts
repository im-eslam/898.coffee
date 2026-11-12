import { useLayoutEffect, useRef, useState } from "react";

interface UseHeaderNavOptions {
  activeId: string;
  contentKey: string;
  direction: "ltr" | "rtl";
}

interface Highlight {
  x: number;
  width: number;
}

interface Edges {
  start: boolean;
  end: boolean;
}

export function useHeaderNav({
  activeId,
  contentKey,
  direction,
}: UseHeaderNavOptions) {
  const railRef = useRef<HTMLDivElement>(null);
  const touching = useRef(false);
  const previousDirection = useRef<"ltr" | "rtl" | null>(null);

  const [highlight, setHighlight] = useState<Highlight | null>(null);
  const [canAnimate, setCanAnimate] = useState(false);
  const [edges, setEdges] = useState<Edges>({ start: false, end: false });

  useLayoutEffect(() => {
    const rail = railRef.current;
    if (!rail) return;

    let disposed = false;
    let animationFrame = 0;

    const directionChanged = previousDirection.current !== direction;
    previousDirection.current = direction;

    if (directionChanged) {
      setCanAnimate(false);
    }

    function getItems() {
      return Array.from(
        rail!.querySelectorAll<HTMLButtonElement>("[data-nav-id]")
      );
    }

    function updateHighlight() {
      if (disposed) return;

      const activeItem = getItems().find(
        (item) => item.dataset.navId === activeId
      );

      const nextHighlight = activeItem
        ? {
            x: activeItem.offsetLeft,
            width: activeItem.offsetWidth,
          }
        : null;

      setHighlight((current) => {
        if (
          current?.x === nextHighlight?.x &&
          current?.width === nextHighlight?.width
        ) {
          return current;
        }
        return nextHighlight;
      });
    }

    function centerActiveItem() {
      if (disposed || touching.current) return;

      const activeItem = getItems().find(
        (item) => item.dataset.navId === activeId
      );
      if (!activeItem) return;

      const railBox = rail!.getBoundingClientRect();
      const itemBox = activeItem.getBoundingClientRect();

      const reduceMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;

      rail!.scrollBy({
        left:
          itemBox.left + itemBox.width / 2 - (railBox.left + railBox.width / 2),
        behavior: directionChanged || reduceMotion ? "instant" : "smooth",
      });
    }

    const items = getItems();
    const firstItem = items[0];
    const lastItem = items[items.length - 1];

    const intersectionObserver = new IntersectionObserver(
      (entries) => {
        if (disposed) return;

        setEdges((current) => {
          const next = { ...current };

          entries.forEach((entry) => {
            if (entry.target === firstItem)
              next.start = entry.intersectionRatio < 0.95;
            if (entry.target === lastItem)
              next.end = entry.intersectionRatio < 0.95;
          });

          return current.start === next.start && current.end === next.end
            ? current
            : next;
        });
      },
      {
        root: rail,
        threshold: [0.95, 1],
      }
    );

    if (firstItem) intersectionObserver.observe(firstItem);
    if (lastItem) intersectionObserver.observe(lastItem);

    const resizeObserver = new ResizeObserver(() => {
      updateHighlight();
    });

    resizeObserver.observe(rail);
    items.forEach((item) => resizeObserver.observe(item));

    updateHighlight();
    centerActiveItem();

    animationFrame = requestAnimationFrame(() => {
      animationFrame = requestAnimationFrame(() => {
        if (!disposed) setCanAnimate(true);
      });
    });

    function startTouch() {
      touching.current = true;
    }
    function endTouch() {
      touching.current = false;
    }

    rail.addEventListener("touchstart", startTouch, { passive: true });
    rail.addEventListener("touchend", endTouch, { passive: true });
    rail.addEventListener("touchcancel", endTouch, { passive: true });

    return () => {
      disposed = true;
      cancelAnimationFrame(animationFrame);
      intersectionObserver.disconnect();
      resizeObserver.disconnect();

      rail.removeEventListener("touchstart", startTouch);
      rail.removeEventListener("touchend", endTouch);
      rail.removeEventListener("touchcancel", endTouch);
    };
  }, [activeId, contentKey, direction]);

  return {
    railRef,
    highlight,
    canAnimate,
    edges,
  };
}
