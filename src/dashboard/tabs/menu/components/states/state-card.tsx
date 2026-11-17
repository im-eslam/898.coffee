import type { ReactNode } from "react";
import { card } from "../ui/styles";

const stateCardClass = `${card} flex flex-col items-center gap-4 py-12 text-center`;

/** Centered card used for loading, error, and empty states. */
export function StateCard({ children }: { children: ReactNode }) {
  return <div className={stateCardClass}>{children}</div>;
}
