import type { ReactNode } from "react";

interface BaseHeadingProps {
  children: ReactNode;
  className?: string;
}

interface SectionHeadingProps extends BaseHeadingProps {
  variant?: "section";
  sub?: string;
}

interface SheetHeadingProps extends BaseHeadingProps {
  variant: "sheet";
}

type HeadingProps = SectionHeadingProps | SheetHeadingProps;

const styles = {
  section: "flex flex-col gap-1",
  title: "text-title font-bold tracking-tight text-balance text-charcoal",
  sub: "text-small font-medium text-navy/80",
} as const;

export function Heading(props: HeadingProps) {
  const { children, className } = props;

  if (props.variant === "sheet") {
    return (
      <h2 data-sheet-title className={`${styles.title} ${className ?? ""}`}>
        {children}
      </h2>
    );
  }

  return (
    <div className={`${styles.section} ${className ?? ""}`}>
      <h2 className={styles.title}>{children}</h2>
      {props.sub && <p className={styles.sub}>{props.sub}</p>}
    </div>
  );
}
