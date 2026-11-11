import { Button } from "react-aria-components";
import { useStrings } from "@/shared/i18n";
import type { MenuError } from "@/features/menu/api/menu";
import { strings } from "@/features/menu/strings";

interface MenuErrorStateProps {
  error: MenuError;
  onRetry: () => void;
}

const styles = {
  root: "flex min-h-dvh flex-col items-center justify-center gap-4 bg-cream px-6 text-center",
  title: "text-title font-bold text-charcoal",
  message: "text-small font-medium text-taupe",
  retry:
    "text-small min-h-12 rounded-full bg-brand px-6 font-bold text-white outline-none transition duration-interactive ease-smooth data-focus-visible:ring-2 data-focus-visible:ring-brand data-focus-visible:ring-offset-2 data-hovered:bg-brand/90 data-pressed:scale-[0.98] motion-reduce:transition-none",
} as const;

export function MenuErrorState({ error, onRetry }: MenuErrorStateProps) {
  const t = useStrings(strings);
  const message =
    error === "server" ? t.states.errorServer : t.states.errorNetwork;

  return (
    <main className={styles.root}>
      <h1 className={styles.title}>{t.states.errorTitle}</h1>
      <p className={styles.message}>{message}</p>
      <Button onPress={onRetry} className={styles.retry}>
        {t.states.retry}
      </Button>
    </main>
  );
}
