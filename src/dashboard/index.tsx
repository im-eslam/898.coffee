import { Button } from "react-aria-components";
import { Toaster } from "react-hot-toast";
import { useStrings } from "@/shared/i18n";
import { LoginScreen } from "./login";
import { SessionProvider } from "./auth-session";
import { Shell } from "./shell";
import { strings } from "./strings";
import { DEFAULT_TAB, TABS, findTab } from "./routes";
import { useDashboard } from "./use-dashboard";

const loadingStyles = {
  text: "py-12 text-center text-body text-slate-500",
} as const;

function LoadingState() {
  const s = useStrings(strings);
  return (
    <p role="status" className={loadingStyles.text}>
      {s.loading}
    </p>
  );
}

const errorStyles = {
  container:
    "flex min-h-dvh flex-col items-center justify-center gap-4 bg-slate-50 px-4 text-center",
  text: "text-body text-slate-700",
  button:
    "inline-flex h-10 items-center rounded-lg bg-brand px-4 text-small font-semibold text-white data-hovered:bg-navy",
} as const;

function SessionErrorState({ onRetry }: { onRetry: () => void }) {
  const s = useStrings(strings);
  return (
    <div role="alert" className={errorStyles.container}>
      <p className={errorStyles.text}>{s.sessionError}</p>
      <Button onPress={onRetry} className={errorStyles.button}>
        {s.retry}
      </Button>
    </div>
  );
}

function DashboardView() {
  const { session, path, signIn, signOut, retry, updateUser } = useDashboard();

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
        <SessionProvider user={session.user} updateUser={updateUser}>
          <Shell tabs={TABS} activeKey={tab.key} onLogout={signOut}>
            <Page />
          </Shell>
        </SessionProvider>
      );
    }
  }
}

export function Dashboard() {
  return (
    <>
      <DashboardView />
      <Toaster position="bottom-center" />
    </>
  );
}
