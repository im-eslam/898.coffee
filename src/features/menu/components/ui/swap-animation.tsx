import { useState, type ReactNode } from "react";

interface SwapAnimationProps {
  value: string | number | boolean;
  children: ReactNode;
  className?: string;
}

const styles = {
  root: "inline-flex",
  changed: "animate-pop-in motion-reduce:animate-none",
} as const;

export function SwapAnimation({
  value,
  children,
  className,
}: SwapAnimationProps) {
  const key = String(value);

  const [previous, setPrevious] = useState(key);
  const [changed, setChanged] = useState(false);

  if (previous !== key) {
    setPrevious(key);
    setChanged(true);
  }

  const animationClassName = [styles.root, changed && styles.changed, className]
    .filter(Boolean)
    .join(" ");

  return (
    <span key={key} className={animationClassName}>
      {children}
    </span>
  );
}
