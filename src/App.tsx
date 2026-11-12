import { lazy, Suspense } from "react";
import { I18nProvider } from "react-aria-components";
import { ROUTES, Route, Switch } from "@/shared/router";
import { useLocale } from "@/shared/i18n";
import { LandingPage } from "@/features/landing/";

// Dynamically import the heavier secondary routes and features
const MenuPage = lazy(() =>
  import("@/features/menu/index").then((m) => ({ default: m.MenuPage }))
);
const ReviewPage = lazy(() =>
  import("@/features/review").then((m) => ({ default: m.ReviewPage }))
);
const NotFoundPage = lazy(() =>
  import("@/features/not-found/").then((m) => ({ default: m.NotFoundPage }))
);

export default function App() {
  const locale = useLocale();
  return (
    <div className="app-shell">
      <I18nProvider locale={locale}>
        <Suspense fallback={null}>
          <Switch>
            <Route path={ROUTES.landing} component={LandingPage} />
            <Route path={ROUTES.review} component={LandingPage} />
            <Route path={ROUTES.menu} component={MenuPage} />
            <Route component={NotFoundPage} />
          </Switch>
          <ReviewPage />
        </Suspense>
      </I18nProvider>
    </div>
  );
}
