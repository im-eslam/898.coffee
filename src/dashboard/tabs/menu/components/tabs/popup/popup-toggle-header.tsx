import { Switch } from "react-aria-components";

const styles = {
  header: "flex items-center justify-between gap-4 p-6",
  copy: "flex flex-col gap-1",
  title: "text-body font-semibold text-slate-900",
  subtitle: "text-small text-slate-500",
  switch:
    "group inline-flex min-h-11 shrink-0 cursor-pointer items-center outline-none data-[focus-visible]:outline-2 data-[focus-visible]:outline-offset-2 data-[focus-visible]:outline-brand",
  track:
    "relative h-6 w-11 rounded-full bg-slate-300 transition-colors duration-200 group-data-[selected]:bg-brand group-data-[pressed]:opacity-90",
  thumb:
    "absolute top-0.5 left-0.5 size-5 rounded-full bg-white transition-transform duration-200 group-data-[selected]:translate-x-5 rtl:group-data-[selected]:-translate-x-5",
} as const;

export interface PopupToggleHeaderProps {
  title: string;
  subtitle: string;
  isEnabled: boolean;
  onToggle: (enabled: boolean) => void;
}

export function PopupToggleHeader({
  title,
  subtitle,
  isEnabled,
  onToggle,
}: PopupToggleHeaderProps) {
  return (
    <div className={styles.header}>
      <div className={styles.copy}>
        <h2 className={styles.title}>{title}</h2>
        <p className={styles.subtitle}>{subtitle}</p>
      </div>

      <Switch
        aria-label={title}
        className={styles.switch}
        isSelected={isEnabled}
        onChange={onToggle}
      >
        <span className={styles.track} aria-hidden="true">
          <span className={styles.thumb} />
        </span>
      </Switch>
    </div>
  );
}
