import { useState, useSyncExternalStore, type ReactNode } from "react";
import { Button } from "react-aria-components";
import { useStrings } from "@/shared/i18n";
import { Icon } from "@/shared/icons";
import type { Review } from "./api";
import { DeleteConfirm } from "./components/delete-confirm";
import { ReviewCard } from "./components/review-card";
import { ReviewDialog } from "./components/review-dialog";
import { ReviewFilters } from "./components/review-filters";
import { ReviewSheet } from "./components/review-sheet";
import { ReviewTable } from "./components/review-table";
import { useReviewSelection } from "./hooks/use-review-selection";
import { useReviews } from "./hooks/use-reviews";
import { fill, strings } from "./strings";

const styles = {
  page: "flex w-full flex-col gap-5",
  cards: "flex flex-col gap-3 transition-opacity",
  busy: "opacity-60",
  state:
    "flex flex-col items-center gap-3 py-12 text-center text-body text-slate-500",
  retry:
    "inline-flex h-10 items-center rounded-lg border border-slate-300 bg-white px-4 text-small font-semibold text-slate-700 data-[hovered]:bg-slate-50",
  bulk: "sticky top-16 z-10 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 md:top-auto md:bottom-4",
  bulkCount: "text-small font-semibold text-slate-900",
  bulkActions: "flex items-center gap-2",
  bulkClear:
    "inline-flex h-10 items-center rounded-lg px-3 text-small font-semibold text-slate-700 data-[hovered]:bg-slate-100",
  bulkDelete:
    "inline-flex h-10 items-center gap-2 rounded-lg bg-error px-4 text-small font-semibold text-white data-[hovered]:opacity-90 data-[disabled]:opacity-60",
  pagination: "flex items-center justify-between gap-3",
  pageInfo: "text-small text-slate-500",
  pageButton:
    "inline-flex h-10 items-center rounded-lg border border-slate-300 bg-white px-4 text-small font-semibold text-slate-700 data-[hovered]:bg-slate-50 data-[disabled]:opacity-50",
} as const;

const DESKTOP_QUERY = "(min-width: 768px)";

function subscribeDesktop(onChange: () => void) {
  const query = window.matchMedia(DESKTOP_QUERY);
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
}

// One breakpoint decides the whole layout. Only one tree is rendered.
function useIsDesktop() {
  return useSyncExternalStore(
    subscribeDesktop,
    () => window.matchMedia(DESKTOP_QUERY).matches,
    () => false
  );
}

export function ReviewsPage() {
  const s = useStrings(strings);
  const isDesktop = useIsDesktop();
  const reviews = useReviews();

  const [activeReview, setActiveReview] = useState<Review | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  // Bumped on every open so the detail body resets its confirm step.
  const [openCount, setOpenCount] = useState(0);

  const selection = useReviewSelection({
    visibleIds: reviews.items.map((review) => review.id),
    onDeleted: (ids) => {
      reviews.refresh();
      if (activeReview && ids.includes(activeReview.id)) setDetailOpen(false);
    },
  });

  const selecting = selection.selectedCount > 0;

  function openReview(review: Review) {
    setActiveReview(review);
    setOpenCount((count) => count + 1);
    setDetailOpen(true);
  }

  function deleteOne(review: Review) {
    return selection.deleteIds([review.id]);
  }

  const isInitialLoad = reviews.loading && reviews.items.length === 0;
  const showError = reviews.failed && reviews.items.length === 0;
  const showEmpty = !reviews.loading && !reviews.failed && reviews.total === 0;
  const searching = reviews.q.trim() !== "";
  const busy = reviews.loading ? styles.busy : "";

  let list: ReactNode;
  if (isInitialLoad) {
    list = (
      <p role="status" className={styles.state}>
        {s.page.loading}
      </p>
    );
  } else if (showError) {
    list = (
      <div className={styles.state}>
        <p>{s.page.loadFailed}</p>
        <Button onPress={reviews.refresh} className={styles.retry}>
          {s.page.retry}
        </Button>
      </div>
    );
  } else if (showEmpty) {
    list = (
      <p className={styles.state}>
        {searching ? s.page.noResults : s.page.empty}
      </p>
    );
  } else if (isDesktop) {
    list = (
      <div aria-busy={reviews.loading} className={busy}>
        <ReviewTable
          items={reviews.items}
          selectedIds={selection.selected}
          allSelected={selection.allVisibleSelected}
          someSelected={selection.someVisibleSelected}
          onToggle={selection.toggleOne}
          onToggleAll={selection.toggleAllVisible}
          onOpen={openReview}
        />
      </div>
    );
  } else {
    list = (
      <ul aria-busy={reviews.loading} className={`${styles.cards} ${busy}`}>
        {reviews.items.map((review) => (
          <ReviewCard
            key={review.id}
            review={review}
            selecting={selecting}
            selected={selection.selected.includes(review.id)}
            onOpen={openReview}
            onToggle={selection.toggleOne}
            onLongPress={selection.toggleOne}
          />
        ))}
      </ul>
    );
  }

  return (
    <div className={styles.page}>
      <ReviewFilters q={reviews.q} onQueryChange={reviews.setQ} />

      {selecting && (
        <div className={styles.bulk}>
          <span className={styles.bulkCount}>
            {fill(s.bulk.selected, { count: selection.selectedCount })}
          </span>
          <div className={styles.bulkActions}>
            <Button
              onPress={selection.clearSelection}
              className={styles.bulkClear}
            >
              {s.bulk.clear}
            </Button>
            <Button
              onPress={() => selection.askBulkDelete(selection.selected)}
              isDisabled={selection.deleting}
              className={styles.bulkDelete}
            >
              <Icon name="trash" size={16} />
              {s.bulk.delete}
            </Button>
          </div>
        </div>
      )}

      {list}

      {reviews.totalPages > 1 && (
        <nav className={styles.pagination}>
          <Button
            isDisabled={reviews.page <= 1 || reviews.loading}
            onPress={() => reviews.setPage(reviews.page - 1)}
            className={styles.pageButton}
          >
            {s.page.pagination.previous}
          </Button>
          <span className={styles.pageInfo}>
            {fill(s.page.pagination.info, {
              page: reviews.page,
              total: reviews.totalPages,
            })}
          </span>
          <Button
            isDisabled={reviews.page >= reviews.totalPages || reviews.loading}
            onPress={() => reviews.setPage(reviews.page + 1)}
            className={styles.pageButton}
          >
            {s.page.pagination.next}
          </Button>
        </nav>
      )}

      {isDesktop ? (
        <ReviewDialog
          review={activeReview}
          isOpen={detailOpen}
          resetKey={openCount}
          deleting={selection.deleting}
          onClose={() => setDetailOpen(false)}
          onDelete={deleteOne}
        />
      ) : (
        <ReviewSheet
          review={activeReview}
          isOpen={detailOpen}
          resetKey={openCount}
          deleting={selection.deleting}
          onClose={() => setDetailOpen(false)}
          onDelete={deleteOne}
        />
      )}

      <DeleteConfirm
        count={selection.confirmIds?.length ?? 0}
        isOpen={selection.confirmIds !== null}
        deleting={selection.deleting}
        onCancel={selection.cancelBulkDelete}
        onConfirm={selection.confirmBulkDelete}
      />
    </div>
  );
}
