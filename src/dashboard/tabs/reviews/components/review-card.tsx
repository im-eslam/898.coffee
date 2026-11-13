import { useEffect, useRef } from "react";
import { Button } from "react-aria-components";
import { useLocale, useStrings } from "@/shared/i18n";
import { Icon } from "@/shared/icons";
import { type Review } from "../api";
import { formatCreatedAt } from "../lib/date-formater";
import { strings } from "../strings";

const LONG_PRESS_MS = 500;

const styles = {
  card: "flex w-full select-none flex-col gap-2 rounded-2xl border p-4 text-start outline-none transition-colors [-webkit-touch-callout:none] data-[pressed]:bg-slate-50 data-[focus-visible]:ring-4 data-[focus-visible]:ring-brand/15",
  cardIdle: "border-slate-200 bg-white",
  cardSelected: "border-brand bg-brand/5",
  top: "flex items-center gap-3",
  check: "flex size-5 shrink-0 items-center justify-center rounded border",
  checkIdle: "border-slate-400 bg-white",
  checkOn: "border-brand bg-brand text-white",
  name: "min-w-0 flex-1 truncate text-body font-semibold text-slate-900",
  date: "shrink-0 text-small text-slate-500",
  contact: "text-small text-slate-500",
  message: "line-clamp-3 text-body text-slate-700",
} as const;

interface ReviewCardProps {
  review: Review;
  selecting: boolean;
  selected: boolean;
  onOpen: (review: Review) => void;
  onToggle: (id: number) => void;
  onLongPress: (id: number) => void;
}

export function ReviewCard({
  review,
  selecting,
  selected,
  onOpen,
  onToggle,
  onLongPress,
}: ReviewCardProps) {
  const s = useStrings(strings);
  const locale = useLocale();
  const name = review.name || s.card.anonymous;
  const timer = useRef<number | undefined>(undefined);
  const longPressed = useRef(false);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  return (
    <li>
      <Button
        aria-label={selecting ? name : `${s.card.open}: ${name}`}
        aria-pressed={selecting ? selected : undefined}
        className={`${styles.card} ${selected ? styles.cardSelected : styles.cardIdle}`}
        onPressStart={() => {
          longPressed.current = false;
          timer.current = window.setTimeout(() => {
            longPressed.current = true;
            onLongPress(review.id);
          }, LONG_PRESS_MS);
        }}
        onPressEnd={() => window.clearTimeout(timer.current)}
        onPress={() => {
          if (longPressed.current) {
            longPressed.current = false;
            return;
          }
          if (selecting) onToggle(review.id);
          else onOpen(review);
        }}
      >
        <span className={styles.top}>
          {selecting && (
            <span
              className={`${styles.check} ${selected ? styles.checkOn : styles.checkIdle}`}
            >
              {selected && <Icon name="check" size={14} />}
            </span>
          )}
          <span className={styles.name}>{name}</span>
          <span className={styles.date}>
            {formatCreatedAt(review.created_at, locale)}
          </span>
        </span>
        <span className={styles.contact}>
          {review.contact || s.card.noContact}
        </span>
        <span className={styles.message}>{review.message}</span>
      </Button>
    </li>
  );
}
