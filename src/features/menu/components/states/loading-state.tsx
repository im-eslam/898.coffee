import { Icon } from "@/shared/icons";
import { Background } from "./background";

interface LoadingStateStrings {
  title: string;
  description?: string;
}

interface LoadingStateProps {
  strings: LoadingStateStrings;
  className?: string;
}

const styles = {
  section:
    "relative isolate flex min-h-dvh flex-col items-center justify-center overflow-hidden px-6 py-12 text-center",
  content: "relative z-10 flex w-full max-w-md flex-col items-center",
  iconWrapper: "relative w-32 h-32 mb-8 flex items-center justify-center",
  iconBase: "absolute inset-0 text-sand",
  iconFill:
    "absolute inset-0 text-brand loading-cup-fill motion-reduce:animate-none",
  title: "text-title font-bold text-charcoal text-balance",
  description: "mt-3 max-w-sm text-body text-taupe text-balance",
} as const;

export function LoadingState({ strings: s, className }: LoadingStateProps) {
  return (
    <section className={[styles.section, className].filter(Boolean).join(" ")}>
      <Background />

      <style>{`
        @keyframes liquid-fill {
          0%, 15% { clip-path: inset(100% 0 0 0); }
          45%, 55% { clip-path: inset(0 0 0 0); }
          85%, 100% { clip-path: inset(100% 0 0 0); }
        }
        .loading-cup-fill {
          animation: liquid-fill 2.5s var(--ease-smooth) infinite;
        }
        @media (prefers-reduced-motion: reduce) {
          .loading-cup-fill {
            clip-path: inset(0 0 0 0);
          }
        }
      `}</style>

      <div className={styles.content}>
        <div className={styles.iconWrapper} aria-hidden="true">
          <Icon name="cup" size={128} className={styles.iconBase} />
          <Icon name="cup" size={128} className={styles.iconFill} />
        </div>

        <h2 className={styles.title}>{s.title}</h2>
        {s.description && <p className={styles.description}>{s.description}</p>}
      </div>
    </section>
  );
}
