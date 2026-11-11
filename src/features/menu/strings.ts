import type { Localized } from "@/shared/i18n";

const en = {
  common: {
    close: "Close",
    back: "Back to home",
  },
  language: {
    name: "عربي",
    switchTo: "Switch to Arabic",
  },
  badge: {
    new: "New",
    top: "Top pick",
    outOfStock: "Out of stock",
  },
  price: {
    from: "From",
  },
  states: {
    loading: "Loading the menu…",
    errorTitle: "Something went wrong",
    errorNetwork: "Check your connection and try again.",
    errorServer: "We couldn't load the menu right now. Please try again.",
    retry: "Try again",
  },
  header: {
    searchLabel: "Search the menu",
    categoriesLabel: "Browse categories",
  },
  nav: {
    categoriesTitle: "Categories",
    signaturesLabel: "Signatures",
    pairingsLabel: "Pairings",
  },
  sections: {
    signatures: {
      title: "Our signatures",
      subtitle: "The drinks people come back for",
    },
    pairings: {
      title: "Perfect pairings",
      subtitle: "Better together, for less",
    },
    showAll: (name: string, count: number) => `Show all ${count} in ${name}`,
  },
  product: {
    oftenOrderedWith: "Often ordered with",
    a11yOpen: (name: string) => `View ${name}`,
  },
  pairing: {
    save: (amount: string) => `Save ${amount}`,
  },
  search: {
    placeholder: "Search drinks, desserts, offers…",
    prompt: "Start typing to search the menu",
    noMatch: (query: string) => `No results for "${query}"`,
    groupCategories: "Categories",
    groupPairings: "Pairings",
    groupProducts: "Items",
    resultsCount: (count: number) => `${count} results`,
    resultsCountOne: "1 result",
  },
  promo: {
    alt: "Today's promotion",
  },
};

const ar: typeof en = {
  common: {
    close: "إغلاق",
    back: "العودة للرئيسية",
  },
  language: {
    name: "English",
    switchTo: "التبديل إلى الإنجليزية",
  },
  badge: {
    new: "جديد",
    top: "الأكثر طلباً",
    outOfStock: "غير متاح",
  },
  price: {
    from: "يبدأ من",
  },
  states: {
    loading: "جارِ تحميل المنيو…",
    errorTitle: "حدث خطأ ما",
    errorNetwork: "تحقق من اتصالك بالإنترنت وحاول مرة أخرى.",
    errorServer: "تعذّر تحميل المنيو الآن. حاول مرة أخرى.",
    retry: "إعادة المحاولة",
  },
  header: {
    searchLabel: "ابحث في المنيو",
    categoriesLabel: "تصفح الأقسام",
  },
  nav: {
    categoriesTitle: "الأقسام",
    signaturesLabel: "مميزاتنا",
    pairingsLabel: "العروض",
  },
  sections: {
    signatures: {
      title: "مميزاتنا",
      subtitle: "المشروبات اللي الكل بيرجعلها",
    },
    pairings: {
      title: "عروض متكاملة",
      subtitle: "أحلى مع بعض، وبسعر أوفر",
    },
    showAll: (name: string, count: number) => `عرض كل ${count} في ${name}`,
  },
  product: {
    oftenOrderedWith: "غالباً بيتطلب معاها",
    a11yOpen: (name: string) => `عرض ${name}`,
  },
  pairing: {
    save: (amount: string) => `وفّر ${amount}`,
  },
  search: {
    placeholder: "ابحث عن مشروبات، حلويات، عروض…",
    prompt: "ابدأ الكتابة للبحث في المنيو",
    noMatch: (query: string) => `لا توجد نتائج لـ"${query}"`,
    groupCategories: "الأقسام",
    groupPairings: "العروض",
    groupProducts: "المنتجات",
    resultsCount: (count: number) => `${count} نتيجة`,
    resultsCountOne: "نتيجة واحدة",
  },
  promo: {
    alt: "عرض اليوم",
  },
};

export const strings: Localized<typeof en> = { en, ar };
