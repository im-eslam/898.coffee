import type { Locale } from "@/shared/i18n";
import type {
  AddOn,
  Pairing,
  PriceOption,
  Pricing,
  Product,
  ProductRef,
} from "../types/menu-models";

export function getSelectedOption(
  pricing: Pricing,
  optionId: string | null
): PriceOption | undefined {
  return (
    pricing.options.find((option) => option.id === optionId) ??
    pricing.options[0]
  );
}

export function getProductPrice(pricing: Pricing) {
  const option = pricing.options[0];

  return {
    current: option?.final ?? 0,
    regular: option && option.discount > 0 ? option.price : null,
  };
}

export function isProductAvailable(product: ProductRef): boolean {
  return product.availability === "in_stock";
}

export function isPairingAvailable(pairing: Pairing): boolean {
  return pairing.items.every((product) => isProductAvailable(product));
}

export function sumAddOns(product: Product, addOnIds: string[]): number {
  const all: AddOn[] = [...product.addOns, ...product.baristaWay];

  return all
    .filter((addOn) => addOnIds.includes(addOn.id))
    .reduce((sum, addOn) => sum + addOn.price, 0);
}

export function getProductTotal(
  product: Product,
  optionId: string | null,
  addOnIds: string[]
): number {
  const option = getSelectedOption(product.pricing, optionId);
  return (option?.final ?? 0) + sumAddOns(product, addOnIds);
}

export function getPairingTotal(
  pairing: Pairing,
  optionIds: (string | null)[],
  addOnIds: string[][]
): number {
  const upgrades = pairing.items.reduce((sum, product, index) => {
    const selected = getSelectedOption(
      product.pricing,
      optionIds[index] ?? null
    );
    const base = product.pricing.options[0]?.final ?? 0;
    return sum + ((selected?.final ?? 0) - base);
  }, 0);

  const addOns = pairing.items.reduce(
    (sum, product, index) => sum + sumAddOns(product, addOnIds[index] ?? []),
    0
  );

  return pairing.pricing.final + upgrades + addOns;
}

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
