import { useDeferredValue, useMemo, useState } from "react";
import type { Locale } from "@/shared/i18n";
import type { Category, Menu, Pairing, Product } from "../../types/menu";

export interface SearchResults {
  categories: Category[];
  pairings: Pairing[];
  products: Product[];
}

interface IndexEntry<T> {
  item: T;
  fields: string[];
}

interface SearchIndex {
  categories: IndexEntry<Category>[];
  pairings: IndexEntry<Pairing>[];
  products: IndexEntry<Product>[];
}

const EMPTY_RESULTS: SearchResults = {
  categories: [],
  pairings: [],
  products: [],
};

const ARABIC_MARKS = /[\u0640\u064B-\u065F\u0670]/g;
const ALEF_VARIANTS = /[\u0622\u0623\u0625]/g;
const PLAIN_ALEF = "\u0627";
const WHITESPACE = /\s+/g;

function normalize(value: string, locale: Locale): string {
  return value
    .toLocaleLowerCase(locale)
    .replace(ARABIC_MARKS, "")
    .replace(ALEF_VARIANTS, PLAIN_ALEF)
    .replace(WHITESPACE, " ")
    .trim();
}

function buildSearchIndex(menu: Menu, locale: Locale): SearchIndex {
  const products = new Map<string, Product>();

  for (const category of menu.categories) {
    for (const product of category.products) {
      if (!products.has(product.id)) {
        products.set(product.id, product);
      }
    }
  }

  return {
    categories: menu.categories.map((category) => ({
      item: category,
      fields: [normalize(category.name[locale], locale)],
    })),

    pairings: menu.pairings.map((pairing) => ({
      item: pairing,
      fields: pairing.items.map((product) =>
        normalize(product.name[locale], locale)
      ),
    })),

    products: Array.from(products.values(), (product) => ({
      item: product,
      fields: [
        normalize(product.name[locale], locale),
        normalize(product.description[locale], locale),
      ],
    })),
  };
}

function matches<T>(text: string, entry: IndexEntry<T>): boolean {
  return entry.fields.some((field) => field.includes(text));
}

function searchMenu(
  index: SearchIndex,
  query: string,
  locale: Locale
): SearchResults {
  const text = normalize(query, locale);

  if (text === "") {
    return EMPTY_RESULTS;
  }

  return {
    categories: index.categories
      .filter((entry) => matches(text, entry))
      .map((entry) => entry.item),

    pairings: index.pairings
      .filter((entry) => matches(text, entry))
      .map((entry) => entry.item),

    products: index.products
      .filter((entry) => matches(text, entry))
      .map((entry) => entry.item),
  };
}

export function useSearch(menu: Menu, locale: Locale) {
  const [query, setQuery] = useState("");
  const deferredQuery = useDeferredValue(query);

  const index = useMemo(() => buildSearchIndex(menu, locale), [menu, locale]);

  const results = useMemo(
    () => searchMenu(index, deferredQuery, locale),
    [index, deferredQuery, locale]
  );

  const hasQuery = normalize(deferredQuery, locale) !== "";

  const total =
    results.categories.length +
    results.pairings.length +
    results.products.length;

  return {
    query,
    setQuery,
    appliedQuery: deferredQuery.trim(),
    hasQuery,
    results,
    total,
  };
}
