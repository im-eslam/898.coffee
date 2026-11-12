import type { ReactNode } from "react";
import { useStrings } from "@/shared/i18n";
import { Icon } from "@/shared/icons";
import { config } from "../../strings";

type BadgeLabelKind = keyof typeof config.badges.en;
type ContentBadgeKind = "detail" | "savings";

interface BaseBadgeProps {
  compact?: boolean;
  outlined?: boolean;
  className?: string;
}

interface LabelBadgeProps extends BaseBadgeProps {
  kind: BadgeLabelKind;
  children?: never;
}

interface ContentBadgeProps extends BaseBadgeProps {
  kind?: ContentBadgeKind;
  children: ReactNode;
}

type BadgeProps = LabelBadgeProps | ContentBadgeProps;

const styles = {
  base: "inline-flex max-w-full items-center gap-1 rounded-full text-caption",
  regular: "min-h-6 px-3 py-1",
  compact: "min-h-5 px-2 py-0.5",
  label: "shrink-0 leading-none whitespace-nowrap",
  content: "text-balance tabular-nums",
  outlined: "ring-1 ring-white",
  stockOutline: "ring-1 ring-navy/30",
  star: "size-3 shrink-0",
} as const;

const kinds: Record<BadgeLabelKind | ContentBadgeKind, string> = {
  detail: "bg-cream font-medium text-charcoal",
  savings: "bg-success font-semibold text-white",
  top: "bg-honey font-semibold text-charcoal",
  new: "bg-brand font-semibold text-white",
  outOfStock: "bg-white/85 font-semibold text-navy",
};

export function Badge({
  kind = "detail",
  children,
  compact,
  outlined,
  className,
}: BadgeProps) {
  const s = useStrings(config.badges);

  const isLabel = kind === "top" || kind === "new" || kind === "outOfStock";

  const content = isLabel ? s[kind] : children;

  const ring = outlined
    ? styles.outlined
    : kind === "outOfStock"
      ? styles.stockOutline
      : isLabel
        ? styles.outlined
        : undefined;

  const badgeClassName = [
    styles.base,
    compact ? styles.compact : styles.regular,
    isLabel ? styles.label : styles.content,
    kinds[kind],
    ring,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <span className={badgeClassName}>
      {kind === "top" && (
        <span aria-hidden="true" className={styles.star}>
          <Icon name="star" className={styles.star} />
        </span>
      )}

      {content}
    </span>
  );
}
