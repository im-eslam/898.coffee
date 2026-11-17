import { DropIndicator, useDragAndDrop, type Key } from "react-aria-components";

const styles = {
  indicator:
    "-my-px h-0.5 bg-transparent data-[drop-target]:bg-brand",
} as const;

export function useReorder(
  onMove: (
    keys: Set<Key>,
    target: Key,
    position: "before" | "after" | "on"
  ) => void
) {
  return useDragAndDrop({
    getItems: (keys) => [...keys].map((key) => ({ "text/plain": String(key) })),
    onReorder: (event) =>
      onMove(event.keys, event.target.key, event.target.dropPosition),
    renderDropIndicator: (target) => (
      <DropIndicator target={target} className={styles.indicator} />
    ),
  });
}
