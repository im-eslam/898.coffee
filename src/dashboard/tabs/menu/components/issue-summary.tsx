import { useStrings } from "@/shared/i18n";
import { useDraft } from "../hooks/use-draft-context";
import { strings } from "../strings";

const styles = {
  root: "rounded-xl border border-error/40 bg-error/5 p-4",
  title: "text-small font-semibold text-error",
  list: "mt-2 flex flex-col gap-1 text-small text-slate-700",
  path: "font-mono text-slate-500",
} as const;

export function IssueSummary() {
  const s = useStrings(strings);
  const { issues } = useDraft();

  if (issues.length === 0) return null;

  return (
    <div role="alert" className={styles.root}>
      <p className={styles.title}>{s.issues.summary}</p>
      <ul className={styles.list}>
        {issues.map((issue, index) => (
          <li key={`${issue.path}-${index}`}>
            <span className={styles.path}>{issue.path}</span> — {issue.message}
          </li>
        ))}
      </ul>
    </div>
  );
}
