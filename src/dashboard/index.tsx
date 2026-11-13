import { Button } from "react-aria-components";
import { useStrings } from "@/shared/i18n";
import { LoginScreen } from "./login";
import { Shell } from "./shell";
import { strings } from "./strings";
import { DEFAULT_TAB, TABS, findTab } from "./routes";
import { useDashboard } from "./use-dashboard";

function LoadingState() {
  const s = useStrings(strings);
  return (
    <p role="status" className="py-12 text-center text-body text-slate-500">
      {s.loading}
    </p>
  );
}

function SessionErrorState({ onRetry }: { onRetry: () => void }) {
  const s = useStrings(strings);
  return (
    <div
      role="alert"
      className="flex min-h-dvh flex-col items-center justify-center gap-4 bg-slate-50 px-4 text-center"
    >
      <p className="text-body text-slate-700">{s.sessionError}</p>
      <Button
        onPress={onRetry}
        className="inline-flex h-10 items-center rounded-lg bg-brand px-4 text-small font-semibold text-white data-hovered:bg-navy"
      >
        {s.retry}
      </Button>
    </div>
  );
}

export function Dashboard() {
  const { session, path, signIn, signOut, retry } = useDashboard();

  switch (session.status) {
    case "checking":
      return <LoadingState />;

    case "error":
      return <SessionErrorState onRetry={retry} />;

    case "signed-out":
      return <LoginScreen onSignedIn={signIn} />;

    case "signed-in": {
      const tab = findTab(path) ?? DEFAULT_TAB;
      const Page = tab.page;

      return (
        <Shell
          username={session.user.username}
          tabs={TABS}
          activeKey={tab.key}
          onLogout={signOut}
        >
          <Page />
        </Shell>
      );
    }
  }
}
