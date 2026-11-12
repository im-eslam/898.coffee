import { lazy, Suspense } from "react";
import { Icon } from "@/shared/icons";
import { useStrings } from "@/shared/i18n";
import { ROUTES, Route, Switch, useLocation } from "@/shared/router";
import { LandingPage } from "@/features/landing";
import { strings as landingStrings } from "@/features/landing/strings";

const MenuPage = lazy(() =>
  import("@/features/menu").then((module) => ({
    default: module.MenuPage,
  }))
);
const ReviewPage = lazy(() =>
  import("@/features/review").then((module) => ({
    default: module.ReviewPage,
  }))
);
const NotFoundPage = lazy(() =>
  import("@/features/not-found").then((module) => ({
    default: module.NotFoundPage,
  }))
);

function RouteLoadingState() {
  const s = useStrings(landingStrings);

  return (
    <div
      role="status"
      aria-label={s.loadingLabel}
      className="flex min-h-dvh items-center justify-center gap-3 bg-cream px-6 text-brand"
    >
      <Icon name="cup" size={40} />
      <span className="text-body font-bold text-navy">{s.loadingLabel}</span>
    </div>
  );
}

export default function App() {
  const [location] = useLocation();

  return (
    <div className="app-shell">
      <Suspense fallback={<RouteLoadingState />}>
        <Switch>
          <Route path={ROUTES.landing} component={LandingPage} />
          <Route path={ROUTES.review} component={LandingPage} />
          <Route path={ROUTES.menu} component={MenuPage} />
          <Route component={NotFoundPage} />
        </Switch>
      </Suspense>

      {location === ROUTES.review && (
        <Suspense fallback={<RouteLoadingState />}>
          <ReviewPage />
        </Suspense>
      )}
    </div>
  );
}
