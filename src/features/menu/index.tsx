import { Button } from "react-aria-components";
import { useStrings } from "@/shared/i18n";
import { ROUTES } from "@/shared/router";
import { HeaderBar } from "./components/header/header-bar";
import { HeaderNav } from "./components/header/header-nav";
import { useData } from "./hooks/use-data";
import { useMenu } from "./hooks/use-menu";
import { strings } from "./strings";
import type { Menu } from "./types/menu-models";

interface ReadyMenuPageProps {
  menu: Menu;
}

const styles = {
  page: "min-h-screen bg-cream text-charcoal",
  header: "sticky top-0 z-30 border-b border-sand bg-cream",

  content: "mx-auto flex w-full max-w-5xl flex-col gap-6 px-4 py-6 md:px-6",
  section: "min-h-screen rounded-lg border border-sand bg-white/40 p-5 md:p-6",
  sectionTitle: "text-title font-bold text-charcoal",

  status:
    "flex min-h-screen flex-col items-center justify-center gap-4 bg-cream px-4 text-center text-small text-charcoal",
  retry:
    "min-h-12 rounded-full border border-taupe px-5 font-semibold text-charcoal data-hovered:bg-sand/40",
  empty: "py-12 text-center text-small text-taupe",
} as const;

export function MenuPage() {
  const data = useData();

  if (data.status === "loading") {
    return (
      <main className={styles.status}>
        <p>Loading menu…</p>
      </main>
    );
  }

  if (data.status === "error") {
    return (
      <main className={styles.status}>
        <p>
          {data.isNetworkError
            ? "Check your connection and try again."
            : "Couldn't load the menu."}
        </p>

        <Button type="button" onPress={data.retry} className={styles.retry}>
          Try again
        </Button>
      </main>
    );
  }

  return <ReadyMenuPage menu={data.menu} />;
}

function ReadyMenuPage({ menu }: ReadyMenuPageProps) {
  const s = useStrings(strings);

  const {
    locale,
    sections,
    activeId,
    headerRef,
    selectSection,
    toggleLanguage,
    openSearch,
    openCategories,
  } = useMenu(menu);

  return (
    <div className={styles.page}>
      <header ref={headerRef} className={styles.header}>
        <HeaderBar
          strings={{
            brandName: s.header.bar.brandName,
            language: {
              name: s.header.bar.language.name,
              lang: s.header.bar.language.lang,
            },
          }}
          backHref={ROUTES.landing}
          onSearch={openSearch}
          onLanguageChange={toggleLanguage}
        />

        <HeaderNav
          sections={sections}
          activeId={activeId}
          direction={locale === "ar" ? "rtl" : "ltr"}
          onSelect={selectSection}
          onCategories={openCategories}
        />
      </header>

      <main className={styles.content}>
        {sections.length === 0 && (
          <p className={styles.empty}>No menu sections available.</p>
        )}

        {sections.map((section) => (
          <section key={section.id} id={section.id} className={styles.section}>
            <h2 className={styles.sectionTitle}>{section.label}</h2>
          </section>
        ))}
      </main>
    </div>
  );
}

export default MenuPage;
