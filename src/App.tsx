import { lazy, Suspense } from "react";
import { ROUTES, Route, Switch } from "@/shared/router";
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

const DashboardPage = lazy(() =>
  import("@/dashboard").then((module) => ({
    default: module.Dashboard,
  }))
);

export default function App() {
  return (
    <div className="app-shell">
      <Suspense fallback={null}>
        <Switch>
          <Route path={ROUTES.landing} component={LandingPage} />
          <Route path={ROUTES.review} component={LandingPage} />
          <Route path={ROUTES.menu} component={MenuPage} />
          <Route path={ROUTES.dashboard} component={DashboardPage} />
          <Route path={`${ROUTES.dashboard}/*`} component={DashboardPage} />
          <Route component={NotFoundPage} />
        </Switch>
      </Suspense>
      <ReviewPage />
    </div>
  );
}
