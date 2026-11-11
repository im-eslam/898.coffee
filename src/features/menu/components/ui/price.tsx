type PriceSize = "caption" | "small" | "body" | "heading";

interface PriceProps {
  value: number;
  formatMoney: (value: number, plus?: boolean) => string;
  regular?: number | null;
  variant?: "inline" | "bar";
  size?: PriceSize;
  plus?: boolean;
  rolling?: boolean;
  showCurrency?: boolean;
  className?: string;
}

const styles = {
  number: "font-bold tabular-nums",
  discount: "inline-flex flex-wrap items-baseline gap-x-1.5",
  struck: "text-caption font-medium text-navy/65 tabular-nums line-through",

  bar: "flex h-14 w-full items-center justify-center rounded-full bg-brand px-4 text-center text-heading font-bold text-white",

  rolling: "relative inline-flex items-baseline tabular-nums",
  visual: "inline-flex items-baseline",
  plain: "whitespace-pre",
  numberGroup: "inline-flex",
  slot: "inline-block h-[1lh] overflow-clip",
  column:
    "flex flex-col transition-transform duration-300 ease-smooth motion-reduce:transition-none",
  digit: "block h-[1lh]",
  srOnly: "sr-only",
} as const;

const sizes: Record<PriceSize, string> = {
  caption: "text-caption",
  small: "text-small",
  body: "text-body",
  heading: "text-heading",
};

const DIGITS = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

function DigitSlot({ digit }: { digit: number }) {
  return (
    <span className={styles.slot}>
      <span
        className={styles.column}
        style={{ transform: `translateY(${-digit}lh)` }}
      >
        {DIGITS.map((value) => (
          <span key={value} className={styles.digit}>
            {value}
          </span>
        ))}
      </span>
    </span>
  );
}

function NumberGroup({ text }: { text: string }) {
  const chars = [...text];
  let place = chars.filter((char) => /\d/.test(char)).length;

  return (
    <span dir="ltr" className={styles.numberGroup}>
      {chars.map((char, index) =>
        /\d/.test(char) ? (
          <DigitSlot key={`d${--place}`} digit={Number(char)} />
        ) : (
          <span key={`s${chars.length - index}`} className={styles.plain}>
            {char}
          </span>
        )
      )}
    </span>
  );
}

function Rolling({ text }: { text: string }) {
  return (
    <span className={styles.rolling}>
      <span className={styles.srOnly}>{text}</span>
      <span aria-hidden="true" className={styles.visual}>
        {text.split(/(\d[\d,.]*)/).map((part, index) =>
          index % 2 === 1 ? (
            <NumberGroup key={index} text={part} />
          ) : (
            part !== "" && (
              <span key={index} className={styles.plain}>
                {part}
              </span>
            )
          )
        )}
      </span>
    </span>
  );
}

export function Price({
  value,
  formatMoney,
  regular,
  variant = "inline",
  size = "small",
  plus,
  rolling = variant === "bar",
  showCurrency = true,
  className,
}: PriceProps) {
  const text = showCurrency
    ? formatMoney(value, plus)
    : `${plus ? "+" : ""}${Math.round(value)}`;

  const content = rolling ? <Rolling text={text} /> : <bdi>{text}</bdi>;

  if (variant === "bar") {
    return <div className={`${styles.bar} ${className ?? ""}`}>{content}</div>;
  }

  return (
    <span className={`${styles.discount} ${className ?? ""}`}>
      <span className={`${styles.number} ${sizes[size]}`}>{content}</span>
      {regular != null && value < regular && (
        <bdi className={styles.struck}>{Math.round(regular)}</bdi>
      )}
    </span>
  );
}
