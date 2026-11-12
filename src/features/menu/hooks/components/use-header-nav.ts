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

  // Keep a stable ref of the activeId so our observers can read it
  // without needing to be torn down and rebuilt every time it changes.
  const activeIdRef = useRef(activeId);
  activeIdRef.current = activeId;

  const [highlight, setHighlight] = useState<Highlight | null>(null);
  const [canAnimate, setCanAnimate] = useState(false);
  const [edges, setEdges] = useState<Edges>({ start: false, end: false });

  // 1. Measurement logic - stable functions
  const getItems = () =>
    Array.from(
      railRef.current?.querySelectorAll<HTMLButtonElement>("[data-nav-id]") ||
        []
    );

  const updateHighlight = () => {
    const activeItem = getItems().find(
      (item) => item.dataset.navId === activeIdRef.current
    );
    const nextHighlight = activeItem
      ? { x: activeItem.offsetLeft, width: activeItem.offsetWidth }
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
  };

  const centerActiveItem = (isInitial = false) => {
    if (touching.current) return;
    const rail = railRef.current;
    if (!rail) return;

    const activeItem = getItems().find(
      (item) => item.dataset.navId === activeIdRef.current
    );
    if (!activeItem) return;

    const railBox = rail.getBoundingClientRect();
    const itemBox = activeItem.getBoundingClientRect();
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    const directionChanged = previousDirection.current !== direction;

    const scrollTarget =
      itemBox.left + itemBox.width / 2 - (railBox.left + railBox.width / 2);
    const behavior =
      isInitial || directionChanged || reduceMotion ? "instant" : "smooth";

    // Fix for WebKit Compositor Crash:
    // Defer the programmatic scroll by one frame so it doesn't execute
    // synchronously with the React state update and CSS transition start.
    requestAnimationFrame(() => {
      rail.scrollBy({ left: scrollTarget, behavior });
    });
  };

  // 2. Setup Effect: Mounts Observers ONLY when content or direction changes
  useLayoutEffect(() => {
    const rail = railRef.current;
    if (!rail) return;

    let disposed = false;
    previousDirection.current = direction;

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
      { root: rail, threshold: [0.95, 1] }
    );

    if (firstItem) intersectionObserver.observe(firstItem);
    if (lastItem) intersectionObserver.observe(lastItem);

    const resizeObserver = new ResizeObserver(() => {
      if (!disposed) updateHighlight();
    });

    resizeObserver.observe(rail);
    items.forEach((item) => resizeObserver.observe(item));

    const startTouch = () => {
      touching.current = true;
    };
    const endTouch = () => {
      touching.current = false;
    };

    rail.addEventListener("touchstart", startTouch, { passive: true });
    rail.addEventListener("touchend", endTouch, { passive: true });
    rail.addEventListener("touchcancel", endTouch, { passive: true });

    // Initial Execution
    updateHighlight();
    centerActiveItem(true);

    const animFrame = requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        if (!disposed) setCanAnimate(true);
      });
    });

    return () => {
      disposed = true;
      cancelAnimationFrame(animFrame);
      intersectionObserver.disconnect();
      resizeObserver.disconnect();
      rail.removeEventListener("touchstart", startTouch);
      rail.removeEventListener("touchend", endTouch);
      rail.removeEventListener("touchcancel", endTouch);
    };
    // Notice activeId is INTENTIONALLY left out of this dependency array
  }, [contentKey, direction]);

  // 3. activeId Update Effect: Runs ONLY when the selected tab changes
  useLayoutEffect(() => {
    // Prevent this from double-firing on initial mount by waiting for canAnimate
    if (canAnimate) {
      updateHighlight();
      centerActiveItem(false);
    }
  }, [activeId, canAnimate]);

  return {
    railRef,
    highlight,
    canAnimate,
    edges,
  };
}
