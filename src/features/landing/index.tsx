import { setLocale, useLocale, useStrings } from "@/shared/i18n";
import { ROUTES } from "@/shared/router";
import * as C from "./components/";
import { site } from "./data";
import { strings } from "./strings";

const styles = {
  page: "relative isolate",
  container:
    "relative mx-auto flex min-h-dvh w-full max-w-md flex-col gap-8 px-6 pt-6 pb-[max(2.5rem,env(safe-area-inset-bottom))]",
  headerSlot: "pt-10",
  toggleSlot: "absolute end-6 top-6 z-10",
  navSlot: "flex flex-1 flex-col gap-6",
  primaryGroup: "flex flex-col gap-3",
  navSection: "flex flex-col gap-3",
} as const;

const currentYear = new Date().getFullYear();

export function LandingPage() {
  const s = useStrings(strings);
  const otherLocale = useLocale() === "en" ? "ar" : "en";

  return (
    <main className={styles.page}>
      <C.Background />

      <div className={styles.container}>
        <C.LanguageToggle
          strings={{
            name: s.language.name,
            lang: otherLocale,
          }}
          onPress={() => setLocale(otherLocale)}
          className={styles.toggleSlot}
        />

        <C.Header
          strings={{
            brandName: site.brandName,
            taglineLead: s.header.taglineLead,
            taglineEmphasis: s.header.taglineEmphasis,
          }}
          className={styles.headerSlot}
        />

        <nav className={styles.navSlot}>
          <div className={styles.primaryGroup}>
            <C.ActionCard
              strings={{
                icon: "cup",
                title: s.sections.primary.menu.title,
                hint: s.sections.primary.menu.hint,
              }}
              tone="featured"
              to={ROUTES.menu}
            />
            <C.ActionCard
              strings={{
                icon: "star",
                title: s.sections.primary.review.title,
                hint: s.sections.primary.review.hint,
              }}
              to={ROUTES.review}
            />
          </div>

          <section className={styles.navSection}>
            <C.SectionTitle>{s.sections.social.title}</C.SectionTitle>
            <C.ActionCard
              strings={{
                icon: "instagram",
                title: site.instagram.name,
                hint: site.instagram.handle,
              }}
              tone="social"
              href={site.instagram.url}
            />
          </section>

          <section className={styles.navSection}>
            <C.SectionTitle>{s.sections.location.title}</C.SectionTitle>
            <C.ActionCard
              strings={{
                icon: "pin",
                title: s.sections.location.locationName,
              }}
              href={site.location.mapsUrl}
            />
          </section>
        </nav>

        <C.Footer
          strings={{
            lead: s.footer.lead,
            emphasis: s.footer.emphasis,
            copyright: `© ${currentYear} ${site.brandName}`,
          }}
        />
      </div>
    </main>
  );
}
