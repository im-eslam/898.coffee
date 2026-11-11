import logo from "@/assets/mark.svg";
import { useStrings } from "@/shared/i18n";
import { Link, ROUTES } from "@/shared/router";
import { Background } from "./components/background";
import { strings } from "./strings";

const styles = {
  page: "relative isolate flex min-h-dvh items-center justify-center px-6 py-[max(2.5rem,env(safe-area-inset-bottom))]",
  content: "flex w-full max-w-md flex-col items-center text-center",
  logo: "mb-8 w-32",
  code: "text-[clamp(5rem,30vw,8rem)] leading-none font-bold tracking-tight text-brand",
  title: "mt-5 text-title font-bold text-charcoal text-balance",
  message: "mt-3 max-w-xs text-body text-taupe text-balance",
  link: "mt-8 inline-flex min-h-12 items-center justify-center rounded-full bg-brand px-6 text-small font-bold text-white transition-colors duration-interactive ease-smooth hover:bg-navy focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand motion-reduce:transition-none",
} as const;

export function NotFoundPage() {
  const s = useStrings(strings);

  return (
    <main className={styles.page}>
      <Background />
      <div className={styles.content}>
        <img
          src={logo}
          width={462}
          height={447}
          fetchPriority="high"
          decoding="async"
          className={styles.logo}
        />
        <p className={styles.code}>{s.page.code}</p>
        <h1 className={styles.title}>{s.page.title}</h1>
        <p className={styles.message}>{s.page.message}</p>
        <Link href={ROUTES.landing} className={styles.link}>
          {s.actions.home}
        </Link>
      </div>
    </main>
  );
}
