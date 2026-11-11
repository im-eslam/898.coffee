import { useEffect, useRef, useState } from "react";

interface UseCarouselOptions {
  contentKey: string;
  direction: "ltr" | "rtl";
}

const ITEM_SELECTOR = "[data-carousel-card]";
const EDGE_TOLERANCE = 2;

export function useCarousel({ contentKey, direction }: UseCarouselOptions) {
  const railRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const rail = railRef.current;
    if (!rail) return;

    const items = Array.from(rail.querySelectorAll<HTMLElement>(ITEM_SELECTOR));

    const lifecycle = {
      disposed: false,
      frame: 0,
    };

    function measure() {
      if (lifecycle.disposed) return;

      let nextIndex = 0;

      if (
        items.length > 1 &&
        rail!.scrollWidth > rail!.clientWidth + EDGE_TOLERANCE
      ) {
        const railBox = rail!.getBoundingClientRect();
        const computedStyle = getComputedStyle(rail!);
        const paddingLeft = parseFloat(computedStyle.paddingLeft) || 0;
        const paddingRight = parseFloat(computedStyle.paddingRight) || 0;

        const viewportLeft = railBox.left + rail!.clientLeft;
        const viewportRight = viewportLeft + rail!.clientWidth;

        const start =
          direction === "rtl"
            ? viewportRight - paddingRight
            : viewportLeft + paddingLeft;

        let nearestDistance = Number.POSITIVE_INFINITY;

        items.forEach((item, index) => {
          const itemBox = item.getBoundingClientRect();

          const itemStart = direction === "rtl" ? itemBox.right : itemBox.left;

          const distance = Math.abs(itemStart - start);

          if (distance < nearestDistance) {
            nearestDistance = distance;
            nextIndex = index;
          }
        });

        const lastItem = items[items.length - 1];

        if (lastItem) {
          const lastBox = lastItem.getBoundingClientRect();

          const atEnd =
            direction === "rtl"
              ? lastBox.left >= viewportLeft + paddingLeft - EDGE_TOLERANCE
              : lastBox.right <= viewportRight - paddingRight + EDGE_TOLERANCE;

          if (atEnd) {
            nextIndex = items.length - 1;
          }
        }
      }

      setActiveIndex((current) =>
        current === nextIndex ? current : nextIndex
      );
    }

    function scheduleMeasure() {
      if (lifecycle.disposed || lifecycle.frame) return;

      lifecycle.frame = requestAnimationFrame(() => {
        lifecycle.frame = 0;
        measure();
      });
    }

    const observer = new ResizeObserver(scheduleMeasure);

    observer.observe(rail);
    items.forEach((item) => observer.observe(item));

    rail.addEventListener("scroll", scheduleMeasure, {
      passive: true,
    });

    window.addEventListener("resize", scheduleMeasure);

    void document.fonts.ready.then(scheduleMeasure);

    scheduleMeasure();

    return () => {
      lifecycle.disposed = true;

      cancelAnimationFrame(lifecycle.frame);
      observer.disconnect();

      rail.removeEventListener("scroll", scheduleMeasure);
      window.removeEventListener("resize", scheduleMeasure);
    };
  }, [contentKey, direction]);

  return {
    railRef,
    activeIndex,
  };
}
