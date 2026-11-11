import { Button } from "react-aria-components";

interface LanguageToggleStrings {
  name: string;
  lang: string;
}

interface LanguageToggleProps {
  strings: LanguageToggleStrings;
  onPress: () => void;
  className?: string;
}

const styles = {
  button:
    "group inline-flex min-h-12 min-w-12 items-center justify-center p-1 outline-none",
  surface:
    "inline-flex min-h-10 min-w-10 items-center justify-center rounded-full bg-white/85 px-4 text-small font-bold whitespace-nowrap text-navy transition duration-interactive ease-smooth group-data-hovered:bg-white group-data-pressed:scale-[0.97] group-data-focus-visible:outline-2 group-data-focus-visible:outline-offset-2 group-data-focus-visible:outline-brand motion-reduce:transition-none",
} as const;

export function LanguageToggle({
  strings: s,
  onPress,
  className,
}: LanguageToggleProps) {
  return (
    <Button onPress={onPress} className={`${styles.button} ${className ?? ""}`}>
      <span lang={s.lang} className={styles.surface}>
        {s.name}
      </span>
    </Button>
  );
}
