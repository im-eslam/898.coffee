import { Button } from "react-aria-components";
import { useLocale, useStrings } from "@/shared/i18n";
import { type Review } from "../api";
import { formatCreatedAt } from "../lib/date-formater";
import { fill, strings } from "../strings";

const styles = {
  wrap: "overflow-x-auto rounded-2xl border border-slate-200 bg-white",
  table:
    "w-full min-w-[680px] border-collapse text-start text-body text-slate-900 select-none",
  head: "border-b border-slate-200 bg-slate-50 px-4 py-3 text-start text-small font-semibold text-slate-600",
  selectHead: "w-12 border-b border-slate-200 bg-slate-50 px-4 py-3",
  actionsHead: "w-16 border-b border-slate-200 bg-slate-50 px-4 py-3",
  row: "border-b border-slate-100 last:border-0 hover:bg-slate-50",
  select: "w-12 px-4 py-3 align-middle",
  name: "max-w-[12rem] px-4 py-3 align-middle font-semibold",
  muted: "px-4 py-3 align-middle text-slate-500",
  message: "px-4 py-3 align-middle",
  messageText: "line-clamp-2 max-w-md",
  actions: "w-16 px-4 py-3 align-middle",
  box: "size-5 cursor-pointer rounded accent-brand",
  view: "inline-flex size-9 items-center justify-center rounded-lg text-slate-500 outline-none data-[hovered]:bg-brand/5 data-[hovered]:text-brand data-[focus-visible]:ring-4 data-[focus-visible]:ring-brand/15",
} as const;

interface ReviewTableProps {
  items: Review[];
  selectedIds: number[];
  allSelected: boolean;
  someSelected: boolean;
  onToggle: (id: number) => void;
  onToggleAll: () => void;
  onOpen: (review: Review) => void;
}

export function ReviewTable({
  items,
  selectedIds,
  allSelected,
  someSelected,
  onToggle,
  onToggleAll,
  onOpen,
}: ReviewTableProps) {
  const s = useStrings(strings);
  const locale = useLocale();

  return (
    <div className={styles.wrap}>
      <table aria-label={s.table.caption} className={styles.table}>
        <thead>
          <tr>
            <th scope="col" className={styles.selectHead}>
              <SelectBox
                label={s.table.selectAll}
                checked={allSelected}
                indeterminate={someSelected && !allSelected}
                onChange={onToggleAll}
              />
            </th>
            <th scope="col" className={styles.head}>
              {s.table.name}
            </th>
            <th scope="col" className={styles.head}>
              {s.table.contact}
            </th>
            <th scope="col" className={styles.head}>
              {s.table.message}
            </th>
            <th scope="col" className={styles.head}>
              {s.table.date}
            </th>
            <th scope="col" className={styles.actionsHead}>
              <span className="sr-only">{s.table.actions}</span>
            </th>
          </tr>
        </thead>

        <tbody>
          {items.map((review) => {
            const name = review.name || s.card.anonymous;
            return (
              <tr
                key={review.id}
                className={styles.row}
                onDoubleClick={() => onOpen(review)}
              >
                <td
                  className={styles.select}
                  onDoubleClick={(event) => event.stopPropagation()}
                >
                  <SelectBox
                    label={fill(s.table.selectRow, { name })}
                    checked={selectedIds.includes(review.id)}
                    onChange={() => onToggle(review.id)}
                  />
                </td>
                <td className={styles.name}>{name}</td>
                <td className={styles.muted}>
                  {review.contact || s.card.noContact}
                </td>
                <td className={styles.message}>
                  <span className={styles.messageText}>{review.message}</span>
                </td>
                <td className={styles.muted}>
                  {formatCreatedAt(review.created_at, locale)}
                </td>
                <td className={styles.actions}>
                  <Button
                    aria-label={`${s.card.open}: ${name}`}
                    onPress={() => onOpen(review)}
                    className={styles.view}
                  >
                    <EyeIcon />
                  </Button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

interface SelectBoxProps {
  label: string;
  checked: boolean;
  indeterminate?: boolean;
  onChange: () => void;
}

function SelectBox({
  label,
  checked,
  indeterminate = false,
  onChange,
}: SelectBoxProps) {
  return (
    <input
      type="checkbox"
      aria-label={label}
      checked={checked}
      ref={(element) => {
        if (element) element.indeterminate = indeterminate;
      }}
      onChange={onChange}
      className={styles.box}
    />
  );
}

function EyeIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width={18}
      height={18}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}
