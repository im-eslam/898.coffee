interface FooterStrings {
  lead: string;
  emphasis: string;
  copyright: string;  
}

interface FooterProps {
  strings: FooterStrings;
  className?: string;
}

const styles = {
  footer: "flex flex-col items-center gap-2 text-center",
  lead: "text-small text-navy",
  emphasis: "font-bold text-brand",
  copyright: "text-caption whitespace-nowrap text-navy/80",
} as const;

export function Footer({ strings: s, className }: FooterProps) {
  return (
    <footer className={`${styles.footer} ${className ?? ""}`}>
      <p className={styles.lead}>
        {s.lead}{" "}
        <span className={styles.emphasis}>{s.emphasis}</span>
      </p>
      <p dir="ltr" className={styles.copyright}>
        {s.copyright}
      </p>
    </footer>
  );
}
