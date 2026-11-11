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

  const [edges, setEdges] = useState<Edges>({
    start: false,
    end: false,
  });

  useLayoutEffect(() => {
    const rail = railRef.current;
    if (!rail) return;

    let disposed = false;
    let measureFrame = 0;
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

    function measure() {
      if (disposed) return;

      const items = getItems();
      const activeItem = items.find((item) => item.dataset.navId === activeId);

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

      const first = items[0];
      const last = items[items.length - 1];

      let nextEdges: Edges = {
        start: false,
        end: false,
      };

      if (first && last) {
        const railBox = rail!.getBoundingClientRect();
        const firstBox = first.getBoundingClientRect();
        const lastBox = last.getBoundingClientRect();
        const tolerance = 2;

        nextEdges =
          direction === "rtl"
            ? {
                start: firstBox.right > railBox.right + tolerance,
                end: lastBox.left < railBox.left - tolerance,
              }
            : {
                start: firstBox.left < railBox.left - tolerance,
                end: lastBox.right > railBox.right + tolerance,
              };
      }

      setEdges((current) =>
        current.start === nextEdges.start && current.end === nextEdges.end
          ? current
          : nextEdges
      );
    }

    function scheduleMeasure() {
      if (disposed || measureFrame) return;

      measureFrame = requestAnimationFrame(() => {
        measureFrame = 0;
        measure();
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

    measure();
    centerActiveItem();
    scheduleMeasure();

    animationFrame = requestAnimationFrame(() => {
      animationFrame = requestAnimationFrame(() => {
        if (!disposed) {
          setCanAnimate(true);
        }
      });
    });

    rail.addEventListener("scroll", scheduleMeasure, {
      passive: true,
    });

    const observer = new ResizeObserver(scheduleMeasure);
    observer.observe(rail);

    getItems().forEach((item) => observer.observe(item));

    void document.fonts.ready.then(() => {
      if (!disposed) {
        scheduleMeasure();
      }
    });

    return () => {
      disposed = true;

      cancelAnimationFrame(measureFrame);
      cancelAnimationFrame(animationFrame);
      observer.disconnect();

      rail.removeEventListener("scroll", scheduleMeasure);
    };
  }, [activeId, contentKey, direction]);

  function startTouch() {
    touching.current = true;
  }

  function endTouch() {
    touching.current = false;
  }

  return {
    railRef,
    highlight,
    canAnimate,
    edges,
    startTouch,
    endTouch,
  };
}
