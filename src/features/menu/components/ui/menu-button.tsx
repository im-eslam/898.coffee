import type { ReactNode } from "react";
import { Button } from "react-aria-components";
import { Icon } from "@/shared/icons";

type MenuButtonType = "button" | "submit" | "reset";
type MenuButtonWidth = "full" | "auto";
type CloseButtonSize = "s" | "m";

interface BaseButtonProps {
  onPress?: () => void;
  isDisabled?: boolean;
  className?: string;
}

interface TextButtonProps extends BaseButtonProps {
  children: ReactNode;
  type?: MenuButtonType;
  width?: MenuButtonWidth;
}

interface PrimaryButtonProps extends TextButtonProps {
  variant?: "primary";
  compact?: boolean;
  short?: boolean;
}

interface SecondaryButtonProps extends TextButtonProps {
  variant: "secondary";
}

interface CloseButtonProps extends BaseButtonProps {
  variant: "close";
  label: string;
  size?: CloseButtonSize;
}

type MenuButtonProps =
  PrimaryButtonProps | SecondaryButtonProps | CloseButtonProps;

const styles = {
  base: "flex shrink-0 items-center justify-center rounded-full transition-[transform,background-color,border-color] duration-(--duration-interactive) ease-smooth data-disabled:cursor-default data-disabled:opacity-50 motion-reduce:transition-none",
  primary:
    "bg-brand text-center font-bold text-white data-hovered:bg-navy data-pressed:scale-[0.98]",
  secondary:
    "h-12 gap-2 border border-brand bg-transparent px-4 text-center text-small font-semibold text-brand data-hovered:bg-brand/5 data-pressed:scale-[0.98] data-pressed:bg-brand/10",
  focus:
    "outline-none data-focus-visible:outline-2 data-focus-visible:outline-offset-2 data-focus-visible:outline-brand",
  full: "w-full",
  auto: "w-auto",
  tall: "h-14",
  short: "h-12",
  regular: "px-4 text-heading",
  compact: "px-3 text-body sm:text-heading",
  close: "group size-12 outline-none",
  closeSurface:
    "flex items-center justify-center rounded-full bg-white/85 text-navy transition-[transform,background-color] duration-(--duration-interactive) ease-smooth group-data-hovered:bg-white group-data-pressed:scale-90 group-data-focus-visible:outline-2 group-data-focus-visible:outline-offset-2 group-data-focus-visible:outline-brand motion-reduce:transition-none",
} as const;

const closeSizes: Record<CloseButtonSize, { surface: string; icon: string }> = {
  s: {
    surface: "size-7 ring-1 ring-arctic",
    icon: "size-3.5",
  },
  m: {
    surface: "size-10",
    icon: "size-5",
  },
};

export function MenuButton(props: MenuButtonProps) {
  const { onPress, isDisabled, className } = props;

  if (props.variant === "close") {
    const look = closeSizes[props.size ?? "m"];

    return (
      <Button
        type="button"
        aria-label={props.label}
        onPress={onPress}
        isDisabled={isDisabled}
        className={`${styles.base} ${styles.close} ${className ?? ""}`}
      >
        <span
          aria-hidden="true"
          className={`${styles.closeSurface} ${look.surface}`}
        >
          <Icon name="close" className={look.icon} />
        </span>
      </Button>
    );
  }

  let appearance: string;
  let defaultWidth: MenuButtonWidth;

  if (props.variant === "secondary") {
    appearance = styles.secondary;
    defaultWidth = "auto";
  } else {
    appearance = [
      styles.primary,
      props.short ? styles.short : styles.tall,
      props.compact ? styles.compact : styles.regular,
    ].join(" ");

    defaultWidth = "full";
  }

  const width = props.width ?? defaultWidth;

  const buttonClassName = [
    styles.base,
    styles.focus,
    appearance,
    width === "full" ? styles.full : styles.auto,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <Button
      type={props.type ?? "button"}
      onPress={onPress}
      isDisabled={isDisabled}
      className={buttonClassName}
    >
      {props.children}
    </Button>
  );
}
