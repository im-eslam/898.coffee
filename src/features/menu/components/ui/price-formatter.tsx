import type { Locale } from "@/shared/i18n";

export function createMoneyFormatter(
  locale: Locale,
  currency: string
): (value: number, plus?: boolean) => string {
  const numberFormatter = new Intl.NumberFormat(locale, {
    maximumFractionDigits: 0,
    numberingSystem: "latn",
  });

  return (value, plus = false) => {
    const number = numberFormatter.format(Math.round(value));
    const amount = `${plus ? "+" : ""}${number}`;

    return currency ? `${amount} ${currency}` : amount;
  };
}
