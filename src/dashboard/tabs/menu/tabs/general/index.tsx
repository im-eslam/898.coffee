import { useStrings } from "@/shared/i18n";
import { useLoadedDraft } from "../../hooks/use-draft-context";
import { strings } from "../../strings";

const styles = {
  root: "flex flex-col gap-6",
  card: "flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-6",
  label: "text-small font-medium text-slate-700",
  heading: "text-heading font-semibold text-slate-900",
  sub: "text-small text-slate-500",
  row: "flex flex-col gap-1",
  value: "text-body font-medium text-slate-900",
  list: "flex flex-col gap-3",
  badge: "rounded-lg bg-slate-50 p-3 text-small text-slate-700",
  badgeName: "font-semibold text-slate-900",
  warnings: "flex flex-col gap-2 text-small text-slate-700",
  mono: "font-mono text-slate-500",
} as const;

export function GeneralTab() {
  const s = useStrings(strings);
  const { draft, warnings } = useLoadedDraft();

  return (
    <div className={styles.root}>
      <section className={styles.card} aria-labelledby="general-currency">
        <h2 id="general-currency" className={styles.label}>
          {s.general.currency}
        </h2>
        <p className={styles.value}>{draft.currency}</p>
      </section>

      <section className={styles.card} aria-labelledby="general-badges">
        <h2 id="general-badges" className={styles.heading}>
          {s.general.badges}
        </h2>
        <p className={styles.sub}>{s.general.badgesText}</p>
        <ul className={styles.list}>
          {draft.badges.map((badge) => (
            <li key={badge} className={styles.badge}>
              <span className={styles.badgeName}>
                {badge === "top" ? s.editor.badgeTop : s.editor.badgeNew}
              </span>{" "}
              — {badge === "top" ? s.general.badgeTop : s.general.badgeNew}
            </li>
          ))}
        </ul>
      </section>

      <section className={styles.card} aria-labelledby="general-warnings">
        <h2 id="general-warnings" className={styles.heading}>
          {s.general.warnings}
        </h2>
        {warnings.length === 0 ? (
          <p className={styles.sub}>{s.general.noWarnings}</p>
        ) : (
          <ul className={styles.warnings}>
            {warnings.map((warning, index) => (
              <li key={`${warning.path}-${index}`}>
                <span className={styles.mono}>{warning.path}</span> —{" "}
                {warning.message}
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
