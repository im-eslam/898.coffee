import { useStrings } from "@/shared/i18n";
import { strings } from "@/features/menu/strings";

const styles = {
  root: "flex min-h-dvh flex-col items-center justify-center gap-3 bg-cream px-6 text-center",
  spinner:
    "size-10 animate-spin rounded-full border-2 border-arctic border-t-brand",
  label: "text-small font-medium text-taupe",
} as const;

export function MenuLoadingState() {
  const t = useStrings(strings);

  return (
    <main aria-busy="true" className={styles.root}>
      <div aria-hidden="true" className={styles.spinner} />
      <p className={styles.label}>{t.states.loading}</p>
    </main>
  );
}
