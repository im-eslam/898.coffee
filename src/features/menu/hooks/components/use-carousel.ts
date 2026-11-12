import { useEffect, useRef, useState } from "react";

interface UseCarouselOptions {
  contentKey: string;
  direction: "ltr" | "rtl";
}

const ITEM_SELECTOR = "[data-carousel-card]";
const EDGE_TOLERANCE = 5;

export function useCarousel({ contentKey, direction }: UseCarouselOptions) {
  const railRef = useRef<HTMLDivElement>(null);
  const rafIdRef = useRef<number>(0);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const rail = railRef.current;
    if (!rail) return;

    const items = Array.from(rail.querySelectorAll<HTMLElement>(ITEM_SELECTOR));
    if (items.length === 0) return;

    const visibleItems = new Map<number, number>();

    const updateIndex = () => {
      if (!rail) return;

      const scrollRight =
        rail.scrollWidth - rail.clientWidth - Math.abs(rail.scrollLeft);
      const isAtEnd = scrollRight <= EDGE_TOLERANCE;

      if (isAtEnd) {
        setActiveIndex(items.length - 1);
        return;
      }

      let maxRatio = 0;
      let bestIndex = 0;

      for (const [index, ratio] of visibleItems.entries()) {
        if (ratio > maxRatio) {
          maxRatio = ratio;
          bestIndex = index;
        } else if (ratio === maxRatio && ratio > 0) {
          if (index < bestIndex) bestIndex = index;
        }
      }

      setActiveIndex((current) =>
        current === bestIndex ? current : bestIndex
      );
    };

    const observer = new IntersectionObserver(
      (entries) => {
        let changed = false;

        entries.forEach((entry) => {
          const index = items.indexOf(entry.target as HTMLElement);
          if (index !== -1) {
            if (entry.isIntersecting) {
              visibleItems.set(index, entry.intersectionRatio);
            } else {
              visibleItems.delete(index);
            }
            changed = true;
          }
        });

        if (changed) {
          cancelAnimationFrame(rafIdRef.current);
          rafIdRef.current = requestAnimationFrame(updateIndex);
        }
      },
      {
        root: rail,
        threshold: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1],
      }
    );

    items.forEach((item) => observer.observe(item));

    const handleScroll = () => {
      cancelAnimationFrame(rafIdRef.current);
      rafIdRef.current = requestAnimationFrame(updateIndex);
    };

    rail.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      observer.disconnect();
      rail.removeEventListener("scroll", handleScroll);
      cancelAnimationFrame(rafIdRef.current);
    };
  }, [contentKey, direction]);

  return {
    railRef,
    activeIndex,
  };
}
