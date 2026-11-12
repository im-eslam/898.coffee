import { Icon } from "@/shared/icons";

type ChevronSize = "s" | "m" | "l";

interface ChevronProps {
  size?: ChevronSize;
  className?: string;
}

const styles = {
  root: "flex shrink-0 items-center justify-center rounded-full bg-mist text-brand",
} as const;

const sizes: Record<ChevronSize, { root: string; icon: string }> = {
  s: {
    root: "size-6",
    icon: "size-3",
  },
  m: {
    root: "size-7",
    icon: "size-4",
  },
  l: {
    root: "size-8",
    icon: "size-4",
  },
};

export function Chevron({ size = "l", className }: ChevronProps) {
  const look = sizes[size];

  return (
    <span
      aria-hidden="true"
      className={`${styles.root} ${look.root} ${className ?? ""}`}
    >
      <Icon name="arrow" className={look.icon} />
    </span>
  );
}
