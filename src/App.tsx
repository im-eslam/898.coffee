import { I18nProvider } from "react-aria-components";
import { ROUTES, Route, Switch } from "@/shared/router";
import { useLocale } from "@/shared/i18n";
import { NotFoundPage } from "@/features/not-found/";
import { LandingPage } from "@/features/landing/";
import { ReviewPage } from "@/features/review";
import { MenuPage } from "@/features/menu/index";

export default function App() {
  const locale = useLocale();
  return (
    <div className="app-shell">
      <I18nProvider locale={locale}>
        <Switch>
          <Route path={ROUTES.landing} component={LandingPage} />
          <Route path={ROUTES.review} component={LandingPage} />
          <Route path={ROUTES.menu} component={MenuPage} />
          <Route component={NotFoundPage} />
        </Switch>
        <ReviewPage />
      </I18nProvider>
    </div>
  );
}
