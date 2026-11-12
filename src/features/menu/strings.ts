import type { Localized } from "@/shared/i18n";

export const config = {
  badges: {
    en: {
      top: "Bestseller",
      new: "New",
      outOfStock: "Out of stock",
    },
    ar: {
      top: "الأكثر مبيعًا",
      new: "جديد",
      outOfStock: "غير متوفر",
    },
  },

  sections: {
    en: {
      signatures: {
        id: "signatures",
        label: "Signatures",
      },
      pairings: {
        id: "pairings",
        label: "Pairings",
      },
    },
    ar: {
      signatures: {
        id: "signatures",
        label: "اختياراتنا المميزة",
      },
      pairings: {
        id: "pairings",
        label: "ثنائياتنا",
      },
    },
  },
};

function arabicItemsCount(count: number): string {
  if (count === 1) return "عنصر واحد";
  if (count === 2) return "عنصران";
  if (count <= 10) return `${count} عناصر`;
  return `${count} عنصرًا`;
}

const en = {
  page: {
    title: "Menu",
  },
  header: {
    back: "Back",
    search: "Search the menu",
    categories: "Browse categories",
    language: { name: "ع", lang: "ar" },
  },
  loading: {
    title: "Brewing the menu",
    description: "Just a moment while we get everything ready.",
  },
  errors: {
    network: {
      title: "Can't reach the menu",
      description: "Check your connection and try again.",
      retry: "Try again",
    },
    generic: {
      title: "Something went wrong",
      description: "We couldn't load the menu. Please try again.",
      retry: "Try again",
    },
  },
  signatures: {
    sub: "Our most loved picks",
  },
  pairings: {
    sub: "Better together, for less",
    savings: (amount: string) => `Save ${amount}`,
  },
  products: {
    showAll: (name: string, count: number) => `Show all ${name} (${count})`,
  },
  sheets: {
    close: "Close",
    categories: "Categories",
    categoriesDescription: "Jump to a section of the menu",
    itemDescription: "Item details and options",
    outOfStock: "Out of stock",
    oftenOrdered: "Often ordered with",
    openItem: (name: string) => `Open ${name}`,
    size: "Size",
    baristaWay: "The barista's way",
    baristaSub: "Made the way our barista recommends",
    addOns: "Add-ons",
    saveChip: (amount: string) => `Save ${amount}`,
  },
  search: {
    label: "Search the menu",
    placeholder: "Search drinks, food and offers",
    clear: "Clear search",
    close: "Close search",
    prompt: "Start typing to search the menu",
    noMatch: (query: string) => `No results for "${query}"`,
    itemsCount: (count: number) => `${count} ${count === 1 ? "item" : "items"}`,
    groupCategories: "Categories",
    groupOffers: "Offers",
    groupItems: "Items",
  },
};

const ar: typeof en = {
  page: {
    title: "القائمة",
  },
  header: {
    back: "رجوع",
    search: "ابحث في القائمة",
    categories: "تصفح الأقسام",
    language: { name: "En", lang: "en" },
  },
  loading: {
    title: "نجهّز القائمة",
    description: "لحظات ونكون جاهزين.",
  },
  errors: {
    network: {
      title: "تعذّر الوصول إلى القائمة",
      description: "تحقق من اتصالك بالإنترنت وحاول مرة أخرى.",
      retry: "حاول مرة أخرى",
    },
    generic: {
      title: "حدث خطأ ما",
      description: "تعذّر تحميل القائمة. حاول مرة أخرى.",
      retry: "حاول مرة أخرى",
    },
  },
  signatures: {
    sub: "الأكثر حبًا لدى ضيوفنا",
  },
  pairings: {
    sub: "أطيب معًا وبسعر أقل",
    savings: (amount) => `وفّر ${amount}`,
  },
  products: {
    showAll: (name, count) => `عرض كل ${name} (${count})`,
  },
  sheets: {
    close: "إغلاق",
    categories: "الأقسام",
    categoriesDescription: "انتقل إلى قسم من القائمة",
    itemDescription: "تفاصيل الصنف وخياراته",
    outOfStock: "غير متوفر",
    oftenOrdered: "يُطلب غالبًا مع",
    openItem: (name) => `افتح ${name}`,
    size: "الحجم",
    baristaWay: "طريقة الباريستا",
    baristaSub: "يُحضّر كما يوصي الباريستا",
    addOns: "إضافات",
    saveChip: (amount) => `وفّر ${amount}`,
  },
  search: {
    label: "ابحث في القائمة",
    placeholder: "ابحث عن مشروب أو طعام أو عرض",
    clear: "مسح البحث",
    close: "إغلاق البحث",
    prompt: "ابدأ الكتابة للبحث في القائمة",
    noMatch: (query) => `لا نتائج لـ "${query}"`,
    itemsCount: arabicItemsCount,
    groupCategories: "الأقسام",
    groupOffers: "العروض",
    groupItems: "الأصناف",
  },
};

export const strings: Localized<typeof en> = { en, ar };
