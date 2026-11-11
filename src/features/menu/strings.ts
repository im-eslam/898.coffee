import { useLocale, type Localized } from "@/shared/i18n";
import type { Pricing, Product } from "./types/menu-models";

const en = {
  brandName: "898 Coffee",
  currency: "EGP",

  loadingMenu: "Loading the menu…",
  errorTitle: "We couldn’t load the menu",
  errorNetwork: "Check your connection and try again.",
  errorServer: "Something went wrong on our side. Please try again shortly.",
  retry: "Try again",

  signaturesTitle: "Our signatures",
  signaturesSub: "The ones everyone comes back for",
  signaturesPill: "Signatures",
  pairingsTitle: "Pairings & offers",
  pairingsSub: "Better together, for less",
  pairingsPill: "Offers",
  saveChip: (amount: string) => `Save ${amount}`,

  categoriesTitle: "Categories",
  showAll: (name: string, count: number) => `Show all ${name} (${count})`,

  oftenOrdered: "Often ordered with",
  size: "Size",
  addOns: "Add-ons",
  baristaWay: "The barista’s way",
  baristaSub: "Our recommended way to enjoy it",

  outOfStock: "Out of stock",
  badgeTop: "Top pick",
  badgeNew: "New",

  searchPlaceholder: "Search the menu",
  searchPrompt: "Search for a drink, a dessert or an offer.",
  searchNoMatch: (query: string) => `No results for “${query}”.`,
  groupCategories: "Categories",
  groupOffers: "Offers",
  groupItems: "Items",
  itemsCountOne: "1 result",
  itemsCount: (n: number) => `${n} results`,

  promoAlt: "Special offer",

  a11yClose: "Close",
  a11ySearch: "Search",
  a11yCategories: "Browse categories",
  a11yBackHome: "Back to home",
  a11yLanguage: "Change language",
  a11yOpenProduct: (name: string) => `Open ${name}`,
};

const ar: typeof en = {
  brandName: "898 Coffee",
  currency: "ج.م",

  loadingMenu: "جاري تحميل القائمة…",
  errorTitle: "مقدرناش نحمّل القائمة",
  errorNetwork: "اتأكد من الاتصال بالإنترنت وجرّب تاني.",
  errorServer: "حصلت مشكلة من عندنا. جرّب تاني بعد شوية.",
  retry: "حاول تاني",

  signaturesTitle: "مشروباتنا المميزة",
  signaturesSub: "اللي الكل بيرجع علشانها",
  signaturesPill: "المميّز",
  pairingsTitle: "توليفات وعروض",
  pairingsSub: "أحلى مع بعض وبسعر أقل",
  pairingsPill: "العروض",
  saveChip: (amount: string) => `وفّر ${amount}`,

  categoriesTitle: "الأقسام",
  showAll: (name: string, count: number) => `عرض كل ${name} (${count})`,

  oftenOrdered: "بيتطلب معاه كتير",
  size: "الحجم",
  addOns: "إضافات",
  baristaWay: "طريقة الباريستا",
  baristaSub: "الطريقة اللي بننصح بيها",

  outOfStock: "غير متوفر",
  badgeTop: "الأكثر طلبًا",
  badgeNew: "جديد",

  searchPlaceholder: "ابحث في القائمة",
  searchPrompt: "ابحث عن مشروب أو حلو أو عرض.",
  searchNoMatch: (query: string) => `مفيش نتايج لـ “${query}”.`,
  groupCategories: "الأقسام",
  groupOffers: "العروض",
  groupItems: "الأصناف",
  itemsCountOne: "نتيجة واحدة",
  itemsCount: (n: number) => `${n} نتايج`,

  promoAlt: "عرض خاص",

  a11yClose: "إغلاق",
  a11ySearch: "بحث",
  a11yCategories: "تصفّح الأقسام",
  a11yBackHome: "العودة للرئيسية",
  a11yLanguage: "تغيير اللغة",
  a11yOpenProduct: (name: string) => `فتح ${name}`,
};

export const strings: Localized<typeof en> = { en, ar };

// Latin digits in both languages so animated prices (Rolling) work in Arabic too.
const NUMBER_LOCALES = { en: "en-EG", ar: "ar-EG-u-nu-latn" } as const;

export function useMoney() {
  const locale = useLocale();
  const { currency } = strings[locale];
  return (value: number, plus?: boolean): string => {
    const formatted = Math.round(value).toLocaleString(NUMBER_LOCALES[locale]);
    return `${plus ? "+" : ""}${formatted} ${currency}`;
  };
}

// ==== Pricing helpers shared by cards and sheets ====

export function getProductPrice(pricing: Pricing) {
  const opt = pricing.options[0];
  return {
    current: opt?.final ?? 0,
    regular: opt && opt.discount > 0 ? opt.price : null,
  };
}

export function getSelectedOption(pricing: Pricing, optionId: string | null) {
  return pricing.options.find((o) => o.id === optionId) ?? pricing.options[0];
}

export function sumAddOns(product: Product, addOnIds: string[]) {
  const known = new Map(
    [...product.addOns, ...product.baristaWay].map((a) => [a.id, a.price]),
  );
  return addOnIds.reduce((sum, id) => sum + (known.get(id) ?? 0), 0);
}
