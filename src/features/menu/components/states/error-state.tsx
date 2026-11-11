import { Button } from "react-aria-components";
import { Background } from "./background";

interface ErrorStateStrings {
  title: string;
  description: string;
  retry: string;
}

interface ErrorStateProps {
  strings: ErrorStateStrings;
  onRetry: () => void;
  className?: string;
}

const styles = {
  section:
    "relative isolate flex flex-col items-center justify-center min-h-[60dvh] overflow-hidden px-6 py-12 text-center",
  content: "relative z-10 flex w-full max-w-md flex-col items-center",
  code: "text-[clamp(5rem,30vw,8rem)] leading-none font-bold tracking-tight text-brand",
  title: "mt-5 text-title font-bold text-charcoal text-balance",
  description: "mt-3 max-w-xs text-body text-taupe text-balance",
  button:
    "mt-8 inline-flex min-h-12 items-center justify-center rounded-full bg-brand px-8 text-small font-bold text-cream transition-colors duration-(--duration-interactive) ease-smooth hover:bg-navy focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand data-[pressed]:opacity-80 motion-reduce:transition-none",
} as const;

export function ErrorState({
  strings: s,
  onRetry,
  className,
}: ErrorStateProps) {
  return (
    <section className={[styles.section, className].filter(Boolean).join(" ")}>
      <Background />
      <div className={styles.content}>
        <p className={styles.code}>Error</p>
        <h2 className={styles.title}>{s.title}</h2>
        <p className={styles.description}>{s.description}</p>
        <Button type="button" onPress={onRetry} className={styles.button}>
          {s.retry}
        </Button>
      </div>
    </section>
  );
}
