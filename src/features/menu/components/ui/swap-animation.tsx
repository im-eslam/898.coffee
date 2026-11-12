import { useState, type ReactNode } from "react";

interface SwapAnimationProps {
  value: string | number | boolean;
  children: ReactNode;
  block?: boolean;
  className?: string;
}

const styles = {
  inline: "inline-flex",
  block: "block w-full",
  changed: "animate-swap-in motion-reduce:animate-none",
} as const;

export function SwapAnimation({
  value,
  children,
  block = false,
  className,
}: SwapAnimationProps) {
  const key = String(value);

  const [previous, setPrevious] = useState(key);
  const [changed, setChanged] = useState(false);

  if (previous !== key) {
    setPrevious(key);
    setChanged(true);
  }

  const animationClassName = [
    block ? styles.block : styles.inline,
    changed && styles.changed,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <span
      key={key}
      className={animationClassName}
      onAnimationEnd={() => setChanged(false)}
    >
      {" "}
      {children}
    </span>
  );
}
