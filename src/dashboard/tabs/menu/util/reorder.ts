import type { Key } from "react-aria-components";

export function moveItems<T extends { uid: string }>(
  items: T[],
  keys: Set<Key>,
  targetKey: Key,
  position: "before" | "after" | "on"
): T[] {
  if (keys.has(targetKey)) return items;
  const moving = items.filter((item) => keys.has(item.uid));
  if (moving.length === 0) return items;
  const rest = items.filter((item) => !keys.has(item.uid));
  const targetIndex = rest.findIndex((item) => item.uid === targetKey);
  if (targetIndex === -1) return items;
  const insertAt = position === "before" ? targetIndex : targetIndex + 1;
  return [...rest.slice(0, insertAt), ...moving, ...rest.slice(insertAt)];
}

export function moveStrings(
  items: string[],
  keys: Set<Key>,
  targetKey: Key,
  position: "before" | "after" | "on"
): string[] {
  const wrapped = items.map((value) => ({ uid: value }));
  return moveItems(wrapped, keys, targetKey, position).map((i) => i.uid);
}
