import { useState } from "react";
import { Button } from "react-aria-components";
import { useLocale, useStrings } from "@/shared/i18n";
import { type Review } from "../api";
import { formatCreatedAt } from "../lib/date-formater";
import { strings } from "../strings";

const styles = {
  wrap: "flex flex-col gap-6 sm:gap-8",
  note: "whitespace-pre-line break-words rounded-xl bg-slate-50 p-5 sm:p-6 text-heading leading-relaxed text-slate-900",
  sender: "flex min-w-0 flex-col gap-1",
  senderName: "break-words text-body font-semibold text-slate-900",
  senderContact: "break-words text-small text-slate-500",
  meta: "border-t border-slate-100 pt-4 sm:pt-6 text-small text-slate-500",
  deleteButton:
    "inline-flex h-11 w-full items-center justify-center rounded-lg border border-error bg-white text-small font-semibold text-error outline-none data-[hovered]:bg-error/5 data-[pressed]:bg-error/10 data-[focus-visible]:ring-4 data-[focus-visible]:ring-error/20 data-[disabled]:opacity-60",
  confirm: "flex flex-col gap-6",
  confirmTitle: "text-heading font-semibold text-slate-900",
  confirmText: "text-body text-slate-600",
  confirmActions: "flex flex-col-reverse gap-3 sm:flex-row sm:justify-end",
  cancel:
    "inline-flex h-11 items-center justify-center rounded-lg border border-slate-300 px-5 text-small font-semibold text-slate-700 data-[hovered]:bg-slate-50 data-[disabled]:opacity-60",
  confirmButton:
    "inline-flex h-11 items-center justify-center rounded-lg bg-error px-5 text-small font-semibold text-white data-[hovered]:opacity-90 data-[disabled]:opacity-60",
} as const;

interface ReviewDetailBodyProps {
  review: Review;
  deleting: boolean;
  onDelete: (review: Review) => Promise<boolean>;
}

export function ReviewDetailBody({
  review,
  deleting,
  onDelete,
}: ReviewDetailBodyProps) {
  const s = useStrings(strings);
  const locale = useLocale();
  const [confirming, setConfirming] = useState(false);
  const name = review.name || s.card.anonymous;

  if (confirming) {
    return (
      <div className={styles.confirm}>
        <div className="flex flex-col gap-2">
          <p className={styles.confirmTitle}>{s.dialog.confirmTitle}</p>
          <p className={styles.confirmText}>{s.dialog.confirmText}</p>
        </div>
        <div className={styles.confirmActions}>
          <Button
            isDisabled={deleting}
            onPress={() => setConfirming(false)}
            className={styles.cancel}
          >
            {s.dialog.cancel}
          </Button>
          <Button
            isDisabled={deleting}
            onPress={async () => {
              const ok = await onDelete(review);
              if (!ok) setConfirming(false);
            }}
            className={styles.confirmButton}
          >
            {deleting ? s.dialog.deleting : s.dialog.confirmButton}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.wrap}>
      <p className={styles.note}>{review.message}</p>

      <div className={styles.sender}>
        <p className={styles.senderName}>{name}</p>
        <p className={styles.senderContact}>
          {review.contact || s.card.noContact}
        </p>
      </div>

      <p className={styles.meta}>
        {formatCreatedAt(review.created_at, locale)}
      </p>

      <Button
        isDisabled={deleting}
        onPress={() => setConfirming(true)}
        className={styles.deleteButton}
      >
        {s.dialog.delete}
      </Button>
    </div>
  );
}
