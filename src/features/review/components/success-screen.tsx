import { Button } from "react-aria-components";
import { Icon } from "@/shared/icons";

interface SuccessScreenStrings {
  message: string;
  closeLabel: string;
}

interface SuccessScreenProps {
  strings: SuccessScreenStrings;
  onClose: () => void;
}

const styles = {
  wrapper:
    "flex flex-col items-center gap-4 py-8 text-center animate-reveal-in",
  bubble:
    "flex size-16 items-center justify-center rounded-full bg-success text-white",
  icon: "size-8",
  message: "text-heading mt-2 font-bold text-navy text-balance",
  button:
    "text-small mt-4 min-h-12 w-full rounded-full bg-brand px-8 text-center font-bold text-white outline-none transition duration-interactive ease-smooth data-focus-visible:ring-2 data-focus-visible:ring-brand data-focus-visible:ring-offset-2 data-hovered:bg-brand/90 [@media(hover:hover)_and_(pointer:fine)]:data-pressed:scale-[0.98] motion-reduce:transition-none",
};

export function SuccessScreen({ strings: s, onClose }: SuccessScreenProps) {
  return (
    <section className={styles.wrapper}>
      <span className={styles.bubble}>
        <Icon name="check" className={styles.icon} />
      </span>

      <p className={styles.message}>{s.message}</p>

      <Button onPress={onClose} className={styles.button}>
        {s.closeLabel}
      </Button>
    </section>
  );
}
