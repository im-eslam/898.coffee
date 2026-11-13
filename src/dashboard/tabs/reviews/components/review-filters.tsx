import { Button, Input, SearchField } from "react-aria-components";
import { useStrings } from "@/shared/i18n";
import { Icon } from "@/shared/icons";
import { strings } from "../strings";

const styles = {
  wrap: "flex w-full flex-col",
  inputWrap: "relative",
  icon:
    "pointer-events-none absolute inset-y-0 start-3 my-auto text-slate-400",
  input:
    "h-12 w-full rounded-xl border border-slate-300 bg-white ps-10 pe-12 text-body text-slate-900 outline-none transition-colors placeholder:text-slate-400 focus:border-brand focus:ring-4 focus:ring-brand/15",
  clear:
    "absolute inset-y-0 end-2 my-auto inline-flex size-8 items-center justify-center rounded-full text-slate-500 outline-none data-[hovered]:bg-slate-100 data-[focus-visible]:ring-4 data-[focus-visible]:ring-brand/15",
} as const;

interface ReviewFiltersProps {
  q: string;
  onQueryChange: (value: string) => void;
}

export function ReviewFilters({ q, onQueryChange }: ReviewFiltersProps) {
  const s = useStrings(strings);

  return (
    <SearchField
      aria-label={s.search.label}
      value={q}
      onChange={onQueryChange}
      className={styles.wrap}
    >
      <div className={styles.inputWrap}>
        <Icon name="search" size={18} className={styles.icon} />
        <Input placeholder={s.search.placeholder} className={styles.input} />
        {q !== "" && (
          <Button className={styles.clear} aria-label={s.search.clear}>
            <Icon name="close" size={14} />
          </Button>
        )}
      </div>
    </SearchField>
  );
}
