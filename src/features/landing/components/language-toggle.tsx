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
    "inline-flex min-h-10 min-w-10 items-center justify-center rounded-full bg-white/85 px-4 text-small font-bold whitespace-nowrap text-navy transition duration-interactive ease-smooth group-hover:bg-white group-active:scale-[0.97] group-focus-visible:outline-2 group-focus-visible:outline-offset-2 group-focus-visible:outline-brand motion-reduce:transition-none",
  arabicLabel: "font-system",
} as const;

export function LanguageToggle({
  strings: s,
  onPress,
  className,
}: LanguageToggleProps) {
  const surfaceClassName = [
    styles.surface,
    s.lang === "ar" && styles.arabicLabel,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button
      type="button"
      onClick={onPress}
      className={`${styles.button} ${className ?? ""}`}
    >
      <span lang={s.lang} className={surfaceClassName}>
        {s.name}
      </span>
    </button>
  );
}
