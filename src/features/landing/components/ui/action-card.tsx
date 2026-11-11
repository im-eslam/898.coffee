import { Icon } from "@/shared/icons";
import { Link } from "@/shared/router";
import type { IconName } from "@/shared/icons";
import type { AppRoute } from "@/shared/router";

type ActionCardTone = "standard" | "featured" | "social";

interface ActionCardStrings {
  icon: IconName;
  title: string;
  hint?: string;
}

interface BaeActionCardProps {
  strings: ActionCardStrings;
  tone?: ActionCardTone;
  className?: string;
}
interface InternalActionCardProps extends BaeActionCardProps {
  to: AppRoute;
}
interface ExternalActionCardProps extends BaeActionCardProps {
  href: string;
}

type ActionCardProps = InternalActionCardProps | ExternalActionCardProps;

const styles = {
  cardBase:
    "group flex min-h-16 w-full items-center gap-4 rounded-lg border px-4 py-3 outline-none transition duration-interactive ease-smooth focus-visible:ring-2 focus-visible:ring-brand active:scale-95 motion-reduce:transition-none",
  bubbleBase:
    "flex size-11 shrink-0 items-center justify-center rounded-full transition-colors duration-interactive ease-smooth motion-reduce:transition-none",
  textContainer: "flex min-w-0 flex-1 flex-col",
  title: "text-heading font-bold",
  hint: "text-small opacity-80",
  arrowBase:
    "size-5 shrink-0 transition-transform duration-interactive ease-smooth group-hover:translate-x-1 rtl:group-hover:-translate-x-1 motion-reduce:transition-none",
  srOnly: "sr-only",
} as const;

const tones: Record<
  ActionCardTone,
  { card: string; bubble: string; arrow: string }
> = {
  standard: {
    card: "border-white/50 bg-white/80 text-navy hover:bg-white hover:border-brand",
    bubble: "bg-arctic/60 text-brand group-hover:bg-arctic",
    arrow: "text-navy/40 group-hover:text-brand",
  },
  featured: {
    card: "border-transparent bg-brand text-white hover:border-arctic",
    bubble: "bg-white text-brand",
    arrow: "text-white/80 group-hover:text-white",
  },
  social: {
    card: "border-white/50 bg-white/80 text-navy hover:bg-white hover:border-brand",
    bubble: "bg-brand text-white",
    arrow: "text-navy/40 group-hover:text-brand",
  },
};

export function ActionCard(props: ActionCardProps) {
  const { strings: s, tone = "standard", className } = props;

  const look = tones[tone];
  const cardClassName = [styles.cardBase, look.card, className]
    .filter(Boolean)
    .join(" ");

  const content = (
    <>
      <span className={`${styles.bubbleBase} ${look.bubble}`}>
        <Icon name={s.icon} />
      </span>
      <span className={styles.textContainer}>
        <span className={styles.title}>{s.title}</span>
        {s.hint && <span className={styles.hint}>{s.hint}</span>}
      </span>
      <Icon name="arrow" className={`${styles.arrowBase} ${look.arrow}`} />
    </>
  );

  if ("to" in props) {
    return (
      <Link href={props.to} className={cardClassName}>
        {content}
      </Link>
    );
  }

  return (
    <a
      href={props.href}
      target="_blank"
      rel="noopener noreferrer"
      className={cardClassName}
    >
      {content}
      <span className={styles.srOnly}></span>
    </a>
  );
}
