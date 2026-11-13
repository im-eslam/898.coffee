import { Component, Suspense, type ReactNode } from "react";
import { Button } from "react-aria-components";
import { useStrings } from "@/shared/i18n";
import { reportError } from "@/shared/logging";
import { strings } from "../strings";

export function PageBoundary({ children }: { children: ReactNode }) {
  return (
    <ErrorBoundary>
      <Suspense fallback={<PageLoading />}>{children}</Suspense>
    </ErrorBoundary>
  );
}

function PageLoading() {
  const s = useStrings(strings);
  return (
    <p role="status" className="py-12 text-center text-body text-slate-500">
      {s.page.loading}
    </p>
  );
}

function PageLoadError() {
  const s = useStrings(strings);
  return (
    <div role="alert" className="flex flex-col items-start gap-3 py-8">
      <p className="text-body text-slate-600">{s.page.error}</p>
      <Button
        onPress={() => window.location.reload()}
        className="inline-flex h-10 items-center rounded-lg border border-slate-300 bg-white px-4 text-small font-semibold text-slate-700 data-hovered:bg-slate-50 data-pressed:bg-slate-100"
      >
        {s.page.retry}
      </Button>
    </div>
  );
}

interface ErrorBoundaryState {
  failed: boolean;
}

class ErrorBoundary extends Component<
  { children: ReactNode },
  ErrorBoundaryState
> {
  state: ErrorBoundaryState = { failed: false };

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { failed: true };
  }

  componentDidCatch(error: unknown) {
    reportError(error, { feature: "dashboard", operation: "load page" });
  }

  render() {
    if (this.state.failed) return <PageLoadError />;
    return this.props.children;
  }
}
