import { lazy, Suspense } from "react";
import { ROUTES, Route, Switch, useLocation } from "@/shared/router";
import { LandingPage } from "@/features/landing";

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

export default function App() {
  const [location] = useLocation();

  return (
    <div className="app-shell">
      <Suspense fallback={null}>
        <Switch>
          <Route path={ROUTES.landing} component={LandingPage} />
          <Route path={ROUTES.review} component={LandingPage} />
          <Route path={ROUTES.menu} component={MenuPage} />
          <Route component={NotFoundPage} />
        </Switch>
      </Suspense>

      {location === ROUTES.review && (
        <Suspense fallback={null}>
          <ReviewPage />
        </Suspense>
      )}
    </div>
  );
}
