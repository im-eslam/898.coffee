import logo from "@/assets/mark.svg";

interface HeaderStrings {
  brandName: string;
  taglineLead: string;
  taglineEmphasis: string;
}

interface HeaderProps {
  strings: HeaderStrings;
  className?: string;
}

const styles = {
  header: "flex flex-col items-center text-center",
  logo: "w-[clamp(10.5rem,50vw,13rem)] h-auto",
  tagline: "mt-5 max-w-72 text-body text-navy",
  emphasis: "font-bold text-brand",
} as const;

export function Header({ strings: s, className }: HeaderProps) {
  return (
    <header className={`${styles.header} ${className ?? ""}`}>
      <h1>
        <img
          src={logo}
          alt={s.brandName}
          width={2142}
          height={1470}
          fetchPriority="high"
          decoding="async"
          className={styles.logo}
        />
      </h1>
      <p className={styles.tagline}>
        {s.taglineLead}{" "}
        <span className={styles.emphasis}>{s.taglineEmphasis}</span>
      </p>
    </header>
  );
}
